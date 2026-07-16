import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Sparkles, ArrowRight } from 'lucide-react';
import Image from "next/image";

interface FooterProps {
  onNavigate: (page: 'landing' | 'consultants' | 'contact') => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-white text-slate-900 relative overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <Image
                src="/images/logo-footer.png"
                alt="Vertex9 Systems"
                width={80}
                height={40}
                className="h-11 w-auto"
                priority
              />
              <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full">
                <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
                <span className="text-xs text-white">Premium Network</span>
              </div>
            </div>
            <p className="mb-6 text-slate-600 max-w-md">
              Premium marketplace for pre-vetted consultants. Build teams in days, not months. Transform your projects with elite talent.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-3 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg transition-all transform hover:scale-110 hover:shadow-lg">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg transition-all transform hover:scale-110 hover:shadow-lg">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg transition-all transform hover:scale-110 hover:shadow-lg">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 font-semibold mb-6 flex items-center gap-2">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button onClick={() => onNavigate('landing')} className="group flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('consultants')} className="group flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Find Consultants</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="group flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Contact Us</span>
                </button>
              </li>
              <li>
                <button className="group flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>About Us</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-slate-900 font-semibold mb-6 flex items-center gap-2">
              Contact
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 group">
                <div className="p-2 bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-700 rounded-lg transition-colors">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Email</div>
                  <a href="mailto:contact@vertex9.com" className="text-slate-900 hover:text-blue-600 transition-colors">
                    contact@vertex9.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="p-2 bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-700 rounded-lg transition-colors">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Phone</div>
                  <a href="tel:+15551234567" className="text-slate-900 hover:text-blue-600 transition-colors">
                    +1 (555) 123-4567
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="p-2 bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-700 rounded-lg transition-colors">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Location</div>
                  <span className="text-slate-900">San Francisco, CA</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-slate-600">
              &copy; 2025 Vertex9 Talent Network. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">Terms of Service</a>
              <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
