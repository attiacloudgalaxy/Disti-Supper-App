import React, { useState } from 'react';
import NavigationSidebar from '../../components/navigation/NavigationSidebar';
import BreadcrumbNavigation from '../../components/navigation/BreadcrumbNavigation';
import NotificationCenter from '../../components/navigation/NotificationCenter';
import UserProfileDropdown from '../../components/navigation/UserProfileDropdown';
import QuickActionToolbar from '../../components/navigation/QuickActionToolbar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Settings = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const { user, userProfile } = useAuth();

    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        marketing: false,
        security: true
    });

    const [appearance, setAppearance] = useState({
        theme: 'light',
        compactMode: false
    });

    const [security, setSecurity] = useState({
        twoFactor: true,
        sessionTimeout: '30'
    });

    const handleNotificationChange = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleAppearanceChange = (key, value) => {
        setAppearance(prev => ({ ...prev, [key]: value }));
    };

    const handleSecurityChange = (key, value) => {
        setSecurity(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="min-h-screen bg-background">
            <NavigationSidebar
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            <div className={`transition-all duration-250 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'}`}>

                {/* Header */}
                <header className="sticky top-0 z-50 bg-card border-b border-border">
                    <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 h-20">
                        <div className="flex items-center space-x-4 flex-1">
                            <h1 className="text-xl md:text-2xl font-semibold text-foreground">
                                Settings
                            </h1>
                        </div>

                        <div className="flex items-center space-x-3">
                            <NotificationCenter />
                            <UserProfileDropdown user={{ name: userProfile?.full_name || 'Admin User', email: user?.email }} />
                        </div>
                    </div>
                </header>

                <main className="px-4 md:px-6 lg:px-8 py-6">
                    <BreadcrumbNavigation />

                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">Account Settings</h2>
                                <p className="text-muted-foreground">Manage your preferences and system configuration</p>
                            </div>
                        </div>

                        {/* Profile Link Card */}
                        <div className="bg-card border border-border rounded-lg p-6 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                    <Icon name="User" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">Profile Information</h3>
                                    <p className="text-sm text-muted-foreground">Update your photo and personal details</p>
                                </div>
                            </div>
                            <Link to="/profile">
                                <Button variant="outline">Edit Profile</Button>
                            </Link>
                        </div>

                        {/* Notifications */}
                        <div className="bg-card border border-border rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                                <Icon name="Bell" size={20} className="mr-2 text-primary" />
                                Notification Preferences
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-lg transition-colors">
                                    <div>
                                        <p className="font-medium text-foreground">Email Notifications</p>
                                        <p className="text-sm text-muted-foreground">Receive daily summaries and alerts via email</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={notifications.email}
                                            onChange={() => handleNotificationChange('email')}
                                        />
                                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-lg transition-colors">
                                    <div>
                                        <p className="font-medium text-foreground">Push Notifications</p>
                                        <p className="text-sm text-muted-foreground">Get real-time updates in your browser</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={notifications.push}
                                            onChange={() => handleNotificationChange('push')}
                                        />
                                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-lg transition-colors">
                                    <div>
                                        <p className="font-medium text-foreground">Security Alerts</p>
                                        <p className="text-sm text-muted-foreground">Notify me about suspicious login attempts</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={notifications.security}
                                            onChange={() => handleNotificationChange('security')}
                                            disabled
                                        />
                                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary opacity-50 cursor-not-allowed"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Appearance */}
                        <div className="bg-card border border-border rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                                <Icon name="Layout" size={20} className="mr-2 text-primary" />
                                Appearance
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Theme</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            className={`p-2 border rounded-lg text-center ${appearance.theme === 'light' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50'}`}
                                            onClick={() => handleAppearanceChange('theme', 'light')}
                                        >
                                            <Icon name="Sun" size={20} className="mx-auto mb-1" />
                                            <span className="text-xs">Light</span>
                                        </button>
                                        <button
                                            className={`p-2 border rounded-lg text-center ${appearance.theme === 'dark' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50'}`}
                                            onClick={() => handleAppearanceChange('theme', 'dark')}
                                        >
                                            <Icon name="Moon" size={20} className="mx-auto mb-1" />
                                            <span className="text-xs">Dark</span>
                                        </button>
                                        <button
                                            className={`p-2 border rounded-lg text-center ${appearance.theme === 'system' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50'}`}
                                            onClick={() => handleAppearanceChange('theme', 'system')}
                                        >
                                            <Icon name="Monitor" size={20} className="mx-auto mb-1" />
                                            <span className="text-xs">System</span>
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Density</label>
                                    <label className="relative inline-flex items-center cursor-pointer mt-2">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={appearance.compactMode}
                                            onChange={() => handleAppearanceChange('compactMode', !appearance.compactMode)}
                                        />
                                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        <span className="ml-3 text-sm font-medium text-muted-foreground">Compact Mode</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Security */}
                        <div className="bg-card border border-border rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                                <Icon name="Shield" size={20} className="mr-2 text-primary" />
                                Security & Privacy
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                    <div>
                                        <p className="font-medium text-foreground">Two-Factor Authentication</p>
                                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={security.twoFactor}
                                            onChange={() => handleSecurityChange('twoFactor', !security.twoFactor)}
                                        />
                                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                    <div>
                                        <p className="font-medium text-foreground">Password</p>
                                        <p className="text-sm text-muted-foreground">Last updated 3 months ago</p>
                                    </div>
                                    <Button variant="outline" size="sm" iconName="Key">Change Password</Button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                    <div>
                                        <p className="font-medium text-foreground">Session Timeout</p>
                                        <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
                                    </div>
                                    <select
                                        className="bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        value={security.sessionTimeout}
                                        onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                                    >
                                        <option value="15">15 minutes</option>
                                        <option value="30">30 minutes</option>
                                        <option value="60">1 hour</option>
                                        <option value="240">4 hours</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <Button variant="outline">Reset to Defaults</Button>
                            <Button variant="default" iconName="Check">Save Changes</Button>
                        </div>

                    </div>
                </main>

                <QuickActionToolbar />
            </div>
        </div>
    );
};

export default Settings;
