import { isDbConfigured, testDbConnection } from "../src/config/db.js";
import { searchAniListTitles } from "../src/services/anilist.service.js";
import { upsertManyTitleSnapshots } from "../src/services/titleCache.service.js";

const DELAY_MS = 2500;

const commonTerms = [
  "one piece",
  "naruto",
  "bleach",
  "dragon ball",
  "attack on titan",
  "demon slayer",
  "jujutsu kaisen",
  "solo leveling",
  "lookism",
  "tower of god",
  "omniscient reader",
  "chainsaw man",
  "death note",
  "berserk",
  "vagabond",
  "vinland saga",
  "blue lock",
  "haikyuu",
  "black clover",
  "my hero academia",
  "tokyo ghoul",
  "kingdom",
  "fairy tail",
  "hunter x hunter",
  "frieren",
  "spy x family",
];

const seedQueries = [
  { name: "popular-anime", params: { q: "", type: "Anime", sort: "Popularity", page: 1, perPage: 16 } },
  { name: "popular-manga", params: { q: "", type: "Manga", sort: "Popularity", page: 1, perPage: 16 } },
  { name: "trending-anime", params: { q: "", type: "Anime", sort: "Latest", page: 1, perPage: 16 } },
  { name: "trending-manga", params: { q: "", type: "Manga", sort: "Latest", page: 1, perPage: 16 } },
  { name: "top-rated-anime", params: { q: "", type: "Anime", sort: "Rating", page: 1, perPage: 16 } },
  { name: "top-rated-manga", params: { q: "", type: "Manga", sort: "Rating", page: 1, perPage: 16 } },
  ...commonTerms.map((term) => ({
    name: `search-${term.replace(/\s+/g, "-")}`,
    params: { q: term, sort: "Popularity", page: 1, perPage: 16 },
  })),
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const parseFlags = () => {
  const args = process.argv.slice(2);
  return {
    limitSmall: args.includes("--limit-small"),
    dryRun: args.includes("--dry-run"),
  };
};

const dedupeById = (items = []) => {
  const map = new Map();
  for (const item of items) {
    const id = String(item?.id || "").trim();
    if (!id) continue;
    map.set(id, item);
  }
  return [...map.values()];
};

const isRateLimitError = (error) => {
  const code = String(error?.code || "").toUpperCase();
  const message = String(error?.message || "").toUpperCase();
  return code === "ANILIST_RATE_LIMITED" || code === "ANILIST_COOLDOWN" || message.includes("429");
};

async function main() {
  const { limitSmall, dryRun } = parseFlags();

  if (!isDbConfigured()) {
    console.error("[seed:titles] Database is not configured. Set DB_HOST, DB_USER, DB_NAME, and related env vars.");
    process.exit(1);
  }

  const dbStatus = await testDbConnection();
  if (!dbStatus.dbConnected) {
    console.error("[seed:titles] Database connection failed. Check DB env config and connectivity.");
    process.exit(1);
  }

  const queries = limitSmall
    ? seedQueries.filter((q) => q.name.startsWith("popular-") || q.name === "search-one-piece" || q.name === "search-solo-leveling").slice(0, 5)
    : seedQueries;

  console.log(`[seed:titles] Starting seed run with ${queries.length} queries.${dryRun ? " (dry-run)" : ""}`);

  const fetched = [];
  let queryIndex = 0;

  for (const query of queries) {
    queryIndex += 1;
    console.log(`[seed:titles] [${queryIndex}/${queries.length}] ${query.name}`);
    try {
      const results = await searchAniListTitles(query.params);
      const count = Array.isArray(results) ? results.length : 0;
      if (count > 0) fetched.push(...results);
      console.log(`[seed:titles]   fetched: ${count}`);
    } catch (error) {
      if (isRateLimitError(error)) {
        console.warn(`[seed:titles]   AniList rate-limited/cooldown on ${query.name}. Stopping gracefully.`);
        break;
      }
      console.warn(`[seed:titles]   failed: ${query.name} (${error?.message || "unknown error"})`);
    }

    if (queryIndex < queries.length) {
      await sleep(DELAY_MS);
    }
  }

  const deduped = dedupeById(fetched);
  console.log(`[seed:titles] Total fetched: ${fetched.length}`);
  console.log(`[seed:titles] Unique by id: ${deduped.length}`);

  if (dryRun) {
    console.log("[seed:titles] Dry-run mode enabled. Skipping DB upsert.");
    return;
  }

  const saved = await upsertManyTitleSnapshots(deduped);
  console.log(`[seed:titles] Total saved: ${Array.isArray(saved) ? saved.length : 0}`);
  console.log("[seed:titles] Done.");
}

main().catch((error) => {
  console.error(`[seed:titles] Fatal error: ${error?.message || error}`);
  process.exit(1);
});
