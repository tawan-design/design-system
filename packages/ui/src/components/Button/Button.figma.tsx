// Code Connect: shows this real code snippet in Figma Dev Mode when an engineer
// inspects the Button component. Replace the URL with your Figma component node.
// Publish with: npx figma connect publish
import figma from "@figma/code-connect";
import { Button } from "./Button";

figma.connect(Button, "https://www.figma.com/design/FILE_KEY/Design-System?node-id=1-2", {
  props: {
    variant: figma.enum("Variant", {
      Primary: "primary",
      Secondary: "secondary",
      Ghost: "ghost",
      Danger: "danger",
    }),
    size: figma.enum("Size", { Small: "sm", Medium: "md", Large: "lg" }),
    label: figma.string("Label"),
    disabled: figma.enum("State", { Disabled: true }),
  },
  example: ({ variant, size, label, disabled }) => (
    <Button variant={variant} size={size} disabled={disabled}>
      {label}
    </Button>
  ),
});
