// ─── API Service Layer ─────────────────────────────────────────────────────────
// All network calls are centralised here. Components never call fetch() directly.

const BASE = "";          // proxied to http://localhost:8080 in dev
const INVENTORY_URL = `${BASE}/api/inventory`;
const AUTH_URL = `${BASE}/api/auth`;
const FEEDBACK_URL = `${BASE}/api/feedback`;

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

// ── Inventory ──────────────────────────────────────────────────────────────────
export const inventoryApi = {
  /** GET /api/inventory  → Product[] */
  getAll() {
    return request(INVENTORY_URL);
  },

  /** POST /api/inventory  → Product */
  create(payload) {
    return request(INVENTORY_URL, { method: "POST", body: JSON.stringify(payload) });
  },

  /** PATCH /api/inventory/:id/sale  → Product */
  recordSale(id, quantity) {
    return request(`${INVENTORY_URL}/${id}/sale`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    });
  },

  /** DELETE /api/inventory/:id  → { message } */
  delete(id) {
    return request(`${INVENTORY_URL}/${id}`, { method: "DELETE" });
  },
};

// ── Auth ───────────────────────────────────────────────────────────────────────
export const authApi = {
  /** POST /api/auth/login */
  login(payload) {
    return request(`${AUTH_URL}/login`, { method: "POST", body: JSON.stringify(payload) });
  },

  /** POST /api/auth/register */
  register(payload) {
    return request(`${AUTH_URL}/register`, { method: "POST", body: JSON.stringify(payload) });
  },

  /** GET /auth-status → { isLoggedIn, username } */
  status() {
    return request(`${BASE}/auth-status`);
  },

  /** POST /api/auth/logout (add on backend if needed) */
  logout() {
    return request(`${AUTH_URL}/logout`, { method: "POST" }).catch(() => ({}));
  },
};

// ── Feedback ───────────────────────────────────────────────────────────────────
export const feedbackApi = {
  /** POST /api/feedback */
  submit(payload) {
    return request(FEEDBACK_URL, { method: "POST", body: JSON.stringify(payload) });
  },
};
