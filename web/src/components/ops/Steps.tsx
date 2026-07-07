export default function Steps({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-1.5 text-sm">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span aria-hidden>›</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
