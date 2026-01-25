// app.js (ES Module)

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// ==========================================
// 💰 KONFIGURASI DONASI
// ==========================================
const TARGET_DONASI = 42000000;
const TERKUMPUL_SAAT_INI = 9132333;

// ==========================================
// 📣 POPUP POSTER
// ==========================================
const POPUP_IMAGE = "assets/foto/1e.png"; 

// ==========================================
// 🎥 VIDEO AJAKAN DONASI
// ==========================================
const VIDEO_DONASI_LIST = [
  "jfKfPfyk", 
  "dQw4wQ"
];

// ==========================================
// 🎥 DAFTAR VIDEO KAJIAN
// ==========================================
const YOUTUBE_VIDEOS = [
  "OvQjcl65BR8", 
  "zEu4jVpgB_8",
  "oQjqwQb6atA"
];

// 📸 DAFTAR FOTO
const LOCAL_IMAGES = [
  "1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg", "5.jpeg", "6.jpeg", "7.jpeg",
  "assets/foto/a.jpeg", "assets/foto/b.jpeg", "assets/foto/c.jpeg", "assets/foto/wakaf.png"
];

// ===== KONFIGURASI LAINNYA =====
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzLMb1wIdcq4YZWw7wbFJGlI2su_Yyti1DoUHPzRBMDZyMmsB98cQKfpV9z9DH9RwuGmA/exec";
const DEFAULT_KAJIAN_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=0&single=true&output=csv";
const DEFAULT_PENGUMUMAN_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=991747005&single=true&output=csv";
const DEFAULT_ARTIKEL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=1625529193&single=true&output=csv";

const HIJRI_MONTHS_ID = ["Muharram", "Shafar", "Rabiul Awal", "Rabiul Akhir", "Jumadil Awal", "Jumadil Akhir", "Rajab", "Sya'ban", "Ramadhan", "Syawal", "Dzulqa'dah", "Dzulhijjah"];

function initHeroSlider() {
  const slides = $$(".hero-slide");
  if (slides.length < 2) return;
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
  }, 5000);
}

const TRANSLATIONS = {
  id: {
    nav_sholat: "Jadwal Sholat", nav_kegiatan: "Kegiatan", nav_info: "Info", nav_donasi: "Donasi",
    hero_title_1: "Merajut Ukhuwah,", hero_title_2: "Membangun Peradaban.",
    hero_desc: "Pusat kegiatan ibadah, pendidikan anak, dan silaturahmi masyarakat muslim Indonesia di sekitar Hekinan Aichi ken Jepang.",
    hero_btn_wakaf: "Ikut Wakaf", hero_btn_sholat: "Jadwal Sholat", hero_btn_kiblat: "Arah Kiblat",
    hadith_label: "Mutiara Hadits",
    sholat_title: "Jadwal Sholat",
    gallery_title: "Galeri Foto", gallery_desc: "Dokumentasi kegiatan dan kebersamaan jamaah.",
    tab_announcement: "Pengumuman", tab_article: "Artikel & Faedah",
    empty_data: "Belum ada data terbaru.", empty_search: "Tidak ditemukan.",
    donasi_badge: "Peluang Amal Jariyah", donasi_title: "Investasi Kekal Akhirat",
    deadline_label: "Batas Waktu Wakaf (Tahap 1)",
    progress_title: "Progres Pembangunan", collected: "Terkumpul", needed: "Kekurangan",
    confirm_title: "Konfirmasi Donasi", confirm_desc: "Masukkan nominal yang telah ditransfer.",
    or: "ATAU", btn_confirm: "Konfirmasi via WA", footer_links: "Tautan", footer_follow: "Lokasi",
    btn_zakat: "Hitung Zakat", 
    btn_donate_now: "Donasi Sekarang",
    btn_popup_wakaf: "Ikut Wakaf Sekarang",
    video_appeal_title: "Mengapa Kita Perlu Membangun Masjid?",
    video_appeal_desc: "Simak pesan berikut ini.",
    view_all: "Lihat Semua",
    view_channel: "Lihat Channel YouTube",
    contact_title: "Hubungi Kami"
  },
  en: {
    nav_sholat: "Prayer Times", nav_kegiatan: "Gallery", nav_info: "Info", nav_donasi: "Donate",
    hero_title_1: "Weaving Brotherhood,", hero_title_2: "Building Civilization.",
    hero_desc: "Center for worship, children's education, and gathering for the Indonesian Muslim community around Hekinan, Aichi Prefecture, Japan.",
    hero_btn_wakaf: "Donate Now", hero_btn_sholat: "Prayer Times", hero_btn_kiblat: "Qibla Finder",
    hadith_label: "Daily Hadith",
    sholat_title: "Prayer Times",
    gallery_title: "Photo Gallery", gallery_desc: "Documentation of community activities.",
    tab_announcement: "Announcements", tab_article: "Articles",
    empty_data: "No updates.", empty_search: "Not found.",
    donasi_badge: "Charity Opportunity", donasi_title: "Invest for Hereafter",
    deadline_label: "Donation Deadline",
    progress_title: "Construction Progress", collected: "Collected", needed: "Remaining",
    confirm_title: "Confirm Donation", confirm_desc: "Enter transferred amount.",
    or: "OR", btn_confirm: "Confirm via WA", footer_links: "Links", footer_follow: "Location",
    btn_zakat: "Zakat Calculator", 
    btn_donate_now: "Donate Now",
    btn_popup_wakaf: "Donate Now",
    video_appeal_title: "Why Do We Need to Build a Mosque?",
    video_appeal_desc: "Watch the following message.",
    view_all: "View All",
    view_channel: "Visit YouTube Channel",
    contact_title: "Contact Us"
  }
};
let currentLang = localStorage.getItem("lang") || "id";
function setLang(lang) {
  currentLang = lang; localStorage.setItem("lang", lang);
  const t = TRANSLATIONS[lang];
  $$("[data-i18n]").forEach(el => { const k = el.getAttribute("data-i18n"); if(t[k]) el.textContent = t[k]; });
  $$("[data-placeholder]").forEach(el => { const k = el.getAttribute("data-placeholder"); if(t[k]) el.placeholder = t[k]; });
  renderHadith(); renderHijri(); 
}

// ===== POPUP PROMO (VERSI PAKSA RESET STYLE) =====
function initPopup() {
  const popup = $("#popupPromo");
  const imgEl = $("#popupPromo img");
  const donateBtn = $("#popupDonateBtn");
  
  if (!popup || !imgEl || !POPUP_IMAGE) return;

  // 1. Matikan handler error HTML agar tidak menyembunyikan popup
  imgEl.onerror = null; 
  imgEl.removeAttribute("onerror");

  // 2. Set Gambar
  imgEl.src = POPUP_IMAGE;

  // 3. PAKSA RESET STYLE (PENTING! Ini yang memperbaiki masalah "jarang muncul")
  // Menghapus 'display: none' yang mungkin ditempel otomatis oleh error sebelumnya
  popup.style.removeProperty('display'); 
  popup.style.display = 'flex'; // Paksa jadi flex
  
  imgEl.style.removeProperty('display'); // Pastikan gambar tidak tersembunyi
  imgEl.style.display = 'block';

  // 4. Hapus class hidden
  popup.classList.remove("hidden");
  
  // Fungsi Tutup
  const close = () => {
    popup.classList.add("hidden");
    popup.style.display = 'none'; // Tambahkan ini agar sinkron
  };

  $("#closePopupBtn")?.addEventListener("click", close);
  $("#closePopupBackdrop")?.addEventListener("click", close);

  donateBtn?.addEventListener("click", () => {
    close(); 
    $("#donasi")?.scrollIntoView({ behavior: "smooth" }); 
  });
}

// ===== RENDER VIDEO AJAKAN =====
function initVideoAjakan() {
  const container = $("#videoAjakanContainer");
  if (!container || !VIDEO_DONASI_LIST.length) return;
  container.innerHTML = "";
  if (VIDEO_DONASI_LIST.length === 1) {
    container.className = "max-w-4xl mx-auto reveal";
    container.innerHTML = `
      <div class="relative w-full pt-[56.25%] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50 group">
        <iframe src="https://www.youtube.com/embed/${VIDEO_DONASI_LIST[0]}?rel=0" title="Video Ajakan Wakaf" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="absolute top-0 left-0 w-full h-full"></iframe>
      </div>
    `;
  } else {
    container.className = "max-w-full mx-auto reveal flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar px-4";
    VIDEO_DONASI_LIST.forEach(id => {
      const item = document.createElement("div");
      item.className = "snap-center shrink-0 w-[85%] sm:w-[60%] md:w-[45%] relative pt-[48%] sm:pt-[33%] md:pt-[25%] rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-black";
      item.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?rel=0" title="Video Ajakan" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="absolute top-0 left-0 w-full h-full"></iframe>`;
      container.appendChild(item);
    });
  }
}

// ===== RENDER VIDEO KAJIAN (GRID) =====
function initVideoKajian() {
  const grid = $("#videoGrid");
  if (!grid || !YOUTUBE_VIDEOS.length) return;
  grid.innerHTML = ""; 
  YOUTUBE_VIDEOS.forEach(id => {
    const card = document.createElement("div");
    card.className = "rounded-2xl overflow-hidden shadow-lg border border-slate-100 bg-white group hover:-translate-y-1 transition-transform duration-300";
    card.innerHTML = `<div class="relative w-full pt-[56.25%] bg-black"><iframe src="https://www.youtube.com/embed/${id}" title="Video Kajian" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="absolute top-0 left-0 w-full h-full"></iframe></div>`;
    grid.appendChild(card);
  });
}

// ===== WIDGET DOA =====
const DAFTAR_DOA = [
  { ar: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ", id: "Ya Allah, bukalah untukku pintu-pintu rahmat-Mu. (Doa Masuk Masjid)" },
  { ar: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ", id: "Ya Allah, sesungguhnya aku memohon keutamaan dari-Mu. (Doa Keluar Masjid)" },
  { ar: "رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا", id: "Ya Tuhanku, tambahkanlah ilmuku dan berilah aku karunia untuk dapat memahaminya." },
  { ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", id: "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat dan peliharalah kami dari siksa neraka." }
];
function initDoa() {
  const elArab = $("#doaArab"), elArti = $("#doaArti"), btn = $("#btnGantiDoa");
  if(!elArab) return;
  const acakDoa = () => {
    const r = DAFTAR_DOA[Math.floor(Math.random() * DAFTAR_DOA.length)];
    elArab.textContent = r.ar; elArti.textContent = r.id;
  };
  acakDoa(); btn?.addEventListener("click", acakDoa);
}

// ===== SMART CAROUSEL =====
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
  $("#kgPrev")?.addEventListener("click", ()=>scroll(-1)); $("#kgNext")?.addEventListener("click", ()=>scroll(1));
}

// ===== ZAKAT CALCULATOR =====
function initZakatCalculator() {
  const openBtn = $("#openZakat"); const modal = $("#zakatModal"); const closeBtn = $("#closeZakat"); const calcBtn = $("#calcBtn");
  if(!openBtn || !modal) return;
  let currentZakatCurr = 'JPY';
  const btnJPY = $("#currJPY"), btnIDR = $("#currIDR"), priceInput = $("#zGoldPrice"), labelCurr = $("#zCurrLabel");
  const linkJPY = $("#linkGoldJPY"), linkIDR = $("#linkGoldIDR");
  const DEFAULT_JPY = 14000, DEFAULT_IDR = 1400000;
  priceInput.value = DEFAULT_JPY;
  const setCurrency = (c) => {
    currentZakatCurr = c; labelCurr.textContent = c;
    const active = "flex-1 py-2 text-sm font-bold rounded-lg bg-white shadow-sm text-slate-800 transition-all border border-slate-200 ring-2 ring-sky-100";
    const inactive = "flex-1 py-2 text-sm font-bold rounded-lg text-slate-500 hover:bg-white/50 transition-all";
    if (c === 'JPY') { btnJPY.className = active; btnIDR.className = inactive; priceInput.value = DEFAULT_JPY; linkJPY.classList.remove("hidden"); linkIDR.classList.add("hidden"); } 
    else { btnIDR.className = active; btnJPY.className = inactive; priceInput.value = DEFAULT_IDR; linkIDR.classList.remove("hidden"); linkJPY.classList.add("hidden"); }
    $("#zResultBox").classList.add("hidden");
  };
  btnJPY.addEventListener("click", () => setCurrency('JPY')); btnIDR.addEventListener("click", () => setCurrency('IDR'));
  const toggle = (show) => { modal.classList.toggle("hidden", !show); modal.classList.toggle("flex", show); };
  openBtn.addEventListener("click", () => toggle(true)); closeBtn.addEventListener("click", () => toggle(false));
  modal.addEventListener("click", (e) => { if(e.target===modal) toggle(false); });
  calcBtn.addEventListener("click", () => {
    const goldPrice = Number(priceInput.value || 0), cash = Number($("#zCash")?.value || 0), goldVal = Number($("#zGoldVal")?.value || 0),
