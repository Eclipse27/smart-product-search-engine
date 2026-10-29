// ============================================================
// API Layer — Communicates with the Express backend
// ============================================================

const API_BASE = '/api';

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

async function postJSON(url, body = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ============================================================
// Products API
// ============================================================
export const productsApi = {
  // GET /api/products — uses vw_product_details VIEW
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetchJSON(`${API_BASE}/products?${qs}`);
  },

  // GET /api/products/:slug — calls get_product_detail STORED PROCEDURE
  getBySlug: (slug) => {
    return fetchJSON(`${API_BASE}/products/${slug}`);
  },

  // GET /api/products/category/:slug — calls get_filtered_products STORED PROCEDURE
  getByCategory: (categorySlug, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetchJSON(`${API_BASE}/products/category/${categorySlug}?${qs}`);
  },

  // POST /api/products/:id/view — calls log_product_view STORED PROCEDURE
  logView: (productId, customerId = null) => {
    return postJSON(`${API_BASE}/products/${productId}/view`, { customerId });
  },
};

// ============================================================
// Categories API
// ============================================================
export const categoriesApi = {
  // GET /api/categories — uses vw_category_stats VIEW
  getAll: () => fetchJSON(`${API_BASE}/categories`),

  // GET /api/categories/:slug
  getBySlug: (slug) => fetchJSON(`${API_BASE}/categories/${slug}`),

  // GET /api/categories/:slug/filters — calls get_filter_values STORED PROCEDURE
  getFilters: (slug) => fetchJSON(`${API_BASE}/categories/${slug}/filters`),
};

// ============================================================
// Search API
// ============================================================
export const searchApi = {
  // GET /api/search?q=... — calls search_products STORED PROCEDURE
  search: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetchJSON(`${API_BASE}/search?${qs}`);
  },

  // GET /api/search/suggestions?q=... — calls get_product_suggestions STORED PROCEDURE
  getSuggestions: (query) => {
    return fetchJSON(`${API_BASE}/search/suggestions?q=${encodeURIComponent(query)}`);
  },
};
