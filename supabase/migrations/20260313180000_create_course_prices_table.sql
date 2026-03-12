-- Migration: Create course_prices table for admin pricing UI
CREATE TABLE IF NOT EXISTS course_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course text NOT NULL,
  price_thb text NOT NULL,
  price_usd text NOT NULL,
  price_eur text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Optional: Insert example courses
INSERT INTO course_prices (course, price_thb, price_usd, price_eur)
VALUES
  ('Open Water', '11000', '320', '290'),
  ('Advanced', '9500', '275', '250'),
  ('Rescue', '10000', '290', '265'),
  ('Divemaster', '41000', '1190', '1090'),
  ('Instructor', '68900', '1710', '1560'),
  ('Scuba Review', '2500', '72', '66'),
  ('Discover Scuba', '2500', '72', '66'),
  ('Discover Scuba Deluxe', '5000', '144', '132'),
  ('EFR', '3500', '130', '120');
