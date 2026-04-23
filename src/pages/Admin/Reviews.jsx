import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Star, StarBorder, Delete, CheckCircle, Cancel, Visibility, Pending } from '@mui/icons-material';
import './Reviews.scss';

export default function Reviews() {
  const { isAdmin, loading } = useAuth();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState([
    { id: 1, product: 'Nike Mercurial Superfly', user: 'John Doe', email: 'john@example.com', rating: 5, comment: 'Amazing boots! Very comfortable and great grip on the field. Highly recommend!', date: '2024-01-15', status: 'approved', helpful: 12, images: [] },
    { id: 2, product: 'Adidas Predator', user: 'Jane Smith', email: 'jane@example.com', rating: 4, comment: 'Good quality, fast shipping. The fit is perfect.', date: '2024-01-14', status: 'pending', helpful: 5, images: [] },
    { id: 3, product: 'Puma King', user: 'Mike Johnson', email: 'mike@example.com', rating: 2, comment: 'Not as expected, size runs small. Would recommend ordering a size up.', date: '2024-01-13', status: 'pending', helpful: 3, images: [] },
    { id: 4, product: 'Training Jersey', user: 'Sarah Williams', email: 'sarah@example.com', rating: 5, comment: 'Excellent quality, very comfortable material.', date: '2024-01-12', status: 'approved', helpful: 8, images: [] },
  ]);

  if (loading) return <div className="loader">Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  const approveReview = async (id) => {
    const result = await Swal.fire({
      title: 'Approve Review?',
      text: 'This review will be visible to customers.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      confirmButtonText: 'Yes, approve'
    });
    if (result.isConfirmed) {
      setReviews(reviews.map(r => r.id === id ? { ...r, status: 'approved' } : r));
      Swal.fire('Approved!', 'Review has been approved.', 'success');
    }
  };

  const rejectReview = async (id) => {
    const result = await Swal.fire({
      title: 'Reject Review?',
      text: 'This review will be permanently removed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f44336',
      confirmButtonText: 'Yes, reject'
    });
    if (result.isConfirmed) {
      setReviews(reviews.filter(r => r.id !== id));
      Swal.fire('Rejected!', 'Review has been removed.', 'success');
    }
  };

  const deleteReview = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Review?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete'
    });
    if (result.isConfirmed) {
      setReviews(reviews.filter(r => r.id !== id));
      Swal.fire('Deleted!', 'Review has been deleted.', 'success');
    }
  };

  const viewReviewDetails = (review) => {
    setSelectedReview(review);
    setShowModal(true);
  };

  const getRatingStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      i < rating ? <Star key={i} className="star filled" /> : <StarBorder key={i} className="star" />
    ));
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return <span className="status-badge approved"><CheckCircle /> Approved</span>;
      case 'pending': return <span className="status-badge pending"><Pending /> Pending</span>;
      default: return <span className="status-badge rejected"><Cancel /> Rejected</span>;
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesFilter = filter === 'all' ? true : review.status === filter;
    const matchesSearch = review.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          review.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: reviews.length,
    approved: reviews.filter(r => r.status === 'approved').length,
    pending: reviews.filter(r => r.status === 'pending').length,
    averageRating: (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
  };

  return (
    <div className="reviews-page">
      <div className="page-header">
        <h1>Product Reviews</h1>
        <div className="header-actions">
          <input 
            type="search" 
            placeholder="Search reviews..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Reviews ({stats.total})</option>
            <option value="approved">Approved ({stats.approved})</option>
            <option value="pending">Pending ({stats.pending})</option>
          </select>
        </div>
      </div>

      <div className="reviews-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Reviews</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.approved}</div>
          <div className="stat-label">Approved</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.averageRating} ⭐</div>
          <div className="stat-label">Average Rating</div>
        </div>
      </div>

      <div className="reviews-list">
        {filteredReviews.map(review => (
          <div key={review.id} className={`review-card ${review.status}`}>
            <div className="review-header">
              <div className="product-info">
                <h3>{review.product}</h3>
                <div className="user-info">
                  <span className="user-name">{review.user}</span>
                  <span className="review-date">{review.date}</span>
                </div>
              </div>
              <div className="rating">{getRatingStars(review.rating)}</div>
            </div>
            <div className="review-content">
              <p className="review-text">"{review.comment}"</p>
              <div className="review-meta">
                <span className="helpful-count">👍 {review.helpful} found this helpful</span>
              </div>
            </div>
            <div className="review-footer">
              <div className="review-status">{getStatusBadge(review.status)}</div>
              <div className="review-actions">
                <button className="btn-view" onClick={() => viewReviewDetails(review)}>
                  <Visibility /> View
                </button>
                {review.status === 'pending' && (
                  <>
                    <button className="btn-approve" onClick={() => approveReview(review.id)}>
                      <CheckCircle /> Approve
                    </button>
                    <button className="btn-reject" onClick={() => rejectReview(review.id)}>
                      <Cancel /> Reject
                    </button>
                  </>
                )}
                {review.status === 'approved' && (
                  <button className="btn-delete" onClick={() => deleteReview(review.id)}>
                    <Delete /> Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review Details Modal */}
      {showModal && selectedReview && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Review Details</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <label>Product</label>
                <p>{selectedReview.product}</p>
              </div>
              <div className="detail-section">
                <label>Customer</label>
                <p>{selectedReview.user} ({selectedReview.email})</p>
              </div>
              <div className="detail-section">
                <label>Rating</label>
                <div className="rating">{getRatingStars(selectedReview.rating)}</div>
              </div>
              <div className="detail-section">
                <label>Review</label>
                <p className="review-full-text">{selectedReview.comment}</p>
              </div>
              <div className="detail-section">
                <label>Date</label>
                <p>{selectedReview.date}</p>
              </div>
              <div className="detail-section">
                <label>Helpful Count</label>
                <p>{selectedReview.helpful} customers found this helpful</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-close" onClick={() => setShowModal(false)}>Close</button>
              {selectedReview.status === 'pending' && (
                <>
                  <button className="btn-approve" onClick={() => { approveReview(selectedReview.id); setShowModal(false); }}>Approve Review</button>
                  <button className="btn-reject" onClick={() => { rejectReview(selectedReview.id); setShowModal(false); }}>Reject Review</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}