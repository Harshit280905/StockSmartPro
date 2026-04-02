import { useState } from "react";
import { CATEGORIES } from "../../schemas";

const EMPTY = { name: "", category: "", stock: "", price: "", description: "" };

export default function AddProductForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await onAdd(form);
    if (success) setForm(EMPTY);
    setSubmitting(false);
  };

  return (
    <div className="glass-card panel">
      <div className="panel-head">
        <h3 className="panel-title">Inventory Manager</h3>
        <span className="muted">Add products with descriptions and price details</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="input-grid">
          <div className="field">
            <label>Product Name</label>
            <input
              type="text"
              placeholder="e.g. Smart Barcode Scanner"
              value={form.name}
              onChange={set("name")}
            />
          </div>
          <div className="field">
            <label>Category</label>
            <select value={form.category} onChange={set("category")}>
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Initial Stock</label>
            <input type="number" min="0" placeholder="0" value={form.stock} onChange={set("stock")} />
          </div>
          <div className="field">
            <label>Unit Price (INR)</label>
            <input type="number" min="0" placeholder="1999" value={form.price} onChange={set("price")} />
          </div>
          <div className="field full">
            <label>Description</label>
            <textarea
              placeholder="Write a crisp product description."
              value={form.description}
              onChange={set("description")}
            />
          </div>
        </div>
        <div className="actions">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Adding…" : "Add Product"}
          </button>
          <button className="btn btn-secondary" type="button" onClick={() => setForm(EMPTY)}>
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
