"use client";

import { useState } from "react";

import "@/utils/styles/index.css";

// LANDING COMPONENTS
import { Footer } from "@/components/homepage/Footer";

// SHARED COMPONENTS
import { Header } from "@/components/Header";
import { ConsultantDetailModal } from "@/components/homepage/ConsultantDetailModal";

// AUTH COMPONENTS
import { EmailVerificationScreen } from "@/components/auth/EmailVerificationScreen";
import { ForgotPasswordModal } from "@/components/auth/ForgotPasswordModal";
import { LoginModal } from "@/components/auth/LoginModal";
import { ResetPasswordScreen } from "@/components/auth/ResetPasswordScreen";
import { SignUpModal } from "@/components/auth/SignUpModal";

// HOOKS
import { useAuthModals } from "@/hooks/useAuthModals";

type Page = "landing" | "consultants" | "contact";

export interface Consultant {
  id: number;
  code: string;
  module: string;
  experienceLevel: string;
  experienceYears: number;
  rating: number;
  availability: string;
  skills: string[];
  name: string;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [showConsultantDetail, setShowConsultantDetail] = useState(false);
  const [selectedConsultant, setSelectedConsultant] =
    useState<Consultant | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Auth modals hook
  const {
    showLogin,
    showSignUp,
    showEmailVerification,
    showForgotPassword,
    showResetPassword,
    signUpEmail,
    signUpUserType,
    userDetails,
    openLogin,
    openSignUp,
    openForgotPassword,
    closeAll,
    handleLogin,
    handleSignUp,
    handleBackToLogin,
    handlePasswordReset,
    // handleResetLinkClick,
  } = useAuthModals();

  const handleConsultantClick = (consultant: Consultant) => {
    setSelectedConsultant(consultant);

    if (isAuthenticated) {
      alert("Redirecting to internal portal...");
    } else {
      setShowConsultantDetail(true);
    }
  };

  const onLogin = (data: {email: string, password: string}) => {
    // setIsAuthenticated(true);
    handleLogin(data);
    // setShowConsultantDetail(false);
  };

  const handleFooterNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  return (
    <div className="tailwind min-h-screen bg-white">
      {/* NAVIGATION */}
      {/* <Navigation
        onLoginClick={() => setShowLoginModal(true)}
        onNavigate={setCurrentPage}
        isAuthenticated={isAuthenticated}
      /> */}
      <Header 
        onLoginClick={openLogin}
        onSignUpClick={() => openSignUp('consultant')}
        isAuthenticated={isAuthenticated}
      />
      <div className="mt-20"/>
        {children}
      {/* AUTH MODALS */}
      {showLogin && (
        <LoginModal
          onClose={closeAll}
          onLogin={onLogin}
          onSwitchToSignUp={() => openSignUp()}
          onForgotPassword={openForgotPassword}
        />
      )}

      {showSignUp && (
        <SignUpModal
          onClose={closeAll}
          onSignUp={handleSignUp}
          defaultUserType={signUpUserType}
        />
      )}

      {showEmailVerification && (
        <EmailVerificationScreen
          onClose={closeAll}
          email={signUpEmail}
          userDetails={userDetails}
        />
      )}

      {showForgotPassword && (
        <ForgotPasswordModal
          onClose={closeAll}
          onBackToLogin={handleBackToLogin}
          // onResetLinkClick={handleResetLinkClick}
        />
      )}

      {showResetPassword && (
        <ResetPasswordScreen
          onClose={closeAll}
          onPasswordReset={handlePasswordReset}
        />
      )}

      {/* CONSULTANT DETAIL MODAL */}
      {showConsultantDetail && selectedConsultant && (
        <ConsultantDetailModal
          consultant={selectedConsultant}
          onClose={() => setShowConsultantDetail(false)}
        />
      )}

      {/* FOOTER */}
      <Footer onNavigate={handleFooterNavigate} />
    </div>
  );
}
