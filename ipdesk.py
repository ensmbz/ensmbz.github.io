#!/usr/bin/env python3
import html, ipaddress, json, pathlib, subprocess, os, secrets, hmac
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs

LOG = pathlib.Path('/var/log/caddy/access.log')
BANS = pathlib.Path('/etc/caddy/banned-ips.txt')
SNIP = pathlib.Path('/etc/caddy/banned.caddy')
PASSWORD = os.environ.get('IPDESK_PASSWORD', '')
SESSION = secrets.token_urlsafe(32)

def rows():
    counts = {}
    latest = []
    if LOG.exists():
        for line in LOG.read_text(errors='ignore').splitlines()[-1000:]:
            try:
                item = json.loads(line)
                req = item.get('request', {})
                headers = req.get('headers', {}) or {}
                def forwarded(name):
                    value = next((v for k, v in headers.items() if k.lower() == name), '')
                    return value[0] if isinstance(value, list) and value else value
                ip = forwarded('cf-connecting-ip') or forwarded('x-forwarded-for') or req.get('client_ip') or req.get('remote_ip', '')
                if ip:
                    counts[ip] = counts.get(ip, 0) + 1
                    latest.append((ip, req.get('method',''), req.get('uri',''), item.get('status','')))
            except Exception:
                pass
    return sorted(counts.items(), key=lambda x: (-x[1], x[0])), latest[-30:][::-1]

def banned():
    return [x.strip() for x in BANS.read_text().splitlines() if x.strip()] if BANS.exists() else []

def reload_bans():
    ips = banned()
    lines = []
    for i, ip in enumerate(ips):
        lines += [f'@ban{i} remote_ip {ip}', f'respond @ban{i} 403']
    SNIP.write_text('\n'.join(lines) + ('\n' if lines else ''))
    subprocess.run(['systemctl', 'reload', 'caddy'], check=False)

class Handler(BaseHTTPRequestHandler):
    def send_html(self, body, code=200):
        raw = body.encode(); self.send_response(code); self.send_header('Content-Type','text/html; charset=utf-8'); self.send_header('Content-Length', str(len(raw))); self.end_headers(); self.wfile.write(raw)
    def authorized(self):
        return hmac.compare_digest(self.headers.get('Cookie', ''), f'ipdesk={SESSION}')
    def login(self):
        self.send_html('<!doctype html><meta name="viewport" content="width=device-width"><title>IP Desk Login</title><style>body{font:18px system-ui;max-width:420px;margin:80px auto;padding:20px;background:#111;color:#eee}input,button{font:inherit;padding:12px;margin-top:12px;width:100%;box-sizing:border-box}button{background:#f04d35;color:#fff;border:0}</style><h1>IP Desk</h1><form method="post"><input type="password" name="password" placeholder="Owner password" autofocus required><button>OPEN IP DESK</button></form>')
    def do_GET(self):
        if not self.authorized(): return self.login()
        counts, latest = rows(); bans = banned()
        table = ''.join(f'<tr><td>{html.escape(ip)}</td><td>{n}</td><td><form method="post"><input type="hidden" name="ip" value="{html.escape(ip)}"><button>BAN</button></form></td></tr>' for ip,n in counts)
        recent = ''.join(f'<tr><td>{html.escape(ip)}</td><td>{html.escape(method)}</td><td>{html.escape(uri)}</td><td>{status}</td></tr>' for ip,method,uri,status in latest)
        bl = ''.join(f'<li>{html.escape(ip)} <form method="post" style="display:inline"><input type="hidden" name="unban" value="{html.escape(ip)}"><button>UNBAN</button></form></li>' for ip in bans) or '<li>None</li>'
        self.send_html(f'''<!doctype html><meta name="viewport" content="width=device-width"><title>ENS MBZ IP Desk</title><style>body{{font:16px system-ui;max-width:1000px;margin:32px auto;padding:0 16px;background:#111;color:#eee}}table{{width:100%;border-collapse:collapse;margin:12px 0 28px}}td,th{{padding:8px;border-bottom:1px solid #444;text-align:left}}button{{background:#f04d35;color:#fff;border:0;padding:7px 10px;border-radius:4px}}h1{{color:#ff5b43}}a{{color:#8bc4ff}}</style><h1>IP DESK</h1><p>Private Tailscale monitor. Refresh to update.</p><h2>Most frequent IPs</h2><table><tr><th>IP</th><th>Requests</th><th></th></tr>{table or '<tr><td colspan=3>No requests yet</td></tr>'}</table><h2>Latest requests</h2><table><tr><th>IP</th><th>Method</th><th>Path</th><th>Status</th></tr>{recent}</table><h2>Banned IPs</h2><ul>{bl}</ul>''')
    def do_POST(self):
        data = parse_qs(self.rfile.read(int(self.headers.get('content-length','0'))).decode())
        if 'password' in data:
            if not hmac.compare_digest(data.get('password',[''])[0], PASSWORD): return self.send_html('Wrong password', 401)
            self.send_response(303); self.send_header('Set-Cookie', f'ipdesk={SESSION}; HttpOnly; Secure; SameSite=None; Path=/'); self.send_header('Location','/ipdesk/'); self.end_headers(); return
        if not self.authorized(): return self.login()
        raw = (data.get('ip') or data.get('unban') or [''])[0]
        try: ip = str(ipaddress.ip_address(raw))
        except ValueError: return self.send_html('Invalid IP', 400)
        current = banned()
        if 'ip' in data and ip not in current: current.append(ip)
        if 'unban' in data: current = [x for x in current if x != ip]
        BANS.write_text('\n'.join(current) + ('\n' if current else '')); reload_bans()
        self.send_response(303); self.send_header('Location','/ipdesk/'); self.end_headers()

ThreadingHTTPServer(('127.0.0.1', 8090), Handler).serve_forever()
