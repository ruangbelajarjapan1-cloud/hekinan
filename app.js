const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// ==========================================
// 1. DATA & KONFIGURASI
// ==========================================
window.globalContentData = []; 

// --- KONFIGURASI YOUTUBE LIVE ---
let YOUTUBE_LIVE_ID = ""; 

// --- AUTO FIX GAMBAR RUSAK (QA) ---
window.addEventListener('error', function(e) {
    if (e.target && e.target.tagName === 'IMG') {
        if (e.target.src.includes('logohekinan.jpeg')) return;
        e.target.src = 'logohekinan.jpeg'; 
        e.target.alt = "Gambar tidak tersedia";
        e.target.classList.add("opacity-50", "grayscale"); 
    }
}, true); 

let TARGET_DONASI = 42000000;
let TERKUMPUL_SAAT_INI = 21182533;

// Koordinat Hekinan, Jepang
const HEK_LAT = 34.884;
const HEK_LON = 136.993;

const POPUP_SLIDES_DATA = [
     { 
        src: "assets/foto/d1.jpeg",  
        link: "https://forms.gle/zJqA2Eba2FaxvrXv6", 
        text: "Daftar Dauroh" 
    },
     { 
        src: "assets/foto/d1.jpeg",  
        link: "javascript:window.bukaDonasiDauroh()",
        text: "Donasi Dauroh"
    },
   
     { 
        src: "assets/foto/d1.jpeg", // Pastikan ini path gambar poster Dauroh yang baru Anda upload
        link: "https://drive.google.com/file/d/1oPTpt7Sy1AmzwotGvCmPoZ4LW-zeAe0P/view?usp=sharing", 
        text: "Download Kitab" 
    },
    { 
        src: "assets/foto/w3.jpeg", 
        link: "https://wa.me/818013909425", 
        text: "Hubungi Admin" 
    }
]; 

const VIDEO_DONASI_LIST = ["8B-0qWT-WWI","GemAgh-FA5Q"];
const YOUTUBE_VIDEOS = ["SQBmP-frKNg", "pCTZQmBQi_8", "oQjqwQb6atA"];
const LOCAL_IMAGES = ["1a.png","1b.png","1.jpeg", "2.jpeg", "3.jpeg", "1a.png", "1b.png", "w3.jpeg"];

const DEFAULT_IQOMAH_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=420244150&single=true&output=csv";
const CENTER_DATA_URL  = "https://script.google.com/macros/s/AKfycbzZ7VngoyvmLTWdfSTTjLKQ0G2kguCSkx8z-L6Vku1TgPQBOCUyoWVbjhZQhptj_mIkww/exec";
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzZ7VngoyvmLTWdfSTTjLKQ0G2kguCSkx8z-L6Vku1TgPQBOCUyoWVbjhZQhptj_mIkww/exec";
const DEFAULT_KAJIAN_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=0&single=true&output=csv&t=3";
const DEFAULT_PENGUMUMAN_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=991747005&single=true&output=csv&t=3";
const DEFAULT_ARTIKEL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQT-wWHFcO0iPlfRKToM95GmJMm4ua8YVWe69OxaUUJsMei2jA-_9FUWkqNe93Xa3tcYbVIffh72GEU/pub?gid=940930982&single=true&output=csv";
const DEFAULT_KEGIATAN_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=1910296914&single=true&output=csv";
const DEFAULT_GALERI_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=1255907412&single=true&output=csv&t=2";
const DEFAULT_JUMAT_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=1921353770&single=true&output=csv";
const HIJRI_MONTHS_ID = ["Muharram", "Shafar", "Rabiul Awal", "Rabiul Akhir", "Jumadil Awal", "Jumadil Akhir", "Rajab", "Sya'ban", "Ramadhan", "Syawal", "Dzulqa'dah", "Dzulhijjah"];

const HADITHS = [
  { ar: "مَنْ صَامَ رَمَضَانَ ثُمَّ أَتْبَعَهُ سِتًّا مِنْ شَوَّالٍ، كَانَ كَصِيَامِ الدَّهْرِ", id: "Barangsiapa berpuasa Ramadhan kemudian mengikutinya dengan puasa enam hari di bulan Syawal, maka ia seperti berpuasa setahun penuh.", en: "Whoever fasts Ramadan, then follows it with six days of Shawwal, it is as if they fasted for a year." },
  { ar: "أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ تَعَالَى أَدْوَمُهَا وَإِنْ قَلَّ", id: "Amalan yang paling dicintai oleh Allah adalah amalan yang konsisten (rutin) meskipun itu sedikit.", en: "The most beloved of deeds to Allah are those that are most consistent, even if it is small." }
];

const DAFTAR_DOA = [
  { ar: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ", id: "Ya Allah, bukalah untukku pintu-pintu rahmat-Mu. (Doa Masuk Masjid)" },
  { ar: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ", id: "Ya Allah, sesungguhnya aku memohon keutamaan dari-Mu. (Doa Keluar Masjid)" }
];

const TRANSLATIONS = {
  id: {
    nav_sholat: "Jadwal Sholat", nav_kegiatan: "Kegiatan", nav_info: "Info", nav_donasi: "Donasi",
    hero_title_1: "Merajut Ukhuwah,", hero_title_2: "Membangun Peradaban.",
    hero_desc: "Pusat kegiatan ibadah, pendidikan anak, dan silaturahmi masyarakat muslim Indonesia di sekitar Hekinan Aichi ken Jepang.",
    hero_btn_wakaf: "Ikut Wakaf", hero_btn_sholat: "Jadwal Sholat", hero_btn_kiblat: "Arah Kiblat",
    hadith_label: "Mutiara Hadits", sholat_title: "Jadwal Sholat", gallery_title: "Kabar Terbaru", gallery_desc: "Ikuti terus pembaruan dan aktivitas terkini dari media sosial kami.",
    tab_announcement: "Pengumuman", tab_article: "Artikel & Faedah", empty_data: "Belum ada data terbaru.", empty_search: "Tidak ditemukan.",
    donasi_badge: "Peluang Amal Jariyah", donasi_title: "Investasi Kekal Akhirat", deadline_label: "Batas Waktu Wakaf (Tahap 1)",
    progress_title: "Progres Pembangunan", collected: "Terkumpul", needed: "Kekurangan",
    confirm_title: "Konfirmasi Donasi", confirm_desc: "Masukkan nominal yang telah ditransfer.", or: "ATAU", btn_confirm: "Konfirmasi via WA",
    footer_links: "Tautan", footer_follow: "Lokasi", btn_zakat: "Hitung Zakat", btn_donate_now: "Donasi Sekarang", btn_popup_wakaf: "Ikut Wakaf Sekarang",
    video_appeal_title: "Mengapa Kita Perlu Membangun Masjid?", video_appeal_desc: "Simak pesan berikut ini.", view_all: "Lihat Semua", view_channel: "Lihat Channel YouTube", contact_title: "Hubungi Kami",
    read_more: "Selengkapnya",
    reminder_label: "Belum bisa transfer sekarang?", reminder_btn: "Buat Komitmen Rutin", reminder_date_label: "Mulai Tanggal:", reminder_freq_label: "Frekuensi:",
    freq_once: "Sekali Saja", freq_monthly: "Rutin Tiap Bulan", btn_save_reminder: "Pasang Pengingat", reminder_note: "*Akan membuka Google Calendar Anda.",
    search_title: "Mencari:", search_people: "Orang Baik Lagi!", search_desc_1: "Jika 1 orang berwakaf", search_desc_2: "maka pelunasan masjid ini akan segera terwujud. Jadilah salah satu dari mereka!",
    joined_label: "Orang Lagi Dibutuhkan", btn_join_movement: "Gabung Gerakan Ini", target_complete: "Menuju Lunas",
    dedication_check: "Niatkan pahala untuk", dedication_target: "Orang Tua / yang sudah meninggal?", dedication_label: "Nama Orang Tua / yang sudah meninggal", dedication_placeholder: "Contoh: Bpk. Fulan bin Fulan",
    alert_nominal: "Mohon masukkan nominal donasi.", btn_loading: "Membuka WhatsApp...", btn_copied: "Tersalin",
    wa_opening: "Assalamu'alaikum, saya ingin konfirmasi donasi pembangunan Masjid As-Sunnah Hekinan.", wa_dedication: "🎁 Pahala diniatkan atas nama:", wa_closing: "Mohon dicek. Jazakumullah khairan.",
  },
  en: {
    nav_sholat: "Prayer Times", nav_kegiatan: "Gallery", nav_info: "Info", nav_donasi: "Donate",
    hero_title_1: "Weaving Brotherhood,", hero_title_2: "Building Civilization.",
    hero_desc: "Center for worship, children's education, and gathering for the Indonesian Muslim community around Hekinan, Aichi Prefecture, Japan.",
    hero_btn_wakaf: "Donate Now", hero_btn_sholat: "Prayer Times", hero_btn_kiblat: "Qibla Finder",
    hadith_label: "Daily Hadith", sholat_title: "Prayer Times", gallery_title: "As Sunnah Hekinan Update", gallery_desc: "Documentation of community activities.",
    tab_announcement: "Announcements", tab_article: "Articles", empty_data: "No updates.", empty_search: "Not found.",
    donasi_badge: "Charity Opportunity", donasi_title: "Invest for Hereafter", deadline_label: "Donation Deadline",
    progress_title: "Construction Progress", collected: "Collected", needed: "Remaining",
    confirm_title: "Confirm Donation", confirm_desc: "Enter transferred amount.", or: "OR", btn_confirm: "Confirm via WA",
    footer_links: "Links", footer_follow: "Location", btn_zakat: "Zakat Calculator", btn_donate_now: "Donate Now", btn_popup_wakaf: "Donate Now",
    video_appeal_title: "Why Do We Need to Build a Mosque?", video_appeal_desc: "Watch the following message.", view_all: "View All", view_channel: "Visit YouTube Channel", contact_title: "Contact Us",
    read_more: "Read More",
    reminder_label: "Can't transfer right now?", reminder_btn: "Make a Commitment", reminder_date_label: "Start Date:", reminder_freq_label: "Frequency:",
    freq_once: "One Time", freq_monthly: "Monthly (Recurring)", btn_save_reminder: "Set Reminder", reminder_note: "*Opens Google Calendar.",
    search_title: "Mission to Find:", search_people: "Good People More!", search_desc_1: "If 1 person donates", search_desc_2: "then this mosque will be fully paid off soon. Be one of them!",
    joined_label: "People Still Needed", btn_join_movement: "Join This Movement", target_complete: "Towards Completion",
    dedication_check: "Intend reward for", dedication_target: "Parents / Deceased?", dedication_label: "Name of Parents / Deceased", dedication_placeholder: "Ex: Mr. Fulan bin Fulan",
    alert_nominal: "Please enter donation amount.", btn_loading: "Opening WhatsApp...", btn_copied: "Copied",
    wa_opening: "Assalamu'alaikum, I would like to confirm my donation for As-Sunnah Hekinan Mosque construction.", wa_dedication: "🎁 Reward intended for:", wa_closing: "Please check. Jazakumullah Khairan.",
  }
};

// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================
let currentLang = localStorage.getItem("lang") || "id";

function renderHadith() {
  const day = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const h = HADITHS[day % HADITHS.length];
  if ($("#hadithArab")) $("#hadithArab").textContent = h.ar;
  if ($("#hadithTerjemah")) $("#hadithTerjemah").textContent = currentLang === 'en' ? h.en : h.id;
  if ($("#hadithRiwayat")) $("#hadithRiwayat").textContent = "Hadits Shahih";
}

let globalHijriData = null;
function renderHijri(apiData = null) {
  const el = $("#hijriDate");
  if (!el) return;
  if (apiData) globalHijriData = apiData;
  if (globalHijriData) {
    const d = globalHijriData.day;
    const m = globalHijriData.month.number - 1;
    const y = globalHijriData.year;
    const mName = currentLang === 'id' ? HIJRI_MONTHS_ID[m] : globalHijriData.month.en;
    el.textContent = `${d} ${mName} ${y} H`;
    return;
  }
  const loc = currentLang === 'en' ? 'en-US' : 'id-ID';
  try {
    el.textContent = new Intl.DateTimeFormat(loc + '-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()).replace(/ AH| H/g, " H");
  } catch (e) {
    el.textContent = new Intl.DateTimeFormat(loc + '-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()).replace(/ AH| H/g, " H");
  }
}

function setLang(lang) {
  currentLang = lang; 
  localStorage.setItem("lang", lang);
  const t = TRANSLATIONS[lang];
  if (!t) return;

  $$("[data-i18n]").forEach(el => { 
    const k = el.getAttribute("data-i18n"); 
    if (t[k]) el.textContent = t[k]; 
  });

  $$("[data-placeholder]").forEach(el => { 
    const key = el.getAttribute("data-placeholder");
    if (t[key]) el.placeholder = t[key]; 
  });

  const langBtn = $("#langToggle");
  const langBtnMob = $("#langToggleMob");
  if (langBtn) langBtn.innerHTML = lang === "id" ? 'ID | <span class="opacity-50">EN</span>' : '<span class="opacity-50">ID</span> | EN';
  if (langBtnMob) langBtnMob.innerHTML = lang === "id" ? 'ID | <span class="opacity-50">EN</span>' : '<span class="opacity-50">ID</span> | EN';

  renderHadith(); 
  renderHijri();
  document.dispatchEvent(new Event('langChanged'));
}

function sanitizeHTML(str) {
  if (!str) return "";
  let temp = str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  temp = temp.replace(/\[b\]/g, "<b>").replace(/\[\/b\]/g, "</b>")
             .replace(/\[i\]/g, "<i>").replace(/\[\/i\]/g, "</i>")
             .replace(/\[br\]/g, "<br>").replace(/\n/g, "<br>"); 
  return temp;
}

async function loadCsv(url) {
  const cacheKey = "cache_data_" + url;
  const cacheTimeKey = "cache_time_" + url;
  const CACHE_DURATION = 1 * 60 * 1000; 
  const cachedData = localStorage.getItem(cacheKey);
  const cachedTime = localStorage.getItem(cacheTimeKey);
  const now = new Date().getTime();

  if (cachedData && cachedTime && (now - cachedTime < CACHE_DURATION)) {
      return JSON.parse(cachedData);
  }

  try {
    const t = await fetch(url, { cache: "no-store" }).then(r => r.text());
    const r = []; let i = 0, c = "", row = [], q = false;
    while (i < t.length) {
      let char = t[i];
      if (char === '"') { if (q && t[i + 1] === '"') { c += '"'; i += 2; continue; } q = !q; i++; continue; }
      if (!q && char === ',') { row.push(c); c = ""; i++; continue; }
      if (!q && (char === '\n' || char === '\r')) { if (c || row.length) { row.push(c); r.push(row); row = []; c = ""; } if (char === '\r' && t[i + 1] === '\n') i++; i++; continue; }
      c += char; i++;
    }
    if (c || row.length) { row.push(c); r.push(row); }
    if (r.length === 0 || !r[0]) return [];

    const h = r[0].map(x => x.trim().toLowerCase());
    const finalData = r.slice(1).map(v => { const o = {}; h.forEach((k, x) => o[k] = v[x]?.trim() || ""); return o; });
    
    localStorage.setItem(cacheKey, JSON.stringify(finalData));
    localStorage.setItem(cacheTimeKey, now.toString());
    return finalData;
  } catch { 
    if (cachedData) return JSON.parse(cachedData);
    return []; 
  }
}

window.openArticleModal = (index) => {
  const data = window.globalContentData[index];
  const modal = document.getElementById("articleModal"); 
  if (!modal || !data) return;

  document.getElementById("modalTitle").textContent = data.title || "";
  document.getElementById("modalDate").innerHTML = `<i data-lucide="calendar" class="w-3 h-3"></i> ${data.date || "-"}`;
  document.getElementById("modalTag").textContent = data.tag || "Info";
  
  let posterDetail = "";
  if (data.poster && data.poster.length > 5) {
      posterDetail = `<img src="${sanitizeHTML(data.poster)}" class="w-full rounded-xl mb-5 object-contain max-h-[60vh] bg-slate-50 border border-slate-100" alt="Poster Detail">`;
  }
  document.getElementById("modalContent").innerHTML = posterDetail + sanitizeHTML(data.content || data.desc || "");

  const modalFooter = modal.querySelector(".border-t"); 
  const oldBtn = document.getElementById("dynamicActionBtn");
  if(oldBtn) oldBtn.remove();

  if (data.link_daftar && data.link_daftar.length > 5) {
      const btn = document.createElement("a");
      btn.id = "dynamicActionBtn";
      btn.href = data.link_daftar;
      btn.target = "_blank";
      btn.rel = "noopener noreferrer";
      btn.className = "flex items-center gap-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded-lg transition-colors shadow-sm ml-auto mr-2";
      btn.innerHTML = `<i data-lucide="edit" class="w-3 h-3"></i> Daftar Kegiatan`;
      const closeBtn = document.getElementById("closeArticleBtnBottom");
      if(closeBtn && modalFooter) modalFooter.insertBefore(btn, closeBtn);
  } else if (data.link) {
      const extBtn = document.getElementById("modalExternalLink");
      if(extBtn) {
         extBtn.href = data.link;
         extBtn.classList.remove("hidden"); extBtn.classList.add("flex");
      }
  } else {
      const extBtn = document.getElementById("modalExternalLink");
      if(extBtn) { extBtn.classList.add("hidden"); extBtn.classList.remove("flex"); }
  }

  modal.classList.remove("hidden"); modal.classList.add("flex");
  if(window.lucide && window.lucide.createIcons) window.lucide.createIcons();
};


document.addEventListener("DOMContentLoaded", () => {
  const modal = $("#articleModal");
  if(modal) {
    const close = () => { modal.classList.add("hidden"); modal.classList.remove("flex"); };
    $("#closeArticleBtn")?.addEventListener("click", close);
    $("#closeArticleBtnBottom")?.addEventListener("click", close);
    $("#closeArticleBackdrop")?.addEventListener("click", close);
  }
});

async function renderContent() {
  const showSkeleton = (id, count = 3) => {
      const el = document.getElementById(id);
      if (!el) return;
      const skeletonHTML = `
        <div class="animate-pulse bg-white rounded-2xl border border-slate-100 p-5 shadow-sm h-full">
            <div class="flex justify-between mb-4">
                <div class="h-4 w-16 bg-slate-200 rounded"></div>
                <div class="h-4 w-20 bg-slate-200 rounded"></div>
            </div>
            <div class="h-6 w-3/4 bg-slate-200 rounded mb-3"></div>
            <div class="h-4 w-full bg-slate-200 rounded mb-2"></div>
            <div class="h-4 w-2/3 bg-slate-200 rounded mb-6"></div>
            <div class="h-10 w-full bg-slate-200 rounded-xl"></div>
        </div>`;
      el.innerHTML = Array(count).fill(skeletonHTML).join("");
  };

  showSkeleton("wrapPengumuman", 3);
  showSkeleton("artikelList", 3);
  showSkeleton("kajianList", 3);

  window.globalContentData = []; 

  const mkCard = (x, type, index) => {
    let tagColor = "bg-slate-100 text-slate-600 border-slate-200";
    let tagName = x.tag || (type === 'artikel' ? "Artikel" : "Info");
    const t = tagName.toLowerCase();
    
    if (t.includes('dauroh') || t.includes('kajian')) tagColor = "bg-purple-50 text-purple-700 border-purple-100";
    else if (t.includes('penting') || t.includes('mendesak')) tagColor = "bg-red-50 text-red-700 border-red-100";
    else if (t.includes('ramadhan')) tagColor = "bg-emerald-50 text-emerald-700 border-emerald-100";

    let thumbnailHtml = "";
    if (x.poster && x.poster.length > 5) {
        thumbnailHtml = `
        <div onclick="window.openArticleModal(${index})" class="w-full mb-4 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer relative group shadow-sm">
            <img src="${sanitizeHTML(x.poster)}" alt="Thumbnail" class="w-full h-auto object-contain block group-hover:scale-105 transition-transform duration-500" loading="lazy">
            <div class="absolute inset-0 bg-black/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center">
                <div class="bg-white/95 backdrop-blur text-slate-800 px-3 py-1.5 rounded-full text-[10px] font-extrabold opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-md flex items-center gap-1 border border-slate-200">
                    <i data-lucide="zoom-in" class="w-3 h-3 text-sky-600"></i> Lihat Detail
                </div>
            </div>
        </div>`;
    }

    let actionButton = "";
    if (x.link_daftar && x.link_daftar.length > 5) {
        actionButton = `<a href="${x.link_daftar}" target="_blank" rel="noopener noreferrer" class="relative z-10 mt-3 w-full block text-center bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"><i data-lucide="edit" class="w-4 h-4"></i> Daftar Sekarang</a>`;
    } else {
        actionButton = `<button onclick="window.openArticleModal(${index})" class="relative z-10 mt-3 w-full block text-center bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-2 rounded-xl text-sm transition-all border border-slate-200">Selengkapnya</button>`;
    }

    const safeTitle = sanitizeHTML(x.title || "(Tanpa Judul)");
    const rawDesc = (type === 'artikel' ? x.excerpt : x.desc) || "";
    const safeDesc = sanitizeHTML(rawDesc).replace(/<br\s*[\/]?>/gi, ' ').replace(/<[^>]*>?/gm, '');

    return `
      <article class="group relative flex flex-col h-full bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div class="flex items-center justify-between mb-3">
          <span class="${tagColor} border px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">${sanitizeHTML(tagName)}</span>
          <span class="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <i data-lucide="calendar" class="w-3 h-3"></i> ${sanitizeHTML(x.date || "-")}
          </span>
        </div>
        ${thumbnailHtml} 
        <h3 class="text-lg font-bold text-slate-800 leading-snug mb-2 line-clamp-2 group-hover:text-sky-600 transition-colors">${safeTitle}</h3>
        <p class="text-sm text-slate-500 mb-4 line-clamp-3 flex-grow leading-relaxed">${safeDesc || "Klik tombol di bawah untuk melihat detail informasi ini."}</p>
        <div class="mt-auto pt-3 border-t border-slate-50">${actionButton}</div>
      </article>`;
  };

  const pW = document.getElementById("wrapPengumuman");
  if (pW) {
      const urlKegiatan = isAdmin() && localStorage.getItem("sheet_pengumuman") ? localStorage.getItem("sheet_pengumuman") : DEFAULT_KEGIATAN_CSV;
      const d = await loadCsv(urlKegiatan);
      const startIdx = window.globalContentData.length;
      d.forEach(item => window.globalContentData.push(item));

      if (d.length > 0) {
          pW.innerHTML = d.map((x, i) => mkCard(x, 'info', startIdx + i)).join("");
          document.getElementById("boardEmpty")?.classList.add("hidden");
      } else {
          pW.innerHTML = "";
          document.getElementById("boardEmpty")?.classList.remove("hidden");
      }
  }

  const aL = document.getElementById("artikelList");
  if (aL) {
      const urlArtikel = getCsvUrl("artikel");
      const d = await loadCsv(urlArtikel);
      const startIdx = window.globalContentData.length;
      d.forEach(item => window.globalContentData.push(item));
      
      const filter = (q) => {
          const filtered = d.map((item, i) => ({item, idx: startIdx + i})).filter(o => (o.item.title || "").toLowerCase().includes(q));
          
          aL.innerHTML = filtered.length ? filtered.map(o => mkCard(o.item, 'artikel', o.idx)).join("") : "";
          document.getElementById("artikelEmpty")?.classList.toggle("hidden", filtered.length > 0);
          if(window.lucide) window.lucide.createIcons();
      };
      filter("");
      document.getElementById("searchArtikel")?.addEventListener("input", e => filter(e.target.value.toLowerCase()));
  }
}
function initTabs() {
  const btnP = $("#tabPengumuman");
  const btnA = $("#tabArtikel");
  const wrapP = $("#wrapPengumuman");
  const wrapA = $("#wrapArtikel");
  const tabsContainer = $("#tabs");

  if (!btnP || !btnA || !tabsContainer) return;

  btnP.addEventListener("click", () => {
    tabsContainer.classList.remove("tab-right"); tabsContainer.classList.add("tab-left");
    wrapP.classList.remove("hidden"); wrapA.classList.add("hidden");
    wrapP.classList.add("animate-[fadeUp_0.3s_ease-out]");
  });

  btnA.addEventListener("click", () => {
    tabsContainer.classList.remove("tab-left"); tabsContainer.classList.add("tab-right");
    wrapP.classList.add("hidden"); wrapA.classList.remove("hidden");
    wrapA.classList.add("animate-[fadeUp_0.3s_ease-out]");
  });
}

// --- ADMIN ---
const isAdmin = () => new URLSearchParams(location.search).get("admin") === "1" && localStorage.getItem("is_admin") === "1";
function setupAdmin() {
  if (isAdmin()) $$(".admin-only").forEach(e => e.classList.remove("hidden"));
  document.addEventListener("keydown", e => { if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') { if (prompt("Kode:") === "as-sunnah-2025") { localStorage.setItem("is_admin", "1"); location.reload(); } } });
  $("#openData")?.addEventListener("click", (e) => { e.preventDefault(); $("#dataModal").classList.remove("hidden"); $("#dataModal").classList.add("flex"); });
  $("#closeData")?.addEventListener("click", () => { $("#dataModal").classList.add("hidden"); $("#dataModal").classList.remove("flex"); });
  $("#saveData")?.addEventListener("click", () => { ["kajian", "pengumuman", "artikel"].forEach(k => { const v = $(`#csv${k.charAt(0).toUpperCase() + k.slice(1)}`)?.value; v ? localStorage.setItem(`sheet_${k}`, v) : localStorage.removeItem(`sheet_${k}`); }); location.reload(); });
}
const getCsvUrl = (k) => isAdmin() && localStorage.getItem(`sheet_${k}`) || (k === "kajian" ? DEFAULT_KAJIAN_CSV : k === "pengumuman" ? DEFAULT_PENGUMUMAN_CSV : DEFAULT_ARTIKEL_CSV);

function initHeroSlider() {
  const slides = $$(".hero-slide"); if (slides.length < 2) return;
  let current = 0; setInterval(() => { slides[current].classList.remove("active"); current = (current + 1) % slides.length; slides[current].classList.add("active"); }, 5000);
}

// =======================================================
// SISTEM LIVE STREAMING & SHEET SYNC
// =======================================================
let currentWebLiveId = "";

async function cekLiveDariSheet() {
    const CSV_SETELAN = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=1608872178&single=true&output=csv"; 
    try {
        const response = await fetch(CSV_SETELAN + "&t=" + new Date().getTime());
        const text = await response.text();
        const rows = text.split('\n');
        let foundId = "";
        
        for (let row of rows) {
            const cols = row.split(',');
            if (cols[0] && cols[1]) {
                const key = cols[0].trim().toLowerCase();
                const val = cols[1].trim().replace(/['"\r]/g, '');

                if (key === "live_id") foundId = val;
                if (key === "target_donasi" && !isNaN(val) && val !== "") TARGET_DONASI = Number(val);
                if (key === "terkumpul_donasi" && !isNaN(val) && val !== "") TERKUMPUL_SAAT_INI = Number(val);
            }
        }
        
        YOUTUBE_LIVE_ID = foundId;
        initLiveStream(); 
        if (typeof initProgressWakaf === 'function') initProgressWakaf();
        
    } catch (error) { 
        console.error("Gagal cek Setelan dari Sheet", error); 
    }
}

function initLiveStream() {
    const container = $("#liveStreamContainer");
    const wrapper = $("#liveStreamWrapper");
    if (!container || !wrapper) return;

    if (YOUTUBE_LIVE_ID !== "") {
        if (currentWebLiveId !== YOUTUBE_LIVE_ID) {
            currentWebLiveId = YOUTUBE_LIVE_ID;
            wrapper.innerHTML = `<iframe src="https://www.youtube.com/embed/${YOUTUBE_LIVE_ID}?autoplay=1&mute=0&rel=0" title="Live" frameborder="0" allowfullscreen class="absolute top-0 left-0 w-full h-full"></iframe>`;
            container.classList.remove("hidden");

            let qaBtn = document.getElementById("qaLiveBtn");
            if (!qaBtn) {
                qaBtn = document.createElement("a");
                qaBtn.id = "qaLiveBtn";
                qaBtn.href = "https://forms.gle/JHutLtmzPTeBtmoR6"; 
                qaBtn.target = "_blank";
                qaBtn.className = "mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3.5 rounded-xl animate-pulse shadow-lg";
                qaBtn.innerHTML = `💬 Kirim Pertanyaan ke Ustadz`;
                container.appendChild(qaBtn);
            }
        }
    } else {
        if (currentWebLiveId !== "") {
            currentWebLiveId = "";
            wrapper.innerHTML = "";
            container.classList.add("hidden");
            const qaBtn = document.getElementById("qaLiveBtn");
            if (qaBtn) qaBtn.remove();
        }
    }
}
setInterval(cekLiveDariSheet, 120000);

// ==========================================
// FITUR POPUP (SELALU MUNCUL & PROGRESS BAR)
// ==========================================
function initPopup() {
    const popup = $("#popupPromo");
    const track = $("#popupTrack");
    if (!popup || !track) return;

    track.innerHTML = ""; 

    if (!POPUP_SLIDES_DATA || POPUP_SLIDES_DATA.length === 0) return;

    // Ambil tombol kosong/tersembunyi di sebelah tombol "Share Info"
    const actionContainer = track.nextElementSibling;
    const dynamicBtn = actionContainer ? actionContainer.querySelector("a") : null;

    // Fungsi untuk mengubah teks dan link tombol hijau di bawah gambar
    const updateDynamicButton = (index) => {
        if (!dynamicBtn) return;
        const data = POPUP_SLIDES_DATA[index];
        dynamicBtn.href = data.link;
        // Menghapus class 'hidden' dan memaksanya tampil
        dynamicBtn.className = "flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all";
        dynamicBtn.innerHTML = `${data.text} <i data-lucide="external-link" class="w-4 h-4"></i>`;
        if (window.lucide) window.lucide.createIcons();
    };

    let currentIndex = 0;
    const slides = [];

    POPUP_SLIDES_DATA.forEach((data, index) => {
        const slide = document.createElement("a");
        slide.href = data.link;
        slide.target = "_blank";
        slide.className = "absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out";
        slide.style.opacity = index === 0 ? "1" : "0";
        slide.style.pointerEvents = index === 0 ? "auto" : "none";
        
        // HAPUS teks mengambang, sekarang murni hanya gambar!
       slide.innerHTML = `<img src="${data.src}" class="w-full h-full object-contain" alt="${data.text}">`;
        track.appendChild(slide);
        slides.push(slide);
    });

    // Set tombol hijau pertama kali
    updateDynamicButton(0);

    if (slides.length > 1) {
        const createBtn = (icon, posClass) => {
            const btn = document.createElement("button");
            btn.className = `absolute top-1/2 -translate-y-1/2 ${posClass} bg-black/30 hover:bg-black/60 text-white p-2 rounded-full z-20 transition-all border border-white/20`;
            btn.innerHTML = `<i data-lucide="${icon}" class="w-5 h-5"></i>`;
            return btn;
        };

        const btnPrev = createBtn("chevron-left", "left-2");
        const btnNext = createBtn("chevron-right", "right-2");

        const move = (dir) => {
            slides[currentIndex].style.opacity = "0";
            slides[currentIndex].style.pointerEvents = "none";
            currentIndex = (currentIndex + dir + slides.length) % slides.length;
            slides[currentIndex].style.opacity = "1";
            slides[currentIndex].style.pointerEvents = "auto";
            
            // Ubah teks dan link tombol hijau setiap kali gambar bergeser
            updateDynamicButton(currentIndex);
        };

        btnPrev.onclick = (e) => { e.preventDefault(); e.stopPropagation(); move(-1); };
        btnNext.onclick = (e) => { e.preventDefault(); e.stopPropagation(); move(1); };
        
        track.appendChild(btnPrev);
        track.appendChild(btnNext);
        
        let autoSlide = setInterval(() => move(1), 5000);
        track.onmouseenter = () => clearInterval(autoSlide);
        track.onmouseleave = () => { autoSlide = setInterval(() => move(1), 5000); };
    }

    const close = () => { popup.classList.add("hidden"); popup.classList.remove("flex"); };
    $("#closePopupBtn")?.addEventListener("click", close);
    $("#closePopupBackdrop")?.addEventListener("click", close);
    
    popup.classList.remove("hidden");
    popup.classList.add("flex");
    if(window.lucide) window.lucide.createIcons();
}

function initVideoAjakan() { 
    const container = $("#videoAjakanContainer"); if (!container || !VIDEO_DONASI_LIST.length) return; 
    container.innerHTML = ""; 
    if (VIDEO_DONASI_LIST.length === 1) { container.className = "max-w-4xl mx-auto reveal"; container.innerHTML = `<div class="relative w-full pt-[56.25%] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50 group"><iframe src="https://www.youtube.com/embed/${VIDEO_DONASI_LIST[0]}?rel=0" title="Video Ajakan Wakaf" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="absolute top-0 left-0 w-full h-full"></iframe></div>`; } 
    else { container.className = "max-w-full mx-auto reveal flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar px-4"; VIDEO_DONASI_LIST.forEach(id => { const item = document.createElement("div"); item.className = "snap-center shrink-0 w-[85%] sm:w-[60%] md:w-[45%] relative pt-[48%] sm:pt-[33%] md:pt-[25%] rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-black"; item.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?rel=0" title="Video Ajakan" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="absolute top-0 left-0 w-full h-full"></iframe>`; container.appendChild(item); }); } 
}

function initVideoKajian() { 
    const grid = $("#videoGrid"); if (!grid || !YOUTUBE_VIDEOS.length) return; 
    grid.innerHTML = ""; 
    YOUTUBE_VIDEOS.forEach(id => { const card = document.createElement("div"); card.className = "rounded-2xl overflow-hidden shadow-lg border border-slate-100 bg-white group hover:-translate-y-1 transition-transform duration-300"; card.innerHTML = `<div class="relative w-full pt-[56.25%] bg-black"><iframe src="https://www.youtube.com/embed/${id}" title="Video Kajian" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="absolute top-0 left-0 w-full h-full"></iframe></div>`; grid.appendChild(card); }); 
}

function initDoa() { 
    const elArab = $("#doaArab"), elArti = $("#doaArti"), btn = $("#btnGantiDoa"); 
    if (!elArab) return; 
    const acakDoa = () => { const r = DAFTAR_DOA[Math.floor(Math.random() * DAFTAR_DOA.length)]; elArab.textContent = r.ar; elArti.textContent = r.id; }; 
    acakDoa(); btn?.addEventListener("click", acakDoa); 
}

async function initSmartCarousel() {
  // Fungsi ini dinonaktifkan karena galeri sekarang menggunakan Elfsight Social Feed
  return;
}
// ----------------------------------------------------
// JADWAL SHOLAT (API) + IQOMAH (SPREADSHEET)
// ----------------------------------------------------
async function renderSholat() { 
    const g = $("#sholatGrid"); const l = $("#locLabel"); 
    if (!g) return; 
    g.innerHTML = `<div class="w-full text-center py-4"><i data-lucide="loader-2" class="w-6 h-6 animate-spin mx-auto text-slate-400"></i></div>`;
    
    try {
        if (l) l.textContent = `Hekinan, Japan (${HEK_LAT}, ${HEK_LON})`;
        const d = await fetch(`https://api.aladhan.com/v1/timings?latitude=${HEK_LAT}&longitude=${HEK_LON}&method=3&school=0&tune=0,2,0,1,1,0,2,1`).then(r => r.json()); 
        if (d.data && d.data.date && d.data.date.hijri) renderHijri(d.data.date.hijri); 
        
        let iqomahData = [];
        try { iqomahData = await loadCsv(DEFAULT_IQOMAH_CSV); } catch(e) { console.error(e); }

        const now = new Date();
        const dayOfWeek = now.getDay(); 

        const getIqomah = (namaSholat) => {
            if (iqomahData.length === 0) return "-";
            let key = namaSholat;
            if (namaSholat === "Isya") key = (dayOfWeek === 0 || dayOfWeek === 6) ? "Isya_Weekend" : "Isya_Weekday";
            if (namaSholat === "Dzuhur" && dayOfWeek === 5) key = "Jumat";
            const row = iqomahData.find(x => x.sholat && x.sholat.toLowerCase() === key.toLowerCase());
            return row ? row.jam : "-";
        };

        const m = { Fajr: ["Subuh", "sunrise"], Sunrise: ["Syuruq", "sun"], Dhuhr: ["Dzuhur", "sun"], Asr: ["Ashar", "cloud-sun"], Maghrib: ["Maghrib", "moon"], Isha: ["Isya", "star"] }; 
        g.innerHTML = ""; 
        
        Object.keys(m).forEach(k => { 
            const namaSholat = m[k][0];
            const timeStr = d.data.timings[k];
            const [hours] = timeStr.split(':').map(Number);
            const isCurrentHour = now.getHours() === hours;
            let iqomahTime = getIqomah(namaSholat);
            let displayNamaSholat = (namaSholat === "Dzuhur" && dayOfWeek === 5) ? "Jum'at" : namaSholat;

            let cardClass = isCurrentHour ? "bg-emerald-50 border-emerald-400 shadow-md ring-1 ring-emerald-200" : "bg-white border-slate-100 shadow-sm hover:border-emerald-200 hover:shadow-md"; 
            let iconClass = isCurrentHour ? "text-emerald-600 animate-pulse" : "text-slate-400";
            let labelClass = isCurrentHour ? "text-emerald-700" : "text-slate-500";
            let textClass = isCurrentHour ? "text-emerald-900" : "text-slate-800";

           let iqomahHtml = namaSholat === "Syuruq" 
                ? `<div class="mt-auto pt-4 text-[10px] text-transparent select-none py-1.5">-</div>` 
                : `<div class="mt-auto pt-4 w-full">
                     <div class="flex items-center justify-between text-[11px] font-bold py-1.5 px-3 rounded-lg border border-emerald-200 bg-white text-emerald-600 shadow-sm">
                       <span>Jamaah:</span> <span class="text-sm font-extrabold">${iqomahTime}</span>
                     </div>
                   </div>`;

            g.innerHTML += `
              <div class="snap-center shrink-0 w-[140px] md:w-[150px] lg:flex-1 rounded-2xl border p-4 text-center transition-all duration-300 flex flex-col h-full ${cardClass}">
                <div>
                  <i data-lucide="${m[k][1]}" class="w-6 h-6 mx-auto mb-3 ${iconClass}"></i>
                  <div class="text-[10px] uppercase font-bold tracking-widest ${labelClass}">${displayNamaSholat}</div>
                  <div class="mt-1 text-3xl font-extrabold tracking-tight ${textClass}">${timeStr}</div>
                </div>
                ${iqomahHtml}
              </div>`;
        }); 
        if(window.lucide) window.lucide.createIcons();

        const grid = document.getElementById("sholatGrid");
        document.getElementById("btnScrollLeft")?.addEventListener("click", () => grid.scrollBy({ left: -160, behavior: "smooth" }));
        document.getElementById("btnScrollRight")?.addEventListener("click", () => grid.scrollBy({ left: 160, behavior: "smooth" }));

    } catch { 
        g.innerHTML = `<p class="w-full text-center text-red-400 text-xs">Gagal memuat jadwal.</p>`; 
    } 
}

// ==========================================
// FITUR MICRO-GIVING (DONASI)
// ==========================================
function initDonasi() {
  const inputEl = $("#inputNominal");
  const currencyEl = $("#currencyToggle");
  const hintEl = $("#inputNominalHint");
  const quickWrapper = $("#quickButtonsWrapper");
  const btnWA = $("#donasiBtn");
  const checkDedikasi = $("#checkDedikasi");

  $$("[data-copy]").forEach(b => b.addEventListener("click", () => {
    navigator.clipboard.writeText($(b.dataset.copy).innerText);
    const t = TRANSLATIONS[currentLang] || TRANSLATIONS["id"];
    const originalText = b.innerHTML; const originalClass = b.className;
    b.className = "text-xs font-bold text-emerald-600 flex items-center gap-1 transition-all duration-300";
    b.innerHTML = `<i data-lucide="check-circle" class="w-3 h-3"></i> ${t.btn_copied}`;
    if(window.lucide) window.lucide.createIcons();
    setTimeout(() => { b.className = originalClass; b.innerHTML = originalText; if(window.lucide) window.lucide.createIcons(); }, 2000);
  }));

  if (!inputEl || !currencyEl) return;

const updateUI = () => {
    const currency = currencyEl.value;
    const val = inputEl.value;
    
    if (currency === "JPY") {
      quickWrapper.innerHTML = `
        <button class="q-btn flex flex-1 flex-col items-center justify-center bg-slate-800/40 hover:bg-emerald-600/30 border border-slate-600 hover:border-emerald-500 px-3 py-2 rounded-xl transition-all" data-v="3000">
            <span class="text-[10px] text-emerald-300 uppercase tracking-widest font-bold mb-1">Pahala Harian</span>
            <span class="text-base font-black text-white">¥3.000</span>
            <span class="text-[9px] text-slate-400 mt-1">Setara ¥100 / hari</span>
        </button>
        <button class="q-btn flex flex-1 flex-col items-center justify-center bg-slate-800/40 hover:bg-sky-600/30 border border-slate-600 hover:border-sky-500 px-3 py-2 rounded-xl transition-all" data-v="4000">
            <span class="text-[10px] text-sky-300 uppercase tracking-widest font-bold mb-1">Berkah Jumat</span>
            <span class="text-base font-black text-white">¥4.000</span>
            <span class="text-[9px] text-slate-400 mt-1">Setara ¥1.000 / Jumat</span>
        </button>`;
    } else {
      quickWrapper.innerHTML = `
        <button class="q-btn flex flex-1 flex-col items-center justify-center bg-slate-800/40 hover:bg-emerald-600/30 border border-slate-600 hover:border-emerald-500 px-3 py-2 rounded-xl transition-all" data-v="50000">
            <span class="text-[10px] text-emerald-300 uppercase tracking-widest font-bold mb-1">Sedekah Subuh</span>
            <span class="text-base font-black text-white">Rp 50.000</span>
        </button>
        <button class="q-btn flex flex-1 flex-col items-center justify-center bg-slate-800/40 hover:bg-sky-600/30 border border-slate-600 hover:border-sky-500 px-3 py-2 rounded-xl transition-all" data-v="100000">
            <span class="text-[10px] text-sky-300 uppercase tracking-widest font-bold mb-1">Pahala Jariyah</span>
            <span class="text-base font-black text-white">Rp 100.000</span>
        </button>`;
    }

    $$(".q-btn").forEach(b => b.addEventListener("click", (e) => {
      e.preventDefault(); inputEl.value = b.dataset.v; updateUI();
    }));
    if (val) {
      const prefix = currency === 'JPY' ? '¥' : 'Rp';
      hintEl.textContent = `${prefix} ${new Intl.NumberFormat('id-ID').format(val)}`;
    } else { hintEl.textContent = ""; }
  };

  currencyEl.addEventListener("change", () => { inputEl.value = ""; updateUI(); });
  inputEl.addEventListener("input", () => { inputEl.value = inputEl.value.replace(/\D/g, ''); updateUI(); });
  updateUI();

  btnWA?.addEventListener("click", () => {
    const nominal = inputEl.value;
    const currency = currencyEl.value;
    const kategori = $("#kategoriDonasi")?.value || "Pembebasan Lahan (Wakaf)";
    const namaDedikasi = $("#inputNamaDedikasi")?.value;
    const t = TRANSLATIONS[currentLang] || TRANSLATIONS["id"];

    if (!nominal || nominal <= 0) { alert(t.alert_nominal); return; }

    const originalText = btnWA.innerHTML;
    btnWA.innerHTML = `<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> ${t.btn_loading}`;
    btnWA.classList.add("opacity-75", "cursor-wait");

    let msg = t.wa_opening;
    msg += `\n\n📌 *Tujuan:* ${kategori}`;
    msg += `\n💰 *Nominal:* ${new Intl.NumberFormat('id-ID').format(nominal)} ${currency}`;
    if (checkDedikasi?.checked && namaDedikasi) { msg += `\n${t.wa_dedication} *${namaDedikasi}*`; }
    msg += `\n\n${t.wa_closing}`;

    setTimeout(() => {
      window.open(`https://wa.me/818013909425?text=${encodeURIComponent(msg)}`, "_blank");
      btnWA.innerHTML = originalText;
      btnWA.classList.remove("opacity-75", "cursor-wait");
    }, 1000);
  });
}

function initCountdown() {
  const elDays = $("#cdDays"), elHours = $("#cdHours"), elMin = $("#cdMin");
  if (!elDays || !elHours || !elMin) return;

  const end = new Date("2026-05-31T23:59:59").getTime();
  setInterval(() => {
    const gap = end - new Date().getTime(); if(gap<0)return;
    elDays.innerText = Math.floor(gap/86400000); 
    elHours.innerText = Math.floor((gap%86400000)/3600000); 
    elMin.innerText = Math.floor((gap%3600000)/60000);
  }, 1000);
}

// --- PENGAMANAN FITUR KAMUS DAKWAH AGAR TIDAK CRASH ---
function initKamusApp() {
    const grid = document.getElementById("containerKamusGrid");
    const search = document.getElementById("inputCariKamus");
    const empty = document.getElementById("stateKamusKosong");

    if(!grid || !search) return;

    const dataKamus = [
        { title: "Izin Sholat Sebentar", indo: "Maaf, sudah waktunya sholat. Bolehkah saya istirahat 10 menit?", jp: "すみません、お祈りの時間ですので、10分ほど休憩をいただいてもよろしいでしょうか？", romaji: "Sumimasen, oinori no jikan desunode, juppun hodo kyuukei o itadaitemo yoroshii deshouka?" },
        { title: "Tidak Makan Babi", indo: "Saya Muslim, jadi saya tidak bisa makan daging babi.", jp: "私はイスラム教徒ですので、豚肉を食べることができません。", romaji: "Watashi wa isuramu kyouto desunode, butaniku o taberu koto ga dekimasen." },
        { title: "Tidak Minum Alkohol", indo: "Maaf, agama saya melarang minum alkohol (Sake).", jp: "申し訳ありませんが、宗教上の理由でお酒を飲むことができません。", romaji: "Moushiwake arimasen ga, shuukyoujou no riyuu de osake o nomu koto ga dekimasen." },
        { title: "Sedang Puasa", indo: "Saya sedang puasa (tidak makan & minum sampai matahari terbenam).", jp: "私は今、断食をしています（日没まで水も食事もとりません）。", romaji: "Watashi wa ima, danjiki o shiteimasu (nichibotsu made mizu mo shokuji mo torimasen)." },
        { title: "Izin Sholat Jumat", indo: "Setiap Jumat siang, saya harus pergi ke Masjid untuk ibadah wajib.", jp: "毎週金曜日の昼は、モスクへ礼拝に行かなければなりません。", romaji: "Maishuu kinyoubi no hiru wa, mosuku e reihai ni ikanakereba narimasen." },
        { title: "Salam Islami", indo: "Assalamu'alaikum (Semoga kedamaian menyertai Anda).", jp: "アッサラーム・アライクム (あなたに平安がありますように)", romaji: "Assalamu'alaikum (Anata ni heian ga arimasu youni)" },
        { title: "Makanan Halal?", indo: "Apakah makanan ini Halal? (Tidak mengandung babi/alkohol)", jp: "これはハラルですか？（豚肉やアルコールが入っていませんか？）", romaji: "Kore wa Hararu desuka? (Butaniku ya arukooru ga haitte imasenka?)" }
    ];

    const render = (items) => {
        grid.innerHTML = "";
        if(items.length === 0) { 
            if(empty) { empty.classList.remove("hidden"); empty.classList.add("flex"); }
        } else {
            if(empty) { empty.classList.add("hidden"); empty.classList.remove("flex"); }
            items.forEach(item => {
                const el = document.createElement("div");
                el.className = "bg-white p-5 rounded-xl border border-slate-200 hover:border-pink-300 hover:shadow-md transition-all group relative";
                el.innerHTML = `
                    <div class="flex justify-between items-start mb-2">
                        <h4 class="font-bold text-slate-800 text-sm uppercase text-pink-600">${item.title}</h4>
                        <button class="btn-copy text-slate-400 hover:text-pink-600 p-1" title="Salin"><i data-lucide="copy" class="w-4 h-4"></i></button>
                    </div>
                    <p class="text-xs text-slate-400 italic mb-3">"${item.indo}"</p>
                    <div class="bg-slate-50 p-3 rounded-lg border border-slate-100 group-hover:bg-pink-50/30 transition-colors">
                        <p class="text-base font-bold text-slate-800 mb-1 font-sans select-all">${item.jp}</p>
                        <p class="text-[10px] text-slate-500 font-mono select-all">${item.romaji}</p>
                    </div>`;
                el.querySelector(".btn-copy").addEventListener("click", () => { navigator.clipboard.writeText(item.jp); });
                grid.appendChild(el);
            });
            if(window.lucide) window.lucide.createIcons();
        }
    };
    render(dataKamus);
    search.addEventListener("input", (e) => {
        const q = e.target.value.toLowerCase();
        render(dataKamus.filter(i => i.title.toLowerCase().includes(q) || i.indo.toLowerCase().includes(q)));
    });
}

// --- POPUP JADWAL JAMAAH ---
window.bukaPopupJamaah = async () => {
    const modal = $("#modalJamaah"); const container = $("#isiJadwalJamaah");
    if (!modal || !container) return;
    modal.classList.remove("hidden"); modal.classList.add("flex");
    if(window.lucide) window.lucide.createIcons();

    try {
        const d = await loadCsv(DEFAULT_IQOMAH_CSV);
        if (d.length === 0) { container.innerHTML = `<p class="text-center text-xs text-red-500">Data jadwal belum tersedia di Spreadsheet.</p>`; return; }
        container.innerHTML = "";
        d.forEach(item => {
            if(!item.sholat || !item.jam) return;
            let nama = item.sholat.replace(/_/g, ' ').toUpperCase();
            container.innerHTML += `
            <div class="flex justify-between items-center bg-slate-50 border border-slate-100 p-3 rounded-xl hover:bg-emerald-50 hover:border-emerald-100 transition-colors">
                <span class="text-xs font-bold text-slate-600">${nama}</span>
                <span class="text-sm font-extrabold text-emerald-700 bg-white border border-emerald-200 px-3 py-1 rounded-lg shadow-sm">${item.jam}</span>
            </div>`;
        });
    } catch (e) { container.innerHTML = `<p class="text-center text-xs text-red-500">Gagal mengambil data.</p>`; }
};
window.tutupPopupJamaah = () => { const m = $("#modalJamaah"); if(m){ m.classList.add("hidden"); m.classList.remove("flex"); } };

// --- PROGRESS WAKAF ---
function initProgressWakaf() {
    const kekurangan = TARGET_DONASI - TERKUMPUL_SAAT_INI;
    let persentase = (TERKUMPUL_SAAT_INI / TARGET_DONASI) * 100;
    if (persentase > 100) persentase = 100; 

    const formatAngka = (a) => new Intl.NumberFormat('id-ID').format(a);
    const updateTeks = (id, teks) => { const el = document.getElementById(id); if (el) el.textContent = teks; };
    const updateLebar = (id, persen) => { const el = document.getElementById(id); if (el) el.style.width = `${persen}%`; };

    updateTeks('targetOrang', formatAngka(Math.ceil(kekurangan / 1000)));
    updateTeks('terkumpulOrang', formatAngka(Math.ceil(kekurangan / 1000)));
    updateLebar('progressOrang', persentase);
    updateLebar('progressBar', persentase);
    updateTeks('terkumpulLabel', `¥${formatAngka(TERKUMPUL_SAAT_INI)}`);
    updateTeks('kekuranganLabel', `¥${formatAngka(kekurangan)}`);
updateTeks('targetLabel', `¥${formatAngka(TARGET_DONASI)}`);
    updateTeks('percentLabel', persentase.toFixed(1));
}

// ---> TAMBAHKAN BLOK INI <---
// ==========================================
// FITUR JADWAL PETUGAS JUM'AT
// ==========================================
async function initJadwalJumat() {
    const container = document.getElementById("jadwalJumatContainer");
    if (!container) return;

    try {
        const data = await loadCsv(DEFAULT_JUMAT_CSV);
        if (data && data.length > 0) {
            const jumat = data[0]; 
            document.getElementById("jjTanggal").innerText = jumat.tanggal || "-";
            document.getElementById("jjKhatib").innerText = jumat.khatib || "-";
            document.getElementById("jjImam").innerText = jumat.imam || "-";
            container.classList.remove("hidden");
        }
    } catch (e) {
        console.error("Gagal memuat jadwal jumat:", e);
    }
}
// ---> BATAS PENAMBAHAN <---

// ==========================================
// 4. BOOTSTRAP (SISTEM ANTI CRASH DITERAPKAN)
// ==========================================

async function boot(mode = 'web') {
  const hariIni = new Date().getDay(); 
  const bannerJumat = $("#jumatBanner");
  if (hariIni === 5 && bannerJumat) { bannerJumat.classList.remove("hidden"); }

  setLang(currentLang);
  $("#langToggle")?.addEventListener("click", () => setLang(currentLang === "id" ? "en" : "id"));
  $("#langToggleMob")?.addEventListener("click", () => setLang(currentLang === "id" ? "en" : "id"));
  
  if ($("#year")) $("#year").textContent = new Date().getFullYear();

  // EKSEKUSI AMAN (JIKA SATU ERROR, YANG LAIN TETAP JALAN!)
  try { renderSholat(); } catch(e) { console.error("Error di renderSholat:", e); }
  try { renderContent(); } catch(e) { console.error("Error di renderContent:", e); }
  try { initCountdown(); } catch(e) { console.error("Error di initCountdown:", e); }
    try { initJadwalJumat(); } catch(e) { console.error("Error di initJadwalJumat:", e); }
  try { initDonasi(); } catch(e) { console.error("Error di initDonasi:", e); }
  try { initProgressWakaf(); } catch(e) { console.error("Error di initProgressWakaf:", e); }
  try { initSmartCarousel(); } catch(e) { console.error("Error di initSmartCarousel:", e); }
  try { initVideoKajian(); } catch(e) { console.error("Error di initVideoKajian:", e); }
  try { initVideoAjakan(); } catch(e) { console.error("Error di initVideoAjakan:", e); }
  try { initDoa(); } catch(e) { console.error("Error di initDoa:", e); }
  try { initTabs(); } catch(e) { console.error("Error di initTabs:", e); }
  try { initKamusApp(); } catch(e) { console.error("Error di initKamusApp:", e); }

 // --- SISTEM LIVE OTOMATIS & POP-UP DARI SPREADSHEET ---
  try {
      // 1. Tampilkan Pop-Up SECARA INSTAN saat web pertama dibuka
      initPopup();              
      
      // 2. Baru kemudian jalan di latar belakang untuk mengecek Google Sheet
      await cekLiveDariSheet(); 
      initLiveStream();         
      
      // 3. Update isi Pop-up jika ada data baru dari Sheet yang masuk
      initPopup();              
  } catch(e) { console.error("Error di Live/Popup:", e); }
  if (mode === 'app-mode' || window.location.pathname.includes('app.html')) {
      if(typeof renderAppSholat === 'function') {
          try { renderAppSholat(); } catch(e) { console.error(e); }
      }
  }

  try { initHeroSlider(); } catch(e) { console.error(e); }
  try { setupAdmin(); } catch(e) { console.error(e); }

  const btnTop = document.getElementById("backToTop");
  if (btnTop) {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 500) btnTop.classList.remove("translate-y-20", "opacity-0", "pointer-events-none");
        else btnTop.classList.add("translate-y-20", "opacity-0", "pointer-events-none");
      });
  }

  const obs = new IntersectionObserver(e => e.forEach(x => { if (x.isIntersecting) x.target.classList.add("active") }), { threshold: 0.1 });
  $$(".reveal").forEach(e => obs.observe(e));
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => boot()); else boot();

// ==========================================
// FUNGSI PEMBANTU KHUSUS APP.HTML
// ==========================================
async function renderAppSholat() {
    const container = $("#prayerListApp");
    if(!container) return;
    
    const d = await fetch(`https://api.aladhan.com/v1/timings?latitude=${HEK_LAT}&longitude=${HEK_LON}&method=3`).then(r => r.json());
    const timings = d.data.timings;
    const names = { Fajr:['Subuh','الفجر'], Sunrise:['Syuruq','الشروق'], Dhuhr:['Dzuhur','الظهر'], Asr:['Ashar','العصر'], Maghrib:['Maghrib','المغرب'], Isha:['Isya','العشاء'] };
    
    if (d.data && d.data.date && d.data.date.hijri) {
        const hijri = d.data.date.hijri;
        if($("#hijriDateApp")) $("#hijriDateApp").textContent = `${hijri.day} ${hijri.month.en} ${hijri.year} H`;
    }

    container.innerHTML = "";
    let nextPrayerKey = null;

    Object.keys(names).forEach(key => {
        const isNext = checkIsNextApp(timings[key]) && !nextPrayerKey; 
        if(isNext) nextPrayerKey = key;

        const row = document.createElement('div');
        row.className = `p-6 flex justify-between items-center transition-all ${isNext ? 'prayer-active shadow-lg' : 'hover:bg-white/5 dark:hover:bg-white/5'}`;
        row.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="h-10 w-10 rounded-2xl ${isNext ? 'bg-white/20' : 'bg-slate-200 dark:bg-white/5'} flex items-center justify-center">
                    <i data-lucide="${getAppIcon(key)}" class="w-5 h-5 ${isNext ? 'text-white' : 'text-slate-500'}"></i>
                </div>
                <div>
                    <h4 class="font-bold ${isNext ? 'text-white' : 'text-slate-800 dark:text-slate-200'}">${names[key][0]}</h4>
                    <p class="text-[10px] ${isNext ? 'text-emerald-100' : 'text-slate-500'} font-arab" dir="rtl">${names[key][1]}</p>
                </div>
            </div>
            <div class="text-right">
                <span class="text-xl font-extrabold ${isNext ? 'text-white' : 'text-slate-800 dark:text-slate-200'} tracking-tight">${timings[key]}</span>
                ${isNext ? '<div class="text-[9px] font-black bg-white/20 px-2 py-0.5 rounded mt-1 uppercase text-white">Next</div>' : ''}
            </div>`;
        container.appendChild(row);
    });
    
    if(window.lucide) window.lucide.createIcons();
    
    if(nextPrayerKey) {
        if($("#nextName")) $("#nextName").textContent = names[nextPrayerKey][0];
        if($("#nextArab")) $("#nextArab").textContent = names[nextPrayerKey][1];
        if($("#nextTime")) $("#nextTime").textContent = timings[nextPrayerKey];
        setInterval(() => updateCountdownApp(timings[nextPrayerKey]), 1000);
    }
}

function getAppIcon(k) {
    const m = { Fajr: 'moon', Sunrise: 'sunrise', Dhuhr: 'sun', Asr: 'cloud-sun', Maghrib: 'moon-star', Isha: 'stars' };
    return m[k] || 'clock';
}

function checkIsNextApp(timeStr) {
    const now = new Date();
    const [h, m] = timeStr.split(':').map(Number);
    const prayTime = new Date(); 
    prayTime.setHours(h, m, 0, 0);
    return prayTime > now;
}

function updateCountdownApp(targetTimeStr) {
    const el = $("#countdown");
    if(!el) return;
    const now = new Date();
    const [h, m] = targetTimeStr.split(':').map(Number);
    const target = new Date(); target.setHours(h, m, 0, 0);
    const diff = target - now;
   if (diff < 0) { 
        el.textContent = "Waktu Sholat!"; 
        // Tambahkan baris di bawah ini agar merender ulang otomatis setelah 2 detik
        setTimeout(() => renderAppSholat(), 2000);
        return; 
    }
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    let text = "";
    if(hours > 0) text += `${hours}j `;
    text += `${mins}m ${secs}d`;
    el.textContent = `- ${text}`;
}

// --- EID FESTIVE & TAKBIR ---
window.openTakbirModal = () => {
  if (typeof confetti === 'function') {
    const end = Date.now() + 2000; const colors = ['#059669', '#f59e0b', '#ffffff']; 
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors: colors, disableForReducedMotion: true });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors: colors, disableForReducedMotion: true });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  }
  const modal = document.getElementById("modalKamus"), grid = document.getElementById("containerKamusGrid"), searchInput = document.getElementById("inputCariKamus"), emptyState = document.getElementById("stateKamusKosong");
  if (!modal || !grid) return;
  if(searchInput?.parentElement) searchInput.parentElement.classList.add("hidden"); 
  if(emptyState){ emptyState.classList.add("hidden"); emptyState.classList.remove("flex"); }

  grid.innerHTML = `
    <div class="col-span-full bg-amber-50 border border-amber-200 p-6 md:p-10 rounded-2xl shadow-sm relative overflow-hidden animate-[fadeUp_0.4s_ease-out]">
        <div class="absolute -right-4 -top-4 opacity-10"><i data-lucide="mic" class="w-32 h-32 text-amber-900"></i></div>
        <h4 class="font-bold text-amber-800 text-lg md:text-xl uppercase mb-6 relative z-10 flex items-center gap-2">
            <i data-lucide="volume-2" class="w-6 h-6"></i> Lafadz Takbir Idul Fitri
        </h4>
        <div class="text-right text-3xl md:text-4xl mt-4 space-y-6 font-arab leading-loose text-slate-800 relative z-10" dir="rtl">
            <p>اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ</p>
            <p>لَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ</p>
            <p>اللَّهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ</p>
        </div>
    </div>`;
  if(window.lucide) window.lucide.createIcons();
  modal.classList.remove("hidden"); modal.classList.add("flex");
};

const originalToggle = window.toggleKamusModal;
window.toggleKamusModal = (show) => {
    if(!show) {
        const searchInput = document.getElementById("inputCariKamus");
        if(searchInput?.parentElement) { searchInput.parentElement.classList.remove("hidden"); searchInput.value = ""; }
        if(typeof initKamusApp === 'function') initKamusApp();
    }
    if(typeof originalToggle === 'function') originalToggle(show);
    else { const m = document.getElementById("modalKamus"); if(show){ m.classList.remove("hidden"); m.classList.add("flex"); } else { m.classList.add("hidden"); m.classList.remove("flex"); } }
};

// --- KOTAK SARAN ---
window.toggleSaranModal = (show) => {
    const modal = document.getElementById("modalSaran");
    if (!modal) return;
    if (show) { modal.classList.remove("hidden"); modal.classList.add("flex"); document.getElementById("pesanSaran").value = ""; document.getElementById("namaSaran").value = ""; } 
    else { modal.classList.add("hidden"); modal.classList.remove("flex"); }
    if (window.lucide) window.lucide.createIcons();
};

window.kirimSaran = () => {
    const kategori = document.getElementById("kategoriSaran")?.value || "Saran";
    const pesan = document.getElementById("pesanSaran")?.value.trim();
    let nama = document.getElementById("namaSaran")?.value.trim();
    const btn = document.getElementById("kirimSaranBtn");

    if (!pesan) { alert("Mohon isi pesan Anda terlebih dahulu."); return; }
    if (!nama) nama = "Hamba Allah (Anonim)";

    const originalText = btn.innerHTML;
    btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Memproses...`;
    btn.classList.add("opacity-75", "cursor-wait");
    if (window.lucide) window.lucide.createIcons();

    let msg = `Assalamu'alaikum, saya ingin menyampaikan pesan melalui Website Masjid Hekinan:\n\n📌 *Kategori:* ${kategori}\n👤 *Dari:* ${nama}\n\n💬 *Pesan:*\n"${pesan}"`;

    setTimeout(() => {
        window.open(`https://wa.me/818013909425?text=${encodeURIComponent(msg)}`, "_blank");
        btn.innerHTML = originalText;
        btn.classList.remove("opacity-75", "cursor-wait");
        toggleSaranModal(false);
    }, 1000);
};
// ==========================================
// FITUR MODAL DONASI DAUROH (GOLDEN WEEK)
// ==========================================
window.bukaDonasiDauroh = () => {
    // Tutup popup promo utama jika sedang terbuka
    const popupPromo = $("#popupPromo");
    if(popupPromo) { popupPromo.classList.add("hidden"); popupPromo.classList.remove("flex"); }
    
    // Buka modal donasi dauroh
    const modal = $("#modalDonasiDauroh");
    if(modal) { modal.classList.remove("hidden"); modal.classList.add("flex"); }
};

window.tutupDonasiDauroh = () => {
    const modal = $("#modalDonasiDauroh");
    if(modal) { modal.classList.add("hidden"); modal.classList.remove("flex"); }
};

window.konfirmasiDaurohWA = (jenis) => {
    let msg = "";
    
    if (jenis === 'uang') {
        msg = "Assalamu'alaikum Akhi Ihsan, saya ingin konfirmasi telah melakukan *Transfer Donasi* untuk Dauroh Golden Week. Mohon dicek. Jazakumullah khairan.";
    } else if (jenis === 'barang') {
        msg = "Assalamu'alaikum Akhi Ihsan, insyaAllah saya ingin berpartisipasi menyumbang *Logistik/Konsumsi* untuk Dauroh Golden Week berupa:\n\n1. [Sebutkan barangnya]\n\nInsyaAllah akan saya bawa saat hari H. Jazakumullah khairan.";
    } else {
        msg = "Assalamu'alaikum Akhi Ihsan, saya ingin bertanya seputar Donasi Dauroh Golden Week.";
    }
    
    window.open(`https://wa.me/819061432121?text=${encodeURIComponent(msg)}`, "_blank");
};


