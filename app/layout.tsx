import SidebarLayout from "@/components/sidebar-layout";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <body>
        {/* <head>
          <script src="https://tweakcn.com/live-preview.min.js"></script>
        </head> */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <SidebarLayout>{children}</SidebarLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
