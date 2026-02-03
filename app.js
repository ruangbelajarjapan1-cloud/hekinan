// app.js (Final Version - Strict Ordering & Index Method)

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// ==========================================
// 1. DATA & KONFIGURASI GLOBAL (WAJIB PALING ATAS)
// ==========================================
window.globalContentData = []; // Penyimpanan data artikel agar tombol tidak error

const TARGET_DONASI = 42000000;
const TERKUMPUL_SAAT_INI = 9519843;

const POPUP_IMAGES_LIST = ["assets/foto/1e.png","assets/foto/001.jpg","assets/foto/poster3.jpeg"]; 
const VIDEO_DONASI_LIST = ["jfKfPRdk", "dQwgXcQ"];
const YOUTUBE_VIDEOS = ["OvQjcl65BR8", "zEu4jVpgB_8", "oQjqwQb6atA"];
const LOCAL_IMAGES = ["1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg", "6.jpeg", "7.jpeg", "assets/foto/a.jpeg", "assets/foto/b.jpeg","assets/foto/poster3.jpeg"];

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
    wa_opening: "Assalamu'alaikum, saya ingin konfirmasi donasi pembangunan Masjid As-Sunnah Hekinan.", wa_dedication: "🎁 Pahala diniatkan atas nama:", wa_closing: "Mohon dicek. Jazakumullah khairan."
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
    wa_opening: "Assalamu'alaikum, I would like to confirm my donation for As-Sunnah Hekinan Mosque construction.", wa_dedication: "🎁 Reward intended for:", wa_closing: "Please check. Jazakumullah Khairan."
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

// ==========================================
// 3. FUNGSI LOGIKA (DIDEFINISIKAN DULU)
// ==========================================

// --- POPUP ARTIKEL (GLOBAL & FIXED) ---
window.openArticleModal = (index) => {
  try {
    // Ambil data dari variabel global (bukan parsing string HTML)
    const data = window.globalContentData[index];
    const modal = $("#articleModal"); 
    if (!modal || !data) return;

    $("#modalTitle").textContent = data.title || "";
    $("#modalDate").innerHTML = `<i data-lucide="calendar" class="w-3 h-3"></i> ${data.date || "Tanpa Tanggal"}`;
    $("#modalTag").textContent = data.tag || "Info";
    
    let contentHTML = data.content || data.desc || data.excerpt || "";
    contentHTML = contentHTML.replace(/\n/g, "<br>");
    $("#modalContent").innerHTML = contentHTML;

    const extBtn = $("#modalExternalLink");
    if (data.link && data.link.startsWith("http")) {
      extBtn.href = data.link; extBtn.classList.remove("hidden"); extBtn.classList.add("flex");
    } else {
      extBtn.classList.add("hidden"); extBtn.classList.remove("flex");
    }
    
    modal.classList.remove("hidden"); modal.classList.add("flex");
    window.lucide?.createIcons?.();
  } catch (e) { console.error("Gagal buka popup:", e); }
};

document.addEventListener("DOMContentLoaded", () => {
  const modal = $("#articleModal");
  const close = () => { if (modal) { modal.classList.add("hidden"); modal.classList.remove("flex"); } };
  $("#closeArticleBtn")?.addEventListener("click", close);
  $("#closeArticleBtnBottom")?.addEventListener("click", close);
  $("#closeArticleBackdrop")?.addEventListener("click", close);
});

// --- RENDER CONTENT (INDEX METHOD) ---
async function renderContent() {
  window.globalContentData = []; // Reset

  const mkCard = (x, isArt, index) => {
    let tagColor = "bg-slate-100 text-slate-600"; let tagLabel = isArt ? "Artikel" : "Info";
    if (x.tag) {
      tagLabel = x.tag; const t = x.tag.toLowerCase();
      if (t.includes('kajian')) tagColor = "bg-purple-100 text-purple-700";
      else if (t.includes('penting')) tagColor = "bg-red-100 text-red-700";
      else if (t.includes('kabar')) tagColor = "bg-emerald-100 text-emerald-700";
      else if (t.includes('faedah')) tagColor = "bg-amber-100 text-amber-700";
    }
    // PENTING: onclick hanya kirim INDEX (angka), bukan data string
    return `
      <article class="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:border-sky-200 hover:shadow-md flex flex-col h-full transition-all duration-300">
        <div class="flex items-center justify-between mb-3"><span class="${tagColor} px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">${tagLabel}</span><span class="text-[10px] text-slate-400 font-medium">${x.date || ""}</span></div>
        <h3 class="text-lg font-bold text-slate-800 leading-snug mb-2 group-hover:text-fig-primary transition-colors line-clamp-2">${x.title || "(Tanpa Judul)"}</h3>
        <p class="text-sm text-slate-600 mb-4 line-clamp-3 flex-grow leading-relaxed">${(isArt ? x.excerpt : x.desc) || "Klik selengkapnya untuk membaca detail."}</p>
        <button onclick="window.openArticleModal(${index})" class="mt-auto flex items-center gap-1.5 text-sm font-bold text-fig-primary hover:text-fig-primaryDark hover:underline transition-all w-fit"><span data-i18n="read_more">Selengkapnya</span><i data-lucide="arrow-right" class="w-4 h-4 transition-transform group-hover:translate-x-1"></i></button>
      </article>`;
  };

  const pW = $("#wrapPengumuman");
  if (pW) {
    const d = await loadCsv(getCsvUrl("pengumuman"));
    const startIdx = window.globalContentData.length;
    d.forEach(item => window.globalContentData.push(item));
    pW.innerHTML = d.length ? d.map((x, i) => mkCard(x, false, startIdx + i)).join("") : "";
    if (!d.length) $("#boardEmpty")?.classList.remove("hidden");
  }

  const aL = $("#artikelList");
  if (aL) {
    const d = await loadCsv(getCsvUrl("artikel"));
    const startIdx = window.globalContentData.length;
    d.forEach(item => window.globalContentData.push(item));
    window.allArticles = d;

    const filter = (q) => {
      // Re-render harus hati-hati dengan index.
      // Solusi aman: filter array asli, lalu ambil ulang index globalnya
      const filtered = d.map((item, i) => ({item, idx: startIdx + i}))
                        .filter(o => (o.item.title || "").toLowerCase().includes(q));
      
      aL.innerHTML = filtered.length ? filtered.map(o => mkCard(o.item, true, o.idx)).join("") : "";
      $("#artikelEmpty")?.classList.toggle("hidden", filtered.length > 0);
      window.lucide?.createIcons?.();
    };
    
    filter("");
    $("#searchArtikel")?.addEventListener("input", e => filter(e.target.value.toLowerCase()));
  }
  window.lucide?.createIcons?.();
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

function initPopup() {
  const popup = $("#popupPromo"); const imgEl = $("#popupPromo img"); const donateBtn = $("#popupDonateBtn"); const shareBtn = $("#popupShareBtn"); 
  if (!popup || !imgEl || !POPUP_IMAGES_LIST || POPUP_IMAGES_LIST.length === 0) return;
  let currentIndex = 0; let slideInterval;
  const showImage = (index) => { if (index >= POPUP_IMAGES_LIST.length) currentIndex = 0; else if (index < 0) currentIndex = POPUP_IMAGES_LIST.length - 1; else currentIndex = index; imgEl.src = POPUP_IMAGES_LIST[currentIndex]; };
  imgEl.onerror = null; imgEl.removeAttribute("onerror"); popup.style.removeProperty('display'); popup.style.display = 'flex'; imgEl.style.display = 'block'; popup.classList.remove("hidden"); showImage(0);
  if (POPUP_IMAGES_LIST.length > 1) {
    const navContainer = document.createElement("div"); navContainer.className = "absolute inset-0 flex justify-between items-center px-2 pointer-events-none top-0 h-[200px]";
    navContainer.innerHTML = `<button id="popPrevBtn" class="pointer-events-auto bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors backdrop-blur-sm"><i data-lucide="chevron-left" class="w-6 h-6"></i></button><button id="popNextBtn" class="pointer-events-auto bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors backdrop-blur-sm"><i data-lucide="chevron-right" class="w-6 h-6"></i></button>`;
    const relativeContainer = popup.querySelector(".relative"); if (relativeContainer) { relativeContainer.appendChild(navContainer); window.lucide?.createIcons?.(); }
    const nextSlide = () => showImage(currentIndex + 1); const prevSlide = () => showImage(currentIndex - 1);
    $("#popNextBtn")?.addEventListener("click", (e) => { e.stopPropagation(); nextSlide(); resetInterval(); }); $("#popPrevBtn")?.addEventListener("click", (e) => { e.stopPropagation(); prevSlide(); resetInterval(); });
    const startInterval = () => { slideInterval = setInterval(nextSlide, 3500); }; const resetInterval = () => { clearInterval(slideInterval); startInterval(); }; startInterval();
  }
  const close = () => { popup.classList.add("hidden"); popup.style.display = 'none'; if (slideInterval) clearInterval(slideInterval); };
  $("#closePopupBtn")?.addEventListener("click", close); $("#closePopupBackdrop")?.addEventListener("click", close);
  donateBtn?.addEventListener("click", () => { close(); $("#donasi")?.scrollIntoView({ behavior: "smooth" }); });
  shareBtn?.addEventListener("click", () => { const text = "Assalamu'alaikum. Mohon bantuannya untuk pembebasan lahan dan bangunan *Masjid As-Sunnah Hekinan (Jepang)*. \n\nMari cari pahala jariyah dengan menyebarkan info ini atau ikut berwakaf baarakallah fiikum. \n\nCek progres & donasi di sini: 👇\nhttps://assunnahhekinan.org"; window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank"); close(); });
}

function initVideoAjakan() { const container = $("#videoAjakanContainer"); if (!container || !VIDEO_DONASI_LIST.length) return; container.innerHTML = ""; if (VIDEO_DONASI_LIST.length === 1) { container.className = "max-w-4xl mx-auto reveal"; container.innerHTML = `<div class="relative w-full pt-[56.25%] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50 group"><iframe src="https://www.youtube.com/embed/${VIDEO_DONASI_LIST[0]}?rel=0" title="Video Ajakan Wakaf" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="absolute top-0 left-0 w-full h-full"></iframe></div>`; } else { container.className = "max-w-full mx-auto reveal flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar px-4"; VIDEO_DONASI_LIST.forEach(id => { const item = document.createElement("div"); item.className = "snap-center shrink-0 w-[85%] sm:w-[60%] md:w-[45%] relative pt-[48%] sm:pt-[33%] md:pt-[25%] rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-black"; item.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?rel=0" title="Video Ajakan" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="absolute top-0 left-0 w-full h-full"></iframe>`; container.appendChild(item); }); } }
function initVideoKajian() { const grid = $("#videoGrid"); if (!grid || !YOUTUBE_VIDEOS.length) return; grid.innerHTML = ""; YOUTUBE_VIDEOS.forEach(id => { const card = document.createElement("div"); card.className = "rounded-2xl overflow-hidden shadow-lg border border-slate-100 bg-white group hover:-translate-y-1 transition-transform duration-300"; card.innerHTML = `<div class="relative w-full pt-[56.25%] bg-black"><iframe src="https://www.youtube.com/embed/${id}" title="Video Kajian" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="absolute top-0 left-0 w-full h-full"></iframe></div>`; grid.appendChild(card); }); }
function initDoa() { const elArab = $("#doaArab"), elArti = $("#doaArti"), btn = $("#btnGantiDoa"); if (!elArab) return; const acakDoa = () => { const r = DAFTAR_DOA[Math.floor(Math.random() * DAFTAR_DOA.length)]; elArab.textContent = r.ar; elArti.textContent = r.id; }; acakDoa(); btn?.addEventListener("click", acakDoa); }

async function initSmartCarousel() {
  const track = $("#kgTrack"); if (!track) return;
  track.innerHTML = "";
  LOCAL_IMAGES.forEach(src => {
    const el = document.createElement("figure");
    el.className = "snap-item shrink-0 w-[85%] sm:w-[60%] md:w-[40%] lg:w-[30%] h-64 rounded-2xl overflow-hidden shadow-md bg-slate-100 relative group border border-slate-200 flex items-center justify-center";
    el.innerHTML = `<img src="${src}" class="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700" loading="lazy" alt="Kegiatan">`;
    track.appendChild(el);
  });
  try {
    const res = await fetch(APPS_SCRIPT_URL);
    const driveItems = await res.json();
    const videos = driveItems.filter(item => item.mime.includes("video"));
    videos.forEach(item => {
      const el = document.createElement("figure");
      el.className = "snap-item shrink-0 w-[85%] sm:w-[60%] md:w-[40%] lg:w-[30%] h-64 rounded-2xl overflow-hidden shadow-md bg-black relative group border border-slate-100";
      el.innerHTML = `<iframe src="${item.videoUrl}" class="w-full h-full" allow="autoplay" style="border:none;" loading="lazy"></iframe><div class="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-2 py-1 rounded-md flex items-center gap-1 font-bold z-10"><i data-lucide="video" class="w-3 h-3"></i> Drive</div>`;
      track.appendChild(el);
    });
  } catch (e) { console.log("Video empty/error."); }
  window.lucide?.createIcons?.();
  let interval; const speed = 4000;
  const getW = () => track.firstElementChild ? track.firstElementChild.offsetWidth + 16 : 300;
  const start = () => {
    clearInterval(interval);
    interval = setInterval(() => {
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 20) track.scrollTo({ left: 0, behavior: "smooth" });
      else track.scrollBy({ left: getW(), behavior: "smooth" });
    }, speed);
  };
  const stop = () => clearInterval(interval);
  start();
  track.addEventListener("touchstart", stop, { passive: true }); track.addEventListener("touchend", start, { passive: true });
  track.addEventListener("mouseenter", stop); track.addEventListener("mouseleave", start);
  const scroll = d => { stop(); track.scrollBy({ left: d * getW(), behavior: "smooth" }); start(); };
  $("#kgPrev")?.addEventListener("click", () => scroll(-1)); $("#kgNext")?.addEventListener("click", () => scroll(1));
}

async function renderSholat() { const g = $("#sholatGrid"); const l = $("#locLabel"); if (!g) return; g.innerHTML = `<p class="col-span-full text-center text-slate-400 py-4">...</p>`; let p = { lat: 34.884, lon: 136.993 }; try { p = await new Promise(r => navigator.geolocation.getCurrentPosition(x => r({ lat: x.coords.latitude, lon: x.coords.longitude }), () => r(p), { timeout: 3000 })); } catch {} if (l) l.textContent = `${p.lat.toFixed(3)}, ${p.lon.toFixed(3)}`; try { const d = await fetch(`https://api.aladhan.com/v1/timings?latitude=${p.lat}&longitude=${p.lon}&method=2`).then(r => r.json()); if (d.data && d.data.date && d.data.date.hijri) renderHijri(d.data.date.hijri); const m = { Fajr: ["Subuh", "sunrise"], Sunrise: ["Syuruq", "sun"], Dhuhr: ["Dzuhur", "sun"], Asr: ["Ashar", "cloud-sun"], Maghrib: ["Maghrib", "moon"], Isha: ["Isya", "star"] }; g.innerHTML = ""; Object.keys(m).forEach(k => { g.innerHTML += `<div class="rounded-2xl border border-slate-100 p-4 text-center bg-slate-50 hover:bg-white hover:border-sky-200 transition-all"><i data-lucide="${m[k][1]}" class="w-5 h-5 mx-auto text-slate-400 mb-2"></i><div class="text-[10px] uppercase font-bold text-slate-400">${m[k][0]}</div><div class="mt-1 text-lg font-extrabold text-slate-800">${d.data.timings[k]}</div></div>`; }); window.lucide?.createIcons?.(); } catch { g.innerHTML = "Error"; } }

function initDonasi() {
  const fmt = (n, c) => { const symbol = c === 'JPY' ? '¥' : 'Rp'; return symbol + ' ' + new Intl.NumberFormat('id-ID').format(n); };
  const T = TARGET_DONASI, C = TERKUMPUL_SAAT_INI, K = T - C;

  if ($("#targetLabel")) $("#targetLabel").textContent = fmt(T, "JPY");
  if ($("#terkumpulLabel")) $("#terkumpulLabel").textContent = fmt(C, "JPY");
  if ($("#kekuranganLabel")) $("#kekuranganLabel").textContent = fmt(K, "JPY");

  const obs = new IntersectionObserver(e => { e.forEach(x => { if (x.isIntersecting) { setTimeout(() => { $("#progressBar").style.width = Math.round((C / T) * 100) + "%"; $("#percentLabel").textContent = Math.round((C / T) * 100); }, 300); } }) });
  if ($("#donasi")) obs.observe($("#donasi"));

  $$(".quick-jpy").forEach(b => b.addEventListener("click", () => $("#inputJPY").value = b.dataset.v));
  $$(".quick-idr").forEach(b => b.addEventListener("click", () => $("#inputIDR").value = b.dataset.v));

  // Widget Orang Baik (Sisa)
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

  // Wakaf Dedikasi
  const checkDedikasi = $("#checkDedikasi");
  const boxDedikasi = $("#boxNamaDedikasi");
  if (checkDedikasi && boxDedikasi) {
    checkDedikasi.addEventListener("change", (e) => {
      if (e.target.checked) { boxDedikasi.classList.remove("hidden"); $("#inputNamaDedikasi")?.focus(); }
      else { boxDedikasi.classList.add("hidden"); }
    });
  }

  // Konfirmasi WA
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
        window.lucide?.createIcons?.();
      }, 1000);
    });
  }

  // Salin Rekening
  $$("[data-copy]").forEach(b => b.addEventListener("click", () => {
    navigator.clipboard.writeText($(b.dataset.copy).innerText);
    const t = TRANSLATIONS[currentLang] || TRANSLATIONS["id"];
    const originalText = b.innerHTML; const originalClass = b.className;
    b.className = "text-xs font-bold text-emerald-600 flex items-center gap-1 transition-all duration-300";
    b.innerHTML = `<i data-lucide="check-circle" class="w-3 h-3"></i> ${t.btn_copied}`;
    window.lucide?.createIcons?.();
    setTimeout(() => { b.className = originalClass; b.innerHTML = originalText; window.lucide?.createIcons?.(); }, 2000);
  }));

  // Komitmen
  const btnRemind = $("#btnSetReminder"); const inputDate = $("#dateReminder");
  if (inputDate) { const besok = new Date(); besok.setDate(besok.getDate() + 1); inputDate.value = besok.toISOString().split('T')[0]; }
  if (btnRemind && inputDate) {
    btnRemind.addEventListener("click", () => {
      const tgl = inputDate.value; if (!tgl) return;
      let freq = 'once'; const freqEl = document.querySelector('input[name="freq"]:checked'); if (freqEl) freq = freqEl.value;
      const t = TRANSLATIONS[currentLang] || TRANSLATIONS["id"];
      const dateStr = tgl.replace(/-/g, "");
      const title = encodeURIComponent(t.reminder_title); const desc = encodeURIComponent(t.reminder_desc); const loc = encodeURIComponent("https://assunnahhekinan.org");
      let gCalLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${desc}&location=${loc}&dates=${dateStr}/${dateStr}`;
      if (freq === 'monthly') { gCalLink += `&recur=RRULE:FREQ=MONTHLY`; }
      window.open(gCalLink, "_blank");
    });
  }
}

function initCountdown() {
  const end = new Date("2026-05-31T23:59:59").getTime();
  setInterval(() => {
    const gap = end - new Date().getTime(); if(gap<0)return;
    $("#cdDays").innerText = Math.floor(gap/86400000); $("#cdHours").innerText = Math.floor((gap%86400000)/3600000); $("#cdMin").innerText = Math.floor((gap%3600000)/60000);
  }, 1000);
}

// ==========================================
// 4. BOOTSTRAP (RUN EVERYTHING)
// ==========================================
function boot() {
  const hariIni = new Date().getDay(); const bannerJumat = $("#jumatBanner");
  if (hariIni === 5 && bannerJumat) { bannerJumat.classList.remove("hidden"); }

  setLang(currentLang);
  $("#langToggle")?.addEventListener("click", () => setLang(currentLang === "id" ? "en" : "id"));
  $("#langToggleMob")?.addEventListener("click", () => setLang(currentLang === "id" ? "en" : "id"));
  $("#tabPengumuman")?.addEventListener("click", () => { $("#wrapPengumuman").classList.remove("hidden"); $("#wrapArtikel").classList.add("hidden"); $("#tabs").classList.replace("tab-right", "tab-left"); });
  $("#tabArtikel")?.addEventListener("click", () => { $("#wrapPengumuman").classList.add("hidden"); $("#wrapArtikel").classList.remove("hidden"); $("#tabs").classList.replace("tab-left", "tab-right"); });
  
  if ($("#year")) $("#year").textContent = new Date().getFullYear();

  // Load Semua Fitur secara Berurutan
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

  // Scroll Reveal
  const obs = new IntersectionObserver(e => e.forEach(x => { if (x.isIntersecting) x.target.classList.add("active") }), { threshold: 0.1 });
  $$(".reveal").forEach(e => obs.observe(e));
  
  // Icon Lucide
  window.lucide?.createIcons?.();
}

// Jalankan saat loading selesai
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
