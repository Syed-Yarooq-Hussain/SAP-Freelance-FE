import Sidebar from "@/components/Sidebar";
import { SessionProvider } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <Sidebar>{children}</Sidebar>
    </SessionProvider>
  );
}
