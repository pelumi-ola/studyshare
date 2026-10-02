const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export const getToken = () => localStorage.getItem("ss_token");
export const setToken = (t) =>
  t ? localStorage.setItem("ss_token", t) : localStorage.removeItem("ss_token");

async function request(path, { method = "GET", body, form } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers["Content-Type"] = "application/json";
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    credentials: "include",
    body: form || (body ? JSON.stringify(body) : undefined),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(
      data.message || data.error || `Request failed (${res.status})`,
    );
    err.status = res.status;
    throw err;
  }
  return data;
}

const emptyOn404 = (promise) =>
  promise.catch((e) => {
    if (e.status === 404) return [];
    throw e;
  });

// Backend response shapes can vary; these helpers accept array / {key} / {data}.
export const asList = (d, key) =>
  Array.isArray(d) ? d : d?.[key] || d?.data || [];
export const asItem = (d, key) => d?.[key] || d?.data || d;
export const idOf = (o) => (o && typeof o === "object" ? o._id : o);

export const api = {
  // auth
  register: (b) => request("/auth/register", { method: "POST", body: b }),
  login: (b) => request("/auth/login", { method: "POST", body: b }),
  profile: () => request("/auth/profile"),
  // admin
  adminRegister: (b) => request("/admin/register", { method: "POST", body: b }),
  adminLogin: (b) => request("/admin/login", { method: "POST", body: b }),
  users: () => emptyOn404(request("/admin/users")),
  deleteUser: (id) => request(`/admin/users/${id}`, { method: "DELETE" }),
  // courses
  courses: () => emptyOn404(request("/courses")),
  course: (id) => request(`/courses/${id}`),
  createCourse: (b) => request("/courses", { method: "POST", body: b }),
  updateCourse: (id, b) =>
    request(`/courses/${id}`, { method: "PUT", body: b }),
  deleteCourse: (id) => request(`/courses/${id}`, { method: "DELETE" }),
  // resources
  resources: (qs = "?limit=50") => emptyOn404(request(`/resources${qs}`)),
  resource: (id) => request(`/resources/${id}`),
  createResource: (form) => request("/resources", { method: "POST", form }),
  updateResource: (id, b) =>
    request(`/resources/${id}`, { method: "PUT", body: b }),
  deleteResource: (id) => request(`/resources/${id}`, { method: "DELETE" }),
  // reports
  createReport: (b) => request("/reports", { method: "POST", body: b }),
  reports: () => emptyOn404(request("/reports")),
  report: (id) => request(`/reports/${id}`),
  updateReport: (id, b) =>
    request(`/reports/${id}`, { method: "PUT", body: b }),
  deleteReport: (id) => request(`/reports/${id}`, { method: "DELETE" }),
  download: (id) => request(`/resources/${id}/download`),
};
