import { useEffect, useState } from "react";
import { Button } from "@tawan-design/ui";

// The simulated product. Screens are rebuilt from wireframes with Recipe L
// (Playbook → Build the system), using only @tawan-design/ui components and token classes.
export function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => document.documentElement.setAttribute("data-theme", theme), [theme]);

  return (
    <div className="min-h-screen bg-surface-canvas">
      <nav className="flex items-center justify-between border-b border-border-default bg-surface-primary px-24 py-12">
        <span className="text-label-lg text-content-primary">Playground · simulated product</span>
        <Button variant="outline" tone="neutral" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          {theme === "light" ? "Dark" : "Light"} mode
        </Button>
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
