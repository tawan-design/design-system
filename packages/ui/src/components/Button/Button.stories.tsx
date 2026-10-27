import type { Meta, StoryObj } from "@storybook/react";
import { Icon } from "../Icon/Icon";
import { Button } from "./Button";

const FIGMA = "https://www.figma.com/design/uNA3UaYp45IFe6bAe9JjK6/TAWAN-DESIGN-SYSTEM?node-id=39-111";
const variants = ["filled", "tonal", "outline", "ghost"] as const;
const tones = ["brand", "danger", "neutral"] as const;
const sizes = ["small", "medium", "large"] as const;

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Button" },
  argTypes: {
    variant: { control: "select", options: variants },
    tone: { control: "inline-radio", options: tones },
    size: { control: "inline-radio", options: sizes },
    leftIcon: { control: false },
    rightIcon: { control: false },
  },
  parameters: {
    design: { type: "figma", url: FIGMA },
    chromatic: { modes: { light: { theme: "light" }, dark: { theme: "dark" } } },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const WithIcons: Story = {
  args: { leftIcon: <Icon name="add-plus" />, rightIcon: <Icon name="arrow-right-lg" /> },
};

/** Every Figma Variant × Tone, in the three sizes. */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-24">
      {sizes.map((size) => (
        <div key={size} className="flex flex-col gap-12">
          <span className="text-label-sm text-content-tertiary">{size}</span>
          {tones.map((tone) => (
            <div key={tone} className="flex flex-wrap items-center gap-12">
              {variants.map((variant) => (
                <Button key={variant} variant={variant} tone={tone} size={size} leftIcon={<Icon name="add-plus" />} rightIcon={<Icon name="arrow-right-lg" />}>
                  {variant} {tone}
                </Button>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** Figma State = Disabled. */
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-12">
      {tones.map((tone) => (
        <div key={tone} className="flex flex-wrap items-center gap-12">
          {variants.map((variant) => (
            <Button key={variant} variant={variant} tone={tone} size="medium" disabled leftIcon={<Icon name="add-plus" />}>
              {variant} {tone}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

/**
 * Figma State = Focus: the 2px focus ring outside the button.
 * This story shows the ring statically for review; in the app it appears only on keyboard focus (focus-visible).
 */
export const Focus: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-16 p-8">
      {variants.map((variant) => (
        <Button key={variant} variant={variant} size="medium" className="focus-ring">
          {variant}
        </Button>
      ))}
    </div>
  ),
};
