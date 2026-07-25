// UTC alone forces a reader to convert it themselves — this pairs it with the
// Eastern-time equivalent (Robin's own timezone) via Intl.DateTimeFormat, so
// EST/EDT is handled automatically rather than a hardcoded offset.
export function formatUtcLabel(isoUtc: string): string {
  return `${isoUtc.slice(0, 16)}Z`;
}

export function formatEasternLabel(isoUtc: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Toronto",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(isoUtc));
}
