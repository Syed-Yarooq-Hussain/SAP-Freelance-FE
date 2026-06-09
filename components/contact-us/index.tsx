"use client";

import React from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  CheckCircle,
} from "lucide-react";
import {
  contactFormSchema,
  type ContactFormData,
  SUBJECT_MAX,
  MESSAGE_MIN,
  MESSAGE_MAX,
} from "@/lib/schemas/contact";
import { countries } from "@/constants/constants";

export default function ContactUsPage({
  onNavigate,
}: {
  onNavigate: (page: "landing" | "consultants" | "contact") => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: yupResolver(contactFormSchema) as never,
    defaultValues: {
      subject: "",
      email: "",
      phoneCountry: "+1",
      phone: "",
      message: "",
    },
  });

  const subjectValue = watch("subject");
  const messageValue = watch("message");

  const onSubmit = (data: ContactFormData) => {
    // Form submission logic can be added here
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      {/* Banner */}
      <section
        className="pt-16 pb-24 px-4 text-center text-white"
        style={{
          background: "linear-gradient(180deg, #1E3A8A 0%, #3B5998 50%, #4F6FB5 100%)",
        }}
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/80 bg-white/10 backdrop-blur-sm mb-6"
        >
          <MessageSquare className="w-4 h-4 opacity-90" />
          <span className="text-sm font-medium">We&apos;re Here to Help</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Contact Us</h1>
        <p className="text-xl md:text-2xl text-white/95 mb-4 mt-2">
          Get in Touch with Our Team
        </p>
        <p className="max-w-2xl mx-auto text-white/90 text-sm md:text-base">
          Have questions about our talent network? We&apos;re here to help
          you build exceptional teams.
        </p>
      </section>

      {/* White card */}
      <div className="max-w-6xl mx-auto px-4 -mt-16 pb-16">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 p-8 lg:p-12">
            {/* Left: Image & info */}
            <div className="space-y-6 flex flex-col items-center justify-center">
              <div className="relative flex-1 rounded-xl overflow-hidden aspect-[4/3] max-h-[320px]">
                <Image
                  src="/images/contact-us.png"
                  alt="Contact us"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Need Assistance? We&apos;re Just One Message Away!
                </h2>
                <p className="text-gray-500 text-sm">
                  Send us your queries, and we&apos;ll respond promptly with the
                  support you need.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full w-fit bg-emerald-100 bg-opacity-70 border border-emerald-500 text-emerald-700 text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  Average response time: 2-4 hours
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-200 bg-opacity-60 rounded-lg">
                      <Mail className="w-5 h-5 text-[#60A5FA]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Email Us</p>
                      <p className="text-sm text-gray-500">
                        contact@vertex9.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-200 bg-opacity-60 rounded-lg">
                    <Phone className="w-5 h-5 text-[#4ADE80]" />
                  </div>

                    <div>
                      <p className="text-sm font-medium text-gray-400">Call Us</p>
                      <p className="text-sm text-gray-500">
                        +1 (555) 123-4567
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Feel free to reach out to us!
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Fill out the form below and we&apos;ll get back to you as soon
                as possible.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Message Subject"
                    maxLength={SUBJECT_MAX}
                    className={`w-full px-4 py-3 bg-[#F9FAFB] border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 ${
                      errors.subject ? "border-red-500" : "border-gray-200"
                    }`}
                    {...register("subject")}
                  />
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-gray-400">
                      {(subjectValue?.length ?? 0)}/{SUBJECT_MAX}
                    </span>
                  </div>
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter Your Email Address"
                    className={`w-full px-4 py-3 bg-[#F9FAFB] border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 ${
                      errors.email ? "border-red-500" : "border-gray-200"
                    }`}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`flex rounded-lg overflow-hidden border bg-[#F9FAFB]  focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-400 ${
                      errors.phone ? "border-red-500" : "border-gray-200"
                    }`}
                  >
                    <Controller
                      name="phoneCountry"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="px-3 py-3 w- bg-[#F9FAFB]  text-gray-700 border-r border-gray-200 focus:outline-none"
                        >
                          {
                            countries.map((country) => (
                              <option key={country.isoCode} value={country.phonePrefix}>{country.flag} {country.phonePrefix}</option>
                            ))
                          }
                        </select>
                      )}
                    />
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel-national"
                          placeholder="Enter your phone number"
                          className="flex-1 px-4 py-3 bg-[#F9FAFB] text-gray-800 placeholder-gray-400 focus:outline-none min-w-0"
                          {...field}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "");
                            field.onChange(digits);
                          }}
                        />
                      )}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder={`What Would You Like Us To Know? (Min ${MESSAGE_MIN} characters)`}
                    maxLength={MESSAGE_MAX}
                    rows={4}
                    className={`w-full px-4 py-3 bg-gray-100 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 resize-none ${
                      errors.message ? "border-red-500" : "border-gray-200"
                    }`}
                    {...register("message")}
                  />
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-gray-400">
                      {(messageValue?.length ?? 0)}/{MESSAGE_MAX}
                    </span>
                  </div>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium transition-colors"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50/50">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm text-gray-500">
                    All fields are mandatory. We typically respond within 24
                    hours during business days.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
