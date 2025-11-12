import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, UserCheck, Loader2 } from 'lucide-react';
import ubaLogo from './uba logo.webp';
import './Login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    { value: '', label: 'Select Role' },
    { value: 'credit-admin', label: 'Credit Admin' },
    { value: 'recovery-officer', label: 'Recovery Officer' },
    { value: 'csm', label: 'Customer Service Manager' },
    { value: 'admin', label: 'System Administrator' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.username || !formData.password || !formData.role) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call - replace with actual API call later
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock validation - replace with actual API response handling
      const validCredentials = [
        { username: 'admin', password: 'admin123' },
        { username: 'credit.admin', password: 'password' },
        { username: 'recovery.officer', password: 'password' },
        { username: 'csm', password: 'password' },
        { username: 'demo', password: 'password' }
      ];
      
      const isValidUser = validCredentials.some(
        cred => cred.username === formData.username && cred.password === formData.password
      );
      
      if (isValidUser) {
        onLogin({
          username: formData.username,
          role: formData.role,
          token: 'mock-jwt-token'
        });
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="africa-pattern"></div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="uba-logo">
            <img src={ubaLogo} alt="UBA Logo" className="logo-image" />
          </div>
          <h1>MBP Platform</h1>
          <p>Memo Balance Process Management</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <User className="input-icon" size={20} />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <div className="input-wrapper">
              <UserCheck className="input-icon" size={20} />
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                disabled={isLoading}
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="loading-spinner" size={20} />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>© 2025 United Bank for Africa. All rights reserved.</p>
          <small>Internal access only</small>
        </div>
      </div>
    </div>
  );
};

export default Login;