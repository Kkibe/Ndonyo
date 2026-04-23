import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Categories.scss';

export default function Categories() {
  const { isAdmin, loading } = useAuth();
  const [categories, setCategories] = useState([
    { id: 1, name: 'Footwear', icon: '👟', productCount: 45, status: 'active' },
    { id: 2, name: 'Apparel', icon: '👕', productCount: 68, status: 'active' },
    { id: 3, name: 'Accessories', icon: '🧢', productCount: 32, status: 'active' },
    { id: 4, name: 'Equipment', icon: '⚽', productCount: 24, status: 'active' },
    { id: 5, name: 'Training', icon: '💪', productCount: 18, status: 'inactive' },
    { id: 6, name: 'Fan Gear', icon: '🏆', productCount: 56, status: 'active' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', icon: '', status: 'active' });

  if (loading) return <div className="loader">Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  const handleSubmit = async () => {
    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...formData } : c));
      Swal.fire('Updated!', 'Category updated successfully.', 'success');
    } else {
      setCategories([...categories, { id: Date.now(), ...formData, productCount: 0 }]);
      Swal.fire('Added!', 'Category added successfully.', 'success');
    }
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', icon: '', status: 'active' });
  };

  const deleteCategory = async (id) => {
    const result = await Swal.fire({ title: 'Delete Category?', text: 'Products in this category will be uncategorized.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Yes, delete' });
    if (result.isConfirmed) {
      setCategories(categories.filter(c => c.id !== id));
      Swal.fire('Deleted!', 'Category deleted.', 'success');
    }
  };

  const editCategory = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, icon: category.icon, status: category.status });
    setShowModal(true);
  };

  return (
    <div className="categories-page">
      <div className="page-header">
        <h1>Categories Management</h1>
        <button className="btn-add" onClick={() => { setEditingCategory(null); setFormData({ name: '', icon: '', status: 'active' }); setShowModal(true); }}>+ Add Category</button>
      </div>
      
      <div className="categories-grid">
        {categories.map(category => (
          <div key={category.id} className="category-card">
            <div className="category-icon">{category.icon}</div>
            <h3>{category.name}</h3>
            <p>{category.productCount} products</p>
            <span className={`status-badge ${category.status}`}>{category.status}</span>
            <div className="category-actions">
              <button className="btn-edit" onClick={() => editCategory(category)}>Edit</button>
              <button className="btn-delete" onClick={() => deleteCategory(category.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header"><h2>{editingCategory ? 'Edit Category' : 'Add Category'}</h2><button className="close-btn" onClick={() => setShowModal(false)}>×</button></div>
            <div className="modal-body">
              <div className="form-group"><label>Category Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Footwear" /></div>
              <div className="form-group"><label>Category Icon (Emoji)</label><input type="text" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} placeholder="e.g., 👟" maxLength="2" /></div>
              <div className="form-group"><label>Status</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
            </div>
            <div className="modal-footer"><button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button><button className="btn-submit" onClick={handleSubmit}>{editingCategory ? 'Update' : 'Add'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}