import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardBody, CardHeader } from "./Card";
import { Badge } from "../Badge/Badge";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card style={{ maxWidth: 400 }}>
      <CardHeader title="Monthly spending" description="Oct 1 – Oct 25" action={<Badge tone="success">+4.2%</Badge>} />
      <CardBody>
        <p className="text-32 font-semibold text-fg">$2,480.00</p>
      </CardBody>
    </Card>
  ),
};
