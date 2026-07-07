type Row = { type: string; name: string; value: string };

export default function DnsTable({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="border-b border-foreground/20 text-left text-muted">
            <th className="py-1 pr-4 font-semibold">Type</th>
            <th className="py-1 pr-4 font-semibold">Name</th>
            <th className="py-1 font-semibold">Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.type}-${row.name}`} className="border-b border-foreground/10">
              <td className="py-1 pr-4">{row.type}</td>
              <td className="py-1 pr-4">{row.name}</td>
              <td className="py-1">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
