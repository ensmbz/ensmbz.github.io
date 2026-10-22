-- Allow photos up to 20 MiB in the shared media bucket.
update storage.buckets
set file_size_limit = 20971520
where id = 'zayed-photos';
