const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const TOKEN_KEY = "bers_admin_token";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };

  const token = options.auth === false ? null : getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  let json = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok) {
    const message = json?.error || `${res.status} ${res.statusText}`;
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  return json?.data ?? null;
}

export async function getNewsList({ category, limit } = {}) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (limit) params.set("limit", String(limit));
  const qs = params.toString();
  return request(`/api/news${qs ? `?${qs}` : ""}`, { auth: false });
}

export async function getNewsBySlug(slug) {
  return request(`/api/news/${encodeURIComponent(slug)}`, { auth: false });
}

export async function getPopularNews(limit = 5) {
  return request(`/api/news/popular?limit=${limit}`, { auth: false });
}

export async function createNews(body) {
  return request("/api/news", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateNews(slug, body) {
  return request(`/api/news/${encodeURIComponent(slug)}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteNews(slug) {
  return request(`/api/news/${encodeURIComponent(slug)}`, {
    method: "DELETE",
  });
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  return request("/api/upload", {
    method: "POST",
    body: formData,
  });
}

export async function login(email, password) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    auth: false,
  });
}

export async function getMe() {
  return request("/api/auth/me");
}

export async function logout() {
  try {
    await request("/api/auth/logout", { method: "POST" });
  } finally {
    setToken(null);
  }
}

export async function getUsers() {
  return request("/api/users");
}

export async function createUser(body) {
  return request("/api/users", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateUser(id, body) {
  return request(`/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteUser(id) {
  return request(`/api/users/${id}`, { method: "DELETE" });
}

export async function getAds() {
  return request("/api/ads", { auth: false });
}

export async function getAdsAdmin() {
  return request("/api/ads/admin");
}

export async function updateAd(slot, body) {
  return request(`/api/ads/${encodeURIComponent(slot)}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function getComments(slug) {
  return request(`/api/news/${encodeURIComponent(slug)}/comments`, {
    auth: false,
  });
}

export async function createComment(slug, body) {
  return request(`/api/news/${encodeURIComponent(slug)}/comments`, {
    method: "POST",
    body: JSON.stringify(body),
    auth: false,
  });
}

export { API_URL };
