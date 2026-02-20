/*
  # Create Astro Calculations Table

  1. New Tables
    - `astro_calculations`
      - `id` (uuid, primary key) - Unique identifier for each calculation
      - `birth_date` (date) - User's birth date
      - `birth_time` (time) - User's birth time
      - `birth_location` (text) - User's birth location name
      - `latitude` (numeric) - Birth location latitude
      - `longitude` (numeric) - Birth location longitude
      - `planetary_lines` (jsonb) - Calculated planetary lines data
      - `created_at` (timestamptz) - When the calculation was created

  2. Security
    - Enable RLS on `astro_calculations` table
    - Add policy for anyone to insert their calculations (public app)
    - Add policy for users to read all calculations (optional, for public gallery)

  3. Indexes
    - Add index on created_at for efficient querying
*/

CREATE TABLE IF NOT EXISTS astro_calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  birth_date date NOT NULL,
  birth_time time NOT NULL,
  birth_location text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  planetary_lines jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE astro_calculations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert calculations"
  ON astro_calculations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view calculations"
  ON astro_calculations
  FOR SELECT
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_astro_calculations_created_at 
  ON astro_calculations(created_at DESC);
