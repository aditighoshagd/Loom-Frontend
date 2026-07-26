export function readTimeMinutes(content) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

export function isNewsletter(p) {
  return p.title !== null && p.title.trim().length > 0;
}

export function colorFromId(id) {
  const n = typeof id === "number" ? id : id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const hues = [16, 45, 200, 260, 320, 140, 30];
  const h = hues[n % hues.length];
  return `oklch(0.5 0.15 ${h})`;
}

const CATEGORIES = {
  Technology: ["tech", "software", "ai", "code", "programming", "startup", "app", "computer"],
  "Personal Growth": ["growth", "mindful", "habit", "productivity", "self", "morning", "life"],
  Poetry: ["poem", "poetry", "verse", "rhyme"],
  Business: ["business", "market", "sales", "founder", "company", "revenue"],
  Culture: ["culture", "art", "film", "music", "book"],
  Finance: ["finance", "money", "invest", "stock", "crypto", "budget"],
  Science: ["science", "research", "physics", "biology", "study"],
};

export function matchesCategory(post, category) {
  if (category === "All") return true;
  const kws = CATEGORIES[category];
  if (!kws) return true;
  const hay = `${post.title ?? ""} ${post.subTitle ?? ""} ${post.content}`.toLowerCase();
  return kws.some((k) => hay.includes(k));
}

export const CATEGORY_NAMES = ["All", ...Object.keys(CATEGORIES)];
