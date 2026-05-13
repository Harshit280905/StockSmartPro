import React, { useState } from 'react';
import { Package, Lock, Mail, User, Loader2 } from 'lucide-react';
import { login as loginAPI, register as registerAPI } from '../api';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    role: 'staff' // Default role for signup
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        const res = await loginAPI({ email: formData.email, password: formData.password });
        localStorage.setItem('token', res.data.token);
        onLogin(res.data.user);
      } else {
        await registerAPI({ 
          name: formData.name, 
          email: formData.email, 
          password: formData.password,
          role: formData.role 
        });
        const res = await loginAPI({ email: formData.email, password: formData.password });
        localStorage.setItem('token', res.data.token);
        onLogin(res.data.user);
      }
    } catch (err) {
      console.error("Auth Error:", err);
      const msg = err.response?.data?.message || err.message || `${isLogin ? 'Login' : 'Registration'} failed. Detailed error: ${err.response?.data?.details || 'None'}`;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="glass-card login-card animate-fade">
        <div className="login-header">
          <div className="logo-icon-wrapper">
            <Package size={48} className="logo-icon" />
          </div>
          <h1>{isLogin ? 'Welcome Back' : 'Create an Account'}</h1>
          <p>{isLogin ? 'Sign in to access your dashboard' : 'Join us and manage your inventory seamlessly'}</p>
        </div>
        
        {error && (
          <div className="error-alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="John Doe" 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required={!isLogin}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Register As</label>
                <div className="role-selection">
                  <button 
                    type="button" 
                    className={`role-btn ${formData.role === 'staff' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, role: 'staff' })}
                  >
                    Staff
                  </button>
                  <button 
                    type="button" 
                    className={`role-btn ${formData.role === 'admin' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, role: 'admin' })}
                  >
                    Admin
                  </button>
                </div>
              </div>
            </>
          )}
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                className="input-field" 
                placeholder="admin@inventory.com" 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                className="input-field" 
                placeholder="••••••••" 
                value={formData.password} 
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? <Loader2 size={20} className="animate-spin" /> : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="login-footer">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="toggle-auth-btn"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
