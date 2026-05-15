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

const CURATED_ANIME_TERMS = [
  "dragon ball z",
  "naruto",
  "one piece",
  "attack on titan",
  "death note",
  "fullmetal alchemist brotherhood",
  "sword art online",
  "my hero academia",
  "demon slayer",
  "tokyo ghoul",
  "hunter x hunter",
  "bleach",
  "fairy tail",
  "one punch man",
  "re zero",
  "steins gate",
  "code geass",
  "neon genesis evangelion",
  "cowboy bebop",
  "spirited away",
  "your lie in april",
  "violet evergarden",
  "fruits basket",
  "overlord",
  "black clover",
  "jujutsu kaisen",
  "vinland saga",
  "mob psycho 100",
  "the promised neverland",
  "haikyuu",
  "toradora",
  "clannad",
  "sword art online alicization",
  "no game no life",
  "gurren lagann",
  "ao no exorcist",
  "soul eater",
  "danmachi",
  "food wars",
  "tokyo revengers",
  "assassination classroom",
  "dr stone",
  "parasyte",
  "erased",
  "charlotte",
  "that time i got reincarnated as a slime",
  "konosuba",
  "sword art online progressive",
  "mushoku tensei",
  "black butler",
  "kaiba",
  "tatami galaxy",
  "ping pong the animation",
  "uchouten kazoku",
  "haibane renmei",
  "nhk ni youkoso",
  "planetes",
  "kemono no souja erin",
  "showa genroku rakugo shinjuu",
  "dennou coil",
  "texhnolyze",
  "casshern sins",
  "shin sekai yori",
  "jinrui wa suitai shimashita",
  "mawaru penguindrum",
  "ryuu to freckles",
  "kino's journey 2003",
  "now and then here and there",
  "patlabor 2",
  "bartender",
  "mushishi zoku shou",
  "hidamari sketch",
  "aria the animation",
  "yokohama kaidashi kikou ova",
  "koi kaze",
  "gankutsuou",
  "kyousougiga",
  "usagi drop",
  "house of five leaves",
  "kuuchuu buranko",
  "eve no jikan",
  "the big o",
  "ghost hound",
  "kouya no kotobuki hikoutai",
  "tsurune",
  "yojouhan shinwa taikei",
  "sketchbook full color's",
  "seirei moribito",
  "patlabor the movie",
  "cat soup ova",
  "iroduku the world in colors",
  "shigofumi",
  "wandering son",
  "bokura no",
  "kemono no souja erin",
  "alien 9",
  "petshop of horrors",
  "genshiken",
  "ristorante paradiso",
  "kamichu",
];

const baseQueries = [
  { name: "popular-anime", params: { q: "", type: "Anime", sort: "Popularity", page: 1, perPage: 16 } },
  { name: "popular-manga", params: { q: "", type: "Manga", sort: "Popularity", page: 1, perPage: 16 } },
  { name: "trending-anime", params: { q: "", type: "Anime", sort: "Latest", page: 1, perPage: 16 } },
  { name: "trending-manga", params: { q: "", type: "Manga", sort: "Latest", page: 1, perPage: 16 } },
  { name: "top-rated-anime", params: { q: "", type: "Anime", sort: "Rating", page: 1, perPage: 16 } },
  { name: "top-rated-manga", params: { q: "", type: "Manga", sort: "Rating", page: 1, perPage: 16 } },
];

const makeSearchQueries = (terms) =>
  terms.map((term) => ({
    name: `search-${term.replace(/\s+/g, "-")}`,
    params: { q: term, sort: "Popularity", page: 1, perPage: 16 },
  }));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const parseFlags = () => {
  const args = process.argv.slice(2);
  return {
    limitSmall: args.includes("--limit-small"),
    dryRun: args.includes("--dry-run"),
    curatedAnime: args.includes("--curated-anime"),
    curatedAnimeOnly: args.includes("--curated-anime-only"),
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
  const { limitSmall, dryRun, curatedAnime, curatedAnimeOnly } = parseFlags();

  if (!isDbConfigured()) {
    console.error("[seed:titles] Database is not configured. Set DB_HOST, DB_USER, DB_NAME, and related env vars.");
    process.exit(1);
  }

  const dbStatus = await testDbConnection();
  if (!dbStatus.dbConnected) {
    console.error("[seed:titles] Database connection failed. Check DB env config and connectivity.");
    process.exit(1);
  }

  const includeCurated = curatedAnime || curatedAnimeOnly;
  const curatedSmallTerms = CURATED_ANIME_TERMS.slice(0, 8);

  let queries = [];
  if (curatedAnimeOnly) {
    const curatedTerms = limitSmall ? curatedSmallTerms : CURATED_ANIME_TERMS;
    queries = makeSearchQueries(curatedTerms);
  } else {
    queries = [
      ...baseQueries,
      ...makeSearchQueries(commonTerms),
      ...(includeCurated ? makeSearchQueries(CURATED_ANIME_TERMS) : []),
    ];

    if (limitSmall) {
      queries = queries
        .filter((q) => q.name.startsWith("popular-") || q.name === "search-one-piece" || q.name === "search-solo-leveling")
        .slice(0, 5);
    }
  }

  const queryMap = new Map();
  for (const query of queries) {
    queryMap.set(query.name, query);
  }
  queries = [...queryMap.values()];

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
