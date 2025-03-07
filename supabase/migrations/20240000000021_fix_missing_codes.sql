-- Drop any existing unique constraints that might conflict
ALTER TABLE counties DROP CONSTRAINT IF EXISTS counties_code_key;
ALTER TABLE constituencies DROP CONSTRAINT IF EXISTS constituencies_code_key;
ALTER TABLE wards DROP CONSTRAINT IF EXISTS wards_code_key;

-- Add code columns if they don't exist
ALTER TABLE counties 
ADD COLUMN IF NOT EXISTS code TEXT;

ALTER TABLE constituencies 
ADD COLUMN IF NOT EXISTS code TEXT;

ALTER TABLE wards
ADD COLUMN IF NOT EXISTS code TEXT;

-- Update existing counties with codes
UPDATE counties 
SET code = CASE 
  WHEN name = 'Nairobi' THEN 'NRB'
  WHEN name = 'Kiambu' THEN 'KBU'
  WHEN name = 'Nakuru' THEN 'NKR'
  WHEN name = 'Mombasa' THEN 'MSA'
  WHEN name = 'Kisumu' THEN 'KSM'
  ELSE UPPER(SUBSTRING(name, 1, 3))
END
WHERE code IS NULL;

-- Update existing constituencies with codes
UPDATE constituencies c
SET code = CONCAT(
  UPPER(SUBSTRING(c.name, 1, 3)), 
  '-', 
  (SELECT code FROM counties WHERE id = c.county_id)
)
WHERE code IS NULL;

-- Update existing wards with codes
UPDATE wards w
SET code = CONCAT(
  UPPER(SUBSTRING(w.name, 1, 3)),
  '-',
  (SELECT code FROM constituencies WHERE id = w.constituency_id)
)
WHERE code IS NULL;

-- Add unique constraints back
ALTER TABLE counties ADD CONSTRAINT counties_code_key UNIQUE (code);
ALTER TABLE constituencies ADD CONSTRAINT constituencies_code_key UNIQUE (code);
ALTER TABLE wards ADD CONSTRAINT wards_code_key UNIQUE (code);

-- Make code columns NOT NULL
ALTER TABLE counties ALTER COLUMN code SET NOT NULL;
ALTER TABLE constituencies ALTER COLUMN code SET NOT NULL;
ALTER TABLE wards ALTER COLUMN code SET NOT NULL;
