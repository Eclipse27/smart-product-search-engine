// ============================================================
// API Layer — Communicates with the Express & MySQL Backend
// ============================================================

const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('aura_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({ error: 'Failed to parse response' }));
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return data;
}

// ============================================================
// Auth API
// ============================================================
export const authApi = {
  register: (userData) =>
    fetchJSON(`${API_BASE}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    fetchJSON(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getMe: () => fetchJSON(`${API_BASE}/auth/me`),
};

// ============================================================
// Products API
// ============================================================
export const productsApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetchJSON(`${API_BASE}/products?${qs}`);
  },

  getBySlug: (slug) => fetchJSON(`${API_BASE}/products/${slug}`),

  getByCategory: (categorySlug, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetchJSON(`${API_BASE}/products/category/${categorySlug}?${qs}`);
  },

  filter: (filterPayload) =>
    fetchJSON(`${API_BASE}/products/filter`, {
      method: 'POST',
      body: JSON.stringify(filterPayload),
    }),

  getTrending: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetchJSON(`${API_BASE}/products/trending?${qs}`);
  },

  getBestSellers: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetchJSON(`${API_BASE}/products/bestsellers?${qs}`);
  },

  getRanking: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetchJSON(`${API_BASE}/products/ranking?${qs}`);
  },

  getRecommendations: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetchJSON(`${API_BASE}/products/recommendations?${qs}`);
  },

  getRelated: (productId) => fetchJSON(`${API_BASE}/products/${productId}/related`),

  logView: (productId, customerId = null) =>
    fetchJSON(`${API_BASE}/products/${productId}/view`, {
      method: 'POST',
      body: JSON.stringify({ customerId }),
    }),

  getReviews: (productId) => fetchJSON(`${API_BASE}/products/${productId}/reviews`),

  submitReview: (productId, reviewData) =>
    fetchJSON(`${API_BASE}/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    }),
};

// ============================================================
// Categories API
// ============================================================
export const categoriesApi = {
  getAll: () => fetchJSON(`${API_BASE}/categories`),
  getBySlug: (slug) => fetchJSON(`${API_BASE}/categories/${slug}`),
  getFilters: (slug) => fetchJSON(`${API_BASE}/categories/${slug}/filters`),
};

// ============================================================
// Search API (Typo-Tolerant, Autocomplete, History)
// ============================================================
export const searchApi = {
  search: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetchJSON(`${API_BASE}/search?${qs}`);
  },

  getSuggestions: (query) =>
    fetchJSON(`${API_BASE}/search/suggestions?q=${encodeURIComponent(query)}`),

  getHistory: () => fetchJSON(`${API_BASE}/search/history`),
};

// ============================================================
// Cart API
// ============================================================
export const cartApi = {
  get: () => fetchJSON(`${API_BASE}/cart`),

  add: (productId, quantity = 1) =>
    fetchJSON(`${API_BASE}/cart`, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),

  update: (productId, quantity) =>
    fetchJSON(`${API_BASE}/cart/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),

  remove: (productId) =>
    fetchJSON(`${API_BASE}/cart/${productId}`, {
      method: 'DELETE',
    }),

  clear: () =>
    fetchJSON(`${API_BASE}/cart`, {
      method: 'DELETE',
    }),
};

// ============================================================
// Orders API (Transactions)
// ============================================================
export const ordersApi = {
  create: (orderData) =>
    fetchJSON(`${API_BASE}/orders`, {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  getAll: () => fetchJSON(`${API_BASE}/orders`),

  getById: (orderId) => fetchJSON(`${API_BASE}/orders/${orderId}`),
};

// ============================================================
// Wishlist API
// ============================================================
export const wishlistApi = {
  get: () => fetchJSON(`${API_BASE}/wishlist`),

  add: (productId) =>
    fetchJSON(`${API_BASE}/wishlist`, {
      method: 'POST',
      body: JSON.stringify({ productId }),
    }),

  remove: (productId) =>
    fetchJSON(`${API_BASE}/wishlist/${productId}`, {
      method: 'DELETE',
    }),
};
