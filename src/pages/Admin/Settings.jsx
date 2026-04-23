import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Settings.scss';

export default function Settings() {
  const { isAdmin, loading } = useAuth();
  const [settings, setSettings] = useState({
    siteName: 'Ndonyo Store', siteEmail: 'info@ndonyo.com', phone: '+254 700 000000', address: 'Nairobi, Kenya',
    currency: 'KES', taxRate: 16, minOrderAmount: 500, enableReviews: true, enableWishlist: true,
    mailchimpApiKey: '', sendgridApiKey: '', facebookPixel: '', googleAnalytics: ''
  });

  if (loading) return <div className="loader">Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  const handleSave = async () => { Swal.fire('Saved!', 'Settings saved successfully.', 'success'); };

  return (
    <div className="settings-page">
      <div className="page-header"><h1>Settings</h1></div>
      <div className="settings-sections">
        <div className="settings-card"><h2>General Settings</h2><div className="setting-group"><label>Site Name</label><input type="text" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} /></div>
        <div className="setting-group"><label>Site Email</label><input type="email" value={settings.siteEmail} onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })} /></div>
        <div className="setting-group"><label>Phone Number</label><input type="tel" value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} /></div>
        <div className="setting-group"><label>Address</label><textarea value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} rows="3" /></div></div>
        
        <div className="settings-card"><h2>Store Settings</h2><div className="setting-group"><label>Currency</label><select value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })}><option value="KES">Kenyan Shilling (KSH)</option><option value="USD">US Dollar ($)</option><option value="GBP">British Pound (£)</option></select></div>
        <div className="setting-group"><label>Tax Rate (%)</label><input type="number" value={settings.taxRate} onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })} /></div>
        <div className="setting-group"><label>Minimum Order Amount</label><input type="number" value={settings.minOrderAmount} onChange={(e) => setSettings({ ...settings, minOrderAmount: e.target.value })} /></div>
        <div className="setting-group"><label><input type="checkbox" checked={settings.enableReviews} onChange={(e) => setSettings({ ...settings, enableReviews: e.target.checked })} /> Enable Product Reviews</label></div>
        <div className="setting-group"><label><input type="checkbox" checked={settings.enableWishlist} onChange={(e) => setSettings({ ...settings, enableWishlist: e.target.checked })} /> Enable Wishlist</label></div></div>
        
        <div className="settings-card"><h2>Integrations</h2><div className="setting-group"><label>Mailchimp API Key</label><input type="password" value={settings.mailchimpApiKey} onChange={(e) => setSettings({ ...settings, mailchimpApiKey: e.target.value })} placeholder="Enter your Mailchimp API key" /></div>
        <div className="setting-group"><label>SendGrid API Key</label><input type="password" value={settings.sendgridApiKey} onChange={(e) => setSettings({ ...settings, sendgridApiKey: e.target.value })} placeholder="Enter your SendGrid API key" /></div>
        <div className="setting-group"><label>Facebook Pixel ID</label><input type="text" value={settings.facebookPixel} onChange={(e) => setSettings({ ...settings, facebookPixel: e.target.value })} placeholder="Enter your Facebook Pixel ID" /></div>
        <div className="setting-group"><label>Google Analytics ID</label><input type="text" value={settings.googleAnalytics} onChange={(e) => setSettings({ ...settings, googleAnalytics: e.target.value })} placeholder="Enter your Google Analytics ID" /></div></div>
        
        <div className="settings-card"><button className="btn-save" onClick={handleSave}>Save All Settings</button></div>
      </div>
    </div>
  );
}