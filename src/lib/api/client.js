import { ApiError } from "./types";

const BASE = (import.meta.env.VITE_API_BASE_URL ?? "https://loom.solvix.buzz").replace(/\/$/, "");
const PREFIX = "/api/v1";

export const TOKEN_KEY = "loom_token";
export const USER_ID_KEY = "loom_user_id";

function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

function buildHeaders(extra) {
  const h = new Headers(extra);
  const t = getToken();
  if (t) h.set("Authorization", `Bearer ${t}`);
  return h;
}

async function handle(res, asText = false) {
  if (res.status === 401 && typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_ID_KEY);
    if (!window.location.pathname.startsWith("/login") && !window.location.pathname.startsWith("/signup")) {
      window.location.replace("/login");
    }
    throw new ApiError(401, "Unauthorized");
  }
  if (!res.ok) {
    let msg = res.statusText;
    try {
      msg = (await res.text()) || msg;
    } catch {
      /* ignore */
    }
    throw new ApiError(res.status, msg);
  }
  if (res.status === 204) return undefined;
  if (asText) return await res.text();
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) return await res.json();
  const txt = await res.text();
  try {
    return JSON.parse(txt);
  } catch {
    return txt;
  }
}

function url(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${BASE}${PREFIX}${p}`;
}

export async function apiGet(path) {
  const res = await fetch(url(path), { headers: buildHeaders() });
  return handle(res);
}

export async function apiGetText(path) {
  const res = await fetch(url(path), { headers: buildHeaders() });
  return handle(res, true);
}

export async function apiPost(path, body) {
  const res = await fetch(url(path), {
    method: "POST",
    headers: buildHeaders({ "Content-Type": "application/json" }),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return handle(res);
}

export async function apiPostText(path, body) {
  const res = await fetch(url(path), {
    method: "POST",
    headers: buildHeaders({ "Content-Type": "text/plain" }),
    body,
  });
  return handle(res);
}

export async function apiPostEmpty(path) {
  const res = await fetch(url(path), { method: "POST", headers: buildHeaders() });
  await handle(res);
}

export async function apiPostMultipart(path, form) {
  const res = await fetch(url(path), {
    method: "POST",
    headers: buildHeaders(),
    body: form,
  });
  return handle(res);
}

export async function apiPutText(path, body) {
  const res = await fetch(url(path), {
    method: "PUT",
    headers: buildHeaders({ "Content-Type": "text/plain" }),
    body,
  });
  return handle(res);
}

export async function apiDelete(path) {
  const res = await fetch(url(path), { method: "DELETE", headers: buildHeaders() });
  await handle(res);
}
