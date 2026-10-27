import type { Meta, StoryObj } from "@storybook/react";
import data from "./icons.json";
import { Icon, iconNames } from "./Icon";

const meta: Meta<typeof Icon> = {
  title: "Components/Icon",
  component: Icon,
  tags: ["autodocs"],
  args: { name: "add-plus", size: "lg" },
  argTypes: {
    name: { control: "select", options: iconNames },
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg"] },
  },
  parameters: {
    design: { type: "figma", url: "https://www.figma.com/design/uNA3UaYp45IFe6bAe9JjK6/TAWAN-DESIGN-SYSTEM?node-id=59-50" },
    chromatic: { modes: { light: { theme: "light" }, dark: { theme: "dark" } } },
  },
};
export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {};

/** Every icon in code, with its code name and Figma name. More are exported from Figma on demand. */
export const Gallery: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
      {iconNames.map((name) => (
        <div key={name} className="flex items-center gap-12 rounded-md p-8 text-icon-primary inset-ring inset-ring-border-subtle">
          <Icon name={name} size="lg" />
          <div className="flex min-w-0 flex-col">
            <code className="truncate text-code-sm font-mono text-content-primary">{name}</code>
            <span className="truncate text-body-sm text-content-tertiary">{data.icons[name].figma}</span>
          </div>
        </div>
      ))}
    </div>
  ),
};

/** Icons take the color of their text: here content-brand, content-danger, icon-secondary. */
export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-16">
      <Icon name="circle-check" size="lg" className="text-content-brand" />
      <Icon name="triangle-warning" size="lg" className="text-content-danger" />
      <Icon name="info" size="lg" className="text-icon-secondary" />
    </div>
  ),
};
