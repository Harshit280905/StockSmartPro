export function currency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function statusBadgeClass(status) {
  if (status === "Out of Stock") return "badge out";
  if (status === "Low Stock") return "badge low";
  return "badge ok";
}
