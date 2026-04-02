import { CATEGORIES } from "../../schemas";
import { currency, statusBadgeClass } from "../../utils";

export default function ProductTable({
  items, loading,
  searchQuery, setSearchQuery,
  filterCategory, setFilterCategory,
  sortBy, setSortBy,
  onDelete,
}) {
  return (
    <section className="glass-card panel" style={{ marginBottom: 34 }}>
      <div className="panel-head">
        <h3 className="panel-title">Live Product Table</h3>
        <span className="muted">Search, filter, and sort to make the presentation interactive</span>
      </div>

      <div className="toolbar">
        <div className="field">
          <input
            type="text"
            placeholder="Search by name, ID, category, description"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="field">
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option>All</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="field">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Sort: Name</option>
            <option value="stock-high">Sort: Stock high to low</option>
            <option value="stock-low">Sort: Stock low to high</option>
            <option value="value-high">Sort: Value high to low</option>
          </select>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "var(--muted)" }}>
                  Loading inventory…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "var(--muted)" }}>
                  No products found. Add one above or load the showcase demo.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td><span className="pill">{item.id}</span></td>
                  <td>
                    <strong>{item.name}</strong>
                    {item.description && (
                      <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 2 }}>
                        {item.description}
                      </div>
                    )}
                  </td>
                  <td>{item.category}</td>
                  <td>{item.stock}</td>
                  <td>{currency(item.price)}</td>
                  <td><span className={statusBadgeClass(item.status)}>{item.status}</span></td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: "0.78rem", padding: "4px 10px" }}
                      onClick={() => {
                        if (window.confirm("Delete this product from inventory?")) {
                          onDelete(item.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
