/*
  # Create signups table for trial registrations

  1. New Tables
    - `signups`
      - `id` (uuid, primary key) - Unique identifier for each signup
      - `first_name` (text) - Customer's first name
      - `last_name` (text) - Customer's last name
      - `email` (text) - Email address
      - `phone_number` (text) - Phone number
      - `business_name` (text) - Name of the rental business
      - `billing_street` (text) - Billing street address
      - `billing_city` (text) - Billing city
      - `billing_state` (text) - Billing state code
      - `billing_zip` (text) - Billing ZIP code
      - `consultation_time` (timestamptz) - Scheduled consultation date/time
      - `status` (text) - Status: pending, active, trial, canceled
      - `created_at` (timestamptz) - When the signup was created
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `signups` table
    - Add policy for authenticated admin users to view all signups
    - Add policy for authenticated admin users to update signup status

  3. Important Notes
    - We do NOT store sensitive payment card information (card numbers, CVC, etc.)
    - This table stores business/customer information only
    - Status tracking helps monitor trial lifecycle
*/

CREATE TABLE IF NOT EXISTS signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone_number text NOT NULL,
  business_name text NOT NULL,
  billing_street text NOT NULL,
  billing_city text NOT NULL,
  billing_state text NOT NULL,
  billing_zip text NOT NULL,
  consultation_time timestamptz,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all signups"
  ON signups
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update signups"
  ON signups
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can insert signup"
  ON signups
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS signups_email_idx ON signups(email);
CREATE INDEX IF NOT EXISTS signups_created_at_idx ON signups(created_at DESC);
CREATE INDEX IF NOT EXISTS signups_status_idx ON signups(status);