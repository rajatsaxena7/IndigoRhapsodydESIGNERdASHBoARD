import React, { useState, useEffect } from "react";
import { RecentOrderWrap } from "./productsPage.styles";
import ProductsTable from "../../components/products/productsTable";
import AddProductModal from "../../components/addProduct/addProductModal";
import AddSubCategoryModal from "./addSubCategory";
import UploadBulkModal from "../../components/addProductBulk/addProductBulModal";
import EditVariantModal from "../../components/addProductBulk/editProductBulkModal";
import AddReturnDetailsModal from "../../components/addReturnDetails/addReturnDetailsModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  ArrowUpTrayIcon,
  PencilIcon,
  EyeIcon,
  ArrowPathIcon
} from '../../components/common/Icons';

const ProductsPage = () => {
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddSubCategoryModal, setShowAddSubCategoryModal] = useState(false);
  const [showUploadBulkModal, setShowUploadBulkModal] = useState(false);
  const [showEditVariantModal, setShowEditVariantModal] = useState(false);
  const [showAddReturnDetailsModal, setShowAddReturnDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading products
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddProductClick = () => {
    setShowAddProductModal(true);
  };

  const closeAddProductModal = () => {
    setShowAddProductModal(false);
  };

  const handleAddSubCategoryClick = () => {
    setShowAddSubCategoryModal(true);
  };

  const closeAddSubCategoryModal = () => {
    setShowAddSubCategoryModal(false);
  };

  const handleUploadBulkClick = () => {
    setShowUploadBulkModal(true);
  };

  const closeUploadBulkModal = () => {
    setShowUploadBulkModal(false);
  };

  const handleEditBulkClick = () => {
    setShowEditVariantModal(true);
  };

  const closeEditVariantModal = () => {
    setShowEditVariantModal(false);
  };

  const handleAddReturnDetailsClick = () => {
    setShowAddReturnDetailsModal(true);
  };

  const closeAddReturnDetailsModal = () => {
    setShowAddReturnDetailsModal(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const handleExportCSV = () => {
    try {
      // Get products from the ProductsTable component
      const productsToExport = products.length > 0 ? products : [];
      
      if (productsToExport.length === 0) {
        toast.error("No products to export");
        return;
      }

      // Define CSV headers
      const headers = [
        'Product ID',
        'SKU',
        'Product Name',
        'Category',
        'Sub Category',
        'Designer',
        'Designer Approved',
        'Price',
        'MRP',
        'Discount %',
        'Fit',
        'Fabric',
        'Material',
        'Status',
        'In Stock',
        'Returnable',
        'Trending',
        'Description',
        'Total Variants',
        'Total Sizes',
        'Total Stock',
        'Wishlist Count',
        'Average Rating',
        'Created At',
        'Updated At'
      ];

      // Convert products to CSV rows
      const csvRows = productsToExport.map(product => {
        // Calculate total stock across all variants and sizes
        const totalStock = product.variants?.reduce((total, variant) => {
          return total + (variant.sizes?.reduce((sizeTotal, size) => sizeTotal + (size.stock || 0), 0) || 0);
        }, 0) || 0;

        // Calculate total sizes across all variants
        const totalSizes = product.variants?.reduce((total, variant) => {
          return total + (variant.sizes?.length || 0);
        }, 0) || 0;

        // Calculate discount percentage
        const discountPercent = product.mrp && product.price ? 
          Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

        return [
          product._id || '', // Product ID
          product.sku || '',
          product.productName || '',
          product.category?.name || '',
          product.subCategory?.name || '',
          product.designer?.name || product.designerId || '', // Designer
          product.isApproved ? 'Yes' : 'No', // Designer Approved
          product.price || '',
          product.mrp || product.price || '',
          discountPercent, // Discount %
          product.fit || '',
          product.fabric || '',
          product.material || '',
          product.enabled ? 'Active' : 'Inactive', // Status
          totalStock > 0 ? 'Yes' : 'No', // In Stock
          product.returnable ? 'Yes' : 'No',
          product.isTrending ? 'Yes' : 'No',
          (product.description || '').replace(/"/g, '""'), // Escape quotes in description
          product.variants?.length || 0, // Total Variants
          totalSizes, // Total Sizes
          totalStock, // Total Stock
          product.wishlistCount || 0, // Wishlist Count
          product.averageRating || 0, // Average Rating
          product.createdTime ? new Date(product.createdTime).toISOString() : '', // Created At
          product.updatedTime ? new Date(product.updatedTime).toISOString() : '' // Updated At
        ];
      });

      // Combine headers and rows
      const csvContent = [headers, ...csvRows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Successfully exported ${productsToExport.length} products to CSV`);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Failed to export products to CSV');
    }
  };

  // Export icon component
  const ExportIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  const actionButtons = [
    {
      label: "Add Product",
      icon: PlusIcon,
      onClick: handleAddProductClick,
      primary: true
    },
    {
      label: "Upload Bulk",
      icon: ArrowUpTrayIcon,
      onClick: handleUploadBulkClick,
      primary: false
    },
    {
      label: "Edit Bulk",
      icon: PencilIcon,
      onClick: handleEditBulkClick,
      primary: false
    },
    {
      label: "Export CSV",
      icon: ExportIcon,
      onClick: handleExportCSV,
      primary: false
    },
    {
      label: "Add Category",
      icon: PlusIcon,
      onClick: handleAddSubCategoryClick,
      primary: false
    },
    {
      label: "Add Return Details",
      icon: ArrowPathIcon,
      onClick: handleAddReturnDetailsClick,
      primary: false
    }
  ];

  const filterOptions = [
    { value: "all", label: "All Products" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "out-of-stock", label: "Out of Stock" }
  ];

  return (
    <RecentOrderWrap className="content-area">
      <ToastContainer />
      
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Product Management</h1>
          <p className="page-subtitle">Manage your product catalog, inventory, and categories</p>
        </div>
        
        <div className="header-actions">
          {actionButtons.map((button, index) => (
            <button
              key={index}
              className={`action-btn ${button.primary ? 'primary' : 'secondary'}`}
              onClick={button.onClick}
            >
              <button.icon className="w-4 h-4" />
              <span>{button.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <MagnifyingGlassIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search products by name, category, or SKU..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>
        
        <div className="filter-container">
          <div className="filter-dropdown">
            <FunnelIcon className="filter-icon" />
            <select
              value={selectedFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="filter-select"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>



      {/* Products Table */}
      <div className="table-section">
        <div className="table-header">
          <h2 className="section-title">Products</h2>
       
        </div>
        
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : (
          <div className="table-container">
            <ProductsTable 
              searchTerm={searchTerm} 
              filter={selectedFilter} 
              onProductsLoaded={setProducts}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddProductModal && (
        <AddProductModal
          show={showAddProductModal}
          onClose={closeAddProductModal}
        />
      )}
      
      {showAddSubCategoryModal && (
        <AddSubCategoryModal
          show={showAddSubCategoryModal}
          onClose={closeAddSubCategoryModal}
        />
      )}
      
      {showUploadBulkModal && (
        <UploadBulkModal
          show={showUploadBulkModal}
          onClose={closeUploadBulkModal}
        />
      )}
      
      {showEditVariantModal && (
        <EditVariantModal
          show={showEditVariantModal}
          onClose={closeEditVariantModal}
        />
      )}
      
      {showAddReturnDetailsModal && (
        <AddReturnDetailsModal
          show={showAddReturnDetailsModal}
          onClose={closeAddReturnDetailsModal}
        />
      )}
    </RecentOrderWrap>
  );
};

export default ProductsPage;
