import { LogIn, Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { APP_ROUTES } from "@/utils/app_routes";
import Image from "next/image";

interface NavigationProps {
  onLoginClick: () => void;
  onNavigate: (page: "landing" | "consultants" | "contact") => void;
  isAuthenticated: boolean;
}

const navItems = [
  { label: "Consultants", page: "consultants" as const },
  { label: "Contact", page: "contact" as const },
];

export function Navigation({
  onNavigate,
  isAuthenticated,
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (page: "landing" | "consultants" | "contact") => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <button
            onClick={() => onNavigate("landing")}
            className="group flex items-center gap-3 hover:opacity-80 transition-all transform hover:scale-105"
          >
            <Image
    src="/vx9-logo-02.png"
    alt="Vertex9 Systems"
    width={160}
    height={60}
    className="h-12 w-auto"
    priority
  />
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full">
              <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
              <span className="text-xs text-white">Premium Network</span>
            </div>
          </button>

          {/* Login Button */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg">
                  JD
                </div>
                <span className="text-gray-700">John Doe</span>
              </div>
            ) : (
              <button
                onClick={() => window.location.href = APP_ROUTES.LOGIN}
                className="group relative flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <LogIn className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-lg">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.page)}
                  className="text-gray-700 hover:text-blue-600 transition-colors text-left px-4 py-2 hover:bg-blue-50 rounded-lg"
                >
                  {item.label}
                </button>
              ))}
              {!isAuthenticated && (
                <button
                  onClick={() => {
                    window.location.href = (APP_ROUTES.LOGIN);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg w-full justify-center"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
