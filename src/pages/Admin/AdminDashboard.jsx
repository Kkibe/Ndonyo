import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Routes, Route, NavLink } from 'react-router-dom';
import {
  Dashboard, ShoppingBag, People, Category, LocalShipping, 
  Payments, Settings, Reviews, Campaign, Loyalty, 
  Security, Analytics, Inventory, Storefront, TrendingUp,
  Receipt, Warning, VerifiedUser, Assignment, Chat
} from '@mui/icons-material';
import Overview from './Overview';
import Orders from './Orders';
import Products from './Products';
import Users from './Users';
import Categories from './Categories';
import Shipping from './Shipping';
import PaymentsAdmin from './Payments';
import ReviewsAdmin from './Reviews';
import Marketing from './Marketing';
import Loyaltyy from './Loyaltyy';
import Analyticss from './Analyticss';
import Returns from './Returns';
import Disputes from './Disputes';
import Verificationn from './Verificationn';
import Support from './Support';
import SettingsAdmin from './Settings';
import './AdminDashboard.scss';

const adminModules = [
  { id: 'overview', name: 'Overview', icon: <Dashboard />, path: '/admin/dashboard', component: Overview },
  { id: 'orders', name: 'Orders', icon: <ShoppingBag />, path: '/admin/orders', component: Orders },
  { id: 'products', name: 'Products', icon: <Inventory />, path: '/admin/products', component: Products },
  { id: 'users', name: 'Users', icon: <People />, path: '/admin/users', component: Users },
  { id: 'categories', name: 'Categories', icon: <Category />, path: '/admin/categories', component: Categories },
  { id: 'shipping', name: 'Shipping', icon: <LocalShipping />, path: '/admin/shipping', component: Shipping },
  { id: 'payments', name: 'Payments', icon: <Payments />, path: '/admin/payments', component: PaymentsAdmin },
  { id: 'reviews', name: 'Reviews', icon: <Reviews />, path: '/admin/reviews', component: ReviewsAdmin },
  { id: 'marketing', name: 'Marketing', icon: <Campaign />, path: '/admin/marketing', component: Marketing },
  { id: 'loyalty', name: 'Loyalty', icon: <Loyalty />, path: '/admin/loyalty', component: Loyaltyy },
  { id: 'analytics', name: 'Analytics', icon: <Analytics />, path: '/admin/analytics', component: Analyticss },
  { id: 'returns', name: 'Returns', icon: <Receipt />, path: '/admin/returns', component: Returns },
  { id: 'disputes', name: 'Disputes', icon: <Warning />, path: '/admin/disputes', component: Disputes },
  { id: 'verification', name: 'Verification', icon: <VerifiedUser />, path: '/admin/verification', component: Verificationn },
  { id: 'support', name: 'Support', icon: <Chat />, path: '/admin/support', component: Support },
  { id: 'settings', name: 'Settings', icon: <Settings />, path: '/admin/settings', component: SettingsAdmin },
];

export default function AdminDashboard() {
  const { isAdmin, loading } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 1245,
    totalRevenue: 2456780,
    totalUsers: 3420,
    totalProducts: 245,
    pendingOrders: 23,
    lowStock: 8,
    pendingReviews: 15,
    activeDisputes: 3
  });

  if (loading) return <div className="loader">Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  // Dashboard content component for the overview route
  const DashboardContent = () => (
    <>
      <div className="content-header">
        <h1>Dashboard Overview</h1>
        <div className="header-actions">
          <button className="btn btn-primary">Download Report</button>
        </div>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon orders"><ShoppingBag /></div>
          <div className="stat-info">
            <h3>{stats.totalOrders.toLocaleString()}</h3>
            <p>Total Orders</p>
            <span className="trend up"><TrendingUp /> +12.5%</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon revenue"><TrendingUp /></div>
          <div className="stat-info">
            <h3>KSH {stats.totalRevenue.toLocaleString()}</h3>
            <p>Revenue</p>
            <span className="trend up"><TrendingUp /> +8.2%</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon users"><People /></div>
          <div className="stat-info">
            <h3>{stats.totalUsers.toLocaleString()}</h3>
            <p>Users</p>
            <span className="trend up"><TrendingUp /> +15.3%</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon products"><Inventory /></div>
          <div className="stat-info">
            <h3>{stats.totalProducts.toLocaleString()}</h3>
            <p>Products</p>
            <span className="trend down"><TrendingDown /> -2.1%</span>
          </div>
        </div>
      </div>
      
      <div className="recent-section">
        <div className="recent-orders">
          <h2>Recent Orders</h2>
          <table className="data-table">
            <thead>
              <tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              <tr><td>#ORD001</td><td>John Doe</td><td>KSH 3,500</td><td><span className="status-badge delivered">Delivered</span></td><td>2024-01-15</td></tr>
              <tr><td>#ORD002</td><td>Jane Smith</td><td>KSH 2,800</td><td><span className="status-badge processing">Processing</span></td><td>2024-01-14</td></tr>
              <tr><td>#ORD003</td><td>Mike Johnson</td><td>KSH 4,200</td><td><span className="status-badge pending">Pending</span></td><td>2024-01-14</td></tr>
            </tbody>
          </table>
        </div>
        
        <div className="alerts-section">
          <h2>Alerts</h2>
          <div className="alert-list">
            <div className="alert warning">⚠️ Low stock alert: {stats.lowStock} products below threshold</div>
            <div className="alert info">📦 {stats.pendingOrders} orders pending shipment</div>
            <div className="alert danger">⚠️ {stats.activeDisputes} disputes awaiting resolution</div>
            <div className="alert success">⭐ {stats.pendingReviews} new reviews pending approval</div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <Storefront className="logo-icon" />
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          {adminModules.map(module => (
            <NavLink key={module.id} to={module.path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">{module.icon}</span>
              <span className="nav-label">{module.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="admin-content">
        <Routes>
          <Route path="/" element={<DashboardContent />} />
          {adminModules.map(module => (
            <Route key={module.id} path={module.path.replace('/admin/', '')} element={<module.component />} />
          ))}
        </Routes>
      </div>
    </div>
  );
}

/*import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet, NavLink } from 'react-router-dom';
import {
  Dashboard, ShoppingBag, People, Category, LocalShipping, 
  Payments, Settings, Reviews, Campaign, Loyalty, 
  Security, Analytics, Inventory, Storefront, TrendingUp,
  Receipt, Warning, VerifiedUser, Assignment, Chat
} from '@mui/icons-material';
import './AdminDashboard.scss';

const adminModules = [
  { id: 'overview', name: 'Overview', icon: <Dashboard />, path: '/admin/dashboard' },
  { id: 'orders', name: 'Orders', icon: <ShoppingBag />, path: '/admin/orders' },
  { id: 'products', name: 'Products', icon: <Inventory />, path: '/admin/products' },
  { id: 'users', name: 'Users', icon: <People />, path: '/admin/users' },
  { id: 'categories', name: 'Categories', icon: <Category />, path: '/admin/categories' },
  { id: 'shipping', name: 'Shipping', icon: <LocalShipping />, path: '/admin/shipping' },
  { id: 'payments', name: 'Payments', icon: <Payments />, path: '/admin/payments' },
  { id: 'reviews', name: 'Reviews', icon: <Reviews />, path: '/admin/reviews' },
  { id: 'marketing', name: 'Marketing', icon: <Campaign />, path: '/admin/marketing' },
  { id: 'loyalty', name: 'Loyalty', icon: <Loyalty />, path: '/admin/loyalty' },
  { id: 'analytics', name: 'Analytics', icon: <Analytics />, path: '/admin/analytics' },
  { id: 'returns', name: 'Returns', icon: <Receipt />, path: '/admin/returns' },
  { id: 'disputes', name: 'Disputes', icon: <Warning />, path: '/admin/disputes' },
  { id: 'verification', name: 'Verification', icon: <VerifiedUser />, path: '/admin/verification' },
  { id: 'support', name: 'Support', icon: <Chat />, path: '/admin/support' },
  { id: 'settings', name: 'Settings', icon: <Settings />, path: '/admin/settings' },
];

export default function AdminDashboard() {
  const { isAdmin, loading } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    pendingOrders: 0,
    lowStock: 0,
    pendingReviews: 0,
    activeDisputes: 0
  });

  if (loading) return <div className="loader">Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <Storefront className="logo-icon" />
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          {adminModules.map(module => (
            <NavLink key={module.id} to={module.path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">{module.icon}</span>
              <span className="nav-label">{module.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="admin-content">
        <div className="content-header">
          <h1>Dashboard Overview</h1>
          <div className="header-actions">
            <button className="btn btn-primary">Download Report</button>
          </div>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon orders"><ShoppingBag /></div>
            <div className="stat-info">
              <h3>{stats.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon revenue"><TrendingUp /></div>
            <div className="stat-info">
              <h3>KSH {stats.totalRevenue.toLocaleString()}</h3>
              <p>Revenue</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon users"><People /></div>
            <div className="stat-info">
              <h3>{stats.totalUsers}</h3>
              <p>Users</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon products"><Inventory /></div>
            <div className="stat-info">
              <h3>{stats.totalProducts}</h3>
              <p>Products</p>
            </div>
          </div>
        </div>
        
        <div className="recent-section">
          <div className="recent-orders">
            <h2>Recent Orders</h2>
            <table className="data-table">
              <thead>
                <tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                <tr><td colSpan="5" className="text-center">No orders yet</td></tr>
              </tbody>
            </table>
          </div>
          
          <div className="alerts-section">
            <h2>Alerts</h2>
            <div className="alert-list">
              <div className="alert warning">⚠️ Low stock alert: 5 products below threshold</div>
              <div className="alert info">📦 3 orders pending shipment</div>
              <div className="alert danger">⚠️ 2 disputes awaiting resolution</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}*/