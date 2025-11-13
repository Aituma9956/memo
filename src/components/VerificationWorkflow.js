import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  FileText,
  Shield,
  Send,
  Play,
  Pause,
  ChevronRight,
  Calendar,
  Timer,
  Users,
  Lock,
  Unlock,
  Check,
  X,
  Info,
  Upload,
  Download,
  Eye,
  MessageSquare,
  Loader2
} from 'lucide-react';
import './VerificationWorkflow.css';

const VerificationWorkflow = ({ user, selectedAccount, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [slaStatus, setSlaStatus] = useState('normal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [roleAuthorized, setRoleAuthorized] = useState(true);

  // Mock account for demo if none selected
  const account = selectedAccount || {
    id: 'UBA-234567',
    customer: 'Johnson & Associates Ltd',
    balance: 2450000.00,
    currency: 'NGN',
    status: 'pending',
    region: 'Lagos',
    dateDetected: '2025-11-10',
    slaDeadline: '2025-11-14T18:00:00', // 48 hours from detection
    assignedOfficer: 'credit.admin',
    priority: 'normal'
  };

  // Define workflow steps
  const steps = [
    {
      id: 'initiate',
      title: 'Initiate Review',
      description: 'Start the verification process and assign responsibilities',
      icon: Play,
      status: 'completed',
      requiredRole: ['credit-admin', 'recovery-officer', 'csm'],
      fields: ['assignment', 'priority', 'notes']
    },
    {
      id: 'verify',
      title: 'Verify Details',
      description: 'Validate account information and supporting documents',
      icon: Shield,
      status: currentStep >= 1 ? 'current' : 'pending',
      requiredRole: ['Team Lead', ''],
      fields: ['verification', 'documentation', 'risk-assessment']
    },
    {
      id: 'approve',
      title: 'Approve Action',
      description: 'Senior approval for clearance or further action',
      icon: CheckCircle,
      status: currentStep >= 2 ? 'current' : 'pending',
      requiredRole: ['Senior Officer'],
      fields: ['approval-decision', 'amount-adjustment', 'conditions']
    },
    {
      id: 'clear',
      title: 'Clear Account',
      description: 'Final clearance and system updates',
      icon: Send,
      status: currentStep >= 3 ? 'current' : 'pending',
      requiredRole: ['credit-admin'],
      fields: ['clearance-method', 'icad-submission', 'final-notes']
    }
  ];

  // Initialize SLA countdown
  useEffect(() => {
    if (account.slaDeadline) {
      const deadline = new Date(account.slaDeadline);
      const updateTimer = () => {
        const now = new Date();
        const diff = deadline.getTime() - now.getTime();
        
        if (diff > 0) {
          setTimeRemaining(diff);
          // Determine SLA status based on time remaining
          const hoursLeft = diff / (1000 * 60 * 60);
          if (hoursLeft <= 4) {
            setSlaStatus('critical');
          } else if (hoursLeft <= 12) {
            setSlaStatus('warning');
          } else {
            setSlaStatus('normal');
          }
        } else {
          setTimeRemaining(0);
          setSlaStatus('exceeded');
        }
      };

      updateTimer();
      const timer = setInterval(updateTimer, 60000); // Update every minute
      return () => clearInterval(timer);
    }
  }, [account.slaDeadline]);

  // Check role authorization for current step
  useEffect(() => {
    const currentStepData = steps[currentStep];
    const userRole = user?.role?.replace(/\s+/g, '-').toLowerCase() || 'guest';
    const isAuthorized = currentStepData?.requiredRole.includes(userRole);
    setRoleAuthorized(isAuthorized);
  }, [currentStep, user]);

  const formatTimeRemaining = (milliseconds) => {
    if (!milliseconds || milliseconds <= 0) return '00:00:00';
    
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleFieldChange = (field, value) => {
    setStepData(prev => ({
      ...prev,
      [currentStep]: {
        ...prev[currentStep],
        [field]: value
      }
    }));
  };

  const handleStepComplete = async () => {
    if (!roleAuthorized) {
      showToastMessage('error', 'You are not authorized to complete this step');
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      showToastMessage('success', `Step ${currentStep + 1} completed successfully!`);
    } else {
      showToastMessage('success', 'Workflow completed! Account has been cleared.');
      // Here you would typically update the account status
    }
    
    setIsProcessing(false);
  };

  const showToastMessage = (type, message) => {
    setShowToast({ type, message });
    setTimeout(() => setShowToast(null), 4000);
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step.id) {
      case 'initiate':
        return (
          <div className="step-content">
            <div className="field-group">
              <label>Assigned Officer</label>
              <div className="input-wrapper">
                <User size={16} />
                <select 
                  value={stepData[currentStep]?.assignment || user?.username || ''}
                  onChange={(e) => handleFieldChange('assignment', e.target.value)}
                >
                  <option value={user?.username}>{user?.username} (You)</option>
                  <option value="senior.officer">senior.officer</option>
                  <option value="team.lead">team.lead</option>
                </select>
              </div>
            </div>
            
            <div className="field-group">
              <label>Priority Level</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input 
                    type="radio" 
                    name="priority" 
                    value="normal"
                    checked={stepData[currentStep]?.priority === 'normal'}
                    onChange={(e) => handleFieldChange('priority', e.target.value)}
                  />
                  <span>Normal</span>
                </label>
                <label className="radio-option">
                  <input 
                    type="radio" 
                    name="priority" 
                    value="high"
                    checked={stepData[currentStep]?.priority === 'high'}
                    onChange={(e) => handleFieldChange('priority', e.target.value)}
                  />
                  <span>High</span>
                </label>
                <label className="radio-option">
                  <input 
                    type="radio" 
                    name="priority" 
                    value="urgent"
                    checked={stepData[currentStep]?.priority === 'urgent'}
                    onChange={(e) => handleFieldChange('priority', e.target.value)}
                  />
                  <span>Urgent</span>
                </label>
              </div>
            </div>
            
            <div className="field-group">
              <label>Initial Notes</label>
              <textarea
                placeholder="Add any initial observations or notes..."
                value={stepData[currentStep]?.notes || ''}
                onChange={(e) => handleFieldChange('notes', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        );
        
      case 'verify':
        return (
          <div className="step-content">
            <div className="field-group">
              <label>Verification Checklist</label>
              <div className="checkbox-group">
                <label className="checkbox-option">
                  <input type="checkbox" />
                  <CheckCircle size={16} />
                  <span>Customer details verified</span>
                </label>
                <label className="checkbox-option">
                  <input type="checkbox" />
                  <CheckCircle size={16} />
                  <span>Account balance confirmed</span>
                </label>
                <label className="checkbox-option">
                  <input type="checkbox" />
                  <CheckCircle size={16} />
                  <span>Supporting documents reviewed</span>
                </label>
                <label className="checkbox-option">
                  <input type="checkbox" />
                  <CheckCircle size={16} />
                  <span>Transaction history analyzed</span>
                </label>
              </div>
            </div>
            
            <div className="field-group">
              <label>Risk Assessment</label>
              <div className="risk-indicators">
                <div className="risk-item">
                  <span className="risk-label">Customer Risk:</span>
                  <select>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="risk-item">
                  <span className="risk-label">Amount Risk:</span>
                  <select>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="field-group">
              <label>Verification Notes</label>
              <textarea
                placeholder="Document verification findings and any concerns..."
                value={stepData[currentStep]?.verification || ''}
                onChange={(e) => handleFieldChange('verification', e.target.value)}
                rows={4}
              />
            </div>
          </div>
        );
        
      case 'approve':
        return (
          <div className="step-content">
            <div className="field-group">
              <label>Approval Decision</label>
              <div className="decision-group">
                <label className="decision-option approve">
                  <input 
                    type="radio" 
                    name="decision" 
                    value="approve"
                    checked={stepData[currentStep]?.decision === 'approve'}
                    onChange={(e) => handleFieldChange('decision', e.target.value)}
                  />
                  <CheckCircle size={20} />
                  <span>Approve for Clearance</span>
                </label>
                <label className="decision-option reject">
                  <input 
                    type="radio" 
                    name="decision" 
                    value="reject"
                    checked={stepData[currentStep]?.decision === 'reject'}
                    onChange={(e) => handleFieldChange('decision', e.target.value)}
                  />
                  <X size={20} />
                  <span>Reject & Return</span>
                </label>
                <label className="decision-option conditional">
                  <input 
                    type="radio" 
                    name="decision" 
                    value="conditional"
                    checked={stepData[currentStep]?.decision === 'conditional'}
                    onChange={(e) => handleFieldChange('decision', e.target.value)}
                  />
                  <AlertTriangle size={20} />
                  <span>Conditional Approval</span>
                </label>
              </div>
            </div>
            
            <div className="field-group">
              <label>Approved Amount</label>
              <div className="input-wrapper">
                <span className="currency-symbol">₦</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={stepData[currentStep]?.amount || account.balance}
                  onChange={(e) => handleFieldChange('amount', e.target.value)}
                />
              </div>
            </div>
            
            <div className="field-group">
              <label>Approval Comments</label>
              <textarea
                placeholder="Provide approval rationale and any conditions..."
                value={stepData[currentStep]?.comments || ''}
                onChange={(e) => handleFieldChange('comments', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        );
        
      case 'clear':
        return (
          <div className="step-content">
            <div className="field-group">
              <label>Clearance Method</label>
              <div className="method-group">
                <label className="method-option">
                  <input 
                    type="radio" 
                    name="method" 
                    value="full-payment"
                    checked={stepData[currentStep]?.method === 'full-payment'}
                    onChange={(e) => handleFieldChange('method', e.target.value)}
                  />
                  <span>Full Payment Received</span>
                </label>
                <label className="method-option">
                  <input 
                    type="radio" 
                    name="method" 
                    value="write-off"
                    checked={stepData[currentStep]?.method === 'write-off'}
                    onChange={(e) => handleFieldChange('method', e.target.value)}
                  />
                  <span>Write-off Approved</span>
                </label>
                <label className="method-option">
                  <input 
                    type="radio" 
                    name="method" 
                    value="adjustment"
                    checked={stepData[currentStep]?.method === 'adjustment'}
                    onChange={(e) => handleFieldChange('method', e.target.value)}
                  />
                  <span>Balance Adjustment</span>
                </label>
              </div>
            </div>
            
            <div className="field-group">
              <label>ICAD Submission</label>
              <div className="icad-options">
                <label className="checkbox-option">
                  <input type="checkbox" defaultChecked />
                  <span>Submit to ICAD automatically</span>
                </label>
                <label className="checkbox-option">
                  <input type="checkbox" />
                  <span>Generate final report</span>
                </label>
                <label className="checkbox-option">
                  <input type="checkbox" defaultChecked />
                  <span>Update customer records</span>
                </label>
              </div>
            </div>
            
            <div className="field-group">
              <label>Final Notes</label>
              <textarea
                placeholder="Add final comments and closure notes..."
                value={stepData[currentStep]?.finalNotes || ''}
                onChange={(e) => handleFieldChange('finalNotes', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        );
        
      default:
        return <div>Step content not found</div>;
    }
  };

  return (
    <div className="verification-workflow-container">
      {/* Header with SLA Timer */}
      <div className="workflow-header">
        <div className="header-info">
          <h2>Verification & Clearance Workflow</h2>
          <p>Account: <strong>{account.id}</strong> - {account.customer}</p>
        </div>
        
        <div className={`sla-timer ${slaStatus}`}>
          <Timer size={20} />
          <div className="timer-info">
            <span className="timer-label">SLA Deadline:</span>
            <span className="timer-value">{formatTimeRemaining(timeRemaining)}</span>
            <span className="timer-status">
              {slaStatus === 'exceeded' && 'EXCEEDED'}
              {slaStatus === 'critical' && 'CRITICAL'}
              {slaStatus === 'warning' && 'WARNING'}
              {slaStatus === 'normal' && 'ON TRACK'}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="stepper-container">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isPending = index > currentStep;
          
          return (
            <div key={step.id} className={`stepper-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isPending ? 'pending' : ''}`}>
              <div className="stepper-icon">
                <Icon size={20} />
                {isCompleted && <Check size={12} className="check-overlay" />}
              </div>
              <div className="stepper-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <div className="step-meta">
                  <span className="required-role">
                    <Users size={12} />
                    {step.requiredRole.join(', ')}
                  </span>
                </div>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight className="stepper-arrow" size={16} />
              )}
            </div>
          );
        })}
      </div>

      {/* Current Step Content */}
      <div className="step-panel">
        <div className="step-header">
          <div className="step-title">
            <div className="step-number">{currentStep + 1}</div>
            <div>
              <h3>{steps[currentStep].title}</h3>
              <p>{steps[currentStep].description}</p>
            </div>
          </div>
          
          {!roleAuthorized && (
            <div className="authorization-warning">
              <Lock size={16} />
              <span>You don't have permission to complete this step</span>
            </div>
          )}
        </div>
        
        <div className="step-body">
          {renderStepContent()}
        </div>
        
        <div className="step-footer">
          <div className="footer-left">
            {currentStep > 0 && (
              <button 
                className="btn btn-secondary"
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={isProcessing}
              >
                Previous Step
              </button>
            )}
          </div>
          
          <div className="footer-right">
            <button 
              className={`btn ${currentStep === steps.length - 1 ? 'btn-success' : 'btn-primary'}`}
              onClick={handleStepComplete}
              disabled={!roleAuthorized || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="spinning" size={16} />
                  Processing...
                </>
              ) : (
                <>
                  {currentStep === steps.length - 1 ? 'Complete Workflow' : 'Next Step'}
                  {currentStep < steps.length - 1 && <ChevronRight size={16} />}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className={`toast ${showToast.type}`}>
          {showToast.type === 'success' && <CheckCircle size={20} />}
          {showToast.type === 'error' && <X size={20} />}
          {showToast.type === 'info' && <Info size={20} />}
          <span>{showToast.message}</span>
          <button className="toast-close" onClick={() => setShowToast(null)}>
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default VerificationWorkflow;