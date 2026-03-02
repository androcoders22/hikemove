import { PageHeader } from "@/components/page-header";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader
        title="Admin Dashboard"
        breadcrumbs={[{ title: "Admin", href: "#" }, { title: "Dashboard" }]}
      />
      <div className="flex-1 px-6 py-4 space-y-4">
        <h2 className="text-xl font-black uppercase tracking-tight text-foreground">
          Welcome to the Admin Dashboard
        </h2>
        <p className="text-sm text-muted-foreground">
          System Overview and Statistics will go here.
        </p>
      </div>
    </div>
  );
}
