import React, { useEffect, useState } from "react";
import { OrderScreenWrap } from "./orderScreen.styles";
import { getOrderForTable } from "../../service/dashBoardService";
import OrderDetailsModal from "./orderModal";
import ShipOrderModal from "./shipOrdarModal";
import CancelOrderModal from "./cancelOrderModal";
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  EyeIcon,
  TruckIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '../../components/common/Icons';
import { toast } from "react-toastify";

const OrderScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShipModal, setShowShipModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ORDERS_PER_PAGE = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getOrderForTable();
        setOrders(data.orders || []);
        setFilteredOrders(data.orders || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(error.message);
        setLoading(false);
        toast.error("Failed to load orders");
      }
    };
    fetchOrders();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    filterOrders(value, selectedFilter);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    filterOrders(searchTerm, filter);
    setCurrentPage(1);
  };

  const filterOrders = (search, filter) => {
    let filtered = orders;

    // Apply search filter
    if (search) {
      filtered = filtered.filter((order) =>
        order.orderId.toLowerCase().includes(search.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(search.toLowerCase()) ||
        order.city?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter((order) => {
        const status = order.status?.toLowerCase();
        switch (filter) {
          case "pending":
            return status === "pending" || status === "order placed";
          case "shipped":
            return status === "shipped" || status === "order-shipped";
          case "completed":
            return status === "completed";
          case "cancelled":
            return status === "cancelled";
          default:
            return true;
        }
      });
    }

    setFilteredOrders(filtered);
  };

  const handleShipOrder = (order) => {
    setSelectedOrder(order);
    setShowShipModal(true);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleCancelOrder = (order) => {
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  const handleCancelSuccess = () => {
    // Refresh the orders list after successful cancellation
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getOrderForTable();
        setOrders(data.orders || []);
        setFilteredOrders(data.orders || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(error.message);
        setLoading(false);
        toast.error("Failed to load orders");
      }
    };
    fetchOrders();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'shipped':
      case 'order-shipped':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
      case 'order placed':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'shipped':
      case 'order-shipped':
        return <TruckIcon className="w-4 h-4" />;
      case 'pending':
      case 'order placed':
        return <ClockIcon className="w-4 h-4" />;
      case 'cancelled':
        return <XCircleIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);

  const statsCards = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: ShoppingBagIcon,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Pending Orders",
      value: orders.filter(order => 
        order.status?.toLowerCase() === 'pending' || 
        order.status?.toLowerCase() === 'order placed'
      ).length,
      icon: ClockIcon,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600"
    },
    {
      title: "Shipped Orders",
      value: orders.filter(order => 
        order.status?.toLowerCase() === 'shipped' || 
        order.status?.toLowerCase() === 'order-shipped'
      ).length,
      icon: TruckIcon,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Total Revenue",
      value: formatCurrency(orders.reduce((sum, order) => sum + (order.amount || 0), 0)),
      icon: CurrencyDollarIcon,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    }
  ];

  const filterOptions = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "shipped", label: "Shipped" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" }
  ];

  return (
    <OrderScreenWrap>
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Order Management</h1>
          <p className="page-subtitle">Track and manage all customer orders</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-section">
        {statsCards.map((card, index) => (
          <div key={index} className={`stat-card ${card.bgColor}`}>
            <div className="stat-card-header">
              <div className={`stat-icon ${card.color}`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{card.value}</h3>
              <p className="stat-title">{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <MagnifyingGlassIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search orders by ID, customer name, or city..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
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

      {/* Orders Table */}
      <div className="orders-section">
        <div className="section-header">
          <h2 className="section-title">Orders</h2>
          <div className="section-actions">
            <span className="results-count">
              Showing {((currentPage - 1) * ORDERS_PER_PAGE) + 1}-{Math.min(currentPage * ORDERS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length} orders
            </span>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading orders...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <div className="error-icon">
              <XCircleIcon className="w-12 h-12 text-red-400" />
            </div>
            <h3>Error loading orders</h3>
            <p>{error}</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <ShoppingBagIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3>No orders found</h3>
            <p>No orders match your current search criteria</p>
          </div>
        ) : (
          <>
            <div className="orders-table">
              <div className="table-header">
                <div className="header-cell">Order ID</div>
                <div className="header-cell">Customer</div>
                <div className="header-cell">Products</div>
                <div className="header-cell">Amount</div>
                <div className="header-cell">Status</div>
                <div className="header-cell">Date</div>
                <div className="header-cell">Actions</div>
              </div>
              
              <div className="table-body">
                {paginatedOrders.map((order, index) => (
                  <div key={index} className="table-row">
                    <div className="table-cell order-id">
                      <span className="order-number">#{order.orderId}</span>
                    </div>
                    <div className="table-cell customer">
                      <div className="customer-info">
                        <span className="customer-name">{order.customerName || 'N/A'}</span>
                        <span className="customer-location">{order.city}, {order.state}</span>
                      </div>
                    </div>
                    <div className="table-cell products">
                      <div className="products-list">
                        {order.products?.slice(0, 2).map((product, idx) => (
                          <span key={idx} className="product-item">
                            {product.productName} ({product.quantity})
                          </span>
                        ))}
                        {order.products?.length > 2 && (
                          <span className="more-products">+{order.products.length - 2} more</span>
                        )}
                      </div>
                    </div>
                    <div className="table-cell amount">
                      <span className="amount-value">{formatCurrency(order.amount)}</span>
                    </div>
                    <div className="table-cell status">
                      <span className={`status-badge ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="status-text">{order.status}</span>
                      </span>
                    </div>
                    <div className="table-cell date">
                      <span className="date-text">
                        {formatDate(order.createdAt || Date.now())}
                      </span>
                    </div>
                    <div className="table-cell actions">
                      <div className="action-buttons">
                        <button 
                          className="action-btn view-btn"
                          onClick={() => handleViewOrder(order)}
                        >
                          <EyeIcon className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        {(order.status?.toLowerCase() === 'pending' || 
                          order.status?.toLowerCase() === 'order placed') && (
                          <>
                            <button 
                              className="action-btn ship-btn"
                              onClick={() => handleShipOrder(order)}
                            >
                              <TruckIcon className="w-4 h-4" />
                              <span>Ship</span>
                            </button>
                            <button 
                              className="action-btn cancel-btn"
                              onClick={() => handleCancelOrder(order)}
                            >
                              <XCircleIcon className="w-4 h-4" />
                              <span>Cancel</span>
                            </button>
                          </>
                        )}
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
          </>
        )}
      </div>

      {/* Modals */}
      {showOrderModal && selectedOrder && (
        <OrderDetailsModal
          visible={showOrderModal}
          onClose={() => setShowOrderModal(false)}
          order={selectedOrder}
        />
      )}
      
      {showShipModal && selectedOrder && (
        <ShipOrderModal
          show={showShipModal}
          onClose={() => setShowShipModal(false)}
          order={selectedOrder}
        />
      )}
      
      {showCancelModal && selectedOrder && (
        <CancelOrderModal
          show={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          order={selectedOrder}
          onCancelSuccess={handleCancelSuccess}
        />
      )}
      

    </OrderScreenWrap>
  );
};

export default OrderScreen;
