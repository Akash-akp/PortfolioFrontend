export type CodingStatsInput = {
  name: string;
  handle: string;
  stat?: string;
  meta?: string;
  href?: string;
};

export type CodingStatEntry = {
  label: string;
  value: string;
};

export type ContributionDay = {
  date: string;
  count: number;
  level: number;
};

export type CodingStatsExtra = {
  avatar?: string;
  bio?: string;
  name?: string;
  url?: string;
};

export type CodingStatsSuccess = {
  ok: true;
  platform: string;
  username: string;
  source: "live" | "partial";
  note?: string;
  stats: CodingStatEntry[];
  extra?: CodingStatsExtra;
  contributions?: {
    total: number;
    days: ContributionDay[];
  };
};

export type CodingStatsFailure = {
  ok: false;
  platform: string;
  username: string;
  error: string;
  fallback: CodingStatEntry[];
  extra?: CodingStatsExtra;
};

export type CodingStatsResult = CodingStatsSuccess | CodingStatsFailure;
