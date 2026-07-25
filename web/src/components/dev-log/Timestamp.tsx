import { formatEasternLabel, formatUtcLabel } from "./timestampFormat";

export default function Timestamp({ utc }: { utc: string }) {
  return (
    <time dateTime={utc} className="text-xs text-muted">
      {formatUtcLabel(utc)} &middot; {formatEasternLabel(utc)}
    </time>
  );
}
