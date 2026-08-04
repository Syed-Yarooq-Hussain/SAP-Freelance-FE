import Image from "next/image";
import { Linkedin } from "lucide-react";

interface FooterProps {
  onNavigate: (page: "landing" | "consultants" | "contact") => void;
}

const linkedInUrl = "https://www.linkedin.com/company/the-consultcrew/";

export function Footer(_props: FooterProps) {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-800">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-3">
              <Image
                src="/images/logo-footer.png"
                alt="Vertex9 Systems"
                width={120}
                height={44}
                className="h-10 w-auto"
                priority
              />
            </div>
            <p className="text-sm leading-6 text-slate-600">
              Premium marketplace for pre-vetted consultants. Build teams in
              days, not months. Transform your projects with elite talent.
            </p>
          </div>

          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700 sm:self-auto"
          >
            <Linkedin className="h-4 w-4" />
            Follow on LinkedIn
          </a>
        </div>

        <div className="mt-7 border-t border-slate-200 pt-5">
          <p className="text-xs text-slate-500">
            © 2026 The Consultant Crew Talent Network. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
