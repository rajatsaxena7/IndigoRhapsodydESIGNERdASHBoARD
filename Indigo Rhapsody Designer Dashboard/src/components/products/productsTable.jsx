import React, { useEffect, useState } from "react";
import { getProductsBydesigner, updateProductStatus, updateReturnPolicy } from "../../service/productsService";
import EditProductModal from "../../components/editProductsa/editProductsModal";
import { 
  EyeIcon, 
  PencilIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  MagnifyingGlassIcon,
  CubeIcon
} from "../common/Icons";
import { toast } from "react-toastify";
import { ProductsTableContainer } from "./productsTable.styles";

const ProductsTable = ({ searchTerm = "", filter = "all", onProductsLoaded }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isEditingReturnDetails, setIsEditingReturnDetails] = useState(false);
  const [returnDetailsForm, setReturnDetailsForm] = useState({
    returnable: false,
    return_Policy: "",
    return_Window: "",
    return_Window_Unit: "days"
  });
  const [savingReturnDetails, setSavingReturnDetails] = useState(false);
  const PRODUCTS_PER_PAGE = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProductsBydesigner();
        const productsData = data.products || [];
        setProducts(productsData);
        setFilteredProducts(productsData);
        if (onProductsLoaded) {
          onProductsLoaded(productsData);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message);
        setLoading(false);
        toast.error("Failed to load products");
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, filter, products]);

  const filterProducts = () => {
    let filtered = products;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.subCategory?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter((product) => {
        switch (filter) {
          case "active":
            return product.enabled === true;
          case "inactive":
            return product.enabled === false;
          default:
            return true;
        }
      });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    // Initialize return details form with product data
    setReturnDetailsForm({
      returnable: product.returnable || false,
      return_Policy: product.return_Policy || product.returnPolicy || "",
      return_Window: product.return_Window || product.returnWindow || "",
      return_Window_Unit: product.return_Window_Unit || product.returnWindowUnit || "days"
    });
    setIsEditingReturnDetails(false);
    setShowViewModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedProduct(null);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedProduct(null);
    setIsEditingReturnDetails(false);
    setReturnDetailsForm({
      returnable: false,
      return_Policy: "",
      return_Window: "",
      return_Window_Unit: "days"
    });
  };

  const handleReturnDetailsChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    
    setReturnDetailsForm(prev => ({
      ...prev,
      [name]: fieldValue
    }));
  };

  const handleSaveReturnDetails = async () => {
    if (!selectedProduct?._id) return;

    // Validation
    if (returnDetailsForm.returnable) {
      if (!returnDetailsForm.return_Policy.trim()) {
        toast.error("Return policy is required when returnable is enabled");
        return;
      }
      if (!returnDetailsForm.return_Window || returnDetailsForm.return_Window <= 0) {
        toast.error("Return window must be a positive number");
        return;
      }
    }

    try {
      setSavingReturnDetails(true);
      const returnPolicyData = {
        returnable: returnDetailsForm.returnable,
        return_Policy: returnDetailsForm.return_Policy,
        return_Window: parseInt(returnDetailsForm.return_Window) || 0,
        return_Window_Unit: returnDetailsForm.return_Window_Unit,
      };

      await updateReturnPolicy(selectedProduct._id, returnPolicyData);
      
      // Update the product in the local state
      const updatedProduct = {
        ...selectedProduct,
        ...returnPolicyData
      };
      setSelectedProduct(updatedProduct);
      
      // Update in products list
      const updatedProducts = products.map(p =>
        p._id === selectedProduct._id ? updatedProduct : p
      );
      setProducts(updatedProducts);
      
      toast.success("Return details updated successfully");
      setIsEditingReturnDetails(false);
    } catch (error) {
      console.error("Error updating return details:", error);
      toast.error(`Failed to update return details: ${error.message}`);
    } finally {
      setSavingReturnDetails(false);
    }
  };

  const handleImageClick = (images) => {
    setSelectedImages(images);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImages([]);
  };

  const handleToggleStatus = async (product) => {
    try {
      const updatedProduct = await updateProductStatus(
        product._id,
        !product.enabled
      );
      
      const updatedProducts = products.map((p) =>
        p._id === updatedProduct._id ? updatedProduct : p
      );
      
      setProducts(updatedProducts);
      toast.success(`Product ${updatedProduct.enabled ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error("Error updating product status:", error);
      toast.error("Failed to update product status");
    }
  };

  const formatCurrency = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (enabled) => {
    return enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };



  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-icon">
          <XCircleIcon className="w-12 h-12 text-red-400" />
        </div>
        <h3>Error loading products</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <CubeIcon className="w-12 h-12 text-gray-400" />
        </div>
        <h3>No products found</h3>
        <p>No products match your current search criteria</p>
      </div>
    );
  }

  return (
    <ProductsTableContainer>
      <div className="products-table-container">
      <div className="products-table">
                 <div className="table-header">
           <div className="header-cell">Product</div>
           <div className="header-cell">Category</div>
           <div className="header-cell">Price</div>
           <div className="header-cell">Variants</div>
           <div className="header-cell">Status</div>
           <div className="header-cell">Actions</div>
         </div>
        
        <div className="table-body">
          {paginatedProducts.map((product, index) => (
            <div key={product._id || index} className="table-row">
              <div className="table-cell product">
                <div className="product-info">
                  <div className="product-image">
                    {product.coverImage ? (
                      <img 
                        src={product.coverImage} 
                        alt={product.productName}
                        onClick={() => handleImageClick(product.variants?.[0]?.imageList || [product.coverImage])}
                        className="product-thumbnail"
                      />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </div>
                  <div className="product-details">
                    <span className="product-name">{product.productName}</span>
                    <span className="product-sku">SKU: {product.sku || 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              <div className="table-cell category">
                <div className="category-info">
                  <span className="category-name">{product.category?.name || 'N/A'}</span>
                  <span className="subcategory-name">{product.subCategory?.name || 'N/A'}</span>
                </div>
              </div>
              
              <div className="table-cell price">
                <span className="price-value">{formatCurrency(product.price || 0)}</span>
              </div>
              
                             <div className="table-cell variants">
                 <div className="variants-info">
                   <span className="variants-count">
                     {product.variants?.length || 0} Variants
                   </span>
                   <div className="variants-details">
                     {product.variants?.slice(0, 2).map((variant, idx) => (
                       <span key={idx} className="variant-tag">
                         {variant.color}
                       </span>
                     ))}
                     {product.variants?.length > 2 && (
                       <span className="variant-more">+{product.variants.length - 2} more</span>
                     )}
                   </div>
                 </div>
               </div>
              
              <div className="table-cell status">
                <span className={`status-badge ${getStatusColor(product.enabled)}`}>
                  {product.enabled ? (
                    <CheckCircleIcon className="w-4 h-4" />
                  ) : (
                    <XCircleIcon className="w-4 h-4" />
                  )}
                  <span className="status-text">
                    {product.enabled ? 'Active' : 'Inactive'}
                  </span>
                </span>
              </div>
              
              <div className="table-cell actions">
                <div className="action-buttons">
                  <button 
                    className="action-btn view-btn"
                    onClick={() => handleView(product)}
                    title="View Product"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(product)}
                    title="Edit Product"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  
                  <button 
                    className={`action-btn toggle-btn ${product.enabled ? 'deactivate' : 'activate'}`}
                    onClick={() => handleToggleStatus(product)}
                    title={product.enabled ? 'Deactivate Product' : 'Activate Product'}
                  >
                    {product.enabled ? (
                      <XCircleIcon className="w-4 h-4" />
                    ) : (
                      <CheckCircleIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`page-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="image-modal-overlay" onClick={closeImageModal}>
          <div className="image-modal" onClick={(e) => e.stopPropagation()}>
            <div className="image-modal-header">
              <h3>Product Images</h3>
              <button className="close-btn" onClick={closeImageModal}>
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="image-modal-body">
              {selectedImages.map((image, index) => (
                <img 
                  key={index} 
                  src={image} 
                  alt={`Product ${index + 1}`}
                  className="modal-image"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showEditModal && selectedProduct && (
        <EditProductModal
          show={showEditModal}
          onClose={closeEditModal}
          product={selectedProduct}
        />
      )}
      
      {showViewModal && selectedProduct && (
        <div className="view-modal-overlay" onClick={closeViewModal}>
          <div className="view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="view-modal-header">
              <h3>Product Details</h3>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {!isEditingReturnDetails ? (
                  <button
                    className="action-btn edit-btn"
                    onClick={() => setIsEditingReturnDetails(true)}
                    style={{ padding: '6px 12px', fontSize: '14px' }}
                    title="Edit Return Details"
                  >
                    <PencilIcon className="w-4 h-4" />
                    <span style={{ marginLeft: '5px' }}>Edit Return Details</span>
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className="action-btn save-btn"
                      onClick={handleSaveReturnDetails}
                      disabled={savingReturnDetails}
                      style={{ padding: '6px 12px', fontSize: '14px', backgroundColor: '#28a745', color: 'white' }}
                    >
                      {savingReturnDetails ? 'Saving...' : 'Save Return Details'}
                    </button>
                    <button
                      className="action-btn cancel-btn"
                      onClick={() => {
                        setIsEditingReturnDetails(false);
                        // Reset form to original values
                        setReturnDetailsForm({
                          returnable: selectedProduct.returnable || false,
                          return_Policy: selectedProduct.return_Policy || selectedProduct.returnPolicy || "",
                          return_Window: selectedProduct.return_Window || selectedProduct.returnWindow || "",
                          return_Window_Unit: selectedProduct.return_Window_Unit || selectedProduct.returnWindowUnit || "days"
                        });
                      }}
                      style={{ padding: '6px 12px', fontSize: '14px', backgroundColor: '#6c757d', color: 'white' }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
                <button className="close-btn" onClick={closeViewModal}>
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
                         <div className="view-modal-body">
               <div className="product-detail-grid">
                 <div className="detail-item">
                   <label>Product Name:</label>
                   <span>{selectedProduct.productName}</span>
                 </div>
                 <div className="detail-item">
                   <label>SKU:</label>
                   <span>{selectedProduct.sku || 'N/A'}</span>
                 </div>
                 <div className="detail-item">
                   <label>Category:</label>
                   <span>{selectedProduct.category?.name || 'N/A'}</span>
                 </div>
                 <div className="detail-item">
                   <label>Sub Category:</label>
                   <span>{selectedProduct.subCategory?.name || 'N/A'}</span>
                 </div>
                 <div className="detail-item">
                   <label>Price:</label>
                   <span>{formatCurrency(selectedProduct.price)}</span>
                 </div>
                 <div className="detail-item">
                   <label>MRP:</label>
                   <span>{formatCurrency(selectedProduct.mrp || selectedProduct.price)}</span>
                 </div>
                 <div className="detail-item">
                   <label>Material:</label>
                   <span>{selectedProduct.material || 'N/A'}</span>
                 </div>
                 <div className="detail-item">
                   <label>Fabric:</label>
                   <span>{selectedProduct.fabric || 'N/A'}</span>
                 </div>
                 <div className="detail-item">
                   <label>Fit:</label>
                   <span>{selectedProduct.fit || 'N/A'}</span>
                 </div>
                 <div className="detail-item">
                   <label>Status:</label>
                   <span className={`status-badge ${getStatusColor(selectedProduct.enabled)}`}>
                     {selectedProduct.enabled ? 'Active' : 'Inactive'}
                   </span>
                 </div>
                 <div className="detail-item">
                   <label>Returnable:</label>
                   {isEditingReturnDetails ? (
                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                       <input
                         type="checkbox"
                         name="returnable"
                         checked={returnDetailsForm.returnable}
                         onChange={handleReturnDetailsChange}
                       />
                       <span>{returnDetailsForm.returnable ? 'Yes' : 'No'}</span>
                     </div>
                   ) : (
                     <span>{selectedProduct.returnable ? 'Yes' : 'No'}</span>
                   )}
                 </div>
                 {selectedProduct.returnable && (
                   <>
                     <div className="detail-item full-width">
                       <label>Return Policy:</label>
                       {isEditingReturnDetails ? (
                         <textarea
                           name="return_Policy"
                           value={returnDetailsForm.return_Policy}
                           onChange={handleReturnDetailsChange}
                           style={{ width: '100%', minHeight: '80px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                           placeholder="Enter return policy details"
                         />
                       ) : (
                         <span>{selectedProduct.return_Policy || selectedProduct.returnPolicy || 'N/A'}</span>
                       )}
                     </div>
                     <div className="detail-item">
                       <label>Return Window:</label>
                       {isEditingReturnDetails ? (
                         <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                           <input
                             type="number"
                             name="return_Window"
                             value={returnDetailsForm.return_Window}
                             onChange={handleReturnDetailsChange}
                             min="1"
                             style={{ width: '80px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                           />
                           <select
                             name="return_Window_Unit"
                             value={returnDetailsForm.return_Window_Unit}
                             onChange={handleReturnDetailsChange}
                             style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                           >
                             <option value="days">Days</option>
                             <option value="weeks">Weeks</option>
                             <option value="months">Months</option>
                           </select>
                         </div>
                       ) : (
                         <span>
                           {selectedProduct.return_Window || selectedProduct.returnWindow || 'N/A'} 
                           {' '}
                           {selectedProduct.return_Window_Unit || selectedProduct.returnWindowUnit || 'days'}
                         </span>
                       )}
                     </div>
                   </>
                 )}
                 {!selectedProduct.returnable && isEditingReturnDetails && (
                   <>
                     <div className="detail-item full-width">
                       <label>Return Policy:</label>
                       <textarea
                         name="return_Policy"
                         value={returnDetailsForm.return_Policy}
                         onChange={handleReturnDetailsChange}
                         style={{ width: '100%', minHeight: '80px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                         placeholder="Enter return policy details"
                       />
                     </div>
                     <div className="detail-item">
                       <label>Return Window:</label>
                       <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                         <input
                           type="number"
                           name="return_Window"
                           value={returnDetailsForm.return_Window}
                           onChange={handleReturnDetailsChange}
                           min="1"
                           style={{ width: '80px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                         />
                         <select
                           name="return_Window_Unit"
                           value={returnDetailsForm.return_Window_Unit}
                           onChange={handleReturnDetailsChange}
                           style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                         >
                           <option value="days">Days</option>
                           <option value="weeks">Weeks</option>
                           <option value="months">Months</option>
                         </select>
                       </div>
                     </div>
                   </>
                 )}
                 <div className="detail-item">
                   <label>Trending:</label>
                   <span>{selectedProduct.isTrending ? 'Yes' : 'No'}</span>
                 </div>
                 <div className="detail-item full-width">
                   <label>Description:</label>
                   <span>{selectedProduct.description || 'No description available'}</span>
                 </div>
                 
                 {/* Variants Section */}
                 {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                   <div className="detail-item full-width">
                     <label>Variants:</label>
                     <div className="variants-section">
                       {selectedProduct.variants.map((variant, idx) => (
                         <div key={idx} className="variant-card">
                           <div className="variant-header">
                             <h4 className="variant-color">{variant.color}</h4>
                             <span className="variant-price">{formatCurrency(variant.sizes?.[0]?.price || selectedProduct.price)}</span>
                           </div>
                           <div className="variant-images">
                             {variant.imageList?.slice(0, 3).map((image, imgIdx) => (
                               <img 
                                 key={imgIdx} 
                                 src={image} 
                                 alt={`${variant.color} variant`}
                                 className="variant-thumbnail"
                                 onClick={() => handleImageClick(variant.imageList)}
                               />
                             ))}
                           </div>
                           <div className="variant-sizes">
                             <h5>Sizes & Stock:</h5>
                             <div className="size-grid">
                               {variant.sizes?.map((size, sizeIdx) => (
                                 <div key={sizeIdx} className="size-item">
                                   <span className="size-name">{size.size}</span>
                                   <span className="size-stock">{size.stock}</span>
                                   <span className="size-price">{formatCurrency(size.price)}</span>
                                 </div>
                               ))}
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
               </div>
             </div>
          </div>
        </div>
      )}
      </div>
    </ProductsTableContainer>
  );
};

export default ProductsTable;
