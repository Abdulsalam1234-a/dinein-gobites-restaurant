import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  KeyRound, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Smartphone,
  AlertCircle
} from 'lucide-react';
import { 
  registerCustomer, 
  authenticateCustomer, 
  generateCustomerOtp, 
  verifyCustomerOtp,
  saveCurrentCustomer,
  findCustomerByEmail
} from '../utils/storage';
import { 
  isFirebaseConfigured, 
  signInWithGooglePopup, 
  saveCustomerProfileToCloud 
} from '../utils/firebase';

export const CustomerAuthModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signin', // 'signin' | 'signup'
  whatsappNumber = '07068371295',
}) => {
  const [mode, setMode] = useState(initialMode); // 'signin' | 'signup' | 'otp' | 'forgot'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: 'Adebayo, Ado-Ekiti',
    password: '',
    confirmPassword: '',
  });

  const [otpCode, setOtpCode] = useState('');
  const [activeOtpTicket, setActiveOtpTicket] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sync initial mode
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage('');
      setSuccessMessage('');
      setOtpCode('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleInputChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errorMessage) setErrorMessage('');
  };

  // 1. Google 1-Click Authentication
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      if (isFirebaseConfigured()) {
        const res = await signInWithGooglePopup();
        if (res.success && res.customer) {
          saveCurrentCustomer(res.customer);
          setSuccessMessage(`Welcome back, ${res.customer.name}!`);
          setTimeout(() => {
            onSuccess(res.customer);
            onClose();
          }, 600);
          return;
        } else {
          setErrorMessage(res.error || 'Google Sign-in failed. Please try with email & password.');
        }
      } else {
        // Fallback for demonstration when Firebase config is not added yet
        const demoGoogleCustomer = {
          uid: 'google_user_' + Date.now(),
          name: 'Google Customer',
          email: 'customer@gmail.com',
          phone: '08012345678',
          address: 'Adebayo, Ado-Ekiti',
          provider: 'google',
          isVerified: true,
          createdAt: new Date().toISOString(),
        };
        saveCurrentCustomer(demoGoogleCustomer);
        setSuccessMessage('Signed in with Google successfully!');
        setTimeout(() => {
          onSuccess(demoGoogleCustomer);
          onClose();
        }, 600);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Google Sign-in error.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Email Sign In
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (!formData.email.trim() || !formData.password.trim()) {
      setErrorMessage('Please enter both your email address and password.');
      setIsLoading(false);
      return;
    }

    const authRes = await authenticateCustomer(formData.email, formData.password);
    if (!authRes.success) {
      setErrorMessage(authRes.error);
      setIsLoading(false);
      return;
    }

    setSuccessMessage(`Welcome back, ${authRes.customer.name}!`);
    setTimeout(() => {
      onSuccess(authRes.customer);
      onClose();
    }, 600);
    setIsLoading(false);
  };

  // 3. Email Sign Up - Initiates 6-Digit OTP Verification
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name.');
      setIsLoading(false);
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    // Check if customer email already exists
    const existing = findCustomerByEmail(formData.email);
    if (existing) {
      setErrorMessage('An account with this email already exists. Please sign in instead.');
      setIsLoading(false);
      return;
    }

    // Generate 6-Digit Verification OTP
    const ticket = generateCustomerOtp(formData.email, {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      password: formData.password,
    });

    setActiveOtpTicket(ticket);
    setMode('otp');
    setSuccessMessage('6-digit verification code generated! Enter it below to activate your account.');
    setIsLoading(false);
  };

  // 4. Verify 6-Digit OTP and Complete Registration
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (otpCode.trim().length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      setIsLoading(false);
      return;
    }

    const verification = verifyCustomerOtp(formData.email, otpCode);
    if (!verification.success) {
      setErrorMessage(verification.error);
      setIsLoading(false);
      return;
    }

    // Register customer
    const regRes = await registerCustomer({
      ...verification.pendingData,
      provider: 'password',
    });

    if (!regRes.success) {
      setErrorMessage(regRes.error);
      setIsLoading(false);
      return;
    }

    // If Cloud database is connected, push profile to Firestore in background
    if (isFirebaseConfigured()) {
      saveCustomerProfileToCloud(regRes.customer);
    }

    setSuccessMessage(`Account activated successfully! Welcome to Romee Eatery, ${regRes.customer.name}!`);
    setTimeout(() => {
      onSuccess(regRes.customer);
      onClose();
    }, 700);
    setIsLoading(false);
  };

  // WhatsApp OTP Delivery Direct Link
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const whatsAppOtpHelpUrl = activeOtpTicket
    ? `https://wa.me/${cleanPhone.startsWith('0') ? '234' + cleanPhone.slice(1) : cleanPhone}?text=${encodeURIComponent(
        `Hello ROMEE Eatery! My email is ${formData.email}. My sign-up verification code is [${activeOtpTicket.code}]. Please assist me.`
      )}`
    : '#';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-petrol-950/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-petrol-900 border border-mustard/30 rounded-3xl shadow-2xl overflow-hidden z-10 text-white animate-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-petrol-950/80 border-b border-petrol-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black/60 border border-mustard/40 p-1 flex items-center justify-center shadow-md">
              <img 
                src="/images/romee-logo.jpg" 
                alt="Romee Eatery" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white">
                Romee Customer Club
              </h3>
              <p className="text-[11px] text-mustard tracking-wide uppercase font-semibold">
                {mode === 'signup' && 'Create Your Personal Account'}
                {mode === 'signin' && 'Sign In to Your Account'}
                {mode === 'otp' && 'Verify 6-Digit Email OTP'}
                {mode === 'forgot' && 'Reset Customer Password'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-petrol-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          
          {/* Notifications */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ================= MODE: SIGN IN ================= */}
          {mode === 'signin' && (
            <div className="space-y-4">
              {/* 1-Click Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-white text-slate-800 hover:bg-slate-100 font-bold text-xs flex items-center justify-center gap-3 shadow-md transition-all hover:scale-[1.01]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <div className="flex-1 border-t border-petrol-800" />
                <span>or sign in with email</span>
                <div className="flex-1 border-t border-petrol-800" />
              </div>

              <form onSubmit={handleSignInSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@gmail.com"
                      className="w-full bg-petrol-950 border border-petrol-700 rounded-xl px-3 py-2 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-mustard"
                      required
                    />
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-300">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-petrol-950 border border-petrol-700 rounded-xl px-3 py-2 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-mustard"
                      required
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isLoading ? 'Signing In...' : 'Sign In to My Account'}</span>
                </button>
              </form>

              <div className="pt-2 text-center text-xs text-slate-300">
                Don't have a personal account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage('');
                  }}
                  className="text-mustard font-bold hover:underline"
                >
                  Create one in 1 minute
                </button>
              </div>
            </div>
          )}

          {/* ================= MODE: SIGN UP ================= */}
          {mode === 'signup' && (
            <div className="space-y-4">
              {/* 1-Click Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-white text-slate-800 hover:bg-slate-100 font-bold text-xs flex items-center justify-center gap-3 shadow-md transition-all hover:scale-[1.01]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Sign up in 1-Click with Google</span>
              </button>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <div className="flex-1 border-t border-petrol-800" />
                <span>or create with Email & OTP</span>
                <div className="flex-1 border-t border-petrol-800" />
              </div>

              <form onSubmit={handleSignUpSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Your Full Name <span className="text-mustard">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g. Adeola Adeleke"
                      className="w-full bg-petrol-950 border border-petrol-700 rounded-xl px-3 py-2 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-mustard"
                      required
                    />
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Email Address <span className="text-mustard">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="adeola@gmail.com"
                      className="w-full bg-petrol-950 border border-petrol-700 rounded-xl px-3 py-2 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-mustard"
                      required
                    />
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Phone Number (WhatsApp)
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="08012345678"
                        className="w-full bg-petrol-950 border border-petrol-700 rounded-xl px-3 py-2 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-mustard"
                      />
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Delivery Area / Address
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="e.g. Adebayo, Ado-Ekiti"
                        className="w-full bg-petrol-950 border border-petrol-700 rounded-xl px-3 py-2 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-mustard"
                      />
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Create Password <span className="text-mustard">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Min 6 chars"
                        className="w-full bg-petrol-950 border border-petrol-700 rounded-xl px-3 py-2 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-mustard"
                        required
                      />
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Confirm Password <span className="text-mustard">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full bg-petrol-950 border border-petrol-700 rounded-xl px-3 py-2 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-mustard"
                        required
                      />
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Send 6-Digit Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="pt-2 text-center text-xs text-slate-300">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMessage('');
                  }}
                  className="text-mustard font-bold hover:underline"
                >
                  Sign in here
                </button>
              </div>
            </div>
          )}

          {/* ================= MODE: 6-DIGIT OTP VERIFICATION ================= */}
          {mode === 'otp' && activeOtpTicket && (
            <div className="space-y-4">
              <div className="bg-petrol-950/70 p-4 rounded-2xl border border-mustard/30 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-mustard/20 text-mustard flex items-center justify-center mx-auto">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-base text-white">
                  Enter 6-Digit Security Code
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We generated a secure verification code for <strong className="text-mustard">{formData.email}</strong>.
                </p>
                
                {/* Instant Verification Code Card */}
                <div className="bg-petrol-900 border border-mustard/40 rounded-xl p-3 my-2 flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                      Your One-Time Passcode:
                    </span>
                    <span className="font-mono text-xl font-black text-mustard tracking-widest">
                      {activeOtpTicket.code}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpCode(activeOtpTicket.code);
                      navigator.clipboard?.writeText(activeOtpTicket.code);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-mustard/20 hover:bg-mustard/30 text-mustard text-[11px] font-bold border border-mustard/40 transition-colors"
                  >
                    Auto-Fill Code
                  </button>
                </div>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div>
                  <label className="block text-center text-[11px] font-semibold text-slate-300 mb-1.5">
                    Enter the 6 digits below
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="• • • • • •"
                    className="w-full text-center tracking-[0.5em] font-mono text-2xl font-bold bg-petrol-950 border-2 border-mustard/60 rounded-xl py-2.5 text-mustard placeholder-slate-600 focus:outline-none focus:border-mustard"
                    autoFocus
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isLoading ? 'Verifying...' : 'Verify & Activate My Account'}</span>
                </button>
              </form>

              {/* WhatsApp Verification Support */}
              <div className="flex items-center justify-between pt-2 border-t border-petrol-800 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    const fresh = generateCustomerOtp(formData.email, activeOtpTicket.pendingData);
                    setActiveOtpTicket(fresh);
                    setOtpCode('');
                    setSuccessMessage('New 6-digit code generated!');
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  Didn't see code? Resend
                </button>

                <a
                  href={whatsAppOtpHelpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>WhatsApp Code Support</span>
                </a>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
