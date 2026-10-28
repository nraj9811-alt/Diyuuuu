import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { PublicContentResponse } from './types';
import { fetchPublicContent, checkAdminAuth, checkVisitorSession } from './services/api';
import { Navigation, ActiveSection } from './components/Navigation';
import { WelcomeScreen } from './components/WelcomeScreen';
import { TwoStepVerification } from './components/TwoStepVerification';
import { PeriodCycleTracker } from './components/PeriodCycleTracker';
import { CuddleAndKissSanctuary } from './components/CuddleAndKissSanctuary';
import { NicknameGenerator } from './components/NicknameGenerator';
import { MainCozyRoom } from './components/MainCozyRoom';
import { ComfortCorner } from './components/ComfortCorner';
import { NotesAndLetters } from './components/NotesAndLetters';
import { MemoryGarden } from './components/MemoryGarden';
import { AppreciationCards } from './components/AppreciationCards';
import { MiniGamesHub } from './components/MiniGames';
import { MusicPlayer } from './components/MusicPlayer';
import { RainyWindow } from './components/RainyWindow';
import { TodayPlan } from './components/TodayPlan';
import { PersonalCalendar } from './components/PersonalCalendar';
import { SurpriseEnvelope } from './components/SurpriseEnvelope';
import { KarwaChauthSpecial } from './components/KarwaChauthSpecial';
import { DivyaHeartQuiz } from './components/DivyaHeartQuiz';
import { SettingsModal } from './components/SettingsModal';
import { AdminLoginModal } from './components/Admin/AdminLoginModal';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { Heart } from 'lucide-react';

const InnerApp: React.FC = () => {
  const { logAction, showNicknames } = useTheme();
  const [content, setContent] = useState<PublicContentResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [customNickname, setCustomNickname] = useState<string | null>(() => {
    return localStorage.getItem('diyu_active_nickname');
  });
  const [isVisitorVerified, setIsVisitorVerified] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('diyu_visitor_session'));
  });
  const [checkingSession, setCheckingSession] = useState<boolean>(true);
  const [hasEntered, setHasEntered] = useState<boolean>(() => {
    return sessionStorage.getItem('diyu_entered') === 'true';
  });

  const [activeSection, setActiveSection] = useState<ActiveSection>('room');
  const [navHistory, setNavHistory] = useState<ActiveSection[]>(['room']);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState<boolean>(false);

  const loadContent = async () => {
    try {
      const data = await fetchPublicContent();
      setContent(data);
    } catch (err) {
      console.error('Failed to load content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
    const verifySession = async () => {
      try {
        const isVerified = await checkVisitorSession();
        setIsVisitorVerified(isVerified);
      } catch {
        // fallback to existing token
      } finally {
        setCheckingSession(false);
      }
    };
    verifySession();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeSection]);

  const handleEnterWorld = () => {
    setHasEntered(true);
    sessionStorage.setItem('diyu_entered', 'true');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    logAction('navigation', 'Welcome Screen', 'Entered the cozy world');
  };

  const handleNavigate = (section: ActiveSection) => {
    setNavHistory((prev) => (prev[prev.length - 1] === section ? prev : [...prev, section]));
    setActiveSection(section);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    logAction('section_view', section, `Navigated to ${section}`);
  };

  const handleGoBack = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (navHistory.length > 1) {
      const updated = [...navHistory];
      updated.pop();
      const prevSection = updated[updated.length - 1];
      setNavHistory(updated);
      setActiveSection(prevSection);
    } else {
      setActiveSection('room');
    }
  };

  const handleOpenAdminPortal = async () => {
    const authStatus = await checkAdminAuth();
    if (authStatus.authenticated) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  if (loading || checkingSession || !content) {
    return (
      <div className="min-h-screen bg-[#102A25] flex flex-col items-center justify-center space-y-4 text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/30 flex items-center justify-center text-3xl animate-pulse">
          ☁️
        </div>
        <p className="font-serif-title text-2xl text-[#FFFDF8]">
          Opening Diyuuuu's Comfort World...
        </p>
        <span className="text-xs text-[#A7B7A0]">Bringing warm lights & rain sounds</span>
      </div>
    );
  }

  // TWO-STEP PERSONALIZED ACCESS CHECK
  if (content.verificationConfig?.requireVerification !== false && !isVisitorVerified) {
    return (
      <TwoStepVerification
        onVerificationComplete={() => {
          setIsVisitorVerified(true);
          setHasEntered(true);
          sessionStorage.setItem('diyu_entered', 'true');
        }}
      />
    );
  }

  const recipientNickname =
    customNickname ||
    (showNicknames
      ? content.settings.recipientNickname || 'Diyuuuu'
      : content.settings.recipientName || 'Divya');

  // If user hasn't pressed "Enter your little world" yet, show Welcome screen
  if (!hasEntered) {
    return (
      <WelcomeScreen
        settings={content.settings}
        onEnter={handleEnterWorld}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--bg-primary,#102A25)] text-[var(--text-primary,#F6F1E8)] selection:bg-[#B8A8D9]/30">
      {/* Navigation Bar */}
      <Navigation
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onBack={handleGoBack}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAdmin={handleOpenAdminPortal}
        recipientNickname={recipientNickname}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeSection === 'room' && (
          <MainCozyRoom
            onNavigate={handleNavigate}
            onOpenEnvelope={() => setIsEnvelopeOpen(true)}
            recipientNickname={recipientNickname}
          />
        )}

        {/* Kiss & Hug Sanctuary */}
        {activeSection === 'cuddle' && (
          <CuddleAndKissSanctuary
            recipientNickname={recipientNickname}
            onReturn={handleGoBack}
          />
        )}

        {/* Period Care & Cycle Tracker Sanctuary */}
        {activeSection === 'period' && (
          <PeriodCycleTracker
            recipientNickname={recipientNickname}
            onReturn={handleGoBack}
          />
        )}

        {/* Karwa Chauth & Mummy ki Mehendi Section */}
        {activeSection === 'karwa' && (
          <KarwaChauthSpecial
            recipientNickname={recipientNickname}
            onReturn={handleGoBack}
          />
        )}

        {/* Divya's Heart Q&A & Secret Final Message */}
        {activeSection === 'quiz' && (
          <DivyaHeartQuiz
            recipientNickname={recipientNickname}
            onReturn={handleGoBack}
          />
        )}

        {/* Random Nickname Generator Slot Machine */}
        {activeSection === 'nicknames' && (
          <NicknameGenerator
            nicknames={content.nicknameGenerator?.nicknames || []}
            currentActiveNickname={recipientNickname}
            onSetNickname={(newNick) => {
              setCustomNickname(newNick);
              localStorage.setItem('diyu_active_nickname', newNick);
            }}
            onReturn={handleGoBack}
          />
        )}

        {activeSection === 'comfort' && (
          <ComfortCorner
            categories={content.comfortCorner.categories}
            recipientNickname={recipientNickname}
          />
        )}

        {activeSection === 'window' && (
          <RainyWindow onReturn={handleGoBack} />
        )}

        {activeSection === 'notes' && (
          <NotesAndLetters
            notes={content.notes}
            letters={content.letters}
            recipientNickname={recipientNickname}
            onReturn={handleGoBack}
          />
        )}

        {activeSection === 'garden' && (
          <MemoryGarden
            memories={content.memories}
            recipientNickname={recipientNickname}
          />
        )}

        {activeSection === 'appreciation' && (
          <AppreciationCards
            cards={content.appreciationCards}
            recipientNickname={recipientNickname}
          />
        )}

        {activeSection === 'games' && (
          <MiniGamesHub
            gameConfigs={content.miniGames}
            recipientNickname={recipientNickname}
            onReturn={handleGoBack}
          />
        )}

        {activeSection === 'music' && (
          <MusicPlayer
            tracks={content.musicTracks}
            playlists={content.playlists}
            recipientNickname={recipientNickname}
          />
        )}

        {activeSection === 'today' && (
          <TodayPlan
            todayPlan={content.todayPlan}
            familyVisit={content.familyVisitEvent}
            recipientNickname={recipientNickname}
            timezone={content.settings.timezone || 'Asia/Kolkata'}
          />
        )}

        {activeSection === 'calendar' && (
          <PersonalCalendar recipientNickname={recipientNickname} />
        )}
      </main>

      {/* Modals & Overlays */}
      <SurpriseEnvelope
        envelopeData={content.surpriseEnvelope}
        isOpen={isEnvelopeOpen}
        onClose={() => setIsEnvelopeOpen(false)}
        recipientNickname={recipientNickname}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        nicknames={content.settings.nicknames}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoginOpen(false);
          setIsAdminDashboardOpen(true);
        }}
      />

      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        onRefreshPublicContent={loadContent}
      />

      {/* Quiet Respectful Footer */}
      <footer className="border-t border-[#B8A8D9]/15 bg-[#0C1F1B] px-4 py-8 text-center space-y-3 font-body">
        <div className="flex items-center justify-center gap-2 text-xs text-[#B8A8D9]">
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Made for Divya ({recipientNickname}) by Nishant Raj</span>
        </div>

        <p className="text-xs text-[#A7B7A0] max-w-lg mx-auto leading-relaxed">
          {content.settings.footerMessage ||
            'Crafted with warmth for Diyuuuu. Aap jab chahein, yahan aakar sukoon mehsoos kar sakte ho ☁️💜'}
        </p>

        <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-[#A7B7A0]/70">
          <span>Timezone: {content.settings.timezone || 'Asia/Kolkata'}</span>
          <span>·</span>
          <button
            onClick={() => handleNavigate('calendar')}
            className="hover:text-[#F6F1E8] underline"
          >
            Private Calendar
          </button>
          <span>·</span>
          <button
            onClick={handleOpenAdminPortal}
            className="hover:text-[#B8A8D9] text-[10px] opacity-40 hover:opacity-100 transition-opacity"
            title="Administrator Access"
          >
            Admin 🔒
          </button>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <InnerApp />
    </ThemeProvider>
  );
}
