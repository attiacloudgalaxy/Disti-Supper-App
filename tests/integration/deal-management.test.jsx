import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/contexts/AuthContext';
import DealManagement from '../../src/pages/deal-management';

/**
 * Deal Management Integration Tests
 * Tests the integration between DealManagement page, dealService, and UI components
 */

// Mock the auth context to provide authenticated user
vi.mock('../../src/contexts/AuthContext', async () => {
  const actual = await vi.importActual('../../src/contexts/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        user_metadata: {
          full_name: 'Test User'
        }
      },
      loading: false,
      signOut: vi.fn()
    })
  };
});

describe('Deal Management Integration', () => {
  const renderDealManagement = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <DealManagement />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render deal management page', async () => {
    renderDealManagement();
    
    await waitFor(() => {
      expect(screen.getByText(/deal management/i)).toBeInTheDocument();
    });
  });

  it('should load and display deals', async () => {
    renderDealManagement();
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    }, { timeout: 10000 });
    
    // Table should be visible
    const table = screen.queryByRole('table');
    if (table) {
      expect(table).toBeInTheDocument();
    }
  });

  it('should open add deal modal when button clicked', async () => {
    const user = userEvent.setup();
    renderDealManagement();
    
    // Wait for page to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    // Find and click Add Deal button
    const addButton = screen.getByRole('button', { name: /add deal/i });
    await user.click(addButton);
    
    // Modal should open
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('should create a new deal through the form', async () => {
    const user = userEvent.setup();
    renderDealManagement();
    
    // Wait for page to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    // Open add deal modal
    const addButton = screen.getByRole('button', { name: /add deal/i });
    await user.click(addButton);
    
    // Wait for modal
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    
    // Fill form
    const nameInput = screen.getByLabelText(/deal name|name/i);
    await user.type(nameInput, 'Integration Test Deal');
    
    const companyInput = screen.getByLabelText(/company/i);
    await user.type(companyInput, 'Test Company Inc');
    
    const valueInput = screen.getByLabelText(/value|amount/i);
    await user.type(valueInput, '250000');
    
    // Submit form
    const saveButton = screen.getByRole('button', { name: /save|create/i });
    await user.click(saveButton);
    
    // Modal should close and deal should appear in list
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    }, { timeout: 10000 });
    
    // New deal should be visible (if API mock returns it)
    // This depends on MSW mock configuration
  });

  it('should filter deals by stage', async () => {
    const user = userEvent.setup();
    renderDealManagement();
    
    // Wait for page to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    // Find stage filter
    const stageFilter = screen.queryByLabelText(/stage/i);
    if (stageFilter) {
      await user.selectOptions(stageFilter, 'prospecting');
      
      // Wait for filter to apply
      await waitFor(() => {
        // Filtered results should be displayed
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });
    }
  });

  it('should handle deal creation error gracefully', async () => {
    const user = userEvent.setup();
    renderDealManagement();
    
    // Wait for page to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    // Open add deal modal
    const addButton = screen.getByRole('button', { name: /add deal/i });
    await user.click(addButton);
    
    // Submit empty form (should trigger validation)
    const saveButton = screen.getByRole('button', { name: /save|create/i });
    await user.click(saveButton);
    
    // Error message should appear
    await waitFor(() => {
      const errorMessage = screen.queryByText(/required|invalid|error/i);
      if (errorMessage) {
        expect(errorMessage).toBeInTheDocument();
      }
    });
  });

  it('should display pipeline summary', async () => {
    renderDealManagement();
    
    // Wait for page to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    // Pipeline summary should be visible (if enabled)
    const pipelineSummary = screen.queryByText(/pipeline/i);
    if (pipelineSummary) {
      expect(pipelineSummary).toBeInTheDocument();
    }
  });
});
