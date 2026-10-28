import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, X, Sparkles } from 'lucide-react';
import { adminLogin } from '../../services/api';
import { soundManager } from '../../utils/audioSynth';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      await adminLogin(password.trim());
      soundManager.playComfortChime('success');
      onLoginSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid administrator password or setup phrase.');
      soundManager.playComfortChime('click');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#173B32] border border-[#B8A8D9]/40 shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#A7B7A0] hover:text-[#FFFDF8] hover:bg-[#102A25] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#102A25] border border-[#B8A8D9]/30 mx-auto flex items-center justify-center text-2xl shadow-inner">
            🔐
          </div>
          <h2 className="font-serif-title text-2xl font-bold text-[#FFFDF8]">
            Administrator Portal
          </h2>
          <p className="text-xs text-[#A7B7A0] font-body">
            Access restricted to Nishant Raj (Sir jiii).
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#B8A8D9] uppercase tracking-wider">
              Setup Phrase or Admin Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                required
                className="w-full rounded-xl bg-[#102A25] border border-[#B8A8D9]/30 px-4 py-3 text-sm text-[#FFFDF8] placeholder-[#A7B7A0]/50 pr-10 focus:outline-none focus:ring-2 focus:ring-[#B8A8D9]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#A7B7A0] hover:text-[#FFFDF8]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-[#A7B7A0] italic">
              Tip: Initial setup phrase is <code className="text-[#E8B878]">MYLOVEDIVYA</code>
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-200">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B8A8D9] to-[#D8CEEE] text-[#102A25] font-semibold text-sm hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isLoading ? 'Verifying...' : 'Sign In as Administrator'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
