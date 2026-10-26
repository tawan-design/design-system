// The Foundations blocks as stories, so Chromatic snapshots them (it doesn't snapshot MDX docs pages)
// and designers can review token changes visually, in Light and Dark.
import type { Meta, StoryObj } from "@storybook/react";
import { PrimitiveRamps, SemanticColors, TypeRoles, Spacing, Sizes, Radius, SimpleScale } from "./TokenBlocks";

const meta: Meta = {
  title: "Foundations/Review",
  parameters: {
    layout: "padded",
    chromatic: { modes: { light: { theme: "light" }, dark: { theme: "dark" } } },
  },
  decorators: [(Story) => <div className="bg-surface-canvas p-16 text-content-primary"><Story /></div>],
};
export default meta;
type Story = StoryObj;

export const SemanticColorsStory: Story = { name: "Semantic colors", render: () => <SemanticColors /> };
export const PrimitivePalette: Story = { name: "Primitive palette", render: () => <PrimitiveRamps /> };
export const Typography: Story = { render: () => <TypeRoles /> };
export const SpacingStory: Story = { name: "Spacing", render: () => <Spacing /> };
export const SizesStory: Story = { name: "Sizes", render: () => <Sizes /> };
export const RadiusStory: Story = { name: "Radius", render: () => <Radius /> };
export const BorderOpacityElevation: Story = {
  name: "Border, opacity, elevation",
  render: () => (
    <div className="flex flex-col gap-24">
      <SimpleScale group="border" utility={(c) => c} />
      <SimpleScale group="opacity" utility={(c) => c} />
      <SimpleScale group="elevation" />
    </div>
  ),
};
