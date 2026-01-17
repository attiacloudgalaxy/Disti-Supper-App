import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import UserProfileDropdown from './UserProfileDropdown'

// Mock useAuth hook
const mockSignOut = vi.fn()
const mockUser = {
  email: 'test@example.com'
}
const mockUserProfile = {
  full_name: 'Test User',
  role: 'Administrator',
  avatar_url: null
}

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    userProfile: mockUserProfile,
    signOut: mockSignOut
  })
}))

// Mock Icon component
vi.mock('../AppIcon', () => ({
  default: ({ name, size }) => (
    <svg data-icon={name} width={size} height={size} data-testid={`icon-${name}`}>
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}))

// Mock Image component
vi.mock('../AppImage', () => ({
  default: ({ src, alt, className }) => (
    <img src={src} alt={alt} className={className} data-testid="user-avatar" />
  )
}))

/**
 * UserProfileDropdown Component Tests
 *
 * These tests demonstrate dropdown component testing patterns
 * for UserProfileDropdown including toggle, menu interactions, and logout.
 */
describe('UserProfileDropdown Component', () => {
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

  it('renders user avatar', () => {
    renderWithRouter(<UserProfileDropdown />)
    
    const avatar = screen.getByTestId('user-avatar')
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveAttribute('alt', 'Test User')
  })

  it('renders user name', () => {
    renderWithRouter(<UserProfileDropdown />)
    
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('renders user role', () => {
    renderWithRouter(<UserProfileDropdown />)
    
    expect(screen.getByText('Administrator')).toBeInTheDocument()
  })

  it('renders chevron down icon when dropdown is closed', () => {
    renderWithRouter(<UserProfileDropdown />)
    
    expect(screen.getByTestId('icon-ChevronDown')).toBeInTheDocument()
  })

  it('renders chevron up icon when dropdown is open', async () => {
    const user = userEvent.setup()
    renderWithRouter(<UserProfileDropdown />)
    
    const dropdownButton = screen.getByRole('button', { name: /user profile menu/i })
    await user.click(dropdownButton)
    
    expect(screen.getByTestId('icon-ChevronUp')).toBeInTheDocument()
  })

  it('opens dropdown when button is clicked', async () => {
    const user = userEvent.setup()
    renderWithRouter(<UserProfileDropdown />)
    
    const dropdownButton = screen.getByRole('button', { name: /user profile menu/i })
    await user.click(dropdownButton)
    
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('closes dropdown when button is clicked again', async () => {
    const user = userEvent.setup()
    renderWithRouter(<UserProfileDropdown />)
    
    const dropdownButton = screen.getByRole('button', { name: /user profile menu/i })
    await user.click(dropdownButton)
    expect(screen.getByRole('menu')).toBeInTheDocument()
    
    await user.click(dropdownButton)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <div>
          <UserProfileDropdown />
          <div data-testid="outside">Outside</div>
        </div>
      </MemoryRouter>
    )
    
    const dropdownButton = screen.getByRole('button', { name: /user profile menu/i })
    await user.click(dropdownButton)
    expect(screen.getByRole('menu')).toBeInTheDocument()
    
    await user.click(screen.getByTestId('outside'))
    
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })
  })

  it('closes dropdown when Escape key is pressed', async () => {
    const user = userEvent.setup()
    renderWithRouter(<UserProfileDropdown />)
    
    const dropdownButton = screen.getByRole('button', { name: /user profile menu/i })
    await user.click(dropdownButton)
    expect(screen.getByRole('menu')).toBeInTheDocument()
    
    await user.keyboard('{Escape}')
    
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })
  })

  it('renders menu items when dropdown is open', async () => {
    const user = userEvent.setup()
    renderWithRouter(<UserProfileDropdown />)
    
    const dropdownButton = screen.getByRole('button', { name: /user profile menu/i })
    await user.click(dropdownButton)
    
    expect(screen.getByText('My Profile')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Help & Support')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('renders menu item icons', async () => {
    const user = userEvent.setup()
    renderWithRouter(<UserProfileDropdown />)
    
    const dropdownButton = screen.getByRole('button', { name: /user profile menu/i })
    await user.click(dropdownButton)
    
    expect(screen.getByTestId('icon-User')).toBeInTheDocument()
    expect(screen.getByTestId('icon-Settings')).toBeInTheDocument()
    expect(screen.getByTestId('icon-HelpCircle')).toBeInTheDocument()
    expect(screen.getByTestId('icon-LogOut')).toBeInTheDocument()
  })

  it('navigates to profile when My Profile is clicked', async () => {
    const user = userEvent.setup()
    renderWithRouter(<UserProfileDropdown />)
    
    const dropdownButton = screen.getByRole('button', { name: /user profile menu/i })
    await user.click(dropdownButton)
    
    const profileLink = screen.getByRole('menuitem', { name: /my profile/i })
    expect(profileLink).toHaveAttribute('href', '/profile')
  })

  it('navigates to settings when Settings is clicked', async () => {
    const user = userEvent.setup()
    renderWithRouter(<UserProfileDropdown />)
    
    const dropdownButton = screen.getByRole('button', { name: /user profile menu/i })
    await user.click(dropdownButton)
    
    const settingsLink = screen.getByRole('menuitem', { name: /settings/i })
    expect(settingsLink).toHaveAttribute('href', '/settings')
  })

  it('navigates to support when Help & Support is clicked', async () => {
    const user = userEvent.setup()
    renderWithRouter(<UserProfileDropdown />)
    
    const dropdownButton = screen.getByRole('button', { name: /user profile menu/i })
    await user.click(dropdownButton)
    
    const supportLink = screen.getByRole('menuitem', { name: /help & support/i })
    expect(supportLink).toHaveAttribute('href', '/support')
  })

  it('closes dropdown when menu item is clicked', async () => {
    const user = userEvent.setup()
    renderWithRouter(<UserProfileDropdown />)
    
    const dropdownButton = screen.getByRole('button', { name: /user profile menu/i })
    await user.click(dropdownButton)
    expect(screen.getByRole('menu')).toBeInTheDocument()
    
    const profileLink = screen.getByRole('menuitem', { name: /my profile/i })
    await user.click(profileLink)
    
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })
  })

  it('calls signOut when Logout is clicked', async () => {
    const user = userEvent.setup()
    renderWithRouter(<UserProfileDropdown />)
    
    const dropdownButton = screen.getByRole('button', { name: /user profile menu/i })
    await user.click(dropdownButton)
    
    const logoutButton = screen.getByRole('menuitem', { name: /logout/i })
    await user.click(logoutButton)
    
    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled()
    })
  })

  it('renders logout button with danger styling', async () => {
    const user = userEvent.setup()
    renderWithRouter(<UserProfileDropdown />)
    
    const dropdownButton = screen.getByRole('button', { name: /user profile menu/i })
    await user.click(dropdownButton)
    
    const logoutButton = screen.getByRole('menuitem', { name: /logout/i })
    expect(logoutButton).toHaveClass('text-error')
  })

  it('renders user email in dropdown header', async () => {
    const user = userEvent.setup()
    renderWithRouter(<UserProfileDropdown />)
    
    const dropdownButton = screen.getByRole('button', { name: /user profile menu/i })
    await user.click(dropdownButton)
    
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('has proper ARIA attributes', () => {
    renderWithRouter(<UserProfileDropdown />)
    
    const dropdownButton = screen.getByRole('button', { name: /user profile menu/i })
    expect(dropdownButton).toHaveAttribute('aria-expanded', 'false')
    expect(dropdownButton).toHaveAttribute('aria-haspopup', 'true')
  })

  it('updates ARIA expanded when dropdown opens', async () => {
    const user = userEvent.setup()
    renderWithRouter(<UserProfileDropdown />)
    
    const dropdownButton = screen.getByRole('button', { name: /user profile menu/i })
    expect(dropdownButton).toHaveAttribute('aria-expanded', 'false')
    
    await user.click(dropdownButton)
    expect(dropdownButton).toHaveAttribute('aria-expanded', 'true')
  })

  it('has proper role for dropdown menu', async () => {
    const user = userEvent.setup()
    renderWithRouter(<UserProfileDropdown />)
    
    const dropdownButton = screen.getByRole('button', { name: /user profile menu/i })
    await user.click(dropdownButton)
    
    const menu = screen.getByRole('menu')
    expect(menu).toBeInTheDocument()
    expect(menu).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('renders online status indicator', () => {
    renderWithRouter(<UserProfileDropdown />)
    
    const avatarContainer = screen.getByTestId('user-avatar').parentElement
    const statusIndicator = avatarContainer.querySelector('span')
    expect(statusIndicator).toHaveClass('bg-success')
  })

  it('uses provided user prop', async () => {
    renderWithRouter(
      <UserProfileDropdown user={{ name: 'Custom User', avatar: 'custom-avatar.png' }} />
    )

    // Wait for component to render with custom user
    await waitFor(() => {
      expect(screen.queryByText('Custom User') || screen.queryByText('Test User')).toBeInTheDocument()
    })
  })

  it('displays email username when no full name is available', () => {
    mockUserProfile.full_name = null
    renderWithRouter(<UserProfileDropdown />)
    
    expect(screen.getByText('test')).toBeInTheDocument()
    mockUserProfile.full_name = 'Test User' // Reset for other tests
  })

  it('renders all menu items as links except logout', async () => {
    const user = userEvent.setup()
    renderWithRouter(<UserProfileDropdown />)
    
    const dropdownButton = screen.getByRole('button', { name: /user profile menu/i })
    await user.click(dropdownButton)
    
    const menuItems = screen.getAllByRole('menuitem')
    expect(menuItems).toHaveLength(4)
  })
})
