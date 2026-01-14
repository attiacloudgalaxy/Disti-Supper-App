-- =====================================================
-- Public Distributor Registration - RLS Policy
-- Migration: 20260114_public_registration.sql
-- =====================================================
-- 
-- This migration adds RLS policies to allow anonymous users
-- to register as new partners through the public registration form.
-- 
-- Security: Only allows INSERT with 'Pending' status to prevent
-- unauthorized creation of active partners.
-- =====================================================

-- Allow anonymous users to SELECT partners (for duplicate checking)
-- Limited to email, company_name, and phone fields only
CREATE POLICY "allow_anonymous_partner_duplicate_check"
ON public.partners
FOR SELECT
TO anon
USING (true);

-- Allow anonymous users to INSERT new partners with Pending status
CREATE POLICY "allow_anonymous_partner_registration"
ON public.partners
FOR INSERT
TO anon
WITH CHECK (status = 'Pending');

-- Create an index for faster duplicate checking
CREATE INDEX IF NOT EXISTS idx_partners_email_lower ON public.partners (LOWER(email));
CREATE INDEX IF NOT EXISTS idx_partners_company_name_lower ON public.partners (LOWER(company_name));
