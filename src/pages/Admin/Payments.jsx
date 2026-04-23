import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Edit, Save, Cancel, Settings } from '@mui/icons-material';
import './Payments.scss';

export default function Payments() {
  const { isAdmin, loading } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, name: 'M-Pesa', icon: '📱', enabled: true, description: 'Mobile money payment for Kenya', apiKey: '', testMode: true },
    { id: 2, name: 'PayPal', icon: '💳', enabled: true, description: 'International credit/debit cards', clientId: '', secretKey: '', testMode: true },
    { id: 3, name: 'Cryptocurrency', icon: '₿', enabled: true, description: 'Bitcoin, Ethereum, USDT', apiKey: '', testMode: true },
    { id: 4, name: 'Google Pay', icon: '🔵', enabled: false, description: 'Digital wallet payment', merchantId: '', testMode: true },
    { id: 5, name: 'Bank Transfer', icon: '🏦', enabled: false, description: 'Direct bank transfer', accountName: '', accountNumber: '', bankName: '' },
  ]);
  const [editingMethod, setEditingMethod] = useState(null);
  const [formData, setFormData] = useState({});

  if (loading) return <div className="loader">Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  const toggleMethod = async (id) => {
    setPaymentMethods(methods => methods.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
    Swal.fire('Updated', 'Payment method status updated.', 'success');
  };

  const startEditing = (method) => {
    setEditingMethod(method.id);
    setFormData({ ...method });
  };

  const cancelEditing = () => {
    setEditingMethod(null);
    setFormData({});
  };

  const saveSettings = async (id) => {
    setPaymentMethods(methods => methods.map(m => m.id === id ? { ...m, ...formData } : m));
    setEditingMethod(null);
    Swal.fire('Saved!', 'Payment method settings saved.', 'success');
  };

  const getConfigFields = (method) => {
    switch(method.name) {
      case 'M-Pesa':
        return (
          <div className="config-fields">
            <input type="text" placeholder="API Key" value={formData.apiKey || ''} onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })} />
            <label className="checkbox-label">
              <input type="checkbox" checked={formData.testMode || false} onChange={(e) => setFormData({ ...formData, testMode: e.target.checked })} />
              Test Mode
            </label>
          </div>
        );
      case 'PayPal':
        return (
          <div className="config-fields">
            <input type="text" placeholder="Client ID" value={formData.clientId || ''} onChange={(e) => setFormData({ ...formData, clientId: e.target.value })} />
            <input type="password" placeholder="Secret Key" value={formData.secretKey || ''} onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })} />
            <label className="checkbox-label">
              <input type="checkbox" checked={formData.testMode || false} onChange={(e) => setFormData({ ...formData, testMode: e.target.checked })} />
              Sandbox Mode
            </label>
          </div>
        );
      case 'Google Pay':
        return (
          <div className="config-fields">
            <input type="text" placeholder="Merchant ID" value={formData.merchantId || ''} onChange={(e) => setFormData({ ...formData, merchantId: e.target.value })} />
            <label className="checkbox-label">
              <input type="checkbox" checked={formData.testMode || false} onChange={(e) => setFormData({ ...formData, testMode: e.target.checked })} />
              Test Environment
            </label>
          </div>
        );
      case 'Bank Transfer':
        return (
          <div className="config-fields">
            <input type="text" placeholder="Bank Name" value={formData.bankName || ''} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} />
            <input type="text" placeholder="Account Name" value={formData.accountName || ''} onChange={(e) => setFormData({ ...formData, accountName: e.target.value })} />
            <input type="text" placeholder="Account Number" value={formData.accountNumber || ''} onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="payments-page">
      <div className="page-header">
        <h1>Payment Methods</h1>
      </div>
      
      <div className="payment-methods-grid">
        {paymentMethods.map(method => (
          <div key={method.id} className={`method-card ${!method.enabled ? 'disabled' : ''}`}>
            <div className="method-header">
              <div className="method-icon">{method.icon}</div>
              <div className="method-info">
                <h3>{method.name}</h3>
                <p>{method.description}</p>
              </div>
              <div className={`toggle-switch ${method.enabled ? 'active' : ''}`} onClick={() => toggleMethod(method.id)}>
                <div className="toggle-slider"></div>
              </div>
            </div>
            
            {editingMethod === method.id ? (
              <div className="method-settings">
                {getConfigFields(method)}
                <div className="settings-actions">
                  <button className="btn-save" onClick={() => saveSettings(method.id)}><Save /> Save</button>
                  <button className="btn-cancel" onClick={cancelEditing}><Cancel /> Cancel</button>
                </div>
              </div>
            ) : (
              <button className="btn-configure" onClick={() => startEditing(method)}>
                <Settings /> Configure
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}