// Code Connect: shows this real code snippet in Figma Dev Mode when an engineer
// inspects the Icon Button component. Publish with: npx figma connect publish
import figma from "@figma/code-connect";
import { IconButton } from "./IconButton";

figma.connect(IconButton, "https://www.figma.com/design/uNA3UaYp45IFe6bAe9JjK6/TAWAN-DESIGN-SYSTEM?node-id=54559-1372", {
  props: {
    icon: figma.instance("Icon"),
    shape: figma.enum("Shape", { Square: "square", Circle: "circle" }),
    variant: figma.enum("Variant", { Filled: "filled", Tonal: "tonal", Outline: "outline", Ghost: "ghost" }),
    tone: figma.enum("Tone", { Brand: "brand", Danger: "danger", Neutral: "neutral" }),
    size: figma.enum("Size", { XS: "xs", Small: "small", Medium: "medium", Large: "large" }),
    disabled: figma.enum("State", { Disabled: true }),
  },
  example: ({ icon, shape, variant, tone, size, disabled }) => (
    <IconButton icon={icon} aria-label="Describe the action" shape={shape} variant={variant} tone={tone} size={size} disabled={disabled} />
  ),
});
