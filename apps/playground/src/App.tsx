import { useEffect, useState } from "react";

// The simulated product. Screens are rebuilt from wireframes with Recipe L
// (Playbook → Build the system), using only @tawan-design/ui components and token classes.
export function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => document.documentElement.setAttribute("data-theme", theme), [theme]);

  return (
    <div className="min-h-screen bg-surface-canvas">
      <nav className="flex items-center justify-between border-b border-border-default bg-surface-primary px-24 py-12">
        <span className="text-label-lg text-content-primary">Playground · simulated product</span>
        {/* DS-GAP: replace with the Button component once it's rebuilt from Figma */}
        <button
          type="button"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="text-label-md text-content-link"
        >
          {theme === "light" ? "Dark" : "Light"} mode
        </button>
      </nav>
      <main className="flex flex-col gap-8 p-24">
        <h1 className="text-heading-md text-content-primary">No screens yet</h1>
        <p className="text-body-md text-content-secondary">
          Screens are rebuilt from wireframes once the core components exist.
        </p>
      </main>
    </div>
  );
}
