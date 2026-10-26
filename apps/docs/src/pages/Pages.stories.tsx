// "Pages" = the simulated product, rendered inside Storybook so designers,
// PMs and engineers review full flows built from real components.
import type { Meta, StoryObj } from "@storybook/react";
import { Dashboard } from "playground/screens/Dashboard";
import { SendMoney } from "playground/screens/SendMoney";

const meta: Meta = {
  title: "Pages/Fintech app",
  parameters: { layout: "fullscreen" },
  decorators: [(Story) => <div className="min-h-screen bg-subtle"><Story /></div>],
};
export default meta;

export const DashboardPage: StoryObj = { name: "Dashboard", render: () => <Dashboard /> };
export const SendMoneyPage: StoryObj = { name: "Send money", render: () => <SendMoney /> };
