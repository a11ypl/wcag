MERGE INTO app_users u
USING (
  SELECT
    'admin@wlaczwizje.pl' AS email,
    'pbkdf2_sha256$210000$wlaczwizje_seed_salt_2026$7cf1346c7b408454af4a07d355a1670f0f34913cc02bef00a096691da491133c' AS password_hash,
    'Damian Zlobicki' AS full_name,
    'ADMIN' AS role_code,
    'Wlacz Wizje' AS company_name
  FROM dual
) s
ON (LOWER(u.email) = LOWER(s.email))
WHEN NOT MATCHED THEN
  INSERT (email, password_hash, full_name, role_code, company_name, is_active)
  VALUES (s.email, s.password_hash, s.full_name, s.role_code, s.company_name, 1);

MERGE INTO app_users u
USING (
  SELECT
    'system@partnerhub.local' AS email,
    'pbkdf2_sha256$210000$wlaczwizje_seed_salt_2026$7cf1346c7b408454af4a07d355a1670f0f34913cc02bef00a096691da491133c' AS password_hash,
    'System User' AS full_name,
    'ADMIN' AS role_code,
    'Wlacz Wizje' AS company_name
  FROM dual
) s
ON (LOWER(u.email) = LOWER(s.email))
WHEN NOT MATCHED THEN
  INSERT (email, password_hash, full_name, role_code, company_name, is_active)
  VALUES (s.email, s.password_hash, s.full_name, s.role_code, s.company_name, 1);
