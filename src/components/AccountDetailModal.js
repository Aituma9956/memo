import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  User,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Download,
  Upload,
  Send,
  Check,
  Ban,
  Eye,
  ExternalLink,
  AlertCircle,
  Loader2
} from 'lucide-react';
import './AccountDetailModal.css';

const AccountDetailModal = ({ account, isOpen, onClose, onStatusUpdate }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [showConfirmModal, setShowConfirmModal] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showToast, setShowToast] = useState(null);

  if (!isOpen || !account) return null;

  // Mock transaction data
  const transactions = [
    {
      id: 'TXN-001',
      date: '2025-11-10',
      type: 'Credit',
      amount: 1200000.00,
      currency: account.currency,
      description: 'Customer payment received',
      reference: 'REF-2025-001',
      status: 'Completed'
    },
    {
      id: 'TXN-002',
      date: '2025-11-08',
      type: 'Write-off',
      amount: -450000.00,
      currency: account.currency,
      description: 'Partial write-off approved',
      reference: 'WO-2025-001',
      status: 'Pending'
    },
    {
      id: 'TXN-003',
      date: '2025-11-05',
      type: 'Adjustment',
      amount: 300000.00,
      currency: account.currency,
      description: 'FX rate adjustment',
      reference: 'ADJ-2025-001',
      status: 'Completed'
    }
  ];

  // Mock audit trail data
  const auditTrail = [
    {
      id: 1,
      timestamp: '2025-11-12 09:30:00',
      user: 'credit.admin',
      action: 'Account Reviewed',
      details: 'Account marked for verification',
      status: 'info'
    },
    {
      id: 2,
      timestamp: '2025-11-10 14:15:00',
      user: 'recovery.officer',
      action: 'Payment Recorded',
      details: 'Customer payment of ₦1,200,000 recorded',
      status: 'success'
    },
    {
      id: 3,
      timestamp: '2025-11-08 11:45:00',
      user: 'system',
      action: 'AI Anomaly Detected',
      details: 'Unusual transaction pattern flagged for review',
      status: 'warning'
    },
    {
      id: 4,
      timestamp: '2025-11-05 16:20:00',
      user: 'csm.user',
      action: 'Account Created',
      details: 'Memo balance account created from reconciliation',
      status: 'info'
    }
  ];

  // Mock attachments data
  const attachments = [
    {
      id: 1,
      name: 'customer_statement.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadedBy: 'credit.admin',
      uploadedAt: '2025-11-10 10:30:00'
    },
    {
      id: 2,
      name: 'reconciliation_report.xlsx',
      type: 'excel',
      size: '856 KB',
      uploadedBy: 'recovery.officer',
      uploadedAt: '2025-11-08 15:45:00'
    },
    {
      id: 3,
      name: 'customer_correspondence.docx',
      type: 'word',
      size: '124 KB',
      uploadedBy: 'csm.user',
      uploadedAt: '2025-11-05 09:15:00'
    },
    {
      id: 4,
      name: 'payment_evidence.jpg',
      type: 'image',
      size: '1.8 MB',
      uploadedBy: 'customer',
      uploadedAt: '2025-11-10 08:30:00'
    }
  ];

  const formatCurrency = (amount, currency = 'NGN') => {
    const locale = currency === 'NGN' ? 'en-NG' : 
                   currency === 'USD' ? 'en-US' : 
                   currency === 'GHS' ? 'en-GH' : 'en-NG';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', color: 'warning', icon: Clock },
      verified: { label: 'Verified', color: 'info', icon: CheckCircle },
      cleared: { label: 'Cleared', color: 'success', icon: CheckCircle },
      exception: { label: 'Exception', color: 'danger', icon: AlertTriangle }
    };
    
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <span className={`status-badge ${config.color}`}>
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  const getFileIcon = (type) => {
    const icons = {
      pdf: '📄',
      excel: '📊',
      word: '📝',
      image: '🖼️',
      default: '📎'
    };
    return icons[type] || icons.default;
  };

  const handleAction = async (action) => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (action === 'verify') {
      onStatusUpdate(account.id, 'verified');
      showSuccessToast('Account verified successfully!');
    } else if (action === 'send-to-icad') {
      onStatusUpdate(account.id, 'cleared');
      showSuccessToast('Account sent to ICAD successfully!');
    } else if (action === 'reject') {
      onStatusUpdate(account.id, 'exception');
      showSuccessToast('Account rejected and flagged for review!');
    }
    
    setIsProcessing(false);
    setShowConfirmModal(null);
    
    // Close modal after action
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const showSuccessToast = (message) => {
    setShowToast({ type: 'success', message });
    setTimeout(() => setShowToast(null), 3000);
  };

  const openConfirmModal = (action) => {
    setShowConfirmModal(action);
  };

  const tabs = [
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'transactions', label: 'Transactions', icon: DollarSign },
    { id: 'audit', label: 'Audit Trail', icon: Eye },
    { id: 'attachments', label: 'Attachments', icon: Upload }
  ];

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <div className="modal-header">
            <div className="header-left">
              <h2>{account.id}</h2>
              {getStatusBadge(account.status)}
            </div>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="tab-navigation">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'summary' && (
              <div className="summary-tab">
                <div className="summary-grid">
                  <div className="summary-card">
                    <h4>Account Information</h4>
                    <div className="info-row">
                      <span className="label">Account ID:</span>
                      <span className="value">{account.id}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Customer:</span>
                      <span className="value">{account.customer}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">SOL:</span>
                      <span className="value">{account.sol}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Region:</span>
                      <span className="value">
                        <MapPin size={14} />
                        {account.region}
                      </span>
                    </div>
                  </div>

                  <div className="summary-card">
                    <h4>Balance Details</h4>
                    <div className="info-row">
                      <span className="label">Current Balance:</span>
                      <span className="value balance">
                        {formatCurrency(account.balance, account.currency)}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="label">Currency:</span>
                      <span className="value">{account.currency}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Risk Score:</span>
                      <span className={`value risk-${account.riskScore}`}>
                        {account.riskScore.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="summary-card">
                    <h4>Timeline</h4>
                    <div className="info-row">
                      <span className="label">Date Detected:</span>
                      <span className="value">
                        <Calendar size={14} />
                        {account.dateDetected}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="label">Last Activity:</span>
                      <span className="value">
                        <Calendar size={14} />
                        {account.lastActivity}
                      </span>
                    </div>
                  </div>

                  <div className="summary-card narrative-card">
                    <h4>Narrative</h4>
                    <p>{account.narrative}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="transactions-tab">
                <div className="transactions-header">
                  <h4>Transaction History</h4>
                  <span className="transaction-count">{transactions.length} transactions</span>
                </div>
                <div className="transactions-list">
                  {transactions.map(txn => (
                    <div key={txn.id} className="transaction-item">
                      <div className="transaction-info">
                        <div className="transaction-main">
                          <strong>{txn.description}</strong>
                          <span className="transaction-ref">{txn.reference}</span>
                        </div>
                        <div className="transaction-details">
                          <span className="transaction-date">{txn.date}</span>
                          <span className={`transaction-type ${txn.type.toLowerCase()}`}>
                            {txn.type}
                          </span>
                        </div>
                      </div>
                      <div className="transaction-amount">
                        <span className={`amount ${txn.amount < 0 ? 'negative' : 'positive'}`}>
                          {formatCurrency(Math.abs(txn.amount), txn.currency)}
                        </span>
                        <span className={`status ${txn.status.toLowerCase()}`}>
                          {txn.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="audit-tab">
                <div className="audit-header">
                  <h4>Audit Trail</h4>
                  <span className="audit-count">{auditTrail.length} entries</span>
                </div>
                <div className="audit-timeline">
                  {auditTrail.map(entry => (
                    <div key={entry.id} className="audit-entry">
                      <div className={`audit-icon ${entry.status}`}>
                        {entry.status === 'success' && <CheckCircle size={16} />}
                        {entry.status === 'warning' && <AlertTriangle size={16} />}
                        {entry.status === 'info' && <FileText size={16} />}
                      </div>
                      <div className="audit-content">
                        <div className="audit-main">
                          <strong>{entry.action}</strong>
                          <span className="audit-user">by {entry.user}</span>
                        </div>
                        <p className="audit-details">{entry.details}</p>
                        <span className="audit-time">{entry.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'attachments' && (
              <div className="attachments-tab">
                <div className="attachments-header">
                  <h4>Attachments</h4>
                  <button className="upload-btn">
                    <Upload size={16} />
                    Upload File
                  </button>
                </div>
                <div className="attachments-grid">
                  {attachments.map(file => (
                    <div key={file.id} className="attachment-item">
                      <div className="file-icon">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="file-info">
                        <strong className="file-name">{file.name}</strong>
                        <div className="file-meta">
                          <span className="file-size">{file.size}</span>
                          <span className="file-uploader">by {file.uploadedBy}</span>
                        </div>
                        <span className="file-date">{file.uploadedAt}</span>
                      </div>
                      <div className="file-actions">
                        <button className="action-btn view-btn" title="View">
                          <Eye size={14} />
                        </button>
                        <button className="action-btn download-btn" title="Download">
                          <Download size={14} />
                        </button>
                        <button className="action-btn link-btn" title="Get Link">
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <div className="footer-left">
              <button className="btn btn-secondary" onClick={() => window.print()}>
                <Download size={16} />
                Export PDF
              </button>
            </div>
            <div className="footer-right">
              <button 
                className="btn btn-success"
                onClick={() => openConfirmModal('verify')}
                disabled={isProcessing}
              >
                <Check size={16} />
                Verify
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => openConfirmModal('send-to-icad')}
                disabled={isProcessing}
              >
                <Send size={16} />
                Send to ICAD
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => openConfirmModal('reject')}
                disabled={isProcessing}
              >
                <Ban size={16} />
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <div className="confirmation-header">
              <AlertCircle size={24} className="warning-icon" />
              <h3>Confirm Action</h3>
            </div>
            <div className="confirmation-content">
              <p>
                Are you sure you want to <strong>{showConfirmModal}</strong> account {account.id}?
                {showConfirmModal === 'send-to-icad' && (
                  <span className="action-note">
                    This will mark the account as cleared and send it to ICAD for final processing.
                  </span>
                )}
              </p>
            </div>
            <div className="confirmation-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowConfirmModal(null)}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button 
                className={`btn ${
                  showConfirmModal === 'reject' ? 'btn-danger' : 
                  showConfirmModal === 'verify' ? 'btn-success' : 'btn-primary'
                }`}
                onClick={() => handleAction(showConfirmModal)}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="spinning" size={16} />
                    Processing...
                  </>
                ) : (
                  <>Confirm</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showToast && (
        <div className={`toast ${showToast.type}`}>
          <CheckCircle size={20} />
          <span>{showToast.message}</span>
          <button className="toast-close" onClick={() => setShowToast(null)}>
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );
};

export default AccountDetailModal;