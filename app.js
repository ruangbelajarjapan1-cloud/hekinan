// app.js (ES Module)

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// ===== KONFIGURASI LINK GOOGLE SHEET =====
const DEFAULT_KAJIAN_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=0&single=true&output=csv";
const DEFAULT_PENGUMUMAN_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=991747005&single=true&output=csv";
const DEFAULT_ARTIKEL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=1625529193&single=true&output=csv";

// ===== BAHASA (TRANSLATIONS) =====
const TRANSLATIONS = {
  id: {
    nav_sholat: "Jadwal Sholat", nav_kegiatan: "Kegiatan", nav_info: "Info", nav_donasi: "Donasi",
    hero_title_1: "Merajut Ukhuwah,", hero_title_2: "Membangun Peradaban.",
    hero_desc: "Selamat datang di laman resmi Masjid As-Sunnah Hekinan. Pusat kegiatan ibadah, pendidikan anak, dan silaturahmi masyarakat muslim di Aichi, Jepang.",
    hero_btn_wakaf: "Ikut Wakaf", hero_btn_sholat: "Jadwal Sholat",
    hadith_label: "Mutiara Hadits",
    sholat_title: "Jadwal Sholat", sholat_note: "Waktu sholat dihitung berdasarkan lokasi perangkat Anda.",
    btn_refresh: "Perbarui",
    gallery_title: "Galeri Kegiatan", gallery_desc: "Dokumentasi kebersamaan jamaah.",
    tab_announcement: "Pengumuman", tab_article: "Artikel & Faedah",
    empty_data: "Belum ada data terbaru.", empty_search: "Tidak ditemukan.",
    search_placeholder: "Cari artikel...",
    donasi_badge: "Peluang Amal Jariyah", donasi_title: "Investasi Kekal Akhirat",
    deadline_label: "Batas Waktu Wakaf (Tahap 1)",
    progress_title: "Progres Pembangunan", collected: "Terkumpul", needed: "Kekurangan",
    confirm_title: "Konfirmasi Donasi", confirm_desc: "Masukkan nominal yang telah ditransfer.",
    or: "ATAU", btn_confirm: "Konfirmasi WA",
    footer_links: "Tautan", footer_follow: "Ikuti Kami"
  },
  en: {
    nav_sholat: "Prayer Times", nav_kegiatan: "Gallery", nav_info: "Info", nav_donasi: "Donate",
    hero_title_1: "Weaving Brotherhood,", hero_title_2: "Building Civilization.",
    hero_desc: "Welcome to the official site of As-Sunnah Mosque Hekinan. A center for worship, children's education, and gathering for the Muslim community in Aichi, Japan.",
    hero_btn_wakaf: "Donate Now", hero_btn_sholat: "Prayer Times",
    hadith_label: "Daily Hadith",
    sholat_title: "Prayer Times", sholat_note: "Prayer times are calculated based on your device location.",
    btn_refresh: "Update",
    gallery_title: "Gallery", gallery_desc: "Documentation of our community activities.",
    tab_announcement: "Announcements", tab_article: "Articles & Benefits",
    empty_data: "No recent updates.", empty_search: "No results found.",
    search_placeholder: "Search articles...",
    donasi_badge: "Charity Opportunity", donasi_title: "Invest for the Hereafter",
    deadline_label: "Donation Deadline (Phase 1)",
    progress_title: "Construction Progress", collected: "Collected", needed: "Remaining",
    confirm_title: "Confirm Donation", confirm_desc: "Please enter the transferred amount.",
    or: "OR", btn_confirm: "Confirm via WhatsApp",
    footer_links: "Links", footer_follow: "Follow Us"
  }
};

let currentLang = localStorage.getItem("lang") || "id";

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  const t = TRANSLATIONS[lang];
  $$("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key]) el.textContent = t[key];
  });
  $$("[data-placeholder]").forEach(el => {
    const key = el.getAttribute("data-placeholder");
    if (t[key]) el.placeholder = t[key];
  });
  renderHadith(); // Re-render hadith translation
  renderHijri();  // Re-render Hijri date
}

// ===== DATABASE HADITS (Lokal agar cepat & sesuai sunnah) =====
const HADITHS = [
  {
    ar: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
    id: "Sesungguhnya setiap amalan tergantung pada niatnya. (HR. Bukhari & Muslim)",
    en: "Actions are but by intentions. (Bukhari & Muslim)"
  },
  {
    ar: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    id: "Sebaik-baik kalian adalah orang yang belajar Al-Qur'an dan mengajarkannya. (HR. Bukhari)",
    en: "The best of you are those who learn the Quran and teach it. (Bukhari)"
  },
  {
    ar: "الدِّينُ النَّصِيحَةُ",
    id: "Agama itu adalah nasihat. (HR. Muslim)",
    en: "The Religion is (sincere) advice. (Muslim)"
  },
  {
    ar: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    id: "Tidak sempurna iman salah seorang di antara kalian hingga ia mencintai untuk saudaranya apa yang ia cintai untuk dirinya sendiri. (HR. Bukhari & Muslim)",
    en: "None of you [truly] believes until he loves for his brother that which he loves for himself. (Bukhari & Muslim)"
  },
  {
    ar: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    id: "Barangsiapa yang beriman kepada Allah dan hari akhir, hendaklah dia berkata baik atau diam. (HR. Bukhari & Muslim)",
    en: "Whoever believes in Allah and the Last Day, let him speak good or remain silent. (Bukhari & Muslim)"
  }
];

function renderHadith() {
  // Pilih hadits berdasarkan hari dalam setahun (agar konsisten seharian)
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const h = HADITHS[dayOfYear % HADITHS.length];
  
  $("#hadithArab").textContent = h.ar;
  $("#hadithTerjemah").textContent = currentLang === 'en' ? h.en : h.id;
  $("#hadithRiwayat").textContent = "Hadits Shahih";
}

// ===== HIJRI CALENDAR =====
function renderHijri() {
  const el = $("#hijriDate");
  if (!el) return;
  
  // Format: "14 Rajab 1447"
  const locale = currentLang === 'en' ? 'en-US' : 'id-ID';
  const hijri = new Intl.DateTimeFormat(locale + '-u-ca-islamic', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(new Date());
  
  // Clean up "AH" suffix usually added by Intl
  el.textContent = hijri.replace(/ AH| H/g, " H");
}

// ===== COUNTDOWN =====
function initCountdown() {
  // Deadline: 31 Mei 2026 23:59:59
  const deadline = new Date("2026-05-31T23:59:59").getTime();

  const tick = () => {
    const now = new Date().getTime();
    const gap = deadline - now;

    if (gap < 0) {
      $("#cdDays").innerText = "00"; $("#cdHours").innerText = "00";
      $("#cdMin").innerText = "00"; return;
    }

    const d = Math.floor(gap / (1000 * 60 * 60 * 24));
    const h = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));

    $("#cdDays").innerText = d < 10 ? "0" + d : d;
    $("#cdHours").innerText = h < 10 ? "0" + h : h;
    $("#cdMin").innerText = m < 10 ? "0" + m : m;
  };
  
  setInterval(tick, 1000);
  tick();
}


// ===== ADMIN & CSV (UTILITY) =====
const ADMIN_CODE = "as-sunnah-2025";
const isAdmin = () => new URLSearchParams(location.search).get("admin") === "1" && localStorage.getItem("is_admin") === "1";

function parseCSV(text) {
  const rows = []; let i=0, cur="", row=[], inQ=false;
  while (i<text.length) {
    const c=text[i];
    if (c==='"') { if (inQ && text[i+1]==='"') {cur+='"'; i+=2; continue;} inQ=!inQ; i++; continue; }
    if (!inQ && c===',') { row.push(cur); cur=""; i++; continue; }
    if (!inQ && (c==='\n' || c==='\r')) {
      if(cur!==""||row.length){row.push(cur); rows.push(row); row=[]; cur="";}
      if(c==='\r' && text[i+1]==='\n') i++; i++; continue;
    }
    cur+=c; i++;
  }
  if(cur!==""||row.length){row.push(cur); rows.push(row);}
  if(!rows.length) return [];
  const head = rows[0].map(h=>String(h||"").trim().toLowerCase());
  return rows.slice(1).map(cols=>{
    const o={}; head.forEach((h,idx)=>o[h]=String(cols[idx]||"").trim()); return o;
  });
}

async function loadCsv(url) {
  if (!url) return [];
  try { return parseCSV(await fetch(url, {cache:"no-store"}).then(r=>r.text())); } catch { return []; }
}

function normalizeUrl(u) {
  const s = String(u||"").trim();
  return s ? (/^https?:\/\//i.test(s) ? s : "https://"+s) : "";
}

function getCsvUrl(kind) {
  const local = isAdmin() ? localStorage.getItem(`sheet_${kind}`) : "";
  if (local) return local;
  return kind==="kajian"?DEFAULT_KAJIAN_CSV : kind==="pengumuman"?DEFAULT_PENGUMUMAN_CSV : DEFAULT_ARTIKEL_CSV;
}

// ===== JADWAL SHOLAT =====
async function renderSholat() {
  const grid = $("#sholatGrid"); const lab = $("#locLabel");
  if (!grid) return;
  grid.innerHTML = `<p class="col-span-full text-center text-slate-400 py-4 animate-pulse">...</p>`;

  let pos = { lat: 34.884, lon: 136.993 }; // Fallback Hekinan
  try {
    pos = await new Promise((res) => navigator.geolocation.getCurrentPosition(
      p => res({lat:p.coords.latitude, lon:p.coords.longitude}),
      () => res(pos), {timeout:4000}
    ));
  } catch {}
  
  if (lab) lab.textContent = `${pos.lat.toFixed(3)}, ${pos.lon.toFixed(3)}`;

  try {
    const data = await fetch(`https://api.aladhan.com/v1/timings?latitude=${pos.lat}&longitude=${pos.lon}&method=2`,{cache:"no-store"}).then(r=>r.json());
    const t = data?.data?.timings;
    
    // Ikon benda mati (Nature)
    const map = {
      Fajr: ["Subuh", "sunrise"], Sunrise: ["Syuruq", "sun"], Dhuhr: ["Dzuhur", "sun"],
      Asr: ["Ashar", "cloud-sun"], Maghrib: ["Maghrib", "moon"], Isha: ["Isya", "star"],
    };
    
    grid.innerHTML = "";
    Object.keys(map).forEach(k => {
      const d = document.createElement("div");
      d.className = "group rounded-2xl border border-slate-100 p-4 text-center bg-slate-50 hover:bg-white hover:border-sky-200 transition-all";
      d.innerHTML = `
        <i data-lucide="${map[k][1]}" class="w-5 h-5 mx-auto text-slate-400 group-hover:text-fig-primary mb-2"></i>
        <div class="text-[10px] uppercase font-bold text-slate-400">${map[k][0]}</div>
        <div class="mt-1 text-lg font-extrabold text-slate-800">${t?.[k]||"-"}</div>
      `;
      grid.appendChild(d);
    });
    window.lucide?.createIcons?.();
  } catch { grid.innerHTML = `<p class="col-span-full text-red-500 text-sm">Gagal memuat.</p>`; }
}

// ===== PENGUMUMAN & ARTIKEL =====
function createCard(item, isArt) {
  const el = document.createElement("article");
  el.className = "rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:border-sky-200 flex flex-col h-full transition-all";
  
  const title = item.title || "";
  const body = isArt ? item.excerpt : item.desc;
  const link = normalizeUrl(item.link);
  
  el.innerHTML = `
    <h3 class="text-lg font-bold text-slate-800 leading-snug mb-2">${title}</h3>
    <p class="text-sm text-slate-600 mb-4 line-clamp-3 flex-grow">${body||""}</p>
    ${link ? `<a href="${link}" target="_blank" class="text-sm font-bold ${isArt?'text-fig-success':'text-fig-primary'} mt-auto flex items-center gap-1">
      ${currentLang==='en'?'Read More':'Selengkapnya'} <i data-lucide="arrow-right" class="w-4 h-4"></i>
    </a>` : ""}
  `;
  return el;
}

async function renderContent() {
  const pWrap = $("#wrapPengumuman"); const aWrap = $("#artikelList");
  if(pWrap) {
    const data = await loadCsv(getCsvUrl("pengumuman"));
    pWrap.innerHTML = "";
    if(!data.length) $("#boardEmpty")?.classList.remove("hidden");
    else { $("#boardEmpty")?.classList.add("hidden"); data.forEach(x => pWrap.appendChild(createCard(x, false))); }
  }
  if(aWrap) {
    const data = await loadCsv(getCsvUrl("artikel"));
    // Simpan data global untuk search
    window.allArticles = data; 
    filterArtikel("");
  }
  window.lucide?.createIcons?.();
}

function filterArtikel(q) {
  const list = $("#artikelList"); if(!list) return;
  const data = (window.allArticles||[]).filter(a => (a.title||"").toLowerCase().includes(q) || (a.tag||"").toLowerCase().includes(q));
  list.innerHTML = "";
  if(!data.length) $("#artikelEmpty")?.classList.remove("hidden");
  else { $("#artikelEmpty")?.classList.add("hidden"); data.forEach(x => list.appendChild(createCard(x, true))); }
  window.lucide?.createIcons?.();
}

// ===== DONASI =====
function initDonasi() {
  const WA = "818013909425";
  // Animation logic helpers
  const fmt = (n, c) => new Intl.NumberFormat(currentLang==='en'?'en-US':'id-ID', {style:"currency", currency:c, maximumFractionDigits:0}).format(n);
  
  const TARGET = 42000000;
  const KEKURANGAN = 33800000;
  const TERKUMPUL = TARGET - KEKURANGAN;
  
  // Render static numbers first
  if($("#targetLabel")) $("#targetLabel").textContent = fmt(TARGET, "JPY");
  if($("#kekuranganLabel")) $("#kekuranganLabel").textContent = new Intl.NumberFormat('id-ID').format(KEKURANGAN);

  // Animation observer
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting) {
        $("#progressBar").style.width = Math.round((TERKUMPUL/TARGET)*100) + "%";
        // Simple count up effect could go here
        $("#terkumpulLabel").textContent = fmt(TERKUMPUL, "JPY");
        $("#percentLabel").textContent = Math.round((TERKUMPUL/TARGET)*100);
      }
    });
  });
  if($("#donasi")) obs.observe($("#donasi"));

  // Inputs
  $$(".quick-jpy").forEach(b => b.addEventListener("click", () => $("#inputJPY").value = b.dataset.v));
  $$(".quick-idr").forEach(b => b.addEventListener("click", () => $("#inputIDR").value = b.dataset.v));

  $("#donasiBtn")?.addEventListener("click", () => {
    const j = $("#inputJPY")?.value; const r = $("#inputIDR")?.value;
    if(!j && !r) return alert(currentLang==='en'?"Please enter amount":"Mohon masukkan nominal");
    
    const txt = `Assalamu'alaikum. ${currentLang==='en'?'I want to confirm donation':'Saya ingin konfirmasi donasi'}: ${j?j+' JPY':''} ${r?r+' IDR':''}.`;
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(txt)}`, "_blank");
  });
  
  $$("[data-copy]").forEach(b => b.addEventListener("click", () => {
    const t = $(b.dataset.copy);
    if(t) { navigator.clipboard.writeText(t.innerText); alert("Copied!"); }
  }));
}

// ===== INIT =====
function boot() {
  setLang(currentLang);
  $("#langToggle")?.addEventListener("click", () => setLang(currentLang === "id" ? "en" : "id"));
  
  renderSholat();
  renderContent();
  initCountdown();
  initDonasi();
  
  // GANTI bagian Carousel Logic di app.js dengan ini:

function initSmartCarousel() {
  const track = $("#kgTrack");
  if (!track) return;

  let interval;
  const cardWidth = track.firstElementChild ? track.firstElementChild.offsetWidth + 16 : 300; // Lebar kartu + gap
  const speed = 3000; // Kecepatan slide (3 detik)

  const startSlide = () => {
    clearInterval(interval);
    interval = setInterval(() => {
      // Cek apakah sudah mentok kanan
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
        // Jika mentok, kembali ke awal dengan smooth
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        // Jika belum, geser ke kanan
        track.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, speed);
  };

  const stopSlide = () => clearInterval(interval);

  // Jalankan otomatis saat load
  startSlide();

  // UX Mobile: Berhenti saat disentuh jari (Touch)
  track.addEventListener("touchstart", stopSlide, { passive: true });
  track.addEventListener("touchend", startSlide, { passive: true });

  // UX Desktop: Berhenti saat kursor mouse masuk (Hover)
  track.addEventListener("mouseenter", stopSlide);
  track.addEventListener("mouseleave", startSlide);

  // Tombol Manual
  $("#kgPrev")?.addEventListener("click", () => {
    stopSlide(); // Stop dulu biar gak "berantem"
    track.scrollBy({ left: -cardWidth, behavior: "smooth" });
    startSlide(); // Jalan lagi
  });
  
  $("#kgNext")?.addEventListener("click", () => {
    stopSlide();
    track.scrollBy({ left: cardWidth, behavior: "smooth" });
    startSlide();
  });
  
  // Tombol Mobile Manual
  $("#kgPrevMob")?.addEventListener("click", () => {
    stopSlide();
    track.scrollBy({ left: -cardWidth, behavior: "smooth" });
    startSlide();
  });
  
  $("#kgNextMob")?.addEventListener("click", () => {
    stopSlide();
    track.scrollBy({ left: cardWidth, behavior: "smooth" });
    startSlide();
  });
}

// Panggil fungsi ini di dalam function boot()
// initSmartCarousel();
  
  // Tabs
  $("#tabPengumuman")?.addEventListener("click", () => {
    $("#wrapPengumuman").classList.remove("hidden"); $("#wrapArtikel").classList.add("hidden");
    $("#tabs").classList.remove("tab-right"); $("#tabs").classList.add("tab-left");
  });
  $("#tabArtikel")?.addEventListener("click", () => {
    $("#wrapPengumuman").classList.add("hidden"); $("#wrapArtikel").classList.remove("hidden");
    $("#tabs").classList.add("tab-right"); $("#tabs").classList.remove("tab-left");
  });
  
  $("#searchArtikel")?.addEventListener("input", (e) => filterArtikel(e.target.value.toLowerCase()));

  // Year
  if($("#year")) $("#year").textContent = new Date().getFullYear();
  
  // Reveal anim
  const obs = new IntersectionObserver(es => es.forEach(e => {if(e.isIntersecting) e.target.classList.add("active")}), {threshold:0.1});
  $$(".reveal").forEach(e => obs.observe(e));
  
  window.lucide?.createIcons?.();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
