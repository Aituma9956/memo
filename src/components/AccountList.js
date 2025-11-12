import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  Plus,
  Scan,
  Eye,
  Edit,
  FileText,
  Calendar,
  MapPin,
  MoreHorizontal,
  Loader2,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import AccountDetailModal from './AccountDetailModal';
import './AccountList.css';

const AccountList = ({ onAccountSelect, onBack }) => {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scanningAccount, setScanningAccount] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    region: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  });

  // Mock account data
  const mockAccounts = [
    {
      id: 'UBA-234567',
      customer: 'Johnson & Associates Ltd',
      balance: 2450000.00,
      currency: 'NGN',
      status: 'pending',
      region: 'Lagos',
      sol: 'SOL-001',
      dateDetected: '2025-11-10',
      lastActivity: '2025-11-12',
      narrative: 'Reconciliation adjustment - customer overpayment',
      riskScore: 'low',
      detectionSource: 'Vision'
    },
    {
      id: 'UBA-345678',
      customer: 'Mainland Motors Nigeria',
      balance: 5678900.00,
      currency: 'NGN',
      status: 'verified',
      region: 'Lagos',
      sol: 'SOL-002',
      dateDetected: '2025-11-08',
      lastActivity: '2025-11-11',
      narrative: 'Trade finance adjustment',
      riskScore: 'medium',
      detectionSource: 'Finacle'
    },
    {
      id: 'UBA-456789',
      customer: 'Kano Traders Cooperative',
      balance: 890000.00,
      currency: 'NGN',
      status: 'cleared',
      region: 'Kano',
      sol: 'SOL-003',
      dateDetected: '2025-11-05',
      lastActivity: '2025-11-09',
      narrative: 'Foreign exchange difference',
      riskScore: 'low',
      detectionSource: 'Vision'
    },
    {
      id: 'UBA-567890',
      customer: 'Delta Oil & Gas Company',
      balance: 12500000.00,
      currency: 'USD',
      status: 'exception',
      region: 'Port Harcourt',
      sol: 'SOL-004',
      dateDetected: '2025-11-11',
      lastActivity: '2025-11-12',
      narrative: 'High value transaction anomaly detected',
      riskScore: 'high',
      detectionSource: 'Manual',
      flaggedForReview: true
    },
    {
      id: 'UBA-678901',
      customer: 'Abuja Investment Holdings',
      balance: 3200000.00,
      currency: 'NGN',
      status: 'pending',
      region: 'Abuja',
      sol: 'SOL-005',
      dateDetected: '2025-11-09',
      lastActivity: '2025-11-10',
      narrative: 'Investment maturity adjustment',
      riskScore: 'medium',
      detectionSource: 'Finacle',
      flaggedForReview: true
    },
    {
      id: 'UBA-789012',
      customer: 'Ghana Imports & Exports',
      balance: 4500000.00,
      currency: 'GHS',
      status: 'verified',
      region: 'Accra',
      sol: 'SOL-006',
      dateDetected: '2025-11-07',
      lastActivity: '2025-11-11',
      narrative: 'Cross-border payment reconciliation',
      riskScore: 'low',
      detectionSource: 'Vision'
    }
  ];

  // Initialize data
  useEffect(() => {
    setAccounts(mockAccounts);
    setFilteredAccounts(mockAccounts);
  }, []);

  // Filter accounts based on criteria
  useEffect(() => {
    let filtered = accounts.filter(account => {
      const searchMatch = filters.search === '' || 
        account.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        account.customer.toLowerCase().includes(filters.search.toLowerCase());
      
      const regionMatch = filters.region === '' || account.region === filters.region;
      const statusMatch = filters.status === '' || account.status === filters.status;
      
      return searchMatch && regionMatch && statusMatch;
    });
    
    setFilteredAccounts(filtered);
  }, [filters, accounts]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
  };

  const handleScanNarrative = async (accountId) => {
    setScanningAccount(accountId);
    // Simulate AI scanning
    await new Promise(resolve => setTimeout(resolve, 3000));
    setScanningAccount(null);
  };

  const handleAccountClick = (account) => {
    setSelectedAccount(account);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAccount(null);
  };

  const handleStatusUpdate = (accountId, newStatus) => {
    // Update the account status in the local state
    setAccounts(prevAccounts => 
      prevAccounts.map(account => 
        account.id === accountId 
          ? { ...account, status: newStatus }
          : account
      )
    );
  };

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
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  const getRiskBadge = (riskScore) => {
    const riskConfig = {
      low: { color: 'success', label: 'Low' },
      medium: { color: 'warning', label: 'Medium' },
      high: { color: 'danger', label: 'High' }
    };
    
    const config = riskConfig[riskScore];
    return <span className={`risk-badge ${config.color}`}>{config.label}</span>;
  };

  const getDetectionSourceBadge = (source) => {
    const sourceConfig = {
      Vision: { color: 'vision', label: 'Vision', icon: '👁️' },
      Finacle: { color: 'finacle', label: 'Finacle', icon: '🏦' },
      Manual: { color: 'manual', label: 'Manual', icon: '✋' }
    };
    
    const config = sourceConfig[source];
    return (
      <span className={`detection-source-badge ${config.color}`}>
        <span className="source-icon">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  // Calculate flagged accounts for exception banner
  const flaggedAccountsCount = accounts.filter(account => account.flaggedForReview).length;

  const regions = [...new Set(accounts.map(acc => acc.region))];
  const statuses = ['pending', 'verified', 'cleared', 'exception'];

  return (
    <div className="account-list-container">
      <div className="account-list-header">
        <div className="header-title">
          <h2>Account Detection & Management</h2>
          <p>View and manage all detected memo balance accounts</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? <Loader2 className="spinning" size={16} /> : <RefreshCw size={16} />}
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button className="btn btn-primary">
            <Plus size={16} />
            Add Account
          </button>
        </div>
      </div>

      {/* Exception Banner */}
      {flaggedAccountsCount > 0 && (
        <div className="exception-banner">
          <div className="exception-content">
            <AlertTriangle size={20} className="exception-icon" />
            <span className="exception-text">
              <strong>{flaggedAccountsCount} accounts flagged for review</strong> (balance mismatch).
            </span>
            <button className="exception-dismiss" title="Dismiss banner">
              <XCircle size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="filter-bar">
        {/* Search Section */}
        <div className="filter-section search-section">
          <div className="search-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by Account ID or Customer..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Quick Filters Section */}
        <div className="filter-section quick-filters-section">
          <div className="filter-label">Filters:</div>
          <div className="quick-filters">
            <select
              value={filters.region}
              onChange={(e) => handleFilterChange('region', e.target.value)}
              className="filter-select"
            >
              <option value="">All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="filter-select"
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Filters Section */}
        <div className="filter-section date-section">
          <div className="filter-label">Date Range:</div>
          <div className="date-filters">
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="date-input"
              title="From Date"
            />
            <span className="date-separator">to</span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="date-input"
              title="To Date"
            />
          </div>
        </div>

       
      </div>

      {/* Account Table */}
      <div className="table-container">
        <table className="accounts-table">
          <thead>
            <tr>
              <th>Account ID</th>
              <th>Customer</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Region</th>
              <th>Detection Source</th>
              <th>Date Detected</th>
              <th>Risk</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map(account => (
              <tr 
                key={account.id}
                className="table-row"
                onClick={() => handleAccountClick(account)}
              >
                <td>
                  <div className="account-id">
                    <strong>{account.id}</strong>
                    <small>{account.sol}</small>
                  </div>
                </td>
                <td>
                  <div className="customer-info">
                    <strong>{account.customer}</strong>
                    <small>{account.narrative}</small>
                  </div>
                </td>
                <td>
                  <div className="balance-info">
                    <strong>{formatCurrency(account.balance, account.currency)}</strong>
                    <small>{account.currency}</small>
                  </div>
                </td>
                <td>
                  {getStatusBadge(account.status)}
                </td>
                <td>
                  <div className="region-info">
                    <MapPin size={12} />
                    {account.region}
                  </div>
                </td>
                <td>
                  {getDetectionSourceBadge(account.detectionSource)}
                </td>
                <td>
                  <div className="date-info">
                    <strong>{account.dateDetected}</strong>
                    <small>Last: {account.lastActivity}</small>
                  </div>
                </td>
                <td>
                  {getRiskBadge(account.riskScore)}
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-btn scan-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleScanNarrative(account.id);
                      }}
                      disabled={scanningAccount === account.id}
                      title="Scan Narrative with AI"
                    >
                      {scanningAccount === account.id ? (
                        <Loader2 className="spinning" size={14} />
                      ) : (
                        <Scan size={14} />
                      )}
                    </button>
                    <button 
                      className="action-btn view-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAccountClick(account);
                      }}
                      title="View Details"
                    >
                      <Eye size={14} />
                    </button>
                    {/* <button 
                      className="action-btn edit-btn"
                      onClick={(e) => e.stopPropagation()}
                      title="Edit Account"
                    >
                      <Edit size={14} />
                    </button>
                    <button 
                      className="action-btn more-btn"
                      onClick={(e) => e.stopPropagation()}
                      title="More Actions"
                    >
                      <MoreHorizontal size={14} />
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Scan Animation Overlay */}
      {scanningAccount && (
        <div className="scan-overlay">
          <div className="scan-animation">
            <div className="scan-progress">
              <Scan size={32} className="scan-icon spinning" />
              <h3>AI Scanning Narrative</h3>
              <p>Analyzing account {scanningAccount}...</p>
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredAccounts.length === 0 && !loading && (
        <div className="empty-state">
          <FileText size={48} />
          <h3>No accounts found</h3>
          <p>Try adjusting your search criteria or refresh the data</p>
        </div>
      )}

      {/* Account Detail Modal */}
      <AccountDetailModal
        account={selectedAccount}
        isOpen={showModal}
        onClose={handleCloseModal}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default AccountList;