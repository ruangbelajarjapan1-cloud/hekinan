// app.js (VERSION: DYNAMIC LINKS FOR EACH SLIDE)

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// ==========================================
// 1. DATA & KONFIGURASI
// ==========================================
window.globalContentData = []; 

const TARGET_DONASI = 42000000;
const TERKUMPUL_SAAT_INI = 9686951;

// Koordinat Hekinan, Jepang
const HEK_LAT = 34.884;
const HEK_LON = 136.993;

// --- KONFIGURASI SLIDESHOW POPUP (GAMBAR & LINK) ---
// Slide 1 adalah Poster Ramadhan (sudah ada di HTML).
// Slide 2, 3, dst ditambahkan di sini:
const POPUP_SLIDES_DATA = [
    { 
        src: "assets/foto/d1.jpeg",  // <-- Ganti dengan nama file poster Dauroh Anda
        link: "https://forms.gle/zJqA2Eba2FaxvrXv6", // <-- MASUKKAN LINK GOOGLE FORM DISINI
        text: "Daftar Dauroh" // Tulisan di tombol
    },
    { 
        src: "assets/foto/p2.png", 
        link: "https://wa.me/818013909425", 
        text: "Hubungi Admin" 
    }
]; 

const VIDEO_DONASI_LIST = ["jfKfPRdk", "dQwgXcQ"];
const YOUTUBE_VIDEOS = ["OvQjcl65BR8", "zEu4jVpgB_8", "oQjqwQb6atA"];
const LOCAL_IMAGES = ["1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg", "6.jpeg", "7.jpeg"];

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzLMb1wIdcq4YZWw7wbFJGlI2su_Yyti1DoUHPzRBMDZyMmsB98cQKfpV9z9DH9RwuGmA/exec";
const DEFAULT_KAJIAN_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=0&single=true&output=csv";
const DEFAULT_PENGUMUMAN_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=991747005&single=true&output=csv";
const DEFAULT_ARTIKEL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=1625529193&single=true&output=csv";
const DEFAULT_KEGIATAN_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=1910296914&single=true&output=csv";

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
    nav_ramadhan: "Ramadhan",
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
    // --- KHUSUS RAMADHAN (ID) ---
    rmd_page_back: "Kembali", rmd_page_deadline: "Deadline: 31 Mei 2026", rmd_hero_title: "Wakaf M² Surga",
    rmd_hero_desc: "Barangsiapa membangun masjid karena Allah, maka Allah akan membangunkan baginya rumah di surga.",
    rmd_card_title: "Paket M² Surga", rmd_card_subtitle: "Investasi pembebasan lahan Masjid Hekinan.",
    rmd_benefit_1: "Pahala jariyah yang terus mengalir abadi", rmd_benefit_2: "Ikut melunasi bangunan sebelum Mei 2026", rmd_benefit_3: "Didoakan oleh ribuan jamaah & malaikat",
    rmd_btn_open: "Ambil Bagian Wakaf", rmd_btn_send: "Konfirmasi via WA", rmd_modal_title: "Komitmen Wakaf",
    rmd_modal_subtitle: "Pilih nominal sedekah rutin", rmd_mode_daily: "Harian (30 Hari)", rmd_mode_weekly: "Pekanan (4 Jumat)",
    rmd_opt_custom: "Nominal Lainnya", rmd_label_name: "Nama Anda", rmd_ph_name: "Hamba Allah...",
    rmd_dedication_ask: "Niatkan pahala untuk Orang Tua?", rmd_dedication_note: "Atas nama Ayah/Ibu (hidup/wafat).",
    rmd_dedication_placeholder: "Contoh: Alm. Bpk Fulan",rmd_social_joined: "Orang Baik telah bergabung.",
rmd_social_turn: "Giliran Anda sekarang!",rmd_section_title: "Mengapa Wakaf di Ramadhan?",
rmd_reason_1_title: "Pahala Berlipat Ganda",
rmd_reason_1_desc: "Sunnah jadi wajib, wajib jadi 70x lipat.",
rmd_reason_2_title: "Mengejar Deadline Mei",
rmd_reason_2_desc: "Menyelamatkan aset umat sebelum jatuh tempo.",
rmd_reason_3_title: "Hadiah Orang Tua",
rmd_reason_3_desc: "Wakaf atas nama orang tua yang sudah wafat.",
rmd_reason_4_title: "Naungan di Akhirat",
rmd_reason_4_desc: "Sedekah akan menjadi naungan di hari kiamat.",
rmd_social_joined: "Orang Baik telah bergabung.",
rmd_social_turn: "It's your turn now!",
  },
  en: {
    nav_sholat: "Prayer Times", nav_kegiatan: "Gallery", nav_info: "Info", nav_donasi: "Donate",
    nav_ramadhan: "Ramadan",
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
    // --- KHUSUS RAMADHAN (EN) ---
    rmd_page_back: "Back", rmd_page_deadline: "Deadline: May 31, 2026", rmd_hero_title: "Waqf M² for Jannah",
    rmd_hero_desc: "Whoever builds a mosque for Allah, Allah will build for him a house in Paradise.",
    rmd_card_title: "Waqf Package", rmd_card_subtitle: "Investment for Hekinan Mosque land.",
    rmd_benefit_1: "Everlasting rewards (Sadaqah Jariyah)", rmd_benefit_2: "Help pay off the land by May 2026", rmd_benefit_3: "Prayers from thousands of congregants",
    rmd_btn_open: "Take Part in Waqf", rmd_btn_send: "Confirm via WhatsApp", rmd_modal_title: "Waqf Commitment",
    rmd_modal_subtitle: "Choose your routine charity", rmd_mode_daily: "Daily (30 Days)", rmd_mode_weekly: "Weekly (4 Fridays)",
    rmd_opt_custom: "Other Amount", rmd_label_name: "Your Name", rmd_ph_name: "Anonymous...",
    rmd_dedication_ask: "Intend reward for parents?", rmd_dedication_note: "On behalf of Father/Mother.",
    rmd_dedication_placeholder: "Ex: Mr. John Doe",rmd_social_joined: "Good people have joined.",
rmd_social_turn: "It's your turn now!",rmd_section_title: "Why Waqf in Ramadan?",
rmd_reason_1_title: "Multiplied Rewards",
rmd_reason_1_desc: "Sunnah becomes mandatory, mandatory acts 70x rewards.",
rmd_reason_2_title: "Chasing May Deadline",
rmd_reason_2_desc: "Saving community assets before the deadline.",
rmd_reason_3_title: "Gift for Parents",
rmd_reason_3_desc: "Waqf on behalf of deceased parents.",
rmd_reason_4_title: "Shade in the Hereafter",
rmd_reason_4_desc: "Charity will be a shade on the Day of Judgment.",
rmd_social_joined: "Good people have joined.",
rmd_social_turn: "It's your turn now!",
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
    const k = el.getAttribute("data-placeholder"); 
    const key = el.getAttribute("data-placeholder");
    if (t[key]) el.placeholder = t[key]; 
  });

  const langBtn = $("#langToggle");
  const langBtnMob = $("#langToggleMob");
  if (langBtn) {
    langBtn.innerHTML = lang === "id" ? 'ID | <span class="opacity-50">EN</span>' : '<span class="opacity-50">ID</span> | EN';
  }
  if (langBtnMob) {
    langBtnMob.innerHTML = lang === "id" ? 'ID | <span class="opacity-50">EN</span>' : '<span class="opacity-50">ID</span> | EN';
  }

  renderHadith(); 
  renderHijri();
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

window.openArticleModal = (index) => {
  const data = window.globalContentData[index];
  const modal = document.getElementById("articleModal"); 
  
  if (!modal || !data) return;

  document.getElementById("modalTitle").textContent = data.title || "";
  document.getElementById("modalDate").innerHTML = `<i data-lucide="calendar" class="w-3 h-3"></i> ${data.date || "-"}`;
  document.getElementById("modalTag").textContent = data.tag || "Info";
  document.getElementById("modalContent").innerHTML = (data.content || data.desc || "").replace(/\n/g, "<br>");

  const modalFooter = modal.querySelector(".border-t"); 
  const oldBtn = document.getElementById("dynamicActionBtn");
  if(oldBtn) oldBtn.remove();

  if (data.link_daftar && data.link_daftar.length > 5) {
      const btn = document.createElement("a");
      btn.id = "dynamicActionBtn";
      btn.href = data.link_daftar;
      btn.target = "_blank";
      btn.className = "flex items-center gap-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded-lg transition-colors shadow-sm ml-auto mr-2";
      btn.innerHTML = `<i data-lucide="edit" class="w-3 h-3"></i> Daftar Kegiatan`;
      
      const closeBtn = document.getElementById("closeArticleBtnBottom");
      if(closeBtn && modalFooter) modalFooter.insertBefore(btn, closeBtn);
  } else if (data.link) {
      const extBtn = document.getElementById("modalExternalLink");
      if(extBtn) {
         extBtn.href = data.link;
         extBtn.classList.remove("hidden");
         extBtn.classList.add("flex");
      }
  } else {
      const extBtn = document.getElementById("modalExternalLink");
      if(extBtn) {
         extBtn.classList.add("hidden");
         extBtn.classList.remove("flex");
      }
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
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
  window.globalContentData = []; 

  const mkCard = (x, type, index) => {
    let tagColor = "bg-slate-100 text-slate-600 border-slate-200";
    let tagName = x.tag || (type === 'artikel' ? "Artikel" : "Info");
    
    const t = tagName.toLowerCase();
    if (t.includes('dauroh') || t.includes('kajian')) {
        tagColor = "bg-purple-50 text-purple-700 border-purple-100";
    } else if (t.includes('penting') || t.includes('mendesak')) {
        tagColor = "bg-red-50 text-red-700 border-red-100";
    } else if (t.includes('ramadhan')) {
        tagColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
    }

    let actionButton = "";
    if (x.link_daftar && x.link_daftar.length > 5) {
        actionButton = `
        <a href="${x.link_daftar}" target="_blank" class="relative z-10 mt-3 w-full block text-center bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 rounded-xl text-sm transition-all shadow-md shadow-sky-200 flex items-center justify-center gap-2">
           <i data-lucide="edit" class="w-4 h-4"></i> Daftar Sekarang
        </a>`;
    } else {
        actionButton = `
        <button onclick="window.openArticleModal(${index})" class="relative z-10 mt-3 w-full block text-center bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-2 rounded-xl text-sm transition-all border border-slate-200">
           Selengkapnya
        </button>`;
    }

    return `
      <article class="group relative flex flex-col h-full bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div class="flex items-center justify-between mb-3">
          <span class="${tagColor} border px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">${tagName}</span>
          <span class="text-[11px] text-slate-400 font-medium flex items-center gap-1"><i data-lucide="calendar" class="w-3 h-3"></i> ${x.date || "-"}</span>
        </div>
        <h3 class="text-lg font-bold text-slate-800 leading-snug mb-2 line-clamp-2 group-hover:text-sky-600 transition-colors">${x.title || "(Tanpa Judul)"}</h3>
        <p class="text-sm text-slate-500 mb-4 line-clamp-3 flex-grow leading-relaxed">${(type === 'artikel' ? x.excerpt : x.desc) || "Klik tombol di bawah untuk melihat detail informasi ini."}</p>
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
        const emptyMsg = document.getElementById("boardEmpty");
        if(emptyMsg) emptyMsg.classList.add("hidden");
    } else {
        pW.innerHTML = "";
        const emptyMsg = document.getElementById("boardEmpty");
        if(emptyMsg) emptyMsg.classList.remove("hidden");
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
      const emptyArt = document.getElementById("artikelEmpty");
      if(emptyArt) emptyArt.classList.toggle("hidden", filtered.length > 0);
      if(window.lucide && window.lucide.createIcons) window.lucide.createIcons();
    };
    filter("");
    const searchInput = document.getElementById("searchArtikel");
    if(searchInput) { searchInput.addEventListener("input", e => filter(e.target.value.toLowerCase())); }
  }
  if(window.lucide && window.lucide.createIcons) window.lucide.createIcons();
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

// --- ZAKAT CALCULATOR ---
function initZakatCalculator() {
  const openBtn = $("#openZakat"); const modal = $("#zakatModal"); const closeBtn = $("#closeZakat"); const calcBtn = $("#calcBtn");
  if (!openBtn || !modal) return; 

  let currentZakatCurr = 'JPY';
  const btnJPY = $("#currJPY"), btnIDR = $("#currIDR"), priceInput = $("#zGoldPrice"), labelCurr = $("#zCurrLabel");
  const linkJPY = $("#linkGoldJPY"), linkIDR = $("#linkGoldIDR");
  const DEFAULT_JPY = 14000, DEFAULT_IDR = 1400000;
  
  if(priceInput) priceInput.value = DEFAULT_JPY; 

  const setCurrency = (c) => {
    currentZakatCurr = c; 
    if(labelCurr) labelCurr.textContent = c;
    const active = "flex-1 py-2 text-sm font-bold rounded-lg bg-white shadow-sm text-slate-800 transition-all border border-slate-200 ring-2 ring-sky-100";
    const inactive = "flex-1 py-2 text-sm font-bold rounded-lg text-slate-500 hover:bg-white/50 transition-all";
    if (c === 'JPY') { 
        if(btnJPY) btnJPY.className = active; if(btnIDR) btnIDR.className = inactive; 
        if(priceInput) priceInput.value = DEFAULT_JPY; 
        if(linkJPY) linkJPY.classList.remove("hidden"); if(linkIDR) linkIDR.classList.add("hidden"); 
    } else { 
        if(btnIDR) btnIDR.className = active; if(btnJPY) btnJPY.className = inactive; 
        if(priceInput) priceInput.value = DEFAULT_IDR; 
        if(linkIDR) linkIDR.classList.remove("hidden"); if(linkJPY) linkJPY.classList.add("hidden"); 
    }
    $("#zResultBox")?.classList.add("hidden");
  };

  btnJPY?.addEventListener("click", () => setCurrency('JPY'));
  btnIDR?.addEventListener("click", () => setCurrency('IDR'));

  const toggle = (show) => { modal.classList.toggle("hidden", !show); modal.classList.toggle("flex", show); };
  openBtn.addEventListener("click", () => toggle(true));
  closeBtn?.addEventListener("click", () => toggle(false));
  modal.addEventListener("click", (e) => { if (e.target === modal) toggle(false); });

  calcBtn?.addEventListener("click", () => {
    const goldPrice = Number(priceInput?.value || 0);
    const cash = Number($("#zCash")?.value || 0);
    const goldVal = Number($("#zGoldVal")?.value || 0);
    const assets = Number($("#zAssets")?.value || 0);
    const debt = Number($("#zDebt")?.value || 0);
    const nisab = goldPrice * 85;
    const totalNet = (cash + goldVal + assets) - debt;
    const fmt = (n) => { const symbol = currentZakatCurr === 'JPY' ? '¥' : 'Rp'; return symbol + ' ' + new Intl.NumberFormat('id-ID').format(n); };
    
    $("#zTotalNet").textContent = fmt(totalNet);
    $("#zNisab").textContent = fmt(nisab);
    const resultBox = $("#zResultBox");
    const statusEl = $("#zStatus");
    const amountEl = $("#zFinalAmount");
    if(resultBox) resultBox.classList.remove("hidden");
    if (totalNet >= nisab) { 
        statusEl.textContent = "WAJIB ZAKAT"; statusEl.className = "font-extrabold text-lg text-emerald-600 mb-1"; 
        amountEl.textContent = fmt(totalNet * 0.025); 
    } else { 
        statusEl.textContent = "BELUM WAJIB"; statusEl.className = "font-extrabold text-lg text-slate-500 mb-1"; 
        amountEl.textContent = fmt(0); 
    }
  });
}

function initHeroSlider() {
  const slides = $$(".hero-slide"); if (slides.length < 2) return;
  let current = 0; setInterval(() => { slides[current].classList.remove("active"); current = (current + 1) % slides.length; slides[current].classList.add("active"); }, 5000);
}

// --- NEW SLIDESHOW POPUP LOGIC WITH DYNAMIC LINKS ---
function initPopup() {
  const popup = $("#popupPromo");
  const track = $("#popupTrack");
  const dotsContainer = $("#popDots");
  
  if (!popup || !track) return;

  // 1. Ambil Slide Ramadhan (HTML yang sudah ada di index.html)
  // Slide 0 ini dianggap sebagai "Base Slide"
  const slides = Array.from(track.children); 
  
  // 2. Tambahkan Slide Gambar Tambahan dari POPUP_SLIDES_DATA
  if (POPUP_SLIDES_DATA && POPUP_SLIDES_DATA.length > 0) {
      POPUP_SLIDES_DATA.forEach((data, idx) => {
          const div = document.createElement("div");
          // Gunakan kelas CSS yang sama persis agar transisinya halus
          div.className = "popup-slide transition-opacity duration-700 ease-in-out absolute inset-0 w-full h-full z-0 opacity-0";
          
          // Bungkus gambar dengan Link (agar gambar bisa diklik juga)
          const link = document.createElement("a");
          link.href = data.link || "#";
          link.target = "_blank";
          link.className = "block w-full h-full cursor-pointer";

          const img = document.createElement("img");
          img.src = data.src;
          img.className = "w-full h-full object-cover rounded-xl"; 
          img.alt = data.text || "Info Slide " + (idx + 1);
          
          link.appendChild(img);
          div.appendChild(link);
          track.appendChild(div);
      });
  }

  // Update daftar slides setelah penambahan gambar
  const allSlides = Array.from(track.children);
  
  // Jika total slide <= 1, tidak perlu slider
  if (allSlides.length <= 1) {
      popup.classList.remove("hidden");
      popup.classList.add("flex");
      return; 
  }

  // 3. Buat Dots Indikator
  dotsContainer.innerHTML = "";
  allSlides.forEach((_, idx) => {
      const dot = document.createElement("button");
      dot.className = `w-2 h-2 rounded-full transition-all ${idx === 0 ? 'bg-white w-6' : 'bg-white/50 hover:bg-white'}`;
      dot.onclick = () => showSlide(idx);
      dotsContainer.appendChild(dot);
  });

  let currentIdx = 0;
  let slideInterval;

  // 4. Logika Update Tampilan Slide & TOMBOL AKSI
  const showSlide = (n) => {
      allSlides.forEach((slide, i) => {
          const dot = dotsContainer.children[i];
          if (i === n) {
              slide.classList.remove("opacity-0", "z-0");
              slide.classList.add("opacity-100", "z-10");
              if(dot) dot.className = "w-6 h-2 rounded-full bg-white transition-all";
          } else {
              slide.classList.add("opacity-0", "z-0");
              slide.classList.remove("opacity-100", "z-10");
              if(dot) dot.className = "w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-all";
          }
      });
      currentIdx = n;

      // UPDATE LINK & TEXT TOMBOL DI BAWAH
      // Kita cari tombol di dalam popup (sebelah tombol Share)
      const shareBtn = $("#popupShareBtn");
      const actionBtn = shareBtn?.previousElementSibling; // Asumsi tombol aksi ada sebelum tombol share

      if (actionBtn) {
          if (n === 0) {
              // Jika Slide 0 (Ramadhan HTML)
              // Kita kembalikan ke default Ramadhan
              actionBtn.href = "ramadhan.html"; 
              actionBtn.innerHTML = `<i data-lucide="moon" class="w-4 h-4"></i> Info Ramadhan`;
          } else {
              // Jika Slide Gambar (Ambil data dari array)
              // Ingat: n=1 berarti data index ke-0
              const data = POPUP_SLIDES_DATA[n - 1];
              if (data) {
                  actionBtn.href = data.link;
                  actionBtn.innerHTML = `<i data-lucide="edit" class="w-4 h-4"></i> ${data.text || "Selengkapnya"}`;
              }
          }
          // Refresh icon agar muncul
          if(window.lucide && window.lucide.createIcons) window.lucide.createIcons();
      }
  };

  const nextSlide = () => showSlide((currentIdx + 1) % allSlides.length);
  const prevSlide = () => showSlide((currentIdx - 1 + allSlides.length) % allSlides.length);

  $("#popNext")?.addEventListener("click", () => { nextSlide(); resetTimer(); });
  $("#popPrev")?.addEventListener("click", () => { prevSlide(); resetTimer(); });

  const startTimer = () => { slideInterval = setInterval(nextSlide, 4000); };
  const stopTimer = () => clearInterval(slideInterval);
  const resetTimer = () => { stopTimer(); startTimer(); };

  // Tampilkan Popup
  popup.classList.remove("hidden");
  popup.classList.add("flex");
  startTimer();

  const close = () => { 
      popup.classList.add("hidden"); 
      popup.classList.remove("flex"); 
      stopTimer(); 
  };
  
  $("#closePopupBtn")?.addEventListener("click", close);
  $("#closePopupBackdrop")?.addEventListener("click", close);
  
  $("#popupShareBtn")?.addEventListener("click", () => {
      const text = "Info Terbaru Masjid As-Sunnah Hekinan. Cek di sini: https://assunnahhekinan.org";
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  });
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
  const track = $("#kgTrack"); if (!track) return;
  track.innerHTML = "";
  LOCAL_IMAGES.forEach(src => {
    const el = document.createElement("figure");
    el.className = "snap-item shrink-0 w-[85%] sm:w-[60%] md:w-[40%] lg:w-[30%] h-64 rounded-2xl overflow-hidden shadow-md bg-slate-100 relative group border border-slate-200 flex items-center justify-center";
    el.innerHTML = `<img src="${src}" class="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700" loading="lazy" alt="Kegiatan">`;
    track.appendChild(el);
  });
}

// ----------------------------------------------------
// UPDATE: JADWAL SHOLAT (FIXED LOCATION - ANTI HANG)
// ----------------------------------------------------
async function renderSholat() { 
    const g = $("#sholatGrid"); const l = $("#locLabel"); 
    if (!g) return; 
    
    // Default Loading
    g.innerHTML = `<div class="col-span-full text-center py-4"><i data-lucide="loader-2" class="w-6 h-6 animate-spin mx-auto text-slate-400"></i></div>`;
    
    try {
        // Langsung pakai Hekinan (Tanpa Geolocation yang lambat)
        if (l) l.textContent = `Hekinan, Japan (${HEK_LAT}, ${HEK_LON})`;
        
        const d = await fetch(`https://api.aladhan.com/v1/timings?latitude=${HEK_LAT}&longitude=${HEK_LON}&method=2`).then(r => r.json()); 
        
        if (d.data && d.data.date && d.data.date.hijri) renderHijri(d.data.date.hijri); 
        
        const m = { Fajr: ["Subuh", "sunrise"], Sunrise: ["Syuruq", "sun"], Dhuhr: ["Dzuhur", "sun"], Asr: ["Ashar", "cloud-sun"], Maghrib: ["Maghrib", "moon"], Isha: ["Isya", "star"] }; 
        g.innerHTML = ""; 
        Object.keys(m).forEach(k => { 
            g.innerHTML += `<div class="rounded-2xl border border-slate-100 p-4 text-center bg-slate-50 hover:bg-white hover:border-sky-200 transition-all shadow-sm"><i data-lucide="${m[k][1]}" class="w-5 h-5 mx-auto text-slate-400 mb-2"></i><div class="text-[10px] uppercase font-bold text-slate-400">${m[k][0]}</div><div class="mt-1 text-lg font-extrabold text-slate-800">${d.data.timings[k]}</div></div>`; 
        }); 
    } catch { 
        g.innerHTML = `<p class="col-span-full text-center text-red-400 text-xs">Gagal memuat jadwal.</p>`; 
    } 
}

function initDonasi() {
  const fmt = (n, c) => { const symbol = c === 'JPY' ? '¥' : 'Rp'; return symbol + ' ' + new Intl.NumberFormat('id-ID').format(n); };
  const T = TARGET_DONASI, C = TERKUMPUL_SAAT_INI, K = T - C;

  if ($("#targetLabel")) $("#targetLabel").textContent = fmt(T, "JPY");
  if ($("#terkumpulLabel")) $("#terkumpulLabel").textContent = fmt(C, "JPY");
  if ($("#kekuranganLabel")) $("#kekuranganLabel").textContent = fmt(K, "JPY");

  const obs = new IntersectionObserver(e => { e.forEach(x => { if (x.isIntersecting) { setTimeout(() => { if($("#progressBar")) $("#progressBar").style.width = Math.round((C / T) * 100) + "%"; if($("#percentLabel")) $("#percentLabel").textContent = Math.round((C / T) * 100); }, 300); } }) });
  if ($("#donasi")) obs.observe($("#donasi"));

  $$(".quick-jpy").forEach(b => b.addEventListener("click", () => $("#inputJPY").value = b.dataset.v));
  $$(".quick-idr").forEach(b => b.addEventListener("click", () => $("#inputIDR").value = b.dataset.v));

  const NOMINAL_SATUAN = 1000;
  const targetOrang = Math.ceil(T / NOMINAL_SATUAN);
  const sisaOrang = Math.ceil(K / NOMINAL_SATUAN);
  const persenJalan = Math.min(((T - K) / T) * 100, 100);

  if ($("#targetOrang")) $("#targetOrang").textContent = new Intl.NumberFormat('id-ID').format(sisaOrang);
  if ($("#labelTargetOrang")) $("#labelTargetOrang").textContent = new Intl.NumberFormat('id-ID').format(targetOrang);

  const elOrang = $("#terkumpulOrang");
  if (elOrang) {
    elOrang.textContent = new Intl.NumberFormat('id-ID').format(sisaOrang);
    const barOrang = $("#progressOrang");
    if (barOrang) { setTimeout(() => { barOrang.style.width = persenJalan + "%"; }, 500); }
  }

  const checkDedikasi = $("#checkDedikasi");
  const boxDedikasi = $("#boxNamaDedikasi");
  if (checkDedikasi && boxDedikasi) {
    checkDedikasi.addEventListener("change", (e) => {
      if (e.target.checked) { boxDedikasi.classList.remove("hidden"); $("#inputNamaDedikasi")?.focus(); }
      else { boxDedikasi.classList.add("hidden"); }
    });
  }

  const btnWA = $("#donasiBtn");
  if (btnWA) {
    btnWA.addEventListener("click", () => {
      const j = $("#inputJPY")?.value; const r = $("#inputIDR")?.value;
      const isDedikasi = checkDedikasi?.checked; const namaDedikasi = $("#inputNamaDedikasi")?.value;
      const t = TRANSLATIONS[currentLang] || TRANSLATIONS["id"];

      if (!j && !r) { alert(t.alert_nominal); return; }

      const originalText = btnWA.innerHTML;
      btnWA.innerHTML = `<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> ${t.btn_loading}`;
      btnWA.classList.add("opacity-75", "cursor-wait");

      let msg = t.wa_opening;
      msg += `\n\n💰 Nominal: ${j ? j + ' JPY' : ''} ${r ? r + ' IDR' : ''}`;
      if (isDedikasi && namaDedikasi) { msg += `\n${t.wa_dedication} *${namaDedikasi}*`; }
      msg += `\n\n${t.wa_closing}`;

      setTimeout(() => {
        window.open(`https://wa.me/818013909425?text=${encodeURIComponent(msg)}`, "_blank");
        btnWA.innerHTML = originalText;
        btnWA.classList.remove("opacity-75", "cursor-wait");
      }, 1000);
    });
  }

  $$("[data-copy]").forEach(b => b.addEventListener("click", () => {
    navigator.clipboard.writeText($(b.dataset.copy).innerText);
    const t = TRANSLATIONS[currentLang] || TRANSLATIONS["id"];
    const originalText = b.innerHTML; const originalClass = b.className;
    b.className = "text-xs font-bold text-emerald-600 flex items-center gap-1 transition-all duration-300";
    b.innerHTML = `<i data-lucide="check-circle" class="w-3 h-3"></i> ${t.btn_copied}`;
    window.lucide?.createIcons?.();
    setTimeout(() => { b.className = originalClass; b.innerHTML = originalText; window.lucide?.createIcons?.(); }, 2000);
  }));
}

function initCountdown() {
  const elDays = $("#cdDays");
  const elHours = $("#cdHours");
  const elMin = $("#cdMin");
  if (!elDays || !elHours || !elMin) return;

  const end = new Date("2026-05-31T23:59:59").getTime();
  setInterval(() => {
    const gap = end - new Date().getTime(); if(gap<0)return;
    elDays.innerText = Math.floor(gap/86400000); 
    elHours.innerText = Math.floor((gap%86400000)/3600000); 
    elMin.innerText = Math.floor((gap%3600000)/60000);
  }, 1000);
}

// ==========================================
// 4. BOOTSTRAP (URUTAN PENTING!)
// ==========================================
function boot() {
  const hariIni = new Date().getDay(); const bannerJumat = $("#jumatBanner");
  if (hariIni === 5 && bannerJumat) { bannerJumat.classList.remove("hidden"); }

  setLang(currentLang);
  $("#langToggle")?.addEventListener("click", () => setLang(currentLang === "id" ? "en" : "id"));
  $("#langToggleMob")?.addEventListener("click", () => setLang(currentLang === "id" ? "en" : "id"));
  
  if ($("#year")) $("#year").textContent = new Date().getFullYear();

  // Panggil semua fungsi dengan aman
  renderSholat();
  renderContent();
  initCountdown();
  initDonasi();
  initSmartCarousel();
  initVideoKajian();
  initVideoAjakan();
  initHeroSlider();
  setupAdmin();
  initZakatCalculator();
  initDoa();
  initPopup();

  // Pastikan Icon muncul
  if(window.lucide && window.lucide.createIcons) window.lucide.createIcons();

  // Animasi Scroll (Reveal) - Ditaruh terakhir agar elemen sudah ada
  const obs = new IntersectionObserver(e => e.forEach(x => { if (x.isIntersecting) x.target.classList.add("active") }), { threshold: 0.1 });
  $$(".reveal").forEach(e => obs.observe(e));
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
