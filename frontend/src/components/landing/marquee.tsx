/**
 * Infinite logo/name marquee (Design Bible §19.4). Content is duplicated so
 * the CSS translateX(-50%) loop is seamless; masked edges fade it in and out.
 */

const ITEMS = [
  ["⇄", "GitHub"],
  ["⇄", "Slack"],
  ["⇄", "Google Drive"],
  ["⇄", "Notion"],
  ["◉", "OpenAI"],
  ["◉", "Anthropic"],
  ["◉", "Azure"],
  ["◉", "Local models"],
  ["▦", "Audit trail"],
  ["▦", "Tenant isolation"],
] as const;

export function Marquee() {
  const row = (ariaHidden: boolean) => (
    <div aria-hidden={ariaHidden} className="flex shrink-0 gap-14 pr-14">
      {ITEMS.map(([icon, name]) => (
        <span
          key={name}
          className="whitespace-nowrap text-sm font-bold uppercase tracking-[.14em] text-on-dark-muted/60"
        >
          <span className="mr-2.5 text-aurora-bright">{icon}</span>
          {name}
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden border-y border-white/[.07] py-6 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
