import { useState } from 'react';
import { LoginModal } from './LoginModal';
import { SignUpModal } from './SignUpModal';
import { EmailVerificationScreen } from './EmailVerificationScreen';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { ResetPasswordScreen } from './ResetPasswordScreen';


export default function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpUserType, setSignUpUserType] = useState<'client' | 'consultant' | undefined>(undefined);
  
  const handleLogin = () => {
    // setIsAuthenticated(true);O
    setShowLoginModal(false);
    // setShowConsultantDetail(false);
  };

  const handleSignUp = (email: string) => {
    setSignUpEmail(email);
    setShowSignUpModal(false);
    setShowEmailVerification(true);
  };

  const handleVerificationComplete = () => {
    setShowEmailVerification(false);
    setShowLoginModal(true);
  };

  const handleCloseModals = () => {
    setShowLoginModal(false);
    setShowSignUpModal(false);
    setShowEmailVerification(false);
    setShowForgotPassword(false);
    setShowResetPassword(false);
    setSignUpUserType(undefined);
  };

  const handleOpenSignUp = (userType?: 'client' | 'consultant') => {
    setSignUpUserType(userType);
    setShowSignUpModal(true);
    setShowLoginModal(false);
    setShowForgotPassword(false);
  };

  const handleForgotPassword = () => {
    setShowLoginModal(false);
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setShowResetPassword(false);
    setShowLoginModal(true);
  };

  const handlePasswordReset = () => {
    setShowResetPassword(false);
    setShowLoginModal(true);
  };

  // Simulate clicking reset link from email
  const handleResetLinkClick = () => {
    setShowForgotPassword(false);
    setShowResetPassword(true);
  };

  return (
    <div className="min-h-screen bg-white">

      {showLoginModal && (
        <LoginModal
          onClose={handleCloseModals} 
          onLogin={handleLogin}
          onSwitchToSignUp={() => handleOpenSignUp()}
          onForgotPassword={handleForgotPassword}
        />
      )}

      {showSignUpModal && (
        <SignUpModal 
          onClose={handleCloseModals} 
          onSignUp={handleSignUp} 
          defaultUserType={signUpUserType} 
        />
      )}

      {showEmailVerification && (
        <EmailVerificationScreen
          onClose={handleCloseModals}
          email={signUpEmail}
          onVerificationComplete={handleVerificationComplete}
        />
      )}

      {showForgotPassword && (
        <ForgotPasswordModal
          onClose={handleCloseModals}
          onBackToLogin={handleBackToLogin}
          onResetLinkClick={handleResetLinkClick}
        />
      )}

      {showResetPassword && (
        <ResetPasswordScreen
          onClose={handleCloseModals}
          onPasswordReset={handlePasswordReset}
        />
      )}
    </div>
  );
}