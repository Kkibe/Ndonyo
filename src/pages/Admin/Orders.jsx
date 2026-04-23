import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/order.service';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Orders.scss';

export default function Orders() {
  const { isAdmin, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (isAdmin) fetchOrders();
  }, [isAdmin]);

  const fetchOrders = async () => {
    const result = await orderService.getAllOrders();
    setOrders(result.orders || []);
  };

  const updateStatus = async (orderId, status) => {
    const result = await Swal.fire({
      title: 'Update Order Status',
      text: `Change order status to ${status}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#00ae58',
      confirmButtonText: 'Yes, update'
    });
    if (result.isConfirmed) {
      await orderService.updateOrderStatus(orderId, status);
      Swal.fire('Updated!', 'Order status updated.', 'success');
      fetchOrders();
    }
  };

  const statusColors = { pending: '#ff9800', processing: '#2196f3', shipped: '#9c27b0', delivered: '#4caf50', cancelled: '#f44336' };
  const filteredOrders = orders.filter(o => filter === 'all' ? true : o.status === filter);

  if (loading) return <div className="loader">Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Orders Management</h1>
        <div className="filters">
          <input type="search" placeholder="Search orders..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      <div className="orders-table-container">
        <table className="orders-table">
          <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.orderId}>
                <td>#{order.orderId?.slice(-8)}</td>
                <td>{order.shippingDetails?.fullName || order.userId}</td>
                <td>{order.items?.length || 0} items</td>
                <td>KSH {order.total?.toLocaleString()}</td>
                <td><span className="status-badge" style={{ background: statusColors[order.status] }}>{order.status}</span></td>
                <td>{new Date(order.createdAt?.toDate()).toLocaleDateString()}</td>
                <td>
                  <select onChange={(e) => updateStatus(order.orderId, e.target.value)} value={order.status}>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button className="view-btn" onClick={() => setSelectedOrder(order)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}