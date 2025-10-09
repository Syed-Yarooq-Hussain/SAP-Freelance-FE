import { auth } from "@/auth";
import AdminProject from "@/components/projects/AdminProject";
import ClientProject from "@/components/projects/ClientProject";
import ConsultantProject from "@/components/projects/ConsultantProject";
import { Roles } from "@/constants/roles";
import { IUser } from "@/types/common-auth";
import { redirect } from "next/navigation";

export default async function ProjectPage() {
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
      return <AdminProject />;
    case Roles.CONSULTANT:
      return <ConsultantProject />;
    case Roles.CLIENT:
      return <ClientProject />;
    default:
      return <div>Unauthorized access</div>;
  }
}
