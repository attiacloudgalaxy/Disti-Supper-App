import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const ProductCatalog = ({ onAddProduct, selectedProducts }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedManufacturer, setSelectedManufacturer] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  const products = [
  {
    id: 'PRD-001',
    name: 'Dell PowerEdge R750 Server',
    sku: 'DELL-R750-32GB',
    category: 'Servers',
    manufacturer: 'Dell',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_173f3d6b6-1766834501145.png",
    imageAlt: 'Modern silver Dell PowerEdge rack server with blue LED indicators and ventilation grilles in professional data center environment',
    description: 'High-performance 2U rack server with dual Intel Xeon processors',
    basePrice: 8499.00,
    partnerPrice: 7649.10,
    msrp: 9999.00,
    stock: 45,
    availability: 'In Stock',
    margin: 10,
    category_code: 'servers'
  },
  {
    id: 'PRD-002',
    name: 'Cisco Catalyst 9300 Switch',
    sku: 'CISCO-C9300-48P',
    category: 'Networking',
    manufacturer: 'Cisco',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1fcdde552-1764701303098.png",
    imageAlt: 'Professional black Cisco network switch with multiple ethernet ports and LED status indicators mounted in server rack',
    description: '48-port PoE+ managed switch with 10G uplinks',
    basePrice: 12500.00,
    partnerPrice: 11250.00,
    msrp: 14999.00,
    stock: 28,
    availability: 'In Stock',
    margin: 10,
    category_code: 'networking'
  },
  {
    id: 'PRD-003',
    name: 'HPE ProLiant DL380 Gen10',
    sku: 'HPE-DL380-64GB',
    category: 'Servers',
    manufacturer: 'HPE',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_173f3d6b6-1766834501145.png",
    imageAlt: 'Silver HPE ProLiant server with black front panel showing drive bays and status LEDs in modern data center rack',
    description: '2U rack server with dual Intel Xeon Gold processors',
    basePrice: 9200.00,
    partnerPrice: 8280.00,
    msrp: 10999.00,
    stock: 12,
    availability: 'Low Stock',
    margin: 10,
    category_code: 'servers'
  },
  {
    id: 'PRD-004',
    name: 'Lenovo ThinkSystem SR650',
    sku: 'LEN-SR650-128GB',
    category: 'Servers',
    manufacturer: 'Lenovo',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_15c277225-1767161649198.png",
    imageAlt: 'Black Lenovo ThinkSystem server with red accent lighting and multiple drive bays in professional server room setting',
    description: '2U rack server optimized for virtualization workloads',
    basePrice: 10500.00,
    partnerPrice: 9450.00,
    msrp: 12499.00,
    stock: 8,
    availability: 'Low Stock',
    margin: 10,
    category_code: 'servers'
  },
  {
    id: 'PRD-005',
    name: 'VMware vSphere Enterprise Plus',
    sku: 'VMW-VSPHERE-EP',
    category: 'Software',
    manufacturer: 'VMware',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f049bc91-1764664252978.png",
    imageAlt: 'Modern computer screen displaying VMware virtualization software interface with blue and white dashboard showing virtual machine management',
    description: 'Enterprise virtualization platform with advanced features',
    basePrice: 4995.00,
    partnerPrice: 4495.50,
    msrp: 5995.00,
    stock: 150,
    availability: 'In Stock',
    margin: 10,
    category_code: 'software'
  },
  {
    id: 'PRD-006',
    name: 'NetApp AFF A400 Storage',
    sku: 'NTAP-AFF-A400',
    category: 'Storage',
    manufacturer: 'NetApp',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_106f0ed3c-1766591677157.png",
    imageAlt: 'Professional storage array system with blue LED indicators and multiple drive bays in modern data center environment',
    description: 'All-flash storage system with 100TB capacity',
    basePrice: 45000.00,
    partnerPrice: 40500.00,
    msrp: 52999.00,
    stock: 5,
    availability: 'Limited',
    margin: 10,
    category_code: 'storage'
  },
  {
    id: 'PRD-007',
    name: 'Microsoft Windows Server 2022',
    sku: 'MS-WS2022-STD',
    category: 'Software',
    manufacturer: 'Microsoft',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_11043aade-1767627803856.png",
    imageAlt: 'Computer monitor showing Microsoft Windows Server interface with blue and white administrative dashboard and system management tools',
    description: 'Standard edition with 16 core licenses',
    basePrice: 1099.00,
    partnerPrice: 989.10,
    msrp: 1299.00,
    stock: 200,
    availability: 'In Stock',
    margin: 10,
    category_code: 'software'
  },
  {
    id: 'PRD-008',
    name: 'Aruba 6300M Switch',
    sku: 'ARUBA-6300M-48G',
    category: 'Networking',
    manufacturer: 'Aruba',
    image: "https://images.unsplash.com/photo-1561575130-7528293c5b13",
    imageAlt: 'Black Aruba network switch with green LED indicators and multiple gigabit ethernet ports in professional network rack',
    description: '48-port managed switch with advanced security features',
    basePrice: 8900.00,
    partnerPrice: 8010.00,
    msrp: 10499.00,
    stock: 18,
    availability: 'In Stock',
    margin: 10,
    category_code: 'networking'
  }];


  const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'servers', label: 'Servers' },
  { value: 'networking', label: 'Networking' },
  { value: 'storage', label: 'Storage' },
  { value: 'software', label: 'Software' }];


  const manufacturers = [
  { value: 'all', label: 'All Manufacturers' },
  { value: 'Dell', label: 'Dell' },
  { value: 'HPE', label: 'HPE' },
  { value: 'Cisco', label: 'Cisco' },
  { value: 'Lenovo', label: 'Lenovo' },
  { value: 'VMware', label: 'VMware' },
  { value: 'NetApp', label: 'NetApp' },
  { value: 'Microsoft', label: 'Microsoft' },
  { value: 'Aruba', label: 'Aruba' }];


  const stockOptions = [
  { value: 'all', label: 'All Stock Levels' },
  { value: 'in-stock', label: 'In Stock' },
  { value: 'low-stock', label: 'Low Stock' },
  { value: 'limited', label: 'Limited' }];


  const filteredProducts = useMemo(() => {
    return products?.filter((product) => {
      const matchesSearch = product?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      product?.sku?.toLowerCase()?.includes(searchQuery?.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product?.category_code === selectedCategory;
      const matchesManufacturer = selectedManufacturer === 'all' || product?.manufacturer === selectedManufacturer;
      const matchesStock = stockFilter === 'all' ||
      stockFilter === 'in-stock' && product?.availability === 'In Stock' ||
      stockFilter === 'low-stock' && product?.availability === 'Low Stock' ||
      stockFilter === 'limited' && product?.availability === 'Limited';

      return matchesSearch && matchesCategory && matchesManufacturer && matchesStock;
    });
  }, [searchQuery, selectedCategory, selectedManufacturer, stockFilter]);

  const getStockBadgeColor = (availability) => {
    switch (availability) {
      case 'In Stock':
        return 'bg-success/10 text-success';
      case 'Low Stock':
        return 'bg-warning/10 text-warning';
      case 'Limited':
        return 'bg-error/10 text-error';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const isProductSelected = (productId) => {
    return selectedProducts?.some((p) => p?.id === productId);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-sm">
      <div className="p-4 md:p-6 border-b border-border">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4 md:mb-6">Product Catalog</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Input
            type="search"
            placeholder="Search products or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="w-full" />

          
          <Select
            options={categories}
            value={selectedCategory}
            onChange={setSelectedCategory}
            placeholder="Category" />

          
          <Select
            options={manufacturers}
            value={selectedManufacturer}
            onChange={setSelectedManufacturer}
            placeholder="Manufacturer" />

          
          <Select
            options={stockOptions}
            value={stockFilter}
            onChange={setStockFilter}
            placeholder="Stock Level" />

        </div>
      </div>
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts?.map((product) =>
          <div
            key={product?.id}
            className="bg-surface border border-border rounded-lg overflow-hidden hover:shadow-elevation-md transition-smooth">

              <div className="relative h-40 md:h-48 overflow-hidden bg-muted">
                <Image
                src={product?.image}
                alt={product?.imageAlt}
                className="w-full h-full object-cover" />

                <div className="absolute top-2 right-2">
                  <span className={`caption px-2 py-1 rounded-full ${getStockBadgeColor(product?.availability)}`}>
                    {product?.availability}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="mb-3">
                  <h3 className="text-sm md:text-base font-semibold text-foreground line-clamp-2 mb-1">
                    {product?.name}
                  </h3>
                  <p className="caption text-muted-foreground">SKU: {product?.sku}</p>
                </div>

                <p className="caption text-muted-foreground line-clamp-2 mb-3">
                  {product?.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="caption text-muted-foreground">Partner Price:</span>
                    <span className="text-sm md:text-base font-semibold text-primary">
                      ${product?.partnerPrice?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="caption text-muted-foreground">MSRP:</span>
                    <span className="caption text-muted-foreground line-through">
                      ${product?.msrp?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="caption text-muted-foreground">Stock:</span>
                    <span className="caption font-medium text-foreground">{product?.stock} units</span>
                  </div>
                </div>

                <Button
                variant={isProductSelected(product?.id) ? "secondary" : "default"}
                size="sm"
                fullWidth
                iconName={isProductSelected(product?.id) ? "Check" : "Plus"}
                iconPosition="left"
                onClick={() => onAddProduct(product)}
                disabled={isProductSelected(product?.id)}>

                  {isProductSelected(product?.id) ? 'Added' : 'Add to Quote'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {filteredProducts?.length === 0 &&
        <div className="text-center py-12">
            <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No products found matching your filters</p>
          </div>
        }
      </div>
    </div>);

};

export default ProductCatalog;