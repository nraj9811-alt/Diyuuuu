import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeMode } from '../types';
import { soundManager } from '../utils/audioSynth';
import { logActivityEvents } from '../services/api';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  animationsEnabled: boolean;
  setAnimationsEnabled: (val: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  rainSoundActive: boolean;
  toggleRainSound: () => void;
  rainVolume: number;
  setRainVolume: (vol: number) => void;
  showNicknames: boolean;
  setShowNicknames: (val: boolean) => void;
  lampGlow: boolean;
  toggleLampGlow: () => void;
  sessionId: string;
  logAction: (eventType: string, section: string, details?: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('diyu_theme') as ThemeMode) || 'forest';
  });
  const [animationsEnabled, setAnimationsEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem('diyu_animations');
    return saved !== null ? saved === 'true' : true;
  });
  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [rainSoundActive, setRainSoundActive] = useState<boolean>(false);
  const [rainVolume, setRainVolumeState] = useState<number>(0.4);
  const [showNicknames, setShowNicknamesState] = useState<boolean>(() => {
    return localStorage.getItem('diyu_nicknames') !== 'false';
  });
  const [lampGlow, setLampGlow] = useState<boolean>(true);

  const [sessionId] = useState<string>(() => {
    let sid = sessionStorage.getItem('diyu_session_id');
    if (!sid) {
      sid = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
      sessionStorage.setItem('diyu_session_id', sid);
    }
    return sid;
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('diyu_theme', theme);
  }, [theme]);

  // Log session start, inactivity, and exit master report
  useEffect(() => {
    const startNotice = sessionStorage.getItem('diyu_session_logged');
    if (!startNotice) {
      sessionStorage.setItem('diyu_session_logged', 'true');
      logActivityEvents([
        {
          eventType: 'session_start',
          section: 'Welcome Screen',
          details: `Session started (${theme} theme)`,
          clientSessionId: sessionId,
        },
      ]);
    }

    const dispatchBeaconMasterReport = (reason: string) => {
      const payload = JSON.stringify({
        reason,
        clientSessionId: sessionId,
      });
      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/session/master-report', payload);
        } else {
          fetch('/api/session/master-report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true,
          }).catch(() => {});
        }
      } catch {
        // ignore
      }
    };

    const handleBeforeUnload = () => {
      dispatchBeaconMasterReport('🚪 Site Closed / Browser Tab Exited');
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        dispatchBeaconMasterReport('📱 Screen Minimized / Switched Away from Website');
      }
    };

    // 90-second client inactivity detector
    let inactivityTimer: ReturnType<typeof setTimeout> | null = null;
    let inactivityReported = false;

    const resetInactivityTimer = () => {
      inactivityReported = false;
      if (inactivityTimer) clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        if (!inactivityReported) {
          inactivityReported = true;
          dispatchBeaconMasterReport('⏳ Inactivity Detected (Idle for 90 seconds)');
        }
      }, 90 * 1000);
    };

    resetInactivityTimer();

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('click', resetInactivityTimer, { passive: true });
    window.addEventListener('touchstart', resetInactivityTimer, { passive: true });
    window.addEventListener('scroll', resetInactivityTimer, { passive: true });
    window.addEventListener('keydown', resetInactivityTimer, { passive: true });

    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('click', resetInactivityTimer);
      window.removeEventListener('touchstart', resetInactivityTimer);
      window.removeEventListener('scroll', resetInactivityTimer);
      window.removeEventListener('keydown', resetInactivityTimer);
    };
  }, [sessionId, theme]);

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    logAction('theme_change', 'Settings', `Switched theme to ${t}`);
  };

  const setAnimationsEnabled = (val: boolean) => {
    setAnimationsEnabledState(val);
    localStorage.setItem('diyu_animations', String(val));
  };

  const setReducedMotion = (val: boolean) => {
    setReducedMotionState(val);
  };

  const toggleRainSound = () => {
    const nextState = soundManager.toggleRain(rainVolume);
    setRainSoundActive(nextState);
  };

  const setRainVolume = (vol: number) => {
    setRainVolumeState(vol);
    soundManager.setRainVolume(vol);
  };

  const setShowNicknames = (val: boolean) => {
    setShowNicknamesState(val);
    localStorage.setItem('diyu_nicknames', String(val));
  };

  const toggleLampGlow = () => {
    setLampGlow((prev) => !prev);
    soundManager.playComfortChime('click');
  };

  const logAction = (eventType: string, section: string, details?: string) => {
    logActivityEvents([
      {
        eventType,
        section,
        details: details || '',
        clientSessionId: sessionId,
      },
    ]);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        animationsEnabled,
        setAnimationsEnabled,
        reducedMotion,
        setReducedMotion,
        rainSoundActive,
        toggleRainSound,
        rainVolume,
        setRainVolume,
        showNicknames,
        setShowNicknames,
        lampGlow,
        toggleLampGlow,
        sessionId,
        logAction,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
