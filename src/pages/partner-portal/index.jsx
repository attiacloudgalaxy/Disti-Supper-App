import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import NavigationSidebar from '../../components/navigation/NavigationSidebar';
import UserProfileDropdown from '../../components/navigation/UserProfileDropdown';
import NotificationCenter from '../../components/navigation/NotificationCenter';
import BreadcrumbNavigation from '../../components/navigation/BreadcrumbNavigation';
import QuickActionToolbar from '../../components/navigation/QuickActionToolbar';
import PerformanceMetricsCard from './components/PerformanceMetricsCard';
import TrainingModuleCard from './components/TrainingModuleCard';
import RecentActivityFeed from './components/RecentActivityFeed';
import QuickAccessCard from './components/QuickAccessCard';
import CertificationStatusCard from './components/CertificationStatusCard';
import CommissionSummaryCard from './components/CommissionSummaryCard';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { dealService } from '../../services/dealService';


const PartnerPortal = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { userProfile } = useAuth();
  const [deals, setDeals] = useState([]);
  const [partnerData, setPartnerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPartnerData();
  }, []);

  const loadPartnerData = async () => {
    setLoading(true);
    const [dealsResult] = await Promise.all([
      dealService?.getAll()
    ]);
    
    if (dealsResult?.data) setDeals(dealsResult?.data);
    setLoading(false);
  };

  const totalRevenue = deals?.reduce((sum, deal) => sum + (deal?.value || 0), 0);
  const activeDeals = deals?.filter(d => d?.stage !== 'closed_won' && d?.stage !== 'closed_lost')?.length || 0;
  const commission = totalRevenue * 0.10;

  const performanceMetrics = [
    {
      id: 1,
      label: "Quarterly Revenue",
      value: `$${(totalRevenue / 1000)?.toFixed(0)}K`,
      type: "revenue",
      change: "+18.5%",
      trend: "up",
      progress: 78
    },
    {
      id: 2,
      label: "Active Deals",
      value: activeDeals?.toString(),
      type: "deals",
      change: "+12.3%",
      trend: "up",
      progress: 65
    },
    {
      id: 3,
      label: "Commission Earned",
      value: `$${(commission / 1000)?.toFixed(1)}K`,
      type: "commission",
      change: "+22.8%",
      trend: "up",
      progress: 82
    },
    {
      id: 4,
      label: "Growth Rate",
      value: "34.2%",
      type: "growth",
      change: "+5.4%",
      trend: "up",
      progress: 91
    }
  ];


  const trainingModules = [
  {
    id: 1,
    title: "Advanced Product Knowledge",
    description: "Deep dive into enterprise solutions and technical specifications for complex deployments",
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_1959e051d-1764648553754.png",
    thumbnailAlt: "Professional training session with instructor presenting technical content on large screen to engaged audience in modern conference room",
    status: "in-progress",
    progress: 65,
    duration: "4h 30m",
    lessons: 12,
    certificate: true
  },
  {
    id: 2,
    title: "Sales Techniques Mastery",
    description: "Proven strategies for closing enterprise deals and building long-term client relationships",
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_1efc8391b-1767700962291.png",
    thumbnailAlt: "Business team collaborating around conference table with laptops and documents discussing sales strategies in bright modern office",
    status: "available",
    duration: "3h 45m",
    lessons: 10,
    certificate: true
  },
  {
    id: 3,
    title: "Compliance & Regulations",
    description: "Essential compliance requirements and regulatory frameworks for IT distribution",
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_15b10e24c-1764649836727.png",
    thumbnailAlt: "Professional reviewing compliance documents and legal paperwork with magnifying glass on organized desk with laptop and coffee",
    status: "completed",
    progress: 100,
    duration: "2h 15m",
    lessons: 8,
    certificate: true
  },
  {
    id: 4,
    title: "Partner Portal Navigation",
    description: "Complete guide to utilizing all features and tools available in the partner portal",
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_1ff08559a-1765030143856.png",
    thumbnailAlt: "Computer screen displaying modern dashboard interface with charts and analytics in professional office environment with natural lighting",
    status: "available",
    duration: "1h 30m",
    lessons: 6,
    certificate: false
  }];


  const recentActivities = [
  {
    id: 1,
    type: "approval",
    title: "Deal Approved",
    description: "Your deal registration #DR-2847 with TechCorp Solutions has been approved and is now active",
    timestamp: new Date(Date.now() - 300000),
    actionable: true
  },
  {
    id: 2,
    type: "commission",
    title: "Commission Payment",
    description: "Q4 2025 commission payment of $12,450 has been processed and will be deposited within 2 business days",
    timestamp: new Date(Date.now() - 3600000),
    actionable: true
  },
  {
    id: 3,
    type: "training",
    title: "Training Module Completed",
    description: "Congratulations! You've completed 'Compliance & Regulations' module and earned your certification",
    timestamp: new Date(Date.now() - 7200000),
    actionable: true
  },
  {
    id: 4,
    type: "announcement",
    title: "New Product Launch",
    description: "Introducing the Enterprise Security Suite 2026 - now available for partner registration with enhanced margins",
    timestamp: new Date(Date.now() - 10800000),
    actionable: true
  },
  {
    id: 5,
    type: "quote",
    title: "Quote Request Received",
    description: "New quote request from GlobalTech Industries for 150 units of Enterprise Server Package",
    timestamp: new Date(Date.now() - 14400000),
    actionable: true
  },
  {
    id: 6,
    type: "document",
    title: "Document Shared",
    description: "Q1 2026 Product Roadmap and Pricing Guide has been shared to your document library",
    timestamp: new Date(Date.now() - 18000000),
    actionable: false
  }];


  const quickAccessItems = [
  {
    id: 1,
    label: "Register New Deal",
    description: "Submit deal registration",
    icon: "Briefcase",
    path: "/deal-management"
  },
  {
    id: 2,
    label: "Generate Quote",
    description: "Create customer quote",
    icon: "FileText",
    path: "/quote-generation"
  },
  {
    id: 3,
    label: "Product Catalog",
    description: "Browse products & pricing",
    icon: "Package",
    path: "/inventory-management"
  },
  {
    id: 4,
    label: "Marketing Resources",
    description: "Access marketing materials",
    icon: "Image",
    path: null
  },
  {
    id: 5,
    label: "Support Center",
    description: "Get technical assistance",
    icon: "HelpCircle",
    path: null
  },
  {
    id: 6,
    label: "Partner Directory",
    description: "Connect with partners",
    icon: "Users",
    path: "/partner-management"
  }];


  const certifications = [
  {
    id: 1,
    name: "Enterprise Solutions Specialist",
    issuer: "DistributorHub Academy",
    status: "active",
    issueDate: "03/15/2025",
    expiryDate: "03/15/2027"
  },
  {
    id: 2,
    name: "Advanced Sales Professional",
    issuer: "DistributorHub Academy",
    status: "expiring",
    issueDate: "06/20/2024",
    expiryDate: "06/20/2026"
  },
  {
    id: 3,
    name: "Compliance & Regulations",
    issuer: "DistributorHub Academy",
    status: "active",
    issueDate: "01/10/2026",
    expiryDate: "01/10/2028"
  },
  {
    id: 4,
    name: "Cloud Solutions Architect",
    issuer: "DistributorHub Academy",
    status: "in-progress",
    issueDate: "-",
    expiryDate: "-",
    progress: 45
  }];


  const commissionSummary = {
    totalEarned: 487250,
    growth: 22.8,
    pending: 48725,
    paid: 438525,
    recentTransactions: [
    {
      id: 1,
      type: "credit",
      description: "Q4 2025 Commission",
      date: "01/05/2026",
      amount: 12450
    },
    {
      id: 2,
      type: "credit",
      description: "Deal #DR-2847 Bonus",
      date: "01/08/2026",
      amount: 3200
    },
    {
      id: 3,
      type: "credit",
      description: "Q1 2026 Advance",
      date: "01/10/2026",
      amount: 8500
    }]

  };

  const handleEnrollModule = () => {
    // TODO: Implement - console.log("Enrolling in training module");
  };

  const handleContinueModule = () => {
    // TODO: Implement - console.log("Continuing training module");
  };

  return (
    <>
      <Helmet>
        <title>Partner Portal - DistributorHub</title>
        <meta name="description" content="Access your partner dashboard, training resources, performance metrics, and business tools on DistributorHub" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <NavigationSidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />


        <div
          className={`transition-all duration-250 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'}`
          }>

          <header className="sticky top-0 z-50 bg-card border-b border-border shadow-elevation-sm">
            <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 h-20">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl md:text-2xl font-semibold text-foreground">
                  Partner Portal
                </h1>
              </div>

              <div className="flex items-center space-x-3 md:space-x-4">
                <NotificationCenter />
                <UserProfileDropdown user={{ ...userProfile }} />
              </div>
            </div>
          </header>

          <main className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
            <BreadcrumbNavigation />

            <div className="mb-6 md:mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                    Welcome back, John Anderson
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Here&apos;s your partner performance overview and available resources
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" iconName="Download" iconPosition="left">
                    Export Report
                  </Button>
                  <Button variant="default" iconName="Plus" iconPosition="left">
                    New Deal
                  </Button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading portal...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  {performanceMetrics?.map((metric) => (
                    <PerformanceMetricsCard key={metric?.id} metric={metric} />
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
                  <div className="lg:col-span-2 space-y-6 md:space-y-8">
                    <div>
                      <div className="flex items-center justify-between mb-4 md:mb-6">
                        <h3 className="text-xl md:text-2xl font-semibold text-foreground">
                          Training &amp; Certification
                        </h3>
                        <button className="caption text-primary hover:text-primary/80 transition-smooth font-medium">
                          View All Modules
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {trainingModules?.map((module) => (
                        <TrainingModuleCard
                          key={module.id}
                          module={module}
                          onEnroll={handleEnrollModule}
                          onContinue={handleContinueModule} />
                        ))}
                      </div>
                    </div>

                    <QuickAccessCard title="Quick Access" items={quickAccessItems} />
                  </div>

                  <div className="space-y-6 md:space-y-8">
                    <RecentActivityFeed activities={recentActivities} />
                    <CertificationStatusCard certifications={certifications} />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                  <div className="lg:col-span-2">
                    <CommissionSummaryCard summary={commissionSummary} />
                  </div>

                  <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-sm">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                      <h3 className="text-lg md:text-xl font-semibold text-foreground">
                        Support & Resources
                      </h3>
                    </div>

                    <div className="space-y-3">
                      <button className="w-full flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary hover:shadow-elevation-sm transition-smooth text-left">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon name="HelpCircle" size={20} color="var(--color-primary)" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">Help Center</p>
                          <p className="caption text-muted-foreground">FAQs and guides</p>
                        </div>
                        <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                      </button>

                      <button className="w-full flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary hover:shadow-elevation-sm transition-smooth text-left">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Icon name="MessageSquare" size={20} color="var(--color-accent)" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">Contact Support</p>
                          <p className="caption text-muted-foreground">Get assistance</p>
                        </div>
                        <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                      </button>

                      <button className="w-full flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary hover:shadow-elevation-sm transition-smooth text-left">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                          <Icon name="FileText" size={20} color="var(--color-success)" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">Documentation</p>
                          <p className="caption text-muted-foreground">Technical docs</p>
                        </div>
                        <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                      </button>

                      <button className="w-full flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary hover:shadow-elevation-sm transition-smooth text-left">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                          <Icon name="Users" size={20} color="var(--color-secondary)" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">Community Forum</p>
                          <p className="caption text-muted-foreground">Connect with peers</p>
                        </div>
                        <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                      </button>
                    </div>

                    <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="flex items-start space-x-3">
                        <Icon name="Lightbulb" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-foreground mb-1">
                            Pro Tip
                          </p>
                          <p className="caption text-muted-foreground">
                            Complete all certification modules to unlock premium partner benefits and higher commission tiers
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </main>

          <QuickActionToolbar />
        </div>
      </div>
    </>);

};

export default PartnerPortal;