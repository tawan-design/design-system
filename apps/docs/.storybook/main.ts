import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",                                    // Introduction + Foundations
    "../src/**/*.stories.@(ts|tsx)",                      // Simulated product pages
    "../../../packages/ui/src/**/*.stories.@(ts|tsx)",    // Component stories live next to components
  ],
  addons: [
    "@storybook/addon-essentials", // controls, docs, viewport, backgrounds
    "@storybook/addon-a11y",       // accessibility checks per story
    "@storybook/addon-designs",    // embeds the Figma frame next to the story
  ],
  framework: { name: "@storybook/react-vite", options: {} },
  // Same Tailwind plugin as the product apps → identical CSS output, no "missing styles"
  viteFinal: async (cfg) => {
    cfg.plugins = [...(cfg.plugins ?? []), tailwindcss()];
    return cfg;
  },
};
export default config;
