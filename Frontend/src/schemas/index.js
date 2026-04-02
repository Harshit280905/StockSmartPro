// ─── Data Schemas ──────────────────────────────────────────────────────────────
// Pure JS schema validators (no external deps needed).
// Each schema exports: validate(data) -> { valid, errors, data }

export const CATEGORIES = [
  "Food and Beverages",
  "Healthcare",
  "Fashion",
  "Electronics",
  "Others",
];

export const STOCK_STATUS = {
  OUT: "Out of Stock",
  LOW: "Low Stock",
  IN: "In Stock",
};

export function stockStatusFromQty(qty) {
  const n = Number(qty ?? 0);
  if (n <= 0) return STOCK_STATUS.OUT;
  if (n <= 10) return STOCK_STATUS.LOW;
  return STOCK_STATUS.IN;
}

// ── Product Schema ─────────────────────────────────────────────────────────────
export const ProductSchema = {
  /**
   * Validate and sanitise raw product data coming from API.
   * Returns { valid, errors, data }
   */
  parse(raw) {
    const errors = [];
    const data = {
      id: String(raw.id ?? ""),
      name: String(raw.name ?? "").trim(),
      category: CATEGORIES.includes(raw.category) ? raw.category : "Others",
      stock: Number(raw.stock ?? 0),
      price: Number(raw.price ?? 0),
      description: String(raw.description ?? "").trim(),
      status: stockStatusFromQty(raw.stock),
    };
    if (!data.name) errors.push("Product name is required.");
    if (!data.description) errors.push("Description is required.");
    if (isNaN(data.stock) || data.stock < 0) errors.push("Stock must be a non-negative number.");
    if (isNaN(data.price) || data.price < 0) errors.push("Price must be a non-negative number.");
    return { valid: errors.length === 0, errors, data };
  },

  /** Validate a new-product form payload before sending to API */
  validateCreate(payload) {
    const errors = [];
    const name = String(payload.name ?? "").trim();
    const description = String(payload.description ?? "").trim();
    const stock = Number(payload.stock);
    const price = Number(payload.price);
    const category = payload.category;

    if (!name) errors.push("Product name is required.");
    if (!category || !CATEGORIES.includes(category)) errors.push("Select a valid category.");
    if (isNaN(stock) || stock < 0) errors.push("Stock must be a non-negative number.");
    if (isNaN(price) || price < 0) errors.push("Price must be a non-negative number.");
    if (!description) errors.push("Description is required.");

    return {
      valid: errors.length === 0,
      errors,
      data: { name, category, stock, price, description },
    };
  },
};

// ── User Schema ────────────────────────────────────────────────────────────────
export const UserSchema = {
  validateLogin(payload) {
    const errors = [];
    const username = String(payload.username ?? "").trim();
    const password = String(payload.password ?? "");
    if (!username) errors.push("Username is required.");
    if (!password) errors.push("Password is required.");
    return { valid: errors.length === 0, errors, data: { username, password } };
  },

  validateRegister(payload) {
    const errors = [];
    const username = String(payload.username ?? "").trim();
    const email = String(payload.email ?? "").trim().toLowerCase();
    const password = String(payload.password ?? "");
    const confirmPassword = String(payload.confirmPassword ?? "");

    if (!username) errors.push("Username is required.");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("A valid email is required.");
    if (password.length < 4) errors.push("Password must be at least 4 characters.");
    if (password !== confirmPassword) errors.push("Passwords do not match.");

    return {
      valid: errors.length === 0,
      errors,
      data: { username, email, password, confirmPassword },
    };
  },
};

// ── Feedback Schema ────────────────────────────────────────────────────────────
export const FeedbackSchema = {
  validate(payload) {
    const errors = [];
    const name = String(payload.name ?? "").trim();
    const email = String(payload.email ?? "").trim().toLowerCase();
    const firstTime = payload["first-time"];
    const useful = payload.useful;
    const reason = String(payload.reason ?? "").trim();

    if (!name) errors.push("Full name is required.");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("A valid email is required.");
    if (!firstTime) errors.push("Please indicate if this is your first visit.");
    if (!useful) errors.push("Please indicate whether the site was useful.");

    return {
      valid: errors.length === 0,
      errors,
      data: { name, email, "first-time": firstTime, useful, reason },
    };
  },
};

// ── Sale Schema ────────────────────────────────────────────────────────────────
export const SaleSchema = {
  validate(payload, availableStock = Infinity) {
    const errors = [];
    const identifier = String(payload.identifier ?? "").trim().toLowerCase();
    const quantity = Number(payload.quantity);

    if (!identifier) errors.push("Enter a product name or ID.");
    if (isNaN(quantity) || quantity <= 0) errors.push("Quantity must be a positive number.");
    if (quantity > availableStock) errors.push("Not enough stock for this sale.");

    return {
      valid: errors.length === 0,
      errors,
      data: { identifier, quantity },
    };
  },
};
