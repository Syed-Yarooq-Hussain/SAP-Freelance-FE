import { auth } from "@/auth";
import ConsultantProjectDetails from "@/components/projects/ConsultantProjectDetails";
import { Roles } from "@/constants/roles";
import { IUser } from "@/types/common-auth";
import { redirect } from "next/navigation";

export default async function ProjectDetailsPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const user = session.user as IUser;
  console.log("Session:", session);

  const role = user.role;
  console.log("Role:", user.role);

  switch (role) {
    // case Roles.ADMIN:
    //   return <AdminProject />;
    case Roles.CONSULTANT:
      return <ConsultantProjectDetails />;
    // case Roles.CLIENT:
    //   return <ClientProject />;
    default:
      return <div>Unauthorized access</div>;
  }
}
