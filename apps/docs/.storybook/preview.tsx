import type { Preview } from "@storybook/react";
import { useEffect } from "react";
// THE most common cause of "Storybook is missing my styles": forgetting this import.
// It's the exact same stylesheet the product imports.
import "./storybook.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Token mode",
      toolbar: { title: "Theme", icon: "mirror", items: ["light", "dark"], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: "light" },
  decorators: [
    (Story, ctx) => {
      const theme = ctx.globals.theme ?? "light";
      useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
      }, [theme]);
      return <Story />;
    },
  ],
  parameters: {
    layout: "padded",
    controls: { expanded: true },
    a11y: { test: "error" },
    options: {
      storySort: { order: ["Introduction", "Foundations", "Components", "Pages"] },
    },
  },
};
export default preview;
