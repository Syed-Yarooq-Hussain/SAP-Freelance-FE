import { auth } from "@/auth";
import AdminPayment from "@/components/payments/AdminPayment";
import ClientPayment from "@/components/payments/ClientPayment";
import ConsultantPayment from "@/components/payments/ConsultantPayment";
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
      return <AdminPayment />;
    case Roles.CONSULTANT:
      return <ConsultantPayment />;
    case Roles.CLIENT:
      return <ClientPayment />;
    default:
      return <div>Unauthorized access</div>;
  }
}
