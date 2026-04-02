import { useState, useEffect, useCallback } from "react";
import { inventoryApi } from "../services/api";
import { ProductSchema, SaleSchema, stockStatusFromQty } from "../schemas";

const DEMO_PRODUCTS = [
  { name: "Smart Sensor Kit", category: "Electronics", stock: 28, price: 4999, description: "IoT starter kit with motion, temperature, and humidity sensors." },
  { name: "Premium Coffee Beans", category: "Food and Beverages", stock: 9, price: 899, description: "Fresh medium roast beans packed for retail shelves." },
  { name: "Wellness First Aid Box", category: "Healthcare", stock: 14, price: 1299, description: "Compact refillable first-aid solution for office and home." },
  { name: "Urban Classic Hoodie", category: "Fashion", stock: 32, price: 1599, description: "Soft fleece hoodie with premium stitching and trendy fit." },
  { name: "4K Webcam Pro", category: "Electronics", stock: 6, price: 7999, description: "Ultra-clear streaming webcam with autofocus and noise cancellation." },
  { name: "Organic Green Tea", category: "Food and Beverages", stock: 45, price: 399, description: "Premium loose-leaf green tea sourced from Darjeeling estates." },
  { name: "Compression Knee Brace", category: "Healthcare", stock: 3, price: 649, description: "Adjustable brace for post-workout recovery and joint support." },
  { name: "Slim Fit Chinos", category: "Fashion", stock: 20, price: 1199, description: "Classic chinos with stretch fabric for all-day comfort." },
];

export function useInventory(showToast) {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      const data = await inventoryApi.getAll();
      const parsed = data.map((item) => ProductSchema.parse(item).data);
      setInventory(parsed);
    } catch (err) {
      showToast?.("Failed to load inventory. Is the backend running?", true);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchInventory(); }, [fetchInventory]);

  const addProduct = useCallback(async (formData) => {
    const { valid, errors, data } = ProductSchema.validateCreate(formData);
    if (!valid) { showToast?.(errors[0], true); return false; }
    try {
      await inventoryApi.create(data);
      await fetchInventory();
      showToast?.("Product added successfully.");
      return true;
    } catch (err) {
      showToast?.(err.message || "Unable to add product.", true);
      return false;
    }
  }, [fetchInventory, showToast]);

  const recordSale = useCallback(async (identifier, quantity) => {
    const product = inventory.find(
      (item) => item.name.toLowerCase() === identifier.toLowerCase() ||
                String(item.id).toLowerCase() === identifier.toLowerCase()
    );
    if (!product) { showToast?.("Product not found.", true); return false; }

    const { valid, errors } = SaleSchema.validate({ identifier, quantity }, product.stock);
    if (!valid) { showToast?.(errors[0], true); return false; }

    try {
      await inventoryApi.recordSale(product.id, Number(quantity));
      await fetchInventory();
      showToast?.("Sale recorded successfully.");
      return true;
    } catch (err) {
      showToast?.(err.message || "Could not record sale.", true);
      return false;
    }
  }, [inventory, fetchInventory, showToast]);

  const deleteProduct = useCallback(async (id) => {
    try {
      await inventoryApi.delete(id);
      await fetchInventory();
      showToast?.("Product deleted.");
      return true;
    } catch (err) {
      showToast?.(err.message || "Delete failed.", true);
      return false;
    }
  }, [fetchInventory, showToast]);

  const seedDemo = useCallback(async () => {
    let added = 0;
    for (const p of DEMO_PRODUCTS) {
      try { await inventoryApi.create(p); added++; } catch {}
    }
    await fetchInventory();
    showToast?.(`Loaded ${added} demo products.`);
  }, [fetchInventory, showToast]);

  // Derived: filtered + sorted inventory
  const filteredInventory = (() => {
    const q = searchQuery.trim().toLowerCase();
    let items = inventory.filter((item) => {
      const matchQ = !q || [item.name, item.category, item.description, item.id].join(" ").toLowerCase().includes(q);
      const matchC = filterCategory === "All" || item.category === filterCategory;
      return matchQ && matchC;
    });
    items = [...items].sort((a, b) => {
      if (sortBy === "stock-high") return b.stock - a.stock;
      if (sortBy === "stock-low") return a.stock - b.stock;
      if (sortBy === "value-high") return (b.stock * b.price) - (a.stock * a.price);
      return String(a.name).localeCompare(String(b.name));
    });
    return items;
  })();

  // Metrics derived from full inventory
  const metrics = {
    totalProducts: inventory.length,
    totalUnits: inventory.reduce((s, i) => s + Number(i.stock || 0), 0),
    lowStock: inventory.filter((i) => Number(i.stock || 0) > 0 && Number(i.stock || 0) <= 10).length,
    totalValue: inventory.reduce((s, i) => s + Number(i.stock || 0) * Number(i.price || 0), 0),
    topItems: [...inventory].sort((a, b) => b.stock * b.price - a.stock * a.price).slice(0, 4),
  };

  return {
    inventory, filteredInventory, loading, metrics,
    searchQuery, setSearchQuery,
    filterCategory, setFilterCategory,
    sortBy, setSortBy,
    addProduct, recordSale, deleteProduct, seedDemo, fetchInventory,
  };
}
