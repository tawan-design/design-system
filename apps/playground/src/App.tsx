import { useEffect, useState } from "react";
import { Button } from "@tawan-design/ui";
import { Dashboard } from "./screens/Dashboard";
import { SendMoney } from "./screens/SendMoney";

export function App() {
  const [screen, setScreen] = useState<"dashboard" | "send">("dashboard");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => document.documentElement.setAttribute("data-theme", theme), [theme]);

  return (
    <div className="min-h-screen bg-subtle">
      <nav className="flex items-center justify-between border-b border-border bg-surface px-24 py-12">
        <span className="text-14 font-semibold text-fg">Playground · simulated product</span>
        <Button variant="secondary" size="sm" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          {theme === "light" ? "Dark" : "Light"} mode
        </Button>
      </nav>
      {screen === "dashboard" ? (
        <Dashboard onSend={() => setScreen("send")} />
      ) : (
        <SendMoney onBack={() => setScreen("dashboard")} />
      )}
    </div>
  );
}
