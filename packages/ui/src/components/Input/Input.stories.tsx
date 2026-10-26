import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  args: { label: "Email", placeholder: "you@company.com" },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};
export const WithHint: Story = { args: { hint: "We'll never share your email." } };
export const Error: Story = { args: { error: "Enter a valid email address", defaultValue: "tawan@" } };
export const Disabled: Story = { args: { disabled: true } };
