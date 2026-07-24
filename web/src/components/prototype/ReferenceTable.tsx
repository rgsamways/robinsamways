type Row = { check: string; command: string };

// Modeled on the reference page's numbered troubleshooting table
// (symptom -> ordered checks -> command). Colors ride the existing
// --skills-bg/--accent/--foreground tokens, so no theme-specific
// structure is needed here — just the shared token swap.
export default function ReferenceTable({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <div className="mb-6 overflow-hidden rounded-md border border-foreground/20">
      <div className="bg-skills-bg px-4 py-2 text-sm font-semibold">{title}</div>
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.check} className="border-t border-foreground/20">
              <td className="w-8 px-4 py-2 text-muted">{index + 1}</td>
              <td className="px-2 py-2">{row.check}</td>
              <td className="whitespace-nowrap px-4 py-2 font-mono text-accent">
                {row.command}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
