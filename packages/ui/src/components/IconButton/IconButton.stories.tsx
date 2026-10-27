import type { Meta, StoryObj } from "@storybook/react";
import { Icon } from "../Icon/Icon";
import { IconButton } from "./IconButton";

const FIGMA = "https://www.figma.com/design/uNA3UaYp45IFe6bAe9JjK6/TAWAN-DESIGN-SYSTEM?node-id=54559-1372";
const variants = ["filled", "tonal", "outline", "ghost"] as const;
const tones = ["brand", "danger", "neutral"] as const;
const sizes = ["xs", "small", "medium", "large"] as const;

const meta: Meta<typeof IconButton> = {
  title: "Components/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  args: { icon: <Icon name="add-plus" />, "aria-label": "Add" },
  argTypes: {
    icon: { control: false },
    shape: { control: "inline-radio", options: ["square", "circle"] },
    variant: { control: "select", options: variants },
    tone: { control: "inline-radio", options: tones },
    size: { control: "inline-radio", options: sizes },
  },
  parameters: {
    design: { type: "figma", url: FIGMA },
    chromatic: { modes: { light: { theme: "light" }, dark: { theme: "dark" } } },
  },
};
export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {};

/** Every Figma Variant × Tone × Size, both shapes. */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-24">
      {(["square", "circle"] as const).map((shape) => (
        <div key={shape} className="flex flex-col gap-12">
          <span className="text-label-sm text-content-tertiary">{shape}</span>
          {tones.map((tone) => (
            <div key={tone} className="flex flex-wrap items-center gap-16">
              {variants.map((variant) => (
                <div key={variant} className="flex items-center gap-8">
                  {sizes.map((size) => (
                    <IconButton key={size} shape={shape} variant={variant} tone={tone} size={size} icon={<Icon name="add-plus" />} aria-label={`Add (${variant} ${tone} ${size})`} />
                  ))}
                </div>
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
    <div className="flex flex-wrap items-center gap-12">
      {tones.flatMap((tone) =>
        variants.map((variant) => (
          <IconButton key={`${variant}-${tone}`} variant={variant} tone={tone} size="medium" disabled icon={<Icon name="add-plus" />} aria-label="Add" />
        )),
      )}
    </div>
  ),
};

/**
 * Figma State = Focus: the same 2px outside ring as Button.
 * This story shows the ring statically for review; in the app it appears only on keyboard focus (focus-visible).
 */
export const Focus: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-16 p-8">
      {variants.map((variant) =>
        (["square", "circle"] as const).map((shape) => (
          <IconButton key={`${variant}-${shape}`} variant={variant} shape={shape} size="medium" className="focus-ring" icon={<Icon name="add-plus" />} aria-label="Add" />
        )),
      )}
    </div>
  ),
};
