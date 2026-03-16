import { Video, Calendar, ArrowRight } from "lucide-react"

export default function HireSap({ onSignUpClick }: { onSignUpClick: () => void }) {
  return (
    <section id="book-demo" className="py-20 md:py-28 bg-gradient-to-b from-white to-cyan-50/50 scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center max-w-full md:max-w-[90%] mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-brand-blue/30 bg-white mb-8 transition-all duration-300 ease-out hover:scale-105 active:scale-95 cursor-pointer">
            <Video className="w-5 h-5 text-brand-blue" />
            <span className="text-brand-blue font-medium">Book a Demo</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight text-balance">
            Hire SAP consultants or join as a verified expert.
          </h2>

          {/* Subtitle */}
          <p className="text-muted-foreground text-2xl mb-8 max-w-2xl">
            Our platform connects businesses with vetted SAP professionals worldwide.
          </p>

          {/* CTA Text */}
          <p className="text-brand-blue font-semibold text-lg mb-6">
            Book a demo to explore the SAP Freelance Portal
          </p>

          {/* Button */}
          <button onClick={onSignUpClick} className="inline-flex items-center justify-center gap-3 px-8 py-4 btn-gradient-blue text-white font-semibold rounded-xl shadow-lg shadow-brand-blue/25 transition-all duration-300 ease-out hover:shadow-xl hover:shadow-brand-blue/30 hover:scale-105 active:scale-95 text-lg">
            <Calendar className="w-5 h-5" />
            <span>Schedule Now!</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
