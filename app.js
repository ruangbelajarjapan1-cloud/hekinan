// app.js (Final Fix: Translate Lengkap + Anti Error)

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// ==========================================
// 1. DATA & KONFIGURASI GLOBAL
// ==========================================
window.globalContentData = []; 

const TARGET_DONASI = 42000000;
const TERKUMPUL_SAAT_INI = 9519843;

// Update gambar popup
const POPUP_IMAGES_LIST = ["assets/foto/1e.png", "assets/foto/001.jpg", "assets/foto/poster3.jpeg"]; 
const VIDEO_DONASI_LIST = ["jfPRdk", "dQcQ"];
const YOUTUBE_VIDEOS = ["OvQjcl65BR8", "zEu4jVpgB_8", "oQjqwQb6atA"];
const LOCAL_IMAGES = ["1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg", "6.jpeg", "7.jpeg"];

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzLMb1wIdcq4YZWw7wbFJGlI2su_Yyti1DoUHPzRBMDZyMmsB98cQKfpV9z9DH9RwuGmA/exec";
const DEFAULT_KAJIAN_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=0&single=true&output=csv";
const DEFAULT_PENGUMUMAN_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=991747005&single=true&output=csv";
const DEFAULT_ARTIKEL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=1625529193&single=true&output=csv";

const HIJRI_MONTHS_ID = ["Muharram", "Shafar", "Rabiul Awal", "Rabiul Akhir", "Jumadil Awal", "Jumadil Akhir", "Rajab", "Sya'ban", "Ramadhan", "Syawal", "Dzulqa'dah", "Dzulhijjah"];

const HADITHS = [
  { ar: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ", id: "Sesungguhnya setiap amalan tergantung pada niatnya.", en: "Actions are but by intentions." },
  { ar: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ", id: "Sebaik-baik kalian adalah yang belajar Al-Qur'an dan mengajarkannya.", en: "The best of you learn Quran and teach it." }
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
    hadith_label: "Mutiara Hadits", sholat_title: "Jadwal Sholat", gallery_title: "Galeri Foto", gallery_desc: "Dokumentasi kegiatan dan kebersamaan jamaah.",
    tab_announcement: "Pengumuman", tab_article: "Artikel & Faedah", empty_data: "Belum ada data terbaru.", empty_search: "Tidak ditemukan.",
    donasi_badge: "Peluang Amal Jariyah", donasi_title: "Investasi Kekal Akhirat", deadline_label: "Batas Waktu Wakaf (Tahap 1)",
    progress_title: "Progres Pembangunan", collected: "Terkumpul", needed: "Kekurangan",
    confirm_title: "Konfirmasi Donasi", confirm_desc: "Masukkan nominal yang telah ditransfer.", or: "ATAU", btn_confirm: "Konfirmasi via WA",
    footer_links: "Tautan", footer_follow: "Lokasi", btn_zakat: "Hitung Zakat", btn_donate_now: "Donasi Sekarang", btn_popup_wakaf: "Ikut Wakaf Sekarang",
    video_appeal_title: "Mengapa Kita Perlu Membangun Masjid?", video_appeal_desc: "Simak pesan berikut ini.", view_all: "Lihat Semua", view_channel: "Lihat Channel YouTube", contact_title: "Hubungi Kami",
    read_more: "Selengkapnya",
    reminder_label: "Belum bisa transfer sekarang?", reminder_btn: "Buat Komitmen Rutin", reminder_date_label: "Mulai Tanggal:", reminder_freq_label: "Frekuensi:",
    freq_once: "Sekali Saja", freq_monthly: "Rutin Tiap Bulan", btn_save_reminder: "Pasang Pengingat", reminder_note: "*Akan membuka Google Calendar Anda.",
    reminder_title: "✨ Komitmen Wakaf Masjid Hekinan", reminder_desc: "Pengingat sedekah rutin. Rekening: Yucho 12160-00457031 / BSI 7329283768. Semoga berkah!",
    search_title: "Mencari:", search_people: "Orang Baik Lagi!", search_desc_1: "Jika 1 orang berwakaf", search_desc_2: "maka pelunasan masjid ini akan segera terwujud. Jadilah salah satu dari mereka!",
    joined_label: "Orang Lagi Dibutuhkan", btn_join_movement: "Gabung Gerakan Ini", target_complete: "Menuju Lunas",
    dedication_check: "Niatkan pahala untuk", dedication_target: "Orang Tua / yang sudah meninggal rahimahumullahu ?", dedication_label: "Nama Orang Tua / yang sudah meninggal rahimahumullahu ", dedication_placeholder: "Contoh: Bpk. Fulan bin Fulan",
    alert_nominal: "Mohon masukkan nominal donasi.", btn_loading: "Membuka WhatsApp...", btn_copied: "Tersalin",
    wa_opening: "Assalamu'alaikum, saya ingin konfirmasi donasi pembangunan Masjid As-Sunnah Hekinan.", wa_dedication: "🎁 Pahala diniatkan atas nama:", wa_closing: "Mohon dicek. Jazakumullah khairan.",
    
    // === KAMUS RAMADHAN (INDONESIA LENGKAP) ===
    nav_ramadhan: "Ramadhan",
    rmd_page_back: "Kembali",
    rmd_page_deadline: "Deadline: 31 Mei 2026",
    rmd_hero_title: "Wakaf M² Surga",
    rmd_hero_desc: "Siapa yang membebaskan lahan untuk masjid di dunia, Allah bangunkan istana baginya di surga.",
    rmd_progress_label: "Perjalanan Ramadhan",
    rmd_progress_wait: "Menunggu Ramadhan...",
    rmd_card_title: "Paket M² Surga",
    rmd_card_subtitle: "Investasi pembebasan lahan Masjid As-Sunnah Hekinan.",
    rmd_benefit_1: "Pahala jariyah yang terus mengalir abadi",
    rmd_benefit_2: "Ikut melunasi bangunan sebelum Mei 2026",
    rmd_benefit_3: "Didoakan oleh ribuan jamaah & malaikat",
    rmd_btn_open: "Ambil Bagian Wakaf",
    rmd_click_note: "Klik tombol di atas untuk memilih nominal.",
    
    // Popup Text
    rmd_modal_title: "Komitmen Wakaf",
    rmd_modal_subtitle: "Pilih nominal sedekah",
    rmd_opt_custom: "Nominal Lainnya",
    rmd_label_name: "Nama Anda",
    rmd_ph_name: "Hamba Allah...",
    rmd_btn_send: "Konfirmasi via WA",
    
    // Popup Switch & Dedikasi (YANG SEBELUMNYA HILANG)
    rmd_mode_daily: "Harian (30 Hari)",
    rmd_mode_weekly: "Pekanan (4 Jumat)",
    rmd_dedication_ask: "Niatkan pahala untuk Orang Tua?",
    rmd_dedication_note: "Wakaf atas nama Ayah/Ibu (yang masih hidup/wafat).",
    rmd_dedication_name_label: "Nama Orang Tua (Bin/Binti)"
  },
  en: {
    nav_sholat: "Prayer Times", nav_kegiatan: "Gallery", nav_info: "Info", nav_donasi: "Donate",
    hero_title_1: "Weaving Brotherhood,", hero_title_2: "Building Civilization.",
    hero_desc: "Center for worship, children's education, and gathering for the Indonesian Muslim community around Hekinan, Aichi Prefecture, Japan.",
    hero_btn_wakaf: "Donate Now", hero_btn_sholat: "Prayer Times", hero_btn_kiblat: "Qibla Finder",
    hadith_label: "Daily Hadith", sholat_title: "Prayer Times", gallery_title: "Photo Gallery", gallery_desc: "Documentation of community activities.",
    tab_announcement: "Announcements", tab_article: "Articles", empty_data: "No updates.", empty_search: "Not found.",
    donasi_badge: "Charity Opportunity", donasi_title: "Invest for Hereafter", deadline_label: "Donation Deadline",
    progress_title: "Construction Progress", collected: "Collected", needed: "Remaining",
    confirm_title: "Confirm Donation", confirm_desc: "Enter transferred amount.", or: "OR", btn_confirm: "Confirm via WA",
    footer_links: "Links", footer_follow: "Location", btn_zakat: "Zakat Calculator", btn_donate_now: "Donate Now", btn_popup_wakaf: "Donate Now",
    video_appeal_title: "Why Do We Need to Build a Mosque?", video_appeal_desc: "Watch the following message.", view_all: "View All", view_channel: "Visit YouTube Channel", contact_title: "Contact Us",
    read_more: "Read More",
    reminder_label: "Can't transfer right now?", reminder_btn: "Make a Commitment", reminder_date_label: "Start Date:", reminder_freq_label: "Frequency:",
    freq_once: "One Time", freq_monthly: "Monthly (Recurring)", btn_save_reminder: "Set Reminder", reminder_note: "*Opens Google Calendar.",
    reminder_title: "✨ Donation Commitment Hekinan Mosque", reminder_desc: "Routine charity reminder. Bank: Yucho 12160-00457031 / BSI 7329283768. Jazakumullah Khairan!",
    search_title: "Mission to Find:", search_people: "Good People More!", search_desc_1: "If 1 person donates", search_desc_2: "then this mosque will be fully paid off soon. Be one of them!",
    joined_label: "People Still Needed", btn_join_movement: "Join This Movement", target_complete: "Towards Completion",
    dedication_check: "Intend reward for", dedication_target: "Parents / Deceased?", dedication_label: "Name of Parents / Deceased", dedication_placeholder: "Ex: Mr. Fulan bin Fulan",
    alert_nominal: "Please enter donation amount.", btn_loading: "Opening WhatsApp...", btn_copied: "Copied",
    wa_opening: "Assalamu'alaikum, I would like to confirm my donation for As-Sunnah Hekinan Mosque construction.", wa_dedication: "🎁 Reward intended for:", wa_closing: "Please check. Jazakumullah Khairan.",

    // === KAMUS RAMADHAN (ENGLISH FULL) ===
    nav_ramadhan: "Ramadan",
    rmd_page_back: "Back",
    rmd_page_deadline: "Deadline: May 31, 2026",
    rmd_hero_title: "Waqf M² Paradise",
    rmd_hero_desc: "Whoever clears land for a mosque in this world, Allah builds a palace for them in Paradise.",
    rmd_progress_label: "Ramadan Journey",
    rmd_progress_wait: "Waiting for Ramadan...",
    rmd_card_title: "M² Paradise Package",
    rmd_card_subtitle: "Investment for land acquisition of As-Sunnah Hekinan Mosque.",
    rmd_benefit_1: "Eternal continuous charity rewards (Jariyah)",
    rmd_benefit_2: "Help repay the building before May 2026",
    rmd_benefit_3: "Prayed for by thousands of congregants & angels",
    rmd_btn_open: "Take Part in Waqf",
    rmd_click_note: "Click the button above to choose your daily waqf amount.",
    
    // Popup Text
    rmd_modal_title: "Waqf Commitment",
    rmd_modal_subtitle: "Choose daily charity amount",
    rmd_opt_custom: "Other Amount",
    rmd_label_name: "Your Name",
    rmd_ph_name: "Servant of Allah...",
    rmd_btn_send: "Confirm via WA",

    // Popup Switch & Dedication (ADDED)
    rmd_mode_daily: "Daily (30 Days)",
    rmd_mode_weekly: "Weekly (4 Fridays)",
    rmd_dedication_ask: "Intend reward for Parents?",
    rmd_dedication_note: "Waqf on behalf of Parents (living or deceased).",
    rmd_dedication_name_label: "Parent's Name"
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
  currentLang = lang; localStorage.setItem("lang", lang);
  const t = TRANSLATIONS[lang];
  $$("[data-i18n]").forEach(el => { const k = el.getAttribute("data-i18n"); if (t[k]) el.textContent = t[k]; });
  $$("[data-placeholder]").forEach(el => { const k = el.getAttribute("data-placeholder"); if (t[k]) el.placeholder = t[k]; });
  renderHadith(); renderHijri();
  
  // TRIGGER EVENT KHUSUS (Agar halaman Ramadhan tahu bahasa berubah)
  document.dispatchEvent(new Event('langChanged'));
}

async function loadCsv(url) {
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
    const h = r[0].map(x => x.trim().toLowerCase());
    return r.slice(1).map(v => { const o = {}; h.forEach((k, x) => o[k] = v[x]?.trim() || ""); return o; });
  } catch { return []; }
}

// ... (Fungsi Artikel, Admin, Zakat, Hero Slider tetap sama - disingkat agar muat) ...
window.openArticleModal = (index) => {
  const data = window.globalContentData[index]; const modal = $("#articleModal"); if (!modal || !data) return;
  $("#modalTitle").textContent = data.title; $("#modalDate").innerHTML = data.date; $("#modalTag").textContent = data.tag;
  $("#modalContent").innerHTML = (data.content || data.desc).replace(/\n/g, "<br>");
  const extBtn = $("#modalExternalLink"); if(data.link) { extBtn.href = data.link; extBtn.classList.remove("hidden"); } else { extBtn.classList.add("hidden"); }
  modal.classList.remove("hidden"); modal.classList.add("flex");
};
document.addEventListener("DOMContentLoaded", () => {
  const m = $("#articleModal"); if(m) { $("#closeArticleBtn").onclick = () => m.classList.add("hidden"); $("#closeArticleBackdrop").onclick = () => m.classList.add("hidden"); }
});
async function renderContent() { /* ... kode lama ... */ }
function setupAdmin() { /* ... kode lama ... */ }
function initZakatCalculator() { /* ... kode lama ... */ }
function initHeroSlider() { /* ... kode lama ... */ }

function initPopup() {
  const popup = $("#popupPromo");
  if (!popup) return;
  // Hapus kode yang memaksa popup muncul, serahkan ke CSS atau logika index.html
  // popup.classList.remove("hidden"); 
  const close = () => { popup.classList.add("hidden"); popup.style.display = 'none'; };
  $("#closePopupBtn")?.addEventListener("click", close);
  $("#closePopupBackdrop")?.addEventListener("click", close);
}

// ... (Video, Carousel, Doa, Sholat, Donasi tetap sama) ...
function initVideoAjakan() { /* ... */ }
function initVideoKajian() { /* ... */ }
function initDoa() { /* ... */ }
async function initSmartCarousel() { /* ... */ }
async function renderSholat() { /* ... */ }
function initDonasi() { /* ... */ }

// -----------------------------------------------------------
// UPDATE: PERBAIKAN FATAL ERROR CONSOLE (TIMER)
// -----------------------------------------------------------
function initCountdown() {
  const elDays = $("#cdDays");
  const elHours = $("#cdHours");
  const elMin = $("#cdMin");

  // CEK EKSISTENSI ELEMEN DULU! (Fix Error "Cannot set properties of null")
  if (!elDays || !elHours || !elMin) return;

  const end = new Date("2026-05-31T23:59:59").getTime();
  setInterval(() => {
    const gap = end - new Date().getTime(); if(gap<0)return;
    elDays.innerText = Math.floor(gap/86400000); 
    elHours.innerText = Math.floor((gap%86400000)/3600000); 
    elMin.innerText = Math.floor((gap%3600000)/60000);
  }, 1000);
}

// 4. BOOTSTRAP
function boot() {
  setLang(currentLang);
  $("#langToggle")?.addEventListener("click", () => setLang(currentLang === "id" ? "en" : "id"));
  
  if ($("#year")) $("#year").textContent = new Date().getFullYear();

  renderSholat();
  // renderContent(); // Dipanggil jika perlu
  initCountdown(); // Aman sekarang
  initDonasi();
  initPopup();
  window.lucide?.createIcons?.();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
