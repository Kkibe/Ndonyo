import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Add, Edit, Delete, CopyAll, Visibility, DateRange, Percent, LocalOffer } from '@mui/icons-material';
import './Marketing.scss';

export default function Marketing() {
  const { isAdmin, loading } = useAuth();
  const [campaigns, setCampaigns] = useState([
    { 
      id: 1, 
      name: 'Welcome Discount', 
      code: 'WELCOME20', 
      discount: '20', 
      discountType: 'percentage', 
      type: 'first_order',
      minOrder: 1000, 
      maxDiscount: 5000,
      usageLimit: 100,
      usedCount: 45,
      startDate: '2024-01-01', 
      endDate: '2024-12-31', 
      active: true,
      description: '20% off for first-time customers'
    },
    { 
      id: 2, 
      name: 'Free Shipping', 
      code: 'FREESHIP', 
      discount: '100', 
      discountType: 'fixed', 
      type: 'shipping',
      minOrder: 5000, 
      usageLimit: 500,
      usedCount: 234,
      startDate: '2024-01-01', 
      endDate: '2024-12-31', 
      active: true,
      description: 'Free shipping on orders over KSH 5000'
    },
    { 
      id: 3, 
      name: 'VIP Exclusive', 
      code: 'VIP15', 
      discount: '15', 
      discountType: 'percentage', 
      type: 'vip_only',
      minOrder: 2000, 
      maxDiscount: 10000,
      usageLimit: 50,
      usedCount: 12,
      startDate: '2024-01-01', 
      endDate: '2024-03-31', 
      active: false,
      description: 'Exclusive 15% off for VIP members'
    },
    { 
      id: 4, 
      name: 'Flash Sale', 
      code: 'FLASH30', 
      discount: '30', 
      discountType: 'percentage', 
      type: 'flash_sale',
      minOrder: 500, 
      maxDiscount: 3000,
      usageLimit: 200,
      usedCount: 187,
      startDate: '2024-02-01', 
      endDate: '2024-02-07', 
      active: true,
      description: 'Limited time 30% off'
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '', code: '', discount: '', discountType: 'percentage', type: 'general',
    minOrder: '', maxDiscount: '', usageLimit: '', startDate: '', endDate: '', description: ''
  });

  if (loading) return <div className="loader">Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleCampaign = async (id) => {
    setCampaigns(campaigns.map(c => c.id === id ? { ...c, active: !c.active } : c));
    Swal.fire('Updated', 'Campaign status updated.', 'success');
  };

  const deleteCampaign = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Campaign?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete'
    });
    if (result.isConfirmed) {
      setCampaigns(campaigns.filter(c => c.id !== id));
      Swal.fire('Deleted!', 'Campaign deleted.', 'success');
    }
  };

  const duplicateCampaign = (campaign) => {
    const newCampaign = {
      ...campaign,
      id: Date.now(),
      name: `${campaign.name} (Copy)`,
      code: `${campaign.code}_COPY`,
      usedCount: 0,
      active: false
    };
    setCampaigns([...campaigns, newCampaign]);
    Swal.fire('Duplicated!', 'Campaign duplicated successfully.', 'success');
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    Swal.fire('Copied!', 'Coupon code copied to clipboard.', 'success');
  };

  const handleSubmit = () => {
    if (editingCampaign) {
      setCampaigns(campaigns.map(c => c.id === editingCampaign.id ? { ...c, ...formData } : c));
      Swal.fire('Updated!', 'Campaign updated successfully.', 'success');
    } else {
      setCampaigns([...campaigns, { ...formData, id: Date.now(), usedCount: 0, active: true }]);
      Swal.fire('Added!', 'Campaign added successfully.', 'success');
    }
    setShowModal(false);
    setEditingCampaign(null);
    setFormData({ name: '', code: '', discount: '', discountType: 'percentage', type: 'general', minOrder: '', maxDiscount: '', usageLimit: '', startDate: '', endDate: '', description: '' });
  };

  const editCampaign = (campaign) => {
    setEditingCampaign(campaign);
    setFormData(campaign);
    setShowModal(true);
  };

  const filteredCampaigns = filter === 'all' ? campaigns : campaigns.filter(c => c.active === (filter === 'active'));

  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.active).length,
    inactive: campaigns.filter(c => !c.active).length,
    totalUses: campaigns.reduce((sum, c) => sum + c.usedCount, 0)
  };

  const getDiscountDisplay = (campaign) => {
    if (campaign.discountType === 'percentage') return `${campaign.discount}% OFF`;
    if (campaign.type === 'shipping') return 'Free Shipping';
    return `KSH ${campaign.discount} OFF`;
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'first_order': return '🎁';
      case 'vip_only': return '⭐';
      case 'flash_sale': return '⚡';
      case 'shipping': return '🚚';
      default: return '🏷️';
    }
  };

  return (
    <div className="marketing-page">
      <div className="page-header">
        <h1>Marketing Campaigns</h1>
        <button className="btn-add" onClick={() => { setEditingCampaign(null); setFormData({ name: '', code: '', discount: '', discountType: 'percentage', type: 'general', minOrder: '', maxDiscount: '', usageLimit: '', startDate: '', endDate: '', description: '' }); setShowModal(true); }}>
          <Add /> New Campaign
        </button>
      </div>

      <div className="marketing-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Campaigns</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.active}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.inactive}</div>
          <div className="stat-label">Inactive</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalUses}</div>
          <div className="stat-label">Total Uses</div>
        </div>
      </div>

      <div className="campaign-filters">
        <div className="filter-buttons">
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`filter-btn ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>Active</button>
          <button className={`filter-btn ${filter === 'inactive' ? 'active' : ''}`} onClick={() => setFilter('inactive')}>Inactive</button>
        </div>
      </div>

      <div className="campaigns-grid">
        {filteredCampaigns.map(campaign => (
          <div key={campaign.id} className={`campaign-card ${!campaign.active ? 'inactive' : ''}`}>
            <div className="campaign-header">
              <div className="campaign-type">{getTypeIcon(campaign.type)}</div>
              <div className={`status-badge ${campaign.active ? 'active' : 'inactive'}`}>
                {campaign.active ? 'Active' : 'Inactive'}
              </div>
            </div>
            <h3>{campaign.name}</h3>
            <p className="campaign-desc">{campaign.description}</p>
            <div className="campaign-code" onClick={() => copyCode(campaign.code)}>
              <strong>{campaign.code}</strong>
              <CopyAll className="copy-icon" />
            </div>
            <div className="discount">{getDiscountDisplay(campaign)}</div>
            <div className="campaign-details">
              <div className="detail"><LocalOffer /> Min Order: KSH {campaign.minOrder.toLocaleString()}</div>
              {campaign.maxDiscount && <div className="detail"><Percent /> Max Discount: KSH {campaign.maxDiscount.toLocaleString()}</div>}
              <div className="detail"><DateRange /> {campaign.startDate} to {campaign.endDate}</div>
              <div className="detail">🎟️ Used: {campaign.usedCount} / {campaign.usageLimit}</div>
            </div>
            <div className="campaign-actions">
              <button className="btn-edit" onClick={() => editCampaign(campaign)}><Edit /> Edit</button>
              <button className="btn-duplicate" onClick={() => duplicateCampaign(campaign)}><CopyAll /> Duplicate</button>
              <button className="btn-delete" onClick={() => deleteCampaign(campaign.id)}><Delete /> Delete</button>
              <button className="btn-toggle" onClick={() => toggleCampaign(campaign.id)}>
                {campaign.active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Campaign Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCampaign ? 'Edit Campaign' : 'Create Campaign'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Campaign Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Summer Sale" />
                </div>
                <div className="form-group">
                  <label>Coupon Code *</label>
                  <input type="text" name="code" value={formData.code} onChange={handleInputChange} placeholder="e.g., SUMMER20" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Discount Type</label>
                  <select name="discountType" value={formData.discountType} onChange={handleInputChange}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (KSH)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Discount Value *</label>
                  <input type="number" name="discount" value={formData.discount} onChange={handleInputChange} placeholder="e.g., 20" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Campaign Type</label>
                  <select name="type" value={formData.type} onChange={handleInputChange}>
                    <option value="general">General</option>
                    <option value="first_order">First Order Only</option>
                    <option value="vip_only">VIP Members Only</option>
                    <option value="flash_sale">Flash Sale</option>
                    <option value="shipping">Free Shipping</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Minimum Order (KSH)</label>
                  <input type="number" name="minOrder" value={formData.minOrder} onChange={handleInputChange} placeholder="0" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Max Discount (KSH)</label>
                  <input type="number" name="maxDiscount" value={formData.maxDiscount} onChange={handleInputChange} placeholder="Optional" />
                </div>
                <div className="form-group">
                  <label>Usage Limit</label>
                  <input type="number" name="usageLimit" value={formData.usageLimit} onChange={handleInputChange} placeholder="Unlimited" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date *</label>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>End Date *</label>
                  <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="2" placeholder="Campaign description..." />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-submit" onClick={handleSubmit}>{editingCampaign ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}