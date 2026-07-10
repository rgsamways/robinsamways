export default function SectionHeader({
  id,
  title,
}: {
  id?: string;
  title: string;
}) {
  return (
    <div id={id} className="mb-4 mt-10 flex items-center gap-3 scroll-mt-4">
      <h2 className="whitespace-nowrap text-sm font-bold tracking-wide">
        <span className="text-accent">##</span> {title}
      </h2>
      <hr className="flex-1 border-t border-accent" />
    </div>
  );
}
