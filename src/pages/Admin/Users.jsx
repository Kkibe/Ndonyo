import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/marketplace.service';
import { Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Users.scss';

export default function Users() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    isVerified: false,
    isPremium: false,
    subscription: 'Free',
    role: 'user',
    status: 'active'
  });

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

  const fetchUsers = async () => {
    const result = await userService.getAllUsers();
    setUsers(result.users);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username || '',
      email: user.email,
      isVerified: user.isVerified || false,
      isPremium: user.isPremium || false,
      subscription: user.subscription || 'Free',
      role: user.role || 'user',
      status: user.status || 'active'
    });
    setShowModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      await userService.updateUser(editingUser.email, {
        username: formData.username,
        isVerified: formData.isVerified,
        isPremium: formData.isPremium,
        subscription: formData.isPremium ? formData.subscription : null,
        role: formData.role,
        status: formData.status,
        updatedAt: new Date().toISOString()
      });
      
      Swal.fire('Updated!', 'User has been updated successfully.', 'success');
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      Swal.fire('Error', error.message || 'Failed to update user.', 'error');
    }
  };

  const toggleUserStatus = async (user, newStatus) => {
    const result = await Swal.fire({
      title: `${newStatus === 'active' ? 'Activate' : 'Suspend'} User?`,
      text: `Are you sure you want to ${newStatus === 'active' ? 'activate' : 'suspend'} ${user.username || user.email}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'active' ? '#4caf50' : '#f44336',
      confirmButtonText: `Yes, ${newStatus === 'active' ? 'Activate' : 'Suspend'}`
    });
    
    if (result.isConfirmed) {
      await userService.updateUser(user.email, { status: newStatus });
      Swal.fire('Updated!', `User has been ${newStatus === 'active' ? 'activated' : 'suspended'}.`, 'success');
      fetchUsers();
    }
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loader">Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  const subscriptionOptions = ['Free', 'Daily', 'Weekly', 'Monthly', 'Yearly'];
  const roleOptions = ['user', 'seller', 'moderator', 'admin'];

  return (
    <div className="users-page">
      <div className="page-header">
        <h1>Users Management</h1>
        <input 
          type="search" 
          placeholder="Search users..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>
      
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Username</th>
              <th>Email</th>
              <th>Status</th>
              <th>Verified</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Orders</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.email} className={user.status === 'suspended' ? 'suspended-row' : ''}>
                <td><img 
                  src={`https://ui-avatars.com/api/?name=${user.username || user.email}&background=00BFFF&color=fff`} 
                  alt="" 
                  className="user-avatar" 
                /></td>
                <td>{user.username || user.email.split('@')[0]}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`status-badge ${user.status === 'active' ? 'active' : 'suspended'}`}>
                    {user.status === 'active' ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td>
                  <span className={`verified-badge ${user.isVerified ? 'verified' : 'unverified'}`}>
                    {user.isVerified ? '✓ Verified' : '✗ Unverified'}
                  </span>
                </td>
                <td>
                  <span className={`role-badge ${user.role || 'user'}`}>
                    {user.role || 'User'}
                  </span>
                </td>
                <td>{new Date(user.createdAt?.toDate()).toLocaleDateString()}</td>
                <td>{user.orders?.length || 0}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => openEditModal(user)}>Edit</button>
                    {user.status === 'active' ? (
                      <button className="btn-suspend" onClick={() => toggleUserStatus(user, 'suspended')}>Suspend</button>
                    ) : (
                      <button className="btn-activate" onClick={() => toggleUserStatus(user, 'active')}>Activate</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit User: {editingUser?.username || editingUser?.email}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Username</label>
                  <input type="text" name="username" value={formData.username} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={formData.email} disabled className="disabled-input" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Role</label>
                  <select name="role" value={formData.role} onChange={handleInputChange}>
                    {roleOptions.map(role => (
                      <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group checkbox-group">
                  <input type="checkbox" name="isVerified" checked={formData.isVerified} onChange={handleInputChange} id="isVerified" />
                  <label htmlFor="isVerified">Email Verified</label>
                </div>
                <div className="form-group checkbox-group">
                  <input type="checkbox" name="isPremium" checked={formData.isPremium} onChange={handleInputChange} id="isPremium" />
                  <label htmlFor="isPremium">VIP Member</label>
                </div>
              </div>

              {formData.isPremium && (
                <div className="form-group">
                  <label>Subscription Plan</label>
                  <select name="subscription" value={formData.subscription} onChange={handleInputChange}>
                    {subscriptionOptions.map(plan => (
                      <option key={plan} value={plan}>{plan}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="user-stats-info">
                <h4>User Statistics</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Total Orders</span>
                    <span className="stat-value">{editingUser?.orders?.length || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Spent</span>
                    <span className="stat-value">KSH {editingUser?.totalSpent?.toLocaleString() || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Join Date</span>
                    <span className="stat-value">{new Date(editingUser?.createdAt?.toDate()).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-submit" onClick={handleUpdateUser}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}