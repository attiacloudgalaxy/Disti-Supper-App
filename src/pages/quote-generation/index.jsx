import React, { useState, useEffect } from 'react';
import NavigationSidebar from '../../components/navigation/NavigationSidebar';
import UserProfileDropdown from '../../components/navigation/UserProfileDropdown';
import NotificationCenter from '../../components/navigation/NotificationCenter';
import BreadcrumbNavigation from '../../components/navigation/BreadcrumbNavigation';
import QuickActionToolbar from '../../components/navigation/QuickActionToolbar';
import ProductCatalog from './components/ProductCatalog';
import QuoteSummary from './components/QuoteSummary';
import QuoteConfiguration from './components/QuoteConfiguration';
import QuoteTemplates from './components/QuoteTemplates';
import QuotePreview from './components/QuotePreview';
import Icon from '../../components/AppIcon';
import { productService } from '../../services/productService';
import { quoteService } from '../../services/quoteService';


const QuoteGeneration = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [quoteConfig, setQuoteConfig] = useState({
    paymentTerms: 'net-30',
    deliveryMethod: 'standard',
    includeWarranty: true,
    includeSupport: false,
    validityDays: 30
  });
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const { data, error } = await productService?.getAll();
    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const user = {
    name: 'Partner User',
    email: 'partner@example.com',
    role: 'Channel Partner'
  };

  const handleAddProduct = (product) => {
    const existingProduct = selectedProducts?.find(p => p?.id === product?.id);
    if (!existingProduct) {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    setSelectedProducts(selectedProducts?.map(p =>
      p?.id === productId ? { ...p, quantity: newQuantity } : p
    ));
  };

  const handleRemoveItem = (productId) => {
    setSelectedProducts(selectedProducts?.filter(p => p?.id !== productId));
  };

  const handleApplyDiscount = (newDiscount) => {
    setDiscount(newDiscount);
  };

  const handleApplyConfiguration = (config) => {
    setQuoteConfig(config);
    setDiscount(config?.discount);
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
  };

  const calculateSubtotal = () => {
    return selectedProducts?.reduce((sum, item) => sum + (item?.partnerPrice * item?.quantity), 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    return subtotal * (discount / 100);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscount();
    return (subtotal - discountAmount) * 0.08;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscount();
    const tax = calculateTax();
    const supportCost = quoteConfig?.includeSupport ? 299 : 0;
    return subtotal - discountAmount + tax + supportCost;
  };

  const handleGenerateQuote = async () => {
    if (selectedProducts?.length === 0) {
      alert('Please add at least one product to generate a quote');
      return;
    }

    const quoteData = {
      quoteNumber: `QT-${new Date()?.getFullYear()}-${Math.floor(Math.random() * 10000)}`,
      customerName: 'Customer Name',
      customerEmail: 'customer@example.com',
      subtotal: calculateSubtotal(),
      discountPercent: discount,
      discountAmount: calculateDiscount(),
      taxAmount: calculateTax(),
      total: calculateTotal(),
      paymentTerms: quoteConfig?.paymentTerms,
      deliveryMethod: quoteConfig?.deliveryMethod,
      includeWarranty: quoteConfig?.includeWarranty,
      includeSupport: quoteConfig?.includeSupport,
      validityDays: quoteConfig?.validityDays,
      status: 'draft'
    };

    const { data, error } = await quoteService?.create(quoteData);
    if (error) {
      alert('Failed to generate quote: ' + error?.message);
    } else {
      alert('Quote generated successfully!');
      setShowPreview(true);
    }
  };

  const handleExportQuote = (format) => {
    // TODO: Implement - console.log(`Exporting quote as ${format}`);
    alert(`Quote exported as ${format?.toUpperCase()}`);
    setShowPreview(false);
  };

  const tabs = [
    { id: 'products', label: 'Product Catalog', icon: 'Package' },
    { id: 'configuration', label: 'Configuration', icon: 'Settings' },
    { id: 'templates', label: 'Templates', icon: 'FileText' }
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <NavigationSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div
        className={`flex-1 flex flex-col transition-all duration-250 ${
          isSidebarCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[240px]'
        }`}
      >
        <header className="bg-card border-b border-border sticky top-0 z-[90]">
          <div className="px-4 md:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Quote Generation</h1>
                <p className="caption text-muted-foreground mt-1">
                  Create professional quotes with automated pricing and configuration
                </p>
              </div>
              <div className="flex items-center space-x-3 md:space-x-4">
                <NotificationCenter />
                <UserProfileDropdown user={user} />
              </div>
            </div>
            <BreadcrumbNavigation />
          </div>
        </header>

        <main className="flex-1 px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="border-b border-border overflow-x-auto">
                  <div className="flex">
                    {tabs?.map((tab) => (
                      <button
                        key={tab?.id}
                        onClick={() => setActiveTab(tab?.id)}
                        className={`flex items-center space-x-2 px-4 md:px-6 py-3 md:py-4 border-b-2 transition-smooth whitespace-nowrap ${
                          activeTab === tab?.id
                            ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                      >
                        <Icon name={tab?.icon} size={18} />
                        <span className="text-sm md:text-base font-medium">{tab?.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-0">
                  {activeTab === 'products' && (
                    <ProductCatalog
                      onAddProduct={handleAddProduct}
                      selectedProducts={selectedProducts}
                    />
                  )}
                  {activeTab === 'configuration' && (
                    <div className="p-4 md:p-6">
                      <QuoteConfiguration
                        onApplyConfiguration={handleApplyConfiguration}
                        currentDiscount={discount}
                      />
                    </div>
                  )}
                  {activeTab === 'templates' && (
                    <div className="p-4 md:p-6">
                      <QuoteTemplates onSelectTemplate={handleSelectTemplate} />
                    </div>
                  )}
                </div>
              </div>

              {selectedProducts?.length > 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 md:p-6">
                  <div className="flex items-start space-x-3">
                    <Icon name="TrendingUp" size={24} className="text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-foreground mb-2">Quote Optimization Tips</h3>
                      <ul className="space-y-2 caption text-muted-foreground">
                        <li className="flex items-start space-x-2">
                          <Icon name="Check" size={14} className="text-success flex-shrink-0 mt-0.5" />
                          <span>Your current margin is healthy at {((calculateSubtotal() - selectedProducts?.reduce((sum, item) => sum + (item?.basePrice * item?.quantity), 0)) / calculateSubtotal() * 100)?.toFixed(1)}%</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Icon name="Check" size={14} className="text-success flex-shrink-0 mt-0.5" />
                          <span>Consider bundling technical support for additional value</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Icon name="AlertCircle" size={14} className="text-warning flex-shrink-0 mt-0.5" />
                          <span>Volume discounts available for orders over $50,000</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <QuoteSummary
                  quoteItems={selectedProducts}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  discount={discount}
                  onApplyDiscount={handleApplyDiscount}
                  onGenerateQuote={handleGenerateQuote}
                />
              </div>
            </div>
          </div>
        </main>

        <QuickActionToolbar />
      </div>
      {showPreview && (
        <QuotePreview
          quoteData={{
            items: selectedProducts,
            subtotal: calculateSubtotal(),
            discount: discount,
            discountAmount: calculateDiscount(),
            tax: calculateTax(),
            total: calculateTotal(),
            ...quoteConfig
          }}
          onClose={() => setShowPreview(false)}
          onExport={handleExportQuote}
        />
      )}
    </div>
  );
};

export default QuoteGeneration;