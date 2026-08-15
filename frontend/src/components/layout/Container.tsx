import { cn } from "@/lib/cn";

/**
 * Page measure. Wide, with generous viewport-relative gutters — a fixed
 * narrow column centred in a large viewport is what makes a page read as a
 * template.
 */
export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[86rem] px-[5vw] md:px-[4vw]", className)}>
      {children}
    </div>
  );
}
