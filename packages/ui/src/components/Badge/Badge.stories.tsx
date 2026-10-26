import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: { children: "Pending" },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Neutral: Story = {};
export const AllTones: Story = {
  render: () => (
    <div className="flex gap-8">
      <Badge>Pending</Badge>
      <Badge tone="brand">New</Badge>
      <Badge tone="success">Completed</Badge>
      <Badge tone="danger">Failed</Badge>
    </div>
  ),
};
