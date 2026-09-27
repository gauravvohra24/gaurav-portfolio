// Netlify Function (v2) — public LeetCode stats for the portfolio.
//
// Why a function: LeetCode's GraphQL API sends no CORS headers, so browsers
// can't call it directly. This proxies ONLY public profile data — no login,
// cookies or tokens are used or needed.
//
// Caching: Netlify's CDN caches the response for 6h and may serve it stale for
// up to 7 days while revalidating, so LeetCode is contacted a few times a day
// at most — never per page view. Errors are never cached.

const ENDPOINT = "https://leetcode.com/graphql";
const USERNAME = "gauravvohra24";
const PROFILE_URL = `https://leetcode.com/u/${USERNAME}/`;
const RECENT_LIMIT = 20; // LeetCode's public cap for recent accepted submissions
const MEMORY_TTL_MS = 10 * 60 * 1000;

let memo = null; // warm-instance cache: { at, data }

async function gql(query, variables) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: PROFILE_URL,
      "User-Agent": "Mozilla/5.0 (compatible; gaurav-portfolio-stats/1.0; +https://github.com/gauravvohra24/gaurav-portfolio)",
    },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(9000),
  });
  if (!res.ok) throw new Error(`LeetCode responded with HTTP ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(`LeetCode GraphQL error: ${json.errors[0].message}`);
  return json.data;
}

const PROFILE_QUERY = `
  query profile($username: String!, $limit: Int!) {
    matchedUser(username: $username) {
      username
      submitStatsGlobal { acSubmissionNum { difficulty count } }
      tagProblemCounts {
        fundamental { tagName tagSlug problemsSolved }
        intermediate { tagName tagSlug problemsSolved }
        advanced { tagName tagSlug problemsSolved }
      }
    }
    recentAcSubmissionList(username: $username, limit: $limit) { title titleSlug timestamp }
  }
`;

const SLUG = /^[a-z0-9-]+$/;

async function questionDetails(slugs) {
  if (!slugs.length) return {};
  // One batched request using GraphQL aliases instead of N round-trips.
  const vars = Object.fromEntries(slugs.map((s, i) => [`s${i}`, s]));
  const defs = slugs.map((_, i) => `$s${i}: String!`).join(", ");
  const fields = slugs.map((_, i) => `q${i}: question(titleSlug: $s${i}) { titleSlug difficulty topicTags { name slug } }`).join("\n");
  const data = await gql(`query details(${defs}) { ${fields} }`, vars);
  const out = {};
  slugs.forEach((slug, i) => {
    const q = data[`q${i}`];
    if (q) out[slug] = { difficulty: q.difficulty, topics: (q.topicTags ?? []).map((t) => t.name) };
  });
  return out;
}

export async function getLeetCodeData() {
  if (memo && Date.now() - memo.at < MEMORY_TTL_MS) return memo.data;

  const { matchedUser, recentAcSubmissionList } = await gql(PROFILE_QUERY, { username: USERNAME, limit: RECENT_LIMIT });
  if (!matchedUser) throw new Error("LeetCode user not found");

  const counts = Object.fromEntries(matchedUser.submitStatsGlobal.acSubmissionNum.map((r) => [r.difficulty.toLowerCase(), r.count]));
  const totals = { all: counts.all, easy: counts.easy, medium: counts.medium, hard: counts.hard };
  if (![totals.all, totals.easy, totals.medium, totals.hard].every(Number.isInteger)) throw new Error("Unexpected stats shape from LeetCode");
  if (totals.easy + totals.medium + totals.hard !== totals.all) throw new Error("LeetCode difficulty counts do not add up to the total");

  const t = matchedUser.tagProblemCounts;
  const topics = [...t.fundamental, ...t.intermediate, ...t.advanced]
    .filter((x) => x.problemsSolved > 0)
    .map((x) => ({ name: x.tagName, slug: x.tagSlug, solved: x.problemsSolved }))
    .sort((a, b) => b.solved - a.solved || a.name.localeCompare(b.name));

  // Recent accepted submissions can repeat a problem — keep each problem's latest solve.
  const seen = new Set();
  const recentRaw = (recentAcSubmissionList ?? []).filter((s) => SLUG.test(s.titleSlug) && !seen.has(s.titleSlug) && seen.add(s.titleSlug));
  const details = await questionDetails(recentRaw.map((s) => s.titleSlug));

  const recent = recentRaw.map((s) => ({
    title: s.title,
    slug: s.titleSlug,
    difficulty: details[s.titleSlug]?.difficulty ?? null,
    url: `https://leetcode.com/problems/${s.titleSlug}/`,
    topics: details[s.titleSlug]?.topics ?? [],
    solvedAt: new Date(Number(s.timestamp) * 1000).toISOString(),
  }));

  const data = {
    username: matchedUser.username,
    profileUrl: PROFILE_URL,
    fetchedAt: new Date().toISOString(),
    totals,
    topics,
    recent,
    recentLimit: RECENT_LIMIT,
  };
  memo = { at: Date.now(), data };
  return data;
}

export default async () => {
  try {
    const data = await getLeetCodeData();
    return Response.json(data, {
      headers: {
        "Cache-Control": "public, max-age=900",
        "Netlify-CDN-Cache-Control": "public, durable, s-maxage=21600, stale-while-revalidate=604800",
      },
    });
  } catch (err) {
    console.error("[leetcode] fetch failed:", err.message);
    return Response.json({ error: "LeetCode data temporarily unavailable" }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
};

export const config = { path: "/api/leetcode" };
