import PageLayout from "../components/Layout/PageLayout";
import MetricsBar from "../components/Inventory/MetricsBar";
import AddProductForm from "../components/Inventory/AddProductForm";
import SalesForm from "../components/Inventory/SalesForm";
import ProductTable from "../components/Inventory/ProductTable";
import { useInventory } from "../hooks/useInventory";
import { useToast } from "../hooks/useToast";
import { currency } from "../utils";

export default function Dashboard() {
  const { toast, showToast } = useToast();
  const {
    filteredInventory, loading, metrics,
    searchQuery, setSearchQuery,
    filterCategory, setFilterCategory,
    sortBy, setSortBy,
    addProduct, recordSale, deleteProduct, seedDemo,
  } = useInventory(showToast);

  return (
    <PageLayout toast={toast}>
      {/* Hero */}
      <section className="hero">
        <div className="glass-card hero-card">
          <span className="eyebrow">⚡ Next-gen dashboard · Fast demo-ready experience</span>
          <h2>Turn a simple project into a polished inventory showcase.</h2>
          <p>
            Manage products, track live stock movement, highlight low inventory risks, and
            present a premium UI that looks ready for a startup pitch or viva demonstration.
          </p>
          <div className="actions">
            <button className="btn btn-primary" onClick={seedDemo}>
              Load Showcase Demo
            </button>
            <a className="btn btn-secondary" href="#inventory-manager">
              Explore Inventory Manager
            </a>
          </div>
          <div className="hero-highlights">
            <div className="stat-chip">
              <strong>{metrics.totalProducts}</strong>
              <span>Total products</span>
            </div>
            <div className="stat-chip">
              <strong>{metrics.totalUnits}</strong>
              <span>Units tracked</span>
            </div>
            <div className="stat-chip">
              <strong>{currency(metrics.totalValue)}</strong>
              <span>Inventory value</span>
            </div>
          </div>
        </div>

        <div className="glass-card preview-panel">
          <div className="preview-row">
            <div>
              <strong>Low Stock Alerts</strong>
              <br />
              <small>Keep fast-moving items visible</small>
            </div>
            <span className="badge low">{metrics.lowStock}</span>
          </div>
          <div className="preview-row">
            <div>
              <strong>Smart Product Search</strong>
              <br />
              <small>Find items by name, category, ID</small>
            </div>
            <span>🔎</span>
          </div>
          <div className="preview-row">
            <div>
              <strong>Sales Recording</strong>
              <br />
              <small>Reduce stock instantly after each sale</small>
            </div>
            <span>📦</span>
          </div>
          <div className="preview-row">
            <div>
              <strong>Pitch-Friendly Design</strong>
              <br />
              <small>Glassmorphism + premium gradients</small>
            </div>
            <span>✨</span>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <MetricsBar metrics={metrics} />

      {/* Inventory Manager + Sales */}
      <section className="dashboard-grid" id="inventory-manager">
        <AddProductForm onAdd={addProduct} />
        <SalesForm onSale={recordSale} topItems={metrics.topItems} />
      </section>

      {/* Product Table */}
      <ProductTable
        items={filteredInventory}
        loading={loading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onDelete={deleteProduct}
      />

      <p className="footer-note">
        StockSmart Pro · React-powered, modular, schema-validated inventory system.
      </p>
    </PageLayout>
  );
}
