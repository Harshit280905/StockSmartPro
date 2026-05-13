import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, History, Sparkles, User as UserIcon, LogOut } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Login from './pages/Login';

const Sidebar = ({ user, onLogout }) => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Inventory', path: '/inventory', icon: <Package size={20} /> },
    { name: 'Sales/Orders', path: '/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Transactions', path: '/transactions', icon: <History size={20} /> },
  ];

  // Only admins can see the Reports page
  if (user?.role === 'admin') {
    menuItems.push({ name: 'AI Insights & Reports', path: '/reports', icon: <Sparkles size={20} /> });
  }

  return (
    <div className="sidebar">
      <div style={{ padding: '0 1rem 2rem', fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Package size={32} /> INV-X
      </div>
      
      <div style={{ padding: '0 1rem 1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserIcon size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.name || 'User'}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role || 'Staff'}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }} title="Logout">
          <LogOut size={18} />
        </button>
      </div>

      {menuItems.map((item) => (
        <Link 
          key={item.path} 
          to={item.path} 
          className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
        >
          {item.icon} {item.name}
        </Link>
      ))}
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Basic check, in reality you'd want to validate the token with the backend
      setIsAuthenticated(true);
      // Try to parse user from local storage or decode token if stored
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) setUser(storedUser);
      } catch (e) {}
    }
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="app-container">
        <Sidebar user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory user={user} />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/reports" element={user?.role === 'admin' ? <Reports /> : <Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
