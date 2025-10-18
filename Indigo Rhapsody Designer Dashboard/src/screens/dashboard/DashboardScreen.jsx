import React, { useEffect, useState } from "react";
import { DashboardScreenWrap } from "./DashboardScreen.styles";
import { 
  dashBoardDesigner,
  dashBoardDesignerSales,
  dashBoardDesignerProducts,
  getOrderForTable
} from "../../service/dashBoardService";
import { getProductsBydesigner } from "../../service/productsService";
import { Icons } from "../../assets/icons";
import { 
  TrendingUpIcon, 
  ShoppingBagIcon, 
  CurrencyDollarIcon,
  CubeIcon,
  EyeIcon,
  ClockIcon
} from '../../components/common/Icons';
import { toast } from "react-toastify";

const DashboardScreen = () => {
  const [dashboardData, setDashboardData] = useState({
    orders: 0,
    sales: 0,
    products: 0,
    activeProducts: 0,
    outOfStockProducts: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [ordersRes, salesRes, productsRes, recentOrdersRes] = await Promise.all([
          dashBoardDesigner(),
          dashBoardDesignerSales(),
          dashBoardDesignerProducts(),
          getOrderForTable()
        ]);

        // Get products data to calculate statistics
        const productsData = await getProductsBydesigner();
        const products = productsData?.products || [];
        
        const activeProducts = products.filter(product => product.enabled === true).length;
        const outOfStockProducts = products.filter(product => product.stock === 0 || product.stock <= 0).length;
        
        setDashboardData({
          orders: ordersRes?.totalOrders || 0,
          sales: salesRes?.totalSalesAmount || 0,
          products: productsRes?.totalProducts || 0,
          activeProducts,
          outOfStockProducts,
          recentOrders: recentOrdersRes?.orders?.slice(0, 5) || []
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const statsCards = [
    {
      title: "Total Orders",
      value: dashboardData.orders,
      icon: ShoppingBagIcon,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      trend: "+12%",
      trendUp: true
    },
    {
      title: "Total Sales",
      value: formatCurrency(dashboardData.sales),
      icon: CurrencyDollarIcon,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      trend: "+8.2%",
      trendUp: true
    },
    {
      title: "Total Products",
      value: dashboardData.products,
      icon: CubeIcon,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      trend: "+5.1%",
      trendUp: true
    },
    {
      title: "Active Products",
      value: dashboardData.activeProducts,
      icon: EyeIcon,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      trend: "+3.2%",
      trendUp: true
    },
    
  ];

  return (
    <DashboardScreenWrap>
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Dashboard Overview</h1>
          <p className="dashboard-subtitle">Welcome back! Here's what's happening with your business today.</p>
        </div>
        <div className="header-actions">
          <button className="export-btn">
            <img src={Icons.ExportDark} alt="Export" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statsCards.map((card, index) => (
          <div key={index} className={`stat-card ${card.bgColor}`}>
            <div className="stat-card-header">
              <div className={`stat-icon ${card.color}`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div className="stat-trend">
                <span className={`trend-indicator ${card.trendUp ? 'trend-up' : 'trend-down'}`}>
                  {card.trendUp ? '↗' : '↘'}
                </span>
                <span className="trend-text">{card.trend}</span>
              </div>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{card.value}</h3>
              <p className="stat-title">{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Section */}
      <div className="recent-orders-section">
        <div className="section-header">
          <h2 className="section-title">Recent Orders</h2>
          <button className="view-all-btn">View All Orders</button>
        </div>
        
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading recent orders...</p>
          </div>
        ) : dashboardData.recentOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <ShoppingBagIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3>No orders yet</h3>
            <p>When you receive orders, they'll appear here</p>
          </div>
        ) : (
          <div className="orders-table">
            <div className="table-header">
              <div className="header-cell">Order ID</div>
              <div className="header-cell">Customer</div>
              <div className="header-cell">Amount</div>
              <div className="header-cell">Status</div>
              <div className="header-cell">Date</div>
              <div className="header-cell">Actions</div>
            </div>
            
            <div className="table-body">
              {dashboardData.recentOrders.map((order, index) => (
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
                  <div className="table-cell amount">
                    <span className="amount-value">₹{order.amount}</span>
                  </div>
                  <div className="table-cell status">
                    <span className={`status-badge ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="table-cell date">
                    <span className="date-text">
                      {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="table-cell actions">
                    <button className="action-btn view-btn">
                      <EyeIcon className="w-4 h-4" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3 className="section-title">Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-card">
            <div className="action-icon">
              <CubeIcon className="w-6 h-6" />
            </div>
            <span>Add Product</span>
          </button>
          <button className="action-card">
            <div className="action-icon">
              <ShoppingBagIcon className="w-6 h-6" />
            </div>
            <span>View Orders</span>
          </button>
          
        
        </div>
      </div>
    </DashboardScreenWrap>
  );
};

export default DashboardScreen;
