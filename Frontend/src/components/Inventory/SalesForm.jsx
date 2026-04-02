import { useState } from "react";
import { currency } from "../../utils";

export default function SalesForm({ onSale, topItems }) {
  const [identifier, setIdentifier] = useState("");
  const [quantity, setQuantity] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await onSale(identifier, quantity);
    if (success) { setIdentifier(""); setQuantity(""); }
    setSubmitting(false);
  };

  return (
    <div className="glass-card panel">
      <div className="panel-head">
        <h3 className="panel-title">Sales &amp; Smart Insights</h3>
        <span className="muted">Record outgoing stock and view top inventory blocks</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="input-grid">
          <div className="field">
            <label>Product Name or ID</label>
            <input
              type="text"
              placeholder="Enter product name or ID"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Quantity Sold</label>
            <input
              type="number"
              min="1"
              placeholder="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        </div>
        <div className="actions">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Recording…" : "Record Sale"}
          </button>
          <button className="btn btn-secondary" type="button" onClick={() => { setIdentifier(""); setQuantity(""); }}>
            Reset
          </button>
        </div>
      </form>

      <div style={{ height: 18 }} />

      {topItems.length > 0 && (
        <div className="small-list">
          {topItems.map((item) => (
            <div className="small-list-item" key={item.id}>
              <strong>{item.name}</strong>
              <span className="muted">
                {item.stock} units · {currency(item.price)} · {currency(item.stock * item.price)} value
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
