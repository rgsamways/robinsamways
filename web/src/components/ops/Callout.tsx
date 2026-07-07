export default function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-4 border-accent bg-skills-bg px-4 py-3 text-sm">
      {children}
    </div>
  );
}
