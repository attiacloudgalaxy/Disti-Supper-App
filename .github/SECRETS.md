# GitHub Secrets Configuration Guide

This document outlines all GitHub Secrets that need to be configured for the DistributorHub CI/CD pipeline.

## How to Configure Secrets

1. Navigate to your repository on GitHub
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret listed below

---

## Required Secrets (Production)

These secrets are **CRITICAL** and must be configured for the application to build and deploy correctly.

| Secret Name | Description | Example | Required |
|-------------|-------------|---------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://xxxx.supabase.co` | ✅ Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJhbGc...` | ✅ Yes |
| `VITE_AZURE_CLIENT_ID` | Azure AD Application (Client) ID | `12345678-1234-...` | ✅ Yes |
| `VITE_AZURE_TENANT_ID` | Azure AD Directory (Tenant) ID | `87654321-4321-...` | ✅ Yes |
| `VITE_EMAIL_SENDER` | Email sender address for notifications | `noreply@yourdomain.com` | ✅ Yes |

---

## Optional Secrets (Enhanced Features)

These secrets enable additional functionality but are not required for basic operation.

| Secret Name | Description | Required |
|-------------|-------------|----------|
| `CODECOV_TOKEN` | Code coverage reporting token from codecov.io | Optional |
| `SLACK_WEBHOOK` | Slack webhook URL for deployment notifications | Optional |
| `VITE_RECAPTCHA_SITE_KEY` | Google reCAPTCHA v3 site key | Optional |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics measurement ID | Optional |

---

## Environment-Specific Configuration

### Production Environment

Configure these in: **Settings** → **Environments** → **production**

- **Environment Name**: `production`
- **Protection Rules**:
  - ☑ Required reviewers (recommended: 1 approval)
  - ☑ Wait timer (optional: 5 minutes)
- **Secrets**: Use production values for all secrets above

### Preview Environment (for PR previews)

Configure these in: **Settings** → **Environments** → **preview**

- **Environment Name**: `preview`
- **Protection Rules**: None (allows automatic PR deployments)
- **Secrets**: Can use staging/test values

---

## Azure AD Configuration

For Azure AD authentication to work correctly, you must also configure your Azure AD App Registration:

### Required Redirect URIs

Add these redirect URIs in Azure Portal → App Registrations → Authentication:

**Production:**
```
https://attiacloudgalaxy.github.io/Disti-Supper-App/
```

**Local Development:**
```
http://localhost:4028
```

### Required API Permissions

Grant these Microsoft Graph API permissions:

- `User.Read` (Delegated)
- `Mail.Send` (Delegated)
- `Mail.Send.Shared` (Delegated)

### Grant Admin Consent

After adding permissions, click **Grant admin consent** for your tenant.

---

## Supabase Configuration

### Database Setup

1. Create new Supabase project or use existing
2. Run all migrations in `/supabase/migrations/` directory
3. Enable Row Level Security (RLS) policies
4. Configure authentication providers:
   - ☑ Email/Password
   - ☑ Azure (Optional: for SSO)

### Get Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following:
   - **Project URL** → Use for `VITE_SUPABASE_URL`
   - **anon/public key** → Use for `VITE_SUPABASE_ANON_KEY`

---

## Security Best Practices

### ✅ Do

- Rotate secrets regularly (every 90 days recommended)
- Use different values for production vs preview environments
- Keep secrets in GitHub Secrets only (never commit to code)
- Limit access to repository settings to trusted team members
- Enable branch protection rules to prevent direct pushes to main

### ❌ Don't

- Never commit secrets to version control
- Never share secrets in Slack, email, or other communication channels
- Don't use production secrets in development
- Don't reuse secrets across different projects

---

## Verification Checklist

After configuring secrets, verify the setup:

- [ ] All required secrets are configured in GitHub
- [ ] Azure AD redirect URIs include GitHub Pages URL
- [ ] Azure AD API permissions granted and admin consent provided
- [ ] Supabase project is accessible with provided credentials
- [ ] Production environment created with protection rules
- [ ] Preview environment created (optional)
- [ ] Test workflow runs successfully with secrets

---

## Troubleshooting

### Build Fails with "Missing Environment Variable"

**Problem**: Build step fails saying `VITE_SUPABASE_URL is not defined`

**Solution**:
1. Verify the secret is spelled exactly as shown above (case-sensitive)
2. Check that it's configured at repository level, not environment level
3. Re-run the workflow after adding the secret

### Azure AD Login Fails

**Problem**: Users see "redirect_uri mismatch" error

**Solution**:
1. Verify GitHub Pages URL is added to Azure AD redirect URIs
2. Ensure URL includes the repository subdirectory: `/Disti-Supper-App/`
3. Check that `VITE_AZURE_CLIENT_ID` matches the App Registration

### Supabase Connection Fails

**Problem**: App shows "Failed to connect to Supabase"

**Solution**:
1. Verify Supabase project URL is correct (check for typos)
2. Ensure anon key is the **public/anon** key, not the service role key
3. Check Supabase project is not paused (free tier pauses after inactivity)

---

## Contact & Support

For questions about secrets configuration:

1. Check this documentation first
2. Review GitHub Actions workflow logs for specific error messages
3. Contact your DevOps team or repository administrator

---

**Last Updated**: 2026-01-17
**Maintained By**: DevOps Team
