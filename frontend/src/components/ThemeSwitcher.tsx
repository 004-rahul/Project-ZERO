import { THEMES } from "@/themes/registry";
import { useTheme } from "@/app/providers/ThemeProvider";
import { cn } from "@/lib/cn";

/**
 * Temporary. Exists only so the three candidates can be compared against real
 * content before one is chosen. Delete it once the decision is made.
 */
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2">
      <div
        className="flex items-center gap-1 rounded-full border border-line-subtle bg-surface/85 p-1 backdrop-blur-xl"
        style={{ boxShadow: "var(--shadow-md)" }}
      >
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            title={t.character}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-150",
              theme === t.id
                ? "bg-accent text-text-on-accent"
                : "text-text-muted hover:text-text",
            )}
          >
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );
}
