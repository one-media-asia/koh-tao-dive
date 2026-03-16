-- Emails table for admin assignment
CREATE TABLE IF NOT EXISTS emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  sender text NOT NULL,
  body text,
  assigned_to text, -- email of assigned user
  status text DEFAULT 'unread',
  created_at timestamptz DEFAULT now()
);

-- Example users table (if not already present)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text
);

-- Insert your team emails if not present
INSERT INTO users (email, name) VALUES
  ('contact@prodiving.asia', 'Contact'),
  ('bas@divinginasia.com', 'Bas')
ON CONFLICT (email) DO NOTHING;