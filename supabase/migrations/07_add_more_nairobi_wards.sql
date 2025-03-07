WITH constituency_data AS (
  SELECT id, name, county_id
  FROM constituencies
  WHERE name IN ('Westlands', 'Dagoretti North', 'Roysambu')
  AND county_id = (SELECT id FROM counties WHERE name = 'Nairobi')
),
ward_data AS (
  SELECT 
    w.ward_name as name,
    w.ward_name as code,
    c.id as constituency_id
  FROM (VALUES
    ('Kitisuru', 'Westlands'),
    ('Parklands/Highridge', 'Westlands'),
    ('Karura', 'Westlands'),
    ('Kangemi', 'Westlands'),
    ('Mountain View', 'Westlands'),
    
    ('Kilimani', 'Dagoretti North'),
    ('Kawangware', 'Dagoretti North'),
    ('Gatina', 'Dagoretti North'),
    ('Kileleshwa', 'Dagoretti North'),
    ('Kabiro', 'Dagoretti North'),
    
    ('Roysambu', 'Roysambu'),
    ('Garden Estate', 'Roysambu'),
    ('Ridgeways', 'Roysambu'),
    ('Githurai', 'Roysambu'),
    ('Kahawa West', 'Roysambu')
  ) AS w(ward_name, constituency_name)
  JOIN constituency_data c ON c.name = w.constituency_name
)
INSERT INTO wards (name, code, constituency_id)
SELECT name, code, constituency_id
FROM ward_data
ON CONFLICT (name, constituency_id) 
DO UPDATE SET 
  code = EXCLUDED.code,
  updated_at = timezone('utc'::text, now());
