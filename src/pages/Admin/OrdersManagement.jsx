import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/marketplace.service';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './OrdersManagement.scss';

export default function OrdersManagement() {
  const { isAdmin, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (isAdmin) fetchOrders();
  }, [isAdmin]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const result = await orderService.getAllOrders();
      setOrders(result.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const result = await Swal.fire({
      title: 'Update Order Status',
      text: `Change order ${orderId} status to ${newStatus}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#00ae58',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update',
    });
    
    if (result.isConfirmed) {
      try {
        await orderService.updateOrderStatus(orderId, newStatus);
        Swal.fire('Updated!', 'Order status updated successfully.', 'success');
        fetchOrders();
      } catch (error) {
        Swal.fire('Error!', 'Failed to update order status.', 'error');
      }
    }
  };

  const statusColors = {
    pending: '#ff9800',
    processing: '#2196f3',
    shipped: '#9c27b0',
    delivered: '#4caf50',
    cancelled: '#f44336'
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  const filteredOrders = orders.filter(order => filter === 'all' ? true : order.status === filter);

  return (
    <div className="orders-management">
      <div className="page-header">
        <h1>Orders Management</h1>
        <div className="filters">
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
      
      {loadingOrders ? (
        <div className="loader">Loading orders...</div>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.orderId}>
                  <td>#{order.orderId?.slice(-8)}</td>
                  <td>{order.shippingDetails?.fullName || order.userId}</td>
                  <td>{order.items?.length || 0} items</td>
                  <td>KSH {order.total?.toLocaleString()}</td>
                  <td>
                    <span className="status-badge" style={{ background: statusColors[order.status] }}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt?.toDate()).toLocaleDateString()}</td>
                  <td>
                    <select onChange={(e) => updateOrderStatus(order.orderId, e.target.value)} value={order.status}>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}