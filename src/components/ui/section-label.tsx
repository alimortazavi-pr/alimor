import { cn } from "@/lib/cn";

export function SectionLabel({
  index,
  children,
  className,
}: {
  index: string;
  children: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-muted flex items-center gap-3 font-mono text-xs tracking-[0.2em] uppercase",
        className,
      )}
    >
      <span className="text-accent">{index}</span>
      <span className="bg-line h-px w-10" aria-hidden />
      {children}
    </p>
  );
}
