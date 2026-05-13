import React, { useState, useEffect } from 'react';
import { fetchProducts, createOrder, fetchOrders } from '../api';
import { ShoppingCart, Plus, Minus, Trash2, Search, User as UserIcon, ReceiptText, CheckCircle2, AlertCircle } from 'lucide-react';

const Orders = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [prodRes, orderRes] = await Promise.all([fetchProducts(), fetchOrders()]);
      setProducts(prodRes.data);
      setOrders(orderRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = (p) => {
    const existing = cart.find(item => item.productId === p._id);
    if (existing) {
      if (existing.quantity >= p.quantity) return alert('No more stock available');
      setCart(cart.map(item => item.productId === p._id ? {...item, quantity: item.quantity + 1} : item));
    } else {
      if (p.quantity <= 0) return alert('Out of stock');
      setCart([...cart, { productId: p._id, name: p.name, quantity: 1, price: p.price, sku: p.sku }]);
    }
  };

  const removeFromCart = (id) => {
    const existing = cart.find(item => item.productId === id);
    if (existing.quantity > 1) {
      setCart(cart.map(item => item.productId === id ? {...item, quantity: item.quantity - 1} : item));
    } else {
      setCart(cart.filter(item => item.productId !== id));
    }
  };

  const submitOrder = async () => {
    if (!customerName) return alert('Enter customer name');
    if (cart.length === 0) return alert('Cart is empty');
    setLoading(true);
    try {
      await createOrder({ customerName, products: cart });
      setSuccess(true);
      setCart([]);
      setCustomerName('');
      loadData();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error placing order');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const total = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Point of Sale (POS)</h1>
        <p style={{ color: 'var(--text-muted)' }}>Select products and process customer orders instantly.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem' }}>
        {/* Product Selection Area */}
        <div>
          <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search products by name or barcode/SKU..." 
                className="input-field" 
                style={{ paddingLeft: '2.75rem' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {filteredProducts.map(p => (
              <div key={p._id} className="glass-card stat-card" style={{ 
                padding: '1.25rem', 
                border: cart.find(i => i.productId === p._id) ? '2px solid var(--primary)' : '1px solid var(--border)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }} onClick={() => addToCart(p)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '8px' }}>
                        <ReceiptText size={20} color="var(--primary)" />
                    </div>
                    <div className={`badge ${p.quantity === 0 ? 'badge-danger' : 'badge-success'}`}>
                        {p.quantity} Units
                    </div>
                </div>
                <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{p.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>SKU: {p.sku}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)' }}>${p.price}</div>
                    <button className="btn btn-primary" style={{ padding: '0.4rem', borderRadius: '8px' }}>
                        <Plus size={16} />
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Checkout Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ position: 'sticky', top: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ShoppingCart size={22} color="var(--primary)" /> Order Summary
            </h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Customer Details</label>
                <div style={{ position: 'relative' }}>
                    <UserIcon size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                    <input 
                        type="text" 
                        placeholder="Full Name / Phone" 
                        className="input-field" 
                        style={{ paddingLeft: '2.75rem' }} 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                    />
                </div>
            </div>
            
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.map(item => (
                <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>${item.price} each</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button onClick={() => removeFromCart(item.productId)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.25rem', borderRadius: '4px' }}><Minus size={14}/></button>
                    <span style={{ fontWeight: 700, width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => addToCart(products.find(p => p._id === item.productId))} style={{ background: 'rgba(16, 185, 129, 0.1)', border: 'none', color: 'var(--success)', cursor: 'pointer', padding: '0.25rem', borderRadius: '4px' }}><Plus size={14}/></button>
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 1rem' }}>
                  <AlertCircle size={32} style={{ opacity: 0.2, marginBottom: '0.5rem' }} />
                  <p>Your cart is empty.</p>
                </div>
              )}
            </div>

            <div style={{ borderTop: '2px dashed var(--border)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                <span>Subtotal</span>
                <span>${total.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                <span>Tax (0%)</span>
                <span>$0.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)' }}>
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>

            <button 
                className="btn btn-primary" 
                style={{ width: '100%', height: '3.5rem', justifyContent: 'center', fontSize: '1.1rem' }} 
                onClick={submitOrder}
                disabled={loading || cart.length === 0}
            >
              {loading ? 'Processing...' : success ? <><CheckCircle2 size={24} /> Order Placed!</> : 'Charge Customer'}
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: '2.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Recent Order History</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Purchased Items</th>
                <th>Total Value</th>
                <th>Order Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map(o => (
                <tr key={o._id}>
                  <td style={{ fontWeight: 600 }}>{o.customerName}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {o.products.map((p, idx) => (
                            <span key={idx} className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }}>
                                {p.quantity}x Item
                            </span>
                        ))}
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--success)' }}>${o.totalAmount.toLocaleString()}</td>
                  <td>{new Date(o.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
