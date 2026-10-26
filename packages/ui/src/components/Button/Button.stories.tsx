import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Continue" },
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "ghost", "danger"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
  parameters: {
    // Link to the Figma source so reviewers can compare side by side
    design: { type: "figma", url: "https://www.figma.com/design/FILE_KEY/Design-System?node-id=1-2" },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: "secondary" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Danger: Story = { args: { variant: "danger", children: "Delete account" } };
export const Disabled: Story = { args: { disabled: true } };

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-16">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex items-center gap-12">
          <Button size={size}>Primary</Button>
          <Button size={size} variant="secondary">Secondary</Button>
          <Button size={size} variant="ghost">Ghost</Button>
          <Button size={size} variant="danger">Danger</Button>
        </div>
      ))}
    </div>
  ),
};
