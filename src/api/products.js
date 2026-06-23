const API_BASE_URL = 'https://dummyjson.com';

async function request(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export function getProducts({ limit = 100, skip = 0 } = {}) {
  return request(`/products?limit=${limit}&skip=${skip}`);
}

export function getCategories() {
  return request('/products/categories');
}

export function getProductsByCategory(categorySlug) {
  return request(`/products/category/${encodeURIComponent(categorySlug)}?limit=100`);
}

export function getProductById(id) {
  return request(`/products/${id}`);
}
