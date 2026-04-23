import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Returns.scss';

export default function Returns() {
  const { isAdmin, loading } = useAuth();
  const [returns, setReturns] = useState([
    { id: 'RET001', orderId: 'ORD12345', customer: 'John Doe', product: 'Nike Boots', reason: 'Wrong size', amount: 3500, status: 'pending', date: '2024-01-15' },
    { id: 'RET002', orderId: 'ORD12346', customer: 'Jane Smith', product: 'Adidas Jersey', reason: 'Damaged', amount: 2800, status: 'pending', date: '2024-01-14' },
  ]);

  if (loading) return <div className="loader">Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  const updateStatus = async (id, status) => {
    setReturns(returns.map(r => r.id === id ? { ...r, status } : r));
    Swal.fire('Updated!', `Return request ${status}.`, 'success');
  };

  return (
    <div className="returns-page">
      <div className="page-header"><h1>Returns & Refunds</h1></div>
      <div className="returns-table-container"><table className="returns-table"><thead><tr><th>Return ID</th><th>Order ID</th><th>Customer</th><th>Product</th><th>Reason</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>{returns.map(r => (<tr key={r.id}><td>{r.id}</td><td>{r.orderId}</td><td>{r.customer}</td><td>{r.product}</td><td>{r.reason}</td><td>KSH {r.amount}</td><td><span className={`status-badge ${r.status}`}>{r.status}</span></td>
      <td><button className="btn-action" onClick={() => updateStatus(r.id, 'approved')}>Approve</button><button className="btn-action" onClick={() => updateStatus(r.id, 'rejected')}>Reject</button></td></tr>))}</tbody></table></div>
    </div>
  );
}