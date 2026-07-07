export default function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="overflow-x-auto rounded bg-skills-bg px-4 py-3 text-xs leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}
