import Link from "next/link";
import type { ProjectFeature } from "./types";

export default function FeatureStatusList({ features }: { features: ProjectFeature[] }) {
  return (
    <ul className="space-y-3 text-sm">
      {features.map((feature) => (
        <li key={feature.name} className="flex items-start gap-3">
          <span
            className={
              feature.status === "shipped"
                ? "mt-0.5 shrink-0 rounded-full border border-accent bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-background"
                : "mt-0.5 shrink-0 rounded-full border border-foreground/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted"
            }
          >
            {feature.status}
          </span>
          <div>
            <p className="font-semibold">
              {feature.href ? (
                <Link href={feature.href} className="hover:text-accent">
                  {feature.name}
                </Link>
              ) : (
                feature.name
              )}
            </p>
            {feature.note && <p className="mt-0.5 text-xs text-muted">{feature.note}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}
