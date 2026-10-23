#!/usr/bin/env python3
import html, ipaddress, json, pathlib, subprocess, os, secrets, hmac, time, threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs

LOG = pathlib.Path('/var/log/caddy/access.log')
BANS = pathlib.Path('/etc/caddy/banned-ips.json')
SNIP = pathlib.Path('/etc/caddy/banned.caddy')
APPEALS = pathlib.Path('/var/lib/ipdesk/appeals.json')
PASSWORD = os.environ.get('IPDESK_PASSWORD', '')
SESSION = secrets.token_urlsafe(32)
LOCK = threading.Lock()

def load_json(path, default):
    try: return json.loads(path.read_text())
    except Exception: return default

def save_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2))

def request_ip(req):
    headers = req.get('headers', {}) or {}
    def forwarded(name):
        value = next((v for k, v in headers.items() if k.lower() == name), '')
        return value[0] if isinstance(value, list) and value else value
    return forwarded('cf-connecting-ip') or forwarded('x-forwarded-for') or req.get('client_ip') or req.get('remote_ip', '')

def rows():
    latest = []
    if LOG.exists():
        for line in LOG.read_text(errors='ignore').splitlines()[-2000:]:
            try:
                item = json.loads(line); req = item.get('request', {}); ip = request_ip(req)
                if ip:
                    latest.append((item.get('ts',''), ip, req.get('method',''), req.get('uri',''), item.get('status','')))
            except Exception: pass
    return latest[-60:][::-1]

def action_for(uri, method):
    path = uri.split('?', 1)[0]
    if path.startswith('/auth/'): return 'AUTHENTICATION'
    if path.startswith('/functions/'): return 'FUNCTION CALL'
    if path.startswith('/storage/'): return 'MEDIA ACCESS'
    if method == 'POST': return 'FORM SUBMIT'
    if method in ('PUT', 'PATCH', 'DELETE'): return 'DATA CHANGE'
    return 'PAGE VIEW'

def active_bans():
    now = int(time.time()); current = load_json(BANS, {})
    active = {ip: data for ip, data in current.items() if not data.get('expires_at') or data['expires_at'] > now}
    if active != current: save_json(BANS, active)
    return active

def reload_bans():
    with LOCK:
        current = active_bans(); lines = []
        for i, ip in enumerate(current):
            matcher = f'@ban{i} {{\n    header CF-Connecting-IP {ip}\n    not path /ban/* /ipdesk/*\n}}'
            lines += [matcher, f'redir @ban{i} /ban/ 302']
        SNIP.write_text('\n'.join(lines) + '\n' if lines else '# no active bans\n')
        subprocess.run(['systemctl', 'reload', 'caddy'], check=False)

def clean_loop():
    while True:
        reload_bans(); time.sleep(30)

def remaining(data):
    end = data.get('expires_at')
    if not end: return 'Permanent'
    seconds = max(0, end - int(time.time()))
    if seconds < 3600: return f'{max(1, (seconds + 59)//60)} min'
    if seconds < 86400: return f'{(seconds + 3599)//3600} hr'
    return f'{(seconds + 86399)//86400} day'

STYLE = '''<style>body{font:16px system-ui;max-width:1100px;margin:32px auto;padding:0 16px;background:#111;color:#eee}table{width:100%;border-collapse:collapse;margin:12px 0 28px}td,th{padding:8px;border-bottom:1px solid #444;text-align:left}button,select,textarea,input{font:inherit;padding:8px;border-radius:4px}button{background:#f04d35;color:#fff;border:0}h1{color:#ff5b43}a{color:#8bc4ff}.card{background:#1c1c1c;padding:16px;margin:12px 0;border-left:4px solid #f04d35}.inline{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.muted{color:#aaa}</style>'''

class Handler(BaseHTTPRequestHandler):
    def send_html(self, body, code=200):
        raw = body.encode(); self.send_response(code); self.send_header('Content-Type','text/html; charset=utf-8'); self.send_header('Content-Length', str(len(raw))); self.end_headers(); self.wfile.write(raw)
    def redirect(self, where='/ipdesk/'):
        self.send_response(303); self.send_header('Location', where); self.end_headers()
    def authorized(self): return hmac.compare_digest(self.headers.get('Cookie', ''), f'ipdesk={SESSION}')
    def visitor_ip(self):
        raw = self.headers.get('CF-Connecting-IP') or self.headers.get('X-Forwarded-For', '').split(',')[0].strip() or self.client_address[0]
        try: return str(ipaddress.ip_address(raw))
        except ValueError: return self.client_address[0]
    def login(self):
        self.send_html(f'<!doctype html><meta name="viewport" content="width=device-width"><title>IP Desk Login</title>{STYLE}<h1>IP Desk</h1><form method="post"><input type="password" name="password" placeholder="Owner password" autofocus required><button>OPEN IP DESK</button></form>')
    def ban_page(self):
        ip = self.visitor_ip(); data = active_bans().get(ip)
        if not data: return self.redirect('/')
        self.send_html(f'''<!doctype html><meta name="viewport" content="width=device-width"><title>Access suspended</title>{STYLE}<div class="card"><h1>ACCESS SUSPENDED</h1><p>Your IP <b>{html.escape(ip)}</b> is blocked from the ENS MBZ museum.</p><p>Time remaining: <b>{remaining(data)}</b></p><p class="muted">If this was a mistake, send one appeal below.</p><form method="post" action="/ban/appeal"><textarea name="appeal" maxlength="1000" rows="5" required placeholder="Explain why the ban should be removed" style="width:100%;box-sizing:border-box"></textarea><button>SEND APPEAL</button></form></div>''', 403)
    def do_GET(self):
        if self.path.startswith('/ban'): return self.ban_page()
        if not self.authorized(): return self.login()
        latest = rows(); bans = active_bans(); appeals = load_json(APPEALS, [])
        options = '<option value="300">5 min</option><option value="1800">30 min</option><option value="3600">1 hour</option><option value="86400">1 day</option><option value="604800">7 days</option><option value="0">Permanent</option>'
        recent = ''.join(f'<tr><td><b>{html.escape(ip)}</b></td><td>{html.escape(ts.replace("T", " ").replace("Z", " UTC"))}</td><td>{action_for(uri, method)}</td><td><code>{html.escape(method)} {html.escape(uri)}</code></td><td>{status}</td><td><form method="post" class="inline"><input type="hidden" name="ip" value="{html.escape(ip)}"><select name="duration">{options}</select><button>BAN</button></form></td></tr>' for ts,ip,method,uri,status in latest)
        bl = ''.join(f'<tr><td>{html.escape(ip)}</td><td>{remaining(data)}</td><td><form method="post"><input type="hidden" name="unban" value="{html.escape(ip)}"><button>UNBAN</button></form></td></tr>' for ip,data in bans.items()) or '<tr><td colspan="3">None</td></tr>'
        ap = ''.join(f'''<div class="card"><b>{html.escape(a.get('ip',''))}</b><p>{html.escape(a.get('message',''))}</p><p class="muted">{html.escape(a.get('time',''))}</p><form method="post" class="inline"><input type="hidden" name="appeal_ip" value="{html.escape(a.get('ip',''))}"><button name="appeal_action" value="unban">UNBAN + ACCEPT</button><button name="appeal_action" value="dismiss">DISMISS</button></form></div>''' for a in appeals) or '<p>No appeals.</p>'
        self.send_html(f'''<!doctype html><meta name="viewport" content="width=device-width"><title>ENS MBZ IP Desk</title>{STYLE}<h1>IP DESK</h1><p>Most recent visitor activity, with the real Cloudflare IP and what the visitor tried to do.</p><h2>Banned IPs</h2><table><tr><th>IP</th><th>Remaining</th><th></th></tr>{bl}</table><h2>Ban appeals</h2>{ap}<h2>Most recent activity</h2><table><tr><th>IP</th><th>Time</th><th>Action</th><th>Request</th><th>Status</th><th></th></tr>{recent or '<tr><td colspan="6">No activity yet</td></tr>'}</table>''')
    def do_POST(self):
        data = parse_qs(self.rfile.read(int(self.headers.get('content-length','0'))).decode())
        if self.path.startswith('/ban/appeal'):
            ip = self.visitor_ip(); message = data.get('appeal',[''])[0].strip()
            if not message: return self.send_html('Appeal is required', 400)
            appeals = load_json(APPEALS, []); appeals.append({'ip': ip, 'message': message, 'time': time.strftime('%Y-%m-%d %H:%M UTC', time.gmtime())}); save_json(APPEALS, appeals[-200:])
            return self.send_html(f'<!doctype html><meta name="viewport" content="width=device-width">{STYLE}<div class="card"><h1>APPEAL SENT</h1><p>The owner will review it.</p></div>', 202)
        if 'password' in data:
            if not hmac.compare_digest(data.get('password',[''])[0], PASSWORD): return self.send_html('Wrong password', 401)
            self.send_response(303); self.send_header('Set-Cookie', f'ipdesk={SESSION}; HttpOnly; Secure; SameSite=None; Path=/'); self.send_header('Location','/ipdesk/'); self.end_headers(); return
        if not self.authorized(): return self.login()
        if 'appeal_action' in data:
            ip = data.get('appeal_ip',[''])[0]; action = data.get('appeal_action',[''])[0]
            appeals = [a for a in load_json(APPEALS, []) if a.get('ip') != ip]; save_json(APPEALS, appeals)
            if action == 'unban': current = active_bans(); current.pop(ip, None); save_json(BANS, current); reload_bans()
            return self.redirect()
        raw = (data.get('ip') or data.get('unban') or [''])[0]
        try: ip = str(ipaddress.ip_address(raw))
        except ValueError: return self.send_html('Invalid IP', 400)
        current = active_bans()
        if 'ip' in data:
            duration = max(0, int(data.get('duration',['300'])[0])); current[ip] = {'created_at': int(time.time()), 'expires_at': int(time.time()) + duration if duration else 0}
        if 'unban' in data: current.pop(ip, None)
        save_json(BANS, current); reload_bans(); return self.redirect()

threading.Thread(target=clean_loop, daemon=True).start()
ThreadingHTTPServer(('127.0.0.1', 8090), Handler).serve_forever()
