import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  ShoppingBag, People, Inventory, AttachMoney, 
  TrendingUp, TrendingDown, Star, Warning,
  LocalShipping, Receipt, Assessment, Refresh
} from '@mui/icons-material';
import './Overview.scss';

export default function Overview() {
  const { isAdmin, loading } = useAuth();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    avgOrderValue: 0,
    conversionRate: 0,
    pendingOrders: 0,
    lowStock: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [chartData, setChartData] = useState({});

  if (loading) return <div className="loader">Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="overview-page">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <button className="refresh-btn"><Refresh /> Refresh</button>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon revenue"><AttachMoney /></div>
          <div className="stat-info">
            <h3>KSH {stats.totalRevenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
            <span className="trend up"><TrendingUp /> +12.5%</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orders"><ShoppingBag /></div>
          <div className="stat-info">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
            <span className="trend up"><TrendingUp /> +8.2%</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon users"><People /></div>
          <div className="stat-info">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
            <span className="trend up"><TrendingUp /> +15.3%</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon products"><Inventory /></div>
          <div className="stat-info">
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
            <span className="trend down"><TrendingDown /> -2.1%</span>
          </div>
        </div>
      </div>
      
      <div className="charts-row">
        <div className="chart-card revenue-chart">
          <h3>Revenue Overview</h3>
          <div className="chart-placeholder">📊 Revenue Chart</div>
        </div>
        <div className="chart-card orders-chart">
          <h3>Order Statistics</h3>
          <div className="chart-placeholder">📈 Orders Chart</div>
        </div>
      </div>
      
      <div className="recent-section">
        <div className="recent-orders">
          <h3>Recent Orders</h3>
          <table>
            <thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody><tr><td colSpan="4" className="text-center">No orders yet</td></tr></tbody>
          </table>
        </div>
        <div className="top-products">
          <h3>Top Selling Products</h3>
          <div className="product-list">No products yet</div>
        </div>
      </div>
    </div>
  );
}