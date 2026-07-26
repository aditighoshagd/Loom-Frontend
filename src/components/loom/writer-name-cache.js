const KEY = "loom_writer_names_v1";

function read() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

function write(map) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(map));
}

export function rememberWriters(list) {
  const map = read();
  let dirty = false;
  for (const p of list) {
    if (map[p.userId] !== p.name) {
      map[p.userId] = p.name;
      dirty = true;
    }
  }
  if (dirty) write(map);
}

export function rememberWriter(userId, name) {
  const map = read();
  if (map[userId] !== name) {
    map[userId] = name;
    write(map);
  }
}

export function writerName(userId) {
  return read()[userId] ?? null;
}
