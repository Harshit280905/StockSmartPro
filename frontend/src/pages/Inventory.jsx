import React, { useState, useEffect } from 'react';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../api';
import { Plus, Search, Edit2, Trash2, X, Package as PackageIcon, Info } from 'lucide-react';

const Inventory = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', sku: '', category: '', quantity: 0, price: 0, supplier: '', lowStockThreshold: 5
  });

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    loadProducts();
  }, [search]);

  const loadProducts = async () => {
    try {
      const res = await fetchProducts({ search });
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await updateProduct(editingId, formData);
      } else {
        await addProduct(formData);
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ name: '', sku: '', category: '', quantity: 0, price: 0, supplier: '', lowStockThreshold: 5 });
      loadProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p) => {
    setFormData({
        name: p.name,
        sku: p.sku,
        category: p.category,
        quantity: p.quantity,
        price: p.price,
        supplier: p.supplier || '',
        lowStockThreshold: p.lowStockThreshold || 5
    });
    setEditingId(p._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await deleteProduct(id);
        loadProducts();
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed.');
      }
    }
  };

  return (
    <div className="animate-fade">
      {/* Header Banner */}
      <div className="glass-card" style={{ 
        marginBottom: '2rem', 
        padding: '2rem', 
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeft: '4px solid var(--primary)'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem' }}>{isAdmin ? 'Inventory Administration' : 'Stock Inventory View'}</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {isAdmin ? 'Full control over your catalog, pricing, and stock levels.' : 'Monitor stock levels and manage item records.'}
          </p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => { setFormData({ name: '', sku: '', category: '', quantity: 0, price: 0, supplier: '', lowStockThreshold: 5 }); setShowModal(true); setEditingId(null); }}>
            <Plus size={20} /> New Entry
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="glass-card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by name, SKU or category..." 
            className="input-field" 
            style={{ paddingLeft: '2.75rem' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="glass-card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product Information</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Unit Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <PackageIcon size={20} color="var(--primary)" />
                        </div>
                        <div>
                            <div style={{ fontWeight: 600 }}>{p.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SKU: {p.sku}</div>
                        </div>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{p.quantity}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Limit: {p.lowStockThreshold}</div>
                  </td>
                  <td>${p.price.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${p.quantity === 0 ? 'badge-danger' : p.quantity <= p.lowStockThreshold ? 'badge-warning' : 'badge-success'}`}>
                      {p.quantity === 0 ? 'OUT OF STOCK' : p.quantity <= p.lowStockThreshold ? 'LOW STOCK' : 'HEALTHY'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn" style={{ padding: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }} title="Edit" onClick={() => handleEdit(p)}>
                        <Edit2 size={16} />
                      </button>
                      {isAdmin && (
                        <button className="btn" style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }} title="Delete" onClick={() => handleDelete(p._id)}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        <Info size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <p>No products found matching your search.</p>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(15, 23, 42, 0.9)', 
            backdropFilter: 'blur(8px)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 1000, 
            padding: '1rem' 
        }}>
          <div className="glass-card animate-fade" style={{ width: '100%', maxWidth: '550px', background: 'var(--bg-card)', padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ margin: 0 }}>{editingId ? 'Modify Product' : 'Register New Item'}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Fill in the details to update the system.</p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block', color: 'var(--text-muted)' }}>Product Name</label>
                <input type="text" placeholder="e.g. MacBook Pro M3" className="input-field" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                    <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block', color: 'var(--text-muted)' }}>SKU Identifier</label>
                    <input type="text" placeholder="SKU-XXXX" className="input-field" required value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} />
                </div>
                <div>
                    <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block', color: 'var(--text-muted)' }}>Category</label>
                    <input type="text" placeholder="Electronics" className="input-field" required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                    <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block', color: 'var(--text-muted)' }}>Stock Quantity</label>
                    <input type="number" placeholder="0" className="input-field" required value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})} />
                </div>
                <div>
                    <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block', color: 'var(--text-muted)' }}>Unit Price ($) {!isAdmin && '(Admin Only)'}</label>
                    <input 
                      type="number" 
                      placeholder="0.00" 
                      className="input-field" 
                      required 
                      disabled={!isAdmin}
                      style={!isAdmin ? { cursor: 'not-allowed', opacity: 0.6 } : {}}
                      value={formData.price} 
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})} 
                    />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.25rem' }}>
                <div>
                    <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block', color: 'var(--text-muted)' }}>Supplier Name</label>
                    <input type="text" placeholder="Supplier Co." className="input-field" value={formData.supplier} onChange={(e) => setFormData({...formData, supplier: e.target.value})} />
                </div>
                <div>
                    <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block', color: 'var(--text-muted)' }}>Low Stock Alert</label>
                    <input type="number" placeholder="5" className="input-field" value={formData.lowStockThreshold} onChange={(e) => setFormData({...formData, lowStockThreshold: parseInt(e.target.value)})} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', height: '3rem', justifyContent: 'center' }} disabled={loading}>
                {loading ? 'Processing...' : editingId ? 'Update System Records' : 'Register Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
