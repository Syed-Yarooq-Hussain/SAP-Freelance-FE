import { redirect } from "next/navigation";
import { Roles } from "@/constants/roles";
import { auth } from "@/auth";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import ConsultantDashboard from "@/components/dashboard/ConsultantDashboard";
import ClientDashboard from "@/components/dashboard/ClientDashboard";
import { IUser } from "@/types/common-auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const user = session.user as IUser;
console.log("Session:", session);

  const role = user.role;
  console.log("Role:", user.role);


  switch (role) {
    case Roles.ADMIN:
      return <AdminDashboard />;
    case Roles.CONSULTANT:
      return <ConsultantDashboard />;
    case Roles.CLIENT:
      return <ClientDashboard />;
    default:
      return <div>Unauthorized access</div>;
  }
}
