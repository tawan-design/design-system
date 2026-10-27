// Code Connect: shows this real code snippet in Figma Dev Mode when an engineer
// inspects the Button component. Publish with: npx figma connect publish
import figma from "@figma/code-connect";
import { Button } from "./Button";

figma.connect(Button, "https://www.figma.com/design/uNA3UaYp45IFe6bAe9JjK6/TAWAN-DESIGN-SYSTEM?node-id=39-111", {
  props: {
    variant: figma.enum("Variant", { Filled: "filled", Tonal: "tonal", Outline: "outline", Ghost: "ghost" }),
    tone: figma.enum("Tone", { Brand: "brand", Danger: "danger", Neutral: "neutral" }),
    size: figma.enum("Size", { Small: "small", Medium: "medium", Large: "large" }),
    disabled: figma.enum("State", { Disabled: true }),
    label: figma.string("Label"),
    leftIcon: figma.boolean("Show left icon", { true: figma.instance("Left icon"), false: undefined }),
    rightIcon: figma.boolean("Show right icon", { true: figma.instance("Right icon"), false: undefined }),
  },
  example: ({ variant, tone, size, disabled, label, leftIcon, rightIcon }) => (
    <Button variant={variant} tone={tone} size={size} disabled={disabled} leftIcon={leftIcon} rightIcon={rightIcon}>
      {label}
    </Button>
  ),
});
