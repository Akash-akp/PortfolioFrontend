import { createServerFn } from "@tanstack/react-start";

import { fetchCodingProfileStats } from "./coding-stats.server";
import type { CodingStatsInput } from "./coding-stats.types";

export const getCodingProfileStats = createServerFn({ method: "GET" })
  .validator((data: unknown): CodingStatsInput => {
    const value = data != null && typeof data === "object" ? (data as Partial<CodingStatsInput>) : {};

    return {
      name: String(value.name ?? ""),
      handle: String(value.handle ?? ""),
      stat: value.stat == null ? undefined : String(value.stat),
      meta: value.meta == null ? undefined : String(value.meta),
      href: value.href == null ? undefined : String(value.href),
    };
  })
  .handler(async ({ data }) => fetchCodingProfileStats(data));
