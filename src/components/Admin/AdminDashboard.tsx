import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  X,
  LogOut,
  LayoutDashboard,
  FileText,
  BookOpen,
  Heart,
  Gamepad2,
  Music,
  Send,
  Activity,
  MessageSquare,
  Key,
  Plus,
  Trash2,
  Edit,
  Save,
  Check,
  AlertCircle,
  RefreshCw,
  Upload,
  Calendar,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Copy,
  Sparkles,
} from 'lucide-react';
import {
  fetchAdminOverview,
  updateAdminSettings,
  saveAdminNote,
  deleteAdminNote,
  saveAdminLetter,
  saveAdminAppreciation,
  deleteAdminAppreciation,
  saveAdminMemory,
  deleteAdminMemory,
  updateAdminGame,
  resetAdminGameStats,
  uploadAdminMusic,
  deleteAdminMusic,
  updateAdminTelegram,
  testAdminTelegram,
  sendDailySummaryTelegram,
  fetchAdminActivityLogs,
  clearAdminActivityLogs,
  fetchAdminSharedResponses,
  deleteAdminSharedResponse,
  setAdminPassword,
  adminLogout,
  fetchVerificationLogs,
  revealVerificationPhone,
  deleteVerificationLog,
  clearAllVerificationLogs,
  updateVerificationConfig,
  fetchAdminEmailConfig,
  updateAdminEmailConfig,
  testAdminEmail,
  fetchAdminActiveOtps,
} from '../../services/api';
import { soundManager } from '../../utils/audioSynth';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshPublicContent: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onRefreshPublicContent,
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Content form state
  const [settingsForm, setSettingsForm] = useState<any>({});
  const [eventForm, setEventForm] = useState<any>({});
  const [envelopeForm, setEnvelopeForm] = useState<any>({});

  // Telegram form state
  const [telegramForm, setTelegramForm] = useState<any>({});
  const [telegramTesting, setTelegramTesting] = useState<boolean>(false);
  const [telegramTestResult, setTelegramTestResult] = useState<{ success?: boolean; msg?: string } | null>(null);

  // Notes editing state
  const [editingNote, setEditingNote] = useState<any | null>(null);
  const [editingLetter, setEditingLetter] = useState<any | null>(null);

  // Music upload state
  const [musicTitle, setMusicTitle] = useState<string>('');
  const [musicArtist, setMusicArtist] = useState<string>('Nishant Raj');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isUploadingMusic, setIsUploadingMusic] = useState<boolean>(false);

  // Password change state
  const [newPassword, setNewPassword] = useState<string>('');
  const [passStatus, setPassStatus] = useState<string | null>(null);

  // Activity logs & Visitor responses
  const [logs, setLogs] = useState<any[]>([]);
  const [logFilter, setLogFilter] = useState<string>('all');
  const [responses, setResponses] = useState<any[]>([]);

  // Email & SMTP state
  const [emailConfigForm, setEmailConfigForm] = useState<any>({
    enabled: true,
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    user: 'nraj9811@gmail.com',
    pass: '',
    fromName: 'DIYUUUU — Nishant Raj (Sir jiii) ☁️💜',
    fromEmail: 'nraj9811@gmail.com',
    lastSentAt: null,
    lastStatus: null,
    lastError: null,
  });
  const [activeOtps, setActiveOtps] = useState<any[]>([]);
  const [testEmailInput, setTestEmailInput] = useState<string>('nraj9811@gmail.com');
  const [isTestingEmail, setIsTestingEmail] = useState<boolean>(false);
  const [emailTestMsg, setEmailTestMsg] = useState<{ success?: boolean; text: string } | null>(null);
  const [showEmailPass, setShowEmailPass] = useState<boolean>(false);

  // Verification logs state
  const [verificationLogs, setVerificationLogs] = useState<any[]>([]);
  const [expectedDob, setExpectedDob] = useState<string>('2008-04-24');
  const [requireVerification, setRequireVerification] = useState<boolean>(true);
  const [revealedPhones, setRevealedPhones] = useState<Record<string, string>>({});

  const loadData = async () => {
    try {
      setLoading(true);
      const overview = await fetchAdminOverview();
      setData(overview);
      setSettingsForm(overview.settings || {});
      setEventForm(overview.familyVisitEvent || {});
      setEnvelopeForm(overview.surpriseEnvelope || {});
      setTelegramForm({
        botToken: 'MASKED_NO_CHANGE',
        chatId: overview.telegram?.chatId || '',
        notifyOnSharedResponse: overview.telegram?.notifyOnSharedResponse ?? true,
        notifyOnSessionStart: overview.telegram?.notifyOnSessionStart ?? true,
        notifyOnGamePlay: overview.telegram?.notifyOnGamePlay ?? true,
        notifyOnMusicPlay: overview.telegram?.notifyOnMusicPlay ?? false,
        notifyOnDailySummary: overview.telegram?.notifyOnDailySummary ?? true,
        dailySummaryTime: overview.telegram?.dailySummaryTime || '21:00',
      });
      setResponses(overview.recentResponses || []);

      const vLogs = await fetchVerificationLogs().catch(() => ({ logs: [], expectedDob: '2008-04-24', requireVerification: true, totalCount: 0 }));
      setVerificationLogs(vLogs.logs || []);
      setExpectedDob(vLogs.expectedDob || '2008-04-24');
      setRequireVerification(vLogs.requireVerification !== false);

      const emailConf = await fetchAdminEmailConfig().catch(() => null);
      if (emailConf?.emailConfig) {
        setEmailConfigForm(emailConf.emailConfig);
        if (emailConf.emailConfig.user) {
          setTestEmailInput(emailConf.emailConfig.user);
        }
      }

      const activeList = await fetchAdminActiveOtps().catch(() => ({ activeOtps: [] }));
      setActiveOtps(activeList.activeOtps || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmailConfig = async () => {
    try {
      await updateAdminEmailConfig(emailConfigForm);
      showToast('Email settings saved successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to update email configuration');
    }
  };

  const handleTestEmail = async () => {
    if (!testEmailInput.trim()) {
      alert('Please enter a test email address');
      return;
    }
    setIsTestingEmail(true);
    setEmailTestMsg(null);
    try {
      const res = await testAdminEmail(testEmailInput.trim());
      setEmailTestMsg({ success: true, text: res.message || 'Test email dispatched successfully!' });
      soundManager.playComfortChime('success');
    } catch (err: any) {
      setEmailTestMsg({ success: false, text: err.message || 'Failed to send test email' });
    } finally {
      setIsTestingEmail(false);
    }
  };

  const handleRefreshActiveOtps = async () => {
    try {
      const activeList = await fetchAdminActiveOtps();
      setActiveOtps(activeList.activeOtps || []);
      showToast('Active OTPs refreshed');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRevealPhone = async (id: string) => {
    try {
      const res = await revealVerificationPhone(id);
      setRevealedPhones((prev) => ({ ...prev, [id]: res.mobileNumber }));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteVerificationLog = async (id: string) => {
    try {
      await deleteVerificationLog(id);
      setVerificationLogs((prev) => prev.filter((l) => l.id !== id));
      showToast('Record deleted');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleClearAllVerificationLogs = async () => {
    if (!confirm('Are you sure you want to delete all verification logs?')) return;
    try {
      await clearAllVerificationLogs();
      setVerificationLogs([]);
      showToast('All verification logs cleared');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveVerificationConfig = async () => {
    try {
      await updateVerificationConfig({ expectedDob, requireVerification });
      showToast('Verification settings updated!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Save Settings
  const handleSaveSettings = async () => {
    try {
      await updateAdminSettings(settingsForm);
      showToast('Settings saved successfully!');
      onRefreshPublicContent();
      soundManager.playComfortChime('star');
    } catch (err: any) {
      alert(err.message || 'Failed to save settings');
    }
  };

  // Save Family Visit Event
  const handleSaveEvent = async () => {
    try {
      const res = await fetch('/api/admin/family-visit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('diyu_admin_token')}`,
        },
        body: JSON.stringify(eventForm),
      });
      if (!res.ok) throw new Error('Failed to save visit event');
      showToast('Family visit card updated!');
      onRefreshPublicContent();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Save Surprise Envelope
  const handleSaveEnvelope = async () => {
    try {
      const res = await fetch('/api/admin/surprise-envelope', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('diyu_admin_token')}`,
        },
        body: JSON.stringify(envelopeForm),
      });
      if (!res.ok) throw new Error('Failed to save envelope');
      showToast('Surprise envelope letter updated!');
      onRefreshPublicContent();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Notes actions
  const handleSaveNoteItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote) return;
    try {
      await saveAdminNote(editingNote);
      setEditingNote(null);
      await loadData();
      onRefreshPublicContent();
      showToast('Note saved!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteNoteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      await deleteAdminNote(id);
      await loadData();
      onRefreshPublicContent();
      showToast('Note deleted');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Telegram test
  const handleTestTelegram = async () => {
    setTelegramTesting(true);
    setTelegramTestResult(null);
    try {
      const res = await testAdminTelegram();
      setTelegramTestResult({ success: true, msg: res.message || 'Notification delivered to Telegram!' });
      soundManager.playComfortChime('success');
    } catch (err: any) {
      setTelegramTestResult({ success: false, msg: err.message || 'Failed to deliver to Telegram.' });
    } finally {
      setTelegramTesting(false);
    }
  };

  // Save Telegram settings
  const handleSaveTelegram = async () => {
    try {
      await updateAdminTelegram(telegramForm);
      showToast('Telegram configuration updated!');
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Upload Music
  const handleUploadMusicTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile && !musicTitle) return;
    setIsUploadingMusic(true);
    try {
      const fd = new FormData();
      if (audioFile) fd.append('audio', audioFile);
      if (coverFile) fd.append('cover', coverFile);
      fd.append('title', musicTitle || audioFile?.name || 'New Track');
      fd.append('artist', musicArtist || 'Nishant Raj');
      fd.append('duration', '180');
      fd.append('playlistId', 'cloudy-day');

      await uploadAdminMusic(fd);
      setMusicTitle('');
      setAudioFile(null);
      setCoverFile(null);
      await loadData();
      onRefreshPublicContent();
      showToast('Track uploaded successfully!');
      soundManager.playComfortChime('star');
    } catch (err: any) {
      alert(err.message || 'Failed to upload audio');
    } finally {
      setIsUploadingMusic(false);
    }
  };

  // Password update
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }
    try {
      await setAdminPassword(newPassword);
      setPassStatus('Admin password updated successfully!');
      setNewPassword('');
    } catch (err: any) {
      setPassStatus('Failed to update password: ' + err.message);
    }
  };

  // Logout
  const handleLogout = async () => {
    await adminLogout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative max-w-6xl w-full h-[92vh] rounded-3xl bg-[#122A25] border border-[#B8A8D9]/40 shadow-2xl flex flex-col overflow-hidden text-[#F6F1E8]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#B8A8D9]/20 flex items-center justify-between bg-[#173B32]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#102A25] border border-[#B8A8D9]/30 flex items-center justify-center text-lg">
              👑
            </div>
            <div>
              <h1 className="font-serif-title text-xl sm:text-2xl font-bold text-[#FFFDF8] leading-none">
                Diyuuuu Comfort Corner — Admin Control
              </h1>
              <p className="text-[11px] text-[#A7B7A0] mt-0.5 font-body">
                Managed with love by Nishant Raj (Your Sir jiii)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveStatus && (
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-300 animate-fade-in">
                {saveStatus}
              </span>
            )}

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-[#102A25] border border-[#B8A8D9]/20 text-xs text-[#A7B7A0] hover:text-rose-300 flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#A7B7A0] hover:text-[#FFFDF8] hover:bg-[#102A25]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Sidebar & Content Tabs */}
        <div className="flex-1 flex overflow-hidden">
          {/* Navigation Tabs Bar */}
          <div className="w-48 sm:w-60 border-r border-[#B8A8D9]/15 bg-[#102A25]/80 p-3 space-y-1 overflow-y-auto shrink-0">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'content', label: 'Hero & Content', icon: FileText },
              { id: 'notes', label: 'Notes & Letters', icon: BookOpen },
              { id: 'appreciation', label: 'Appreciation Cards', icon: Heart },
              { id: 'games', label: 'Mini-Games', icon: Gamepad2 },
              { id: 'music', label: 'Music Uploader', icon: Music },
              { id: 'telegram', label: 'Telegram Bot & Logs', icon: Send },
              { id: 'email', label: 'Email & SMTP (OTP)', icon: Mail },
              { id: 'verification', label: 'Access & Verification Logs', icon: ShieldCheck },
              { id: 'responses', label: 'Visitor Responses', icon: MessageSquare },
              { id: 'activity', label: 'Analytics & Activity', icon: Activity },
              { id: 'security', label: 'Security & Password', icon: Key },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2.5 transition-all text-left ${
                    isActive
                      ? 'bg-[#173B32] text-[#B8A8D9] border border-[#B8A8D9]/40 font-semibold shadow-sm'
                      : 'text-[#A7B7A0] hover:text-[#FFFDF8] hover:bg-[#173B32]/40'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Tab Panel */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-[#0E221E]/60">
            {loading ? (
              <div className="flex items-center justify-center h-64 text-sm text-[#A7B7A0]">
                Loading admin overview...
              </div>
            ) : (
              <>
                {/* TAB 1: OVERVIEW */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <h2 className="font-serif-title text-2xl font-bold text-[#FFFDF8]">
                      Comfort Space Status
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-5 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/20 space-y-2">
                        <span className="text-xs text-[#A7B7A0]">Website Status</span>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-sm font-bold text-[#FFFDF8]">Live & Comforting</span>
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/20 space-y-2">
                        <span className="text-xs text-[#A7B7A0]">Telegram Bot Status</span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              data?.telegram?.configured ? 'bg-emerald-400' : 'bg-amber-400'
                            }`}
                          />
                          <span className="text-sm font-bold text-[#FFFDF8]">
                            {data?.telegram?.configured ? 'Connected & Ready' : 'Setup Required'}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/20 space-y-2">
                        <span className="text-xs text-[#A7B7A0]">Recorded Visitor Logs</span>
                        <p className="text-2xl font-bold text-[#B8A8D9]">{data?.activityLogsCount || 0}</p>
                      </div>

                      <div className="p-5 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/20 space-y-2">
                        <span className="text-xs text-[#A7B7A0]">Shared Thoughts from Divya</span>
                        <p className="text-2xl font-bold text-[#E8B878]">{data?.sharedResponsesCount || 0}</p>
                      </div>
                    </div>

                    {/* Quick Activity Summary */}
                    <div className="p-6 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/20 space-y-4">
                      <h3 className="font-serif-title text-xl font-bold text-[#FFFDF8]">
                        Quick Summary
                      </h3>
                      <p className="text-xs sm:text-sm text-[#A7B7A0] leading-relaxed">
                        This digital haven was crafted for Divya (Diyuuuu). You can customize every piece of text, upload relaxing music tracks, configure the family visit date, and manage Telegram alerts directly from the tabs on the left.
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 2: HERO & CONTENT */}
                {activeTab === 'content' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="font-serif-title text-2xl font-bold text-[#FFFDF8]">
                        Edit Welcome Screen & Content
                      </h2>
                      <button
                        onClick={handleSaveSettings}
                        className="px-4 py-2 rounded-xl bg-[#B8A8D9] text-[#102A25] font-semibold text-xs flex items-center gap-1.5 hover:bg-[#D8CEEE]"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save All Changes</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-[#A7B7A0]">Main Hero Heading:</label>
                        <input
                          type="text"
                          value={settingsForm.heroHeading || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, heroHeading: e.target.value })}
                          className="w-full mt-1 p-3 rounded-xl bg-[#102A25] border border-[#B8A8D9]/25 text-sm text-[#FFFDF8]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#A7B7A0]">Subtitle:</label>
                        <input
                          type="text"
                          value={settingsForm.heroSubtitle || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                          className="w-full mt-1 p-3 rounded-xl bg-[#102A25] border border-[#B8A8D9]/25 text-sm text-[#FFFDF8]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#A7B7A0]">Supporting Welcome Message:</label>
                        <textarea
                          rows={2}
                          value={settingsForm.heroSupporting || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, heroSupporting: e.target.value })}
                          className="w-full mt-1 p-3 rounded-xl bg-[#102A25] border border-[#B8A8D9]/25 text-sm text-[#FFFDF8]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#A7B7A0]">Enter Button Text:</label>
                        <input
                          type="text"
                          value={settingsForm.enterButtonText || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, enterButtonText: e.target.value })}
                          className="w-full mt-1 p-3 rounded-xl bg-[#102A25] border border-[#B8A8D9]/25 text-sm text-[#FFFDF8]"
                        />
                      </div>

                      {/* Configurable Family Visit Event */}
                      <div className="pt-4 border-t border-[#B8A8D9]/20 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif-title text-xl font-bold text-[#E8B878]">
                            Family Visit Card (Bua & Dadi's Home)
                          </h3>
                          <button
                            onClick={handleSaveEvent}
                            className="px-3.5 py-1.5 rounded-xl bg-[#E8B878] text-[#102A25] text-xs font-bold"
                          >
                            Save Event
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-semibold text-[#A7B7A0]">Event Title:</label>
                            <input
                              type="text"
                              value={eventForm.title || ''}
                              onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                              className="w-full mt-1 p-3 rounded-xl bg-[#102A25] border border-[#B8A8D9]/25 text-sm text-[#FFFDF8]"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-[#A7B7A0]">Event Date (YYYY-MM-DD):</label>
                            <input
                              type="date"
                              value={eventForm.date || ''}
                              onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                              className="w-full mt-1 p-3 rounded-xl bg-[#102A25] border border-[#B8A8D9]/25 text-sm text-[#FFFDF8]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-[#A7B7A0]">Comforting Message for the Visit:</label>
                          <textarea
                            rows={2}
                            value={eventForm.message || ''}
                            onChange={(e) => setEventForm({ ...eventForm, message: e.target.value })}
                            className="w-full mt-1 p-3 rounded-xl bg-[#102A25] border border-[#B8A8D9]/25 text-sm text-[#FFFDF8]"
                          />
                        </div>
                      </div>

                      {/* Surprise Envelope Content */}
                      <div className="pt-4 border-t border-[#B8A8D9]/20 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif-title text-xl font-bold text-[#D8CEEE]">
                            Surprise Envelope Letter 💌
                          </h3>
                          <button
                            onClick={handleSaveEnvelope}
                            className="px-3.5 py-1.5 rounded-xl bg-[#B8A8D9] text-[#102A25] text-xs font-bold"
                          >
                            Save Envelope Letter
                          </button>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-[#A7B7A0]">Letter Content for Diyuuuu:</label>
                          <textarea
                            rows={5}
                            value={envelopeForm.letterContent || ''}
                            onChange={(e) => setEnvelopeForm({ ...envelopeForm, letterContent: e.target.value })}
                            className="w-full mt-1 p-3 rounded-xl bg-[#102A25] border border-[#B8A8D9]/25 text-sm text-[#FFFDF8]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-[#A7B7A0]">Signature:</label>
                          <input
                            type="text"
                            value={envelopeForm.signature || ''}
                            onChange={(e) => setEnvelopeForm({ ...envelopeForm, signature: e.target.value })}
                            className="w-full mt-1 p-3 rounded-xl bg-[#102A25] border border-[#B8A8D9]/25 text-sm text-[#FFFDF8]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: NOTES & LETTERS */}
                {activeTab === 'notes' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="font-serif-title text-2xl font-bold text-[#FFFDF8]">
                        Manage Notes ({data?.notes?.length || 0})
                      </h2>
                      <button
                        onClick={() =>
                          setEditingNote({
                            id: 'new-' + Date.now(),
                            title: '',
                            body: '',
                            category: 'Little reminders',
                            date: new Date().toISOString().split('T')[0],
                            published: true,
                          })
                        }
                        className="px-3.5 py-2 rounded-xl bg-[#B8A8D9] text-[#102A25] text-xs font-bold flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Note</span>
                      </button>
                    </div>

                    {/* Note editor form modal if active */}
                    {editingNote && (
                      <form onSubmit={handleSaveNoteItem} className="p-6 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/30 space-y-4">
                        <h3 className="font-serif-title text-xl font-bold text-[#FFFDF8]">
                          {editingNote.id.startsWith('new-') ? 'Create Note' : 'Edit Note'}
                        </h3>
                        <div>
                          <label className="text-xs text-[#A7B7A0]">Title:</label>
                          <input
                            type="text"
                            required
                            value={editingNote.title}
                            onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                            className="w-full mt-1 p-2.5 rounded-xl bg-[#102A25] border border-[#B8A8D9]/20 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-[#A7B7A0]">Category:</label>
                          <select
                            value={editingNote.category}
                            onChange={(e) => setEditingNote({ ...editingNote, category: e.target.value })}
                            className="w-full mt-1 p-2.5 rounded-xl bg-[#102A25] border border-[#B8A8D9]/20 text-xs text-white"
                          >
                            <option value="Little reminders">Little reminders</option>
                            <option value="Things worth remembering">Things worth remembering</option>
                            <option value="Cloudy-day notes">Cloudy-day notes</option>
                            <option value="Appreciation">Appreciation</option>
                            <option value="Small memories">Small memories</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs text-[#A7B7A0]">Body:</label>
                          <textarea
                            rows={3}
                            required
                            value={editingNote.body}
                            onChange={(e) => setEditingNote({ ...editingNote, body: e.target.value })}
                            className="w-full mt-1 p-2.5 rounded-xl bg-[#102A25] border border-[#B8A8D9]/20 text-xs text-white"
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingNote(null)}
                            className="px-4 py-2 rounded-xl text-xs text-[#A7B7A0]"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-xl bg-[#B8A8D9] text-[#102A25] text-xs font-bold"
                          >
                            Save Note
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="space-y-3">
                      {data?.notes?.map((n: any) => (
                        <div
                          key={n.id}
                          className="p-4 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/15 flex items-start justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <span className="text-[10px] text-[#B8A8D9] uppercase font-semibold">{n.category}</span>
                            <h4 className="text-sm font-bold text-[#FFFDF8]">{n.title}</h4>
                            <p className="text-xs text-[#F6F1E8]/80 line-clamp-2">{n.body}</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => setEditingNote(n)}
                              className="p-1.5 rounded-lg text-[#A7B7A0] hover:text-[#B8A8D9]"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteNoteItem(n.id)}
                              className="p-1.5 rounded-lg text-[#A7B7A0] hover:text-rose-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: APPRECIATION & MEMORIES */}
                {activeTab === 'appreciation' && (
                  <div className="space-y-6">
                    <h2 className="font-serif-title text-2xl font-bold text-[#FFFDF8]">
                      Appreciation Cards & Memory Garden
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {data?.appreciationCards?.map((c: any) => (
                        <div key={c.id} className="p-4 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/15 space-y-2">
                          <h4 className="text-sm font-bold text-[#FFFDF8]">{c.title}</h4>
                          <p className="text-xs text-[#F6F1E8]/80 italic">"{c.message}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 5: MINI-GAMES */}
                {activeTab === 'games' && (
                  <div className="space-y-6">
                    <h2 className="font-serif-title text-2xl font-bold text-[#FFFDF8]">
                      Mini-Games Management
                    </h2>
                    <div className="space-y-3">
                      {Object.values(data?.miniGames || {}).map((g: any) => (
                        <div
                          key={g.id}
                          className="p-4 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/15 flex items-center justify-between gap-4"
                        >
                          <div>
                            <h4 className="text-sm font-bold text-[#FFFDF8]">{g.name}</h4>
                            <p className="text-xs text-[#A7B7A0]">{g.description}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={async () => {
                                await resetAdminGameStats(g.id);
                                loadData();
                                showToast('Stats reset');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-[#102A25] text-xs text-[#A7B7A0] hover:text-white"
                            >
                              Reset Stats
                            </button>
                            <button
                              onClick={async () => {
                                await updateAdminGame(g.id, { enabled: !g.enabled });
                                loadData();
                                onRefreshPublicContent();
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                                g.enabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                              }`}
                            >
                              {g.enabled ? 'Enabled' : 'Disabled'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 6: MUSIC UPLOADER */}
                {activeTab === 'music' && (
                  <div className="space-y-6">
                    <h2 className="font-serif-title text-2xl font-bold text-[#FFFDF8]">
                      Music Uploader & Player Management
                    </h2>

                    {/* Real Audio Upload Form */}
                    <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-400/30 text-xs text-purple-200 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-purple-300 shrink-0 mt-0.5" />
                      <div>
                        <strong>Unlimited Music Uploads:</strong> Aap yahan ek-ek karke jitne chahein utne audio tracks upload kar sakte hain! Har upload ke baad naya track niche list mein judta jayega aur Divya ke vinyl turntable player mein add ho jayega.
                      </div>
                    </div>

                    <form
                      onSubmit={handleUploadMusicTrack}
                      className="p-6 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/30 space-y-4"
                    >
                      <h3 className="text-sm font-semibold text-[#B8A8D9] uppercase tracking-wider flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        <span>Upload Audio Track (MP3, WAV, AAC)</span>
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-[#A7B7A0]">Track Title:</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Evening Chai & Rain"
                            value={musicTitle}
                            onChange={(e) => setMusicTitle(e.target.value)}
                            className="w-full mt-1 p-2.5 rounded-xl bg-[#102A25] border border-[#B8A8D9]/20 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-[#A7B7A0]">Artist / Attribution:</label>
                          <input
                            type="text"
                            placeholder="e.g. Nishant Raj"
                            value={musicArtist}
                            onChange={(e) => setMusicArtist(e.target.value)}
                            className="w-full mt-1 p-2.5 rounded-xl bg-[#102A25] border border-[#B8A8D9]/20 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-[#A7B7A0]">Select Audio File:</label>
                          <input
                            type="file"
                            accept="audio/*"
                            required
                            onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                            className="w-full mt-1 p-2 rounded-xl bg-[#102A25] border border-[#B8A8D9]/20 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-[#A7B7A0]">Optional Cover Art Image:</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                            className="w-full mt-1 p-2 rounded-xl bg-[#102A25] border border-[#B8A8D9]/20 text-xs text-white"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isUploadingMusic || !audioFile}
                        className="px-6 py-2.5 rounded-xl bg-[#B8A8D9] text-[#102A25] font-semibold text-xs disabled:opacity-50 hover:bg-[#D8CEEE] transition-all flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{isUploadingMusic ? 'Uploading & Persisting...' : 'Upload Music Track'}</span>
                      </button>
                    </form>

                    {/* Existing Tracks List */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-[#FFFDF8]">
                        Configured Tracks ({data?.musicTracks?.length || 0})
                      </h3>
                      {data?.musicTracks?.map((t: any) => (
                        <div
                          key={t.id}
                          className="p-4 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/15 flex items-center justify-between gap-4"
                        >
                          <div>
                            <h4 className="text-sm font-bold text-[#FFFDF8]">{t.title}</h4>
                            <p className="text-xs text-[#A7B7A0]">{t.artist} · {t.isSynthesizedBuiltIn ? 'Built-in Audio Stream' : 'Uploaded File'}</p>
                          </div>
                          {!t.isSynthesizedBuiltIn && (
                            <button
                              onClick={async () => {
                                if (confirm('Delete track?')) {
                                  await deleteAdminMusic(t.id);
                                  loadData();
                                  onRefreshPublicContent();
                                }
                              }}
                              className="p-1.5 text-rose-400 hover:text-rose-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 7: TELEGRAM BOT & MONITORING */}
                {activeTab === 'telegram' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="font-serif-title text-2xl font-bold text-[#FFFDF8]">
                        Telegram Bot & Real-Time Monitoring
                      </h2>
                      <button
                        onClick={handleSaveTelegram}
                        className="px-4 py-2 rounded-xl bg-[#B8A8D9] text-[#102A25] font-semibold text-xs flex items-center gap-1.5 hover:bg-[#D8CEEE]"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Telegram Settings</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/25 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-[#A7B7A0]">
                            Telegram Bot Token (from @BotFather):
                          </label>
                          <input
                            type="password"
                            placeholder={data?.telegram?.hasToken ? `Token saved (${data?.telegram?.maskedToken})` : 'Enter bot token...'}
                            onChange={(e) => setTelegramForm({ ...telegramForm, botToken: e.target.value })}
                            className="w-full mt-1 p-2.5 rounded-xl bg-[#102A25] border border-[#B8A8D9]/20 text-xs text-white"
                          />
                          <p className="text-[10px] text-[#A7B7A0] mt-1">
                            Tokens are kept securely on the server and never exposed in browser HTML.
                          </p>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-[#A7B7A0]">
                            Recipient Telegram Chat ID:
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 123456789"
                            value={telegramForm.chatId || ''}
                            onChange={(e) => setTelegramForm({ ...telegramForm, chatId: e.target.value })}
                            className="w-full mt-1 p-2.5 rounded-xl bg-[#102A25] border border-[#B8A8D9]/20 text-xs text-white"
                          />
                        </div>
                      </div>

                      {/* Test Notification Button */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={handleTestTelegram}
                          disabled={telegramTesting}
                          className="px-4 py-2 rounded-xl bg-[#102A25] border border-[#B8A8D9]/30 text-xs font-semibold text-[#B8A8D9] hover:bg-[#1C453B] flex items-center gap-2"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{telegramTesting ? 'Sending Live Test...' : 'Send Test Notification to Telegram'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await sendDailySummaryTelegram();
                              showToast('Daily summary delivered to Telegram!');
                            } catch (err: any) {
                              alert(err.message);
                            }
                          }}
                          className="px-4 py-2 rounded-xl bg-[#102A25] border border-[#B8A8D9]/30 text-xs font-semibold text-[#E8B878] hover:bg-[#1C453B]"
                        >
                          Send Daily Summary Now
                        </button>
                      </div>

                      {telegramTestResult && (
                        <div
                          className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                            telegramTestResult.success
                              ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-200'
                              : 'bg-rose-950/70 border border-rose-500/40 text-rose-200'
                          }`}
                        >
                          {telegramTestResult.success ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                          <span>{telegramTestResult.msg}</span>
                        </div>
                      )}

                      {/* Notification Toggles */}
                      <div className="space-y-2 pt-3 border-t border-[#B8A8D9]/15">
                        <span className="text-xs font-semibold text-[#FFFDF8]">
                          Real-Time Notification Categories:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={telegramForm.notifyOnSharedResponse}
                              onChange={(e) => setTelegramForm({ ...telegramForm, notifyOnSharedResponse: e.target.checked })}
                              className="accent-[#B8A8D9] rounded"
                            />
                            <span>When visitor sends a shared note / thought</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={telegramForm.notifyOnSessionStart}
                              onChange={(e) => setTelegramForm({ ...telegramForm, notifyOnSessionStart: e.target.checked })}
                              className="accent-[#B8A8D9] rounded"
                            />
                            <span>When visitor opens the website (Session start)</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={telegramForm.notifyOnGamePlay}
                              onChange={(e) => setTelegramForm({ ...telegramForm, notifyOnGamePlay: e.target.checked })}
                              className="accent-[#B8A8D9] rounded"
                            />
                            <span>When visitor plays a mini-game</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={telegramForm.notifyOnDailySummary}
                              onChange={(e) => setTelegramForm({ ...telegramForm, notifyOnDailySummary: e.target.checked })}
                              className="accent-[#B8A8D9] rounded"
                            />
                            <span>Daily activity summary</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: ACCESS & VERIFICATION LOGS */}
                {activeTab === 'verification' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="font-serif-title text-2xl font-bold text-[#FFFDF8] flex items-center gap-2">
                          <ShieldCheck className="w-6 h-6 text-[#B8A8D9]" />
                          Access & Verification Logs
                        </h2>
                        <p className="text-xs text-[#A7B7A0] mt-0.5">
                          Personalized 2-step verification audit logs (Mobile OTP + DOB) and policy settings.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={loadData}
                          className="px-3 py-1.5 rounded-xl bg-[#173B32] border border-[#B8A8D9]/25 text-xs text-[#FFFDF8] hover:bg-[#102A25] flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Refresh</span>
                        </button>
                        {verificationLogs.length > 0 && (
                          <button
                            onClick={handleClearAllVerificationLogs}
                            className="px-3 py-1.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs hover:bg-rose-900/60 flex items-center gap-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Clear All Logs</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Verification Configuration Card */}
                    <div className="p-5 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/25 space-y-4">
                      <h3 className="font-serif-title text-base font-semibold text-[#FFFDF8] flex items-center gap-2">
                        <Lock className="w-4 h-4 text-[#E8B878]" />
                        Verification Security Settings
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs text-[#A7B7A0]">Expected Date of Birth (Step 2 Check):</label>
                          <input
                            type="date"
                            value={expectedDob}
                            onChange={(e) => setExpectedDob(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-[#102A25] border border-[#B8A8D9]/30 text-xs text-[#FFFDF8]"
                          />
                          <p className="text-[11px] text-[#A7B7A0]">
                            Configured default: 24 April 2008 (<code className="text-[#B8A8D9]">2008-04-24</code>). Never revealed to visitor.
                          </p>
                        </div>

                        <div className="space-y-2 flex flex-col justify-center">
                          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-[#102A25] border border-[#B8A8D9]/20">
                            <input
                              type="checkbox"
                              checked={requireVerification}
                              onChange={(e) => setRequireVerification(e.target.checked)}
                              className="w-4 h-4 rounded accent-[#B8A8D9]"
                            />
                            <div>
                              <div className="text-xs font-semibold text-[#FFFDF8]">Require 2-Step Gate for Visitors</div>
                              <div className="text-[11px] text-[#A7B7A0]">
                                When active, unverified visitors must complete Mobile OTP & DOB checks.
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={handleSaveVerificationConfig}
                          className="px-4 py-2 rounded-xl bg-[#B8A8D9] text-[#102A25] font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-[#d0c2ee]"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Verification Settings</span>
                        </button>
                      </div>
                    </div>

                    {/* Stats Metric Counters */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-xl bg-[#173B32] border border-[#B8A8D9]/20">
                        <span className="text-[11px] text-[#A7B7A0] block">Total Submissions</span>
                        <span className="text-xl font-bold text-[#FFFDF8] font-serif-title">{verificationLogs.length}</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#173B32] border border-[#B8A8D9]/20">
                        <span className="text-[11px] text-[#A7B7A0] block">OTP Verified</span>
                        <span className="text-xl font-bold text-emerald-400 font-serif-title">
                          {verificationLogs.filter((l) => l.otpVerified).length}
                        </span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#173B32] border border-[#B8A8D9]/20">
                        <span className="text-[11px] text-[#A7B7A0] block">DOB Verified</span>
                        <span className="text-xl font-bold text-sky-400 font-serif-title">
                          {verificationLogs.filter((l) => l.dobVerified).length}
                        </span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#173B32] border border-[#B8A8D9]/20">
                        <span className="text-[11px] text-[#A7B7A0] block">Access Granted</span>
                        <span className="text-xl font-bold text-[#E8B878] font-serif-title">
                          {verificationLogs.filter((l) => l.accessGranted).length}
                        </span>
                      </div>
                    </div>

                    {/* Verification Records Table */}
                    <div className="p-5 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/25 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif-title text-base font-semibold text-[#FFFDF8]">
                          Verification History ({verificationLogs.length})
                        </h3>
                        <span className="text-[11px] text-[#A7B7A0]">All timestamps in Asia/Kolkata</span>
                      </div>

                      {verificationLogs.length === 0 ? (
                        <div className="p-8 text-center text-xs text-[#A7B7A0] bg-[#102A25] rounded-xl border border-dashed border-[#B8A8D9]/20">
                          No verification attempts recorded yet.
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs text-[#F6F1E8]">
                            <thead>
                              <tr className="border-b border-[#B8A8D9]/20 text-[#A7B7A0]">
                                <th className="pb-3 pr-4 font-semibold">Mobile Number</th>
                                <th className="pb-3 px-4 font-semibold">Email Address</th>
                                <th className="pb-3 px-4 font-semibold">Submitted At (IST)</th>
                                <th className="pb-3 px-4 font-semibold">OTP Status</th>
                                <th className="pb-3 px-4 font-semibold">DOB Status</th>
                                <th className="pb-3 px-4 font-semibold">Access</th>
                                <th className="pb-3 px-4 font-semibold">Failures</th>
                                <th className="pb-3 pl-4 text-right font-semibold">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#B8A8D9]/10">
                              {verificationLogs.map((log) => {
                                const isRevealed = Boolean(revealedPhones[log.id]);
                                const displayNumber = isRevealed ? revealedPhones[log.id] : (log.maskedPhone || log.mobileMasked || log.mobileNumber);

                                return (
                                  <tr key={log.id} className="hover:bg-[#102A25]/40 transition-colors">
                                    <td className="py-3 pr-4 font-mono">
                                      <div className="flex items-center gap-2">
                                        <span className="text-[#FFFDF8] font-medium">{displayNumber}</span>
                                        <button
                                          onClick={() => handleRevealPhone(log.id)}
                                          title={isRevealed ? 'Revealed' : 'Click to reveal full phone number'}
                                          className="p-1 rounded-md text-[#A7B7A0] hover:text-[#FFFDF8] hover:bg-[#102A25]"
                                        >
                                          {isRevealed ? <EyeOff className="w-3.5 h-3.5 text-emerald-400" /> : <Eye className="w-3.5 h-3.5" />}
                                        </button>
                                      </div>
                                    </td>
                                    <td className="py-3 px-4 text-[#B8A8D9] font-medium">
                                      {log.email || '—'}
                                    </td>
                                    <td className="py-3 px-4 text-[#A7B7A0] whitespace-nowrap">
                                      {log.submittedAt}
                                    </td>
                                    <td className="py-3 px-4">
                                      {log.otpVerified ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/70 border border-emerald-500/40 text-emerald-300">
                                          Verified ✅
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-950/70 border border-rose-500/40 text-rose-300">
                                          Pending / Failed
                                        </span>
                                      )}
                                    </td>
                                    <td className="py-3 px-4">
                                      {log.dobVerified ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/70 border border-emerald-500/40 text-emerald-300">
                                          Match ✅
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-950/70 border border-amber-500/40 text-amber-300">
                                          Pending / Failed
                                        </span>
                                      )}
                                    </td>
                                    <td className="py-3 px-4">
                                      {log.accessGranted ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#102A25] border border-[#E8B878]/60 text-[#E8B878]">
                                          Granted 🔓
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#102A25] border border-gray-600 text-gray-400">
                                          Denied 🔒
                                        </span>
                                      )}
                                    </td>
                                    <td className="py-3 px-4 text-[#A7B7A0]">
                                      {log.failureCount > 0 ? (
                                        <span className="text-amber-400 font-semibold">{log.failureCount} tries</span>
                                      ) : (
                                        <span>0</span>
                                      )}
                                    </td>
                                    <td className="py-3 pl-4 text-right">
                                      <button
                                        onClick={() => handleDeleteVerificationLog(log.id)}
                                        title="Delete this verification record"
                                        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 transition-colors"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div className="p-3 rounded-xl bg-[#102A25] border border-[#B8A8D9]/15 text-[11px] text-[#A7B7A0] flex items-center justify-between">
                        <span>
                          🔒 Privacy disclosure: Mobile numbers are masked by default. OTP values & expected DOB are never stored or exposed in logs.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 8: VISITOR RESPONSES */}
                {activeTab === 'responses' && (
                  <div className="space-y-6">
                    <h2 className="font-serif-title text-2xl font-bold text-[#FFFDF8]">
                      Visitor Shared Responses ({responses.length})
                    </h2>
                    {responses.length === 0 ? (
                      <div className="p-8 text-center text-xs text-[#A7B7A0] bg-[#173B32] rounded-2xl">
                        No messages have been shared yet.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {responses.map((r: any) => (
                          <div
                            key={r.id}
                            className="p-5 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/20 space-y-2"
                          >
                            <div className="flex items-center justify-between text-xs text-[#B8A8D9]">
                              <span className="font-semibold">{r.section}</span>
                              <div className="flex items-center gap-3">
                                <span>{r.submittedAt}</span>
                                <button
                                  onClick={async () => {
                                    await deleteAdminSharedResponse(r.id);
                                    setResponses((prev) => prev.filter((item) => item.id !== r.id));
                                  }}
                                  className="text-[#A7B7A0] hover:text-rose-400"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            {r.question && <p className="text-xs text-[#A7B7A0] italic">{r.question}</p>}
                            <p className="text-sm text-[#FFFDF8] font-body bg-[#102A25] p-3 rounded-xl border border-[#B8A8D9]/10">
                              "{r.responseText}"
                            </p>
                            <div className="text-[11px] text-[#A7B7A0]">
                              Telegram Delivery:{' '}
                              <span className={r.telegramDelivered ? 'text-emerald-400' : 'text-amber-400'}>
                                {r.telegramDelivered ? 'Sent ✅' : 'Stored in database'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 9: ANALYTICS & ACTIVITY */}
                {activeTab === 'activity' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="font-serif-title text-2xl font-bold text-[#FFFDF8]">
                        Visitor Activity Logs & Analytics
                      </h2>
                      <button
                        onClick={async () => {
                          if (confirm('Clear logs?')) {
                            await clearAdminActivityLogs();
                            loadData();
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs"
                      >
                        Clear Activity Logs
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/20 text-xs text-[#A7B7A0]">
                      Total Events Logged: {data?.activityLogsCount || 0} (Timestamps in Asia/Kolkata)
                    </div>

                    <div className="space-y-2">
                      {data?.recentResponses?.slice(0, 30).map((log: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-[#173B32] border border-[#B8A8D9]/10 text-xs flex items-center justify-between gap-4"
                        >
                          <div>
                            <span className="font-semibold text-[#B8A8D9]">{log.section}:</span>{' '}
                            <span className="text-[#F6F1E8]">{log.responseText}</span>
                          </div>
                          <span className="text-[11px] text-[#A7B7A0] shrink-0">{log.submittedAt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB: EMAIL & SMTP SETUP */}
                {activeTab === 'email' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-serif-title text-2xl font-bold text-[#FFFDF8]">
                          Email & Gmail SMTP Setup (OTP Delivery)
                        </h2>
                        <p className="text-xs text-[#A7B7A0] mt-0.5">
                          Divya ke email par real-time OTP deliver karne ke liye Google App Password configure kijiye.
                        </p>
                      </div>
                      <button
                        onClick={handleRefreshActiveOtps}
                        className="px-3 py-1.5 rounded-xl bg-[#173B32] border border-[#B8A8D9]/30 text-xs text-[#B8A8D9] hover:text-[#FFFDF8] flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Refresh Active OTPs</span>
                      </button>
                    </div>

                    {/* LIVE ACTIVE OTPS MONITOR */}
                    <div className="p-5 rounded-2xl bg-[#173B32] border border-[#E8B878]/40 space-y-3 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                          <h3 className="text-sm font-bold text-[#FFFDF8] flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-[#E8B878]" />
                            Live Active Pending OTPs ({activeOtps.length})
                          </h3>
                        </div>
                        <span className="text-[11px] text-[#A7B7A0]">
                          Valid for 10 minutes from generation
                        </span>
                      </div>

                      {activeOtps.length === 0 ? (
                        <div className="p-4 rounded-xl bg-[#102A25]/70 border border-[#B8A8D9]/15 text-xs text-[#A7B7A0] text-center">
                          Abhi koi active OTP unverified nahi hai. Jab Divya OTP request karengi, unka code yahan instant live display hoga.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {activeOtps.map((o, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 rounded-xl bg-[#102A25] border border-[#B8A8D9]/30 flex items-center justify-between"
                            >
                              <div className="space-y-0.5">
                                <div className="text-xs font-semibold text-[#FFFDF8]">
                                  {o.email || o.phone}
                                </div>
                                <div className="text-[11px] text-[#A7B7A0]">
                                  Phone: {o.phone || '—'} · Expires in: <span className="text-[#E8B878] font-mono">{o.expiresInSeconds}s</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xl font-bold tracking-widest text-[#E8B878] bg-[#173B32] px-3 py-1 rounded-lg border border-[#B8A8D9]/30">
                                  {o.otp}
                                </span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(o.otp);
                                    showToast('OTP copied to clipboard!');
                                  }}
                                  className="p-2 rounded-lg bg-[#173B32] hover:bg-[#1f4e43] text-[#A7B7A0] hover:text-[#FFFDF8]"
                                  title="Copy OTP"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* GOOGLE APP PASSWORD INSTRUCTIONS */}
                    <div className="p-4 rounded-2xl bg-[#102A25]/80 border border-[#B8A8D9]/25 text-xs text-[#A7B7A0] space-y-2 leading-relaxed">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#E8B878]">
                        <Key className="w-4 h-4" />
                        <span>Google App Password Setup Guide (1 Minute Step):</span>
                      </div>
                      <p>
                        Gmail normal account password se third-party script login block karta hai. Real email OTP bhejne ke liye ek 16-letter App Password generate karna hota hai:
                      </p>
                      <ol className="list-decimal list-inside space-y-1 text-[#FFFDF8]/90 pl-1">
                        <li>Apne Google Account (<strong className="text-[#E8B878]">nraj9811@gmail.com</strong>) me login karein.</li>
                        <li><strong>Manage Google Account → Security → 2-Step Verification</strong> open karein.</li>
                        <li>Neeche scroll karke <strong>App passwords</strong> par click karein.</li>
                        <li>App name me <strong>DIYUUUU Mail</strong> likhkar "Create" karein.</li>
                        <li>Jo 16-character ka code (e.g. <code className="text-[#E8B878]">abcd efgh ijkl mnop</code>) milega, use neeche <strong>Google App Password</strong> me paste karein!</li>
                      </ol>
                    </div>

                    {/* SMTP CONFIGURATION FORM */}
                    <div className="p-6 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/25 space-y-4">
                      <div className="flex items-center justify-between border-b border-[#B8A8D9]/15 pb-3">
                        <h3 className="text-sm font-bold text-[#FFFDF8] flex items-center gap-2">
                          <Mail className="w-4 h-4 text-[#B8A8D9]" />
                          <span>SMTP Delivery Credentials</span>
                        </h3>
                        <label className="flex items-center gap-2 text-xs text-[#FFFDF8] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={emailConfigForm.enabled !== false}
                            onChange={(e) =>
                              setEmailConfigForm({ ...emailConfigForm, enabled: e.target.checked })
                            }
                            className="rounded accent-[#B8A8D9]"
                          />
                          <span>Enable Email Dispatch</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-[#A7B7A0] block mb-1">
                            Gmail Address / Username:
                          </label>
                          <input
                            type="email"
                            value={emailConfigForm.user || ''}
                            onChange={(e) =>
                              setEmailConfigForm({ ...emailConfigForm, user: e.target.value })
                            }
                            placeholder="nraj9811@gmail.com"
                            className="w-full p-2.5 rounded-xl bg-[#102A25] border border-[#B8A8D9]/25 text-xs text-[#FFFDF8] focus:outline-none focus:ring-1 focus:ring-[#B8A8D9]"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-[#A7B7A0] block mb-1">
                            Google App Password (16-char code):
                          </label>
                          <div className="relative">
                            <input
                              type={showEmailPass ? 'text' : 'password'}
                              value={emailConfigForm.pass || ''}
                              onChange={(e) =>
                                setEmailConfigForm({ ...emailConfigForm, pass: e.target.value })
                              }
                              placeholder="e.g. xxxx xxxx xxxx xxxx"
                              className="w-full p-2.5 pr-9 rounded-xl bg-[#102A25] border border-[#B8A8D9]/25 text-xs text-[#FFFDF8] font-mono focus:outline-none focus:ring-1 focus:ring-[#B8A8D9]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowEmailPass(!showEmailPass)}
                              className="absolute right-2.5 top-2.5 text-[#A7B7A0] hover:text-[#FFFDF8]"
                            >
                              {showEmailPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-[#A7B7A0] block mb-1">
                            Sender Display Name:
                          </label>
                          <input
                            type="text"
                            value={emailConfigForm.fromName || ''}
                            onChange={(e) =>
                              setEmailConfigForm({ ...emailConfigForm, fromName: e.target.value })
                            }
                            placeholder="DIYUUUU — Nishant Raj (Sir jiii) ☁️💜"
                            className="w-full p-2.5 rounded-xl bg-[#102A25] border border-[#B8A8D9]/25 text-xs text-[#FFFDF8] focus:outline-none focus:ring-1 focus:ring-[#B8A8D9]"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-[#A7B7A0] block mb-1">
                            From Address:
                          </label>
                          <input
                            type="email"
                            value={emailConfigForm.fromEmail || ''}
                            onChange={(e) =>
                              setEmailConfigForm({ ...emailConfigForm, fromEmail: e.target.value })
                            }
                            placeholder="nraj9811@gmail.com"
                            className="w-full p-2.5 rounded-xl bg-[#102A25] border border-[#B8A8D9]/25 text-xs text-[#FFFDF8] focus:outline-none focus:ring-1 focus:ring-[#B8A8D9]"
                          />
                        </div>
                      </div>

                      {/* Status Info */}
                      <div className="p-3 rounded-xl bg-[#102A25]/60 border border-[#B8A8D9]/15 text-xs text-[#A7B7A0] flex flex-wrap items-center justify-between gap-2">
                        <span>
                          Last Sent: <strong className="text-[#FFFDF8]">{emailConfigForm.lastSentAt || 'Never'}</strong>
                        </span>
                        <span>
                          Status: <strong className={emailConfigForm.lastStatus === 'success' ? 'text-emerald-400' : 'text-[#E8B878]'}>
                            {emailConfigForm.lastStatus || 'Not tested yet'}
                          </strong>
                        </span>
                        {emailConfigForm.lastError && (
                          <span className="text-rose-300 w-full text-[11px]">
                            Last Error: {emailConfigForm.lastError}
                          </span>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={handleSaveEmailConfig}
                          className="px-5 py-2.5 rounded-xl bg-[#B8A8D9] text-[#102A25] font-bold text-xs hover:bg-[#c9bde6] transition-all flex items-center gap-2"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Email Settings</span>
                        </button>
                      </div>
                    </div>

                    {/* SEND TEST EMAIL */}
                    <div className="p-5 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/25 space-y-3">
                      <h3 className="text-sm font-bold text-[#FFFDF8] flex items-center gap-2">
                        <Send className="w-4 h-4 text-[#E8B878]" />
                        <span>Send Test Verification Email</span>
                      </h3>
                      <p className="text-xs text-[#A7B7A0]">
                        Yeh check karne ke liye ki aapka Google App Password sahi se connect hua hai ya nahi, apne email par test verification mail send kijiye:
                      </p>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="email"
                          value={testEmailInput}
                          onChange={(e) => setTestEmailInput(e.target.value)}
                          placeholder="Recipient email (e.g. nraj9811@gmail.com)"
                          className="flex-1 p-2.5 rounded-xl bg-[#102A25] border border-[#B8A8D9]/25 text-xs text-[#FFFDF8] focus:outline-none focus:ring-1 focus:ring-[#B8A8D9]"
                        />
                        <button
                          onClick={handleTestEmail}
                          disabled={isTestingEmail}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B8A8D9] to-[#D8CEEE] text-[#102A25] font-bold text-xs hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 shrink-0"
                        >
                          {isTestingEmail ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Sending Test...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>Send Test Verification Email</span>
                            </>
                          )}
                        </button>
                      </div>

                      {emailTestMsg && (
                        <div
                          className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                            emailTestMsg.success
                              ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-200'
                              : 'bg-rose-950/70 border border-rose-500/40 text-rose-200'
                          }`}
                        >
                          {emailTestMsg.success ? (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                          <span>{emailTestMsg.text}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 10: SECURITY */}
                {activeTab === 'security' && (
                  <div className="space-y-6 max-w-md">
                    <h2 className="font-serif-title text-2xl font-bold text-[#FFFDF8]">
                      Admin Security Settings
                    </h2>
                    <form onSubmit={handleUpdatePassword} className="space-y-4 p-6 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/25">
                      <p className="text-xs text-[#A7B7A0]">
                        Update your administrator password from the default bootstrap phrase (<code className="text-[#E8B878]">MYLOVEDIVYA</code>) to your personal password.
                      </p>

                      <div>
                        <label className="text-xs text-[#A7B7A0]">New Custom Password (min 6 chars):</label>
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password..."
                          className="w-full mt-1 p-2.5 rounded-xl bg-[#102A25] border border-[#B8A8D9]/25 text-xs text-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-[#B8A8D9] text-[#102A25] font-bold text-xs"
                      >
                        Update Admin Password
                      </button>

                      {passStatus && (
                        <p className="text-xs text-[#E8B878]">{passStatus}</p>
                      )}
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
