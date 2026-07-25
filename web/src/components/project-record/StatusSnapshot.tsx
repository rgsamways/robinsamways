import type { ProjectStatus } from "./types";

export default function StatusSnapshot({ status }: { status: ProjectStatus }) {
  return (
    <div>
      <p className="text-xs text-muted">As of {status.asOf}</p>
      <p className="mt-2 text-sm leading-relaxed">{status.deploymentStatus}</p>
      <p className="mt-3 text-sm leading-relaxed">{status.summary}</p>
      <ul className="mt-4 space-y-2 text-sm">
        {status.highlights.map((highlight, index) => (
          <li key={index} className="flex gap-2">
            <span aria-hidden className="text-accent">
              &rsaquo;
            </span>
            <span>{highlight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
