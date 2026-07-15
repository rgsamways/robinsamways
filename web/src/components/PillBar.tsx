type Pill = {
  id: string;
  label: string;
};

export default function PillBar({
  pills,
  activeIds,
  onToggle,
  ariaLabel,
}: {
  pills: Pill[];
  activeIds: string[];
  onToggle: (id: string) => void;
  ariaLabel: string;
}) {
  return (
    <div role="group" aria-label={ariaLabel} className="mt-8 flex flex-wrap gap-2">
      {pills.map((pill) => {
        const isActive = activeIds.includes(pill.id);
        return (
          <button
            key={pill.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onToggle(pill.id)}
            className={
              isActive
                ? "rounded-full border border-accent bg-accent px-4 py-1 text-xs font-semibold text-background"
                : "rounded-full border border-foreground/20 px-4 py-1 text-xs font-semibold text-muted transition hover:border-accent hover:text-accent"
            }
          >
            {pill.label}
          </button>
        );
      })}
    </div>
  );
}
