export default function DashboardPage(): JSX.Element {
  return (
    <section className="rounded-lg border border-border bg-card p-6 text-card-foreground">
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="text-sm text-muted-foreground">
        Use the sidebar to manage packages, orders, and reviews.
      </p>
    </section>
  );
}
