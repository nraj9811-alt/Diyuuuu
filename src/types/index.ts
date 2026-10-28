export type ThemeMode =
  | 'forest'
  | 'lavender'
  | 'warm-cream'
  | 'midnight'
  | 'sakura'
  | 'matcha'
  | 'cinnamon';

export interface SiteSettings {
  siteName: string;
  heroHeading: string;
  heroSubtitle: string;
  heroSupporting: string;
  enterButtonText: string;
  recipientName: string;
  recipientNickname: string;
  creatorName: string;
  creatorRespectfulNickname: string;
  nicknames: string[];
  activeTheme: ThemeMode;
  timezone: string;
  footerMessage: string;
  calendarEnabled: boolean;
  cycleTrackingEnabled: boolean;
  reflectionsEnabled: boolean;
  ambientRainAudioEnabled: boolean;
  animationsEnabled: boolean;
}

export interface ComfortTip {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

export interface PeriodCareDay5Data {
  dayNumber: number;
  title: string;
  subtitle: string;
  summary: string;
  comfortTips: ComfortTip[];
  reassuranceMessage: string;
}

export interface NicknameItem {
  name: string;
  meaning: string;
}

export interface NicknameGeneratorData {
  nicknames: NicknameItem[];
}

export interface ComfortCategory {
  id: string;
  title: string;
  hindiTitle: string;
  icon: string;
  messages: string[];
}

export interface NoteItem {
  id: string;
  title: string;
  body: string;
  category: string;
  date: string;
  published: boolean;
  order: number;
}

export interface LetterItem {
  id: string;
  title: string;
  greeting: string;
  body: string;
  signature: string;
  date: string;
  published: boolean;
}

export interface AppreciationCard {
  id: string;
  title: string;
  message: string;
  icon: string;
  order: number;
  published: boolean;
}

export interface MemoryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  symbol: string;
  date: string;
  order: number;
  published: boolean;
}

export interface FamilyVisitEvent {
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  message: string;
  visible: boolean;
  autoArchive: boolean;
  order?: number;
}

export interface TodayPlanData {
  defaultActivity: string;
  supportiveNote: string;
}

export interface SurpriseEnvelopeData {
  previewTitle: string;
  hint: string;
  letterContent: string;
  signature: string;
}

export interface MiniGameConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  highScore: number;
  playCount: number;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  description: string;
  audioUrl: string;
  coverUrl?: string;
  duration: number;
  playlistId: string;
  order: number;
  published: boolean;
  isSynthesizedBuiltIn?: boolean;
}

export interface VerificationLog {
  id: string;
  mobileNumber: string;
  maskedPhone?: string;
  timestamp: string;
  otpVerified: boolean;
  dobVerified: boolean;
  accessGranted: boolean;
  failedAttempts: number;
  lastAttemptStatus?: string;
}

export interface SharedResponse {
  id: string;
  section: string;
  question?: string;
  responseText: string;
  submittedAt: string;
  telegramDelivered?: boolean;
}

export interface SurpriseEnvelopeItem {
  id: string;
  title: string;
  previewTitle: string;
  sealColor: string; // 'amber' | 'rose' | 'lavender' | 'emerald' | 'gold'
  hint: string;
  letterContent: string;
  signature: string;
  category: string;
}

export interface CyclePeriodLog {
  id: string;
  date: string;
  cycleDay: number;
  flow: 'Spotting' | 'Light' | 'Medium' | 'Heavy';
  crampLevel: number; // 1-10
  mood: string;
  symptoms: string[];
  cravings: string[];
  note?: string;
  submittedAt: string;
}

export interface CycleTrackerData {
  previousCycleStart: string;
  previousCycleEnd: string;
  currentCycleStart: string;
  cycleLengthDays: number;
  periodDurationDays: number;
  currentDay: number;
  logs: CyclePeriodLog[];
}

export interface KissHugStat {
  totalKisses: number;
  totalHugs: number;
  lastKissIntensity?: string;
  lastHugType?: string;
  lastMessage?: string;
}

export interface PublicContentResponse {
  settings: SiteSettings;
  periodCareDay5: PeriodCareDay5Data;
  periodDays: Record<number, PeriodCareDay5Data>;
  currentPeriodDay: number;
  cycleTracker: CycleTrackerData;
  nicknameGenerator: NicknameGeneratorData;
  comfortCorner: { categories: ComfortCategory[] };
  notes: NoteItem[];
  letters: LetterItem[];
  appreciationCards: AppreciationCard[];
  memories: MemoryItem[];
  familyVisitEvent: FamilyVisitEvent;
  todayPlan: TodayPlanData;
  surpriseEnvelope: SurpriseEnvelopeData;
  surpriseEnvelopes: SurpriseEnvelopeItem[];
  cuddleStats: KissHugStat;
  miniGames: Record<string, MiniGameConfig>;
  playlists: Playlist[];
  musicTracks: MusicTrack[];
  telegramConfigured: boolean;
  requireVerification: boolean;
  verificationConfig?: {
    requireVerification: boolean;
    expectedDob?: string;
  };
}
