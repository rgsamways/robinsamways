import Link from "next/link";
import type { LightbulbEntry } from "./types";

export default function LightbulbsList({ entries }: { entries: LightbulbEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted">No ideas logged yet for this project.</p>
    );
  }

  return (
    <ul className="space-y-5">
      {entries.map((entry) => (
        <li key={entry.slug} className="border-b border-foreground/10 pb-5">
          <h2 className="text-sm font-bold">
            <span className="text-accent">&gt;</span> {entry.title}
          </h2>
          <p className="mt-1 text-xs text-muted">Logged {entry.dateLogged}</p>
          <p className="mt-2 text-sm leading-relaxed">{entry.summary}</p>
          {entry.graduatedTo && (
            <p className="mt-2 text-sm">
              <Link href={entry.graduatedTo.href} className="text-accent hover:underline">
                {entry.graduatedTo.label}
              </Link>
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
