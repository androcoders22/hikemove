import { PageHeader } from "@/components/page-header";

export default function AdminTestPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader
        title="Admin Test Page"
        breadcrumbs={[{ title: "App", href: "#" }, { title: "Admin Test" }]}
      />
      <div className="flex-1 px-6 py-4 space-y-4">
        <h2 className="text-xl font-black uppercase tracking-tight text-foreground">
          Welcome to the Admin Area
        </h2>
        <p className="text-sm text-muted-foreground">
          This is a restricted test page visible and accessible only to
          administrators.
        </p>
      </div>
    </div>
  );
}
