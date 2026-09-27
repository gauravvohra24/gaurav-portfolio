// Client for the portfolio's own /api/leetcode endpoint (a Netlify Function).
// Keeps the last good response in localStorage so the section can show
// "last known" data if the live endpoint is ever unavailable.

const ENDPOINT = "/api/leetcode";
const CACHE_KEY = "gv-leetcode-v1";

let inflight = null;

function isValid(d) {
  const t = d?.totals;
  return Boolean(t) && [t.all, t.easy, t.medium, t.hard].every(Number.isInteger) && Array.isArray(d.topics) && Array.isArray(d.recent);
}

export function readCachedLeetCode() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "null");
    return isValid(parsed) ? parsed : null;
  } catch {
    return null; // storage blocked or corrupted — just behave as uncached
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable — live data still works, it just isn't remembered
  }
}

/** Fetches live stats once per page load (concurrent callers share one request). */
export function fetchLeetCode() {
  inflight ??= fetch(ENDPOINT, { headers: { Accept: "application/json" } })
    .then(async (res) => {
      if (!res.ok) throw new Error(`LeetCode endpoint responded ${res.status}`);
      const data = await res.json();
      if (!isValid(data)) throw new Error("LeetCode endpoint returned unexpected data");
      writeCache(data);
      return data;
    })
    .catch((err) => {
      inflight = null; // allow a retry later
      throw err;
    });
  return inflight;
}
