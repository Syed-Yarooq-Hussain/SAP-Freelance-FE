"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, LogIn } from "lucide-react"

interface HeaderProps {
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  isAuthenticated?: boolean;
}

const navLinks = [
  { label: "Join as consultant", href: "#join-consultant" },
  { label: "Elite Talent Pool", href: "#elite-talent" },
  { label: "How We're different", href: "#how-different" },
  { label: "Expert Team Builder", href: "#team-builder" },
  { label: "Why Choose Us", href: "#why-choose" },
  { label: "Book a Demo", href: "#book-demo" },
]

export function Header({ onLoginClick, onSignUpClick, isAuthenticated = false }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div className="container mx-auto">
        <nav className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-slate-100 px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/vx9-logo-02.png"
                alt="Vertex9 Systems"
                width={140}
                height={40}
                className="h-8 md:h-10 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center gap-1 2xl:gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm text-slate-600 hover:text-brand-blue transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden xl:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg">
                    JD
                  </div>
                  <span className="text-gray-700">John Doe</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={onLoginClick}
                    className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-2xl hover:border-brand-blue hover:text-brand-blue transition-all duration-300"
                  >
                    Login
                  </button>
                  <button
                    onClick={onSignUpClick}
                    className="px-5 py-2.5 text-sm font-medium text-white btn-gradient-blue rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Join as a Consultant
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="xl:hidden p-2 text-slate-600 hover:text-brand-blue"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="xl:hidden mt-4 pb-4 border-t border-slate-100 pt-4">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 text-sm text-slate-600 hover:text-brand-blue hover:bg-slate-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-slate-100">
                  {isAuthenticated ? (
                    <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg">
                        JD
                      </div>
                      <span className="text-gray-700">John Doe</span>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          onLoginClick?.();
                          setIsMobileMenuOpen(false);
                        }}
                        className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-full hover:border-brand-blue hover:text-brand-blue transition-all duration-300 text-center"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => {
                          onSignUpClick?.();
                          setIsMobileMenuOpen(false);
                        }}
                        className="px-5 py-2.5 text-sm font-medium text-white btn-gradient-blue rounded-full transition-all duration-300 hover:scale-105 active:scale-95 text-center"
                      >
                        Join as a Consultant
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
