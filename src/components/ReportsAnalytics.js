import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Download,
  Filter,
  Search,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  BarChart3,
  FileText,
  FileSpreadsheet,
  ChevronDown,
  MapPin,
  Clock,
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle,
  X,
  ArrowLeft,
  Sparkles,
  Eye,
  MoreVertical
} from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './ReportsAnalytics.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ReportsAnalytics = ({ user, onBack }) => {
  // State management
  const [filters, setFilters] = useState({
    dateRange: 'last30',
    startDate: '',
    endDate: '',
    region: 'all',
    reportType: 'summary',
    accountType: 'all',
    status: 'all'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedExportType, setSelectedExportType] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Mock report data
  const [mockData] = useState({
    summary: {
      totalExposure: 1250000000,
      exposureChange: -15.2,
      totalAccounts: 2847,
      accountsChange: 8.5,
      averageBalance: 439120,
      balanceChange: -12.8,
      complianceRate: 96.2,
      complianceChange: 2.1,
      regionData: [
        { region: 'Lagos', accounts: 1205, exposure: 520000000, compliance: 97.1 },
        { region: 'Abuja', accounts: 678, exposure: 310000000, compliance: 95.8 },
        { region: 'Port Harcourt', accounts: 534, exposure: 240000000, compliance: 94.2 },
        { region: 'Kano', accounts: 430, exposure: 180000000, compliance: 98.5 }
      ]
    },
    historical: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
      exposureData: [1450, 1398, 1367, 1334, 1301, 1289, 1276, 1263, 1252, 1248, 1250],
      accountsData: [2650, 2689, 2723, 2756, 2781, 2798, 2812, 2823, 2834, 2841, 2847],
      clearanceData: [145, 156, 167, 172, 168, 178, 182, 189, 194, 187, 191]
    }
  });

  // Chart configurations
  const stackedBarData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
    datasets: [
      {
        label: 'Pending Accounts',
        data: [45, 52, 48, 43, 51, 47, 49, 46, 44, 48, 42],
        backgroundColor: '#FFC107',
        borderColor: '#FFC107',
        borderWidth: 1
      },
      {
        label: 'Under Review',
        data: [28, 32, 29, 31, 27, 33, 30, 28, 32, 29, 31],
        backgroundColor: '#17A2B8',
        borderColor: '#17A2B8',
        borderWidth: 1
      },
      {
        label: 'Cleared',
        data: [145, 156, 167, 172, 168, 178, 182, 189, 194, 187, 191],
        backgroundColor: '#28A745',
        borderColor: '#28A745',
        borderWidth: 1
      },
      {
        label: 'Exceptions',
        data: [12, 8, 15, 9, 11, 7, 10, 13, 8, 12, 9],
        backgroundColor: '#DC3545',
        borderColor: '#DC3545',
        borderWidth: 1
      }
    ]
  };

  const trendLineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
    datasets: [
      {
        label: 'Total Exposure (₦M)',
        data: [1450, 1398, 1367, 1334, 1301, 1289, 1276, 1263, 1252, 1248, 1250],
        borderColor: '#DC2626',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y'
      },
      {
        label: 'Compliance Rate (%)',
        data: [94.2, 94.8, 95.1, 95.6, 95.9, 96.1, 96.3, 96.0, 96.4, 96.1, 96.2],
        borderColor: '#059669',
        backgroundColor: 'rgba(5, 150, 105, 0.1)',
        tension: 0.4,
        fill: false,
        yAxisID: 'y1'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: 'Inter',
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#DC2626',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          borderDash: [5, 5]
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 11
          },
          color: '#6B7280'
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          borderDash: [5, 5]
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 11
          },
          color: '#6B7280'
        }
      }
    }
  };

  const trendChartOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Exposure (₦M)',
          font: { family: 'Inter', size: 12, weight: 'bold' },
          color: '#DC2626'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          borderDash: [5, 5]
        },
        ticks: {
          font: { family: 'Inter', size: 11 },
          color: '#6B7280'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Compliance Rate (%)',
          font: { family: 'Inter', size: 12, weight: 'bold' },
          color: '#059669'
        },
        grid: {
          drawOnChartArea: false
        },
        ticks: {
          font: { family: 'Inter', size: 11 },
          color: '#6B7280'
        }
      }
    }
  };

  // Mock table data
  const tableData = [
    { id: 1, region: 'Lagos', branch: 'Victoria Island', accounts: 234, exposure: 125000000, cleared: 89, pending: 23, compliance: 97.2, lastUpdate: '2025-11-12' },
    { id: 2, region: 'Lagos', branch: 'Ikeja', accounts: 189, exposure: 98500000, cleared: 67, pending: 18, compliance: 96.8, lastUpdate: '2025-11-12' },
    { id: 3, region: 'Abuja', branch: 'Central Area', accounts: 167, exposure: 87300000, cleared: 56, pending: 15, compliance: 95.9, lastUpdate: '2025-11-12' },
    { id: 4, region: 'Port Harcourt', branch: 'GRA', accounts: 145, exposure: 76200000, cleared: 48, pending: 12, compliance: 94.5, lastUpdate: '2025-11-12' },
    { id: 5, region: 'Kano', branch: 'Bompai', accounts: 123, exposure: 65800000, cleared: 42, pending: 9, compliance: 98.1, lastUpdate: '2025-11-12' }
  ];

  // AI Insights
  const aiInsights = [
    {
      type: 'trend',
      icon: TrendingDown,
      title: 'Exposure Reduction',
      insight: 'Total exposure decreased by 15.2% week-on-week, indicating improved risk management.',
      impact: 'positive',
      confidence: 92
    },
    {
      type: 'performance',
      icon: TrendingUp,
      title: 'Compliance Improvement',
      insight: 'SLA compliance rate improved by 2.1% this month, reaching 96.2%.',
      impact: 'positive',
      confidence: 87
    },
    {
      type: 'risk',
      icon: AlertCircle,
      title: 'Regional Variance',
      insight: 'Port Harcourt region shows 3.9% lower compliance than average. Requires attention.',
      impact: 'warning',
      confidence: 94
    },
    {
      type: 'opportunity',
      icon: CheckCircle,
      title: 'Automation Opportunity',
      insight: 'Lagos region processing times are 23% faster, suggesting successful automation adoption.',
      impact: 'positive',
      confidence: 89
    }
  ];

  // Filter handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilters = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowFilterPanel(false);
      // In real app, this would fetch filtered data
    }, 1000);
  };

  const resetFilters = () => {
    setFilters({
      dateRange: 'last30',
      startDate: '',
      endDate: '',
      region: 'all',
      reportType: 'summary',
      accountType: 'all',
      status: 'all'
    });
  };

  // Export handlers
  const handleExport = (type) => {
    setSelectedExportType(type);
    setShowExportModal(true);
  };

  const confirmExport = () => {
    setShowExportModal(false);
    // In real app, this would trigger file download
    alert(`Exporting ${selectedExportType} file...`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getChangeColor = (value) => {
    return value > 0 ? '#059669' : '#DC2626';
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'positive': return '#059669';
      case 'warning': return '#F59E0B';
      case 'negative': return '#DC2626';
      default: return '#6B7280';
    }
  };

  return (
    <div className="reports-analytics-container">
      {/* Header Section */}
      <div className="reports-header">
        <div className="header-left">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={20} />
          </button>
          <div className="header-info">
            <h1>Reports & Analytics</h1>
            <p>Comprehensive reporting and data analysis dashboard</p>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
          >
            <Filter size={16} />
            Filters
            <ChevronDown size={14} />
          </button>
          <button className="btn btn-primary" onClick={() => applyFilters()}>
            <RefreshCw size={16} className={isLoading ? 'spinning' : ''} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className="filter-panel">
          <div className="filter-grid">
            <div className="filter-group">
              <label>Date Range</label>
              <select 
                value={filters.dateRange} 
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              >
                <option value="last7">Last 7 Days</option>
                <option value="last30">Last 30 Days</option>
                <option value="last90">Last 90 Days</option>
                <option value="ytd">Year to Date</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {filters.dateRange === 'custom' && (
              <>
                <div className="filter-group">
                  <label>Start Date</label>
                  <input 
                    type="date" 
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  />
                </div>
                <div className="filter-group">
                  <label>End Date</label>
                  <input 
                    type="date" 
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="filter-group">
              <label>Region</label>
              <select 
                value={filters.region} 
                onChange={(e) => handleFilterChange('region', e.target.value)}
              >
                <option value="all">All Regions</option>
                <option value="lagos">Lagos</option>
                <option value="abuja">Abuja</option>
                <option value="port-harcourt">Port Harcourt</option>
                <option value="kano">Kano</option>
                <option value="kaduna">Kaduna</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Report Type</label>
              <select 
                value={filters.reportType} 
                onChange={(e) => handleFilterChange('reportType', e.target.value)}
              >
                <option value="summary">Summary Report</option>
                <option value="detailed">Detailed Analysis</option>
                <option value="compliance">Compliance Report</option>
                <option value="trend">Trend Analysis</option>
                <option value="regional">Regional Breakdown</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Account Type</label>
              <select 
                value={filters.accountType} 
                onChange={(e) => handleFilterChange('accountType', e.target.value)}
              >
                <option value="all">All Account Types</option>
                <option value="savings">Savings</option>
                <option value="current">Current</option>
                <option value="loan">Loan</option>
                <option value="term-deposit">Term Deposit</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Status</label>
              <select 
                value={filters.status} 
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="cleared">Cleared</option>
                <option value="exception">Exception</option>
              </select>
            </div>
          </div>

          <div className="filter-actions">
            <button className="btn btn-secondary" onClick={resetFilters}>
              Reset Filters
            </button>
            <button className="btn btn-primary" onClick={applyFilters}>
              <Search size={16} />
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon">
            <DollarSign size={24} color="#DC2626" />
          </div>
          <div className="kpi-content">
            <h3>Total Exposure</h3>
            <div className="kpi-value">{formatCurrency(mockData.summary.totalExposure)}</div>
            <div className="kpi-change" style={{ color: getChangeColor(mockData.summary.exposureChange) }}>
              {mockData.summary.exposureChange > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {formatPercentage(mockData.summary.exposureChange)}
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">
            <Users size={24} color="#059669" />
          </div>
          <div className="kpi-content">
            <h3>Total Accounts</h3>
            <div className="kpi-value">{mockData.summary.totalAccounts.toLocaleString()}</div>
            <div className="kpi-change" style={{ color: getChangeColor(mockData.summary.accountsChange) }}>
              <TrendingUp size={14} />
              {formatPercentage(mockData.summary.accountsChange)}
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">
            <BarChart3 size={24} color="#F59E0B" />
          </div>
          <div className="kpi-content">
            <h3>Average Balance</h3>
            <div className="kpi-value">{formatCurrency(mockData.summary.averageBalance)}</div>
            <div className="kpi-change" style={{ color: getChangeColor(mockData.summary.balanceChange) }}>
              <TrendingDown size={14} />
              {formatPercentage(mockData.summary.balanceChange)}
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">
            <CheckCircle size={24} color="#8B5CF6" />
          </div>
          <div className="kpi-content">
            <h3>Compliance Rate</h3>
            <div className="kpi-value">{mockData.summary.complianceRate}%</div>
            <div className="kpi-change" style={{ color: getChangeColor(mockData.summary.complianceChange) }}>
              <TrendingUp size={14} />
              {formatPercentage(mockData.summary.complianceChange)}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Account Status Distribution</h3>
            <p>Monthly breakdown by processing status</p>
          </div>
          <div className="chart-container">
            <Bar data={stackedBarData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Exposure & Compliance Trends</h3>
            <p>Historical analysis of key metrics</p>
          </div>
          <div className="chart-container">
            <Line data={trendLineData} options={trendChartOptions} />
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="ai-insights-section">
        <div className="section-header">
          <h3>
            <Sparkles size={20} />
            AI-Powered Insights
          </h3>
          <p>Intelligent analysis of your data patterns and trends</p>
        </div>

        <div className="insights-grid">
          {aiInsights.map((insight, index) => {
            const IconComponent = insight.icon;
            return (
              <div key={index} className={`insight-card ${insight.impact}`}>
                <div className="insight-header">
                  <div className="insight-icon" style={{ color: getImpactColor(insight.impact) }}>
                    <IconComponent size={20} />
                  </div>
                  <div className="insight-meta">
                    <h4>{insight.title}</h4>
                    <div className="confidence-score">
                      {insight.confidence}% confidence
                    </div>
                  </div>
                </div>
                <p className="insight-text">{insight.insight}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Table Section */}
      <div className="data-table-section">
        <div className="table-header">
          <div className="table-title">
            <h3>Regional Performance Summary</h3>
            <p>Detailed breakdown by region and branch</p>
          </div>
          <div className="table-actions">
            <button className="btn btn-secondary" onClick={() => handleExport('PDF')}>
              <FileText size={16} />
              PDF
            </button>
            <button className="btn btn-secondary" onClick={() => handleExport('CSV')}>
              <FileSpreadsheet size={16} />
              CSV
            </button>
            <button className="btn btn-secondary" onClick={() => handleExport('Excel')}>
              <FileSpreadsheet size={16} />
              Excel
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Region</th>
                <th>Branch</th>
                <th>Accounts</th>
                <th>Exposure</th>
                <th>Cleared</th>
                <th>Pending</th>
                <th>Compliance %</th>
                <th>Last Update</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map(row => (
                <tr key={row.id}>
                  <td>
                    <div className="cell-content">
                      <MapPin size={14} />
                      {row.region}
                    </div>
                  </td>
                  <td>{row.branch}</td>
                  <td className="number-cell">{row.accounts.toLocaleString()}</td>
                  <td className="currency-cell">{formatCurrency(row.exposure)}</td>
                  <td className="number-cell">
                    <span className="status-badge cleared">{row.cleared}</span>
                  </td>
                  <td className="number-cell">
                    <span className="status-badge pending">{row.pending}</span>
                  </td>
                  <td className="percentage-cell">
                    <div className="compliance-indicator">
                      <span className={row.compliance > 96 ? 'high' : row.compliance > 94 ? 'medium' : 'low'}>
                        {row.compliance}%
                      </span>
                    </div>
                  </td>
                  <td className="date-cell">
                    <Clock size={12} />
                    {row.lastUpdate}
                  </td>
                  <td className="actions-cell">
                    <button className="action-btn">
                      <Eye size={14} />
                    </button>
                    <button className="action-btn">
                      <MoreVertical size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="modal-overlay">
          <div className="export-modal">
            <div className="modal-header">
              <h3>Export Report</h3>
              <button className="close-btn" onClick={() => setShowExportModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>Export the current report data as <strong>{selectedExportType}</strong>?</p>
              <div className="export-options">
                <label className="checkbox-option">
                  <input type="checkbox" defaultChecked />
                  <span>Include charts and visualizations</span>
                </label>
                <label className="checkbox-option">
                  <input type="checkbox" defaultChecked />
                  <span>Include AI insights summary</span>
                </label>
                <label className="checkbox-option">
                  <input type="checkbox" defaultChecked />
                  <span>Include filter parameters</span>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowExportModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={confirmExport}>
                <Download size={16} />
                Export {selectedExportType}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsAnalytics;