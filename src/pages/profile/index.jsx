import React, { useState } from 'react';
import NavigationSidebar from '../../components/navigation/NavigationSidebar';
import BreadcrumbNavigation from '../../components/navigation/BreadcrumbNavigation';
import NotificationCenter from '../../components/navigation/NotificationCenter';
import UserProfileDropdown from '../../components/navigation/UserProfileDropdown';
import QuickActionToolbar from '../../components/navigation/QuickActionToolbar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Image from '../../components/AppImage';
import Input from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const { user, userProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    // Fallback data if userProfile is missing
    const profileData = {
        name: userProfile?.full_name || 'Admin User',
        email: user?.email || 'admin@distributorhub.com',
        role: userProfile?.role || 'Administrator',
        phone: userProfile?.phone || '+1 (555) 123-4567',
        avatar: userProfile?.avatar_url,
        department: 'Executive Management',
        joinDate: 'January 2024',
        location: 'New York, USA',
        bio: 'Experienced administrator managing partner relationships and global distribution networks.'
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
                                My Profile
                            </h1>
                        </div>

                        <div className="flex items-center space-x-3">
                            <NotificationCenter />
                            <UserProfileDropdown user={profileData} />
                        </div>
                    </div>
                </header>

                <main className="px-4 md:px-6 lg:px-8 py-6">
                    <BreadcrumbNavigation />

                    <div className="max-w-4xl mx-auto">
                        {/* Profile Header Card */}
                        <div className="bg-card border border-border rounded-lg overflow-hidden mb-6 relative">
                            <div className="h-32 bg-primary/10 w-full"></div>
                            <div className="px-6 pb-6">
                                <div className="relative flex justify-between items-end -mt-12 mb-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full border-4 border-card bg-background overflow-hidden">
                                            <Image
                                                src={profileData.avatar}
                                                alt={profileData.name}
                                                className="w-full h-full object-cover"
                                                fallbackText={profileData.name.charAt(0)}
                                            />
                                        </div>
                                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-success border-2 border-card rounded-full"></div>
                                    </div>
                                    <Button
                                        variant={isEditing ? "default" : "outline"}
                                        onClick={() => setIsEditing(!isEditing)}
                                    >
                                        <Icon name={isEditing ? "Save" : "Edit"} size={16} className="mr-2" />
                                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                                    </Button>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-foreground">{profileData.name}</h2>
                                    <p className="text-muted-foreground">{profileData.role} • {profileData.department}</p>
                                    <p className="text-sm text-muted-foreground mt-2 max-w-2xl">{profileData.bio}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Contact Info */}
                            <div className="md:col-span-2 space-y-6">
                                <div className="bg-card border border-border rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-muted-foreground uppercase">Email Address</label>
                                            <div className="flex items-center space-x-2 text-foreground">
                                                <Icon name="Mail" size={16} className="text-muted-foreground" />
                                                <span>{profileData.email}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-muted-foreground uppercase">Phone Number</label>
                                            <div className="flex items-center space-x-2 text-foreground">
                                                <Icon name="Phone" size={16} className="text-muted-foreground" />
                                                <span>{profileData.phone}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-muted-foreground uppercase">Location</label>
                                            <div className="flex items-center space-x-2 text-foreground">
                                                <Icon name="MapPin" size={16} className="text-muted-foreground" />
                                                <span>{profileData.location}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-muted-foreground uppercase">Join Date</label>
                                            <div className="flex items-center space-x-2 text-foreground">
                                                <Icon name="Calendar" size={16} className="text-muted-foreground" />
                                                <span>{profileData.joinDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-card border border-border rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">Security Settings</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-primary/10 rounded-md text-primary">
                                                    <Icon name="Lock" size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">Password</p>
                                                    <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm">Change</Button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-primary/10 rounded-md text-primary">
                                                    <Icon name="Shield" size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">Two-Factor Authentication</p>
                                                    <p className="text-sm text-success">Enabled</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm">Configure</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats/Activity Side Panel */}
                            <div className="space-y-6">
                                <div className="bg-card border border-border rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">Activity Overview</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Logins (30d)</span>
                                            <span className="font-medium text-foreground">24</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Actions Performed</span>
                                            <span className="font-medium text-foreground">156</span>
                                        </div>
                                        <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden mt-2">
                                            <div className="bg-primary h-full rounded-full" style={{ width: '75%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>

                <QuickActionToolbar />
            </div>
        </div>
    );
};

export default Profile;
