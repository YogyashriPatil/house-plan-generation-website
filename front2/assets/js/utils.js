// assets/js/api.js
const API_BASE = "http://localhost:5000/v2/api"; // <-- change if different

export function getToken() {
  return localStorage.getItem("token") || null;
}

export function saveToken(t) {
  localStorage.setItem("token", t);
}

export function clearToken() {
  localStorage.removeItem("token");
}

async function request(path, opts = {}) {
  const headers = opts.headers || {};
  // JSON default
  if (!headers["Accept"]) headers["Accept"] = "application/json";
  if (opts.body && !(opts.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // custom header name 'token' per backend
  const token = getToken();
  if (token) headers["token"] = token;

  const res = await fetch(API_BASE + path, {
    ...opts,
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  let body = null;
  if (contentType.includes("application/json")) {
    body = await res.json();
  } else {
    body = await res.text();
  }

  if (!res.ok) {
    const err = new Error(body?.message || res.statusText || "Request failed");
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return body;
}

export const api = {
  post: (path, data) =>
    request(path, {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
  get: (path) =>
    request(path, {
      method: "GET",
    }),
  del: (path) =>
    request(path, {
      method: "DELETE",
    }),
  put: (path, data) =>
    request(path, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
