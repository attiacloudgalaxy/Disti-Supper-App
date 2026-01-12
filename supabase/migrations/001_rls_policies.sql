-- DistributorHub Row-Level Security (RLS) Policies
-- Apply these to your Supabase project for data access control
-- Reference: https://supabase.com/docs/guides/auth/row-level-security

-- =====================================================
-- AUDIT LOGS TABLE (Create if not exists)
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    action TEXT NOT NULL,
    details JSONB,
    severity TEXT DEFAULT 'info',
    user_id UUID REFERENCES auth.users(id),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON audit_logs(event_type);

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PARTNERS TABLE POLICIES
-- =====================================================

-- Allow authenticated users to view all partners
CREATE POLICY "partners_select_authenticated" ON partners
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to insert partners
CREATE POLICY "partners_insert_authenticated" ON partners
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow users to update partners (could restrict to creator/admin)
CREATE POLICY "partners_update_authenticated" ON partners
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Only admins can delete partners
CREATE POLICY "partners_delete_admin" ON partners
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.uid() = id
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- =====================================================
-- PRODUCTS TABLE POLICIES
-- =====================================================

-- Allow authenticated users to view all products
CREATE POLICY "products_select_authenticated" ON products
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to manage products
CREATE POLICY "products_insert_authenticated" ON products
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "products_update_authenticated" ON products
    FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "products_delete_admin" ON products
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.uid() = id
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- =====================================================
-- DEALS TABLE POLICIES
-- =====================================================

-- Allow authenticated users to view all deals
CREATE POLICY "deals_select_authenticated" ON deals
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to create deals
CREATE POLICY "deals_insert_authenticated" ON deals
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow owner or admin to update deals
CREATE POLICY "deals_update_owner_or_admin" ON deals
    FOR UPDATE
    TO authenticated
    USING (
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.uid() = id
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Only owner or admin can delete deals
CREATE POLICY "deals_delete_owner_or_admin" ON deals
    FOR DELETE
    TO authenticated
    USING (
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.uid() = id
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- =====================================================
-- QUOTES TABLE POLICIES
-- =====================================================

-- Allow authenticated users to view quotes
CREATE POLICY "quotes_select_authenticated" ON quotes
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "quotes_insert_authenticated" ON quotes
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "quotes_update_authenticated" ON quotes
    FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "quotes_delete_admin" ON quotes
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.uid() = id
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- =====================================================
-- AUDIT LOGS POLICIES
-- =====================================================

-- Anyone authenticated can insert audit logs
CREATE POLICY "audit_logs_insert_authenticated" ON audit_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Only admins can view audit logs
CREATE POLICY "audit_logs_select_admin" ON audit_logs
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.uid() = id
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- No one can update or delete audit logs (immutable)
-- (No UPDATE or DELETE policies = denied by default)
