import React, { useState, useEffect } from 'react';
import { fetchDashboard, fetchAIInsights } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, Package, AlertTriangle, DollarSign, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [dashRes, insightRes] = await Promise.all([fetchDashboard(), fetchAIInsights()]);
        setData(dashRes.data);
        setInsights(insightRes.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data. Please check your connection or login again.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--primary)' }}>
        <div style={{ padding: '1.5rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', marginBottom: '1.5rem', boxShadow: '0 0 30px rgba(99, 102, 241, 0.2)' }}>
          <Package size={48} className="animate-spin" />
        </div>
        <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem', fontWeight: '600' }}>Loading Dashboard...</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Fetching the latest insights and metrics</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', marginBottom: '1.5rem', color: 'var(--danger)' }}>
          <AlertTriangle size={48} />
        </div>
        <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>Oops! Something went wrong</h2>
        <p style={{ color: 'var(--text-muted)' }}>{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="animate-fade">
      <h1 style={{ marginBottom: '2rem', fontSize: '2.25rem' }}>Dashboard Overview</h1>
      
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-label">Total Products</div>
          <div className="stat-value">{data.totalProducts}</div>
          <div style={{ color: 'var(--success)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Package size={14} /> Available Stock
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-label">Inventory Value</div>
          <div className="stat-value">
            ${data.totalStockValue?.toLocaleString()}
          </div>
          <div style={{ color: 'var(--primary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <DollarSign size={14} /> Net Worth
          </div>
        </div>
        <div className="glass-card stat-card" style={{ borderLeft: data.lowStockCount > 0 ? '4px solid var(--danger)' : '' }}>
          <div className="stat-label">Low Stock Alerts</div>
          <div className="stat-value" style={{ color: data.lowStockCount > 0 ? 'var(--danger)' : 'white' }}>{data.lowStockCount}</div>
          <div style={{ color: 'var(--warning)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertTriangle size={14} /> Needs Restock
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-label">Total Orders</div>
          <div className="stat-value">{data.totalOrders}</div>
          <div style={{ color: 'var(--success)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={14} /> Sales Made
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Sparkles size={20} color="var(--primary)" /> AI Stock Insights
            </h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {insights.map((insight, i) => {
              const colors = {
                DANGER: 'var(--danger)',
                WARNING: 'var(--warning)',
                SUCCESS: 'var(--success)',
                INFO: 'var(--primary)'
              };
              const color = colors[insight.type] || 'var(--primary)';
              return (
                <div key={i} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', borderLeft: `4px solid ${color}`, transition: 'transform 0.2s' }}>
                  <div style={{ fontWeight: 700, color: color, marginBottom: '6px', fontSize: '1rem' }}>{insight.message}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{insight.recommendation}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem' }}>Category Distribution</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.categoryData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="_id"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: '1rem' }}>Recent Stock Transactions</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Type</th>
                <th>Change</th>
                <th>Final Stock</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recentTransactions.map((tx) => (
                <tr key={tx._id}>
                  <td>{tx.product?.name || 'Deleted Product'}</td>
                  <td>
                    <span className={`badge ${tx.type === 'SALE' ? 'badge-danger' : 'badge-success'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td style={{ color: tx.quantityChange > 0 ? 'var(--success)' : 'var(--danger)' }}>
                    {tx.quantityChange > 0 ? '+' : ''}{tx.quantityChange}
                  </td>
                  <td>{tx.newQuantity}</td>
                  <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
