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
        src: "natsu1.jpeg",
        link: "#", 
        text: "Daftar Dauroh" 
    },
    { 
        src: "natsu.jpeg",
        link: "#", 
        text: "Daftar Dauroh" 
    },
    { 
        src: "assets/foto/arab.png", 
        link: "https://wa.me/628895941864", 
        text: "Hubungi Admin" 
    },
    { 
        src: "umroh.png", 
        link: "https://umrohjepang.vercel.app/", 
        text: "Umroh dari Jepang" 
    }
];

const VIDEO_DONASI_LIST = ["8B-0qWT-WWI","J-qjzvpC2lw","GemAgh-FA5Q","hI3InnD1bBY"];
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
    hero_btn_wakaf: "Info Infaq", hero_btn_sholat: "Jadwal Sholat", hero_btn_kiblat: "Arah Kiblat",
    hadith_label: "Mutiara Hadits", sholat_title: "Jadwal Sholat", gallery_title: "Kabar Terbaru", gallery_desc: "Ikuti terus pembaruan dan aktivitas terkini dari media sosial kami.",
    tab_announcement: "Pengumuman", tab_article: "Artikel & Faedah", empty_data: "Belum ada data terbaru.", empty_search: "Tidak ditemukan.",
    donasi_badge: "Peluang Amal Jariyah", donasi_title: "Investasi Kekal Akhirat", deadline_label: "Batas Waktu Wakaf (Tahap 1)",
   progress_title: "Status Amanah Wakaf", collected: "Estimasi Dana Wakaf", needed: "Tahap Berikutnya",
    confirm_title: "Konfirmasi Donasi", confirm_desc: "Masukkan nominal yang telah ditransfer.", or: "ATAU", btn_confirm: "Konfirmasi via WA",
    footer_links: "Tautan", footer_follow: "Lokasi", btn_zakat: "Hitung Zakat", btn_donate_now: "Donasi Sekarang", btn_popup_wakaf: "Ikut Wakaf Sekarang",
    video_appeal_title: "Mengapa Kita Perlu Membangun Masjid?", video_appeal_desc: "Simak pesan berikut ini.", view_all: "Lihat Semua", view_channel: "Lihat Channel YouTube", contact_title: "Hubungi Kami",
    read_more: "Selengkapnya",
    reminder_label: "Belum bisa transfer sekarang?", reminder_btn: "Buat Komitmen Rutin", reminder_date_label: "Mulai Tanggal:", reminder_freq_label: "Frekuensi:",
    freq_once: "Sekali Saja", freq_monthly: "Rutin Tiap Bulan", btn_save_reminder: "Pasang Pengingat", reminder_note: "*Akan membuka Google Calendar Anda.",
 search_title: "Status:", search_people: "Wakaf Lahan Sudah Lunas", search_desc_1: "Donasi baru dialihkan untuk", search_desc_2: "Infaq Operasional Masjid.",
   joined_label: "Amanah Tuntas", btn_join_movement: "Lihat Rekening Infaq", target_complete: "Lunas 100%",
    dedication_check: "Niatkan pahala untuk", dedication_target: "Orang Tua / yang sudah meninggal?", dedication_label: "Nama Orang Tua / yang sudah meninggal", dedication_placeholder: "Contoh: Bpk. Fulan bin Fulan",
    alert_nominal: "Mohon masukkan nominal donasi.", btn_loading: "Membuka WhatsApp...", btn_copied: "Tersalin",
  wa_opening: "Assalamu'alaikum, saya ingin konfirmasi donasi/Infaq Operasional Masjid As-Sunnah Hekinan.", wa_dedication: "🎁 Pahala diniatkan atas nama:", wa_closing: "Mohon dicek. Jazakumullah khairan.",
          ann_official: "📢 PEMBERITAHUAN RESMI",
    ann_title: "WAKAF DITUTUP",
ann_p1: "Alhamdulillah, dengan izin Allah Ta'ala, pembebasan lahan dan bangunan Masjid As-Sunnah Hekinan sudah lunas dan penerimaan wakaf resmi ditutup.",
    ann_p2: "Kami ucapkan Jazakumullahu khairan kepada seluruh muhsinin yang telah berpartisipasi. Semoga Allah jadikan sebagai amal jariyah yang terus mengalir pahalanya.",
    ann_p3: "Bagi jamaah yang masih ingin beramal, donasi tetap dibuka dan akan dialihkan sepenuhnya untuk Infaq Operasional Masjid. Jazākumullāhu khayran.",
  },
  en: {
    nav_sholat: "Prayer Times", nav_kegiatan: "Gallery", nav_info: "Info", nav_donasi: "Donate",
    hero_title_1: "Weaving Brotherhood,", hero_title_2: "Building Civilization.",
    hero_desc: "Center for worship, children's education, and gathering for the Indonesian Muslim community around Hekinan, Aichi Prefecture, Japan.",
   hero_btn_wakaf: "Operational Donation", hero_btn_sholat: "Prayer Times", hero_btn_kiblat: "Qibla Finder",
    hadith_label: "Daily Hadith", sholat_title: "Prayer Times", gallery_title: "As Sunnah Hekinan Update", gallery_desc: "Documentation of community activities.",
    tab_announcement: "Announcements", tab_article: "Articles", empty_data: "No updates.", empty_search: "Not found.",
    donasi_badge: "Charity Opportunity", donasi_title: "Invest for Hereafter", deadline_label: "Donation Deadline",
   progress_title: "Waqf Trust Status", collected: "Estimated Waqf Fund", needed: "Next Step",
    confirm_title: "Confirm Donation", confirm_desc: "Enter transferred amount.", or: "OR", btn_confirm: "Confirm via WA",
    footer_links: "Links", footer_follow: "Location", btn_zakat: "Zakat Calculator", btn_donate_now: "Donate Now", btn_popup_wakaf: "Donate Now",
    video_appeal_title: "Why Do We Need to Build a Mosque?", video_appeal_desc: "Watch the following message.", view_all: "View All", view_channel: "Visit YouTube Channel", contact_title: "Contact Us",
    read_more: "Read More",
    reminder_label: "Can't transfer right now?", reminder_btn: "Make a Commitment", reminder_date_label: "Start Date:", reminder_freq_label: "Frequency:",
    freq_once: "One Time", freq_monthly: "Monthly (Recurring)", btn_save_reminder: "Set Reminder", reminder_note: "*Opens Google Calendar.",
   search_title: "Status:", search_people: "Waqf Fully Paid", search_desc_1: "New donations will be allocated to", search_desc_2: "the Mosque Operational Fund.",
   joined_label: "Trust Process Completed", btn_join_movement: "View Donation Account", target_complete: "Fully Paid 100%",
    dedication_check: "Intend reward for", dedication_target: "Parents / Deceased?", dedication_label: "Name of Parents / Deceased", dedication_placeholder: "Ex: Mr. Fulan bin Fulan",
    alert_nominal: "Please enter donation amount.", btn_loading: "Opening WhatsApp...", btn_copied: "Copied",
    wa_opening: "Assalamu'alaikum, I would like to confirm my donation for the As-Sunnah Hekinan Mosque Operational Fund.", wa_dedication: "🎁 Reward intended for:", wa_closing: "Please check. Jazakumullah Khairan.",
 ann_official: "📢 OFFICIAL ANNOUNCEMENT",
    ann_title: "WAQF CLOSED",
ann_p1: "Alhamdulillah, by the permission of Allah Ta’ala, the land and building of Masjid As-Sunnah Hekinan is fully paid and the waqf fundraising is officially closed.",
    ann_p2: "Jazakumullahu khairan to all donors who have participated. May Allah make it a continuous charity (Sadaqah Jariyah) for you.",
    ann_p3: "For those who still wish to contribute, donations remain open and will be fully allocated to the Mosque Operational Fund. Jazaakumullaahu khayran.",
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
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error("HTTP " + response.status); // KAIZEN: deteksi gagal (400/404/dst)
    const t = await response.text();
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

    // KAIZEN: jangan simpan ke cache kalau datanya rusak/kosong semua,
    // supaya sekali gagal tidak "mengunci" tampilan kosong selama 1 menit.
    const isMostlyEmpty = finalData.length > 0 && finalData.every(item => !item.title);
    if (!isMostlyEmpty) {
        localStorage.setItem(cacheKey, JSON.stringify(finalData));
        localStorage.setItem(cacheTimeKey, now.toString());
    }
    return finalData;
  } catch { 
    if (cachedData) return JSON.parse(cachedData);
    return []; 
  }
}


// ==========================================
// KAIZEN BACKEND HELPER AS-SUNNAH
// Catatan: tidak memakai header Content-Type agar tidak memicu CORS preflight.
// ==========================================
const AS_BACKEND_TOKEN = "H3k1n4n_S3cur3_2026!";

async function asSunnahPost(action, payload = {}) {
  const response = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({
      app_token: AS_BACKEND_TOKEN,
      action,
      ...payload
    })
  });

  const result = await response.json();
  if (!result || result.status !== "success") {
    throw new Error(result?.message || "Request backend gagal.");
  }
  return result;
}


async function getIqomahMapFromBackend() {
  try {
    const result = await asSunnahPost("get_iqamah");
    return result?.data || {};
  } catch (error) {
    console.error("Gagal mengambil iqomah dari backend:", error);
    return {};
  }
}

function pickIqomah(map, ...keys) {
  for (const key of keys) {
    const value = map?.[key];
    if (value && value !== "--:--") return value;
  }
  return "-";
}

function setButtonLoading(btn, isLoading, text = "Memproses...") {
  if (!btn) return;

  if (isLoading) {
    btn.dataset.originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.classList.add("opacity-75", "cursor-wait");
    btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> ${text}`;
  } else {
    btn.disabled = false;
    btn.classList.remove("opacity-75", "cursor-wait");
    if (btn.dataset.originalHtml) btn.innerHTML = btn.dataset.originalHtml;
  }

  if (window.lucide) window.lucide.createIcons();
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
    // LOGIKA BARU: Jika link_daftar diisi "DAUROH", tombol akan membuka form internal
    if (x.link_daftar && x.link_daftar.trim().toUpperCase() === "DAUROH") {
        const waDonasiDauroh = "https://wa.me/628895941864?text=Assalamu%27alaikum%20Admin%20Jepang%20Mengaji%2C%20saya%20ingin%20berinfaq%2Fdonasi%20untuk%20kegiatan%20Dauroh.%20Mohon%20info%20rekening%20dan%20tata%20caranya.%20Jazakumullahu%20khayran.";
        actionButton = `
          <div class="grid grid-cols-2 gap-2 mt-3">
            <button onclick="window.bukaFormDauroh()" class="relative z-10 w-full text-center bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-1.5"><i data-lucide="edit" class="w-4 h-4"></i> Daftar</button>
            <a href="${waDonasiDauroh}" target="_blank" rel="noopener noreferrer" class="relative z-10 w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-1.5"><i data-lucide="hand-coins" class="w-4 h-4"></i> Donasi</a>
          </div>`;
    } else if (x.link_daftar && x.link_daftar.length > 5) {
        actionButton = `<a href="${x.link_daftar}" target="_blank" rel="noopener noreferrer" class="relative z-10 mt-3 w-full block text-center bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"><i data-lucide="external-link" class="w-4 h-4"></i> Daftar Sekarang</a>`;
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

  // KAIZEN: Galeri Foto - ambil semua item yang punya poster dari Pengumuman & Artikel
  const galeriGrid = document.getElementById("galeriFotoGrid");
  if (galeriGrid) {
      const fotoItems = window.globalContentData
          .map((item, idx) => ({ item, idx }))
          .filter(o => o.item.poster && o.item.poster.length > 5);

      if (fotoItems.length > 0) {
          galeriGrid.innerHTML = fotoItems.map(o => `
            <div onclick="window.openArticleModal(${o.idx})" class="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer group relative shadow-sm">
              <img src="${sanitizeHTML(o.item.poster)}" alt="${sanitizeHTML(o.item.title || 'Foto kegiatan')}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy">
              <div class="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors"></div>
            </div>
          `).join("");
          document.getElementById("galeriFotoEmpty")?.classList.add("hidden");
      } else {
          document.getElementById("galeriFotoEmpty")?.classList.remove("hidden");
      }
      if (window.lucide) window.lucide.createIcons();
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

// Menerima link YouTube dalam format apapun (link biasa, youtu.be,
// link live, link embed) ATAU id video polos, lalu mengembalikan ID-nya saja.
// Ini membuat kolom "live_id" di Sheet lebih tahan salah-paste oleh operator.
function extractYoutubeId(input) {
    if (!input) return "";
    const str = input.trim();
    const patterns = [
        /(?:youtube\.com\/(?:watch\?v=|live\/|embed\/|shorts\/))([a-zA-Z0-9_-]{6,})/,
        /youtu\.be\/([a-zA-Z0-9_-]{6,})/
    ];
    for (const p of patterns) {
        const m = str.match(p);
        if (m && m[1]) return m[1].split(/[?&]/)[0];
    }
    // Bukan URL yang dikenali, anggap sudah berupa ID video langsung
    return str;
}

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
        
        YOUTUBE_LIVE_ID = extractYoutubeId(foundId);
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
// FITUR POPUP (SLIDER MULTI-PROMO, AUTO-GESER)
// ==========================================
function initPopup() {
    const popup = $("#popupPromo");
    const track = $("#popupTrack");
    if (!popup || !track) return;

    track.innerHTML = "";
    if (!POPUP_SLIDES_DATA || POPUP_SLIDES_DATA.length === 0) return;

    const closePopup = () => {
        popup.classList.add("hidden");
        popup.classList.remove("flex");
        if (autoTimer) clearInterval(autoTimer);
    };

    let current = 0;
    let autoTimer = null;

    const handleSlideClick = (data) => (e) => {
        e.preventDefault();
        if (data.link && data.link.startsWith("http")) {
            window.open(data.link, "_blank", "noopener");
        } else if (data.link && data.link.startsWith("#") && data.link.length > 1 && document.querySelector(data.link)) {
            closePopup();
            document.querySelector(data.link).scrollIntoView({ behavior: "smooth" });
        } else {
            window.bukaFormDauroh();
        }
    };

    // Render semua slide, ditumpuk. Hanya slide aktif yang terlihat.
    POPUP_SLIDES_DATA.forEach((data, i) => {
        const slide = document.createElement("div");
        slide.className = `absolute inset-0 w-full h-full cursor-pointer transition-opacity duration-500 ${i === 0 ? "opacity-100" : "opacity-0 pointer-events-none"}`;
        slide.innerHTML = `<img src="${data.src}" class="w-full h-full object-contain" alt="${data.text || ''}">`;
        slide.onclick = handleSlideClick(data);
        track.appendChild(slide);
    });

    // Titik navigasi (cuma muncul kalau slide lebih dari 1)
    let dotsWrap = null;
    if (POPUP_SLIDES_DATA.length > 1) {
        dotsWrap = document.createElement("div");
        dotsWrap.className = "absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10";
        POPUP_SLIDES_DATA.forEach((_, i) => {
            const dot = document.createElement("button");
            dot.className = `h-2 rounded-full transition-all ${i === 0 ? "bg-white w-4" : "bg-white/50 w-2"}`;
            dot.onclick = (e) => { e.stopPropagation(); goTo(i); resetAutoTimer(); };
            dotsWrap.appendChild(dot);
        });
        track.appendChild(dotsWrap);
    }

    const slideEls = () => track.querySelectorAll(":scope > div.absolute.inset-0");
    const dotEls = () => dotsWrap ? dotsWrap.querySelectorAll("button") : [];

    // Tombol hijau "Daftar/Donasi/dst" di bawah gambar - ikut berubah sesuai slide aktif
    const actionContainer = popup.querySelector(".grid-cols-2");
    const dynamicBtn = actionContainer ? actionContainer.querySelector("button") : null;

    function updateActionButton(data) {
        if (!dynamicBtn) return;
        const isExternal = data.link && data.link.startsWith("http");
        const icon = isExternal ? "external-link" : "edit";
        dynamicBtn.innerHTML = `<i data-lucide="${icon}" class="w-4 h-4"></i> ${data.text || "Selengkapnya"}`;
        dynamicBtn.onclick = handleSlideClick(data);
        if (window.lucide) window.lucide.createIcons();
    }

    // KAIZEN: tombol "Share Info" - sekarang benar-benar berfungsi, ikut isi slide aktif
    const shareBtn = $("#popupShareBtn");
    function updateShareButton(data) {
        if (!shareBtn) return;
        shareBtn.onclick = async () => {
            const shareUrl = (data.link && data.link.startsWith("http")) ? data.link : "https://assunnahhekinan.org/";
            const shareTitle = data.text || "Masjid As-Sunnah Hekinan";
            const shareText = `${shareTitle} - Masjid As-Sunnah Hekinan`;
            if (navigator.share) {
                try {
                    await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
                } catch (e) { /* dibatalkan oleh pengguna, tidak apa-apa */ }
            } else {
                window.open("https://wa.me/?text=" + encodeURIComponent(shareText + " " + shareUrl), "_blank", "noopener");
            }
        };
    }

    function goTo(idx) {
        const slides = slideEls();
        slides[current]?.classList.add("opacity-0", "pointer-events-none");
        slides[current]?.classList.remove("opacity-100");
        current = idx;
        slides[current]?.classList.add("opacity-100");
        slides[current]?.classList.remove("opacity-0", "pointer-events-none");

        dotEls().forEach((d, i) => {
            d.className = `h-2 rounded-full transition-all ${i === current ? "bg-white w-4" : "bg-white/50 w-2"}`;
        });

        updateActionButton(POPUP_SLIDES_DATA[current]);
        updateShareButton(POPUP_SLIDES_DATA[current]);
    }

    function nextSlide() { goTo((current + 1) % POPUP_SLIDES_DATA.length); }

    function resetAutoTimer() {
        if (autoTimer) clearInterval(autoTimer);
        if (POPUP_SLIDES_DATA.length > 1) autoTimer = setInterval(nextSlide, 4000);
    }
    resetAutoTimer();
    updateActionButton(POPUP_SLIDES_DATA[0]);
    updateShareButton(POPUP_SLIDES_DATA[0]);

    const closeBtn = $("#closePopupBtn");
    const backdropBtn = $("#closePopupBackdrop");
    closeBtn?.addEventListener("click", closePopup);
    backdropBtn?.addEventListener("click", closePopup);

    popup.classList.remove("hidden");
    popup.classList.add("flex");
    if (window.lucide) window.lucide.createIcons();
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
        
        const iqomahMap = await getIqomahMapFromBackend();

        const now = new Date();
        const dayOfWeek = now.getDay(); 

        const getIqomah = (namaSholat) => {
            if (namaSholat === "Syuruq") return "-";
            if (namaSholat === "Dzuhur" && dayOfWeek === 5) return pickIqomah(iqomahMap, "Jumat", "Dzuhur");
            if (namaSholat === "Isya") {
                return (dayOfWeek === 0 || dayOfWeek === 6)
                    ? pickIqomah(iqomahMap, "Isya_Weekend", "Isya_Biasa", "Isya_Weekday", "Isya")
                    : pickIqomah(iqomahMap, "Isya_Weekday", "Isya_Biasa", "Isya_Weekend", "Isya");
            }
            return pickIqomah(iqomahMap, namaSholat);
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
        const d = await getIqomahMapFromBackend();
        const list = [
            ["Subuh", pickIqomah(d, "Subuh")],
            ["Dzuhur", pickIqomah(d, "Dzuhur")],
            ["Ashar", pickIqomah(d, "Ashar")],
            ["Maghrib", pickIqomah(d, "Maghrib")],
            ["Isya", pickIqomah(d, "Isya_Weekday", "Isya_Biasa", "Isya")],
            ["Jumat", pickIqomah(d, "Jumat")]
        ];

        if (Object.keys(d).length === 0) {
            container.innerHTML = `<p class="text-center text-xs text-red-500">Data jadwal belum tersedia di backend.</p>`;
            return;
        }

        container.innerHTML = list.map(([nama, jam]) => `
            <div class="flex justify-between items-center bg-slate-50 border border-slate-100 p-3 rounded-xl hover:bg-emerald-50 hover:border-emerald-100 transition-colors">
                <span class="text-xs font-bold text-slate-600">${nama.toUpperCase()}</span>
                <span class="text-sm font-extrabold text-emerald-700 bg-white border border-emerald-200 px-3 py-1 rounded-lg shadow-sm">${jam}</span>
            </div>`).join("");
    } catch (e) { container.innerHTML = `<p class="text-center text-xs text-red-500">Gagal mengambil data.</p>`; }
};
window.tutupPopupJamaah = () => { const m = $("#modalJamaah"); if(m){ m.classList.add("hidden"); m.classList.remove("flex"); } };

function initProgressWakaf() {
    const formatAngka = (a) => new Intl.NumberFormat('id-ID').format(a);
    const updateTeks = (id, teks) => { 
        const el = document.getElementById(id); 
        if (el) el.textContent = teks; 
    };
    const updateLebar = (id, persen) => { 
        const el = document.getElementById(id); 
        if (el) el.style.width = `${persen}%`; 
    };

    // Karena wakaf lahan ditutup sementara, jangan lagi tampilkan kekurangan.
    updateTeks('targetOrang', '✓');
    updateTeks('terkumpulOrang', 'Amanah');
    updateLebar('progressOrang', 100);
    updateLebar('progressBar', 100);

    updateTeks('terkumpulLabel', `¥${formatAngka(TERKUMPUL_SAAT_INI)}`);
   updateTeks('kekuranganLabel', 'Lunas 100%');
    updateTeks('targetLabel', 'Wakaf Resmi Ditutup');
    updateTeks('percentLabel', '100');
}

// ---> TAMBAHKAN BLOK INI <---
// ==========================================
// FITUR JADWAL PETUGAS JUM'AT
// ==========================================
async function initJadwalJumat() {
    const container = document.getElementById("jadwalJumatContainer");
    if (!container) return;

    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.innerText = value || "-";
    };

    const parseTanggalJumat = (value) => {
        if (!value) return null;

        const raw = String(value).trim();
        const parts = raw.replace(/\./g, "/").replace(/-/g, "/").split("/");

        if (parts.length !== 3) return null;

        let y, m, d;

        // Format Google Sheet Anda: 5/1/2026 atau 5/15/2026
        if (parts[2].length === 4) {
            m = Number(parts[0]) - 1;
            d = Number(parts[1]);
            y = Number(parts[2]);
        }
        // Cadangan kalau nanti formatnya 2026/5/1
        else if (parts[0].length === 4) {
            y = Number(parts[0]);
            m = Number(parts[1]) - 1;
            d = Number(parts[2]);
        } else {
            return null;
        }

        const date = new Date(y, m, d);
        date.setHours(0, 0, 0, 0);

        return isNaN(date.getTime()) ? null : date;
    };

    const formatTanggalID = (date) => {
        return new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(date);
    };

    try {
        const data = await loadCsv(DEFAULT_JUMAT_CSV);

        if (!data || data.length === 0) {
            setText("jjTanggal", "Belum ada jadwal");
            setText("jjKhatib", "-");
            setText("jjImam", "-");
            container.classList.remove("hidden");
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const kandidat = data
            .map(row => ({
                row,
                date: parseTanggalJumat(row.tanggal)
            }))
            .filter(item => item.date && item.date >= today)
            .sort((a, b) => a.date - b.date);

       const selected = kandidat.length > 0 ? kandidat[0] : null;

        if (!selected) {
            setText("jjTanggal", "Belum diperbarui");
            setText("jjKhatib", "-");
            setText("jjImam", "-");
            setText("jjWaktu", "-");
            container.classList.remove("hidden");
            return;
        }

        // KAIZEN: Ambil fallback waktu Jumat dari Backend Apps Script (Iqomah)
        let waktuJumat = "-";
        try {
            const iqomahMap = await getIqomahMapFromBackend();
            waktuJumat = pickIqomah(iqomahMap, "Jumat", "Dzuhur") || "-";
        } catch (error) {
            console.error("Gagal ambil waktu Jumat:", error);
        }

        setText("jjTanggal", formatTanggalID(selected.date));
        setText("jjKhatib", selected.row.khatib || "-");
        setText("jjImam", selected.row.imam || "-");
        // Prioritaskan kolom 'waktu'/'jam' di CSV. Jika kosong, pakai data dari Backend Iqomah
        setText("jjWaktu", selected.row.waktu || selected.row.jam || waktuJumat);

        container.classList.remove("hidden");

        if (window.lucide) window.lucide.createIcons();

    } catch (e) {
        console.error("Gagal memuat jadwal Jumat:", e);
        setText("jjTanggal", "Gagal memuat");
        setText("jjKhatib", "-");
        setText("jjImam", "-");
        container.classList.remove("hidden");
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

window.kirimSaran = async () => {
    const kategori = document.getElementById("kategoriSaran")?.value || "Saran";
    const pesanEl = document.getElementById("pesanSaran");
    const namaEl = document.getElementById("namaSaran");
    const btn = document.getElementById("kirimSaranBtn");

    const pesan = (pesanEl?.value || "").trim();
    const nama = (namaEl?.value || "").trim() || "Hamba Allah (Anonim)";

    if (!pesan) {
        alert("Mohon isi pesan Anda terlebih dahulu.");
        pesanEl?.focus();
        return;
    }

    try {
        setButtonLoading(btn, true, "Mengirim...");

        const result = await asSunnahPost("kirim_saran", {
            kategori,
            nama,
            pesan,
            halaman: location.pathname,
            user_agent: navigator.userAgent
        });

        alert(result.message || "Pesan berhasil dikirim. Jazakumullahu khairan.");
        if (pesanEl) pesanEl.value = "";
        if (namaEl) namaEl.value = "";

        if (typeof toggleSaranModal === "function") toggleSaranModal(false);
        const modal = document.getElementById("modalSaran");
        if (modal) {
          modal.classList.add("hidden");
          modal.classList.remove("flex");
        }

    } catch (error) {
        console.error("Gagal kirim ke backend, fallback WhatsApp:", error);

        const msg = `Assalamu'alaikum, saya ingin menyampaikan pesan melalui Website Masjid Hekinan:\n\n📌 *Kategori:* ${kategori}\n👤 *Dari:* ${nama}\n\n💬 *Pesan:*\n"${pesan}"`;
        alert("Gagal menyimpan ke database. WhatsApp akan dibuka sebagai cadangan.");
        window.open(`https://wa.me/818013909425?text=${encodeURIComponent(msg)}`, "_blank");

    } finally {
        setButtonLoading(btn, false);
    }
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
// ==========================================
// FORM PENDAFTARAN DAUROH INDEPENDEN
// ==========================================

window.bukaFormDauroh = () => {
    const modal = document.getElementById("modalFormDauroh");
    if (modal) {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
        if (window.lucide) window.lucide.createIcons();
    }
};

window.tutupFormDauroh = () => {
    const modal = document.getElementById("modalFormDauroh");
    if (modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    }
};

// Helper internal untuk mengambil nilai radio button
function dapatkanNilaiRadio(name) {
    const terpilh = document.querySelector(`input[name="${name}"]:checked`);
    return terpilh ? terpilh.value : "";
}

window.kirimFormDauroh = async () => {
    const btn = document.getElementById("btnSubmitDauroh");
    
    // 1. Ambil nilai dari setiap form
    const nama = document.getElementById("fd_nama")?.value.trim();
    const nowa = document.getElementById("fd_wa")?.value.trim();
    const jk = dapatkanNilaiRadio("fd_jk");
    const status_peserta = dapatkanNilaiRadio("fd_status");
    const pernah_ikut = dapatkanNilaiRadio("fd_pernah");
    const lama_hari = dapatkanNilaiRadio("fd_hari");
    const menginap = dapatkanNilaiRadio("fd_menginap");
    const bawa_keluarga = dapatkanNilaiRadio("fd_keluarga");
    const transportasi = dapatkanNilaiRadio("fd_trans");
    const pesan_buku = dapatkanNilaiRadio("fd_buku");
    const catatan = document.getElementById("fd_catatan")?.value.trim();

    // 2. Validasi Kolom Wajib (*)
    if (!nama || !nowa || !jk || !status_peserta || !pernah_ikut || !lama_hari || !menginap || !bawa_keluarga || !transportasi || !pesan_buku) {
        alert("Mohon maaf, semua pertanyaan wajib (*) harus diisi.");
        return;
    }

    const URL_APPS_SCRIPT_DAUROH = "https://script.google.com/macros/s/AKfycbxFv8buCpBDncRGcFj-CpBgKOAHildHqzq5DBbk0v7SK-bP2B-Ua7YMr4-H0mC74byMDg/exec";

   try {
        setButtonLoading(btn, true, "Mengirim Pendaftaran...");

        // Mengirim data murni menggunakan mode no-cors
        await fetch(URL_APPS_SCRIPT_DAUROH, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({
                nama: nama,
                nowa: nowa,
                jk: jk,
                status_peserta: status_peserta,
                pernah_ikut: pernah_ikut,
                lama_hari: lama_hari,
                menginap: menginap,
                bawa_keluarga: bawa_keluarga,
                transportasi: transportasi,
                pesan_buku: pesan_buku,
                catatan: catatan
            })
        });

        // Karena menggunakan no-cors, kita anggap sukses jika tidak ada error jaringan
        alert("Alhamdulillah! Pendaftaran Anda berhasil disimpan.");
        
        // Reset isian form setelah sukses
        document.getElementById("fd_nama").value = "";
        document.getElementById("fd_wa").value = "";
        document.getElementById("fd_catatan").value = "";
        
        // Uncheck semua radio button
        const radios = document.querySelectorAll('#modalFormDauroh input[type="radio"]');
        radios.forEach(radio => radio.checked = false);

        window.tutupFormDauroh();

   } catch (error) {
        console.error("Error Pendaftaran:", error);
        alert("Gagal mengirim data. Silakan periksa koneksi internet Anda.");
    } finally {
        setButtonLoading(btn, false, "Daftar Sekarang");
    }
};
