import { PublicContentResponse, SharedResponse, VerificationLog } from '../types';

let adminToken: string | null = localStorage.getItem('diyu_admin_token');
let visitorSessionToken: string | null = localStorage.getItem('diyu_visitor_session');

export const setAdminToken = (token: string | null) => {
  adminToken = token;
  if (token) {
    localStorage.setItem('diyu_admin_token', token);
  } else {
    localStorage.removeItem('diyu_admin_token');
  }
};

export const getAdminToken = () => adminToken;

export const setVisitorSessionToken = (token: string | null) => {
  visitorSessionToken = token;
  if (token) {
    localStorage.setItem('diyu_visitor_session', token);
  } else {
    localStorage.removeItem('diyu_visitor_session');
  }
};

export const getVisitorSessionToken = () => visitorSessionToken;

const authHeaders = () => ({
  'Content-Type': 'application/json',
  ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
});

// Fetch Public Content
export async function fetchPublicContent(): Promise<PublicContentResponse> {
  const res = await fetch('/api/content');
  if (!res.ok) throw new Error('Failed to load site content');
  return res.json();
}

// TWO-STEP VERIFICATION API
export async function sendOtp(mobileNumber: string, email: string): Promise<{
  success: boolean;
  message: string;
  cooldownSeconds: number;
  emailDelivered?: boolean;
  pendingSmtp?: boolean;
  helperCode?: string;
}> {
  const res = await fetch('/api/auth/otp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobileNumber, email }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to send OTP');
  }
  return data;
}

export async function verifyOtp(mobileNumber: string, email: string, otp: string): Promise<{ success: boolean; message: string; tempToken: string }> {
  const res = await fetch('/api/auth/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobileNumber, email, otp }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to verify OTP');
  }
  return data;
}

export async function verifyDob(tempToken: string, dob: string): Promise<{ success: boolean; message: string; sessionToken: string }> {
  const res = await fetch('/api/auth/dob/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tempToken, dob }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to verify Date of Birth');
  }
  setVisitorSessionToken(data.sessionToken);
  return data;
}

// CYCLE TRACKER & PERIOD LOG API
export async function submitCyclePeriodLog(logData: {
  date: string;
  cycleDay: number;
  flow: string;
  crampLevel: number;
  mood: string;
  symptoms: string[];
  cravings: string[];
  note?: string;
}): Promise<{ success: boolean; log: any; message: string }> {
  const res = await fetch('/api/cycle/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(logData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to submit cycle log');
  return data;
}

export async function fetchCycleData(): Promise<any> {
  const res = await fetch('/api/cycle');
  if (!res.ok) throw new Error('Failed to fetch cycle tracker data');
  return res.json();
}

// CUDDLE & KISS SANCTUARY API
export async function sendKissHug(actionData: {
  type: 'kiss' | 'hug';
  intensity: string;
  location?: string;
  count?: number;
  message?: string;
}): Promise<{ success: boolean; stats: any; message: string }> {
  const res = await fetch('/api/kiss-hug/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(actionData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send love action');
  return data;
}

export async function checkVisitorSession(): Promise<boolean> {
  if (!visitorSessionToken) return false;
  try {
    const res = await fetch('/api/auth/session/check', {
      headers: {
        Authorization: `Bearer ${visitorSessionToken}`,
      },
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.verified);
  } catch {
    return false;
  }
}

// Verification Logs (Admin)
export async function fetchVerificationLogs(): Promise<{ logs: VerificationLog[]; expectedDob: string; requireVerification: boolean; totalCount: number }> {
  const res = await fetch('/api/admin/verification-logs', {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to load verification logs');
  return res.json();
}

export async function revealVerificationPhone(id: string): Promise<{ mobileNumber: string }> {
  const res = await fetch(`/api/admin/verification-logs/${id}/reveal`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to reveal phone number');
  return res.json();
}

export async function deleteVerificationLog(id: string): Promise<any> {
  const res = await fetch(`/api/admin/verification-logs/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete log');
  return res.json();
}

export async function clearAllVerificationLogs(): Promise<any> {
  const res = await fetch('/api/admin/verification-logs', {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to clear logs');
  return res.json();
}

export async function updateVerificationConfig(config: { expectedDob?: string; requireVerification?: boolean }): Promise<any> {
  const res = await fetch('/api/admin/verification-config', {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(config),
  });
  if (!res.ok) throw new Error('Failed to update verification config');
  return res.json();
}

// Share Response with Nishant
export async function shareResponse(data: {
  section: string;
  question?: string;
  responseText: string;
}): Promise<{ success: boolean; deliveredToTelegram: boolean; telegramError?: string }> {
  const res = await fetch('/api/share-response', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to share message' }));
    throw new Error(err.error || 'Failed to share message');
  }
  return res.json();
}

export async function shareUserResponse(
  arg1: { section: string; question?: string; responseText: string } | string,
  arg2?: string,
  arg3?: string
): Promise<{ success: boolean; deliveredToTelegram: boolean; telegramError?: string }> {
  if (typeof arg1 === 'string') {
    return shareResponse({
      section: arg1,
      question: arg2,
      responseText: arg3 || '',
    });
  }
  return shareResponse(arg1);
}

// Activity Logging
export async function logActivityEvents(events: Array<{
  eventType: string;
  section: string;
  details?: string;
  clientSessionId: string;
  isEstimated?: boolean;
}>): Promise<void> {
  try {
    await fetch('/api/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events }),
    });
  } catch (err) {
    console.debug('Activity logging error:', err);
  }
}

// Admin Auth
export async function adminLogin(password: string): Promise<{ success: boolean; token: string; isCustomPasswordSet: boolean }> {
  const res = await fetch('/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Invalid password' }));
    throw new Error(err.error || 'Invalid credentials');
  }
  const data = await res.json();
  setAdminToken(data.token);
  return data;
}

export async function checkAdminAuth(): Promise<{ authenticated: boolean; isCustomPasswordSet: boolean }> {
  if (!adminToken) return { authenticated: false, isCustomPasswordSet: false };
  const res = await fetch('/api/admin/auth/check', {
    headers: authHeaders(),
  });
  if (!res.ok) {
    setAdminToken(null);
    return { authenticated: false, isCustomPasswordSet: false };
  }
  return res.json();
}

export async function setAdminPassword(newPassword: string): Promise<{ success: boolean }> {
  const res = await fetch('/api/admin/auth/setup-password', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ newPassword }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to set password');
  }
  return res.json();
}

export async function adminLogout(): Promise<void> {
  try {
    await fetch('/api/admin/auth/logout', {
      method: 'POST',
      headers: authHeaders(),
    });
  } finally {
    setAdminToken(null);
  }
}

// Admin Overview
export async function fetchAdminOverview(): Promise<any> {
  const res = await fetch('/api/admin/overview', {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to load admin overview');
  return res.json();
}

// Admin Update Settings
export async function updateAdminSettings(settings: any): Promise<any> {
  const res = await fetch('/api/admin/settings', {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return res.json();
}

// Admin Notes CRUD
export async function saveAdminNote(note: any): Promise<any> {
  const isNew = !note.id || note.id.startsWith('new-');
  const url = isNew ? '/api/admin/notes' : `/api/admin/notes/${note.id}`;
  const method = isNew ? 'POST' : 'PUT';
  const res = await fetch(url, {
    method,
    headers: authHeaders(),
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error('Failed to save note');
  return res.json();
}

export async function deleteAdminNote(id: string): Promise<any> {
  const res = await fetch(`/api/admin/notes/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete note');
  return res.json();
}

// Music Upload & Management
export async function uploadAdminMusic(formData: FormData): Promise<any> {
  const res = await fetch('/api/admin/music/upload', {
    method: 'POST',
    headers: {
      ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
    },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(err.error || 'Failed to upload audio');
  }
  return res.json();
}

export async function deleteAdminMusic(trackId: string): Promise<any> {
  const res = await fetch(`/api/admin/music/${trackId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete track');
  return res.json();
}

// Telegram Admin API
export async function updateAdminTelegram(config: any): Promise<any> {
  const res = await fetch('/api/admin/telegram', {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(config),
  });
  if (!res.ok) throw new Error('Failed to update Telegram settings');
  return res.json();
}

export async function testAdminTelegram(): Promise<{ success: boolean; message?: string; error?: string }> {
  const res = await fetch('/api/admin/telegram/test', {
    method: 'POST',
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Telegram test failed');
  }
  return data;
}

export async function sendDailySummaryTelegram(): Promise<{ success: boolean; message?: string }> {
  const res = await fetch('/api/admin/telegram/send-summary', {
    method: 'POST',
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send summary');
  return data;
}

// Letters CRUD
export async function saveAdminLetter(letter: any): Promise<any> {
  const isNew = !letter.id || letter.id.startsWith('new-');
  const url = isNew ? '/api/admin/letters' : `/api/admin/letters/${letter.id}`;
  const method = isNew ? 'POST' : 'PUT';
  const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(letter) });
  if (!res.ok) throw new Error('Failed to save letter');
  return res.json();
}

// Appreciation Cards CRUD
export async function saveAdminAppreciation(card: any): Promise<any> {
  const isNew = !card.id || card.id.startsWith('new-');
  const url = isNew ? '/api/admin/appreciation' : `/api/admin/appreciation/${card.id}`;
  const method = isNew ? 'POST' : 'PUT';
  const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(card) });
  if (!res.ok) throw new Error('Failed to save appreciation card');
  return res.json();
}

export async function deleteAdminAppreciation(id: string): Promise<any> {
  const res = await fetch(`/api/admin/appreciation/${id}`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to delete appreciation card');
  return res.json();
}

// Memories CRUD
export async function saveAdminMemory(memory: any): Promise<any> {
  const isNew = !memory.id || memory.id.startsWith('new-');
  const url = isNew ? '/api/admin/memories' : `/api/admin/memories/${memory.id}`;
  const method = isNew ? 'POST' : 'PUT';
  const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(memory) });
  if (!res.ok) throw new Error('Failed to save memory');
  return res.json();
}

export async function deleteAdminMemory(id: string): Promise<any> {
  const res = await fetch(`/api/admin/memories/${id}`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to delete memory');
  return res.json();
}

// Mini-games admin
export async function updateAdminGame(gameId: string, updates: any): Promise<any> {
  const res = await fetch(`/api/admin/games/${gameId}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(updates) });
  if (!res.ok) throw new Error('Failed to update game');
  return res.json();
}

export async function resetAdminGameStats(gameId: string): Promise<any> {
  const res = await fetch(`/api/admin/games/${gameId}/reset`, { method: 'POST', headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to reset game stats');
  return res.json();
}

// Activity & Responses
export async function fetchAdminActivityLogs(): Promise<any[]> {
  const res = await fetch('/api/admin/activity-logs', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch activity logs');
  return res.json();
}

export async function clearAdminActivityLogs(): Promise<any> {
  const res = await fetch('/api/admin/activity-logs', { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to clear activity logs');
  return res.json();
}

export async function fetchAdminSharedResponses(): Promise<SharedResponse[]> {
  const res = await fetch('/api/admin/responses', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch responses');
  return res.json();
}

export async function deleteAdminSharedResponse(id: string): Promise<any> {
  const res = await fetch(`/api/admin/responses/${id}`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to delete response');
  return res.json();
}

// Reveal active OTP for admin/emergency helper
export async function revealActiveOtp(mobileNumber: string, email: string, adminPhrase?: string): Promise<{ success: boolean; otp: string; expiresInSeconds: number; message: string }> {
  const res = await fetch('/api/auth/otp/reveal-active', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobileNumber, email, adminPhrase }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to retrieve OTP' }));
    throw new Error(err.error || 'Failed to retrieve OTP');
  }
  return res.json();
}

// Admin Email & SMTP Config
export async function fetchAdminEmailConfig(): Promise<any> {
  const res = await fetch('/api/admin/email-config', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch email configuration');
  return res.json();
}

export async function updateAdminEmailConfig(config: any): Promise<any> {
  const res = await fetch('/api/admin/email-config', {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(config),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to update email settings' }));
    throw new Error(err.error || 'Failed to update email settings');
  }
  return res.json();
}

export async function testAdminEmail(testEmail: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/admin/email-config/test', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ testEmail }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Test email failed' }));
    throw new Error(err.error || 'Test email failed');
  }
  return res.json();
}

export async function fetchAdminActiveOtps(): Promise<{ activeOtps: Array<{ phone: string; email: string; otp: string; expiresInSeconds: number }> }> {
  const res = await fetch('/api/admin/active-otps', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch active OTPs');
  return res.json();
}

