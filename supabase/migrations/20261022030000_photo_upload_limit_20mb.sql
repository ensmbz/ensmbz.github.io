-- Allow uploads without the old size caps.
update storage.buckets
set file_size_limit = null,
    allowed_mime_types = array['image/*', 'video/*']
where id = 'zayed-photos';
