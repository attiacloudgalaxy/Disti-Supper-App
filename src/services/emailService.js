/**
 * Email Service for Office 365 Integration
 * Uses Microsoft Graph API to send emails via Office 365
 * 
 * This service leverages the existing Azure AD authentication (MSAL)
 * to send emails through Microsoft Graph API.
 */

import { getMsalInstance, isMsalConfigured } from '../lib/msalConfig';

// Microsoft Graph API endpoint for sending emails
const GRAPH_API_ENDPOINT = 'https://graph.microsoft.com/v1.0';

// Email configuration - Using shared mailbox for sending
const EMAIL_CONFIG = {
  senderEmail: import.meta.env.VITE_EMAIL_SENDER || 'noreply@usc.net.sa',
  senderName: import.meta.env.VITE_EMAIL_SENDER_NAME || 'DistributorHub Notifications',
  enabled: import.meta.env.VITE_EMAIL_ENABLED !== 'false',
  appName: 'DistributorHub',
  // Use shared mailbox - requires "Send As" permission on the mailbox
  useSharedMailbox: true
};

/**
 * Get access token for Microsoft Graph API with Mail.Send scope
 * Note: Mail.Send.Shared permission is needed for sending from shared mailboxes
 */
const getGraphToken = async () => {
  if (!isMsalConfigured()) {
    console.warn('MSAL not configured, email sending disabled');
    return null;
  }

  const msalInstance = getMsalInstance();
  if (!msalInstance) return null;

  try {
    await msalInstance.initialize();
    const accounts = msalInstance.getAllAccounts();

    if (accounts.length === 0) {
      console.warn('No authenticated user, email sending requires login');
      return null;
    }

    // Request token with Mail.Send permission (covers shared mailbox with "Send As" rights)
    const tokenResponse = await msalInstance.acquireTokenSilent({
      scopes: ['Mail.Send', 'Mail.Send.Shared'],
      account: accounts[0]
    });

    return tokenResponse.accessToken;
  } catch (error) {
    console.error('Failed to get Graph API token:', error);
    // Try with interactive login if silent fails
    try {
      const msalInstance = getMsalInstance();
      const tokenResponse = await msalInstance.acquireTokenPopup({
        scopes: ['Mail.Send', 'Mail.Send.Shared']
      });
      return tokenResponse.accessToken;
    } catch (popupError) {
      console.error('Interactive token acquisition failed:', popupError);
      return null;
    }
  }
};

/**
 * Send an email using Microsoft Graph API
 * Uses the shared mailbox (noreply@usc.net.sa) as the sender
 * Requires the logged-in user to have "Send As" permission on the shared mailbox
 * 
 * @param {Object} options - Email options
 * @param {string|string[]} options.to - Recipient email(s)
 * @param {string} options.subject - Email subject
 * @param {string} options.body - Email body (HTML supported)
 * @param {string} [options.cc] - CC recipients
 * @param {string} [options.importance] - Email importance (low, normal, high)
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const sendEmail = async ({ to, subject, body, cc, importance = 'normal' }) => {
  if (!EMAIL_CONFIG.enabled) {
    console.log('Email notifications disabled');
    return { success: false, error: 'Email notifications are disabled' };
  }

  const accessToken = await getGraphToken();
  if (!accessToken) {
    return { success: false, error: 'Not authenticated or MSAL not configured' };
  }

  // Convert single recipient to array
  const recipients = Array.isArray(to) ? to : [to];

  // Build the email message with shared mailbox as sender
  const message = {
    message: {
      subject: `[${EMAIL_CONFIG.appName}] ${subject}`,
      importance,
      body: {
        contentType: 'HTML',
        content: wrapEmailTemplate(body)
      },
      // Set the From address to the shared mailbox
      from: {
        emailAddress: {
          address: EMAIL_CONFIG.senderEmail,
          name: EMAIL_CONFIG.senderName
        }
      },
      toRecipients: recipients.map(email => ({
        emailAddress: { address: email }
      })),
      ...(cc && {
        ccRecipients: (Array.isArray(cc) ? cc : [cc]).map(email => ({
          emailAddress: { address: email }
        }))
      })
    },
    saveToSentItems: false // Don't save to user's sent items when using shared mailbox
  };

  try {
    // Use /me/sendMail - the "from" field in the message specifies the shared mailbox
    // This works when the user has "Send As" permission on the shared mailbox
    const response = await fetch(`${GRAPH_API_ENDPOINT}/me/sendMail`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `HTTP ${response.status}`;
      console.error('Email send failed:', errorData);
      throw new Error(errorMessage);
    }

    console.log(`Email sent successfully from ${EMAIL_CONFIG.senderEmail} to ${recipients.join(', ')}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Wrap email content in a professional HTML template
 */
const wrapEmailTemplate = (content) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .email-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 24px;
      text-align: center;
    }
    .email-header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .email-body {
      padding: 32px 24px;
    }
    .email-footer {
      background-color: #f8f9fa;
      padding: 16px 24px;
      text-align: center;
      font-size: 12px;
      color: #6c757d;
      border-top: 1px solid #e9ecef;
    }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 16px 0;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
    }
    .status-success { background: #d4edda; color: #155724; }
    .status-warning { background: #fff3cd; color: #856404; }
    .status-danger { background: #f8d7da; color: #721c24; }
    .status-info { background: #d1ecf1; color: #0c5460; }
  </style>
</head>
<body>
  <div style="padding: 20px;">
    <div class="email-container">
      <div class="email-header">
        <h1>📦 DistributorHub</h1>
      </div>
      <div class="email-body">
        ${content}
      </div>
      <div class="email-footer">
        <p>This is an automated notification from DistributorHub.</p>
        <p>© ${new Date().getFullYear()} DistributorHub. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
};

// ============================================
// Notification Functions for Each Module
// ============================================

/**
 * Partner Notifications
 */
export const notifyPartnerCreated = async (partner, adminEmails) => {
  return sendEmail({
    to: adminEmails,
    subject: 'New Partner Registration',
    body: `
      <h2>New Partner Registered</h2>
      <p>A new partner has been registered in DistributorHub:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #e9ecef;"><strong>Company:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e9ecef;">${partner.company_name || 'N/A'}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e9ecef;"><strong>Contact:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e9ecef;">${partner.contact_name || 'N/A'}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e9ecef;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e9ecef;">${partner.email || 'N/A'}</td></tr>
        <tr><td style="padding: 8px;"><strong>Region:</strong></td><td style="padding: 8px;">${partner.region || 'N/A'}</td></tr>
      </table>
      <p><a href="${window.location.origin}/partner-management" class="btn">View Partner Details</a></p>
    `,
    importance: 'normal'
  });
};

export const notifyPartnerStatusChanged = async (partner, oldStatus, adminEmails) => {
  const statusClass = partner.status === 'active' ? 'success' :
    partner.status === 'pending' ? 'warning' : 'danger';
  return sendEmail({
    to: adminEmails,
    subject: `Partner Status Changed: ${partner.company_name}`,
    body: `
      <h2>Partner Status Update</h2>
      <p>The status of <strong>${partner.company_name}</strong> has been updated:</p>
      <p style="text-align: center; margin: 24px 0;">
        <span class="status-badge status-warning">${oldStatus}</span>
        <span style="margin: 0 12px;">→</span>
        <span class="status-badge status-${statusClass}">${partner.status}</span>
      </p>
      <p><a href="${window.location.origin}/partner-management" class="btn">View Partner</a></p>
    `
  });
};

/**
 * Deal Notifications
 */
export const notifyDealCreated = async (deal, assigneeEmail) => {
  return sendEmail({
    to: assigneeEmail,
    subject: `New Deal Assigned: ${deal.name}`,
    body: `
      <h2>New Deal Assigned to You</h2>
      <p>You have been assigned a new deal:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #e9ecef;"><strong>Deal Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e9ecef;">${deal.name}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e9ecef;"><strong>Value:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e9ecef;">$${deal.value?.toLocaleString() || '0'}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e9ecef;"><strong>Partner:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e9ecef;">${deal.partner_name || 'N/A'}</td></tr>
        <tr><td style="padding: 8px;"><strong>Stage:</strong></td><td style="padding: 8px;"><span class="status-badge status-info">${deal.stage}</span></td></tr>
      </table>
      <p><a href="${window.location.origin}/deal-management" class="btn">View Deal</a></p>
    `,
    importance: 'high'
  });
};

export const notifyDealStatusChanged = async (deal, oldStage, recipientEmails) => {
  const isWon = deal.stage === 'won' || deal.stage === 'closed_won';
  const isLost = deal.stage === 'lost' || deal.stage === 'closed_lost';

  return sendEmail({
    to: recipientEmails,
    subject: `Deal Update: ${deal.name} - ${deal.stage}`,
    body: `
      <h2>Deal Status Update</h2>
      <p>The deal <strong>${deal.name}</strong> has been updated:</p>
      <p style="text-align: center; margin: 24px 0;">
        <span class="status-badge status-info">${oldStage}</span>
        <span style="margin: 0 12px;">→</span>
        <span class="status-badge ${isWon ? 'status-success' : isLost ? 'status-danger' : 'status-info'}">${deal.stage}</span>
      </p>
      ${isWon ? '<p style="text-align: center; font-size: 24px;">🎉 Congratulations on winning this deal!</p>' : ''}
      <p><a href="${window.location.origin}/deal-management" class="btn">View Deal</a></p>
    `,
    importance: isWon || isLost ? 'high' : 'normal'
  });
};

/**
 * Quote Notifications
 */
export const notifyQuoteCreated = async (quote, recipientEmail) => {
  return sendEmail({
    to: recipientEmail,
    subject: `New Quote Created: ${quote.quote_number || quote.id}`,
    body: `
      <h2>New Quote Generated</h2>
      <p>A new quote has been created:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #e9ecef;"><strong>Quote #:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e9ecef;">${quote.quote_number || quote.id}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e9ecef;"><strong>Customer:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e9ecef;">${quote.customer_name || 'N/A'}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e9ecef;"><strong>Total:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e9ecef;">$${quote.total?.toLocaleString() || '0'}</td></tr>
        <tr><td style="padding: 8px;"><strong>Valid Until:</strong></td><td style="padding: 8px;">${quote.valid_until ? new Date(quote.valid_until).toLocaleDateString() : 'N/A'}</td></tr>
      </table>
      <p><a href="${window.location.origin}/quote-generation" class="btn">View Quote</a></p>
    `
  });
};

export const notifyQuoteExpiring = async (quote, ownerEmail) => {
  return sendEmail({
    to: ownerEmail,
    subject: `⚠️ Quote Expiring Soon: ${quote.quote_number || quote.id}`,
    body: `
      <h2 style="color: #856404;">Quote Expiring Soon</h2>
      <p>The following quote is about to expire:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #e9ecef;"><strong>Quote #:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e9ecef;">${quote.quote_number || quote.id}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e9ecef;"><strong>Customer:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e9ecef;">${quote.customer_name || 'N/A'}</td></tr>
        <tr><td style="padding: 8px;"><strong>Expires:</strong></td><td style="padding: 8px;"><span class="status-badge status-warning">${quote.valid_until ? new Date(quote.valid_until).toLocaleDateString() : 'Soon'}</span></td></tr>
      </table>
      <p>Please take action before the quote expires.</p>
      <p><a href="${window.location.origin}/quote-generation" class="btn">Review Quote</a></p>
    `,
    importance: 'high'
  });
};

/**
 * Inventory Notifications
 */
export const notifyLowStock = async (product, adminEmails) => {
  return sendEmail({
    to: adminEmails,
    subject: `🚨 Low Stock Alert: ${product.name}`,
    body: `
      <h2 style="color: #721c24;">Low Stock Alert</h2>
      <p>The following product has low stock and requires attention:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #e9ecef;"><strong>Product:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e9ecef;">${product.name}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e9ecef;"><strong>SKU:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e9ecef;">${product.sku || 'N/A'}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e9ecef;"><strong>Current Stock:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e9ecef;"><span class="status-badge status-danger">${product.stock_quantity} units</span></td></tr>
        <tr><td style="padding: 8px;"><strong>Minimum Level:</strong></td><td style="padding: 8px;">${product.min_stock_level || 10} units</td></tr>
      </table>
      <p><a href="${window.location.origin}/inventory-management" class="btn">Manage Inventory</a></p>
    `,
    importance: 'high'
  });
};

/**
 * Compliance Notifications
 */
export const notifyComplianceDeadline = async (item, responsibleEmails) => {
  const daysUntil = Math.ceil((new Date(item.deadline) - new Date()) / (1000 * 60 * 60 * 24));
  const urgency = daysUntil <= 3 ? 'danger' : daysUntil <= 7 ? 'warning' : 'info';

  return sendEmail({
    to: responsibleEmails,
    subject: `⏰ Compliance Deadline Approaching: ${item.name}`,
    body: `
      <h2>Compliance Deadline Reminder</h2>
      <p>The following compliance item requires attention:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #e9ecef;"><strong>Item:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e9ecef;">${item.name}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e9ecef;"><strong>Category:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e9ecef;">${item.category || 'General'}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e9ecef;"><strong>Deadline:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e9ecef;">${new Date(item.deadline).toLocaleDateString()}</td></tr>
        <tr><td style="padding: 8px;"><strong>Days Remaining:</strong></td><td style="padding: 8px;"><span class="status-badge status-${urgency}">${daysUntil} days</span></td></tr>
      </table>
      <p><a href="${window.location.origin}/compliance-tracking" class="btn">View Compliance</a></p>
    `,
    importance: daysUntil <= 3 ? 'high' : 'normal'
  });
};

export const notifyComplianceViolation = async (item, adminEmails) => {
  return sendEmail({
    to: adminEmails,
    subject: `🚫 Compliance Violation: ${item.name}`,
    body: `
      <h2 style="color: #721c24;">Compliance Violation Detected</h2>
      <p>A compliance violation has been detected and requires immediate attention:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #e9ecef;"><strong>Item:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e9ecef;">${item.name}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e9ecef;"><strong>Category:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e9ecef;">${item.category || 'General'}</td></tr>
        <tr><td style="padding: 8px;"><strong>Status:</strong></td><td style="padding: 8px;"><span class="status-badge status-danger">Violation</span></td></tr>
      </table>
      <p style="color: #721c24;"><strong>Please address this issue immediately.</strong></p>
      <p><a href="${window.location.origin}/compliance-tracking" class="btn">View Details</a></p>
    `,
    importance: 'high'
  });
};

// Export email configuration check
export const isEmailEnabled = () => EMAIL_CONFIG.enabled && isMsalConfigured();

/**
 * Get detailed email service status
 */
export const getEmailServiceStatus = () => {
  return {
    enabled: EMAIL_CONFIG.enabled,
    msalConfigured: isMsalConfigured(),
    senderEmail: EMAIL_CONFIG.senderEmail,
    senderName: EMAIL_CONFIG.senderName,
    ready: EMAIL_CONFIG.enabled && isMsalConfigured()
  };
};

/**
 * Send a test email to verify the email service is working
 * @param {string} recipientEmail - Email address to send the test to
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const sendTestEmail = async (recipientEmail) => {
  const testContent = `
        <h2>🎉 Test Email Successful!</h2>
        <p>This is a test email from <strong>DistributorHub</strong>.</p>
        <p>If you're receiving this message, your email notifications are configured correctly.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0; background: #f8f9fa; border-radius: 8px;">
            <tr>
                <td style="padding: 12px;"><strong>Sender:</strong></td>
                <td style="padding: 12px;">${EMAIL_CONFIG.senderEmail}</td>
            </tr>
            <tr>
                <td style="padding: 12px;"><strong>Timestamp:</strong></td>
                <td style="padding: 12px;">${new Date().toLocaleString()}</td>
            </tr>
            <tr>
                <td style="padding: 12px;"><strong>Status:</strong></td>
                <td style="padding: 12px;"><span class="status-badge status-success">✓ Working</span></td>
            </tr>
        </table>
        <p style="color: #6c757d; font-size: 14px;">
            You can now configure notification preferences in Settings.
        </p>
    `;

  return sendEmail({
    to: recipientEmail,
    subject: 'Test Email - Configuration Verified',
    body: testContent,
    importance: 'normal'
  });
};

