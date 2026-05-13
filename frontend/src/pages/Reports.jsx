import React, { useState, useEffect } from 'react';
import { fetchAIInsights, downloadReport, fetchVerifyMe, updatePreferences } from '../api';
import { Sparkles, FileText, Download, ShieldAlert, CheckCircle, Bell, Loader2 } from 'lucide-react';

const Reports = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [notifications, setNotifications] = useState({
    lowStockAlerts: true,
    aiStrategicInsights: true,
    weeklyDigest: false
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [insightRes, userRes] = await Promise.all([
          fetchAIInsights(),
          fetchVerifyMe().catch(() => ({ data: { user: {} } }))
        ]);
        setInsights(insightRes.data);
        if (userRes.data.user?.notificationPreferences) {
          setNotifications(userRes.data.user.notificationPreferences);
        }
      } catch (err) {
        console.error("Failed to load reports data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleExport = async () => {
    try {
      const response = await downloadReport();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'inventory_report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Error exporting data');
    }
  };

  const toggleNotification = async (key) => {
    const newSettings = { ...notifications, [key]: !notifications[key] };
    setNotifications(newSettings);
    
    try {
      setSavingSettings(true);
      await updatePreferences(newSettings);
    } catch (err) {
      console.error("Failed to save preferences", err);
      // Revert if failed
      setNotifications(notifications);
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="animate-fade">
      <h1 style={{ marginBottom: '2rem' }}>AI Insights & Reports</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '3rem' }}>
          <FileText size={48} color="var(--primary)" />
          <h2>Inventory Report</h2>
          <p style={{ color: 'var(--text-muted)' }}>Generate a full CSV report of your current inventory levels, pricing, and suppliers.</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={handleExport}>
            <Download size={20} /> Export to CSV
          </button>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="var(--primary)" /> AI Optimization Tips
          </h3>
          {loading ? (
             <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
               <Loader2 className="animate-spin" size={32} color="var(--primary)" />
             </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }} className="custom-scrollbar">
            <div style={{ padding: '1.25rem', background: 'rgba(16, 185, 129, 0.03)', borderRadius: '16px', borderLeft: '4px solid var(--success)', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
                  <CheckCircle color="var(--success)" size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'white', marginBottom: '2px' }}>System Health</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Your inventory turnover rate is within optimal range.</div>
              </div>
            </div>

            {insights.map((insight, i) => {
              const colors = {
                  DANGER: 'var(--danger)',
                  WARNING: 'var(--warning)',
                  SUCCESS: 'var(--success)',
                  INFO: 'var(--primary)'
              };
              const color = colors[insight.type] || 'var(--primary)';
              return (
                  <div key={i} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', borderLeft: `4px solid ${color}`, display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                      <div style={{ background: `${color}15`, padding: '0.75rem', borderRadius: '12px' }}>
                          <ShieldAlert color={color} size={20} />
                      </div>
                      <div>
                          <div style={{ fontWeight: 700, color: 'white', marginBottom: '2px' }}>{insight.message}</div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{insight.recommendation}</div>
                      </div>
                  </div>
              );
            })}
          </div>
          )}
        </div>
      </div>

      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <Bell size={20} color="var(--primary)" /> Email Notification Settings
          </h3>
          {savingSettings && <span style={{ fontSize: '0.85rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Loader2 size={14} className="animate-spin" /> Saving...</span>}
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Configure how and when you receive automated alerts about your inventory.</p>
        
        <div className="settings-list" style={{ maxWidth: '600px', marginTop: 0 }}>
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-title">Standard Low Stock Alerts</div>
              <div className="setting-desc">Get an email when any item hits its manual threshold.</div>
            </div>
            <label className="switch">
              <input type="checkbox" checked={notifications.lowStockAlerts} onChange={() => toggleNotification('lowStockAlerts')} />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-title">AI Strategic Insights (Recommended)</div>
              <div className="setting-desc">Receive immediate alerts for high-priority revenue risks based on sales velocity.</div>
            </div>
            <label className="switch">
              <input type="checkbox" checked={notifications.aiStrategicInsights} onChange={() => toggleNotification('aiStrategicInsights')} />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item" style={{ borderBottom: 'none' }}>
            <div className="setting-info">
              <div className="setting-title">Weekly Digest</div>
              <div className="setting-desc">A Monday morning summary of your store's performance.</div>
            </div>
            <label className="switch">
              <input type="checkbox" checked={notifications.weeklyDigest} onChange={() => toggleNotification('weeklyDigest')} />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
