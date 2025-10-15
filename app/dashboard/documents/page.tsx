import { auth } from "@/auth";
import ClientDocument from "@/components/documents/ClientDocument";
import ConsultantDocument from "@/components/documents/ConsultantDocument";
import { Roles } from "@/constants/roles";
import { IUser } from "@/types/common-auth";
import { redirect } from "next/navigation";

export default async function DocumentPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const user = session.user as IUser;
  console.log("Session:", session);

  const role = user.role;
  console.log("Role:", user.role);

  switch (role) {
    case Roles.CONSULTANT:
      return <ConsultantDocument />;
    case Roles.CLIENT:
      return <ClientDocument />;
    default:
      return <div>Unauthorized access</div>;
  }
}
