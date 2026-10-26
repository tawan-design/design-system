import type { Meta, StoryObj } from "@storybook/react";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "./Dialog";
import { Button } from "../Button/Button";

const meta: Meta<typeof Dialog> = {
  title: "Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Dialog>;

export const ConfirmTransfer: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Send money</Button>
      </DialogTrigger>
      <DialogContent
        title="Confirm transfer"
        description="You're sending $250.00 to Minh Anh. This can't be undone."
        footer={
          <>
            <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
            <DialogClose asChild><Button>Confirm</Button></DialogClose>
          </>
        }
      />
    </Dialog>
  ),
};
