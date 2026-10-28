import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Storage for uploaded music files and covers
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 35 * 1024 * 1024,
  },
});

function hashPassword(pass: string): string {
  return crypto.createHash('sha256').update(pass + '_diyu_comfort_salt').digest('hex');
}

// Initial Database Schema with Respectful "e" Grammar, Period Day 5 Care, Expanded Music & Verification
function getInitialDb() {
  const bootstrapPhrase = process.env.ADMIN_SETUP_PHRASE || 'MYLOVEDIVYA';
  return {
    adminAuth: {
      passwordHash: hashPassword(bootstrapPhrase),
      isCustomPasswordSet: false,
      sessions: [] as Array<{ token: string; createdAt: number; expiresAt: number }>,
    },
    authVerification: {
      expectedDob: '2008-04-24', // 24 April 2008
      requireVerification: true,
      activeOtps: [] as Array<{ phone: string; email?: string; otp: string; expiresAt: number; attempts: number; resendAfter: number }>,
      tempTokens: [] as Array<{ token: string; phone: string; email?: string; expiresAt: number; attempts: number }>,
      verifiedSessions: [] as Array<{ token: string; phone: string; createdAt: number; expiresAt: number }>,
      verificationLogs: [] as Array<{
        id: string;
        mobileNumber: string;
        timestamp: string;
        otpVerified: boolean;
        dobVerified: boolean;
        accessGranted: boolean;
        failedAttempts: number;
        lastAttemptStatus?: string;
      }>,
    },
    settings: {
      siteName: 'DIYUUUU — For Your Cloudy Days ☁️💜',
      heroHeading: 'DIYUUUU ☁️💜',
      heroSubtitle: 'For your cloudy days.',
      heroSupporting: 'A little corner of the internet, made with care, just for you.',
      enterButtonText: 'Enter your little world',
      recipientName: 'Divya',
      recipientNickname: 'Diyuuuu',
      creatorName: 'Nishant Raj',
      creatorRespectfulNickname: 'Sir jiii',
      nicknames: [
        'Diyuuuu',
        'Beendani ji',
        'Madam Ji',
        'bbg',
        'Babyyyyy',
        'My gurllll',
        'Bauni',
        'Butki',
        'Mharo gigalooooooo',
        'Chhotu Master',
        'Golgappa Queen',
        'Drama Queen ji',
        'Rasgulla ji',
        'Kaju Katli',
        'Pari ji',
        'Pocket Dynamite',
        'Gusse wali Naagin',
        'Sweetu',
        'Laddu Gopal ji',
        'Cheeku',
        'Tamatar ji',
        'Jaanu',
        'Nakhro rani',
        'Pyaari Titli',
        'Sleepy Panda',
        'Chashmish ji',
        'Teddy Bear',
        'Gudiya',
        'Barbie Doll',
        'Princess of Sir jiii',
        'Dil ki Dhadkan',
        'Chulbuli rani',
      ],
      activeTheme: 'forest',
      timezone: 'Asia/Kolkata',
      footerMessage: 'Crafted with warmth for Diyuuuu. Aap jab chahein, yahan aakar sukoon mehsoos kar sakte ho.',
      calendarEnabled: true,
      cycleTrackingEnabled: true,
      reflectionsEnabled: true,
      ambientRainAudioEnabled: false, // OFF by default
      animationsEnabled: true,
    },
    periodCareDay5: {
      dayNumber: 5,
      title: 'Day 5: Gentle Recovery & Care 🌸🩸',
      subtitle: 'Aapne 5 din bohot himmat se sambhale hain, ab bas aaram karne ka waqt hai.',
      summary: 'Day 5 period ka transition day hota hai—heavy flow kam ho raha hota hai, par sharir thaka rehta hai aur thodi backache ho sakti hai. Aap bilkul rest kijiye.',
      comfortTips: [
        {
          id: 'tip-1',
          title: 'Garam Paani & Heat Pad',
          desc: 'Lower abdomen aur back par thoda gentle heat dijiye, muscles relax ho jaate hain.',
          icon: 'flame',
        },
        {
          id: 'tip-2',
          title: 'Adrak & Elaichi Wali Chai',
          desc: 'Garam chai body ko soothing warmth deti hai aur bloating kam karti hai.',
          icon: 'coffee',
        },
        {
          id: 'tip-3',
          title: 'Soft Blanket & Pillow Support',
          desc: 'Tangein mod kar pillow ke support se letiye, back par relief milega.',
          icon: 'bed',
        },
        {
          id: 'tip-4',
          title: 'Dark Chocolate & Sweet Treat',
          desc: 'Thoda sa dark chocolate mood aur serotonin boost karta hai. No guilt!',
          icon: 'cookie',
        },
      ],
      reassuranceMessage: 'Aap bohot strong ho aur aapne itne pain ko muskuraate hue jhela hai. Aaj aapka Sir jiii aapko special hug aur rest prescribe karta hai!',
    },
    nicknameGenerator: {
      nicknames: [
        { name: 'Beendani ji', meaning: 'Aapka dramatic aur royal avatar! Jab aap full attitude dikhate ho.' },
        { name: 'Madam Ji', meaning: 'Jab aap boss ban kar order dete ho aur sabko sunna padta hai!' },
        { name: 'bbg', meaning: 'The sweetest, coolest baby girl in the entire universe.' },
        { name: 'Babyyyyy', meaning: 'Pure softness, innocence aur endless cuteness.' },
        { name: 'My gurllll', meaning: 'Nishant ka sabse bada pride aur favourite insaan.' },
        { name: 'Diyuuuu', meaning: 'Aapki aatma ka sabse pyara aur sachha naam.' },
        { name: 'Bauni', meaning: 'Chhotu si height par 1000% badmashi aur cute nakhre!' },
        { name: 'Butki', meaning: 'Pocket-sized aafat jo sabse pyare lagte ho.' },
        { name: 'Mharo gigalooooooo', meaning: 'Traditional Rajasthani warmth, pyaar aur hasi!' },
        { name: 'Chhotu Master', meaning: 'Sabko gyaan dene wale aur sab sikhane wale cute boss.' },
        { name: 'Golgappa Queen', meaning: 'Thode teekhe aur bohot saare sweet!' },
        { name: 'Drama Queen ji', meaning: 'Oscar-winning daily expressions aur cute narazgi.' },
        { name: 'Rasgulla ji', meaning: 'Bohot soft, meethi aur pyari si muskaan.' },
        { name: 'Kaju Katli', meaning: 'Sabse premium, classy aur beloved mithai jaisi.' },
        { name: 'Pari ji', meaning: 'Jo bina pankhon ke bhi aasman jaisi sundar lagte ho.' },
        { name: 'Pocket Dynamite', meaning: 'Chhoti si jaan par dhamakedaar baatein aur energy!' },
        { name: 'Gusse wali Naagin', meaning: 'Jab cute sa fuffkaar maarte ho aur gussa dikhate ho!' },
        { name: 'Sweetu', meaning: 'Dil se sabse sachhi aur caring baby girl.' },
        { name: 'Laddu Gopal ji', meaning: 'Ghar ki sabse laadli aur pyari shararat.' },
        { name: 'Cheeku', meaning: 'Gol-matol cute cheeks jinhe kheenchne ka mann kare.' },
        { name: 'Tamatar ji', meaning: 'Jab thode se sharma kar ya gusse mein laal ho jaate ho!' },
        { name: 'Jaanu', meaning: 'Sir jiii ke dil ka sabse keemti tukda.' },
        { name: 'Nakhro rani', meaning: 'Har baat par 100 nakhre jo humein bohot acche lagte hain.' },
        { name: 'Pyaari Titli', meaning: 'Idhar se udhar khushi bikherti hui gentle soul.' },
        { name: 'Sleepy Panda', meaning: 'Blanket mein ghus kar ghanton sone wali cutie.' },
        { name: 'Chashmish ji', meaning: 'Chashme ke piche chamakti hui sabse khoobsurat aankhein.' },
        { name: 'Teddy Bear', meaning: 'Jisko bas hug karke saara din baithne ka mann kare.' },
        { name: 'Gudiya', meaning: 'Masoom si, jisko kisi ki nazar na lage.' },
        { name: 'Barbie Doll', meaning: 'Ekdam prettiest angel with royal vibes.' },
        { name: 'Princess of Sir jiii', meaning: 'Jiske saare hukum aur wishes sar-aankhon par!' },
        { name: 'Dil ki Dhadkan', meaning: 'Jiske bina sab kuch adhoora lagta hai.' },
        { name: 'Chulbuli rani', meaning: 'Har pal masti aur hasi failane wali!' },
      ],
    },
    comfortCorner: {
      categories: [
        {
          id: 'heavy-day',
          title: 'When the day feels heavy',
          hindiTitle: 'Jab din thoda bhaari lage',
          icon: 'cloud-rain',
          messages: [
            'Har din ko perfect hona zaroori nahi hai. Aap apne pace par chalte ho, wahi sabse bada proof hai.',
            'Aaj agar sab kuch thoda cloudy lag raha hai, toh aap apne liye thoda waqt nikaal sakte ho.',
            'Aapko sab kuch ek saath theek karne ki zaroorat nahi hai. Bas ek deep breath lijiye aur aaram karte ho.',
            'Aap jaise sochte ho aur jaise sambhalte ho, bohot pyare aur strong lagte ho.',
          ],
        },
        {
          id: 'small-break',
          title: 'When you need a small break',
          hindiTitle: 'Chhota sa sukoon bhara break',
          icon: 'coffee',
          messages: [
            'Ek cup garam chai, thodi si shanti aur apne liye kuch minutes. Aap aaram se waqt bitate ho.',
            'Phone ko thodi der side mein rakh kar khidki ke paas baithiye. Baarish ki awaaz sunte ho.',
            'Aap thoda stretch karte ho, paani peete ho, aur bina kisi guilt ke rest karte ho.',
          ],
        },
        {
          id: 'overwhelmed',
          title: 'When you feel overwhelmed',
          hindiTitle: 'Jab baatein bohot zyada lagein',
          icon: 'wind',
          messages: [
            'Duniya ka saara bojh aapke kandhon par nahi hai. Aap ek samay par bas ek hi chhota kadam uthate ho.',
            'Agar koi baat pareshaan kare, toh thodi der usse door hokar saans lijiye. Sab theek ho jayega.',
            'Aapki feelings bilkul valid hain. Aap khud par bilkul sakht nahi bante ho.',
          ],
        },
        {
          id: 'comforting',
          title: 'When you want something comforting',
          hindiTitle: 'Jab thoda sukoon chahiye ho',
          icon: 'heart',
          messages: [
            'Yeh chhota sa corner hamesha aapke liye yahin hai. Aap jab bhi chahein yahan aate ho.',
            'Aap jab muskuraate ho, sabse pyare lagte ho. Par jab mann na ho, tab bhi aap utne hi precious ho.',
            'Warm chai, halki baarish, aur aapka yeh chhota sa space jahan aap sukoon paate ho.',
          ],
        },
        {
          id: 'rest-reminder',
          title: 'When you need a reminder to rest',
          hindiTitle: 'Aaram karne ki chhoti si yaad',
          icon: 'moon',
          messages: [
            'Aapko har waqt productive rehna zaroori nahi hai. Rest bhi utna hi important hota hai.',
            'Aapki neend aur aapka sukoon sabse pehle aana chahiye. Aap bina kisi fikar ke so sakte ho.',
            'Aaj ke din aapne bohot achha kiya. Ab aap aaram se rest karte ho.',
          ],
        },
        {
          id: 'tiny-smile',
          title: 'When you want a tiny smile',
          hindiTitle: 'Ek pyari si muskaan ke liye',
          icon: 'sparkles',
          messages: [
            'Aapki chhoti chhoti baatein aur expressions kitne cute hote hain! Aap jab haste ho sab theek lagta hai.',
            'Chhoti si progress bhi real progress hoti hai. Aap bohot pyare lagte ho.',
            'Aapka Sir jiii hamesha aapke sukoon aur muskaan ki wish karta hai.',
          ],
        },
        {
          id: 'appreciated',
          title: 'When you want to feel appreciated',
          hindiTitle: 'Aapki sachhi ahmiyat',
          icon: 'star',
          messages: [
            'The way you see things from your own point of view is truly special. Aap alag sochte ho.',
            'Aap jab bolte ho aur presence dete ho, aas-paas ka mahaul kitna calm aur achha ho jaata hai.',
            'Aapki individuality hi aapki sabse badi khoobsurti hai. Aap jaise ho, waise hi pyare lagte ho.',
          ],
        },
      ],
    },
    notes: [
      {
        id: 'note-1',
        title: 'Chhoti si baat yaad rakhne ke liye',
        body: 'Aapko hamesha sab kuch pehle se tay karne ki zaroorat nahi hoti. Aap jis dhang se sab handle karte ho, woh bohot khoobsurat hai.',
        category: 'Little reminders',
        date: '2026-10-28',
        published: true,
        order: 1,
      },
      {
        id: 'note-2',
        title: 'Day 5 Period Care Reminder 🌸',
        body: 'Aaj periods ka 5th day hai. Thoda pet aur peeth mein dard ya thakan ho sakti hai. Aap garam paani pijiye, blanket lijiye aur aaram karte ho.',
        category: 'Period care',
        date: '2026-10-28',
        published: true,
        order: 2,
      },
      {
        id: 'note-3',
        title: 'Cloudy days are gentle days ☁️',
        body: 'Baarish ka mausam sab kuch dho kar saaf kar deta hai. Waise hi cloudy days humein thoda rukne aur apni energy wapas paane ka mauka dete hain.',
        category: 'Cloudy-day notes',
        date: '2026-10-28',
        published: true,
        order: 3,
      },
      {
        id: 'note-4',
        title: 'Chai aur khamoshi ☕',
        body: 'Shaam ko cup pakad kar baithna, bina kisi jaldbaazi ke, sabse bada sukoon hota hai jo aap khud ko dete ho.',
        category: 'Things worth remembering',
        date: '2026-10-28',
        published: true,
        order: 4,
      },
      {
        id: 'note-5',
        title: 'Aapka Masoom Gussa 😾',
        body: 'Aap jab thoda naak chadhate ho ya chhotu sa gussa karte ho na, lagta hai duniya ki saari cuteness ek jagah ikatthi ho gayi hai!',
        category: 'Little reminders',
        date: '2026-10-28',
        published: true,
        order: 5,
      },
      {
        id: 'note-6',
        title: 'Cramps Relief Protocol 🕯️',
        body: 'Heat pad ko pet par rakhiye, pairon ke niche soft pillow lagaiye aur ek cup adrak-elaichi chai sip kijiye. Sir jiii is sending healing hugs!',
        category: 'Period care',
        date: '2026-10-28',
        published: true,
        order: 6,
      },
      {
        id: 'note-7',
        title: 'No Guilt Rest Day 🧸',
        body: 'Aaj agar aapne bistar se uthne ka mann na banaya ho, toh bilkul guilt mat lijiye. Sharir jab heal ho raha ho, toh aaram hi sabse bada kaam hota hai.',
        category: 'Self care',
        date: '2026-10-28',
        published: true,
        order: 7,
      },
      {
        id: 'note-8',
        title: 'The Way You Laugh ✨',
        body: 'Aap jab khul kar haste ho, toh kamre mein achanak roshni si aa jaati hai. Aapki muskaan bohot precious hai.',
        category: 'Things worth remembering',
        date: '2026-10-28',
        published: true,
        order: 8,
      },
      {
        id: 'note-9',
        title: 'A Hug From Afar 🫂',
        body: 'Aankhein band kijiye aur mehsus kijiye: ek lamba, garam aur safe hug jo aapke saare dard aur thakan ko absorb kar raha hai.',
        category: 'Comfort notes',
        date: '2026-10-28',
        published: true,
        order: 9,
      },
      {
        id: 'note-10',
        title: 'Sweet Cravings Allowed 🍫',
        body: 'Chocolates, pastries, ya jo bhi meetha khane ka mann ho, bindass khaiye. Period hormones need sweet dopamine!',
        category: 'Period care',
        date: '2026-10-28',
        published: true,
        order: 10,
      },
      {
        id: 'note-11',
        title: 'Aapki Khoobsurat Aatma 🌸',
        body: 'Aap jaise logon ki parvah karte ho aur dil se baatein bolte ho, waisa koi nahi kar sakta. Aap bohot special lagte ho.',
        category: 'Little reminders',
        date: '2026-10-28',
        published: true,
        order: 11,
      },
      {
        id: 'note-12',
        title: 'Baarish Ki Khidki 🌧️',
        body: 'Boondon ko kaanch par fisalte dekhna aur sochna ki life mein bhi har toofan ke baad aisi hi thandak aati hai.',
        category: 'Cloudy-day notes',
        date: '2026-10-28',
        published: true,
        order: 12,
      },
      {
        id: 'note-13',
        title: 'Day 6 Pe Dheere Dheere Glow 🕊️',
        body: 'Day 5 ke baad dard ka aakhri pehra chala jaata hai. Kal se aap bilkul fresh feel karenge, Beendani ji!',
        category: 'Period care',
        date: '2026-10-28',
        published: true,
        order: 13,
      },
      {
        id: 'note-14',
        title: 'Sir jiii Ka Constant Vaada 💍',
        body: 'Chahe aap bohot khush ho ya bohot pareshaan, aapka Sir jiii hamesha aapke paas rahega. Never ever doubt that.',
        category: 'Things worth remembering',
        date: '2026-10-28',
        published: true,
        order: 14,
      },
      {
        id: 'note-15',
        title: 'Sip Some Water 💧',
        body: 'Hydration period bloating ko 50% kam kar deta hai. Gunguna paani peete rahiye aur deep breaths lete ho.',
        category: 'Self care',
        date: '2026-10-28',
        published: true,
        order: 15,
      },
      {
        id: 'note-16',
        title: 'You Are Doing Great 💜',
        body: 'Aapne itne dino ka dard aur mood shifts akele jhele hain. You are so strong, my Diyuuuu. I am so proud of you.',
        category: 'Little reminders',
        date: '2026-10-28',
        published: true,
        order: 16,
      },
    ],
    letters: [
      {
        id: 'letter-main',
        title: 'A Letter for Your Cloudy Days',
        greeting: 'Dear Diyuuuu,',
        body: `Aap jab bhi yeh letter padhte ho, chahe din kaisa bhi raha ho, I hope yeh chhota sa corner aapko thoda sukoon aur warmth de sake.\n\nYeh website maine isliye banayi taaki aapke paas hamesha ek aisi jagah ho jahan koi shor na ho, koi expectation na ho, aur na hi koi pressure ho. Jab baahar cloudy lage ya sharir thoda thaka hua ho (khaaskar in dino), toh aap yahan aakar baarish ki awaaz sunte ho, soft music chalate ho, ya bas shaant pal bitate ho.\n\nAap jaise ho, bohot genuine aur special lagte ho. Har din perfect nahi hota, par aapka sukoon hamesha zaroori hai.\n\nAap jab chahein, apne pace par explore karte ho. Yeh chhota sa world hamesha yahin rahega, aapke liye.`,
        signature: 'Always wishing you peace & warm chai,\nNishant (Your Sir jiii)',
        date: 'October 2026',
        published: true,
      },
    ],
    appreciationCards: [
      {
        id: 'appr-1',
        title: 'The way you see things',
        message: 'Aapka perspective bohot honest aur thoughtful hota hai. You notice what others miss.',
        icon: 'eye',
        order: 1,
        published: true,
      },
      {
        id: 'appr-2',
        title: 'Your little expressions',
        message: 'Aapke cute expressions aur chhoti chhoti baaton par react karna makes everything brighter. Aap jab haste ho bohot pyare lagte ho.',
        icon: 'smile',
        order: 2,
        published: true,
      },
      {
        id: 'appr-3',
        title: 'Calm strength',
        message: 'Mushkil waqt mein bhi aap jis grace aur patience ke saath aage badhte ho, that is truly admirable.',
        icon: 'shield',
        order: 3,
        published: true,
      },
      {
        id: 'appr-4',
        title: 'Your individuality',
        message: 'You stay true to who you are, without pretending. Aap jaise ho, wahi aapki sabse badi khoobsurti hai.',
        icon: 'sparkles',
        order: 4,
        published: true,
      },
      {
        id: 'appr-5',
        title: 'Making simple moments memorable',
        message: 'A cup of chai, a cool breeze, or a simple conversation becomes something worth holding onto when you are there.',
        icon: 'coffee',
        order: 5,
        published: true,
      },
    ],
    memories: [
      {
        id: 'mem-1',
        title: 'First Rainy Afternoon',
        description: 'Khidki ke paas halki boonda-baandi aur thandak. A serene memory that always brings calm.',
        category: 'Peaceful moments',
        symbol: 'leaf',
        date: 'A cozy day',
        order: 1,
        published: true,
      },
      {
        id: 'mem-2',
        title: 'A Warm Cup of Chai',
        description: 'Chai ki khushboo aur halki dhoop cloudy aasmaan ke beech. Simple comforts that heal the heart.',
        category: 'Little pleasures',
        symbol: 'coffee',
        date: 'Every tea time',
        order: 2,
        published: true,
      },
      {
        id: 'mem-3',
        title: 'Forest Whispers',
        description: 'Tall green pine trees swaying in the misty rain. A peaceful sanctuary made of memories and hope.',
        category: 'Nature',
        symbol: 'plant',
        date: 'Evergreen',
        order: 3,
        published: true,
      },
      {
        id: 'mem-4',
        title: 'Soft Evening Stars',
        description: 'Baadal hatne ke baad aasmaan mein aane wale pehle tare. Har cloudy din ke baad roshni aati hai.',
        category: 'Night sky',
        symbol: 'star',
        date: 'Quiet nights',
        order: 4,
        published: true,
      },
    ],
    familyVisitEvent: {
      title: "Family Visit: Bua & Dadi's Home",
      date: '2026-11-08',
      startTime: '11:00 AM',
      endTime: '06:00 PM',
      message: 'A warm and sweet day with family. Aap araam se waqt bitate ho aur achhe se enjoy karte ho!',
      visible: true,
      autoArchive: true,
      order: 1,
    },
    todayPlan: {
      defaultActivity: 'Ek cup garam adrak chai, thodi der relaxing music, aur bina kisi rush ke apne favourite tasks.',
      supportiveNote: 'Aap apne pace par chalte ho. No hurry, no pressure.',
    },
    surpriseEnvelope: {
      previewTitle: 'A Special Note for Diyuuuu 💌',
      hint: 'Tap gently to unfold the letter inside...',
      letterContent: `Dear Diyuuuu,\n\nIf you are opening this today, here is a small reminder:\n\nAapko saara bojh akele uthane ki zaroorat nahi hai. It is completely okay to let go of expectations, put on warm socks, wrap yourself in a blanket, and just be.\n\nKhaaskar aaj jab aapka period ka 5th day hai, aap bas aaram karte ho. Aapka Sir jiii hamesha aapke sukoon aur muskaan ki wish karta hai.\n\nTake care of yourself today. You are cherished! ☁️💜`,
      signature: 'With warm regards,\nNishant Raj (Sir jiii)',
    },
    surpriseEnvelopes: [
      {
        id: 'env-1',
        title: 'For When You Feel Tired 🌸',
        subtitle: 'Lavender Seal — Deep Comfort',
        sealColor: '#8b5cf6',
        previewTitle: 'A Soft Whispered Hug 💌',
        letterContent: `Meri sabse pyari Diyuuuu,\n\nAap itna sab kuch sambhalte ho aur kabhi complain nahi karte. Lekin aaj aapka 5th day hai period ka, sharir thaka hua hai aur aapko sach mein rest ki zaroorat hai.\n\nAapko lagta hoga ki sab perfect hona chahiye, par aap mere liye waise hi perfect ho jaise aap sochte ho, bolte ho, aur muskuraate ho. Blanket lapet lijiye, Sir jiii ka diya hua warm hug mehsoos kijiye aur bas thoda aaram karte ho.\n\nAapki har takleef meri hai. Take it easy today, bbg.`,
        signature: 'Sirf aapka,\nNishant Raj (Sir jiii) 💜',
        opened: false,
      },
      {
        id: 'env-2',
        title: 'For When Your Mood Swings 🍫',
        subtitle: 'Amber Seal — Sweet Reassurance',
        sealColor: '#f59e0b',
        previewTitle: 'Sweet Cravings & No Guilt 💌',
        letterContent: `Beendani ji,\n\nJab periods ke dauraan achanak chidchidahat ho ya rona aaye bina kisi wajah ke, toh yaad rakhna ki yeh bas hormones ki shaitaani hai! Aap bilkul theek ho.\n\nAap jitna chahein chocolates khate ho, gussa karte ho, nakhre dikhate ho—aapka Sir jiii yahan aapke saare nakhre uthane ke liye ready baitha hai. Aap jab thode gusse mein hote ho na, tab bhi sabse cute lagte ho!\n\nEat your sweets without guilt!`,
        signature: 'Always by your side,\nNishant (Sir jiii) 🍯',
        opened: false,
      },
      {
        id: 'env-3',
        title: 'For Cramps & Body Ache 🕯️',
        subtitle: 'Rose Seal — Healing Warmth',
        sealColor: '#f43f5e',
        previewTitle: 'A Warm Heating Pad & Love 💌',
        letterContent: `Meri Babyyyyy,\n\nI know pet mein aur lower back mein jo ajeeb sa heavy pain aur cramps hote hain, woh kitne exhausting hote hain. Kahaash main wahan hota aur aapka sar daba sakta ya heat pad rakh sakta.\n\nPar abhi ke liye, sochiye main aapke bilkul paas hoon, aapka haath thaame hue aur aapko ek tight soft hug de raha hoon. Garam chai pijiye aur aankhein band karke lofi music sunte ho. Dard jaldi theek ho jayega.`,
        signature: 'With infinite kisses on your forehead,\nNishant Raj 🌸',
        opened: false,
      },
      {
        id: 'env-4',
        title: 'For When You Feel Insecure 🌿',
        subtitle: 'Emerald Seal — Pure Truth',
        sealColor: '#10b981',
        previewTitle: 'The Purest Soul I Know 💌',
        letterContent: `Diyuuuu,\n\nKabhi bhi apne aap par shaq mat karna. Aap jaisi ho, jitni masoom, jitni loyal aur jitni dedicated ho, duniya mein koi aap jaisa nahi hai. Aapki baatein, aapka gussa, aapka hasna sab kuch mere dil ke sabse kareeb hai.\n\nAap jis tarah har baat ko dil se mehsus karte ho, wahi aapko sabse alag banata hai. You are my pride, my gurllll. Hamesha sar utha kar chalte ho aur khush rehte ho.`,
        signature: 'Proudly yours,\nNishant (Sir jiii) 🌿',
        opened: false,
      },
      {
        id: 'env-5',
        title: 'A Promise for the Future ✨',
        subtitle: 'Gold Seal — Eternal Bond',
        sealColor: '#eab308',
        previewTitle: 'My Constant Forever 💌',
        letterContent: `Meri Madam Ji,\n\nChahe din cloudy ho ya dhoop khili ho, chahe period ka heavy flow ho ya calm peaceful shaam, Nishant hamesha aapke saath khada rahega. Aapko kabhi akele suffer karne ki zaroorat nahi padegi.\n\nYeh website aapka hamesha ka sanctuary hai. Jab bhi dil ghabraye, yahan aate ho, notes padhte ho, aur yaad rakhte ho ki koi hai jo aapse bohot zyada pyaar aur respect karta hai. You are truly precious to me.`,
        signature: 'Forever & always,\nSir jiii (Nishant Raj) ☁️💜',
        opened: false,
      },
    ],
    periodDays: {
      1: {
        dayNumber: 1,
        title: 'Day 1: Heavy Flow & Arrival 🩸',
        subtitle: 'Dard aur cramps ka sabse intense din. Bilkul araam kijiye.',
        summary: 'Pehle din uterine contractions tez hote hain aur energy zero feel hoti hai.',
        comfortTips: [
          { id: 'p1', title: 'Hot Water Bottle', desc: 'Lower abdomen par garam sikayi karein.', icon: 'flame' },
          { id: 'p2', title: 'Adrak Kaadha / Chai', desc: 'Antispasmodic chai cramps ko shant karti hai.', icon: 'coffee' },
          { id: 'p3', title: 'Zero Work Pressure', desc: 'Sirf soiye aur resting posture mein rahiye.', icon: 'bed' },
          { id: 'p4', title: 'Loose Cotton Clothes', desc: 'Tummy par tight waistband bilkul mat pehniye.', icon: 'feather' },
        ],
        reassuranceMessage: 'Aapka yeh mushkil din bhi guzar jayega. Aap bohot pyare aur strong lagte ho.',
      },
      2: {
        dayNumber: 2,
        title: 'Day 2: Peak Intensity 🌸',
        subtitle: 'Heavy flow aur body ache ka peak. Sir jiii ki taraf se gentle cuddles.',
        summary: 'Day 2 par bleeding zyada hoti hai aur backache feel ho sakti hai.',
        comfortTips: [
          { id: 'p2-1', title: 'Pillow Under Knees', desc: 'Peeth ke bal let kar ghutno ke niche pillow rakhein.', icon: 'bed' },
          { id: 'p2-2', title: 'Dark Chocolate Bite', desc: 'Endorphins release honge aur mood stable hoga.', icon: 'cookie' },
          { id: 'p2-3', title: 'Warm Soup / Khichdi', desc: 'Halka aur garam khana pachega aasaani se.', icon: 'coffee' },
          { id: 'p2-4', title: 'Frequent Hydration', desc: 'Gunguna paani sip-sip karke peete rahiye.', icon: 'droplet' },
        ],
        reassuranceMessage: 'Aapne peak din sambhal liya hai, ab dard kam hone lagega.',
      },
      3: {
        dayNumber: 3,
        title: 'Day 3: Gradual Relief 🌿',
        subtitle: 'Flow thoda settle hone lagta hai, par thakan rehti hai.',
        summary: 'Cramps ki sharp intensity kam hone lagti hai, emotional sensitivity thodi rehti hai.',
        comfortTips: [
          { id: 'p3-1', title: 'Gentle Cat-Cow Stretch', desc: 'Lower back ko halka sa stretch karein bed par hi.', icon: 'heart' },
          { id: 'p3-2', title: 'Chamomile / Green Tea', desc: 'Nerves ko soothing calm milega.', icon: 'coffee' },
          { id: 'p3-3', title: 'Warm Foot Soak', desc: 'Garam paani mein pair daalne se blood circulation theek hota hai.', icon: 'flame' },
        ],
        reassuranceMessage: 'Aadhe se zyada cycle complete ho gayi hai. Well done, Diyuuuu!',
      },
      4: {
        dayNumber: 4,
        title: 'Day 4: Winding Down 🌤️',
        subtitle: 'Bleeding moderate to light ho gayi hai, energy wapas aane lagi hai.',
        summary: 'Uterus relax ho raha hai. Bloating aur heaviness kam hone lagti hai.',
        comfortTips: [
          { id: 'p4-1', title: 'Short Cozy Stroll', desc: 'Kamre mein ya balcony mein taazi hawa lein.', icon: 'wind' },
          { id: 'p4-2', title: 'Fruit & Nuts Snack', desc: 'Iron aur magnesium replenishment ke liye.', icon: 'sparkles' },
          { id: 'p4-3', title: 'Read / Listen to Music', desc: 'Cozy room mein rain sounds sunte ho.', icon: 'music' },
        ],
        reassuranceMessage: 'Aapki energy dheere dheere laut rahi hai. Aap bohot pyare lagte ho.',
      },
      5: {
        dayNumber: 5,
        title: 'Day 5: Gentle Recovery & Care 🌸🩸',
        subtitle: 'Aapne 5 din bohot himmat se sambhale hain, ab bas aaram karne ka waqt hai.',
        summary: 'Day 5 period ka transition day hota hai—heavy flow kam ho raha hota hai, par sharir thaka rehta hai.',
        comfortTips: [
          { id: 'p5-1', title: 'Garam Paani & Heat Pad', desc: 'Muscles relax ho jaate hain lower abdomen par.', icon: 'flame' },
          { id: 'p5-2', title: 'Adrak & Elaichi Wali Chai', desc: 'Garam chai body ko soothing warmth deti hai.', icon: 'coffee' },
          { id: 'p5-3', title: 'Soft Blanket & Support', desc: 'Tangein mod kar pillow support se aaram karein.', icon: 'bed' },
          { id: 'p5-4', title: 'Sweet Treat & Hugs', desc: 'Nishant Raj ki taraf se unlimited sweet cuddles.', icon: 'cookie' },
        ],
        reassuranceMessage: 'Aap bohot strong ho aur aapne itne pain ko muskuraate hue jhela hai. Sir jiii aapko special hug prescribe karta hai!',
      },
      6: {
        dayNumber: 6,
        title: 'Day 6: Final Taper & Light Flow 🕊️',
        subtitle: 'Bleeding lagbhag khatam ho rahi hai. Post-period glow start hone wala hai!',
        summary: 'Faint spotting ya minimal flow. Hormones rise karne lagte hain aur mood fresh ho jaata hai.',
        comfortTips: [
          { id: 'p6-1', title: 'Warm Refreshing Shower', desc: 'Body ko bohot halka aur rejuvenated feel hoga.', icon: 'droplet' },
          { id: 'p6-2', title: 'Light Stretching', desc: 'Gentle yoga posture se body stiffness dur hogi.', icon: 'sun' },
          { id: 'p6-3', title: 'Pantry Treats & Chai', desc: 'Apne pasandeeda snack enjoy karte ho.', icon: 'coffee' },
        ],
        reassuranceMessage: 'Kal se aap bilkul fresh aur energetic feel karoge! You made it through, bbg!',
      },
      7: {
        dayNumber: 7,
        title: 'Day 7: Fresh Beginning & Sparkling Energy ✨',
        subtitle: 'Cycle officially complete! Aapka natural cheerful avatar wapas aa gaya.',
        summary: 'Bleeding fully end ho chuki hai. Estrogen rise ho raha hai, energy aur happiness peak par hai.',
        comfortTips: [
          { id: 'p7-1', title: 'Celebrate the Fresh Start', desc: 'Ek pyara sa outfit pehniye aur muskuraate rahiye.', icon: 'sparkles' },
          { id: 'p7-2', title: 'Go Outdoors', desc: 'Taazi dhoop aur hawa lijiye.', icon: 'sun' },
          { id: 'p7-3', title: 'Sweet Message to Nishant', desc: 'Sir jiii ko batayein ki aap ab 100% fine ho!', icon: 'heart' },
        ],
        reassuranceMessage: 'Aapka pura period cycle successfully complete hua! Sir jiii is so happy for you! ☁️💜',
      },
    },
    cycleTracker: {
      previousCycleStart: '2026-09-29',
      previousCycleEnd: '2026-10-04',
      currentCycleStart: '2026-10-24',
      cycleLengthDays: 28,
      periodDurationDays: 6,
      currentDay: 5,
      logs: [] as Array<any>,
    },
    cuddleStats: {
      totalKisses: 143,
      totalHugs: 84,
      lastInteraction: new Date().toISOString(),
      lastKissIntensity: '' as string | undefined,
      lastHugType: '' as string | undefined,
      lastMessage: '' as string | undefined,
    },
    miniGames: {
      stars: {
        id: 'stars',
        name: 'Catch the Stars',
        description: 'Catch the falling peaceful stars before they drift away.',
        enabled: true,
        highScore: 12,
        playCount: 5,
      },
      heart: {
        id: 'heart',
        name: 'Find the Hidden Heart',
        description: 'Explore the cozy room and find the gentle heart hidden among the comforting objects.',
        enabled: true,
        highScore: 0,
        playCount: 3,
      },
      mood: {
        id: 'mood',
        name: 'Mood Cloud',
        description: 'Select how the weather feels inside your mind today and receive a tailored gentle thought.',
        enabled: true,
        highScore: 0,
        playCount: 7,
      },
      memory: {
        id: 'memory',
        name: 'Tiny Memory Match',
        description: 'Flip and match the cozy forest symbols (leaf, tea cup, star, flower, rain cloud, warm lamp).',
        enabled: true,
        highScore: 8,
        playCount: 4,
      },
      garden: {
        id: 'garden',
        name: 'Little Garden',
        description: 'Plant and water your peaceful bonsai, jasmine, or lavender plant and watch it gently blossom.',
        enabled: true,
        highScore: 0,
        playCount: 6,
      },
    },
    playlists: [
      { id: 'cloudy-day', name: 'Cloudy Day Comfort', description: 'Gentle rain, warm acoustic notes, and lofi serenity' },
      { id: 'period-care', name: 'Day 5 Rest & Recovery', description: 'Ultra soft frequencies for cramps ease, blanket warmth & deep nap' },
      { id: 'forest-lullaby', name: 'Forest & Rain Ambient', description: 'Deep soothing nature and soft piano melodies' },
      { id: 'chai-study', name: 'Chai & Late Night Reading', description: 'Gentle nostalgic chords for reading without distraction' },
    ],
    musicTracks: [
      {
        id: 'real-song-until-i-found-you',
        title: 'Until I Found You (Acoustic) 🌸',
        artist: 'Stephen Sanchez · Acoustic Cover',
        description: '"I would never fall in love again until I found her..." — Jab se aap mile ho, sab khoobsurat hai ☁️💜',
        audioUrl: '/assets/aistudio/Until_20I_20Found_20You_20-_20Stephen_20Sanchez_20_28Acoustic_20Cover_20by_20Francis_20Greg_29_20_mMOGr3y8tt0__8f8681e9.mp3',
        coverUrl: '',
        duration: 189,
        playlistId: 'cloudy-day',
        order: 1,
        published: true,
        isSynthesizedBuiltIn: false,
      },
      {
        id: 'real-song-die-with-a-smile',
        title: 'Die With A Smile 💕',
        artist: 'Lady Gaga & Bruno Mars (For Diyuuuu)',
        description: '"If the world was ending, I\'d wanna be next to you..." — Dedicated to Diyuuuu by Sir jiii 💜',
        audioUrl: '/assets/aistudio/Lady_Gaga__Bruno_Mars_-_Die_With_A_Smile__Official_Music_Video__6dfa546b.mp3',
        coverUrl: '',
        duration: 252,
        playlistId: 'cloudy-day',
        order: 2,
        published: true,
        isSynthesizedBuiltIn: false,
      },
      {
        id: 'real-song-i-think-they-call-this-love',
        title: 'I Think They Call This Love 🌹',
        artist: 'Elliot James Reay (For Diyuuuu)',
        description: '"All I dream of is your eyes, all I long for is your touch..." — Aapke liye sabse pyara gaana ✨',
        audioUrl: '/assets/aistudio/Elliot_James_Reay_-_I_Think_They_Call_This_Love__Official_Music_Video__cdffcbf2.mp3',
        coverUrl: '',
        duration: 193,
        playlistId: 'cloudy-day',
        order: 3,
        published: true,
        isSynthesizedBuiltIn: false,
      },
      {
        id: 'real-song-husn',
        title: 'Husn 🌙',
        artist: 'Anuv Jain',
        description: 'Dekho dekho kaise baatein bnaaye... Soothing acoustic romance for Diyuuuu.',
        audioUrl: '/assets/aistudio/Anuv_Jain_-_HUSN__Official_Video__-_Anuv_Jain_4b18d63f.mp3',
        coverUrl: '',
        duration: 215,
        playlistId: 'cloudy-day',
        order: 4,
        published: true,
        isSynthesizedBuiltIn: false,
      },
      {
        id: 'real-song-arz-kiya-hai',
        title: 'Arz Kiya Hai ✨',
        artist: 'Anuv Jain',
        description: 'Gentle acoustic strings & deep heartfelt poetry for rainy evenings.',
        audioUrl: '/assets/aistudio/Anuv_Jain_-_Arz_Kiya_Hai__Official_Lyrical_Video__-_AnuvJainVEVO_1cdef539.mp3',
        coverUrl: '',
        duration: 260,
        playlistId: 'cloudy-day',
        order: 5,
        published: true,
        isSynthesizedBuiltIn: false,
      },
      {
        id: 'real-song-i-wanna-be-yours',
        title: 'I Wanna Be Yours 💫',
        artist: 'Arctic Monkeys',
        description: '"I wanna be your vacuum cleaner, breathing in your dust..." — Eternal love ballad.',
        audioUrl: '/assets/aistudio/Arctic_Monkeys_-_I_Wanna_Be_Yours_-_LatinHype_2d8b1c5f.mp3',
        coverUrl: '',
        duration: 183,
        playlistId: 'cloudy-day',
        order: 6,
        published: true,
        isSynthesizedBuiltIn: false,
      },
      {
        id: 'real-song-cant-help-falling-in-love',
        title: "Can't Help Falling in Love 👑",
        artist: 'Elvis Presley',
        description: '"Take my hand, take my whole life too..." — Classic timeless romance.',
        audioUrl: '/assets/aistudio/Elvis_Presley_-_Can_t_Help_Falling_in_Love__Lyrics__-_7clouds_Rock_9c654fcd.mp3',
        coverUrl: '',
        duration: 182,
        playlistId: 'cloudy-day',
        order: 7,
        published: true,
        isSynthesizedBuiltIn: false,
      },
      {
        id: 'real-song-dekha-ek-khwab',
        title: 'Dekha Ek Khwab To Yeh Silsile Huwe 🌺',
        artist: 'Silsila · Kishore Kumar & Lata Mangeshkar',
        description: 'Misty flowers, soft breezes & timeless romantic melody.',
        audioUrl: '/assets/aistudio/Dekha_Ek_Khwab_Song__Silsila__Amitabh_Bachchan__Rekha__Kishore_Kumar__Lata_Mangeshkar__Shiv-Hari_-_YRF_58c7a4e9.mp3',
        coverUrl: '',
        duration: 280,
        playlistId: 'cloudy-day',
        order: 8,
        published: true,
        isSynthesizedBuiltIn: false,
      },
      {
        id: 'real-song-yeh-ratein-yeh-mausam',
        title: 'Yeh Ratein Yeh Mausam Nadi Ka Kinara 🌧️',
        artist: 'Kishore Kumar & Asha Bhosle',
        description: 'Chanchal hawa, nadi ka kinara aur monsoon romance.',
        audioUrl: '/assets/aistudio/Yeh_Ratein_Yeh_Mausam__Dilli_Ka_Thug__1958___Nutan__Asha_Bhosle__Kishore_Kumar_Hit_Songs_-_Kishore_Kumar_Hit_Songs_b0c08f82.mp3',
        coverUrl: '',
        duration: 195,
        playlistId: 'cloudy-day',
        order: 9,
        published: true,
        isSynthesizedBuiltIn: false,
      },
      {
        id: 'real-song-neele-neele-ambar-par',
        title: 'Neele Neele Ambar Par 💙',
        artist: 'Kishore Kumar · Kalakaar',
        description: 'Pyaar barsaye humko tarsaye... Evergreen classic.',
        audioUrl: '/assets/aistudio/Neele_Neele_Ambar_Par__Kishore_Kumar__Kalakaar__Evergreen_Old_Hindi_Song__Gana_Junction___-_GANA_JUNCTION_facdf783.mp3',
        coverUrl: '',
        duration: 310,
        playlistId: 'cloudy-day',
        order: 10,
        published: true,
        isSynthesizedBuiltIn: false,
      },
      {
        id: 'real-song-hothon-se-chhu-lo-tum',
        title: 'Hothon Se Chhu Lo Tum 🎶',
        artist: 'Jagjit Singh · Ghazal',
        description: '"Mera geet amar kar do..." — Warm soothing Ghazal for cloudy days.',
        audioUrl: '/assets/aistudio/Jagjit_Singh_-_Hothon_Se_Chhu_Lo_Tum__Official_Lyric_Video___Ghazal_Ka_Khazana_-_Ghazal_Ka_Khazana_e8b282f3.mp3',
        coverUrl: '',
        duration: 290,
        playlistId: 'period-care',
        order: 11,
        published: true,
        isSynthesizedBuiltIn: false,
      },
      {
        id: 'real-song-beqarar-karke-hume',
        title: 'Beqarar Karke Hume Yun Na Jaiye 💌',
        artist: 'Hemant Kumar · Bees Saal Baad',
        description: 'Superhit classic warm melody.',
        audioUrl: '/assets/aistudio/BEQARAR_KARKE_HUME_YUN_NA_JAIYE_HD_-_Hemant_Kumar_-_Biswajeet__Waheeda_Rehman_-_Bees_Saal_Baad_Song_-_SuperHit_Gaane_cca486a3.mp3',
        coverUrl: '',
        duration: 187,
        playlistId: 'cloudy-day',
        order: 12,
        published: true,
        isSynthesizedBuiltIn: false,
      },
      {
        id: 'real-song-jane-woh-kaise-log-the',
        title: 'Jane Woh Kaise Log The Jinke Pyaar Ko Pyaar Mila 🕯️',
        artist: 'Hemant Kumar · Pyaasa',
        description: 'Deep soulful classic notes for quiet reflection.',
        audioUrl: '/assets/aistudio/Jane_Woh_Kaise_Log_The_with_lyrics______________________________Hemant_Kumar__Pyaasa__HD_Song_-_Saregama_Music_a4fd1c3d.mp3',
        coverUrl: '',
        duration: 260,
        playlistId: 'cloudy-day',
        order: 13,
        published: true,
        isSynthesizedBuiltIn: false,
      },
      {
        id: 'real-song-ajeeb-dastan-hai-yeh',
        title: 'Ajeeb Dastan Hai Yeh 🌌',
        artist: 'Lata Mangeshkar · Dil Apna Aur Preet Parai',
        description: 'Kahan shuru kahan khatam... Iconic nostalgic melody.',
        audioUrl: '/assets/aistudio/Ajib_Dastan_Hai_Yeh__Lyrical__Lata_Mangeshkar__Dil_Apna_Aur_Preet_Parai__Old_Hindi_Songs_-_Old_Hindi_Songs_1db4b266.mp3',
        coverUrl: '',
        duration: 315,
        playlistId: 'cloudy-day',
        order: 14,
        published: true,
        isSynthesizedBuiltIn: false,
      },
      {
        id: 'real-song-kisi-ki-muskurahaton-pe-ho',
        title: 'Kisi Ki Muskurahaton Pe Ho Nisaar ☕',
        artist: 'Mukesh · Anari (1959)',
        description: 'Jeena isi ka naam hai... Warm uplifting classic.',
        audioUrl: '/assets/aistudio/Kisi_ki_Muskurahaton_Pe_Ho_-_VIDEO_SONG__Anari__1959___Raj_Kapoor___Nutan__Mukesh__Hindi_Songs_-_Venus_Originals_0a70e506.mp3',
        coverUrl: '',
        duration: 250,
        playlistId: 'chai-study',
        order: 15,
        published: true,
        isSynthesizedBuiltIn: false,
      },
      {
        id: 'real-song-itna-na-mujhse-tu-pyar-badha',
        title: 'Itna Na Mujhse Tu Pyar Badha 🎼',
        artist: 'Talat Mahmood & Lata Mangeshkar · Chhaya',
        description: 'Janam janam se hu saath tere... Melodious classic.',
        audioUrl: '/assets/aistudio/B_W_to_Color_-_Itna_Na_Mujhse_Tu_Pyar_Badha__Chhaya__Lata__Talat_Mahmood___Asha_Parekh_Sunil_Dutt_-_Ultra_Classic_d1c7a78e.mp3',
        coverUrl: '',
        duration: 230,
        playlistId: 'cloudy-day',
        order: 16,
        published: true,
        isSynthesizedBuiltIn: false,
      },
      {
        id: 'real-song-jahan-mein-aisa-kaun-hai',
        title: 'Jahan Mein Aisa Kaun Hai 🌟',
        artist: 'Asha Bhosle · Hum Dono',
        description: 'Kijisko gham mila nahi... Gentle comforting classic.',
        audioUrl: '/assets/aistudio/Jahan_Mein_Aesa_Kaun_Hai__Hum_Dono__Asha_Bhosle__Dev_Anand__Sahir_Ludhianvi__Old_Is_Gold_-_Saregama_Music_8d71851d.mp3',
        coverUrl: '',
        duration: 180,
        playlistId: 'cloudy-day',
        order: 17,
        published: true,
        isSynthesizedBuiltIn: false,
      },
    ],
    telegramConfig: {
      botToken: process.env.TELEGRAM_BOT_TOKEN || '',
      chatId: process.env.TELEGRAM_CHAT_ID || '',
      notifyOnSharedResponse: true,
      notifyOnSessionStart: true,
      notifyOnVerification: true,
      notifyOnGamePlay: true,
      notifyOnMusicPlay: false,
      notifyOnDailySummary: true,
      dailySummaryTime: '21:00',
      lastTestedAt: null as string | null,
      lastError: null as string | null,
    },
    emailConfig: {
      enabled: true,
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      user: process.env.SMTP_USER || process.env.GMAIL_USER || 'nraj9811@gmail.com',
      pass: process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || 'jlnbtilnnjayxhgs',
      fromName: 'DIYUUUU — Nishant Raj (Sir jiii) ☁️💜',
      fromEmail: 'nraj9811@gmail.com',
      lastSentAt: null as string | null,
      lastStatus: null as string | null,
      lastError: null as string | null,
    },
    activityLogs: [] as Array<{
      id: string;
      eventType: string;
      section: string;
      details: string;
      timestamp: string;
      clientSessionId: string;
      isEstimated?: boolean;
    }>,
    sharedResponses: [] as Array<{
      id: string;
      section: string;
      question?: string;
      responseText: string;
      submittedAt: string;
      telegramDelivered: boolean;
      telegramError?: string;
    }>,
  };
}

function readDb(): ReturnType<typeof getInitialDb> {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialDb();
      saveDb(initial);
      return initial;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    const initial = getInitialDb();

    return {
      ...initial,
      ...parsed,
      settings: {
        ...initial.settings,
        ...(parsed.settings || {}),
        nicknames: initial.settings.nicknames,
      },
      authVerification: {
        ...initial.authVerification,
        ...(parsed.authVerification || {}),
        activeOtps: parsed.authVerification?.activeOtps || [],
        tempTokens: parsed.authVerification?.tempTokens || [],
        verifiedSessions: parsed.authVerification?.verifiedSessions || [],
        verificationLogs: parsed.authVerification?.verificationLogs || [],
      },
      periodCareDay5: { ...initial.periodCareDay5, ...(parsed.periodCareDay5 || {}) },
      periodDays: { ...initial.periodDays, ...(parsed.periodDays || {}) },
      nicknameGenerator: initial.nicknameGenerator,
      surpriseEnvelope: initial.surpriseEnvelope,
      surpriseEnvelopes: (parsed.surpriseEnvelopes && parsed.surpriseEnvelopes.length >= 5) ? parsed.surpriseEnvelopes : initial.surpriseEnvelopes,
      notes: (parsed.notes && parsed.notes.length >= 10) ? parsed.notes : initial.notes,
      cycleTracker: {
        ...initial.cycleTracker,
        ...(parsed.cycleTracker || {}),
        logs: parsed.cycleTracker?.logs || [],
      },
      cuddleStats: {
        ...initial.cuddleStats,
        ...(parsed.cuddleStats || {}),
      },
      telegramConfig: {
        ...initial.telegramConfig,
        ...(parsed.telegramConfig || {}),
        botToken: parsed.telegramConfig?.botToken || process.env.TELEGRAM_BOT_TOKEN || '',
        chatId: parsed.telegramConfig?.chatId || process.env.TELEGRAM_CHAT_ID || '',
      },
      emailConfig: {
        ...initial.emailConfig,
        ...(parsed.emailConfig || {}),
        user: parsed.emailConfig?.user || process.env.SMTP_USER || process.env.GMAIL_USER || initial.emailConfig.user,
        pass: parsed.emailConfig?.pass || process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || initial.emailConfig.pass,
      },
      miniGames: { ...initial.miniGames, ...(parsed.miniGames || {}) },
      playlists: parsed.playlists || initial.playlists,
      musicTracks: initial.musicTracks,
    };
  } catch (err) {
    console.error('Error reading db:', err);
    return getInitialDb();
  }
}

function saveDb(db: any) {
  const tmpFile = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tmpFile, JSON.stringify(db, null, 2), 'utf-8');
  fs.renameSync(tmpFile, DB_FILE);
}

// Telegram Helper
async function sendTelegramNotification(text: string, db?: any): Promise<{ success: boolean; error?: string }> {
  const currentDb = db || readDb();
  const token = currentDb.telegramConfig.botToken || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = currentDb.telegramConfig.chatId || process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return { success: false, error: 'Telegram Bot Token or Chat ID not configured.' };
  }

  try {
    const url = `https://api.telegram.org/bot${encodeURIComponent(token)}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      const errMsg = data.description || 'Telegram API returned an error';
      currentDb.telegramConfig.lastError = errMsg;
      saveDb(currentDb);
      return { success: false, error: errMsg };
    }

    currentDb.telegramConfig.lastError = null;
    saveDb(currentDb);
    return { success: true };
  } catch (err: any) {
    const errMsg = err.message || 'Network error communicating with Telegram';
    currentDb.telegramConfig.lastError = errMsg;
    saveDb(currentDb);
    return { success: false, error: errMsg };
  }
}

// Active Session Inactivity Tracker & Master Report Builder
const activeSessionStates = new Map<string, {
  firstSeen: number;
  lastSeen: number;
  timer: NodeJS.Timeout | null;
  lastReportSentAt: number;
}>();

async function sendMasterSessionReport(reason: string, clientSessionId?: string, dbInstance?: any): Promise<{ success: boolean; error?: string }> {
  const db = dbInstance || readDb();
  if (!db.telegramConfig?.botToken || !db.telegramConfig?.chatId) {
    return { success: false, error: 'Telegram not configured' };
  }

  const now = Date.now();
  const sid = clientSessionId || 'latest';
  const sessionState = activeSessionStates.get(sid);

  // Avoid duplicate reports within 15 seconds for the same session
  if (sessionState && now - sessionState.lastReportSentAt < 15000 && reason !== 'Manual Admin Request') {
    return { success: true };
  }
  if (sessionState) {
    sessionState.lastReportSentAt = now;
    if (sessionState.timer) {
      clearTimeout(sessionState.timer);
      sessionState.timer = null;
    }
  }

  const nowTime = new Date().toLocaleString('en-IN', { timeZone: db.settings.timezone || 'Asia/Kolkata' });
  const allLogs = db.activityLogs || [];
  const sessionLogs = clientSessionId
    ? allLogs.filter((l: any) => l.clientSessionId === clientSessionId)
    : allLogs.slice(0, 25);

  const logsToUse = sessionLogs.length > 0 ? sessionLogs : allLogs.slice(0, 20);

  // Calculate duration
  let durationStr = 'Active session';
  if (sessionState) {
    const diffSec = Math.max(1, Math.round((sessionState.lastSeen - sessionState.firstSeen) / 1000));
    const mins = Math.floor(diffSec / 60);
    const secs = diffSec % 60;
    durationStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  }

  // Unique sections visited in chronological order
  const chronological = [...logsToUse].reverse();
  const sectionsVisited: string[] = [];
  for (const log of chronological) {
    if (log.section && !sectionsVisited.includes(log.section)) {
      sectionsVisited.push(log.section);
    }
  }

  const pathText = sectionsVisited.length > 0 ? sectionsVisited.join(' ➔ ') : 'Welcome Screen ➔ Cozy Room';

  // Recent 12 actions formatted cleanly
  const timelineLines = chronological.slice(-12).map((l: any) => {
    const timePart = (l.timestamp || '').split(',')[1]?.trim() || l.timestamp || '';
    return `• [${timePart}] <b>${l.section}</b>: ${l.details || l.eventType}`;
  });

  // Recent shared responses
  const recentResponses = (db.sharedResponses || []).slice(0, 3).map((r: any) => {
    return `• <b>${r.section}:</b> "${String(r.responseText).substring(0, 120)}"`;
  });

  // Latest cycle log
  const latestCycle = db.cycleTracker?.logs?.[0];
  const cycleSummary = latestCycle
    ? `Day ${latestCycle.cycleDay} | Flow: ${latestCycle.flow} | Cramps: ${latestCycle.crampLevel}/10 | Mood: ${latestCycle.mood}`
    : 'No new cycle log in this session';

  const masterMsg =
    `📋👑 <b>DIYUUUU — COMPLETE MASTER SESSION REPORT</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `<b>Trigger Reason:</b> ${reason}\n` +
    `<b>Report Time (IST):</b> ${nowTime}\n` +
    `<b>Session Duration:</b> ${durationStr}\n` +
    `<b>Total Actions Logged:</b> ${logsToUse.length}\n\n` +
    `🗺️ <b>NAVIGATION PATH:</b>\n${pathText}\n\n` +
    `💋 <b>AFFECTION STATS:</b>\n` +
    `• Total Kisses: ${db.cuddleStats?.totalKisses || 143} (Last: ${db.cuddleStats?.lastKissIntensity || 'Sweet Kiss'})\n` +
    `• Total Hugs: ${db.cuddleStats?.totalHugs || 84} (Last: ${db.cuddleStats?.lastHugType || 'Tight Hug'})\n\n` +
    `🌸 <b>LATEST PERIOD & CYCLE STATUS:</b>\n` +
    `• ${cycleSummary}\n\n` +
    (recentResponses.length > 0
      ? `💌 <b>DIVYA'S LATEST SHARED NOTES/ANSWERS:</b>\n${recentResponses.join('\n')}\n\n`
      : '') +
    `⏱️ <b>STEP-BY-STEP ACTIVITY TIMELINE:</b>\n` +
    (timelineLines.length > 0 ? timelineLines.join('\n') : '• Visited Cozy Room') +
    `\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `<i>Sir jiii, yeh Divya ke session ki poori master report hai! ☁️💜</i>`;

  return sendTelegramNotification(masterMsg, db);
}

function touchSessionActivity(clientSessionId: string) {
  if (!clientSessionId) return;
  const now = Date.now();
  let state = activeSessionStates.get(clientSessionId);
  if (!state) {
    state = {
      firstSeen: now,
      lastSeen: now,
      timer: null,
      lastReportSentAt: 0,
    };
    activeSessionStates.set(clientSessionId, state);
  } else {
    state.lastSeen = now;
    if (state.timer) {
      clearTimeout(state.timer);
    }
  }

  // Schedule automatic Master Report after 90 seconds of inactivity
  state.timer = setTimeout(() => {
    sendMasterSessionReport('⏳ Inactivity Detected (Divya has been idle for 90s)', clientSessionId).catch(() => {});
  }, 90 * 1000);
}

// Mask Phone Number for Admin view (e.g. +91 ******3210)
function maskPhoneNumber(phone: string): string {
  const clean = phone.trim();
  if (clean.length < 8) return clean;
  const visibleStart = clean.substring(0, 3);
  const visibleEnd = clean.substring(clean.length - 4);
  return `${visibleStart} ******${visibleEnd}`;
}

// Real Email OTP Sender via Nodemailer
async function sendOtpEmail(toEmail: string, otpCode: string, db?: any): Promise<{ success: boolean; error?: string; messageId?: string }> {
  const currentDb = db || readDb();
  const emailCfg = currentDb.emailConfig || {};
  const user = (emailCfg.user || process.env.SMTP_USER || process.env.GMAIL_USER || 'nraj9811@gmail.com').trim();
  const rawPass = emailCfg.pass || process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || 'jlnbtilnnjayxhgs';
  const pass = rawPass.replace(/\s+/g, '');

  if (!user || !pass) {
    const errorMsg = 'SMTP credentials not configured (Requires Gmail user and 16-digit Google App Password)';
    emailCfg.lastError = errorMsg;
    emailCfg.lastStatus = 'failed: missing credentials';
    saveDb(currentDb);
    return { success: false, error: errorMsg };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: emailCfg.service === 'custom' ? undefined : (emailCfg.service || 'gmail'),
      host: emailCfg.service === 'custom' ? (emailCfg.host || 'smtp.gmail.com') : undefined,
      port: emailCfg.service === 'custom' ? (emailCfg.port || 465) : undefined,
      secure: emailCfg.service === 'custom' ? emailCfg.secure : true,
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const fromAddress = `"${emailCfg.fromName || 'DIYUUUU Sanctuary — Nishant Raj (Sir jiii) ☁️💜'}" <${emailCfg.fromEmail || user}>`;
    const nowFormatted = new Date().toLocaleString('en-IN', { timeZone: currentDb.settings.timezone || 'Asia/Kolkata' });

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your DIYUUUU Access OTP</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #0E221E; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div style="max-width: 520px; margin: 0 auto; background-color: #102A25; border-radius: 24px; padding: 36px 28px; border: 1px solid rgba(184, 168, 217, 0.35); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5); color: #F6F1E8;">
    <div style="text-align: center; margin-bottom: 26px;">
      <div style="font-size: 34px; margin-bottom: 8px;">☁️💜</div>
      <h1 style="color: #FFFDF8; font-size: 24px; margin: 0 0 6px 0; font-weight: 700; letter-spacing: -0.02em;">Welcome to your little world, Diyuuuu</h1>
      <p style="color: #B8A8D9; font-size: 14px; margin: 0;">For your cloudy days · Crafted with warmth by Nishant Raj (Sir jiii)</p>
    </div>

    <div style="background-color: #173B32; border: 1px solid rgba(184, 168, 217, 0.4); border-radius: 18px; padding: 26px; text-align: center; margin: 26px 0;">
      <p style="color: #A7B7A0; font-size: 12px; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">Your 6-Digit Verification OTP Code</p>
      <div style="font-size: 40px; font-weight: 800; letter-spacing: 10px; color: #FFFDF8; font-family: 'Courier New', Courier, monospace; padding: 8px 0; user-select: all;">${otpCode}</div>
      <p style="color: #E8B878; font-size: 13px; margin: 10px 0 0 0; font-weight: 500;">⏳ Valid for 10 minutes · Single-use code</p>
    </div>

    <p style="color: #F6F1E8; font-size: 14px; line-height: 1.6; margin: 20px 0;">
      Yeh OTP verify karne ke baad aapko <strong>Sir jiii (Nishant Raj)</strong> ki Date of Birth enter karni hogi, aur phir aapka comfort sanctuary open ho jayega.
    </p>

    <div style="background: rgba(184, 168, 217, 0.08); border-left: 3px solid #B8A8D9; border-radius: 8px; padding: 12px 16px; margin: 20px 0; font-size: 13px; color: #D8CEEE;">
      🌸 <em>"Aap jaise ho, bohot pyare aur strong lagte ho. Aaj ka din aaram se bitaiye."</em>
    </div>

    <hr style="border: none; border-top: 1px solid rgba(184, 168, 217, 0.2); margin: 26px 0;" />

    <div style="text-align: center; color: #A7B7A0; font-size: 12px; line-height: 1.6;">
      Sent at ${nowFormatted} (Asia/Kolkata)<br />
      Sirf aapke sukoon aur muskaan ke liye 🌸<br />
      <strong style="color: #FFFDF8;">Nishant Raj (Your Sir jiii) 💜</strong>
    </div>
  </div>
</body>
</html>
`;

    const info = await transporter.sendMail({
      from: fromAddress,
      to: toEmail,
      subject: `🌸 DIYUUUU — Your Verification OTP Code: ${otpCode}`,
      text: `Welcome to your little world, Diyuuuu ☁️💜\n\nYour 6-digit verification OTP code is: ${otpCode}\nValid for 10 minutes.\n\nNext step: Verify Nishant Raj's Date of Birth.\n\nCrafted with warmth by Nishant Raj (Sir jiii)`,
      html: htmlContent,
    });

    console.log(`[EMAIL DISPATCH SUCCESS] Sent OTP to ${toEmail} | MessageId: ${info.messageId}`);
    emailCfg.lastSentAt = nowFormatted;
    emailCfg.lastStatus = `Delivered to ${toEmail} (ID: ${info.messageId})`;
    emailCfg.lastError = null;
    saveDb(currentDb);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error('[EMAIL DISPATCH ERROR]', err);
    emailCfg.lastError = err.message || 'Failed to deliver email via SMTP';
    emailCfg.lastStatus = `Error: ${err.message}`;
    saveDb(currentDb);
    return { success: false, error: err.message };
  }
}

async function createApp() {
  const app = express();

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Admin Authentication Middleware
  const requireAdminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
    }
    const token = authHeader.substring(7);
    const db = readDb();
    const session = db.adminAuth.sessions.find((s: any) => s.token === token && s.expiresAt > Date.now());

    if (!session) {
      return res.status(401).json({ error: 'Session expired or invalid' });
    }
    (req as any).adminSession = session;
    next();
  };

  // ==========================================
  // TWO-STEP PERSONALIZED ACCESS FLOW API
  // ==========================================

  // Step 1: Send OTP to Email (and record Mobile Number)
  app.post('/api/auth/otp/send', async (req, res) => {
    try {
      const { mobileNumber, email } = req.body;
      if (!mobileNumber || typeof mobileNumber !== 'string') {
        return res.status(400).json({ error: 'Mobile number is required' });
      }
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ error: 'Valid email address is required to receive OTP' });
      }

      const cleanPhone = mobileNumber.replace(/[\s\-\(\)]/g, '');
      const cleanEmail = email.trim().toLowerCase();
      if (cleanPhone.length < 10 || !/^\+?[0-9]{10,15}$/.test(cleanPhone)) {
        return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number' });
      }

      const db = readDb();
      const now = Date.now();
      const nowFormatted = new Date().toLocaleString('en-IN', { timeZone: db.settings.timezone || 'Asia/Kolkata' });

      // Check existing OTP and cooldown
      const existing = db.authVerification.activeOtps.find((o) => o.phone === cleanPhone || o.email === cleanEmail);
      if (existing && existing.resendAfter > now) {
        const waitSec = Math.ceil((existing.resendAfter - now) / 1000);
        return res.status(429).json({
          error: `Please wait ${waitSec} seconds before requesting a new OTP.`,
          retryAfter: waitSec,
        });
      }

      // Generate 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = now + 10 * 60 * 1000; // 10 mins
      const resendAfter = now + 45 * 1000; // 45s cooldown

      // Remove previous OTP for this phone/email
      db.authVerification.activeOtps = db.authVerification.activeOtps.filter((o) => o.phone !== cleanPhone && o.email !== cleanEmail);
      db.authVerification.activeOtps.push({
        phone: cleanPhone,
        email: cleanEmail,
        otp: otpCode,
        expiresAt,
        attempts: 0,
        resendAfter,
      });

      console.log(`[AUTH OTP GENERATED] Destination: ${cleanEmail} (Phone: ${cleanPhone}) | OTP Code: ${otpCode}`);

      // Attempt Real Email Dispatch via Nodemailer
      const emailResult = await sendOtpEmail(cleanEmail, otpCode, db);

      // Log mobile & email submission record for Admin Dashboard
      const logId = 'vlog_' + Date.now();
      const newLog = {
        id: logId,
        mobileNumber: cleanPhone,
        email: cleanEmail,
        timestamp: nowFormatted,
        otpVerified: false,
        dobVerified: false,
        accessGranted: false,
        failedAttempts: 0,
        lastAttemptStatus: emailResult.success
          ? 'OTP delivered to email via SMTP'
          : `OTP generated (SMTP pending: ${emailResult.error || 'unconfigured'})`,
      };
      db.authVerification.verificationLogs.unshift(newLog);
      if (db.authVerification.verificationLogs.length > 300) {
        db.authVerification.verificationLogs = db.authVerification.verificationLogs.slice(0, 300);
      }

      saveDb(db);

      // Immediate Telegram Notification to Nishant Raj with OTP code
      if (db.telegramConfig.botToken && db.telegramConfig.chatId) {
        const maskedPhone = maskPhoneNumber(cleanPhone);
        const emailDeliveryStatus = emailResult.success
          ? `✅ Sent to <b>${cleanEmail}</b> via Gmail SMTP`
          : `⚠️ Email delivery pending: <i>${emailResult.error}</i>`;

        const tgMsg = `🔐 <b>DIYUUUU ACCESS — OTP DISPATCH</b>\n\n` +
          `<b>Visitor:</b> Diyuuuu (${maskedPhone})\n` +
          `<b>Email:</b> ${cleanEmail}\n` +
          `<b>6-Digit OTP:</b> <code>${otpCode}</code>\n` +
          `<b>Delivery:</b> ${emailDeliveryStatus}\n` +
          `<b>Time:</b> ${nowFormatted}\n\n` +
          `<i>Sir jiii, yeh OTP aap Divya ko share kar sakte ho ya enter kar sakte ho.</i>`;
        sendTelegramNotification(tgMsg, db).catch(() => {});
      }

      const [u, d] = cleanEmail.split('@');
      const maskedEmail = `${u.slice(0, 2)}***@${d || ''}`;

      if (emailResult.success) {
        res.json({
          success: true,
          emailDelivered: true,
          message: `OTP code sent successfully to ${maskedEmail}. Kripya apna inbox aur spam folder check kijiye.`,
          cooldownSeconds: 30,
        });
      } else {
        res.json({
          success: true,
          emailDelivered: false,
          pendingSmtp: true,
          message: `OTP code successfully generate ho chuka hai! (Yeh code Sir jiii ke Telegram par bhej diya gaya hai).`,
          cooldownSeconds: 15,
        });
      }
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to send OTP', details: err.message });
    }
  });

  // Helper endpoint to reveal active OTP for admin/help if email is delayed or testing
  app.post('/api/auth/otp/reveal-active', (req, res) => {
    try {
      const { mobileNumber, email, adminPhrase } = req.body;
      const db = readDb();
      const cleanPhone = (mobileNumber || '').replace(/[\s\-\(\)]/g, '');
      const cleanEmail = (email || '').trim().toLowerCase();

      const active = db.authVerification.activeOtps.find(
        (o) => (cleanEmail && o.email === cleanEmail) || (cleanPhone && o.phone === cleanPhone)
      );

      if (!active) {
        return res.status(404).json({ error: 'Koi active OTP nahi mila. Kripya pehle "Email par OTP Bhejo" tap kijiye.' });
      }

      // Allow if admin phrase is provided, OR if SMTP is not configured yet (for testing)
      const bootstrapPhrase = process.env.ADMIN_SETUP_PHRASE || 'MYLOVEDIVYA';
      const isAuthorized = !db.emailConfig?.pass || adminPhrase === bootstrapPhrase;

      if (!isAuthorized) {
        return res.status(403).json({ error: 'Incorrect verification phrase. Only Sir jiii can view this.' });
      }

      res.json({
        success: true,
        otp: active.otp,
        email: active.email,
        expiresInSeconds: Math.max(0, Math.round((active.expiresAt - Date.now()) / 1000)),
        message: 'Active OTP retrieved successfully.',
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve OTP', details: err.message });
    }
  });

  // Step 1 Verify: Verify Email OTP
  app.post('/api/auth/otp/verify', async (req, res) => {
    try {
      const { mobileNumber, email, otp } = req.body;
      if (!otp) {
        return res.status(400).json({ error: 'OTP is required' });
      }

      const cleanPhone = mobileNumber ? mobileNumber.replace(/[\s\-\(\)]/g, '') : '';
      const cleanEmail = email ? email.trim().toLowerCase() : '';
      const cleanOtp = otp.toString().trim();
      const db = readDb();
      const now = Date.now();
      const nowFormatted = new Date().toLocaleString('en-IN', { timeZone: db.settings.timezone || 'Asia/Kolkata' });

      const record = db.authVerification.activeOtps.find(
        (o) => (cleanEmail && o.email === cleanEmail) || (cleanPhone && o.phone === cleanPhone)
      );

      // Find log entry
      const logEntry = db.authVerification.verificationLogs.find(
        (l) => (cleanEmail && (l as any).email === cleanEmail) || (cleanPhone && l.mobileNumber === cleanPhone)
      );

      if (!record) {
        return res.status(400).json({ error: 'No active OTP found for this account, or it has expired. Please request a new OTP.' });
      }

      if (record.expiresAt < now) {
        db.authVerification.activeOtps = db.authVerification.activeOtps.filter((o) => o !== record);
        saveDb(db);
        return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
      }

      if (record.attempts >= 5) {
        db.authVerification.activeOtps = db.authVerification.activeOtps.filter((o) => o !== record);
        if (logEntry) {
          logEntry.failedAttempts += 1;
          logEntry.lastAttemptStatus = 'Locked out: Too many failed OTP attempts';
        }
        saveDb(db);
        return res.status(429).json({ error: 'Too many incorrect attempts. Please request a new OTP.' });
      }

      if (record.otp !== cleanOtp) {
        record.attempts += 1;
        if (logEntry) {
          logEntry.failedAttempts += 1;
          logEntry.lastAttemptStatus = `Incorrect OTP (Attempt ${record.attempts}/5)`;
        }
        saveDb(db);
        return res.status(400).json({ error: `Incorrect OTP. ${5 - record.attempts} attempts remaining.` });
      }

      // OTP is valid! Issue temporary token for Step 2 (DOB verification)
      const tempToken = 'temp_' + crypto.randomBytes(24).toString('hex');
      db.authVerification.tempTokens.push({
        token: tempToken,
        phone: record.phone || cleanPhone,
        email: record.email || cleanEmail,
        expiresAt: now + 10 * 60 * 1000, // 10 mins to enter DOB
        attempts: 0,
      });

      // Remove used OTP
      db.authVerification.activeOtps = db.authVerification.activeOtps.filter((o) => o !== record);

      if (logEntry) {
        logEntry.otpVerified = true;
        logEntry.lastAttemptStatus = 'Email OTP verified successfully. Proceeding to Nishant Raj DOB check.';
      }
      saveDb(db);

      // Telegram alert for OTP verified (no credentials included)
      if (db.telegramConfig.botToken && db.telegramConfig.chatId && db.telegramConfig.notifyOnVerification !== false) {
        const masked = maskPhoneNumber(record.phone || cleanPhone);
        const tgMsg = `✅ <b>DIYUUUU ACCESS — EMAIL OTP VERIFIED</b>\n\n` +
          `<b>Visitor:</b> Diyuuuu (${masked})\n` +
          `<b>Status:</b> OTP verified successfully. Next: Verifying Nishant Raj's Date of Birth.\n` +
          `<b>Time:</b> ${nowFormatted}`;
        sendTelegramNotification(tgMsg, db).catch(() => {});
      }

      res.json({
        success: true,
        message: 'Email OTP verified successfully. Please proceed to Step 2.',
        tempToken,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Verification failed', details: err.message });
    }
  });

  // Step 2: Verify Date of Birth with Temp Token
  app.post('/api/auth/dob/verify', async (req, res) => {
    try {
      const { tempToken, dob } = req.body;
      if (!tempToken || !dob) {
        return res.status(400).json({ error: 'Verification token and Date of Birth are required.' });
      }

      const db = readDb();
      const now = Date.now();
      const nowFormatted = new Date().toLocaleString('en-IN', { timeZone: db.settings.timezone || 'Asia/Kolkata' });

      // Find temporary token
      const tempRecord = db.authVerification.tempTokens.find((t) => t.token === tempToken && t.expiresAt > now);
      if (!tempRecord) {
        return res.status(401).json({ error: 'Session expired. Please restart mobile verification.' });
      }

      const logEntry = db.authVerification.verificationLogs.find((l) => l.mobileNumber === tempRecord.phone);

      if (tempRecord.attempts >= 5) {
        db.authVerification.tempTokens = db.authVerification.tempTokens.filter((t) => t.token !== tempToken);
        if (logEntry) {
          logEntry.failedAttempts += 1;
          logEntry.lastAttemptStatus = 'Locked out: Too many failed DOB attempts';
        }
        saveDb(db);
        return res.status(429).json({ error: 'Too many incorrect attempts. Please verify your phone number again.' });
      }

      // Expected DOB validation (Expected: 24 April 2008 -> 2008-04-24)
      const expectedDob = db.authVerification.expectedDob || '2008-04-24';
      const cleanInputDob = dob.toString().trim();

      // Normalize date comparison
      let isMatch = false;
      if (cleanInputDob === expectedDob) {
        isMatch = true;
      } else {
        // Try parsing dates
        const parsedInput = new Date(cleanInputDob);
        const parsedExpected = new Date(expectedDob);
        if (
          !isNaN(parsedInput.getTime()) &&
          parsedInput.getUTCFullYear() === parsedExpected.getUTCFullYear() &&
          parsedInput.getUTCMonth() === parsedExpected.getUTCMonth() &&
          parsedInput.getUTCDate() === parsedExpected.getUTCDate()
        ) {
          isMatch = true;
        }
      }

      if (!isMatch) {
        tempRecord.attempts += 1;
        if (logEntry) {
          logEntry.failedAttempts += 1;
          logEntry.lastAttemptStatus = `DOB verification failed (${tempRecord.attempts}/5)`;
        }
        saveDb(db);

        // Telegram alert for DOB failure (NO expected or entered DOB is sent!)
        if (db.telegramConfig.botToken && db.telegramConfig.chatId && db.telegramConfig.notifyOnVerification !== false) {
          const masked = maskPhoneNumber(tempRecord.phone);
          const tgMsg = `⚠️ <b>DIYUUUU ACCESS — DOB VERIFICATION FAILED</b>\n\n` +
            `<b>Mobile:</b> ${masked}\n` +
            `<b>Result:</b> Incorrect Date of Birth entered.\n` +
            `<b>Time:</b> ${nowFormatted}`;
          sendTelegramNotification(tgMsg, db).catch(() => {});
        }

        return res.status(400).json({
          error: 'Date of birth does not match our records. Please check and re-enter.',
          attemptsRemaining: 5 - tempRecord.attempts,
        });
      }

      // BOTH STEPS SUCCEEDED! Grant Full Visitor Access Session
      const sessionToken = 'diyu_vis_' + crypto.randomBytes(32).toString('hex');
      const sessionDuration = 30 * 24 * 60 * 60 * 1000; // 30 days
      db.authVerification.verifiedSessions.push({
        token: sessionToken,
        phone: tempRecord.phone,
        createdAt: now,
        expiresAt: now + sessionDuration,
      });

      // Remove temp token
      db.authVerification.tempTokens = db.authVerification.tempTokens.filter((t) => t.token !== tempToken);

      if (logEntry) {
        logEntry.dobVerified = true;
        logEntry.accessGranted = true;
        logEntry.lastAttemptStatus = 'Access Granted: Mobile and DOB verified successfully.';
      }
      saveDb(db);

      // Telegram notification for successful access granted
      if (db.telegramConfig.botToken && db.telegramConfig.chatId && db.telegramConfig.notifyOnVerification !== false) {
        const masked = maskPhoneNumber(tempRecord.phone);
        const tgMsg = `🎉 <b>DIYUUUU ACCESS — ACCESS GRANTED!</b>\n\n` +
          `<b>Visitor:</b> Diyuuuu (${masked})\n` +
          `<b>OTP:</b> Verified ✅\n` +
          `<b>DOB:</b> Verified ✅\n` +
          `<b>Access:</b> Granted into Cozy Room ☁️💜\n` +
          `<b>Time:</b> ${nowFormatted}`;
        sendTelegramNotification(tgMsg, db).catch(() => {});
      }

      res.json({
        success: true,
        message: 'Aapka little world ready hai ☁️💜',
        sessionToken,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'DOB verification error', details: err.message });
    }
  });

  // Check visitor access session
  app.get('/api/auth/session/check', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({ verified: false });
    }
    const token = authHeader.substring(7);
    const db = readDb();
    const session = db.authVerification.verifiedSessions.find((s) => s.token === token && s.expiresAt > Date.now());

    if (!session) {
      return res.json({ verified: false });
    }
    res.json({ verified: true });
  });

  // Admin: Get Access & Verification Logs
  app.get('/api/admin/verification-logs', requireAdminAuth, (_req, res) => {
    const db = readDb();
    // Return logs with phone numbers masked by default
    const maskedLogs = db.authVerification.verificationLogs.map((l) => ({
      ...l,
      email: (l as any).email || '—',
      maskedPhone: maskPhoneNumber(l.mobileNumber),
    }));

    res.json({
      logs: maskedLogs,
      expectedDob: db.authVerification.expectedDob,
      requireVerification: db.authVerification.requireVerification,
      totalCount: db.authVerification.verificationLogs.length,
    });
  });

  // Admin: Protected Reveal of Unmasked Phone Number
  app.post('/api/admin/verification-logs/:id/reveal', requireAdminAuth, (req, res) => {
    const db = readDb();
    const entry = db.authVerification.verificationLogs.find((l) => l.id === req.params.id);
    if (!entry) return res.status(404).json({ error: 'Log entry not found' });
    res.json({ mobileNumber: entry.mobileNumber });
  });

  // Admin: Delete a specific verification log
  app.delete('/api/admin/verification-logs/:id', requireAdminAuth, (req, res) => {
    const db = readDb();
    db.authVerification.verificationLogs = db.authVerification.verificationLogs.filter((l) => l.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  });

  // Admin: Clear all verification logs
  app.delete('/api/admin/verification-logs', requireAdminAuth, (_req, res) => {
    const db = readDb();
    db.authVerification.verificationLogs = [];
    saveDb(db);
    res.json({ success: true, message: 'All verification logs deleted.' });
  });

  // Admin: Update Expected DOB & verification settings
  app.put('/api/admin/verification-config', requireAdminAuth, (req, res) => {
    const { expectedDob, requireVerification } = req.body;
    const db = readDb();
    if (expectedDob !== undefined) {
      db.authVerification.expectedDob = expectedDob.trim();
    }
    if (requireVerification !== undefined) {
      db.authVerification.requireVerification = Boolean(requireVerification);
    }
    saveDb(db);
    res.json({
      success: true,
      expectedDob: db.authVerification.expectedDob,
      requireVerification: db.authVerification.requireVerification,
    });
  });

  // Admin: Get Email & SMTP Configuration
  app.get('/api/admin/email-config', requireAdminAuth, (_req, res) => {
    const db = readDb();
    const cfg = db.emailConfig || {};
    res.json({
      service: cfg.service || 'gmail',
      host: cfg.host || 'smtp.gmail.com',
      port: cfg.port || 465,
      secure: cfg.secure !== false,
      user: cfg.user || '',
      hasPassword: Boolean(cfg.pass),
      fromName: cfg.fromName || 'DIYUUUU Sanctuary — Nishant Raj (Sir jiii) ☁️💜',
      fromEmail: cfg.fromEmail || cfg.user || '',
      lastSentAt: cfg.lastSentAt,
      lastStatus: cfg.lastStatus,
      lastError: cfg.lastError,
    });
  });

  // Admin: Update Email & SMTP Configuration
  app.put('/api/admin/email-config', requireAdminAuth, (req, res) => {
    try {
      const db = readDb();
      const { service, host, port, secure, user, pass, fromName, fromEmail } = req.body;
      if (!db.emailConfig) {
        db.emailConfig = {
          enabled: true,
          service: 'gmail',
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          user: '',
          pass: '',
          fromName: 'DIYUUUU Sanctuary — Nishant Raj (Sir jiii) ☁️💜',
          fromEmail: '',
          lastSentAt: null,
          lastStatus: null,
          lastError: null,
        };
      }

      if (service !== undefined) db.emailConfig.service = service;
      if (host !== undefined) db.emailConfig.host = host;
      if (port !== undefined) db.emailConfig.port = Number(port);
      if (secure !== undefined) db.emailConfig.secure = Boolean(secure);
      if (user !== undefined) db.emailConfig.user = user.trim();
      if (pass !== undefined && pass.trim() !== '') db.emailConfig.pass = pass.trim();
      if (fromName !== undefined) db.emailConfig.fromName = fromName.trim();
      if (fromEmail !== undefined) db.emailConfig.fromEmail = fromEmail.trim();

      saveDb(db);
      res.json({ success: true, message: 'Email & SMTP settings saved successfully.' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update email settings', details: err.message });
    }
  });

  // Admin: Send Test Email
  app.post('/api/admin/email-config/test', requireAdminAuth, async (req, res) => {
    try {
      const db = readDb();
      const testEmail = req.body.testEmail || db.emailConfig?.user || 'nraj9811@gmail.com';
      if (!testEmail || !testEmail.includes('@')) {
        return res.status(400).json({ error: 'Please enter a valid destination email address for testing.' });
      }

      const testOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const result = await sendOtpEmail(testEmail, testOtp, db);

      if (result.success) {
        res.json({
          success: true,
          message: `Test email successfully delivered to ${testEmail}! Check your inbox. (MessageId: ${result.messageId})`,
        });
      } else {
        res.status(500).json({
          success: false,
          error: `Failed to deliver email: ${result.error}`,
        });
      }
    } catch (err: any) {
      res.status(500).json({ error: 'Test email failed', details: err.message });
    }
  });

  // Admin: Get Active OTP list (so Nishant can inspect active codes immediately)
  app.get('/api/admin/active-otps', requireAdminAuth, (_req, res) => {
    const db = readDb();
    const now = Date.now();
    const active = db.authVerification.activeOtps
      .filter((o) => o.expiresAt > now)
      .map((o) => ({
        phone: o.phone,
        email: o.email,
        otp: o.otp,
        expiresInSeconds: Math.round((o.expiresAt - now) / 1000),
      }));
    res.json({ activeOtps: active });
  });

  // ==========================================
  // PUBLIC CLIENT API ROUTES
  // ==========================================

  app.get('/api/content', (_req, res) => {
    try {
      const db = readDb();
      const hasTelegram = Boolean(db.telegramConfig.botToken && db.telegramConfig.chatId);
      res.json({
        settings: db.settings,
        periodCareDay5: db.periodCareDay5,
        periodDays: db.periodDays || {},
        currentPeriodDay: 5,
        cycleTracker: db.cycleTracker || {
          previousCycleStart: '2026-09-29',
          previousCycleEnd: '2026-10-04',
          currentCycleStart: '2026-10-24',
          cycleLengthDays: 28,
          periodDurationDays: 6,
          currentDay: 5,
          logs: [],
        },
        cuddleStats: db.cuddleStats || { totalKisses: 143, totalHugs: 84 },
        nicknameGenerator: db.nicknameGenerator,
        comfortCorner: db.comfortCorner,
        notes: db.notes.filter((n: any) => n.published),
        letters: db.letters.filter((l: any) => l.published),
        appreciationCards: db.appreciationCards.filter((c: any) => c.published),
        memories: db.memories.filter((m: any) => m.published),
        familyVisitEvent: db.familyVisitEvent,
        todayPlan: db.todayPlan,
        surpriseEnvelope: db.surpriseEnvelope,
        surpriseEnvelopes: db.surpriseEnvelopes || [],
        miniGames: db.miniGames,
        playlists: db.playlists,
        musicTracks: db.musicTracks.filter((t: any) => t.published),
        telegramConfigured: hasTelegram,
        requireVerification: db.authVerification.requireVerification !== false,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to read content', details: err.message });
    }
  });

  // Submit daily cycle & period wellness log (Delivers live report to Nishant's Telegram)
  app.post('/api/cycle/log', async (req, res) => {
    try {
      const { date, cycleDay, flow, crampLevel, mood, symptoms, cravings, note } = req.body;
      const db = readDb();
      if (!db.cycleTracker) {
        db.cycleTracker = {
          previousCycleStart: '2026-09-29',
          previousCycleEnd: '2026-10-04',
          currentCycleStart: '2026-10-24',
          cycleLengthDays: 28,
          periodDurationDays: 6,
          currentDay: 5,
          logs: [],
        };
      }

      const nowFormatted = new Date().toLocaleString('en-IN', { timeZone: db.settings.timezone || 'Asia/Kolkata' });
      const newLog = {
        id: 'clog_' + Date.now(),
        date: date || new Date().toISOString().split('T')[0],
        cycleDay: cycleDay || 5,
        flow: flow || 'Light',
        crampLevel: crampLevel || 5,
        mood: mood || 'Resting',
        symptoms: symptoms || [],
        cravings: cravings || [],
        note: note || '',
        submittedAt: nowFormatted,
      };

      db.cycleTracker.logs.unshift(newLog);
      if (db.cycleTracker.logs.length > 100) {
        db.cycleTracker.logs = db.cycleTracker.logs.slice(0, 100);
      }
      saveDb(db);

      // Instant Detailed Telegram Notification to Nishant Raj
      if (db.telegramConfig.botToken && db.telegramConfig.chatId) {
        const symptomsText = (symptoms && symptoms.length > 0) ? symptoms.join(', ') : 'None selected';
        const cravingsText = (cravings && cravings.length > 0) ? cravings.join(', ') : 'None selected';
        const noteText = note ? `"${note}"` : 'None';

        const tgReport = `🩸🌸 <b>DIVYA (DIYUUUU) — DAILY PERIOD & WELLNESS UPDATE</b>\n\n` +
          `<b>Cycle Day:</b> Day ${cycleDay || '5'} (${newLog.date})\n` +
          `<b>Bleeding Flow:</b> ${flow}\n` +
          `<b>Cramps Pain Level:</b> ${crampLevel}/10\n` +
          `<b>Mood:</b> ${mood}\n` +
          `<b>Physical Symptoms:</b> ${symptomsText}\n` +
          `<b>Cravings:</b> ${cravingsText}\n` +
          `<b>Message for Sir jiii:</b> ${noteText}\n\n` +
          `<b>Time (IST):</b> ${nowFormatted}\n` +
          `<i>Aapki Beendani ji ne site se direct update bheja hai. Please take extra care of her! ☁️💜</i>`;

        sendTelegramNotification(tgReport, db).catch(() => {});
      }

      res.json({
        success: true,
        message: 'Cycle update logged and delivered to Nishant successfully!',
        log: newLog,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to log cycle update', details: err.message });
    }
  });

  app.get('/api/cycle', (_req, res) => {
    const db = readDb();
    res.json(db.cycleTracker || {});
  });

  // Cuddle & Kiss action notification endpoint
  app.post('/api/kiss-hug/send', async (req, res) => {
    try {
      const { type, intensity, location, count, message } = req.body;
      const db = readDb();
      if (!db.cuddleStats) {
        db.cuddleStats = {
          totalKisses: 143,
          totalHugs: 84,
          lastInteraction: new Date().toISOString(),
          lastKissIntensity: undefined,
          lastHugType: undefined,
          lastMessage: undefined,
        };
      }

      if (type === 'kiss') {
        db.cuddleStats.totalKisses = (db.cuddleStats.totalKisses || 143) + 1;
        db.cuddleStats.lastKissIntensity = intensity;
      } else {
        db.cuddleStats.totalHugs = (db.cuddleStats.totalHugs || 84) + 1;
        db.cuddleStats.lastHugType = intensity;
      }
      db.cuddleStats.lastMessage = message;
      saveDb(db);

      // Telegram notification for cravings
      if (db.telegramConfig.botToken && db.telegramConfig.chatId) {
        const nowFormatted = new Date().toLocaleString('en-IN', { timeZone: db.settings.timezone || 'Asia/Kolkata' });
        const tgMsg = `${type === 'kiss' ? '💋' : '🫂'} <b>DIYUUUU LOVE ACTION UPDATE</b>\n\n` +
          `<b>Visitor:</b> Divya (Diyuuuu)\n` +
          `<b>Action:</b> ${type === 'kiss' ? 'KISS' : 'HUG'} (${intensity})\n` +
          (location ? `<b>Location:</b> ${location}\n` : '') +
          `<b>Message:</b> ${message || 'Diyuuuu sent love from sanctuary'}\n` +
          `<b>Total ${type}s:</b> ${type === 'kiss' ? db.cuddleStats.totalKisses : db.cuddleStats.totalHugs}\n` +
          `<b>Time:</b> ${nowFormatted}`;
        sendTelegramNotification(tgMsg, db).catch(() => {});
      }

      res.json({ success: true, stats: db.cuddleStats, message: 'Recorded successfully!' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to record love action', details: err.message });
    }
  });

  app.post('/api/share-response', async (req, res) => {
    try {
      const { section, question, responseText } = req.body;
      if (!responseText || typeof responseText !== 'string' || !responseText.trim()) {
        return res.status(400).json({ error: 'Response text is required' });
      }

      const db = readDb();
      const submissionId = 'resp-' + Date.now();
      const submissionTime = new Date().toLocaleString('en-IN', { timeZone: db.settings.timezone || 'Asia/Kolkata' });

      let telegramDelivered = false;
      let telegramError: string | undefined = undefined;

      if (db.telegramConfig.notifyOnSharedResponse && db.telegramConfig.botToken && db.telegramConfig.chatId) {
        const msg = `☁️💜 <b>DIYUUUU WEBSITE — NEW SHARED RESPONSE</b>\n\n` +
          `<b>Section:</b> ${section || 'Comfort Corner'}\n` +
          (question ? `<b>Prompt:</b> ${question}\n` : '') +
          `<b>Response:</b> <i>"${responseText.trim()}"</i>\n\n` +
          `<b>Submitted at:</b> ${submissionTime} (${db.settings.timezone || 'Asia/Kolkata'})\n` +
          `<b>Website:</b> ${db.settings.siteName}`;

        const tgResult = await sendTelegramNotification(msg, db);
        telegramDelivered = tgResult.success;
        telegramError = tgResult.error;
      }

      const newResponse = {
        id: submissionId,
        section: section || 'General',
        question: question || '',
        responseText: responseText.trim(),
        submittedAt: submissionTime,
        telegramDelivered,
        telegramError,
      };

      db.sharedResponses.unshift(newResponse);
      if (db.sharedResponses.length > 200) {
        db.sharedResponses = db.sharedResponses.slice(0, 200);
      }
      saveDb(db);

      res.json({
        success: true,
        id: submissionId,
        deliveredToTelegram: telegramDelivered,
        telegramError,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to record response', details: err.message });
    }
  });

  app.post('/api/activity', async (req, res) => {
    try {
      const { events } = req.body;
      if (!Array.isArray(events) || events.length === 0) {
        return res.status(400).json({ error: 'Events array required' });
      }

      const db = readDb();
      const nowTime = new Date().toLocaleString('en-IN', { timeZone: db.settings.timezone || 'Asia/Kolkata' });
      const addedLogs: any[] = [];

      for (const ev of events.slice(0, 20)) {
        if (!ev.eventType) continue;
        const logEntry = {
          id: 'log-' + Date.now() + '-' + Math.round(Math.random() * 1000),
          eventType: String(ev.eventType).substring(0, 50),
          section: String(ev.section || 'General').substring(0, 50),
          details: String(ev.details || '').substring(0, 200),
          timestamp: nowTime,
          clientSessionId: String(ev.clientSessionId || 'anon').substring(0, 50),
          isEstimated: Boolean(ev.isEstimated),
        };
        db.activityLogs.unshift(logEntry);
        addedLogs.push(logEntry);

        if (ev.eventType !== 'session_end' && ev.eventType !== 'inactivity_timeout' && ev.eventType !== 'tab_hidden') {
          touchSessionActivity(logEntry.clientSessionId);
        }

        if (db.telegramConfig.botToken && db.telegramConfig.chatId) {
          if (ev.eventType === 'session_start' && db.telegramConfig.notifyOnSessionStart) {
            const msg = `☁️💜 <b>DIYUUUU WEBSITE — VISITOR SESSION STARTED</b>\n` +
              `<b>Time:</b> ${nowTime}\n` +
              `<b>Section:</b> ${ev.section || 'Welcome Screen'}\n` +
              `Diyuuuu is in her comfort world.`;
            sendTelegramNotification(msg, db).catch(() => {});
          } else if (ev.eventType === 'session_end') {
            sendMasterSessionReport('🚪 Site Closed / Browser Tab Exited', logEntry.clientSessionId, db).catch(() => {});
          } else if (ev.eventType === 'tab_hidden') {
            sendMasterSessionReport('📱 Screen Minimized / Switched Away from Tab', logEntry.clientSessionId, db).catch(() => {});
          } else if (ev.eventType === 'inactivity_timeout') {
            sendMasterSessionReport('⏳ Inactivity Detected (Idle on Website)', logEntry.clientSessionId, db).catch(() => {});
          } else if (ev.eventType === 'section_view' || ev.eventType === 'navigation') {
            const msg = `📍 <b>DIYUUUU OPENED: ${String(ev.section).toUpperCase()}</b>\n\n` +
              `<b>Details:</b> ${ev.details || 'Viewed section'}\n` +
              `<b>Time:</b> ${nowTime}`;
            sendTelegramNotification(msg, db).catch(() => {});
          } else if (ev.eventType === 'interaction_click') {
            const msg = `👆 <b>DIYUUUU TAPPED: ${ev.section}</b>\n\n` +
              `<b>Action:</b> ${ev.details || 'Interacted'}\n` +
              `<b>Time:</b> ${nowTime}`;
            sendTelegramNotification(msg, db).catch(() => {});
          } else if (ev.eventType === 'game_play' && db.telegramConfig.notifyOnGamePlay) {
            const msg = `🎮 <b>DIYUUUU MINI-GAME ACTIVITY</b>\n` +
              `<b>Game:</b> ${ev.section}\n` +
              `<b>Details:</b> ${ev.details || 'Played a round'}\n` +
              `<b>Time:</b> ${nowTime}`;
            sendTelegramNotification(msg, db).catch(() => {});
          } else if (ev.eventType === 'music_play') {
            const msg = `🎵 <b>DIYUUUU MUSIC PLAYBACK</b>\n` +
              `<b>Track:</b> ${ev.details}\n` +
              `<b>Time:</b> ${nowTime}`;
            sendTelegramNotification(msg, db).catch(() => {});
          }
        }
      }

      if (db.activityLogs.length > 500) {
        db.activityLogs = db.activityLogs.slice(0, 500);
      }
      saveDb(db);

      res.json({ success: true, count: addedLogs.length });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to record activity', details: err.message });
    }
  });

  // Dedicated Beacon / Master Report Endpoint for Tab Close & Inactivity
  app.post('/api/session/master-report', express.text({ type: '*/*' }), async (req, res) => {
    try {
      let payload: any = {};
      if (typeof req.body === 'string' && req.body.trim().startsWith('{')) {
        try {
          payload = JSON.parse(req.body);
        } catch {
          payload = {};
        }
      } else if (typeof req.body === 'object' && req.body !== null) {
        payload = req.body;
      }

      const reason = payload.reason || '🚪 Site Closed / Session Ended';
      const clientSessionId = payload.clientSessionId || undefined;
      const db = readDb();

      if (clientSessionId) {
        const nowTime = new Date().toLocaleString('en-IN', { timeZone: db.settings.timezone || 'Asia/Kolkata' });
        db.activityLogs.unshift({
          id: 'log-' + Date.now() + '-' + Math.round(Math.random() * 1000),
          eventType: 'session_end',
          section: payload.lastSection || 'Website Exit',
          details: reason,
          timestamp: nowTime,
          clientSessionId: String(clientSessionId).substring(0, 50),
          isEstimated: true,
        });
        saveDb(db);
      }

      const result = await sendMasterSessionReport(reason, clientSessionId, db);
      res.json({ success: result.success, error: result.error });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin Auth
  app.post('/api/admin/auth/login', (req, res) => {
    try {
      const { password } = req.body;
      if (!password || typeof password !== 'string') {
        return res.status(400).json({ error: 'Password or setup phrase is required' });
      }

      const db = readDb();
      const enteredHash = hashPassword(password.trim());
      const bootstrapPhrase = process.env.ADMIN_SETUP_PHRASE || 'MYLOVEDIVYA';
      const bootstrapHash = hashPassword(bootstrapPhrase);

      const isValid = (enteredHash === db.adminAuth.passwordHash) ||
        (!db.adminAuth.isCustomPasswordSet && enteredHash === bootstrapHash) ||
        (password.trim() === bootstrapPhrase);

      if (!isValid) {
        return res.status(401).json({ error: 'Invalid password or setup phrase' });
      }

      const token = 'adm_' + crypto.randomBytes(32).toString('hex');
      const session = {
        token,
        createdAt: Date.now(),
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      };

      db.adminAuth.sessions.push(session);
      db.adminAuth.sessions = db.adminAuth.sessions.filter((s: any) => s.expiresAt > Date.now());
      saveDb(db);

      res.json({
        success: true,
        token,
        isCustomPasswordSet: db.adminAuth.isCustomPasswordSet,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Authentication error', details: err.message });
    }
  });

  app.get('/api/admin/auth/check', requireAdminAuth, (_req, res) => {
    const db = readDb();
    res.json({
      authenticated: true,
      isCustomPasswordSet: db.adminAuth.isCustomPasswordSet,
    });
  });

  app.post('/api/admin/auth/setup-password', requireAdminAuth, (req, res) => {
    try {
      const { newPassword } = req.body;
      if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters long' });
      }

      const db = readDb();
      db.adminAuth.passwordHash = hashPassword(newPassword.trim());
      db.adminAuth.isCustomPasswordSet = true;
      saveDb(db);

      res.json({ success: true, message: 'Admin password updated successfully' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update password', details: err.message });
    }
  });

  app.post('/api/admin/auth/logout', requireAdminAuth, (req, res) => {
    const token = (req as any).adminSession.token;
    const db = readDb();
    db.adminAuth.sessions = db.adminAuth.sessions.filter((s: any) => s.token !== token);
    saveDb(db);
    res.json({ success: true });
  });

  // Admin Overview
  app.get('/api/admin/overview', requireAdminAuth, (_req, res) => {
    const db = readDb();
    const telegramStatus = {
      configured: Boolean(db.telegramConfig.botToken && db.telegramConfig.chatId),
      hasToken: Boolean(db.telegramConfig.botToken),
      hasChatId: Boolean(db.telegramConfig.chatId),
      maskedToken: db.telegramConfig.botToken ? `${db.telegramConfig.botToken.substring(0, 6)}...${db.telegramConfig.botToken.slice(-4)}` : '',
      chatId: db.telegramConfig.chatId || '',
      notifyOnSharedResponse: db.telegramConfig.notifyOnSharedResponse,
      notifyOnSessionStart: db.telegramConfig.notifyOnSessionStart,
      notifyOnGamePlay: db.telegramConfig.notifyOnGamePlay,
      notifyOnMusicPlay: db.telegramConfig.notifyOnMusicPlay,
      notifyOnDailySummary: db.telegramConfig.notifyOnDailySummary,
      dailySummaryTime: db.telegramConfig.dailySummaryTime,
      lastTestedAt: db.telegramConfig.lastTestedAt,
      lastError: db.telegramConfig.lastError,
    };

    res.json({
      settings: db.settings,
      periodCareDay5: db.periodCareDay5,
      nicknameGenerator: db.nicknameGenerator,
      comfortCorner: db.comfortCorner,
      notes: db.notes,
      letters: db.letters,
      appreciationCards: db.appreciationCards,
      memories: db.memories,
      familyVisitEvent: db.familyVisitEvent,
      todayPlan: db.todayPlan,
      surpriseEnvelope: db.surpriseEnvelope,
      miniGames: db.miniGames,
      playlists: db.playlists,
      musicTracks: db.musicTracks,
      telegram: telegramStatus,
      activityLogsCount: db.activityLogs.length,
      sharedResponsesCount: db.sharedResponses.length,
      verificationLogsCount: db.authVerification.verificationLogs.length,
      recentResponses: db.sharedResponses.slice(0, 20),
    });
  });

  // Admin Settings Update
  app.put('/api/admin/settings', requireAdminAuth, (req, res) => {
    try {
      const db = readDb();
      db.settings = { ...db.settings, ...req.body };
      saveDb(db);
      res.json({ success: true, settings: db.settings });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update settings', details: err.message });
    }
  });

  // Admin Family Visit Update
  app.put('/api/admin/family-visit', requireAdminAuth, (req, res) => {
    try {
      const db = readDb();
      db.familyVisitEvent = { ...db.familyVisitEvent, ...req.body };
      saveDb(db);
      res.json({ success: true, familyVisitEvent: db.familyVisitEvent });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update family visit event', details: err.message });
    }
  });

  // Admin Surprise Envelope Update
  app.put('/api/admin/surprise-envelope', requireAdminAuth, (req, res) => {
    try {
      const db = readDb();
      db.surpriseEnvelope = { ...db.surpriseEnvelope, ...req.body };
      saveDb(db);
      res.json({ success: true, surpriseEnvelope: db.surpriseEnvelope });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update surprise envelope', details: err.message });
    }
  });

  // Admin Period Care Update
  app.put('/api/admin/period-care', requireAdminAuth, (req, res) => {
    try {
      const db = readDb();
      db.periodCareDay5 = { ...db.periodCareDay5, ...req.body };
      saveDb(db);
      res.json({ success: true, periodCareDay5: db.periodCareDay5 });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update period care', details: err.message });
    }
  });

  // Admin Notes CRUD
  app.post('/api/admin/notes', requireAdminAuth, (req, res) => {
    try {
      const db = readDb();
      const newNote = {
        id: 'note-' + Date.now(),
        title: req.body.title || 'Untitled Note',
        body: req.body.body || '',
        category: req.body.category || 'Little reminders',
        date: req.body.date || new Date().toISOString().split('T')[0],
        published: req.body.published !== false,
        order: db.notes.length + 1,
      };
      db.notes.push(newNote);
      saveDb(db);
      res.json({ success: true, note: newNote });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to add note', details: err.message });
    }
  });

  app.put('/api/admin/notes/:id', requireAdminAuth, (req, res) => {
    try {
      const db = readDb();
      const idx = db.notes.findIndex((n: any) => n.id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: 'Note not found' });
      db.notes[idx] = { ...db.notes[idx], ...req.body };
      saveDb(db);
      res.json({ success: true, note: db.notes[idx] });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update note', details: err.message });
    }
  });

  app.delete('/api/admin/notes/:id', requireAdminAuth, (req, res) => {
    try {
      const db = readDb();
      db.notes = db.notes.filter((n: any) => n.id !== req.params.id);
      saveDb(db);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete note', details: err.message });
    }
  });

  // Admin Letters CRUD
  app.post('/api/admin/letters', requireAdminAuth, (req, res) => {
    try {
      const db = readDb();
      const newLetter = {
        id: 'letter-' + Date.now(),
        title: req.body.title || 'Untitled Letter',
        greeting: req.body.greeting || 'Dear Diyuuuu,',
        body: req.body.body || req.body.content || '',
        signature: req.body.signature || 'With warm regards,\nNishant Raj (Sir jiii)',
        date: req.body.date || new Date().toISOString().split('T')[0],
        published: req.body.published !== false,
      };
      db.letters.push(newLetter);
      saveDb(db);
      res.json({ success: true, letter: newLetter });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to add letter', details: err.message });
    }
  });

  app.put('/api/admin/letters/:id', requireAdminAuth, (req, res) => {
    try {
      const db = readDb();
      const idx = db.letters.findIndex((l: any) => l.id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: 'Letter not found' });
      db.letters[idx] = { ...db.letters[idx], ...req.body };
      saveDb(db);
      res.json({ success: true, letter: db.letters[idx] });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update letter', details: err.message });
    }
  });

  app.delete('/api/admin/letters/:id', requireAdminAuth, (req, res) => {
    try {
      const db = readDb();
      db.letters = db.letters.filter((l: any) => l.id !== req.params.id);
      saveDb(db);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete letter', details: err.message });
    }
  });

  // Admin Appreciation Cards CRUD
  app.post('/api/admin/appreciation', requireAdminAuth, (req, res) => {
    try {
      const db = readDb();
      const newCard = {
        id: 'apprec-' + Date.now(),
        title: req.body.title || 'Appreciation Card',
        message: req.body.message || req.body.body || '',
        icon: req.body.icon || 'sparkles',
        order: db.appreciationCards.length + 1,
        published: req.body.published !== false,
      };
      db.appreciationCards.push(newCard);
      saveDb(db);
      res.json({ success: true, card: newCard });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to add appreciation card', details: err.message });
    }
  });

  app.put('/api/admin/appreciation/:id', requireAdminAuth, (req, res) => {
    try {
      const db = readDb();
      const idx = db.appreciationCards.findIndex((c: any) => c.id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: 'Card not found' });
      db.appreciationCards[idx] = { ...db.appreciationCards[idx], ...req.body };
      saveDb(db);
      res.json({ success: true, card: db.appreciationCards[idx] });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update card', details: err.message });
    }
  });

  app.delete('/api/admin/appreciation/:id', requireAdminAuth, (req, res) => {
    try {
      const db = readDb();
      db.appreciationCards = db.appreciationCards.filter((c: any) => c.id !== req.params.id);
      saveDb(db);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete card', details: err.message });
    }
  });

  // Admin Memories CRUD
  app.post('/api/admin/memories', requireAdminAuth, (req, res) => {
    try {
      const db = readDb();
      const newMem = {
        id: 'mem-' + Date.now(),
        title: req.body.title || 'Sweet Memory',
        description: req.body.description || '',
        category: req.body.category || 'Moments',
        symbol: req.body.symbol || 'leaf',
        date: req.body.date || new Date().toISOString().split('T')[0],
        order: db.memories.length + 1,
        published: req.body.published !== false,
      };
      db.memories.push(newMem);
      saveDb(db);
      res.json({ success: true, memory: newMem });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to add memory', details: err.message });
    }
  });

  app.put('/api/admin/memories/:id', requireAdminAuth, (req, res) => {
    try {
      const db = readDb();
      const idx = db.memories.findIndex((m: any) => m.id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: 'Memory not found' });
      db.memories[idx] = { ...db.memories[idx], ...req.body };
      saveDb(db);
      res.json({ success: true, memory: db.memories[idx] });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update memory', details: err.message });
    }
  });

  app.delete('/api/admin/memories/:id', requireAdminAuth, (req, res) => {
    try {
      const db = readDb();
      db.memories = db.memories.filter((m: any) => m.id !== req.params.id);
      saveDb(db);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete memory', details: err.message });
    }
  });

  // Admin Games
  app.put('/api/admin/games/:id', requireAdminAuth, (req, res) => {
    try {
      const db = readDb();
      const games = db.miniGames as Record<string, any>;
      if (games[req.params.id]) {
        games[req.params.id] = { ...games[req.params.id], ...req.body };
        saveDb(db);
        res.json({ success: true, game: games[req.params.id] });
      } else {
        res.status(404).json({ error: 'Game not found' });
      }
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update game', details: err.message });
    }
  });

  app.post('/api/admin/games/:id/reset', requireAdminAuth, (req, res) => {
    try {
      const db = readDb();
      const games = db.miniGames as Record<string, any>;
      if (games[req.params.id]) {
        games[req.params.id].highScore = 0;
        games[req.params.id].playCount = 0;
        saveDb(db);
        res.json({ success: true, game: games[req.params.id] });
      } else {
        res.status(404).json({ error: 'Game not found' });
      }
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to reset game', details: err.message });
    }
  });

  // Admin Activity Logs & Responses
  app.get('/api/admin/activity-logs', requireAdminAuth, (_req, res) => {
    const db = readDb();
    res.json(db.activityLogs || []);
  });

  app.delete('/api/admin/activity-logs', requireAdminAuth, (_req, res) => {
    const db = readDb();
    db.activityLogs = [];
    saveDb(db);
    res.json({ success: true, message: 'Activity logs cleared' });
  });

  app.get('/api/admin/responses', requireAdminAuth, (_req, res) => {
    const db = readDb();
    res.json(db.sharedResponses || []);
  });

  app.delete('/api/admin/responses/:id', requireAdminAuth, (req, res) => {
    const db = readDb();
    db.sharedResponses = db.sharedResponses.filter((r: any) => r.id !== req.params.id);
    saveDb(db);
    res.json({ success: true, message: 'Response deleted' });
  });

  // Admin Music Management
  app.post('/api/admin/music/upload', requireAdminAuth, upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]), (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const audioFile = files?.['audio']?.[0];
      const coverFile = files?.['cover']?.[0];

      if (!audioFile && !req.body.externalAudioUrl) {
        return res.status(400).json({ error: 'An audio file or audio URL is required' });
      }

      const db = readDb();
      const audioUrl = audioFile ? `/uploads/${audioFile.filename}` : req.body.externalAudioUrl;
      const coverUrl = coverFile ? `/uploads/${coverFile.filename}` : (req.body.coverUrl || '');

      const newTrack = {
        id: 'track-' + Date.now(),
        title: req.body.title || audioFile?.originalname || 'Untitled Track',
        artist: req.body.artist || 'Nishant Raj',
        description: req.body.description || 'Uploaded track for Diyuuuu',
        audioUrl,
        coverUrl,
        duration: parseInt(req.body.duration || '180', 10),
        playlistId: req.body.playlistId || 'cloudy-day',
        order: db.musicTracks.length + 1,
        published: req.body.published !== 'false' && req.body.published !== false,
        isSynthesizedBuiltIn: false,
      };

      db.musicTracks.push(newTrack);
      saveDb(db);

      res.json({ success: true, track: newTrack });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to upload music track', details: err.message });
    }
  });

  app.delete('/api/admin/music/:id', requireAdminAuth, (req, res) => {
    try {
      const db = readDb();
      const track = db.musicTracks.find((t: any) => t.id === req.params.id);
      if (track && track.audioUrl && track.audioUrl.startsWith('/uploads/')) {
        const filePath = path.join(UPLOADS_DIR, path.basename(track.audioUrl));
        if (fs.existsSync(filePath)) {
          try { fs.unlinkSync(filePath); } catch (_) {}
        }
      }
      db.musicTracks = db.musicTracks.filter((t: any) => t.id !== req.params.id);
      saveDb(db);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete track', details: err.message });
    }
  });

  // Admin Telegram Config & Test
  app.put('/api/admin/telegram', requireAdminAuth, async (req, res) => {
    try {
      const { botToken, chatId, notifyOnSharedResponse, notifyOnSessionStart, notifyOnGamePlay, notifyOnMusicPlay, notifyOnDailySummary, dailySummaryTime } = req.body;
      const db = readDb();

      if (botToken !== undefined && botToken !== 'MASKED_NO_CHANGE') {
        db.telegramConfig.botToken = botToken.trim();
      }
      if (chatId !== undefined) {
        db.telegramConfig.chatId = chatId.trim();
      }
      if (notifyOnSharedResponse !== undefined) db.telegramConfig.notifyOnSharedResponse = Boolean(notifyOnSharedResponse);
      if (notifyOnSessionStart !== undefined) db.telegramConfig.notifyOnSessionStart = Boolean(notifyOnSessionStart);
      if (notifyOnGamePlay !== undefined) db.telegramConfig.notifyOnGamePlay = Boolean(notifyOnGamePlay);
      if (notifyOnMusicPlay !== undefined) db.telegramConfig.notifyOnMusicPlay = Boolean(notifyOnMusicPlay);
      if (notifyOnDailySummary !== undefined) db.telegramConfig.notifyOnDailySummary = Boolean(notifyOnDailySummary);
      if (dailySummaryTime !== undefined) db.telegramConfig.dailySummaryTime = dailySummaryTime;

      saveDb(db);

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update Telegram settings', details: err.message });
    }
  });

  app.post('/api/admin/telegram/test', requireAdminAuth, async (_req, res) => {
    try {
      const db = readDb();
      if (!db.telegramConfig.botToken || !db.telegramConfig.chatId) {
        return res.status(400).json({
          success: false,
          error: 'Please enter both Telegram Bot Token and Chat ID before sending a test notification.',
        });
      }

      const nowTime = new Date().toLocaleString('en-IN', { timeZone: db.settings.timezone || 'Asia/Kolkata' });
      const testMsg = `☁️💜 <b>DIYUUUU WEBSITE — TELEGRAM BOT TEST NOTIFICATION</b>\n\n` +
        `Hello Nishant Raj! Your Telegram Bot integration for <b>${db.settings.siteName}</b> is active and successfully delivering messages.\n\n` +
        `<b>Status:</b> Connected & Verified ✅\n` +
        `<b>Time:</b> ${nowTime} (${db.settings.timezone || 'Asia/Kolkata'})\n` +
        `<b>Target Recipient:</b> Diyuuuu's Comfort Space Administrator`;

      const result = await sendTelegramNotification(testMsg, db);
      if (result.success) {
        db.telegramConfig.lastTestedAt = nowTime;
        db.telegramConfig.lastError = null;
        saveDb(db);
        return res.json({ success: true, message: 'Test notification delivered successfully to Telegram!' });
      } else {
        return res.status(502).json({
          success: false,
          error: `Telegram delivery failed: ${result.error}`,
        });
      }
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // VITE DEV / PROD
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false, watch: null },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return app;
}

createApp().then((app) => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DIYUUUU Comfort Space running on http://0.0.0.0:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
