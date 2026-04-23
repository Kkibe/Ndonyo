import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { CheckCircle, Cancel, Visibility, Download, Verified, Pending } from '@mui/icons-material';
import './Verification.scss';

export default function Verification() {
  const { isAdmin, loading } = useAuth();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [verifications, setVerifications] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      type: 'Seller', 
      documentType: 'National ID Card',
      documentUrl: 'https://example.com/id-card.jpg',
      documentName: 'id_card_john_doe.pdf',
      submitted: '2024-01-15', 
      status: 'pending',
      businessName: 'John Sports Store',
      phone: '+254 700 000001',
      address: 'Nairobi, Kenya'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      type: 'Seller', 
      documentType: 'Business License',
      documentUrl: 'https://example.com/business-license.pdf',
      documentName: 'business_license_jane_smith.pdf',
      submitted: '2024-01-14', 
      status: 'pending',
      businessName: 'Jane Footwear',
      phone: '+254 700 000002',
      address: 'Mombasa, Kenya'
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      email: 'mike@example.com', 
      type: 'Affiliate', 
      documentType: 'Tax Certificate',
      documentUrl: 'https://example.com/tax-cert.pdf',
      documentName: 'tax_cert_mike.pdf',
      submitted: '2024-01-13', 
      status: 'approved',
      businessName: 'Mike Affiliates',
      phone: '+254 700 000003',
      address: 'Kisumu, Kenya'
    },
  ]);

  if (loading) return <div className="loader">Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  const approveVerification = async (id) => {
    const result = await Swal.fire({
      title: 'Approve Verification?',
      text: 'This user will be verified and can start selling.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      confirmButtonText: 'Yes, approve'
    });
    if (result.isConfirmed) {
      setVerifications(verifications.map(v => v.id === id ? { ...v, status: 'approved' } : v));
      Swal.fire('Approved!', 'User has been verified successfully.', 'success');
    }
  };

  const rejectVerification = async (id) => {
    const result = await Swal.fire({
      title: 'Reject Verification?',
      text: 'This request will be permanently rejected.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f44336',
      confirmButtonText: 'Yes, reject'
    });
    if (result.isConfirmed) {
      setVerifications(verifications.filter(v => v.id !== id));
      Swal.fire('Rejected!', 'Verification request rejected.', 'success');
    }
  };

  const viewDetails = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return <span className="status-badge approved"><Verified /> Verified</span>;
      case 'pending':
        return <span className="status-badge pending"><Pending /> Pending</span>;
      default:
        return <span className="status-badge rejected"><Cancel /> Rejected</span>;
    }
  };

  const handleDocumentPreview = (docUrl, docName) => {
    if (docUrl) {
      window.open(docUrl, '_blank');
    } else {
      Swal.fire('Preview', `Preview for ${docName} is not available.`, 'info');
    }
  };

  const handleDocumentDownload = (docUrl, docName) => {
    if (docUrl) {
      const link = document.createElement('a');
      link.href = docUrl;
      link.download = docName;
      link.click();
    } else {
      Swal.fire('Download', 'Document not available for download.', 'info');
    }
  };

  const filteredRequests = verifications.filter(request => {
    const matchesFilter = filter === 'all' ? true : request.status === filter;
    const matchesSearch = request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          request.businessName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: verifications.length,
    pending: verifications.filter(v => v.status === 'pending').length,
    approved: verifications.filter(v => v.status === 'approved').length,
    rejected: verifications.filter(v => v.status === 'rejected').length
  };

  return (
    <div className="verification-page">
      <div className="page-header">
        <h1>Verification Requests</h1>
        <div className="header-actions">
          <input 
            type="search" 
            placeholder="Search by name, email or business..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Requests ({stats.total})</option>
            <option value="pending">Pending ({stats.pending})</option>
            <option value="approved">Approved ({stats.approved})</option>
            <option value="rejected">Rejected ({stats.rejected})</option>
          </select>
        </div>
      </div>

      <div className="verification-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Requests</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pending Review</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.approved}</div>
          <div className="stat-label">Approved</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.rejected}</div>
          <div className="stat-label">Rejected</div>
        </div>
      </div>

      <div className="verification-list">
        {filteredRequests.map(v => (
          <div key={v.id} className={`verification-card ${v.status}`}>
            <div className="user-info">
              <img src={`https://ui-avatars.com/api/?name=${v.name}&background=00BFFF&color=fff`} alt="" />
              <div>
                <h3>{v.name}</h3>
                <p>{v.email} • {v.type}</p>
                <p className="business-name">🏢 {v.businessName}</p>
                <p className="submitted-date">📅 Submitted: {v.submitted}</p>
              </div>
            </div>
            <div className="document-info">
              <span className="document-type">📄 {v.documentType}</span>
              <span className="document-name">{v.documentName}</span>
            </div>
            <div className="actions">
              <button className="btn-view" onClick={() => viewDetails(v)}>
                <Visibility /> View Details
              </button>
              <button className="btn-preview" onClick={() => handleDocumentPreview(v.documentUrl, v.documentName)}>
                <Visibility /> Preview
              </button>
              <button className="btn-download" onClick={() => handleDocumentDownload(v.documentUrl, v.documentName)}>
                <Download /> Download
              </button>
              {v.status === 'pending' && (
                <>
                  <button className="btn-approve" onClick={() => approveVerification(v.id)}>
                    <CheckCircle /> Approve
                  </button>
                  <button className="btn-reject" onClick={() => rejectVerification(v.id)}>
                    <Cancel /> Reject
                  </button>
                </>
              )}
              {v.status !== 'pending' && (
                <div className="status-badge-container">{getStatusBadge(v.status)}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Verification Details Modal */}
      {showModal && selectedRequest && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Verification Details</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <label>Personal Information</label>
                <div className="info-grid">
                  <div><strong>Full Name:</strong> {selectedRequest.name}</div>
                  <div><strong>Email:</strong> {selectedRequest.email}</div>
                  <div><strong>Phone:</strong> {selectedRequest.phone}</div>
                  <div><strong>Account Type:</strong> {selectedRequest.type}</div>
                </div>
              </div>
              <div className="detail-section">
                <label>Business Information</label>
                <div className="info-grid">
                  <div><strong>Business Name:</strong> {selectedRequest.businessName}</div>
                  <div><strong>Address:</strong> {selectedRequest.address}</div>
                </div>
              </div>
              <div className="detail-section">
                <label>Document Information</label>
                <div className="info-grid">
                  <div><strong>Document Type:</strong> {selectedRequest.documentType}</div>
                  <div><strong>Document Name:</strong> {selectedRequest.documentName}</div>
                  <div><strong>Submitted:</strong> {selectedRequest.submitted}</div>
                </div>
                <div className="document-actions">
                  <button className="btn-preview" onClick={() => handleDocumentPreview(selectedRequest.documentUrl, selectedRequest.documentName)}>
                    <Visibility /> Preview Document
                  </button>
                  <button className="btn-download" onClick={() => handleDocumentDownload(selectedRequest.documentUrl, selectedRequest.documentName)}>
                    <Download /> Download Document
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-close" onClick={() => setShowModal(false)}>Close</button>
              {selectedRequest.status === 'pending' && (
                <>
                  <button className="btn-approve" onClick={() => { approveVerification(selectedRequest.id); setShowModal(false); }}>Approve Verification</button>
                  <button className="btn-reject" onClick={() => { rejectVerification(selectedRequest.id); setShowModal(false); }}>Reject Verification</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}