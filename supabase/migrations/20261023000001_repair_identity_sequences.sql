-- Keep identity sequences ahead of imported/restored rows.
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT c.table_schema, c.table_name, c.column_name,
           pg_get_serial_sequence(format('%I.%I', c.table_schema, c.table_name), c.column_name) AS seq
    FROM information_schema.columns c
    WHERE c.table_schema='public' AND c.is_identity='YES'
  LOOP
    EXECUTE format(
      'SELECT setval(%L, COALESCE((SELECT max(%I) FROM %I.%I), 0) + 1, false)',
      r.seq, r.column_name, r.table_schema, r.table_name
    );
  END LOOP;
END $$;
