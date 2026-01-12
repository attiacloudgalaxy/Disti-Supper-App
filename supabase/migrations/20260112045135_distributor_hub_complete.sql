-- =====================================================
-- DistributorHub Complete Database Schema
-- Migration: 20260112045135_distributor_hub_complete.sql
-- =====================================================

-- =====================================================
-- 1. CUSTOM TYPES
-- =====================================================

CREATE TYPE public.user_role AS ENUM ('admin', 'partner', 'manager', 'staff');
CREATE TYPE public.partner_tier AS ENUM ('Platinum', 'Gold', 'Silver', 'Bronze');
CREATE TYPE public.partner_status AS ENUM ('Active', 'Inactive', 'Pending', 'Suspended');
CREATE TYPE public.deal_stage AS ENUM ('prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost');
CREATE TYPE public.compliance_status AS ENUM ('compliant', 'in-progress', 'overdue', 'pending', 'violation');
CREATE TYPE public.compliance_priority AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE public.product_category AS ENUM ('Servers & Storage', 'Networking Equipment', 'Software Licenses', 'Security Solutions', 'Cloud Services');
CREATE TYPE public.quote_status AS ENUM ('draft', 'sent', 'accepted', 'rejected', 'expired');

-- =====================================================
-- 2. CORE TABLES
-- =====================================================

-- User Profiles (intermediary for auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'staff'::public.user_role,
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Partners
CREATE TABLE public.partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id TEXT NOT NULL UNIQUE,
    company_name TEXT NOT NULL,
    logo TEXT,
    logo_alt TEXT,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    website TEXT,
    tier public.partner_tier DEFAULT 'Bronze'::public.partner_tier,
    region TEXT,
    territory TEXT,
    address TEXT,
    performance_score INTEGER DEFAULT 0,
    revenue DECIMAL(12, 2) DEFAULT 0,
    certifications INTEGER DEFAULT 0,
    active_deal_count INTEGER DEFAULT 0,
    status public.partner_status DEFAULT 'Active'::public.partner_status,
    member_since DATE DEFAULT CURRENT_DATE,
    last_activity DATE DEFAULT CURRENT_DATE,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Partner Certifications
CREATE TABLE public.partner_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID REFERENCES public.partners(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    issue_date DATE NOT NULL,
    status TEXT DEFAULT 'Valid',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Deals
CREATE TABLE public.deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    value DECIMAL(12, 2) NOT NULL,
    stage public.deal_stage DEFAULT 'prospecting'::public.deal_stage,
    partner_id UUID REFERENCES public.partners(id) ON DELETE SET NULL,
    probability INTEGER DEFAULT 0,
    close_date DATE,
    description TEXT,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Products/Inventory
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    manufacturer TEXT NOT NULL,
    category public.product_category NOT NULL,
    available INTEGER DEFAULT 0,
    allocated INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 10,
    location TEXT,
    partner_price DECIMAL(10, 2) DEFAULT 0,
    msrp DECIMAL(10, 2) DEFAULT 0,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Compliance Requirements
CREATE TABLE public.compliance_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requirement TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    responsible TEXT NOT NULL,
    due_date DATE NOT NULL,
    priority public.compliance_priority DEFAULT 'medium'::public.compliance_priority,
    status public.compliance_status DEFAULT 'pending'::public.compliance_status,
    progress INTEGER DEFAULT 0,
    department TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Quotes
CREATE TABLE public.quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_number TEXT NOT NULL UNIQUE,
    partner_id UUID REFERENCES public.partners(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    subtotal DECIMAL(12, 2) DEFAULT 0,
    discount_percent DECIMAL(5, 2) DEFAULT 0,
    discount_amount DECIMAL(12, 2) DEFAULT 0,
    tax_amount DECIMAL(12, 2) DEFAULT 0,
    total DECIMAL(12, 2) DEFAULT 0,
    payment_terms TEXT DEFAULT 'net-30',
    delivery_method TEXT DEFAULT 'standard',
    include_warranty BOOLEAN DEFAULT true,
    include_support BOOLEAN DEFAULT false,
    validity_days INTEGER DEFAULT 30,
    status public.quote_status DEFAULT 'draft'::public.quote_status,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Quote Items
CREATE TABLE public.quote_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id UUID REFERENCES public.quotes(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Activity Feed
CREATE TABLE public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    description TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. INDEXES
-- =====================================================

CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_partners_partner_id ON public.partners(partner_id);
CREATE INDEX idx_partners_status ON public.partners(status);
CREATE INDEX idx_partners_tier ON public.partners(tier);
CREATE INDEX idx_deals_partner_id ON public.deals(partner_id);
CREATE INDEX idx_deals_stage ON public.deals(stage);
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_quotes_partner_id ON public.quotes(partner_id);
CREATE INDEX idx_quotes_status ON public.quotes(status);
CREATE INDEX idx_quote_items_quote_id ON public.quote_items(quote_id);
CREATE INDEX idx_activities_user_id ON public.activities(user_id);
CREATE INDEX idx_compliance_status ON public.compliance_requirements(status);

-- =====================================================
-- 4. FUNCTIONS
-- =====================================================

-- Trigger function to create user profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'staff'::public.user_role),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    );
    RETURN NEW;
END;
$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- =====================================================
-- 5. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. RLS POLICIES
-- =====================================================

-- User Profiles Policies
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "authenticated_users_view_all_profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (true);

-- Partners Policies
CREATE POLICY "authenticated_users_view_partners"
ON public.partners
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_users_manage_partners"
ON public.partners
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Partner Certifications Policies
CREATE POLICY "authenticated_users_view_certifications"
ON public.partner_certifications
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_users_manage_certifications"
ON public.partner_certifications
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Deals Policies
CREATE POLICY "authenticated_users_view_deals"
ON public.deals
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_users_manage_deals"
ON public.deals
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Products Policies
CREATE POLICY "authenticated_users_view_products"
ON public.products
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_users_manage_products"
ON public.products
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Compliance Policies
CREATE POLICY "authenticated_users_view_compliance"
ON public.compliance_requirements
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_users_manage_compliance"
ON public.compliance_requirements
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Quotes Policies
CREATE POLICY "authenticated_users_view_quotes"
ON public.quotes
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_users_manage_quotes"
ON public.quotes
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Quote Items Policies
CREATE POLICY "authenticated_users_view_quote_items"
ON public.quote_items
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_users_manage_quote_items"
ON public.quote_items
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Activities Policies
CREATE POLICY "users_view_own_activities"
ON public.activities
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "users_create_own_activities"
ON public.activities
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- =====================================================
-- 7. TRIGGERS
-- =====================================================

-- Trigger to create user profile on auth user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Triggers to update updated_at timestamp
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partners_updated_at
    BEFORE UPDATE ON public.partners
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_deals_updated_at
    BEFORE UPDATE ON public.deals
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_compliance_updated_at
    BEFORE UPDATE ON public.compliance_requirements
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at
    BEFORE UPDATE ON public.quotes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 8. MOCK DATA
-- =====================================================

DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    partner_uuid UUID := gen_random_uuid();
    partner1_id UUID := gen_random_uuid();
    partner2_id UUID := gen_random_uuid();
    partner3_id UUID := gen_random_uuid();
    deal1_id UUID := gen_random_uuid();
    deal2_id UUID := gen_random_uuid();
    product1_id UUID := gen_random_uuid();
    product2_id UUID := gen_random_uuid();
    product3_id UUID := gen_random_uuid();
    quote1_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users (trigger creates user_profiles automatically)
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@distributorhub.com', crypt('Admin@2026', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (partner_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'partner@techcorp.com', crypt('Partner@2026', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Partner User", "role": "partner"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create Partners
    INSERT INTO public.partners (id, partner_id, company_name, logo, logo_alt, contact_name, email, phone, website, tier, region, territory, address, performance_score, revenue, certifications, active_deal_count, status, member_since, last_activity, created_by)
    VALUES
        (partner1_id, 'PTR-2024-001', 'TechCorp Solutions', 'https://img.rocket.new/generatedImages/rocket_gen_img_17b4dce52-1764654560254.png', 'TechCorp Solutions company logo with blue and white corporate branding', 'Michael Chen', 'michael.chen@techcorp.com', '+1 (555) 123-4567', 'www.techcorp.com', 'Platinum', 'North America', 'West Coast', '123 Tech Street, San Francisco, CA 94105', 94, 1250000, 12, 45, 'Active', '2022-01-15', '2026-01-11', admin_uuid),
        (partner2_id, 'PTR-2024-002', 'GlobalTech Partners', 'https://img.rocket.new/generatedImages/rocket_gen_img_173f325e8-1768193356677.png', 'GlobalTech Partners modern logo design with green technology theme', 'Sarah Johnson', 'sarah.j@globaltech.com', '+1 (555) 234-5678', 'www.globaltech.com', 'Gold', 'Europe', 'UK & Ireland', '456 Innovation Ave, London, UK', 88, 980000, 9, 38, 'Active', '2022-03-22', '2026-01-10', admin_uuid),
        (partner3_id, 'PTR-2024-003', 'Innovate Systems', 'https://img.rocket.new/generatedImages/rocket_gen_img_1a8b3c4d5-1768193356678.png', 'Innovate Systems logo with orange innovation symbol', 'David Martinez', 'david.m@innovate.com', '+1 (555) 345-6789', 'www.innovate.com', 'Silver', 'North America', 'East Coast', '789 Innovation Blvd, New York, NY 10001', 82, 750000, 7, 28, 'Active', '2022-06-10', '2026-01-09', admin_uuid);

    -- Create Partner Certifications
    INSERT INTO public.partner_certifications (partner_id, name, issue_date, status)
    VALUES
        (partner1_id, 'Advanced Sales Certification', '2025-03-15', 'Valid'),
        (partner1_id, 'Technical Expert Level 3', '2025-06-20', 'Valid'),
        (partner1_id, 'Cloud Solutions Specialist', '2025-09-10', 'Valid'),
        (partner2_id, 'Sales Professional', '2025-04-10', 'Valid'),
        (partner2_id, 'Product Specialist', '2025-07-15', 'Valid');

    -- Create Deals
    INSERT INTO public.deals (id, name, company, value, stage, partner_id, probability, close_date, description, created_by)
    VALUES
        (deal1_id, 'Enterprise Cloud Migration', 'TechCorp Solutions', 450000, 'proposal', partner1_id, 75, '2026-03-15', 'Complete cloud infrastructure migration for enterprise client with 500+ users', admin_uuid),
        (deal2_id, 'Network Infrastructure Upgrade', 'GlobalTech Partners', 280000, 'negotiation', partner2_id, 85, '2026-02-28', 'Campus-wide network infrastructure modernization project', admin_uuid),
        (gen_random_uuid(), 'Security Solutions Package', 'Innovate Systems', 175000, 'qualification', partner3_id, 60, '2026-04-10', 'Comprehensive cybersecurity solution deployment', admin_uuid),
        (gen_random_uuid(), 'Data Center Expansion', 'Digital Dynamics', 620000, 'prospecting', partner1_id, 40, '2026-05-20', 'Data center capacity expansion with redundancy implementation', admin_uuid);

    -- Create Products
    INSERT INTO public.products (id, sku, name, manufacturer, category, available, allocated, low_stock_threshold, location, partner_price, msrp, description)
    VALUES
        (product1_id, 'SRV-DL-R740-001', 'Dell PowerEdge R740 Server - Dual Xeon Gold 6248R, 128GB RAM, 4TB Storage', 'Dell Technologies', 'Servers & Storage', 45, 12, 20, 'East Coast Warehouse', 8500.00, 12000.00, 'Enterprise-grade server for data center deployments'),
        (product2_id, 'NET-CS-C9300-002', 'Cisco Catalyst 9300 48-Port Network Switch with PoE+', 'Cisco Systems', 'Networking Equipment', 8, 5, 10, 'West Coast Warehouse', 6200.00, 8500.00, 'High-performance network switch with Power over Ethernet'),
        (product3_id, 'SFT-MS-SQL-003', 'Microsoft SQL Server 2022 Enterprise Edition - 10 Core License', 'Microsoft', 'Software Licenses', 150, 45, 50, 'Central Distribution', 1200.00, 1800.00, 'Enterprise database management system'),
        (gen_random_uuid(), 'SEC-PA-5220-004', 'Palo Alto Networks PA-5220 Next-Gen Firewall Appliance', 'Palo Alto Networks', 'Security Solutions', 0, 8, 5, 'East Coast Warehouse', 15000.00, 22000.00, 'Advanced threat prevention firewall'),
        (gen_random_uuid(), 'CLD-VM-VSP-005', 'VMware vSphere Enterprise Plus - Per Processor License', 'VMware', 'Cloud Services', 200, 75, 100, 'Central Distribution', 4500.00, 6000.00, 'Virtualization platform for cloud infrastructure');

    -- Create Compliance Requirements
    INSERT INTO public.compliance_requirements (requirement, description, type, responsible, due_date, priority, status, progress, department)
    VALUES
        ('SOC 2 Type II Certification', 'Annual security and availability audit for cloud services', 'Security', 'Sarah Mitchell', '2026-01-25', 'critical', 'in-progress', 68, 'IT'),
        ('GDPR Data Protection Assessment', 'Quarterly review of data processing activities and privacy controls', 'Data Privacy', 'Michael Chen', '2026-01-30', 'high', 'in-progress', 82, 'Legal'),
        ('ISO 27001 Compliance Review', 'Information security management system certification renewal', 'Security', 'David Rodriguez', '2026-02-15', 'high', 'pending', 45, 'IT'),
        ('Partner Agreement Renewals', 'Review and update partner contracts for Q1 2026', 'Legal', 'Jennifer Lee', '2026-01-20', 'critical', 'overdue', 30, 'Legal'),
        ('Financial Audit Preparation', 'Annual financial audit documentation and review', 'Financial', 'Robert Kim', '2026-03-01', 'medium', 'pending', 15, 'Finance');

    -- Create Quote
    INSERT INTO public.quotes (id, quote_number, partner_id, customer_name, customer_email, subtotal, discount_percent, discount_amount, tax_amount, total, payment_terms, delivery_method, include_warranty, include_support, validity_days, status, created_by)
    VALUES
        (quote1_id, 'QT-2026-001', partner1_id, 'Acme Corporation', 'purchasing@acme.com', 21900.00, 10, 2190.00, 1576.80, 21286.80, 'net-30', 'standard', true, true, 30, 'sent', admin_uuid);

    -- Create Quote Items
    INSERT INTO public.quote_items (quote_id, product_id, quantity, unit_price, total_price)
    VALUES
        (quote1_id, product1_id, 2, 8500.00, 17000.00),
        (quote1_id, product2_id, 1, 6200.00, 6200.00);

    -- Create Activities
    INSERT INTO public.activities (user_id, activity_type, description, entity_type, entity_id)
    VALUES
        (admin_uuid, 'deal_created', 'Created new deal: Enterprise Cloud Migration', 'deal', deal1_id),
        (admin_uuid, 'partner_added', 'Added new partner: TechCorp Solutions', 'partner', partner1_id),
        (partner_uuid, 'quote_generated', 'Generated quote QT-2026-001 for Acme Corporation', 'quote', quote1_id),
        (admin_uuid, 'deal_updated', 'Updated deal stage to Negotiation', 'deal', deal2_id);

END $$;