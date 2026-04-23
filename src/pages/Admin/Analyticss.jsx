import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import './Analytics.scss';

export default function Analyticss() {
  const { isAdmin, loading } = useAuth();
  const [dateRange, setDateRange] = useState({ start: '2024-01-01', end: '2024-12-31' });

  if (loading) return <div className="loader">Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="analytics-page">
      <div className="page-header"><h1>Analytics & Reports</h1><div className="date-range"><input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} /><input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} /></div></div>
      <div className="charts-grid"><div className="chart-card"><h3>Revenue Trends</h3><div className="chart-placeholder">📈 Revenue Chart</div></div><div className="chart-card"><h3>Order Volume</h3><div className="chart-placeholder">📊 Orders Chart</div></div><div className="chart-card"><h3>Top Products</h3><div className="chart-placeholder">🏆 Top Products</div></div><div className="chart-card"><h3>Customer Acquisition</h3><div className="chart-placeholder">👥 Customer Chart</div></div></div>
    </div>
  );
}