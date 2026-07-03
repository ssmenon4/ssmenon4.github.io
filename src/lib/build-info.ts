import { execSync } from "node:child_process";

/** Last commit time, captured at build. Site rebuilds on push, so honest by construction. */
export function buildInfo() {
  const iso = execSync("git log -1 --format=%cI").toString().trim();
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  const rel = days === 0 ? "TODAY" : days === 1 ? "YESTERDAY" : `${days} DAYS AGO`;
  return { lastCommitISO: iso, lastCommitRelative: rel };
}
