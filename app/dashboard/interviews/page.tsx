import { auth } from "@/auth";
import AdminInterview from "@/components/interviews/AdminInterview";
import ClientInterview from "@/components/interviews/ClientInterview";
import ConsultantInterview from "@/components/interviews/ConsultantInterview";
import { Roles } from "@/constants/roles";
import { IUser } from "@/types/common-auth";
import { redirect } from "next/navigation";

export default async function InterviewPage() {
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
      return <AdminInterview />;
    case Roles.CONSULTANT:
      return <ConsultantInterview />;
    case Roles.CLIENT:
      return <ClientInterview />;
    default:
      return <div>Unauthorized access</div>;
  }
}
