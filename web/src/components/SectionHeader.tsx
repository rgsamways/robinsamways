export default function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-4 mt-10 flex items-center gap-3">
      <h2 className="whitespace-nowrap text-sm font-bold tracking-wide">
        <span className="text-accent">##</span> {title}
      </h2>
      <hr className="flex-1 border-t border-accent" />
    </div>
  );
}
