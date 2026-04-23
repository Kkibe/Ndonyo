import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { LocalShipping, Delete, Edit, Add } from '@mui/icons-material';
import './Shipping.scss';

export default function Shipping() {
  const { isAdmin, loading } = useAuth();
  const [zones, setZones] = useState([
    { id: 1, name: 'Nairobi', rate: 150, estimatedDays: '1-2 days', freeShippingThreshold: 5000, isActive: true, cities: ['Nairobi CBD', 'Westlands', 'Karen', 'Langata'] },
    { id: 2, name: 'Major Cities', rate: 250, estimatedDays: '2-3 days', freeShippingThreshold: 7000, isActive: true, cities: ['Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'] },
    { id: 3, name: 'Other Towns', rate: 350, estimatedDays: '3-5 days', freeShippingThreshold: 10000, isActive: true, cities: ['Kericho', 'Kitale', 'Nanyuki', 'Nyeri'] },
    { id: 4, name: 'International', rate: 1500, estimatedDays: '7-14 days', freeShippingThreshold: 25000, isActive: false, countries: ['USA', 'UK', 'Canada', 'Australia'] },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    rate: 0, 
    estimatedDays: '', 
    freeShippingThreshold: 0,
    isActive: true,
    locations: []
  });
  const [locationInput, setLocationInput] = useState('');

  if (loading) return <div className="loader">Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addLocation = () => {
    if (locationInput && !formData.locations.includes(locationInput)) {
      setFormData(prev => ({
        ...prev,
        locations: [...prev.locations, locationInput]
      }));
      setLocationInput('');
    }
  };

  const removeLocation = (location) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.filter(l => l !== location)
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.rate || !formData.estimatedDays) {
      Swal.fire('Error', 'Please fill in all required fields.', 'error');
      return;
    }

    const newZone = {
      id: editingZone ? editingZone.id : Date.now(),
      ...formData,
      rate: parseFloat(formData.rate),
      freeShippingThreshold: parseFloat(formData.freeShippingThreshold),
      [formData.name === 'International' ? 'countries' : 'cities']: formData.locations
    };

    if (editingZone) {
      setZones(zones.map(z => z.id === editingZone.id ? newZone : z));
      Swal.fire('Updated!', 'Shipping zone updated successfully.', 'success');
    } else {
      setZones([...zones, newZone]);
      Swal.fire('Added!', 'Shipping zone added successfully.', 'success');
    }
    setShowModal(false);
    setEditingZone(null);
    setFormData({ name: '', rate: 0, estimatedDays: '', freeShippingThreshold: 0, isActive: true, locations: [] });
    setLocationInput('');
  };

  const deleteZone = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Zone?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete'
    });
    if (result.isConfirmed) {
      setZones(zones.filter(z => z.id !== id));
      Swal.fire('Deleted!', 'Shipping zone deleted.', 'success');
    }
  };

  const toggleZoneStatus = async (id) => {
    setZones(zones.map(z => z.id === id ? { ...z, isActive: !z.isActive } : z));
    Swal.fire('Updated!', 'Zone status updated.', 'success');
  };

  const editZone = (zone) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      rate: zone.rate,
      estimatedDays: zone.estimatedDays,
      freeShippingThreshold: zone.freeShippingThreshold,
      isActive: zone.isActive,
      locations: zone.cities || zone.countries || []
    });
    setShowModal(true);
  };

  return (
    <div className="shipping-page">
      <div className="page-header">
        <h1>Shipping Zones</h1>
        <button className="btn-add" onClick={() => { setEditingZone(null); setFormData({ name: '', rate: 0, estimatedDays: '', freeShippingThreshold: 0, isActive: true, locations: [] }); setShowModal(true); }}>
          <Add /> Add Zone
        </button>
      </div>
      
      <div className="shipping-stats">
        <div className="stat-card">
          <LocalShipping className="stat-icon" />
          <div className="stat-info">
            <h3>{zones.length}</h3>
            <p>Total Zones</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>{zones.filter(z => z.isActive).length}</h3>
            <p>Active Zones</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>KSH {Math.min(...zones.map(z => z.rate))}</h3>
            <p>Lowest Rate</p>
          </div>
        </div>
      </div>

      <div className="shipping-zones">
        {zones.map(zone => (
          <div key={zone.id} className={`zone-card ${!zone.isActive ? 'inactive' : ''}`}>
            <div className="zone-header">
              <h3>{zone.name}</h3>
              <div className="zone-status">
                <span className={`status-badge ${zone.isActive ? 'active' : 'inactive'}`}>
                  {zone.isActive ? 'Active' : 'Inactive'}
                </span>
                <button className="btn-toggle" onClick={() => toggleZoneStatus(zone.id)}>
                  {zone.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
            <div className="zone-details">
              <div className="zone-info">
                <p><strong>Shipping Rate:</strong> <span className="rate">KSH {zone.rate.toLocaleString()}</span></p>
                <p><strong>Delivery Time:</strong> {zone.estimatedDays}</p>
                <p><strong>Free Shipping Over:</strong> KSH {zone.freeShippingThreshold.toLocaleString()}</p>
              </div>
              <div className="zone-locations">
                <strong>📍 {zone.cities ? 'Cities' : 'Countries'}:</strong>
                <div className="location-tags">
                  {(zone.cities || zone.countries || []).map(loc => (
                    <span key={loc} className="location-tag">{loc}</span>
                  ))}
                </div>
              </div>
              <div className="zone-actions">
                <button className="btn-edit" onClick={() => editZone(zone)}><Edit /> Edit</button>
                <button className="btn-delete" onClick={() => deleteZone(zone.id)}><Delete /> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Zone Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingZone ? 'Edit Shipping Zone' : 'Add Shipping Zone'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Zone Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Nairobi" />
                </div>
                <div className="form-group">
                  <label>Shipping Rate (KSH) *</label>
                  <input type="number" name="rate" value={formData.rate} onChange={handleInputChange} placeholder="0" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Estimated Delivery *</label>
                  <input type="text" name="estimatedDays" value={formData.estimatedDays} onChange={handleInputChange} placeholder="e.g., 1-2 days" />
                </div>
                <div className="form-group">
                  <label>Free Shipping Threshold (KSH)</label>
                  <input type="number" name="freeShippingThreshold" value={formData.freeShippingThreshold} onChange={handleInputChange} placeholder="0" />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} id="isActive" />
                <label htmlFor="isActive">Active Zone</label>
              </div>

              <div className="form-group">
                <label>{formData.name === 'International' ? 'Countries' : 'Cities'} (Optional)</label>
                <div className="location-input">
                  <input 
                    type="text" 
                    value={locationInput} 
                    onChange={(e) => setLocationInput(e.target.value)} 
                    placeholder={formData.name === 'International' ? "e.g., USA, UK, Canada" : "e.g., Nairobi, Mombasa"} 
                  />
                  <button type="button" onClick={addLocation}>Add</button>
                </div>
                <div className="location-tags-list">
                  {formData.locations.map(loc => (
                    <span key={loc} className="location-tag" onClick={() => removeLocation(loc)}>
                      {loc} ×
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-submit" onClick={handleSubmit}>{editingZone ? 'Update' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}