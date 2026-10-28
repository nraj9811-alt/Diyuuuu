# DIYUUUU — FOR YOUR CLOUDY DAYS ☁️💜

A deeply personal, cozy, and comforting digital haven created by **Nishant Raj** for **Divya (Diyuuuu)**. 

Designed like a warm room on a rainy day, with soft rain outside the window, lavender and warm amber lighting, hot steaming chai, a handwritten notebook, a memory garden, interactive mini-games, and a full music player.

---

## 🌟 Key Features

1. **Welcome Screen (`DIYUUUU ☁️💜`)**:
   - Dreamy atmosphere with falling rain, ambient sound toggle, and smooth world transition.
2. **Main Cozy Room**:
   - Central interactive hub with clickable objects: Rainy Window, Steaming Chai, Desk Lamp (warm lighting toggle), Handwritten Notebook, Music Player, House Plant, and Surprise Letter.
3. **Cloudy-Day Comfort Corner**:
   - 7 supportive categories in respectful Hindi/Hinglish (*"Aap", "Aapke liye"*):
     - When the day feels heavy (*Jab din thoda bhaari lage*)
     - When you need a small break (*Chhota sa sukoon bhara break*)
     - When you feel overwhelmed (*Jab baatein bohot zyada lagein*)
     - When you want something comforting (*Jab thoda sukoon chahiye ho*)
     - When you need a reminder to rest (*Aaram karne ki chhoti si yaad*)
     - When you want a tiny smile (*Ek pyari si muskaan ke liye*)
     - When you want to feel appreciated (*Aapki sachhi ahmiyat*)
   - Next thought cycling, copy to clipboard, save favorites to browser storage, and explicit **"Share a thought with Your Sir jiii"** response box with real Telegram delivery.
4. **Personal Notes & Letters**:
   - Notebook paper aesthetic with category tags.
   - Dedicated unfoldable personal letter written with care.
5. **Memory Garden**:
   - Interactive tokens (leaves, stars, flowers, chai cups) representing meaningful memories.
6. **Little Things I Appreciate**:
   - Expandable and flippable appreciation cards highlighting Diyuuuu's individuality and cute expressions.
7. **5 Functional Mini-Games**:
   - **Catch the Stars**: Falling night stars, 30s timer, score counter, and high scores.
   - **Find the Hidden Heart**: Illustrated objects in the room concealing a hidden heart with confetti celebration.
   - **Mood Cloud**: 6 clouds (Calm, Rainy, Sunny, Sleepy, Dreamy, Overwhelmed) with gentle thoughts and practical suggestions.
   - **Tiny Memory Match**: 12-card matching game with cozy forest icons and move counter.
   - **Little Garden**: Choose a seed (Jasmine, Bonsai, Lavender), water it, and watch it bloom with an uplifting note.
8. **Music Player & Real Audio Uploader**:
   - Built-in soothing ambient soundscapes (procedural Web Audio API rain & lofi chords).
   - Real administrative audio file upload (MP3/WAV/AAC) with persistent storage in `/uploads`.
   - Progress seek bar, volume control, mute/unmute, playlist drawer, shuffle, and repeat modes.
9. **Rainy Window Scene**:
   - Full-screen animated raindrops sliding down glass, blurred forest silhouettes, mist toggle, and rain intensity controls.
10. **Today's Little Plan & Family Visit Event**:
    - Live dynamic date in `Asia/Kolkata`.
    - Configurable Family Visit card (visit to Bua & Dadi's home) with automatic archiving for past dates.
11. **Optional Private Calendar & Cycle Tracking**:
    - Privacy-first (disabled by default until explicitly enabled).
    - Monthly view, private date notes, cycle estimates with health disclaimer, export to JSON, and delete all data controls.
12. **Surprise Envelope**:
    - Illustrated envelope with a wax seal that unfolds into a heartfelt letter.
13. **Settings & Themes**:
    - 4 distinct color themes: Deep Forest, Lavender Twilight, Warm Cream & Chai, Midnight Rain.
    - Animation toggles and reduced-motion support.
14. **Hidden Administrator Dashboard**:
    - Discrete entry point in the footer (`Admin 🔒` or `✨`).
    - Authenticated with bootstrap phrase `MYLOVEDIVYA` or custom password.
    - Full content management, music uploader, game controls, and Telegram bot configuration.
15. **Real-Time Telegram Bot Activity Monitoring**:
    - Real backend Telegram Bot API integration (`sendMessage`).
    - Configurable Bot Token & Chat ID via Admin panel or `.env`.
    - Live "Send Test Notification" button with delivery verification.
    - Instant push alerts for shared visitor responses, session starts, and games played.
    - On-demand and daily activity summaries.

---

## 🛠️ Architecture & Technology

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide icons, Canvas Confetti.
- **Audio Engine**: Web Audio API (procedural rain synthesizer & lofi chords) + HTML5 Audio for uploaded MP3 files.
- **Backend**: Node.js & Express (`server.ts`) with Vite middlewares mounted in development.
- **File Storage**: Multi-part file upload with `multer` saving directly to `/uploads`.
- **Database**: Atomic JSON database (`data/database.json`) with safe temporary write and rename semantics.
- **Notifications**: Server-side Telegram Bot API integration.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Available environment variables:
- `TELEGRAM_BOT_TOKEN`: Your Telegram Bot token from [@BotFather](https://t.me/BotFather)
- `TELEGRAM_CHAT_ID`: Your Telegram Chat ID
- `ADMIN_SETUP_PHRASE`: Initial bootstrap phrase (defaults to `MYLOVEDIVYA`)
- `PORT`: Server port (defaults to `3000`)

*Note: You can also configure the Telegram Bot Token and Chat ID directly inside the Admin Dashboard UI!*

### 3. Run Development Server
```bash
npm run dev
```
The server will start at `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🔐 Administrator Access

1. Scroll to the footer of the page or click the subtle `✨` icon in the navigation bar.
2. Click **Admin 🔒**.
3. Enter the bootstrap setup phrase:
   ```
   MYLOVEDIVYA
   ```
4. Inside the admin panel, you can update this to your own custom password under **Security & Password**.

---

## 📱 Telegram Bot Setup Guide

1. Open Telegram and search for `@BotFather`.
2. Send `/newbot`, name your bot (e.g., `DiyuuuuComfortBot`), and copy the API token.
3. Start a chat with your new bot and send `/start`.
4. Retrieve your Telegram Chat ID (you can use `@userinfobot` or `@RawDataBot`).
5. Open the **Admin Dashboard** -> **Telegram Bot & Logs**.
6. Paste your Bot Token and Chat ID, then click **Send Test Notification to Telegram**.
7. Once verified, your bot will alert you when Divya visits, plays a game, or shares a thought!
