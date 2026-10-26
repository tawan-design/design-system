// Simulated product screen. Rule: built ONLY from @tawan-design/ui + token classes.
// If something is missing here, that's a signal to add a component — not to hand-roll one.
import { Badge, Button, Card, CardBody, CardHeader } from "@tawan-design/ui";

const transactions = [
  { id: 1, name: "Grab Food", date: "Oct 24", amount: "-$12.40", status: "success" as const },
  { id: 2, name: "Salary — Boole Digital", date: "Oct 23", amount: "+$3,200.00", status: "success" as const },
  { id: 3, name: "Transfer to Minh Anh", date: "Oct 22", amount: "-$250.00", status: "brand" as const },
  { id: 4, name: "Netflix", date: "Oct 20", amount: "-$9.99", status: "danger" as const },
];
const statusLabel = { success: "Completed", brand: "Pending", danger: "Failed" };

export function Dashboard({ onSend }: { onSend?: () => void }) {
  return (
    <div className="mx-auto flex max-w-[960px] flex-col gap-24 p-24">
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-4">
          <p className="text-14 text-fg-muted">Good morning, Tawan</p>
          <h1 className="text-24 font-semibold text-fg">Overview</h1>
        </div>
        <Button onClick={onSend}>Send money</Button>
      </header>

      <div className="grid gap-16 md:grid-cols-3">
        <Card>
          <CardHeader title="Balance" description="All accounts" />
          <CardBody><p className="text-32 font-semibold text-fg">$12,480.20</p></CardBody>
        </Card>
        <Card>
          <CardHeader title="Spent this month" action={<Badge tone="danger">+8%</Badge>} />
          <CardBody><p className="text-32 font-semibold text-fg">$2,480.00</p></CardBody>
        </Card>
        <Card>
          <CardHeader title="Saved" action={<Badge tone="success">+4.2%</Badge>} />
          <CardBody><p className="text-32 font-semibold text-fg">$940.00</p></CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Recent transactions" action={<Button variant="ghost" size="sm">View all</Button>} />
        <CardBody className="flex flex-col">
          {transactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between border-b border-border py-12 last:border-b-0">
              <div className="flex flex-col gap-2">
                <span className="text-14 font-medium text-fg">{t.name}</span>
                <span className="text-12 text-fg-muted">{t.date}</span>
              </div>
              <div className="flex items-center gap-12">
                <Badge tone={t.status}>{statusLabel[t.status]}</Badge>
                <span className="w-[96px] text-right text-14 font-medium text-fg">{t.amount}</span>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
