import { currency } from "../../utils";

export default function MetricsBar({ metrics }) {
  const cards = [
    { label: "Products", value: metrics.totalProducts, sub: "Catalog entries currently managed" },
    { label: "Units Available", value: metrics.totalUnits, sub: "Total stock units across categories" },
    { label: "Low Stock Items", value: metrics.lowStock, sub: "Immediate reorder attention required" },
    { label: "Total Inventory Value", value: currency(metrics.totalValue), sub: "Estimated stock value (qty × price)" },
  ];

  return (
    <section className="metrics">
      {cards.map(({ label, value, sub }) => (
        <div className="glass-card metric-card" key={label}>
          <h3>{label}</h3>
          <div className="metric-value">{value}</div>
          <div className="metric-sub">{sub}</div>
        </div>
      ))}
    </section>
  );
}
