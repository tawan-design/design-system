import { useState } from "react";
import { Button, Card, CardBody, CardHeader, Dialog, DialogClose, DialogContent, Input } from "@tawan-design/ui";

export function SendMoney({ onBack }: { onBack?: () => void }) {
  const [amount, setAmount] = useState("");
  const [open, setOpen] = useState(false);
  const invalid = amount !== "" && !(Number(amount) > 0);

  return (
    <div className="mx-auto flex max-w-[480px] flex-col gap-24 p-24">
      <Button variant="ghost" size="sm" className="self-start" onClick={onBack}>← Back</Button>
      <Card>
        <CardHeader title="Send money" description="Transfers arrive instantly." />
        <CardBody className="flex flex-col gap-16">
          <Input label="Recipient" placeholder="Name, phone or email" defaultValue="Minh Anh" />
          <Input
            label="Amount (USD)"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={invalid ? "Enter an amount greater than 0" : undefined}
            hint="No fees for transfers under $1,000"
          />
          <Button fullWidth size="lg" disabled={!amount || invalid} onClick={() => setOpen(true)}>
            Review transfer
          </Button>
        </CardBody>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          title="Confirm transfer"
          description={`You're sending $${amount || "0"} to Minh Anh. This can't be undone.`}
          footer={
            <>
              <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
              <DialogClose asChild><Button>Confirm</Button></DialogClose>
            </>
          }
        />
      </Dialog>
    </div>
  );
}
