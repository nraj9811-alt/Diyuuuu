import React, { useState, useEffect } from 'react';
import {
  Phone,
  Mail,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  Heart,
  Shield,
} from 'lucide-react';
import { sendOtp, verifyOtp, verifyDob } from '../services/api';
import { soundManager } from '../utils/audioSynth';
import confetti from 'canvas-confetti';

interface TwoStepVerificationProps {
  onVerificationComplete: () => void;
}

const PENDING_VERIFICATION_KEY = 'diyu_pending_verification_v1';

interface SavedVerificationState {
  step: 'details' | 'otp' | 'dob' | 'success';
  mobileNumber: string;
  email: string;
  tempToken: string;
  emailDelivered: boolean | null;
  infoMsg: string | null;
  savedAt: number;
}

function loadSavedVerification(): SavedVerificationState | null {
  try {
    const raw = localStorage.getItem(PENDING_VERIFICATION_KEY);
    if (!raw) return null;
    const parsed: SavedVerificationState = JSON.parse(raw);
    // Valid for 10 minutes (matching backend OTP & tempToken TTL)
    if (Date.now() - parsed.savedAt > 10 * 60 * 1000) {
      localStorage.removeItem(PENDING_VERIFICATION_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export const TwoStepVerification: React.FC<TwoStepVerificationProps> = ({ onVerificationComplete }) => {
  const savedState = loadSavedVerification();

  const [step, setStep] = useState<'details' | 'otp' | 'dob' | 'success'>(
    savedState?.step && savedState.step !== 'success' ? savedState.step : 'details'
  );
  const [mobileNumber, setMobileNumber] = useState<string>(savedState?.mobileNumber || '');
  const [email, setEmail] = useState<string>(savedState?.email || '');
  const [otp, setOtp] = useState<string>('');
  const [tempToken, setTempToken] = useState<string>(savedState?.tempToken || '');

  // Email delivery state
  const [emailDelivered, setEmailDelivered] = useState<boolean | null>(savedState?.emailDelivered ?? null);

  // Date of birth parts - strictly blank, no prefill
  const [dobDay, setDobDay] = useState<string>('');
  const [dobMonth, setDobMonth] = useState<string>('');
  const [dobYear, setDobYear] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(savedState?.infoMsg || null);
  const [cooldown, setCooldown] = useState<number>(0);

  // Persist verification progress so switching to Gmail app & returning never resets the screen
  useEffect(() => {
    if (step === 'success') {
      localStorage.removeItem(PENDING_VERIFICATION_KEY);
      return;
    }
    if (step !== 'details' || mobileNumber || email) {
      const stateToSave: SavedVerificationState = {
        step,
        mobileNumber,
        email,
        tempToken,
        emailDelivered,
        infoMsg,
        savedAt: Date.now(),
      };
      localStorage.setItem(PENDING_VERIFICATION_KEY, JSON.stringify(stateToSave));
    }
  }, [step, mobileNumber, email, tempToken, emailDelivered, infoMsg]);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber.trim() || !email.trim()) {
      setErrorMsg('Kripya apna mobile number aur email dono enter kijiye.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setInfoMsg(null);

    try {
      const res = await sendOtp(mobileNumber.trim(), email.trim());
      setStep('otp');
      setCooldown(res.cooldownSeconds || 45);
      setEmailDelivered(res.emailDelivered ?? null);
      setInfoMsg(res.message || 'OTP aapke email aur Telegram par bhej diya gaya hai.');
      soundManager.playComfortChime('star');
    } catch (err: any) {
      setErrorMsg(err.message || 'OTP nahi bheja ja saka. Kripya check karke dobara try kijiye.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) {
      setErrorMsg('Kripya complete 6-digit OTP code enter kijiye.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await verifyOtp(mobileNumber.trim(), email.trim(), otp.trim());
      setTempToken(res.tempToken);
      setStep('dob');
      soundManager.playComfortChime('star');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid ya expired OTP code hai. Kripya dobara check kijiye.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyDob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dobDay.trim() || !dobMonth.trim() || !dobYear.trim()) {
      setErrorMsg('Kripya complete date of birth (Day, Month, Year) manually enter kijiye.');
      return;
    }

    const dayNum = parseInt(dobDay.trim(), 10);
    const yearNum = parseInt(dobYear.trim(), 10);
    if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
      setErrorMsg('Kripya valid day (1-31) enter kijiye.');
      return;
    }
    if (isNaN(yearNum) || yearNum < 1950 || yearNum > 2026) {
      setErrorMsg('Kripya valid 4-digit year enter kijiye.');
      return;
    }

    const formattedDob = `${yearNum}-${dobMonth.padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      await verifyDob(tempToken, formattedDob);
      setStep('success');
      soundManager.playComfortChime('success');
      confetti({ particleCount: 90, spread: 90, origin: { y: 0.6 } });
    } catch (err: any) {
      setErrorMsg(err.message || 'Date of birth match nahi hui. Kripya check karke dobara enter kijiye.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#102A25] via-[#173B32] to-[#102A25] flex flex-col items-center justify-center p-4 sm:p-6 text-[#F6F1E8]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[#E8B878]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-[#B8A8D9]/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full rounded-3xl bg-[#173B32]/75 backdrop-blur-md border border-[#B8A8D9]/30 p-7 sm:p-9 shadow-2xl space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#B8A8D9]">
          <span className={step === 'details' || step === 'otp' ? 'text-[#FFFDF8] font-bold' : 'text-[#A7B7A0]'}>
            Step 1: Contact & OTP
          </span>
          <span>·</span>
          <span className={step === 'dob' ? 'text-[#FFFDF8] font-bold' : 'text-[#A7B7A0]'}>
            Step 2: Birthday
          </span>
          <span>·</span>
          <span className={step === 'success' ? 'text-[#FFFDF8] font-bold' : 'text-[#A7B7A0]'}>
            Open World ☁️💜
          </span>
        </div>

        {/* STEP 1: MOBILE & EMAIL INPUT */}
        {step === 'details' && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-[#102A25] border border-[#B8A8D9]/30 mx-auto flex items-center justify-center text-3xl shadow-inner">
                ☁️
              </div>
              <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#FFFDF8] leading-tight">
                Welcome to your little world, Diyuuuu ☁️💜
              </h1>
              <p className="text-xs text-[#A7B7A0] leading-relaxed font-body">
                Yeh website strictly aapke liye private hai. Aage badhne ke liye apna Mobile Number aur Email ID verify kijiye.
              </p>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#B8A8D9] uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#E8B878]" />
                  <span>Your Mobile Number (Required):</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Enter your 10-digit mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full rounded-xl bg-[#102A25] border border-[#B8A8D9]/30 px-3.5 py-2.5 text-sm text-[#FFFDF8] placeholder-[#A7B7A0]/45 focus:outline-none focus:ring-2 focus:ring-[#B8A8D9]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#B8A8D9] uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#E8B878]" />
                  <span>Your Email Address (Required):</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-[#102A25] border border-[#B8A8D9]/30 px-3.5 py-2.5 text-sm text-[#FFFDF8] placeholder-[#A7B7A0]/45 focus:outline-none focus:ring-2 focus:ring-[#B8A8D9]"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-[#102A25]/70 border border-[#B8A8D9]/15 text-[11px] text-[#A7B7A0] flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Security Check: Dono details verify hone par hi 6-digit OTP generate hoga.</span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-200">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !mobileNumber.trim() || !email.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#B8A8D9] to-[#D8CEEE] text-[#102A25] font-bold text-sm hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Verifying Details & Sending OTP...' : 'Verify & Send 6-Digit OTP 🔒'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 1b: ENTER OTP SENT TO EMAIL */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-[#102A25] border border-[#B8A8D9]/30 mx-auto flex items-center justify-center text-3xl shadow-inner">
                ✉️
              </div>
              <h2 className="font-serif-title text-2xl font-bold text-[#FFFDF8]">
                Enter 6-Digit Email OTP
              </h2>
              <p className="text-xs text-[#A7B7A0] font-body">
                OTP code aapke email <span className="text-[#FFFDF8] font-semibold">{email}</span> par send kiya gaya hai.
              </p>
            </div>

            {/* Delivery Feedback */}
            {emailDelivered === true && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Email successfully send ho gaya hai! Kripya inbox & spam check kijiye.</span>
              </div>
            )}

            {infoMsg && (
              <div className="p-3 rounded-xl bg-[#102A25] border border-[#B8A8D9]/30 text-xs text-[#B8A8D9] text-center">
                {infoMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs text-[#A7B7A0] block text-center font-medium">
                6-digit OTP code enter kijiye:
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                maxLength={6}
                autoFocus
                placeholder="• • • • • •"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full text-center tracking-[0.5em] font-mono text-2xl rounded-xl bg-[#102A25] border border-[#B8A8D9]/40 py-3 text-[#FFFDF8] placeholder-[#A7B7A0]/30 focus:outline-none focus:ring-2 focus:ring-[#B8A8D9]"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-200">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || otp.length < 6}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#B8A8D9] to-[#D8CEEE] text-[#102A25] font-bold text-sm hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Verifying OTP...' : 'Verify OTP & Proceed to Step 2 →'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Help & Resend Options */}
            <div className="pt-2 border-t border-[#B8A8D9]/15 space-y-2">
              <div className="flex items-center justify-between text-xs text-[#A7B7A0]">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem(PENDING_VERIFICATION_KEY);
                    setStep('details');
                    setOtp('');
                    setErrorMsg(null);
                  }}
                  className="hover:text-[#FFFDF8] underline"
                >
                  Change mobile / email
                </button>
                {cooldown > 0 ? (
                  <span>Resend in {cooldown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-[#B8A8D9] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend OTP</span>
                  </button>
                )}
              </div>

              <div className="p-3 rounded-xl bg-[#102A25]/60 border border-[#B8A8D9]/15 text-[11px] text-[#A7B7A0] leading-relaxed">
                <span className="text-[#FFFDF8] font-semibold block mb-0.5">ℹ️ Email OTP Note:</span>
                OTP code aapke email inbox par bhej diya gaya hai. Kripya apna Spam/Junk folder bhi check kar lijiye.
              </div>
            </div>
          </form>
        )}

        {/* STEP 2: NISHANT RAJ'S DATE OF BIRTH VERIFICATION */}
        {step === 'dob' && (
          <form onSubmit={handleVerifyDob} className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-[#102A25] border border-[#B8A8D9]/30 mx-auto flex items-center justify-center text-3xl">
                🎂
              </div>
              <h2 className="font-serif-title text-2xl font-bold text-[#FFFDF8]">
                Step 2: Nishant Raj (Sir jiii) ki Date of Birth
              </h2>
              <p className="text-xs text-[#A7B7A0] font-body leading-relaxed">
                Aapko Nishant Raj (Sir jiii) ka birthday yaad hai na? Manually enter kijiye taaki aapka world unlock ho sake:
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-[#A7B7A0] uppercase font-semibold block mb-1">Day</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  required
                  placeholder="DD"
                  value={dobDay}
                  onChange={(e) => setDobDay(e.target.value)}
                  className="w-full text-center rounded-xl bg-[#102A25] border border-[#B8A8D9]/30 py-2.5 text-sm text-[#FFFDF8] placeholder-[#A7B7A0]/40 focus:outline-none focus:ring-1 focus:ring-[#B8A8D9]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#A7B7A0] uppercase font-semibold block mb-1">Month</label>
                <select
                  required
                  value={dobMonth}
                  onChange={(e) => setDobMonth(e.target.value)}
                  className="w-full text-center rounded-xl bg-[#102A25] border border-[#B8A8D9]/30 py-2.5 text-xs text-[#FFFDF8] focus:outline-none focus:ring-1 focus:ring-[#B8A8D9]"
                >
                  <option value="">Month</option>
                  <option value="01">01 - Jan</option>
                  <option value="02">02 - Feb</option>
                  <option value="03">03 - Mar</option>
                  <option value="04">04 - Apr</option>
                  <option value="05">05 - May</option>
                  <option value="06">06 - Jun</option>
                  <option value="07">07 - Jul</option>
                  <option value="08">08 - Aug</option>
                  <option value="09">09 - Sep</option>
                  <option value="10">10 - Oct</option>
                  <option value="11">11 - Nov</option>
                  <option value="12">12 - Dec</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-[#A7B7A0] uppercase font-semibold block mb-1">Year</label>
                <input
                  type="number"
                  min="1990"
                  max="2030"
                  required
                  placeholder="YYYY"
                  value={dobYear}
                  onChange={(e) => setDobYear(e.target.value)}
                  className="w-full text-center rounded-xl bg-[#102A25] border border-[#B8A8D9]/30 py-2.5 text-sm text-[#FFFDF8] placeholder-[#A7B7A0]/40 focus:outline-none focus:ring-1 focus:ring-[#B8A8D9]"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-200">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !dobDay || !dobMonth || !dobYear}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#B8A8D9] to-[#D8CEEE] text-[#102A25] font-bold text-sm hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Verifying Birthday...' : 'Confirm Birthday & Open My World ☁️💜'}</span>
              <Sparkles className="w-4 h-4 text-[#102A25]" />
            </button>
          </form>
        )}

        {/* STEP 3: SUCCESS ANIMATION */}
        {step === 'success' && (
          <div className="text-center space-y-6 animate-scale-up">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#B8A8D9] to-[#D8CEEE] mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-10 h-10 text-[#102A25]" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif-title text-3xl font-bold text-[#FFFDF8]">
                Aapka little world ready hai ☁️💜
              </h2>
              <p className="text-sm text-[#B8A8D9] font-body">
                Verification complete! Welcome to your cozy comfort room on a cloudy day.
              </p>
            </div>

            <button
              onClick={onVerificationComplete}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#B8A8D9] to-[#D8CEEE] text-[#102A25] font-bold text-base hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <span>Enter Cozy Room Now</span>
              <ArrowRight className="w-5 h-5 text-[#102A25]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
