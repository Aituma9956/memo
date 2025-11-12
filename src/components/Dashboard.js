import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  User,
  LogOut,
  RotateCcw,
  Home,
  Users,
  FileText,
  AlertTriangle,
  Settings,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CheckCircle,
  Clock,
  Target,
  X,
  Filter,
  ChevronDown,
  Calculator,
  GitBranch,
  Wifi,
  RefreshCw,
  Globe,
  Activity,
  BarChart3,
  XCircle
} from 'lucide-react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import AccountList from './AccountList';
import BalanceComputation from './BalanceComputation';
import VerificationWorkflow from './VerificationWorkflow';
import ReportsAnalytics from './ReportsAnalytics';
import AlertsAudit from './AlertsAudit';
import ubaLogo from './uba logo.webp';
import './Dashboard.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('Nigeria');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock data for KPIs
  const kpiData = {
    totalBalance: 45678923.45,
    pendingApprovals: 23,
    clearedAccounts: 156,
    slaCompliance: 94.5
  };

  // Countries data
  const countries = [
    { code: 'NG', name: 'Nigeria' },
    { code: 'GH', name: 'Ghana' },
    { code: 'KE', name: 'Kenya' },
    { code: 'UG', name: 'Uganda' },
    { code: 'TZ', name: 'Tanzania' }
  ];

  // System Integration Status
  const systemStatus = [
    { name: 'Vision', status: 'connected', icon: Wifi },
    { name: 'Finacle', status: 'synced', icon: RefreshCw },
    { name: 'ICAD', status: 'pending', icon: Clock }
  ];

  // Performance KPIs
  const performanceKpis = {
    avgClearanceTime: '18.5 hrs',
    slaComplianceRate: 94.5,
    outstandingExceptions: 12
  };

  // Mock data for charts
  const pieData = {
    labels: ['Pending', 'Verified', 'Cleared', 'Exception'],
    datasets: [
      {
        data: [35, 45, 156, 8],
        backgroundColor: ['#FFC107', '#17A2B8', '#28A745', '#DC3545'],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Cleared Accounts',
        data: [12, 19, 25, 32, 28, 45, 38],
        borderColor: '#28A745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'New Accounts',
        data: [8, 15, 18, 25, 22, 35, 30],
        borderColor: '#007BFF',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  // Initialize alerts
  useEffect(() => {
    setAlerts([
      {
        id: 1,
        type: 'warning',
        title: 'SLA Breach Alert',
        message: 'Account UBA-234567 exceeds 48hr SLA',
        time: '2 mins ago',
        isAnomalyAlert: false
      },
      {
        id: 2,
        type: 'info',
        title: 'New Assignment',
        message: '5 new memo accounts assigned to your queue',
        time: '15 mins ago',
        isAnomalyAlert: false
      },
      {
        id: 3,
        type: 'anomaly',
        title: 'AI Anomaly Detected',
        message: 'Unusual pattern in account UBA-345678 transactions',
        time: '1 hour ago',
        isAnomalyAlert: true
      }
    ]);
  }, []);

  // Update timer every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setLastUpdated(new Date());
    // Simulate data refresh based on country
    console.log('Refreshing data for country:', country);
  };

  const formatLastUpdated = () => {
    return lastUpdated.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const dismissAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
    // You can open a modal here or navigate to account details
    console.log('Selected account:', account);
  };

  const handleKpiClick = (kpiType) => {
    // Navigate to accounts with filter based on KPI clicked
    setActiveSection('accounts');
    console.log('Filtering accounts by:', kpiType);
  };

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'accounts', icon: Users, label: 'Accounts' },
    { id: 'computation', icon: Calculator, label: 'Balance Computation' },
    { id: 'workflow', icon: GitBranch, label: 'Verification Workflow' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'alerts', icon: AlertTriangle, label: 'Alerts' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <nav className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <img src={ubaLogo} alt="UBA Logo" className="logo-image" />
            <span>MBP Platform</span>
          </div>
        </div>
        
        <div className="sidebar-menu">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`menu-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => setActiveSection(item.id)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <header className="top-bar">
          <div className="top-bar-left">
            <div className="country-selector">
              <Globe size={16} />
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="country-select"
              >
                {countries.map(country => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="sync-status">
              <RefreshCw size={14} />
              <span>Last updated: {formatLastUpdated()}</span>
            </div>
          </div>
          
          <div className="search-section">
            <div className="search-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search accounts, customers, or memo IDs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="top-bar-actions">
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            
            <div className="profile-dropdown">
              <button
                className="profile-btn"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <User size={20} />
                <span>{user?.username || 'User'}</span>
                <ChevronDown size={16} />
              </button>
              
              {showProfileDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <strong>{user?.username}</strong>
                    <small>{user?.role}</small>
                  </div>
                  <hr />
                  <button className="dropdown-item">
                    <RotateCcw size={16} />
                    Switch Role
                  </button>
                  <button className="dropdown-item" onClick={onLogout}>
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content based on active section */}
        {activeSection === 'dashboard' && (
          <div className="dashboard-content">
            {/* System Integration Status */}
            <div className="integration-status-section">
              <h4>System Integration Status</h4>
              <div className="integration-cards">
                {systemStatus.map((system, index) => {
                  const Icon = system.icon;
                  return (
                    <div key={index} className={`integration-card ${system.status}`}>
                      <div className="integration-card-header">
                        <h4 className="system-name">{system.name}</h4>
                        <span className="status-indicator">
                          {system.status === 'connected' && 'Connected'}
                          {system.status === 'synced' && 'Synced'}
                          {system.status === 'pending' && 'Pending'}
                        </span>
                      </div>
                      <div className="integration-card-details">
                        <div className="integration-detail">
                          <span className="integration-detail-label">Last Sync:</span>
                          <span className="integration-detail-value">
                            {system.status === 'connected' ? '2 mins ago' : 
                             system.status === 'synced' ? '5 mins ago' : 
                             'In progress...'}
                          </span>
                        </div>
                        <div className="integration-detail">
                          <span className="integration-detail-label">Status:</span>
                          <span className="integration-detail-value">
                            {system.status === 'connected' ? 'Active' : 
                             system.status === 'synced' ? 'Synchronized' : 
                             'Connecting...'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* KPI Cards */}
            <div className="kpi-section">
              <div 
                className="kpi-card total-balance"
                onClick={() => handleKpiClick('total-balance')}
              >
                <div className="kpi-icon">
                  <DollarSign size={24} />
                </div>
                <div className="kpi-content">
                  <h3>Total Memo Balances</h3>
                  <p className="kpi-value">{formatCurrency(kpiData.totalBalance)}</p>
                  <span className="kpi-trend positive">
                    <TrendingUp size={16} />
                    +12.5%
                  </span>
                </div>
              </div>

              <div 
                className="kpi-card pending-approvals"
                onClick={() => handleKpiClick('pending-approvals')}
              >
                <div className="kpi-icon">
                  <Clock size={24} />
                </div>
                <div className="kpi-content">
                  <h3>Pending Approvals</h3>
                  <p className="kpi-value">{kpiData.pendingApprovals}</p>
                  <span className="kpi-trend neutral">
                    <TrendingDown size={16} />
                    -3 from yesterday
                  </span>
                </div>
              </div>

              <div 
                className="kpi-card cleared-accounts"
                onClick={() => handleKpiClick('cleared-accounts')}
              >
                <div className="kpi-icon">
                  <CheckCircle size={24} />
                </div>
                <div className="kpi-content">
                  <h3>Cleared Accounts</h3>
                  <p className="kpi-value">{kpiData.clearedAccounts}</p>
                  <span className="kpi-trend positive">
                    <TrendingUp size={16} />
                    +18 this week
                  </span>
                </div>
              </div>

              <div 
                className="kpi-card sla-compliance"
                onClick={() => handleKpiClick('sla-compliance')}
              >
                <div className="kpi-icon">
                  <Target size={24} />
                </div>
                <div className="kpi-content">
                  <h3>SLA Compliance</h3>
                  <p className="kpi-value">{kpiData.slaCompliance}%</p>
                  <span className="kpi-trend positive">
                    <TrendingUp size={16} />
                    +2.1%
                  </span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="charts-section">
              <div className="chart-card pie-chart">
                <div className="chart-header">
                  <h3>Balance Status Breakdown</h3>
                  <button className="filter-btn">
                    <Filter size={16} />
                    Filter
                  </button>
                </div>
                <div className="chart-container">
                  <Pie data={pieData} options={chartOptions} />
                </div>
              </div>

              <div className="chart-card line-chart">
                <div className="chart-header">
                  <h3>Clearance Trends</h3>
                  <div className="chart-controls">
                    <select className="time-period-select">
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>Last 90 days</option>
                    </select>
                  </div>
                </div>
                <div className="chart-container">
                  <Line data={lineData} options={chartOptions} />
                </div>
              </div>
            </div>

            {/* Performance KPIs Panel */}
            <div className="performance-panel">
              <h3>Performance KPIs</h3>
              <div className="performance-cards">
                <div className="performance-card">
                  <div className="performance-icon">
                    <Clock size={20} />
                  </div>
                  <div className="performance-content">
                    <h4>Avg ICAD Clearance Time</h4>
                    <p className="performance-value">{performanceKpis.avgClearanceTime}</p>
                    <span className="performance-trend positive">
                      <TrendingDown size={12} />
                      2.3 hrs faster
                    </span>
                  </div>
                </div>

                <div className="performance-card">
                  <div className="performance-icon">
                    <Target size={20} />
                  </div>
                  <div className="performance-content">
                    <h4>SLA Compliance Rate</h4>
                    <p className="performance-value">{performanceKpis.slaComplianceRate}%</p>
                    <span className="performance-trend positive">
                      <TrendingUp size={12} />
                      +1.2%
                    </span>
                  </div>
                </div>

                <div className="performance-card">
                  <div className="performance-icon">
                    <XCircle size={20} />
                  </div>
                  <div className="performance-content">
                    <h4>Outstanding Exceptions</h4>
                    <p className="performance-value">{performanceKpis.outstandingExceptions}</p>
                    <span className="performance-trend negative">
                      <TrendingUp size={12} />
                      +3 from last week
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts Feed */}
            <div className="alerts-feed">
              <div className="alerts-header">
                <h3>Live Alerts</h3>
                <span className="alerts-count">{alerts.length} active</span>
              </div>
              
              <div className="alerts-list">
                {alerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`alert-item ${alert.type} ${alert.isAnomalyAlert ? 'anomaly' : ''}`}
                  >
                    <div className="alert-content">
                      <div className="alert-header">
                        <strong>{alert.title}</strong>
                        {alert.isAnomalyAlert && (
                          <span className="ai-badge">AI</span>
                        )}
                      </div>
                      <p>{alert.message}</p>
                      <small>{alert.time}</small>
                    </div>
                    <button
                      className="dismiss-btn"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Account List Section */}
        {activeSection === 'accounts' && (
          <AccountList 
            onAccountSelect={handleAccountSelect}
            onBack={() => setActiveSection('dashboard')}
          />
        )}

        {/* Balance Computation Section */}
        {activeSection === 'computation' && (
          <BalanceComputation />
        )}

        {/* Verification Workflow Section */}
        {activeSection === 'workflow' && (
          <VerificationWorkflow 
            user={user}
            onBack={() => setActiveSection('dashboard')}
          />
        )}

        {/* Reports & Analytics Section */}
        {activeSection === 'reports' && (
          <ReportsAnalytics 
            user={user}
            onBack={() => setActiveSection('dashboard')}
          />
        )}

        {/* Alerts & Audit Section */}
        {activeSection === 'alerts' && (
          <AlertsAudit 
            user={user}
            onBack={() => setActiveSection('dashboard')}
          />
        )}

        {activeSection === 'settings' && (
          <div className="dashboard-content">
            <h2>Settings Section</h2>
            <p>System settings will be implemented here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;