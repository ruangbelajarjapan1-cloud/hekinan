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
  $$("[data-i18n]").forEach(el => { const key = el.getAttribute("data-i18n"); if (t[key]) el.textContent = t[key]; });
  $$("[data-placeholder]").forEach(el => { const key = el.getAttribute("data-placeholder"); if (t[key]) el.placeholder = t[key]; });
  renderHadith(); renderHijri();
}

// ===== SMART CAROUSEL (UPDATED - SLIDE CHECKED) =====
function initSmartCarousel() {
  const track = $("#kgTrack");
  if (!track) return;

  let interval;
  const speed = 3500; // Kecepatan slide ms

  // Fungsi kalkulasi lebar kartu (karena responsif, lebar bisa berubah)
  const getCardWidth = () => track.firstElementChild ? track.firstElementChild.offsetWidth + 16 : 300;

  const startSlide = () => {
    clearInterval(interval);
    interval = setInterval(() => {
      // LOGIKA: Jika posisi scroll + lebar layar >= total lebar konten (minus toleransi), berarti sudah mentok kanan
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
        track.scrollTo({ left: 0, behavior: "smooth" }); // Balik ke awal
      } else {
        track.scrollBy({ left: getCardWidth(), behavior: "smooth" }); // Geser 1 kartu
      }
    }, speed);
  };

  const stopSlide = () => clearInterval(interval);

  // Jalankan otomatis
  startSlide();

  // INTERAKSI PENGGUNA (PAUSE SAAT DISENTUH/DIHOVER)
  track.addEventListener("touchstart", stopSlide, { passive: true }); // Jari nempel -> Stop
  track.addEventListener("touchend", startSlide, { passive: true });   // Jari lepas -> Jalan lagi
  track.addEventListener("mouseenter", stopSlide); // Mouse masuk -> Stop
  track.addEventListener("mouseleave", startSlide); // Mouse keluar -> Jalan lagi

  // Tombol Manual
  const manualScroll = (dir) => {
    stopSlide();
    track.scrollBy({ left: dir * getCardWidth(), behavior: "smooth" });
    startSlide(); // Reset timer setelah klik
  };

  $("#kgPrev")?.addEventListener("click", () => manualScroll(-1));
  $("#kgNext")?.addEventListener("click", () => manualScroll(1));
  $("#kgPrevMob")?.addEventListener("click", () => manualScroll(-1));
  $("#kgNextMob")?.addEventListener("click", () => manualScroll(1));
}

// ===== HADITS & HIJRI =====
const HADITHS = [
  { ar: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ", id: "Sesungguhnya setiap amalan tergantung pada niatnya. (HR. Bukhari & Muslim)", en: "Actions are but by intentions. (Bukhari & Muslim)" },
  { ar: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ", id: "Sebaik-baik kalian adalah orang yang belajar Al-Qur'an dan mengajarkannya. (HR. Bukhari)", en: "The best of you are those who learn the Quran and teach it. (Bukhari)" },
  { ar: "الدِّينُ النَّصِيحَةُ", id: "Agama itu adalah nasihat. (HR. Muslim)", en: "The Religion is (sincere) advice. (Muslim)" },
  { ar: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ", id: "Tidak sempurna iman seseorang hingga ia mencintai saudaranya seperti mencintai dirinya sendiri. (HR. Bukhari)", en: "None of you believes until he loves for his brother what he loves for himself. (Bukhari)" }
];

function renderHadith() {
  const day = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const h = HADITHS[day % HADITHS.length];
  $("#hadithArab").textContent = h.ar;
  $("#hadithTerjemah").textContent = currentLang === 'en' ? h.en : h.id;
  $("#hadithRiwayat").textContent = "Hadits Shahih";
}

function renderHijri() {
  const el = $("#hijriDate");
  if (!el) return;
  const locale = currentLang === 'en' ? 'en-US' : 'id-ID';
  const h = new Intl.DateTimeFormat(locale + '-u-ca-islamic', {day:'numeric', month:'long', year:'numeric'}).format(new Date());
  el.textContent = h.replace(/ AH| H/g, " H");
}

// ===== COUNTDOWN =====
function initCountdown() {
  const deadline = new Date("2026-05-31T23:59:59").getTime();
  const tick = () => {
    const now = new Date().getTime();
    const gap = deadline - now;
    if (gap < 0) return;
    const d = Math.floor(gap / (86400000));
    const h = Math.floor((gap % 86400000) / 3600000);
    const m = Math.floor((gap % 3600000) / 60000);
    $("#cdDays").innerText = d < 10 ? "0" + d : d;
    $("#cdHours").innerText = h < 10 ? "0" + h : h;
    $("#cdMin").innerText = m < 10 ? "0" + m : m;
  };
  setInterval(tick, 1000); tick();
}

// ===== UTILS (Admin/CSV) =====
const isAdmin = () => new URLSearchParams(location.search).get("admin") === "1" && localStorage.getItem("is_admin") === "1";
function setupAdmin(){
  if(isAdmin()) $$(".admin-only").forEach(e=>e.classList.remove("hidden"));
  document.addEventListener("keydown",e=>{
    if(e.ctrlKey&&e.altKey&&e.key.toLowerCase()==='a'){
      if(prompt("Kode Admin:")==="as-sunnah-2025"){localStorage.setItem("is_admin","1"); location.reload();}
    }
  });
  // Modal Logic
  $("#openData")?.addEventListener("click", (e) => { e.preventDefault(); $("#dataModal").classList.remove("hidden"); $("#dataModal").classList.add("flex"); });
  $("#closeData")?.addEventListener("click", () => { $("#dataModal").classList.add("hidden"); $("#dataModal").classList.remove("flex"); });
  $("#saveData")?.addEventListener("click", () => {
    ["kajian","pengumuman","artikel"].forEach(k => {
       const v = $(`#csv${k.charAt(0).toUpperCase()+k.slice(1)}`)?.value;
       v ? localStorage.setItem(`sheet_${k}`, v) : localStorage.removeItem(`sheet_${k}`);
    });
    location.reload();
  });
}

async function loadCsv(url) {
  try {
    const t = await fetch(url, {cache:"no-store"}).then(r=>r.text());
    const r = []; let i=0,c="",row=[],q=false;
    while(i<t.length){
      let char=t[i];
      if(char==='"'){if(q&&t[i+1]==='"'){c+='"';i+=2;continue;}q=!q;i++;continue;}
      if(!q&&char===','){row.push(c);c="";i++;continue;}
      if(!q&&(char==='\n'||char==='\r')){if(c||row.length){row.push(c);r.push(row);row=[];c="";}if(char==='\r'&&t[i+1]==='\n')i++;i++;continue;}
      c+=char;i++;
    }
    if(c||row.length){row.push(c);r.push(row);}
    if(!r.length)return[];
    const h=r[0].map(x=>x.trim().toLowerCase());
    return r.slice(1).map(v=>{const o={};h.forEach((k,x)=>o[k]=v[x]?.trim()||"");return o;});
  } catch { return []; }
}
const getCsvUrl = (k) => isAdmin() && localStorage.getItem(`sheet_${k}`) || (k==="kajian"?DEFAULT_KAJIAN_CSV : k==="pengumuman"?DEFAULT_PENGUMUMAN_CSV : DEFAULT_ARTIKEL_CSV);

// ===== RENDERERS =====
async function renderSholat() {
  const g = $("#sholatGrid"); const l = $("#locLabel");
  if(!g) return;
  g.innerHTML = `<p class="col-span-full text-center text-slate-400 py-4 animate-pulse">...</p>`;
  let p = { lat: 34.884, lon: 136.993 };
  try { p = await new Promise(r => navigator.geolocation.getCurrentPosition(x=>r({lat:x.coords.latitude,lon:x.coords.longitude}),()=>r(p),{timeout:3000})); } catch{}
  if(l) l.textContent = `${p.lat.toFixed(3)}, ${p.lon.toFixed(3)}`;
  
  try {
    const d = await fetch(`https://api.aladhan.com/v1/timings?latitude=${p.lat}&longitude=${p.lon}&method=2`).then(r=>r.json());
    const t = d?.data?.timings;
    const m = { Fajr:["Subuh","sunrise"], Sunrise:["Syuruq","sun"], Dhuhr:["Dzuhur","sun"], Asr:["Ashar","cloud-sun"], Maghrib:["Maghrib","moon"], Isha:["Isya","star"] };
    g.innerHTML="";
    Object.keys(m).forEach(k => {
      g.innerHTML += `<div class="group rounded-2xl border border-slate-100 p-4 text-center bg-slate-50 hover:bg-white hover:border-sky-200 transition-all">
        <i data-lucide="${m[k][1]}" class="w-5 h-5 mx-auto text-slate-400 group-hover:text-fig-primary mb-2"></i>
        <div class="text-[10px] uppercase font-bold text-slate-400">${m[k][0]}</div>
        <div class="mt-1 text-lg font-extrabold text-slate-800">${t?.[k]||"-"}</div>
      </div>`;
    });
    window.lucide?.createIcons?.();
  } catch { g.innerHTML="<p class='text-red-500'>Error.</p>"; }
}

async function renderContent() {
  const mkCard = (x, isArt) => `
    <article class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:border-sky-200 flex flex-col h-full transition-all">
      <h3 class="text-lg font-bold text-slate-800 leading-snug mb-2">${x.title||""}</h3>
      <p class="text-sm text-slate-600 mb-4 line-clamp-3 flex-grow">${(isArt?x.excerpt:x.desc)||""}</p>
      ${x.link ? `<a href="${x.link}" target="_blank" class="text-sm font-bold ${isArt?'text-fig-success':'text-fig-primary'} mt-auto flex items-center gap-1">${currentLang==='en'?'Read More':'Selengkapnya'} <i data-lucide="arrow-right" class="w-4 h-4"></i></a>` : ""}
    </article>`;

  const pW = $("#wrapPengumuman");
  if(pW) {
    const d = await loadCsv(getCsvUrl("pengumuman"));
    pW.innerHTML = d.length ? d.map(x=>mkCard(x,false)).join("") : "";
    if(!d.length) $("#boardEmpty")?.classList.remove("hidden");
  }

  const aL = $("#artikelList");
  if(aL) {
    const d = await loadCsv(getCsvUrl("artikel"));
    window.allArticles = d;
    const filter = (q) => {
      const f = d.filter(x=>(x.title||"").toLowerCase().includes(q));
      aL.innerHTML = f.length ? f.map(x=>mkCard(x,true)).join("") : "";
      $("#artikelEmpty")?.classList.toggle("hidden", f.length > 0);
      window.lucide?.createIcons?.();
    };
    filter("");
    $("#searchArtikel")?.addEventListener("input", e=>filter(e.target.value.toLowerCase()));
  }
  window.lucide?.createIcons?.();
}

function initDonasi() {
  const fmt = (n, c) => new Intl.NumberFormat(currentLang==='en'?'en-US':'id-ID', {style:"currency",currency:c,maximumFractionDigits:0}).format(n);
  const T = 42000000, K = 33800000, C = T-K;
  
  if($("#targetLabel")) $("#targetLabel").textContent = fmt(T,"JPY");
  if($("#kekuranganLabel")) $("#kekuranganLabel").textContent = new Intl.NumberFormat('id-ID').format(K);
  
  const obs = new IntersectionObserver(e=>{ e.forEach(x=>{ if(x.isIntersecting) {
    $("#progressBar").style.width = Math.round((C/T)*100)+"%";
    $("#terkumpulLabel").textContent = fmt(C,"JPY");
    $("#percentLabel").textContent = Math.round((C/T)*100);
  }})});
  if($("#donasi")) obs.observe($("#donasi"));

  $$(".quick-jpy").forEach(b => b.addEventListener("click", ()=>$("#inputJPY").value=b.dataset.v));
  $$(".quick-idr").forEach(b => b.addEventListener("click", ()=>$("#inputIDR").value=b.dataset.v));
  $("#donasiBtn")?.addEventListener("click", () => {
    const j=$("#inputJPY")?.value, r=$("#inputIDR")?.value;
    if(!j && !r) return alert(currentLang==='en'?"Please input amount":"Mohon isi nominal");
    window.open(`https://wa.me/818013909425?text=${encodeURIComponent(`Assalamu'alaikum, confirm donasi: ${j?j+' JPY':''} ${r?r+' IDR':''}`)}`,"_blank");
  });
  $$("[data-copy]").forEach(b => b.addEventListener("click", () => { navigator.clipboard.writeText($(b.dataset.copy).innerText); alert("Copied!"); }));
}

// ===== BOOT =====
function boot() {
  setLang(currentLang);
  $("#langToggle")?.addEventListener("click", ()=>setLang(currentLang==="id"?"en":"id"));
  $("#langToggleMob")?.addEventListener("click", ()=>setLang(currentLang==="id"?"en":"id"));
  
  // Tabs Logic
  $("#tabPengumuman")?.addEventListener("click", () => { $("#wrapPengumuman").classList.remove("hidden"); $("#wrapArtikel").classList.add("hidden"); $("#tabs").classList.replace("tab-right","tab-left"); });
  $("#tabArtikel")?.addEventListener("click", () => { $("#wrapPengumuman").classList.add("hidden"); $("#wrapArtikel").classList.remove("hidden"); $("#tabs").classList.replace("tab-left","tab-right"); });

  if($("#year")) $("#year").textContent = new Date().getFullYear();
  
  renderSholat(); renderContent(); initCountdown(); initDonasi(); initSmartCarousel(); setupAdmin();
  
  // Reveal Anim
  const obs = new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting)x.target.classList.add("active")}),{threshold:0.1});
  $$(".reveal").forEach(e=>obs.observe(e));
  
  window.lucide?.createIcons?.();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
