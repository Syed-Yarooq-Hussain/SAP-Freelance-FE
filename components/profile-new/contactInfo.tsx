import { Phone } from 'lucide-react'
import { Mail } from "lucide-react";
import React from "react";

const ContactInfo = ({ email, phone }: { email?: string, phone?: string } ) => {
  return (
    <div className=" rounded-xl flex flex-col gap-2  p-3 mt-4  text-black">
      <p className="text-xs font-bod flex justify-start items-center gap-2 py-3 px-2 shadow-custom rounded-lg text-left">
        <Mail className="w-4 h-4 shrink-0" /> {email || "-"}
      </p>
      <p className="text-xs font-bod flex justify-start items-center gap-2 py-3 px-2 shadow-custom rounded-lg text-left">
        <Phone className="w-4 h-4 shrink-0" />
        {phone || "-"}
      </p>
    </div>
  );
};

export default ContactInfo;
