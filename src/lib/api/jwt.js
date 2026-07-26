function b64urlDecode(s) {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = (s + pad).replace(/-/g, "+").replace(/_/g, "/");
  if (typeof atob !== "undefined") return atob(b64);
  return Buffer.from(b64, "base64").toString("binary");
}

export function decodeToken(token) {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const json = decodeURIComponent(
      Array.from(b64urlDecode(parts[1]))
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getUserIdFromToken(token) {
  const p = decodeToken(token);
  if (!p?.sub) return null;
  const id = parseInt(p.sub, 10);
  return Number.isFinite(id) ? id : null;
}
