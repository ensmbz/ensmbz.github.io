-- The shared bucket must allow 50 MiB videos. The site enforces a 20 MiB photo cap.
update storage.buckets
set file_size_limit = 52428800,
    allowed_mime_types = array['image/*', 'video/*']
where id = 'zayed-photos';
