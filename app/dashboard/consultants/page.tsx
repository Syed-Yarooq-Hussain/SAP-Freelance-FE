import { auth } from "@/auth";
import ClientConsultant from "@/components/consultants/ClientConsultant";
import { Roles } from "@/constants/roles";
import { IUser } from "@/types/common-auth";
import { redirect } from "next/navigation";

export default async function ConsultantPage() {
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
    //   return <AdminPayment />;
    // case Roles.CONSULTANT:
    //   return <ConsultantPayment />;
    case Roles.CLIENT:
      return <ClientConsultant />;
    default:
      return <div>Unauthorized access</div>;
  }
}
