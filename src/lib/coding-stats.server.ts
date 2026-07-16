import type {
  CodingStatEntry,
  CodingStatsInput,
  CodingStatsResult,
  ContributionDay,
} from "./coding-stats.types";

type JsonRecord = Record<string, unknown>;

const requestHeaders = {
  "user-agent":
    "Mozilla/5.0 (compatible; AkashPortfolio/1.0; +https://akashkumarparida.dev)",
  accept: "application/json, text/plain, */*",
};

export async function fetchCodingProfileStats(input: CodingStatsInput): Promise<CodingStatsResult> {
  const username = cleanHandle(input.handle);
  const platform = detectPlatform(input.name);

  try {
    if (!username) throw new Error("Missing username");

    if (platform === "github") return await fetchGitHubStats(username, input);
    if (platform === "leetcode") return await fetchLeetCodeStats(username, input);
    if (platform === "codeforces") return await fetchCodeforcesStats(username, input);
    if (platform === "gfg") return await fetchGfgStats(username, input);
    if (platform === "hackerrank") return await fetchHackerRankStats(username, input);

    throw new Error("Unsupported coding platform");
  } catch (error) {
    return {
      ok: false,
      platform,
      username,
      error: error instanceof Error ? error.message : "Live stats are unavailable right now",
      fallback: fallbackStats(input, username),
      extra: profileLink(platform, username, input.href),
    };
  }
}

function cleanHandle(handle: string) {
  const trimmed = handle.trim().replace(/^@/, "");
  if (!trimmed.startsWith("http")) return trimmed.replace(/\/$/, "");

  try {
    const url = new URL(trimmed);
    return url.pathname.split("/").filter(Boolean).pop() ?? "";
  } catch {
    return trimmed;
  }
}

function detectPlatform(name: string) {
  const platform = name.toLowerCase();
  if (platform.includes("github")) return "github";
  if (platform.includes("leetcode")) return "leetcode";
  if (platform.includes("codeforces")) return "codeforces";
  if (platform.includes("geeks") || platform.includes("gfg")) return "gfg";
  if (platform.includes("hackerrank")) return "hackerrank";
  return platform.replace(/\s+/g, "-") || "coding";
}

function fallbackStats(input: CodingStatsInput, username: string): CodingStatEntry[] {
  return [
    { label: "Displayed Stat", value: input.stat || "Available" },
    { label: "Username", value: username || input.handle },
    { label: "Profile", value: input.meta || input.name },
  ];
}

function profileLink(platform: string, username: string, href?: string) {
  const cleanHref = href && href !== "#" ? href : undefined;
  const urls: Record<string, string> = {
    github: `https://github.com/${username}`,
    leetcode: `https://leetcode.com/u/${username}/`,
    codeforces: `https://codeforces.com/profile/${username}`,
    gfg: `https://www.geeksforgeeks.org/user/${username}/`,
    hackerrank: `https://www.hackerrank.com/profile/${username}`,
  };

  return { url: cleanHref ?? urls[platform] };
}

async function fetchJson<T = unknown>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      ...requestHeaders,
      ...(init?.headers ?? {}),
    },
  });
  const text = await response.text();
  let data: unknown = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`Expected JSON from ${new URL(url).hostname}`);
  }

  if (!response.ok) {
    const message = getString(asRecord(data), "message") ?? getString(asRecord(data), "error");
    throw new Error(message || `${new URL(url).hostname} returned ${response.status}`);
  }

  return data as T;
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, { headers: requestHeaders });
  if (!response.ok) throw new Error(`${new URL(url).hostname} returned ${response.status}`);
  return response.text();
}

async function fetchGitHubStats(username: string, input: CodingStatsInput): Promise<CodingStatsResult> {
  const [profileResult, contributionResult] = await Promise.allSettled([
    fetchJson<JsonRecord>(`https://api.github.com/users/${encodeURIComponent(username)}`),
    fetchJson<JsonRecord>(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`),
  ]);

  if (profileResult.status === "rejected") throw profileResult.reason;

  const profile = profileResult.value;
  const contributionPayload = contributionResult.status === "fulfilled" ? contributionResult.value : null;
  const contributions = parseGitHubContributions(contributionPayload);

  const stats: CodingStatEntry[] = [
    { label: "Public Repos", value: formatValue(getNumber(profile, "public_repos")) },
    { label: "Followers", value: formatValue(getNumber(profile, "followers")) },
    { label: "Following", value: formatValue(getNumber(profile, "following")) },
    { label: "Gists", value: formatValue(getNumber(profile, "public_gists")) },
  ];

  if (contributions) {
    stats.unshift({ label: "Contributions", value: formatValue(contributions.total) });
  }

  return {
    ok: true,
    platform: "github",
    username,
    source: contributions ? "live" : "partial",
    note: contributions ? undefined : "GitHub profile loaded, but contribution graph is temporarily unavailable.",
    stats,
    extra: {
      avatar: getString(profile, "avatar_url"),
      bio: getString(profile, "bio"),
      name: getString(profile, "name"),
      url: getString(profile, "html_url") ?? profileLink("github", username, input.href).url,
    },
    contributions,
  };
}

function parseGitHubContributions(payload: JsonRecord | null) {
  if (!payload) return undefined;
  const total = asRecord(payload.total);
  const rawDays = Array.isArray(payload.contributions) ? payload.contributions : [];
  const days: ContributionDay[] = rawDays
    .map((day) => {
      const row = asRecord(day);
      const date = getString(row, "date");
      if (!date) return null;
      return {
        date,
        count: getNumber(row, "count") ?? 0,
        level: Math.max(0, Math.min(4, getNumber(row, "level") ?? 0)),
      };
    })
    .filter((day): day is ContributionDay => day !== null);

  if (!days.length) return undefined;

  return {
    total: getNumber(total, "lastYear") ?? days.reduce((sum, day) => sum + day.count, 0),
    days,
  };
}

async function fetchLeetCodeStats(username: string, input: CodingStatsInput): Promise<CodingStatsResult> {
  const query = `query userSessionProgress($username: String!) {
    matchedUser(username: $username) {
      username
      profile { ranking realName userAvatar reputation }
      submitStats: submitStatsGlobal { acSubmissionNum { difficulty count submissions } }
      userCalendar { submissionCalendar }
    }
    userContestRanking(username: $username) {
      attendedContestsCount rating globalRanking totalParticipants topPercentage
    }
  }`;

  const payload = await fetchJson<JsonRecord>("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      referer: `https://leetcode.com/u/${encodeURIComponent(username)}/`,
    },
    body: JSON.stringify({ query, variables: { username } }),
  });

  const data = asRecord(payload.data);
  const matchedUser = asRecord(data.matchedUser);
  if (!matchedUser || Object.keys(matchedUser).length === 0) {
    const firstError = Array.isArray(payload.errors) ? asRecord(payload.errors[0]) : null;
    throw new Error(getString(firstError, "message") || "LeetCode user not found");
  }

  const profile = asRecord(matchedUser.profile);
  const submitStats = asRecord(matchedUser.submitStats);
  const solved = Array.isArray(submitStats.acSubmissionNum) ? submitStats.acSubmissionNum.map(asRecord) : [];
  const contest = asRecord(data.userContestRanking);
  const findDifficulty = (difficulty: string) =>
    solved.find((item) => getString(item, "difficulty")?.toLowerCase() === difficulty.toLowerCase());
  const all = findDifficulty("All");
  const allSolved = getNumber(all, "count") ?? 0;
  const allSubmissions = getNumber(all, "submissions") ?? 0;
  const calendar = asRecord(matchedUser.userCalendar);
  const contributions = parseTimestampCalendar(getString(calendar, "submissionCalendar"));

  return {
    ok: true,
    platform: "leetcode",
    username,
    source: "live",
    stats: [
      { label: "Total Solved", value: formatValue(allSolved) },
      { label: "Easy", value: formatValue(getNumber(findDifficulty("Easy"), "count")) },
      { label: "Medium", value: formatValue(getNumber(findDifficulty("Medium"), "count")) },
      { label: "Hard", value: formatValue(getNumber(findDifficulty("Hard"), "count")) },
      { label: "Ranking", value: formatRank(getNumber(profile, "ranking")) },
      { label: "Acceptance", value: allSubmissions ? `${Math.round((allSolved / allSubmissions) * 100)}%` : "—" },
      { label: "Contest Rating", value: formatDecimal(getNumber(contest, "rating")) },
      { label: "Top Percentage", value: formatPercent(getNumber(contest, "topPercentage")) },
    ],
    extra: {
      avatar: getString(profile, "userAvatar"),
      name: getString(profile, "realName") || getString(matchedUser, "username"),
      url: profileLink("leetcode", username, input.href).url,
    },
    contributions,
  };
}

async function fetchCodeforcesStats(username: string, input: CodingStatsInput): Promise<CodingStatsResult> {
  const payload = await fetchJson<JsonRecord>(
    `https://codeforces.com/api/user.info?handles=${encodeURIComponent(username)}`,
  );

  if (payload.status !== "OK") throw new Error(getString(payload, "comment") || "Codeforces user not found");
  const users = Array.isArray(payload.result) ? payload.result : [];
  const user = asRecord(users[0]);
  if (!user || Object.keys(user).length === 0) throw new Error("Codeforces user not found");

  const statusResult = await Promise.allSettled([
    fetchJson<JsonRecord>(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(username)}&from=1&count=10000`),
  ]);
  const statusPayload = statusResult[0].status === "fulfilled" ? statusResult[0].value : null;
  const submissions = statusPayload && Array.isArray(statusPayload.result) ? statusPayload.result : [];
  const counts: Record<string, number> = {};
  for (const raw of submissions) {
    const row = asRecord(raw);
    const ts = getNumber(row, "creationTimeSeconds");
    if (!ts) continue;
    const date = new Date(ts * 1000).toISOString().slice(0, 10);
    counts[date] = (counts[date] ?? 0) + 1;
  }
  const contributions = buildYearCalendar(counts);

  return {
    ok: true,
    platform: "codeforces",
    username,
    source: "live",
    stats: [
      { label: "Rating", value: formatValue(getNumber(user, "rating"), "Unrated") },
      { label: "Max Rating", value: formatValue(getNumber(user, "maxRating")) },
      { label: "Rank", value: getString(user, "rank") || "—" },
      { label: "Max Rank", value: getString(user, "maxRank") || "—" },
      { label: "Contribution", value: formatValue(getNumber(user, "contribution")) },
      { label: "Friends", value: formatValue(getNumber(user, "friendOfCount")) },
    ],
    extra: {
      avatar: getString(user, "titlePhoto") || getString(user, "avatar"),
      name: [getString(user, "firstName"), getString(user, "lastName")].filter(Boolean).join(" ") || username,
      url: profileLink("codeforces", username, input.href).url,
    },
    contributions,
  };
}

async function fetchGfgStats(username: string, input: CodingStatsInput): Promise<CodingStatsResult> {
  const [summaryResult, profileResult, pageResult] = await Promise.allSettled([
    fetchJson<JsonRecord>(`https://gfg-stats.tashif.codes/${encodeURIComponent(username)}`),
    fetchJson<JsonRecord>(`https://gfg-stats.tashif.codes/${encodeURIComponent(username)}/profile`),
    fetchText(`https://www.geeksforgeeks.org/user/${encodeURIComponent(username)}/`),
  ]);

  const summary = summaryResult.status === "fulfilled" ? summaryResult.value : null;
  const profile = profileResult.status === "fulfilled" ? profileResult.value : null;
  const page = pageResult.status === "fulfilled" ? pageResult.value : "";
  const summaryData = asRecord(summary?.data);
  const profileData = asRecord(profile?.data);

  const totalSolved =
    getNumber(summaryData, "totalSolved") ??
    getNumber(summaryData, "totalProblemsSolved") ??
    getNumber(asRecord(summary), "totalProblemsSolved") ??
    extractNumber(page, "total_problems_solved");
  const codingScore = getNumber(profileData, "codingScore") ?? extractNumber(page, "score");

  if (totalSolved == null && codingScore == null) {
    const summaryError = summaryResult.status === "rejected" ? summaryResult.reason : null;
    throw summaryError instanceof Error ? summaryError : new Error("GeeksforGeeks user not found");
  }

  return {
    ok: true,
    platform: "gfg",
    username,
    source: "live",
    stats: [
      { label: "Coding Score", value: formatValue(codingScore) },
      { label: "Total Solved", value: formatValue(totalSolved) },
      { label: "Active Days", value: formatValue(getNumber(summaryData, "totalActiveDays")) },
      { label: "Monthly Score", value: formatValue(extractNumber(page, "monthly_score")) },
      { label: "Current Streak", value: formatValue(getNumber(profileData, "currentStreak") ?? extractNumber(page, "pod_solved_current_streak")) },
      { label: "Max Streak", value: formatValue(getNumber(profileData, "maxStreak") ?? extractNumber(page, "pod_solved_longest_streak")) },
    ],
    extra: {
      avatar: getString(profileData, "avatar"),
      name: getString(profileData, "displayName") || extractString(page, "name") || username,
      bio: getString(profileData, "institution") || getString(profileData, "company"),
      url: profileLink("gfg", username, input.href).url,
    },
    contributions: parseHeatMap(asRecord(profileData.heatMap)) ?? parseHeatMap(asRecord(summaryData.heatMap)) ?? buildYearCalendar({}),
    note:
      parseHeatMap(asRecord(profileData.heatMap)) || parseHeatMap(asRecord(summaryData.heatMap))
        ? undefined
        : "GeeksforGeeks doesn't publish a daily heatmap — showing an empty year grid.",
  };
}

async function fetchHackerRankStats(username: string, input: CodingStatsInput): Promise<CodingStatsResult> {
  const payload = await fetchJson<JsonRecord>(
    `https://hackerrank-stats-api.vercel.app/${encodeURIComponent(username)}/profile`,
  );

  if (payload.status !== "success" && !payload.profile) throw new Error("HackerRank user not found");
  const profile = asRecord(payload.profile);
  const contribData = asRecord(payload.contributions);
  const badges = Array.isArray(payload.badges) ? payload.badges.map(asRecord) : [];
  const activeBadge = asRecord(payload.activeBadge);
  const submitStats = asRecord(payload.submitStats);
  const totalSubmissionRows = Array.isArray(submitStats.totalSubmissionNum) ? submitStats.totalSubmissionNum : [];
  const totalSubmissions = asRecord(totalSubmissionRows[0]);
  const heatCounts: Record<string, number> = {};
  const submissionHistory = Array.isArray(payload.submissionHistory) ? payload.submissionHistory : [];
  for (const raw of submissionHistory) {
    const row = asRecord(raw);
    const date = getString(row, "date") || getString(row, "day");
    const count = getNumber(row, "count") ?? getNumber(row, "submissions") ?? 0;
    if (date) heatCounts[date.slice(0, 10)] = (heatCounts[date.slice(0, 10)] ?? 0) + count;
  }
  const contributions = Object.keys(heatCounts).length
    ? buildYearCalendar(heatCounts)
    : buildYearCalendar({});

  return {
    ok: true,
    platform: "hackerrank",
    username,
    source: "live",
    note: Object.keys(heatCounts).length
      ? undefined
      : "HackerRank doesn't expose a public daily heatmap — showing an empty year grid.",
    stats: [
      { label: "Star Rating", value: formatDecimal(getNumber(profile, "starRating")) },
      { label: "Ranking", value: formatRank(getNumber(profile, "ranking")) },
      { label: "Reputation", value: formatValue(getNumber(profile, "reputation")) },
      { label: "Points", value: formatValue(getNumber(contribData, "points")) },
      { label: "Questions", value: formatValue(getNumber(contribData, "questionCount")) },
      { label: "Submissions", value: formatValue(getNumber(totalSubmissions, "submissions") ?? getNumber(totalSubmissions, "count")) },
      { label: "Badges", value: formatValue(badges.length) },
      { label: "Active Badge", value: getString(activeBadge, "name") || "—" },
    ],
    extra: {
      avatar: getString(profile, "userAvatar"),
      name: getString(profile, "realName") || username,
      bio: getString(profile, "countryName"),
      url: profileLink("hackerrank", username, input.href).url,
    },
    contributions,
  };
}

function asRecord(value: unknown): JsonRecord {
  return value != null && typeof value === "object" && !Array.isArray(value) ? (value as JsonRecord) : {};
}

function levelFromCount(count: number) {
  if (count <= 0) return 0;
  if (count < 2) return 1;
  if (count < 5) return 2;
  if (count < 10) return 3;
  return 4;
}

function buildYearCalendar(counts: Record<string, number>) {
  const days: ContributionDay[] = [];
  const today = new Date();
  const start = new Date(today);
  start.setUTCDate(start.getUTCDate() - 364);
  let total = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    const date = d.toISOString().slice(0, 10);
    const count = counts[date] ?? 0;
    total += count;
    days.push({ date, count, level: levelFromCount(count) });
  }
  return { total, days };
}

function parseTimestampCalendar(raw: string | undefined) {
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw) as Record<string, number | string>;
    const counts: Record<string, number> = {};
    for (const [ts, val] of Object.entries(parsed)) {
      const seconds = Number(ts);
      if (!Number.isFinite(seconds)) continue;
      const date = new Date(seconds * 1000).toISOString().slice(0, 10);
      counts[date] = (counts[date] ?? 0) + Number(val);
    }
    return buildYearCalendar(counts);
  } catch {
    return undefined;
  }
}

function parseHeatMap(map: JsonRecord | null | undefined) {
  if (!map || Object.keys(map).length === 0) return undefined;
  const counts: Record<string, number> = {};
  for (const [key, val] of Object.entries(map)) {
    if (!/^\d{4}-\d{2}-\d{2}/.test(key)) continue;
    const num = typeof val === "number" ? val : Number(val);
    if (Number.isFinite(num)) counts[key.slice(0, 10)] = num;
  }
  if (!Object.keys(counts).length) return undefined;
  return buildYearCalendar(counts);
}

function getString(record: JsonRecord | null | undefined, key: string) {
  const value = record?.[key];
  return typeof value === "string" && value.trim() ? value : undefined;
}

function getNumber(record: JsonRecord | null | undefined, key: string) {
  const value = record?.[key];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value);
  return undefined;
}

function extractNumber(html: string, key: string) {
  const match = html.match(new RegExp(`"${key}"\\s*:\\s*"?(-?\\d+(?:\\.\\d+)?)"?`));
  return match ? Number(match[1]) : undefined;
}

function extractString(html: string, key: string) {
  const match = html.match(new RegExp(`"${key}"\\s*:\\s*"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"`));
  return match?.[1]?.replace(/\\"/g, '"');
}

function formatValue(value: number | undefined, fallback = "—") {
  return value == null ? fallback : new Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(value);
}

function formatDecimal(value: number | undefined) {
  return value == null ? "—" : new Intl.NumberFormat("en", { maximumFractionDigits: 1 }).format(value);
}

function formatRank(value: number | undefined) {
  return value == null || value === 0 ? "—" : `#${formatValue(value)}`;
}

function formatPercent(value: number | undefined) {
  return value == null ? "—" : `${formatDecimal(value)}%`;
}
