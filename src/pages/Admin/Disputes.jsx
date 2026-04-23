import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Disputes.scss';

export default function Disputes() {
  const { isAdmin, loading } = useAuth();
  const [disputes, setDisputes] = useState([
    { id: 'DSP001', orderId: 'ORD12345', buyer: 'John Doe', seller: 'SportsHub KE', reason: 'Item not received', amount: 3500, priority: 'high', status: 'open', date: '2024-01-15' },
    { id: 'DSP002', orderId: 'ORD12346', buyer: 'Jane Smith', seller: 'Footwear Pro', reason: 'Not as described', amount: 2800, priority: 'medium', status: 'investigating', date: '2024-01-14' },
  ]);

  if (loading) return <div className="loader">Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  const resolveDispute = async (id, resolution) => {
    setDisputes(disputes.map(d => d.id === id ? { ...d, status: 'resolved' } : d));
    Swal.fire('Resolved!', `Dispute resolved: ${resolution}`, 'success');
  };

  return (
    <div className="disputes-page">
      <div className="page-header"><h1>Dispute Resolution</h1></div>
      <div className="disputes-table-container"><table className="disputes-table"><thead><tr><th>Dispute ID</th><th>Order ID</th><th>Buyer vs Seller</th><th>Reason</th><th>Amount</th><th>Priority</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>{disputes.map(d => (<tr key={d.id}><td>{d.id}</td><td>{d.orderId}</td><td>{d.buyer} vs {d.seller}</td><td>{d.reason}</td><td>KSH {d.amount}</td><td className={`priority-${d.priority}`}>{d.priority}</td><td>{d.status}</td>
      <td>{d.status === 'open' && <button className="btn-resolve" onClick={() => resolveDispute(d.id, 'Refund buyer')}>Resolve</button>}</td></tr>))}</tbody></table></div>
    </div>
  );
}