import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  Search,
  Filter,
  MoreVertical,
  Eye,
  ArrowUp,
  RefreshCw,
  ArrowLeft,
  Bell,
  Shield,
  FileText,
  Target,
  Zap,
  AlertCircle,
  CheckCircle2,
  X,
  ChevronDown,
  Activity,
  Settings,
  Download,
  ExternalLink
} from 'lucide-react';
import './AlertsAudit.css';

const AlertsAudit = ({ user, onBack }) => {
  // State management
  const [alerts, setAlerts] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [filteredAuditLogs, setFilteredAuditLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [alertFilter, setAlertFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Mock alerts data
  const mockAlerts = [
    {
      id: 1,
      type: 'sla_breach',
      title: 'SLA Breach - Account Processing',
      description: 'Account MBP-2024-001234 has exceeded 48-hour SLA limit',
      severity: 'critical',
      dueDate: '2025-11-12T10:30:00Z',
      accountNumber: 'MBP-2024-001234',
      amount: 2500000,
      assignedTo: 'John Adebayo',
      region: 'Lagos',
      createdAt: '2025-11-10T08:15:00Z',
      isResolved: false,
      escalated: false
    },
    {
      id: 2,
      type: 'rejection',
      title: 'Account Verification Rejected',
      description: 'Account MBP-2024-001189 rejected due to incomplete documentation',
      severity: 'medium',
      dueDate: '2025-11-13T16:00:00Z',
      accountNumber: 'MBP-2024-001189',
      amount: 1200000,
      assignedTo: 'Sarah Okafor',
      region: 'Abuja',
      createdAt: '2025-11-11T14:20:00Z',
      isResolved: false,
      escalated: false,
      rejectionReason: 'Missing beneficiary identification documents'
    },
    {
      id: 3,
      type: 'new_assignment',
      title: 'New Memo Assignment',
      description: 'New high-value account assigned for verification',
      severity: 'low',
      dueDate: '2025-11-15T12:00:00Z',
      accountNumber: 'MBP-2024-001256',
      amount: 5500000,
      assignedTo: 'Michael Okonkwo',
      region: 'Port Harcourt',
      createdAt: '2025-11-12T09:45:00Z',
      isResolved: false,
      escalated: false
    },
    {
      id: 4,
      type: 'sla_breach',
      title: 'Critical SLA Breach',
      description: 'Account MBP-2024-001201 has exceeded 72-hour critical limit',
      severity: 'critical',
      dueDate: '2025-11-11T18:00:00Z',
      accountNumber: 'MBP-2024-001201',
      amount: 8900000,
      assignedTo: 'Grace Eze',
      region: 'Kano',
      createdAt: '2025-11-09T10:00:00Z',
      isResolved: false,
      escalated: true
    },
    {
      id: 5,
      type: 'rejection',
      title: 'Document Verification Failed',
      description: 'Account MBP-2024-001178 failed automated document verification',
      severity: 'medium',
      dueDate: '2025-11-14T10:00:00Z',
      accountNumber: 'MBP-2024-001178',
      amount: 3200000,
      assignedTo: 'David Ikenna',
      region: 'Lagos',
      createdAt: '2025-11-11T16:30:00Z',
      isResolved: false,
      escalated: false,
      rejectionReason: 'AI verification confidence below threshold'
    },
    {
      id: 6,
      type: 'new_assignment',
      title: 'Urgent Assignment - VIP Customer',
      description: 'VIP customer account requires immediate attention',
      severity: 'high',
      dueDate: '2025-11-13T09:00:00Z',
      accountNumber: 'MBP-2024-001267',
      amount: 15000000,
      assignedTo: 'Blessing Nkem',
      region: 'Abuja',
      createdAt: '2025-11-12T07:15:00Z',
      isResolved: false,
      escalated: false
    }
  ];

  // Mock audit logs data
  const mockAuditLogs = [
    {
      id: 1,
      timestamp: '2025-11-12T09:45:32Z',
      user: 'John Adebayo',
      userRole: 'Senior Officer',
      action: 'Account Verification',
      description: 'Verified account MBP-2024-001234 documentation',
      accountNumber: 'MBP-2024-001234',
      outcome: 'success',
      ipAddress: '192.168.1.101',
      location: 'Lagos, Nigeria',
      details: 'All required documents validated successfully',
      riskScore: 'Low'
    },
    {
      id: 2,
      timestamp: '2025-11-12T09:30:15Z',
      user: 'Sarah Okafor',
      userRole: 'Manager',
      action: 'Account Rejection',
      description: 'Rejected account MBP-2024-001189 due to incomplete docs',
      accountNumber: 'MBP-2024-001189',
      outcome: 'failure',
      ipAddress: '192.168.1.205',
      location: 'Abuja, Nigeria',
      details: 'Missing beneficiary identification documents',
      riskScore: 'Medium'
    },
    {
      id: 3,
      timestamp: '2025-11-12T09:15:48Z',
      user: 'Michael Okonkwo',
      userRole: 'Officer',
      action: 'Balance Computation',
      description: 'Calculated balance for account MBP-2024-001256',
      accountNumber: 'MBP-2024-001256',
      outcome: 'success',
      ipAddress: '192.168.1.178',
      location: 'Port Harcourt, Nigeria',
      details: 'Balance computation completed: ₦5,500,000',
      riskScore: 'Low'
    },
    {
      id: 4,
      timestamp: '2025-11-12T08:45:22Z',
      user: 'Grace Eze',
      userRole: 'Senior Officer',
      action: 'SLA Escalation',
      description: 'Escalated account MBP-2024-001201 due to SLA breach',
      accountNumber: 'MBP-2024-001201',
      outcome: 'warning',
      ipAddress: '192.168.1.142',
      location: 'Kano, Nigeria',
      details: 'Account exceeded 72-hour processing limit',
      riskScore: 'High'
    },
    {
      id: 5,
      timestamp: '2025-11-12T08:30:07Z',
      user: 'David Ikenna',
      userRole: 'Officer',
      action: 'Document Upload',
      description: 'Uploaded additional documents for MBP-2024-001178',
      accountNumber: 'MBP-2024-001178',
      outcome: 'success',
      ipAddress: '192.168.1.089',
      location: 'Lagos, Nigeria',
      details: 'Added 3 supplementary verification documents',
      riskScore: 'Medium'
    },
    {
      id: 6,
      timestamp: '2025-11-12T08:00:33Z',
      user: 'Blessing Nkem',
      userRole: 'Manager',
      action: 'Account Assignment',
      description: 'Assigned high-priority account MBP-2024-001267',
      accountNumber: 'MBP-2024-001267',
      outcome: 'success',
      ipAddress: '192.168.1.156',
      location: 'Abuja, Nigeria',
      details: 'VIP customer account assigned with priority flag',
      riskScore: 'Low'
    },
    {
      id: 7,
      timestamp: '2025-11-11T17:45:19Z',
      user: 'John Adebayo',
      userRole: 'Senior Officer',
      action: 'Compliance Check',
      description: 'Ran compliance verification for MBP-2024-001234',
      accountNumber: 'MBP-2024-001234',
      outcome: 'success',
      ipAddress: '192.168.1.101',
      location: 'Lagos, Nigeria',
      details: 'All compliance requirements satisfied',
      riskScore: 'Low'
    },
    {
      id: 8,
      timestamp: '2025-11-11T16:30:45Z',
      user: 'Sarah Okafor',
      userRole: 'Manager',
      action: 'Risk Assessment',
      description: 'Updated risk assessment for MBP-2024-001189',
      accountNumber: 'MBP-2024-001189',
      outcome: 'warning',
      ipAddress: '192.168.1.205',
      location: 'Abuja, Nigeria',
      details: 'Risk score elevated due to documentation issues',
      riskScore: 'High'
    }
  ];

  // Initialize data
  useEffect(() => {
    setAlerts(mockAlerts);
    setAuditLogs(mockAuditLogs);
    setFilteredAuditLogs(mockAuditLogs);
  }, []);

  // Filter audit logs based on search and date
  useEffect(() => {
    let filtered = auditLogs;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(log =>
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case 'today':
          filterDate.setDate(now.getDate());
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        default:
          break;
      }

      filtered = filtered.filter(log => new Date(log.timestamp) >= filterDate);
    }

    setFilteredAuditLogs(filtered);
  }, [searchQuery, dateFilter, auditLogs]);

  // Alert type configurations
  const getAlertConfig = (type) => {
    switch (type) {
      case 'sla_breach':
        return {
          icon: AlertTriangle,
          color: '#DC2626',
          bgColor: 'rgba(220, 38, 38, 0.1)',
          borderColor: '#DC2626',
          label: 'SLA Breach'
        };
      case 'rejection':
        return {
          icon: XCircle,
          color: '#F59E0B',
          bgColor: 'rgba(245, 158, 11, 0.1)',
          borderColor: '#F59E0B',
          label: 'Rejection'
        };
      case 'new_assignment':
        return {
          icon: CheckCircle,
          color: '#059669',
          bgColor: 'rgba(5, 150, 105, 0.1)',
          borderColor: '#059669',
          label: 'New Assignment'
        };
      default:
        return {
          icon: Bell,
          color: '#6B7280',
          bgColor: 'rgba(107, 114, 128, 0.1)',
          borderColor: '#6B7280',
          label: 'Alert'
        };
    }
  };

  // Get outcome styling
  const getOutcomeConfig = (outcome) => {
    switch (outcome) {
      case 'success':
        return { color: '#059669', icon: CheckCircle2, label: 'Success' };
      case 'failure':
        return { color: '#DC2626', icon: XCircle, label: 'Failed' };
      case 'warning':
        return { color: '#F59E0B', icon: AlertCircle, label: 'Warning' };
      default:
        return { color: '#6B7280', icon: Bell, label: 'Info' };
    }
  };

  // Get risk score color
  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return '#059669';
      case 'Medium': return '#F59E0B';
      case 'High': return '#DC2626';
      default: return '#6B7280';
    }
  };

  // Handle alert actions
  const handleViewAlert = (alertId) => {
    const alert = alerts.find(a => a.id === alertId);
    setSelectedAlert(alert);
    // In real app, this would navigate to the related memo
    console.log(`Viewing memo for account: ${alert.accountNumber}`);
    // You could also show a modal or navigate to a detailed view
  };

  const handleMarkAsResolved = (alertId) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, isResolved: true }
          : alert
      )
    );
    
    // Add success animation
    const alertElement = document.querySelector(`[data-alert-id="${alertId}"]`);
    if (alertElement) {
      alertElement.classList.add('resolving');
      setTimeout(() => {
        alertElement.classList.add('resolved');
      }, 500);
    }
  };

  const handleEscalateAlert = (alertId) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, escalated: true }
          : alert
      )
    );
    console.log('Alert has been escalated to management.');
  };

  // Format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get filtered alerts
  const getFilteredAlerts = () => {
    if (alertFilter === 'all') return alerts;
    return alerts.filter(alert => alert.type === alertFilter);
  };

  const refreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // In real app, this would fetch fresh data
    }, 1000);
  };

  return (
    <div className="alerts-audit-container">
      {/* Header Section */}
      <div className="alerts-audit-header">
        <div className="header-left">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={20} />
          </button>
          <div className="header-info">
            <h1>Alerts & Audit Trail</h1>
            <p>Monitor system alerts and review user activity logs</p>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filters
          </button>
          <button className="btn btn-primary" onClick={refreshData}>
            <RefreshCw size={16} className={isLoading ? 'spinning' : ''} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-grid">
            <div className="filter-group">
              <label>Alert Type</label>
              <select 
                value={alertFilter} 
                onChange={(e) => setAlertFilter(e.target.value)}
              >
                <option value="all">All Alerts</option>
                <option value="sla_breach">SLA Breach</option>
                <option value="rejection">Rejections</option>
                <option value="new_assignment">New Assignments</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Date Range</label>
              <select 
                value={dateFilter} 
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Split Layout */}
      <div className="split-layout">
        {/* Left Side - Alerts */}
        <div className="alerts-section">
          <div className="section-header">
            <h3>
              <Bell size={20} />
              Active Alerts ({getFilteredAlerts().filter(a => !a.isResolved).length})
            </h3>
            <div className="alert-stats">
              <span className="stat critical">
                <AlertTriangle size={14} />
                {alerts.filter(a => a.severity === 'critical' && !a.isResolved).length} Critical
              </span>
              <span className="stat medium">
                <Clock size={14} />
                {alerts.filter(a => a.severity === 'medium' && !a.isResolved).length} Medium
              </span>
              <span className="stat low">
                <CheckCircle size={14} />
                {alerts.filter(a => a.severity === 'low' && !a.isResolved).length} Low
              </span>
            </div>
          </div>

          <div className="alerts-list">
            {getFilteredAlerts().map(alert => {
              const config = getAlertConfig(alert.type);
              const IconComponent = config.icon;
              
              return (
                <div 
                  key={alert.id} 
                  className={`alert-card ${alert.severity} ${alert.isResolved ? 'resolved' : ''} ${alert.escalated ? 'escalated' : ''}`}
                  data-alert-id={alert.id}
                  style={{ 
                    borderColor: config.borderColor,
                    backgroundColor: alert.isResolved ? '#F3F4F6' : config.bgColor
                  }}
                >
                  <div className="alert-icon" style={{ color: config.color }}>
                    <IconComponent size={24} />
                    {alert.escalated && (
                      <div className="escalation-badge">
                        <ArrowUp size={12} />
                      </div>
                    )}
                  </div>

                  <div className="alert-content">
                    <div className="alert-header">
                      <div className="alert-type" style={{ color: config.color }}>
                        {config.label}
                      </div>
                      <div className="alert-time">
                        <Clock size={12} />
                        {formatDateTime(alert.createdAt)}
                      </div>
                    </div>

                    <h4 className="alert-title">{alert.title}</h4>
                    <p className="alert-description">{alert.description}</p>

                    <div className="alert-details">
                      <div className="detail-item">
                        <FileText size={12} />
                        <span>{alert.accountNumber}</span>
                      </div>
                      <div className="detail-item">
                        <Target size={12} />
                        <span>{formatCurrency(alert.amount)}</span>
                      </div>
                      <div className="detail-item">
                        <User size={12} />
                        <span>{alert.assignedTo}</span>
                      </div>
                    </div>

                    <div className="alert-due">
                      <Calendar size={12} />
                      <span>Due: {formatDateTime(alert.dueDate)}</span>
                      {new Date(alert.dueDate) < new Date() && (
                        <span className="overdue">OVERDUE</span>
                      )}
                    </div>

                    {alert.rejectionReason && (
                      <div className="rejection-reason">
                        <strong>Reason:</strong> {alert.rejectionReason}
                      </div>
                    )}
                  </div>

                  <div className="alert-actions">
                    <button 
                      className="action-btn view-btn"
                      onClick={() => handleViewAlert(alert.id)}
                      title="View Details"
                    >
                      <Eye size={16} />
                      View
                    </button>

                    {!alert.isResolved && (
                      <>
                        <button 
                          className="action-btn resolve-btn"
                          onClick={() => handleMarkAsResolved(alert.id)}
                          title="Mark as Resolved"
                        >
                          <CheckCircle2 size={16} />
                          Resolve
                        </button>

                        {!alert.escalated && (
                          <button 
                            className="action-btn escalate-btn"
                            onClick={() => handleEscalateAlert(alert.id)}
                            title="Escalate Alert"
                          >
                            <ArrowUp size={16} />
                            Escalate
                          </button>
                        )}
                      </>
                    )}

                    <button className="action-btn menu-btn">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side - Audit Trail */}
        <div className="audit-section">
          <div className="section-header">
            <h3>
              <Shield size={20} />
              Audit Trail ({filteredAuditLogs.length})
            </h3>
            <div className="audit-controls">
              <div className="search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search audit logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="audit-table-container">
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Account</th>
                  <th>Outcome</th>
                  <th>Risk</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredAuditLogs.map(log => {
                  const outcomeConfig = getOutcomeConfig(log.outcome);
                  const OutcomeIcon = outcomeConfig.icon;
                  
                  return (
                    <tr key={log.id}>
                      <td className="timestamp-cell">
                        <div className="timestamp">
                          <Activity size={12} />
                          {formatDateTime(log.timestamp)}
                        </div>
                      </td>
                      
                      <td className="user-cell">
                        <div className="user-info">
                          <User size={14} />
                          <div>
                            <div className="user-name">{log.user}</div>
                            <div className="user-role">{log.userRole}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="action-cell">
                        <div className="action-info">
                          <span className="action-name">{log.action}</span>
                          <span className="action-desc">{log.description}</span>
                        </div>
                      </td>
                      
                      <td className="account-cell">
                        <span className="account-number">{log.accountNumber}</span>
                      </td>
                      
                      <td className="outcome-cell">
                        <div className="outcome-badge" style={{ color: outcomeConfig.color }}>
                          <OutcomeIcon size={14} />
                          {outcomeConfig.label}
                        </div>
                      </td>
                      
                      <td className="risk-cell">
                        <span 
                          className="risk-badge"
                          style={{ color: getRiskColor(log.riskScore) }}
                        >
                          {log.riskScore}
                        </span>
                      </td>
                      
                      <td className="details-cell">
                        <button className="details-btn" title={log.details}>
                          <ExternalLink size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsAudit;