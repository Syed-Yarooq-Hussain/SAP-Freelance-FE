"use client";

import { useState } from "react";

import "@/utils/styles/index.css";

// LANDING COMPONENTS
// import { HeroSection } from "@/components/homepage/HeroSection";
// import { ClientBenefits } from "@/components/homepage/ClientBenefits";
// import { ClientSignUpFlow } from "@/components/homepage/ClientSignUpFlow";
// import { ConsultantBenefits } from "@/components/homepage/ConsultantBenefits";
// import { TopConsultants } from "@/components/homepage/TopConsultants";
// import { TrustMetrics } from "@/components/homepage/TrustMetrics";
import { Footer } from "@/components/homepage/Footer";

// SHARED COMPONENTS
import { ConsultantListingPage } from "@/components/homepage/ConsultantListingPage";
import ContactPage from "@/components/contact-us";
import { ConsultantDetailModal } from "@/components/homepage/ConsultantDetailModal";
// import { Navigation } from "@/components/homepage/Navigation";
import Banner from "@/components/homepageNew/Banner";
import Careers from "@/components/homepageNew/Careers";
import Consultants from "@/components/homepageNew/Consultants";
import Features from "@/components/homepageNew/Features";
import Reviews from "@/components/homepageNew/Reviews";
import Teambuilder from "@/components/homepageNew/Teambuilder";
import { Header } from "@/components/Header";

// AUTH COMPONENTS
import { LoginModal } from "@/components/auth/LoginModal";
import { SignUpModal } from "@/components/auth/SignUpModal";
import { EmailVerificationScreen } from "@/components/auth/EmailVerificationScreen";
import { ForgotPasswordModal } from "@/components/auth/ForgotPasswordModal";
import { ResetPasswordScreen } from "@/components/auth/ResetPasswordScreen";

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

export default function Home() {
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
      <div className="pt-20"/>
      {/* LANDING PAGE */}
      {currentPage === "landing" && (
        <>
          <Banner 
            onLoginClick={openLogin}
            onSignUpClick={() => openSignUp('consultant')}
          />
          <Careers onSignUpClick={() => openSignUp('consultant')} />
          <Consultants onSignUpClick={() => openSignUp('consultant')} />
          <Features />
          <Teambuilder />
          <Reviews />
          {/* < 
            onFindConsultants={() => setCurrentPage("consultants")}
          />

          <TrustMetrics />

          <TopConsultants
            onBrowseConsultants={() => setCurrentPage("consultants")}
          />

          <ClientBenefits />

          <ConsultantBenefits
            onRegister={() => handleOpenSignUp("consultant")}
          />

          <ClientSignUpFlow /> */}
        </>
      )}

      {/* CONSULTANTS PAGE */}
      {currentPage === "consultants" && (
        <ConsultantListingPage onConsultantClick={handleConsultantClick} />
      )}

      
      {/* CONTACT PAGE */}
      {currentPage === "contact" && <ContactPage onNavigate={setCurrentPage} />}

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
