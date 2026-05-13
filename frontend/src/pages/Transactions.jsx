import React, { useState, useEffect } from 'react';
import API from '../api';
import { History, ArrowUpRight, ArrowDownLeft, Trash2, Edit } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    API.get('/dashboard').then(res => {
      // In a real app, I'd have a separate /api/transactions endpoint
      // For now, I'll use the one in dashboard or fetch it separately
      setTransactions(res.data.recentTransactions);
    });
  }, []);

  return (
    <div className="animate-fade">
      <h1 style={{ marginBottom: '2rem' }}>Audit Trail & Transactions</h1>
      
      <div className="glass-card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Type</th>
                <th>Change</th>
                <th>Prev. Stock</th>
                <th>New Stock</th>
                <th>Note</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx._id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{tx.product?.name || 'Unknown'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tx.product?.sku}</div>
                  </td>
                  <td>
                    <span className={`badge ${tx.type === 'SALE' || tx.type === 'DELETE' ? 'badge-danger' : 'badge-success'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td style={{ color: tx.quantityChange > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>
                    {tx.quantityChange > 0 ? '+' : ''}{tx.quantityChange}
                  </td>
                  <td>{tx.previousQuantity}</td>
                  <td>{tx.newQuantity}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{tx.note}</td>
                  <td>{new Date(tx.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
