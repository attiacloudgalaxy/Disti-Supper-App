import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import NavigationSidebar from './NavigationSidebar'

// Mock the useAuth hook
const mockSignOut = vi.fn()
const mockUser = {
  email: 'test@example.com',
  user_metadata: { full_name: 'Test User' }
}

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    signOut: mockSignOut
  })
}))

// Mock the Icon component
vi.mock('../AppIcon', () => ({
  default: ({ name, size }) => (
    <svg data-icon={name} width={size} height={size} data-testid={`icon-${name}`}>
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}))

/**
 * NavigationSidebar Component Tests
 *
 * These tests demonstrate navigation component testing patterns
 * for the NavigationSidebar including route navigation and collapse behavior.
 */
describe('NavigationSidebar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderWithRouter = (component, initialEntries = ['/']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        {component}
      </MemoryRouter>
    )
  }

  it('renders navigation items', () => {
    renderWithRouter(<NavigationSidebar />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Deals')).toBeInTheDocument()
    expect(screen.getByText('Partners')).toBeInTheDocument()
    expect(screen.getByText('Inventory')).toBeInTheDocument()
    expect(screen.getByText('Compliance')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    renderWithRouter(<NavigationSidebar />)
    
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /deals/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /partners/i })).toBeInTheDocument()
  })

  it('highlights active route', () => {
    renderWithRouter(<NavigationSidebar />, ['/executive-dashboard'])
    
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
    expect(dashboardLink).toHaveClass('active')
  })

  it('shows sub-items when parent route is active', () => {
    renderWithRouter(<NavigationSidebar />, ['/deal-management'])
    
    expect(screen.getByText('Deal Management')).toBeInTheDocument()
    expect(screen.getByText('Quote Generation')).toBeInTheDocument()
  })

  it('does not show sub-items when parent route is not active', () => {
    renderWithRouter(<NavigationSidebar />, ['/executive-dashboard'])
    
    expect(screen.queryByText('Deal Management')).not.toBeInTheDocument()
    expect(screen.queryByText('Quote Generation')).not.toBeInTheDocument()
  })

  it('highlights active sub-item', () => {
    renderWithRouter(<NavigationSidebar />, ['/quote-generation'])
    
    const quoteLink = screen.getByRole('link', { name: /quote generation/i })
    expect(quoteLink).toHaveClass('active')
  })

  it('calls onToggleCollapse when collapse button is clicked', async () => {
    const user = userEvent.setup()
    const handleToggleCollapse = vi.fn()
    renderWithRouter(<NavigationSidebar onToggleCollapse={handleToggleCollapse} />)
    
    const collapseButton = screen.getByLabelText(/collapse sidebar/i)
    await user.click(collapseButton)
    
    expect(handleToggleCollapse).toHaveBeenCalledTimes(1)
  })

  it('shows collapsed state when isCollapsed is true', () => {
    renderWithRouter(<NavigationSidebar isCollapsed />)
    
    expect(screen.queryByText('Ultimate Distribution')).not.toBeInTheDocument()
    expect(screen.queryByText('Welcome, Test User')).not.toBeInTheDocument()
  })

  it('shows expanded state when isCollapsed is false', () => {
    renderWithRouter(<NavigationSidebar isCollapsed={false} />)
    
    expect(screen.getByText('Ultimate Distribution')).toBeInTheDocument()
    expect(screen.getByText('Welcome, Test User')).toBeInTheDocument()
  })

  it('renders logo', () => {
    renderWithRouter(<NavigationSidebar />)
    
    const logo = screen.getByAltText('Logo')
    expect(logo).toBeInTheDocument()
  })

  it('renders user display name', () => {
    renderWithRouter(<NavigationSidebar />)
    
    expect(screen.getByText('Welcome, Test User')).toBeInTheDocument()
  })

  it('renders sign out button', () => {
    renderWithRouter(<NavigationSidebar />)
    
    expect(screen.getByText('Sign Out')).toBeInTheDocument()
  })

  it('calls signOut when sign out button is clicked', async () => {
    const user = userEvent.setup()
    renderWithRouter(<NavigationSidebar />)
    
    const signOutButton = screen.getByText('Sign Out')
    await user.click(signOutButton)
    
    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled()
    })
  })

  it('renders copyright text', () => {
    renderWithRouter(<NavigationSidebar />)
    
    expect(screen.getByText(/© 2026 Ultimate Dist\./i)).toBeInTheDocument()
  })

  it('has proper ARIA attributes', () => {
    renderWithRouter(<NavigationSidebar />)
    
    const sidebar = screen.getByRole('navigation', { name: /main navigation/i })
    expect(sidebar).toBeInTheDocument()
  })

  it('shows mobile menu button', () => {
    renderWithRouter(<NavigationSidebar />)
    
    const mobileButton = screen.getByLabelText(/toggle mobile menu/i)
    expect(mobileButton).toBeInTheDocument()
  })

  it('toggles mobile menu when mobile button is clicked', async () => {
    const user = userEvent.setup()
    renderWithRouter(<NavigationSidebar />)
    
    const mobileButton = screen.getByLabelText(/toggle mobile menu/i)
    await user.click(mobileButton)
    
    const sidebar = screen.getByRole('navigation')
    expect(sidebar).toHaveClass('block')
  })

  it('closes mobile menu when clicking overlay', async () => {
    const user = userEvent.setup()
    renderWithRouter(<NavigationSidebar />)
    
    // Open mobile menu
    const mobileButton = screen.getByLabelText(/toggle mobile menu/i)
    await user.click(mobileButton)
    
    // Click overlay
    const overlay = screen.getByText((content, element) => {
      return element?.classList?.contains('mobile-overlay')
    })
    await user.click(overlay)
    
    const sidebar = screen.getByRole('navigation')
    expect(sidebar).toHaveClass('hidden')
  })

  it('closes mobile menu when navigation link is clicked', async () => {
    const user = userEvent.setup()
    renderWithRouter(<NavigationSidebar />)
    
    // Open mobile menu
    const mobileButton = screen.getByLabelText(/toggle mobile menu/i)
    await user.click(mobileButton)
    
    // Click a navigation link
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
    await user.click(dashboardLink)
    
    const sidebar = screen.getByRole('navigation')
    expect(sidebar).toHaveClass('hidden')
  })

  it('renders navigation icons', () => {
    renderWithRouter(<NavigationSidebar />)
    
    expect(screen.getByTestId('icon-LayoutDashboard')).toBeInTheDocument()
    expect(screen.getByTestId('icon-Briefcase')).toBeInTheDocument()
    expect(screen.getByTestId('icon-Users')).toBeInTheDocument()
  })

  it('shows expand button when collapsed', () => {
    renderWithRouter(<NavigationSidebar isCollapsed onToggleCollapse={vi.fn()} />)
    
    const expandButton = screen.getByLabelText(/expand sidebar/i)
    expect(expandButton).toBeInTheDocument()
  })

  it('shows collapse button when expanded', () => {
    renderWithRouter(<NavigationSidebar isCollapsed={false} onToggleCollapse={vi.fn()} />)
    
    const collapseButton = screen.getByLabelText(/collapse sidebar/i)
    expect(collapseButton).toBeInTheDocument()
  })

  it('navigates to correct route when link is clicked', async () => {
    const user = userEvent.setup()
    renderWithRouter(<NavigationSidebar />, ['/executive-dashboard'])
    
    const dealsLink = screen.getByRole('link', { name: /deals/i })
    expect(dealsLink).toHaveAttribute('href', '/deal-management')
  })

  it('navigates to sub-item route when clicked', async () => {
    const user = userEvent.setup()
    renderWithRouter(<NavigationSidebar />, ['/deal-management'])
    
    const quoteLink = screen.getByRole('link', { name: /quote generation/i })
    expect(quoteLink).toHaveAttribute('href', '/quote-generation')
  })

  it('has proper ARIA current attribute for active route', () => {
    renderWithRouter(<NavigationSidebar />, ['/executive-dashboard'])
    
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
    expect(dashboardLink).toHaveAttribute('aria-current', 'page')
  })

  it('does not have ARIA current attribute for inactive route', () => {
    renderWithRouter(<NavigationSidebar />, ['/executive-dashboard'])
    
    const dealsLink = screen.getByRole('link', { name: /deals/i })
    expect(dealsLink).not.toHaveAttribute('aria-current')
  })

  it('renders sign out button with icon', () => {
    renderWithRouter(<NavigationSidebar />)
    
    expect(screen.getByTestId('icon-LogOut')).toBeInTheDocument()
  })

  it('shows collapse button only on large screens', () => {
    renderWithRouter(<NavigationSidebar isCollapsed={false} onToggleCollapse={vi.fn()} />)
    
    const collapseButton = screen.getByLabelText(/collapse sidebar/i)
    expect(collapseButton).toHaveClass('hidden')
  })
})
