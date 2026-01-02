-- Fix RLS Policies for Orders and Order Items
-- Run this in your Supabase SQL Editor if you're getting permission errors

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;
DROP POLICY IF EXISTS "Anyone can insert order items" ON order_items;
DROP POLICY IF EXISTS "Anyone can view orders" ON orders;
DROP POLICY IF EXISTS "Anyone can view order items" ON order_items;

-- Create new policies with explicit permissions
CREATE POLICY "Allow anonymous insert to orders"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated select orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow anonymous insert to order_items"
  ON order_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated select order_items"
  ON order_items FOR SELECT
  TO authenticated
  USING (true);
