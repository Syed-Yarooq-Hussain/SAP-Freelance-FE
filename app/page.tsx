"use client";

import { useState } from "react";

import "@/utils/styles/index.css";

// LANDING COMPONENTS
import { HeroSection } from "@/components/homepage/HeroSection";
import { ClientBenefits } from "@/components/homepage/ClientBenefits";
import { ClientSignUpFlow } from "@/components/homepage/ClientSignUpFlow";
import { ConsultantBenefits } from "@/components/homepage/ConsultantBenefits";
import { TopConsultants } from "@/components/homepage/TopConsultants";
import { TrustMetrics } from "@/components/homepage/TrustMetrics";
import { Footer } from "@/components/homepage/Footer";

// SHARED COMPONENTS
import { ConsultantListingPage } from "@/components/homepage/ConsultantListingPage";
import { ContactPage } from "@/components/homepage/ContactPage";
import { LoginModal } from "@/components/homepage/LoginModal";
import { ConsultantDetailModal } from "@/components/homepage/ConsultantDetailModal";
import { SignUpModal } from "@/components/homepage/SignUpModal";
import { Navigation } from "@/components/homepage/Navigation";
import Banner from "@/components/homepageNew/Banner";
import Careers from "@/components/homepageNew/Careers";
import Consultants from "@/components/homepageNew/Consultants";
import Features from "@/components/homepageNew/Features";
import HireSap from "@/components/homepageNew/HireSap";
import Reviews from "@/components/homepageNew/Reviews";
import Teambuilder from "@/components/homepageNew/Teambuilder";
import { Header } from "@/components/Header";

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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [signUpUserType, setSignUpUserType] = useState<
    "client" | "consultant" | undefined
  >(undefined);

  const [showConsultantDetail, setShowConsultantDetail] = useState(false);
  const [selectedConsultant, setSelectedConsultant] =
    useState<Consultant | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleConsultantClick = (consultant: Consultant) => {
    setSelectedConsultant(consultant);

    if (isAuthenticated) {
      alert("Redirecting to internal portal...");
    } else {
      setShowConsultantDetail(true);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setShowLoginModal(false);
    setShowConsultantDetail(false);
  };

  const handleSignUp = () => {
    setIsAuthenticated(true);
    setShowSignUpModal(false);
    setShowConsultantDetail(false);
  };

  const handleCloseModals = () => {
    setShowLoginModal(false);
    setShowSignUpModal(false);
    setShowConsultantDetail(false);
    setSignUpUserType(undefined);
  };

  const handleOpenSignUp = (userType?: "client" | "consultant") => {
    setSignUpUserType(userType);
    setShowSignUpModal(true);
    setShowLoginModal(false);
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
        onLoginClick={() => setShowLoginModal(true)}
        isAuthenticated={isAuthenticated}
      />
      <div className="mt-20"/>
      {/* LANDING PAGE */}
      {currentPage === "landing" && (
        <>
          <Banner />
          <Careers />
          <Consultants />
          <Features />
          <Teambuilder />
          <Reviews />
          <HireSap />
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

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <LoginModal
          onClose={handleCloseModals}
          onLogin={handleLogin}
          onSwitchToSignUp={() => handleOpenSignUp()}
        />
      )}

      {/* SIGNUP MODAL */}
      {showSignUpModal && (
        <SignUpModal
          onClose={handleCloseModals}
          onSignUp={handleSignUp}
          defaultUserType={signUpUserType}
        />
      )}

      {/* CONSULTANT DETAIL MODAL */}
      {showConsultantDetail && selectedConsultant && (
        <ConsultantDetailModal
          consultant={selectedConsultant}
          onClose={handleCloseModals}
        />
      )}

      {/* FOOTER */}
      <Footer onNavigate={handleFooterNavigate} />
    </div>
  );
}
