import React, { useState, useEffect } from 'react';
import {
  Calculator,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  BarChart3,
  Search,
  Calendar,
  ArrowRight,
  Percent,
  Target
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './BalanceComputation.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BalanceComputation = () => {
  const [formData, setFormData] = useState({
    accountId: '',
    amount: '',
    type: 'payment',
    description: ''
  });
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [computationResult, setComputationResult] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock account data for lookup
  const mockAccounts = [
    {
      id: 'UBA-234567',
      customer: 'Johnson & Associates Ltd',
      currentBalance: 2450000.00,
      currency: 'NGN',
      status: 'pending',
      region: 'Lagos',
      history: [
        { date: '2025-11-01', balance: 2800000, type: 'initial' },
        { date: '2025-11-05', balance: 2600000, type: 'payment' },
        { date: '2025-11-08', balance: 2450000, type: 'adjustment' }
      ]
    },
    {
      id: 'UBA-345678',
      customer: 'Mainland Motors Nigeria',
      currentBalance: 5678900.00,
      currency: 'NGN',
      status: 'verified',
      region: 'Lagos',
      history: [
        { date: '2025-10-15', balance: 6200000, type: 'initial' },
        { date: '2025-10-25', balance: 5900000, type: 'payment' },
        { date: '2025-11-02', balance: 5678900, type: 'recovery' }
      ]
    },
    {
      id: 'UBA-456789',
      customer: 'Kano Traders Cooperative',
      currentBalance: 890000.00,
      currency: 'NGN',
      status: 'cleared',
      region: 'Kano',
      history: [
        { date: '2025-10-20', balance: 1200000, type: 'initial' },
        { date: '2025-10-28', balance: 1000000, type: 'payment' },
        { date: '2025-11-01', balance: 890000, type: 'adjustment' }
      ]
    }
  ];

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-search for account when typing Account ID
    if (field === 'accountId' && value.length >= 3) {
      const account = mockAccounts.find(acc => 
        acc.id.toLowerCase().includes(value.toLowerCase())
      );
      setSelectedAccount(account || null);
    }

    // Clear account if ID is cleared
    if (field === 'accountId' && value === '') {
      setSelectedAccount(null);
      setComputationResult(null);
      setWarnings([]);
    }
  };

  // Compute balance effect in real-time
  useEffect(() => {
    if (selectedAccount && formData.amount && !isNaN(parseFloat(formData.amount))) {
      computeBalance();
    } else {
      setComputationResult(null);
      setWarnings([]);
    }
  }, [formData.amount, formData.type, selectedAccount]);

  const computeBalance = () => {
    if (!selectedAccount || !formData.amount) return;

    const amount = parseFloat(formData.amount);
    const currentBalance = selectedAccount.currentBalance;
    let newBalance;

    if (formData.type === 'payment') {
      newBalance = currentBalance - amount;
    } else { // recovery
      newBalance = currentBalance + amount;
    }

    const reductionPercentage = ((currentBalance - newBalance) / currentBalance) * 100;
    const isPartialPayment = formData.type === 'payment' && newBalance > 0;
    const isOverpayment = formData.type === 'payment' && newBalance < 0;
    const isSignificantRecovery = formData.type === 'recovery' && amount > currentBalance * 0.5;

    // Generate warnings
    const newWarnings = [];
    if (isPartialPayment && reductionPercentage < 50) {
      newWarnings.push({
        type: 'warning',
        message: `Partial payment of ${reductionPercentage.toFixed(1)}%. Consider full settlement.`,
        icon: AlertTriangle
      });
    }
    if (isOverpayment) {
      newWarnings.push({
        type: 'error',
        message: `Overpayment detected! Excess amount: ${formatCurrency(Math.abs(newBalance))}.`,
        icon: AlertTriangle
      });
    }
    if (isSignificantRecovery) {
      newWarnings.push({
        type: 'info',
        message: 'Significant recovery amount detected. Please verify with customer.',
        icon: Info
      });
    }
    if (newBalance === 0) {
      newWarnings.push({
        type: 'success',
        message: 'Full balance clearance achieved!',
        icon: CheckCircle
      });
    }

    setComputationResult({
      originalBalance: currentBalance,
      adjustmentAmount: amount,
      newBalance,
      reductionPercentage,
      balanceChange: currentBalance - newBalance,
      isPartialPayment,
      isOverpayment,
      canClear: newBalance <= 0
    });

    setWarnings(newWarnings);
  };

  const formatCurrency = (amount, currency = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Generate chart data for balance history
  const generateChartData = () => {
    if (!selectedAccount) return null;

    const history = selectedAccount.history;
    const labels = history.map(item => item.date);
    const balanceData = history.map(item => item.balance);
    
    // Add projected balance if computation exists
    if (computationResult) {
      labels.push('Projected');
      balanceData.push(computationResult.newBalance);
    }

    return {
      labels,
      datasets: [
        {
          label: 'Balance History',
          data: balanceData,
          backgroundColor: balanceData.map((_, index) => 
            index === balanceData.length - 1 && computationResult 
              ? '#dc2626' 
              : '#3b82f6'
          ),
          borderColor: balanceData.map((_, index) => 
            index === balanceData.length - 1 && computationResult 
              ? '#b91c1c' 
              : '#2563eb'
          ),
          borderWidth: 1,
          borderRadius: 4
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return formatCurrency(context.parsed.y);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatCurrency(value).replace('.00', '');
          }
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    alert('Computation saved successfully!');
  };

  return (
    <div className="balance-computation-container">
      <div className="computation-header">
        <div className="header-title">
          <Calculator size={24} />
          <div>
            <h2>Balance Computation</h2>
            <p>Simulate payment and recovery effects on memo balances</p>
          </div>
        </div>
      </div>

      <div className="computation-content">
        {/* Left Side - Form */}
        <div className="computation-form">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Transaction Details</h3>
              
              <div className="form-group">
                <label htmlFor="accountId">Account ID</label>
                <div className="input-wrapper">
                  <Search size={16} className="input-icon" />
                  <input
                    type="text"
                    id="accountId"
                    value={formData.accountId}
                    onChange={(e) => handleInputChange('accountId', e.target.value)}
                    placeholder="Enter or search Account ID..."
                    className="form-input"
                  />
                </div>
                {selectedAccount && (
                  <div className="account-info">
                    <CheckCircle size={14} className="success-icon" />
                    <span>{selectedAccount.customer}</span>
                  </div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="amount">Amount</label>
                  <div className="input-wrapper">
                    <DollarSign size={16} className="input-icon" />
                    <input
                      type="number"
                      id="amount"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      placeholder="0.00"
                      className="form-input"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="type">Transaction Type</label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="form-select"
                  >
                    <option value="payment">Payment (Reduces Balance)</option>
                    <option value="recovery">Recovery (Increases Balance)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description (Optional)</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Add notes about this transaction..."
                  className="form-textarea"
                  rows="3"
                />
              </div>

              {/* Warnings */}
              {warnings.length > 0 && (
                <div className="warnings-section">
                  {warnings.map((warning, index) => {
                    const Icon = warning.icon;
                    return (
                      <div key={index} className={`warning-item ${warning.type}`}>
                        <Icon size={16} />
                        <span>{warning.message}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                type="submit"
                className="submit-btn"
                disabled={!selectedAccount || !formData.amount || isLoading}
              >
                {isLoading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Calculator size={16} />
                    Save Computation
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side - Preview */}
        <div className="computation-preview">
          {selectedAccount ? (
            <>
              {/* Account Summary */}
              <div className="preview-card account-summary">
                <h3>Account Summary</h3>
                <div className="summary-item">
                  <span className="label">Account:</span>
                  <span className="value">{selectedAccount.id}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Customer:</span>
                  <span className="value">{selectedAccount.customer}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Current Balance:</span>
                  <span className="value balance">
                    {formatCurrency(selectedAccount.currentBalance)}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="label">Status:</span>
                  <span className={`value status ${selectedAccount.status}`}>
                    {selectedAccount.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Computation Result */}
              {computationResult && (
                <div className="preview-card computation-result">
                  <h3>Impact Analysis</h3>
                  
                  <div className="balance-flow">
                    <div className="balance-item original">
                      <span className="label">Original</span>
                      <span className="amount">
                        {formatCurrency(computationResult.originalBalance)}
                      </span>
                    </div>
                    
                    <div className="arrow-container">
                      <ArrowRight size={20} />
                      <span className={`change-amount ${formData.type}`}>
                        {formData.type === 'payment' ? '-' : '+'}
                        {formatCurrency(computationResult.adjustmentAmount)}
                      </span>
                    </div>
                    
                    <div className="balance-item new">
                      <span className="label">New Balance</span>
                      <span className={`amount ${computationResult.newBalance <= 0 ? 'cleared' : 'remaining'}`}>
                        {formatCurrency(Math.max(0, computationResult.newBalance))}
                      </span>
                    </div>
                  </div>

                  <div className="metrics-grid">
                    <div className="metric-item">
                      <Percent size={16} />
                      <div>
                        <span className="metric-label">Reduction</span>
                        <span className="metric-value">
                          {computationResult.reductionPercentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="metric-item">
                      <Target size={16} />
                      <div>
                        <span className="metric-label">Clearance</span>
                        <span className={`metric-value ${computationResult.canClear ? 'success' : 'warning'}`}>
                          {computationResult.canClear ? 'Full' : 'Partial'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Balance History Chart */}
              <div className="preview-card chart-container">
                <div className="chart-header">
                  <h3>Balance Timeline</h3>
                  <BarChart3 size={16} />
                </div>
                <div className="chart-wrapper">
                  {generateChartData() && (
                    <Bar data={generateChartData()} options={chartOptions} />
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="no-account-selected">
              <Search size={48} />
              <h3>Select an Account</h3>
              <p>Enter an Account ID to start balance computation</p>
              <div className="sample-accounts">
                <h4>Sample Account IDs:</h4>
                <div className="sample-list">
                  {mockAccounts.map(account => (
                    <button
                      key={account.id}
                      className="sample-account"
                      onClick={() => {
                        handleInputChange('accountId', account.id);
                        setSelectedAccount(account);
                      }}
                    >
                      <span className="account-id">{account.id}</span>
                      <span className="account-customer">{account.customer}</span>
                      <span className="account-balance">
                        {formatCurrency(account.currentBalance)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BalanceComputation;