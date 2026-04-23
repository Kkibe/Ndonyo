import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Support.scss';

export default function Support() {
  const { isAdmin, loading } = useAuth();
  const [tickets, setTickets] = useState([
    { id: 'TKT001', customer: 'John Doe', subject: 'Order not received', message: 'My order was marked delivered but I haven\'t received it.', status: 'open', priority: 'high', date: '2024-01-15' },
    { id: 'TKT002', customer: 'Jane Smith', subject: 'Wrong item shipped', message: 'I received a different product than what I ordered.', status: 'in-progress', priority: 'medium', date: '2024-01-14' },
  ]);

  if (loading) return <div className="loader">Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  const updateStatus = async (id, status) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status } : t));
    Swal.fire('Updated', `Ticket status: ${status}`, 'success');
  };

  return (
    <div className="support-page">
      <div className="page-header"><h1>Support Tickets</h1><button className="btn-new" onClick={() => Swal.fire('Coming Soon', 'New ticket feature coming soon.', 'info')}>+ New Ticket</button></div>
      <div className="tickets-list">{tickets.map(ticket => (<div key={ticket.id} className="ticket-card"><div className="ticket-header"><div><strong>#{ticket.id}</strong> - {ticket.customer}</div><div className={`status ${ticket.status}`}>{ticket.status}</div><div className="priority">{ticket.priority}</div></div><div className="ticket-subject">{ticket.subject}</div><div className="ticket-message">{ticket.message}</div><div className="ticket-date">{ticket.date}</div><div className="ticket-actions"><button className="btn-reply" onClick={() => Swal.fire('Reply', 'Reply feature coming soon.', 'info')}>Reply</button><button className="btn-resolve" onClick={() => updateStatus(ticket.id, 'resolved')}>Resolve</button></div></div>))}</div>
    </div>
  );
}