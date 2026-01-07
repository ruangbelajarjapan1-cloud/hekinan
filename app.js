// app.js (ES Module)

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// ===== KONFIGURASI =====
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzLMb1wIdcq4YZWw7wbFJGlI2su_Yyti1DoUHPzRBMDZyMmsB98cQKfpV9z9DH9RwuGmA/exec";

const DEFAULT_KAJIAN_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=0&single=true&output=csv";
const DEFAULT_PENGUMUMAN_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=991747005&single=true&output=csv";
const DEFAULT_ARTIKEL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=1625529193&single=true&output=csv";

// ===== DATA BULAN HIJRIAH (ID) =====
const HIJRI_MONTHS_ID = [
  "Muharram", "Shafar", "Rabiul Awal", "Rabiul Akhir",
  "Jumadil Awal", "Jumadil Akhir", "Rajab", "Sya'ban",
  "Ramadhan", "Syawal", "Dzulqa'dah", "Dzulhijjah"
];

// ===== HERO SLIDER =====
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

// ===== BAHASA =====
const TRANSLATIONS = {
  id: {
    nav_sholat: "Jadwal Sholat", nav_kegiatan: "Kegiatan", nav_info: "Info", nav_donasi: "Donasi",
    hero_title_1: "Merajut Ukhuwah,", hero_title_2: "Membangun Peradaban.",
    hero_desc: "Pusat kegiatan ibadah, pendidikan anak, dan silaturahmi masyarakat muslim di Aichi, Jepang.",
    hero_btn_wakaf: "Ikut Wakaf", hero_btn_sholat: "Jadwal Sholat",
    hadith_label: "Mutiara Hadits",
    sholat_title: "Jadwal Sholat",
    gallery_title: "Galeri & Video", gallery_desc: "Dokumentasi otomatis dari Google Drive.",
    tab_announcement: "Pengumuman", tab_article: "Artikel & Faedah",
    empty_data: "Belum ada data terbaru.", empty_search: "Tidak ditemukan.",
    donasi_badge: "Peluang Amal Jariyah", donasi_title: "Investasi Kekal Akhirat",
    deadline_label: "Batas Waktu Wakaf (Tahap 1)",
    progress_title: "Progres Pembangunan", collected: "Terkumpul", needed: "Kekurangan",
    confirm_title: "Konfirmasi Donasi", confirm_desc: "Masukkan nominal yang telah ditransfer.",
    or: "ATAU", btn_confirm: "Konfirmasi WA", footer_links: "Tautan", footer_follow: "Lokasi"
  },
  en: {
    nav_sholat: "Prayer Times", nav_kegiatan: "Gallery", nav_info: "Info", nav_donasi: "Donate",
    hero_title_1: "Weaving Brotherhood,", hero_title_2: "Building Civilization.",
    hero_desc: "A center for worship, education, and gathering for the Muslim community in Aichi, Japan.",
    hero_btn_wakaf: "Donate Now", hero_btn_sholat: "Prayer Times",
    hadith_label: "Daily Hadith",
    sholat_title: "Prayer Times",
    gallery_title: "Gallery & Video", gallery_desc: "Automated feed from Google Drive.",
    tab_announcement: "Announcements", tab_article: "Articles",
    empty_data: "No updates.", empty_search: "Not found.",
    donasi_badge: "Charity Opportunity", donasi_title: "Invest for Hereafter",
    deadline_label: "Donation Deadline",
    progress_title: "Construction Progress", collected: "Collected", needed: "Remaining",
    confirm_title: "Confirm Donation", confirm_desc: "Enter transferred amount.",
    or: "OR", btn_confirm: "Confirm via WA", footer_links: "Links", footer_follow: "Location"
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

// ===== SMART CAROUSEL (GALERI DRIVE FIX) =====
async function initSmartCarousel() {
  const track = $("#kgTrack"); if (!track) return;
  track.innerHTML = `<div class="flex items-center justify-center w-full h-64 text-slate-400 gap-2"><i data-lucide="loader" class="animate-spin"></i> Memuat Galeri...</div>`;
  window.lucide?.createIcons?.();

  let driveItems = [];
  try {
    if(APPS_SCRIPT_URL.includes("exec")) {
      const res = await fetch(APPS_SCRIPT_URL);
      driveItems = await res.json();
    }
  } catch (e) { console.error("Drive Error:", e); }

  track.innerHTML = "";
  if (!driveItems || driveItems.length === 0) {
    track.innerHTML = `<div class="w-full text-center text-slate-400 py-10 text-sm">Galeri kosong atau Loading...</div>`;
  } else {
    driveItems.forEach(item => {
      const isVideo = item.mime.includes("video");
      const el = document.createElement("figure");
      el.className = "snap-item shrink-0 w-[85%] sm:w-[60%] md:w-[40%] lg:w-[30%] h-64 rounded-2xl overflow-hidden shadow-md bg-white relative group border border-slate-100";
      
      if (isVideo) {
        // VIDEO: Tetap pakai Iframe Preview (Sudah OK)
        el.innerHTML = `
          <iframe src="${item.videoUrl}" class="w-full h-full" allow="autoplay" style="border:none;" loading="lazy"></iframe>
          <div class="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-md flex items-center gap-1"><i data-lucide="video" class="w-3 h-3"></i> Video</div>
        `;
      } else {
        // GAMBAR: FIX MENGGUNAKAN DIRECT LINK BY ID
        // Kita abaikan item.src dan pakai item.id
        const directLink = `https://drive.google.com/uc?export=view&id=${item.id}`;
        
        el.innerHTML = `
          <img src="${directLink}" 
               referrerpolicy="no-referrer" 
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
               loading="lazy" 
               alt="${item.name}"
               onerror="this.parentElement.innerHTML='<div class=\\'flex flex-col items-center justify-center h-full text-slate-400 text-xs gap-1\\'><i data-lucide=\\'image-off\\' class=\\'w-6 h-6\\'></i>Gagal Muat</div>'; window.lucide?.createIcons?.();">
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <p class="text-white text-xs truncate">${item.name}</p>
          </div>
        `;
      }
      track.appendChild(el);
    });
  }
  window.lucide?.createIcons?.();

  // Slide Logic
  let interval; const speed = 3500;
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
  const openBtn = $("#openZakat");
  const modal = $("#zakatModal");
  const closeBtn = $("#closeZakat");
  const calcBtn = $("#calcBtn");
  if(!openBtn || !modal) return;

  let currentZakatCurr = 'JPY';
  const btnJPY = $("#currJPY"), btnIDR = $("#currIDR");
  const priceInput = $("#zGoldPrice"), labelCurr = $("#zCurrLabel");
  const linkJPY = $("#linkGoldJPY"), linkIDR = $("#linkGoldIDR");
  const DEFAULT_JPY = 14000, DEFAULT_IDR = 1400000;
  priceInput.value = DEFAULT_JPY;

  const setCurrency = (c) => {
    currentZakatCurr = c; labelCurr.textContent = c;
    const active = "flex-1 py-2 text-sm font-bold rounded-lg bg-white shadow-sm text-slate-800 transition-all border border-slate-200 ring-2 ring-sky-100";
    const inactive = "flex-1 py-2 text-sm font-bold rounded-lg text-slate-500 hover:bg-white/50 transition-all";
    if (c === 'JPY') {
      btnJPY.className = active; btnIDR.className = inactive;
      priceInput.value = DEFAULT_JPY; linkJPY.classList.remove("hidden"); linkIDR.classList.add("hidden");
    } else {
      btnIDR.className = active; btnJPY.className = inactive;
      priceInput.value = DEFAULT_IDR; linkIDR.classList.remove("hidden"); linkJPY.classList.add("hidden");
    }
    $("#zResultBox").classList.add("hidden");
  };

  btnJPY.addEventListener("click", () => setCurrency('JPY'));
  btnIDR.addEventListener("click", () => setCurrency('IDR'));
  const toggle = (show) => { modal.classList.toggle("hidden", !show); modal.classList.toggle("flex", show); };
  openBtn.addEventListener("click", () => toggle(true));
  closeBtn.addEventListener("click", () => toggle(false));
  modal.addEventListener("click", (e) => { if(e.target===modal) toggle(false); });

  calcBtn.addEventListener("click", () => {
    const goldPrice = Number(priceInput.value || 0);
    const cash = Number($("#zCash")?.value || 0), goldVal = Number($("#zGoldVal")?.value || 0);
    const assets = Number($("#zAssets")?.value || 0), debt = Number($("#zDebt")?.value || 0);
    const nisab = goldPrice * 85;
    const totalNet = (cash + goldVal + assets) - debt;
    
    const fmt = (n) => new Intl.NumberFormat('id-ID', {style:'currency', currency: currentZakatCurr, maximumFractionDigits:0}).format(n);
    $("#zTotalNet").textContent = fmt(totalNet); $("#zNisab").textContent = fmt(nisab);
    const resultBox = $("#zResultBox"), statusEl = $("#zStatus"), amountEl = $("#zFinalAmount");
    resultBox.classList.remove("hidden");

    if (totalNet >= nisab) {
      statusEl.textContent = "WAJIB ZAKAT"; statusEl.className = "font-extrabold text-lg text-emerald-600 mb-1";
      amountEl.textContent = fmt(totalNet * 0.025);
    } else {
      statusEl.textContent = "BELUM WAJIB"; statusEl.className = "font-extrabold text-lg text-slate-500 mb-1";
      amountEl.textContent = fmt(0);
    }
  });
}

// ===== UTILS =====
const HADITHS = [
  { ar: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ", id: "Sesungguhnya setiap amalan tergantung pada niatnya.", en: "Actions are but by intentions." },
  { ar: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ", id: "Sebaik-baik kalian adalah yang belajar Al-Qur'an dan mengajarkannya.", en: "The best of you learn Quran and teach it." }
];
function renderHadith() {
  const day = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const h = HADITHS[day % HADITHS.length];
  $("#hadithArab").textContent = h.ar; $("#hadithTerjemah").textContent = currentLang === 'en' ? h.en : h.id;
  $("#hadithRiwayat").textContent = "Hadits Shahih";
}

// ===== HIJRI DATE (API INTEGRATED) =====
let globalHijriData = null; 

function renderHijri(apiData = null) {
  const el = $("#hijriDate"); if (!el) return;
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
    el.textContent = new Intl.DateTimeFormat(loc + '-u-ca-islamic-umalqura', {day:'numeric', month:'long', year:'numeric'}).format(new Date()).replace(/ AH| H/g, " H");
  } catch (e) {
    el.textContent = new Intl.DateTimeFormat(loc + '-u-ca-islamic', {day:'numeric', month:'long', year:'numeric'}).format(new Date()).replace(/ AH| H/g, " H");
  }
}

// ===== CSV & ADMIN =====
const isAdmin = () => new URLSearchParams(location.search).get("admin") === "1" && localStorage.getItem("is_admin") === "1";
function setupAdmin(){
  if(isAdmin()) $$(".admin-only").forEach(e=>e.classList.remove("hidden"));
  document.addEventListener("keydown",e=>{ if(e.ctrlKey&&e.altKey&&e.key.toLowerCase()==='a'){ if(prompt("Kode:")==="as-sunnah-2025"){localStorage.setItem("is_admin","1"); location.reload();} }});
  $("#openData")?.addEventListener("click", (e) => { e.preventDefault(); $("#dataModal").classList.remove("hidden"); $("#dataModal").classList.add("flex"); });
  $("#closeData")?.addEventListener("click", () => { $("#dataModal").classList.add("hidden"); $("#dataModal").classList.remove("flex"); });
  $("#saveData")?.addEventListener("click", () => {
    ["kajian","pengumuman","artikel"].forEach(k => { const v = $(`#csv${k.charAt(0).toUpperCase()+k.slice(1)}`)?.value; v ? localStorage.setItem(`sheet_${k}`, v) : localStorage.removeItem(`sheet_${k}`); });
    location.reload();
  });
}
async function loadCsv(url) {
  try {
    const t = await fetch(url, {cache:"no-store"}).then(r=>r.text());
    const r=[]; let i=0,c="",row=[],q=false;
    while(i<t.length){ let char=t[i]; if(char==='"'){if(q&&t[i+1]==='"'){c+='"';i+=2;continue;}q=!q;i++;continue;} if(!q&&char===','){row.push(c);c="";i++;continue;} if(!q&&(char==='\n'||char==='\r')){if(c||row.length){row.push(c);r.push(row);row=[];c="";}if(char==='\r'&&t[i+1]==='\n')i++;i++;continue;} c+=char;i++; }
    if(c||row.length){row.push(c);r.push(row);}
    const h=r[0].map(x=>x.trim().toLowerCase());
    return r.slice(1).map(v=>{const o={};h.forEach((k,x)=>o[k]=v[x]?.trim()||"");return o;});
  } catch { return []; }
}
const getCsvUrl = (k) => isAdmin() && localStorage.getItem(`sheet_${k}`) || (k==="kajian"?DEFAULT_KAJIAN_CSV : k==="pengumuman"?DEFAULT_PENGUMUMAN_CSV : DEFAULT_ARTIKEL_CSV);

async function renderContent() {
  const mkCard = (x, isArt) => `
    <article class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:border-sky-200 flex flex-col h-full transition-all">
      <h3 class="text-lg font-bold text-slate-800 leading-snug mb-2">${x.title||""}</h3>
      <p class="text-sm text-slate-600 mb-4 line-clamp-3 flex-grow">${(isArt?x.excerpt:x.desc)||""}</p>
      ${x.link ? `<a href="${x.link}" target="_blank" class="text-sm font-bold ${isArt?'text-fig-success':'text-fig-primary'} mt-auto flex items-center gap-1">${currentLang==='en'?'Read More':'Selengkapnya'} <i data-lucide="arrow-right" class="w-4 h-4"></i></a>` : ""}
    </article>`;
  const pW = $("#wrapPengumuman"); if(pW) { const d = await loadCsv(getCsvUrl("pengumuman")); pW.innerHTML = d.length ? d.map(x=>mkCard(x,false)).join("") : ""; if(!d.length) $("#boardEmpty")?.classList.remove("hidden"); }
  const aL = $("#artikelList"); if(aL) { const d = await loadCsv(getCsvUrl("artikel")); window.allArticles = d; const filter = (q) => { const f = d.filter(x=>(x.title||"").toLowerCase().includes(q)); aL.innerHTML = f.length ? f.map(x=>mkCard(x,true)).join("") : ""; $("#artikelEmpty")?.classList.toggle("hidden", f.length > 0); window.lucide?.createIcons?.(); }; filter(""); $("#searchArtikel")?.addEventListener("input", e=>filter(e.target.value.toLowerCase())); }
}

async function renderSholat() {
  const g = $("#sholatGrid"); const l = $("#locLabel"); if(!g) return;
  g.innerHTML = `<p class="col-span-full text-center text-slate-400 py-4">...</p>`;
  let p = { lat: 34.884, lon: 136.993 }; 
  try { p = await new Promise(r => navigator.geolocation.getCurrentPosition(x=>r({lat:x.coords.latitude,lon:x.coords.longitude}),()=>r(p),{timeout:3000})); } catch{}
  if(l) l.textContent = `${p.lat.toFixed(3)}, ${p.lon.toFixed(3)}`;
  
  try {
    const d = await fetch(`https://api.aladhan.com/v1/timings?latitude=${p.lat}&longitude=${p.lon}&method=2`).then(r=>r.json());
    if (d.data && d.data.date && d.data.date.hijri) {
      renderHijri(d.data.date.hijri);
    }
    const m = { Fajr:["Subuh","sunrise"], Sunrise:["Syuruq","sun"], Dhuhr:["Dzuhur","sun"], Asr:["Ashar","cloud-sun"], Maghrib:["Maghrib","moon"], Isha:["Isya","star"] };
    g.innerHTML=""; Object.keys(m).forEach(k => {
      g.innerHTML += `<div class="rounded-2xl border border-slate-100 p-4 text-center bg-slate-50 hover:bg-white hover:border-sky-200 transition-all"><i data-lucide="${m[k][1]}" class="w-5 h-5 mx-auto text-slate-400 mb-2"></i><div class="text-[10px] uppercase font-bold text-slate-400">${m[k][0]}</div><div class="mt-1 text-lg font-extrabold text-slate-800">${d.data.timings[k]}</div></div>`;
    });
    window.lucide?.createIcons?.();
  } catch { g.innerHTML="Error"; }
}

function initDonasi() {
  const fmt = (n,c) => new Intl.NumberFormat(currentLang==='en'?'en-US':'id-ID', {style:"currency",currency:c,maximumFractionDigits:0}).format(n);
  const T = 42000000, K = 33800000, C = T-K;
  if($("#targetLabel")) $("#targetLabel").textContent = fmt(T,"JPY"); if($("#kekuranganLabel")) $("#kekuranganLabel").textContent = new Intl.NumberFormat('id-ID').format(K);
  const obs = new IntersectionObserver(e=>{ e.forEach(x=>{ if(x.isIntersecting) { $("#progressBar").style.width = Math.round((C/T)*100)+"%"; $("#terkumpulLabel").textContent = fmt(C,"JPY"); $("#percentLabel").textContent = Math.round((C/T)*100); }})});
  if($("#donasi")) obs.observe($("#donasi"));
  $$(".quick-jpy").forEach(b => b.addEventListener("click", ()=>$("#inputJPY").value=b.dataset.v));
  $$(".quick-idr").forEach(b => b.addEventListener("click", ()=>$("#inputIDR").value=b.dataset.v));
  $("#donasiBtn")?.addEventListener("click", () => window.open(`https://wa.me/818013909425?text=${encodeURIComponent(`Konfirmasi donasi: ${$("#inputJPY")?.value||0} JPY / ${$("#inputIDR")?.value||0} IDR`)}`,"_blank"));
  $$("[data-copy]").forEach(b => b.addEventListener("click", () => { navigator.clipboard.writeText($(b.dataset.copy).innerText); alert("Copied!"); }));
}

function initCountdown() {
  const end = new Date("2026-05-31T23:59:59").getTime();
  setInterval(() => {
    const gap = end - new Date().getTime(); if(gap<0)return;
    $("#cdDays").innerText = Math.floor(gap/86400000); $("#cdHours").innerText = Math.floor((gap%86400000)/3600000); $("#cdMin").innerText = Math.floor((gap%3600000)/60000);
  }, 1000);
}

function boot() {
  setLang(currentLang);
  $("#langToggle")?.addEventListener("click", ()=>setLang(currentLang==="id"?"en":"id"));
  $("#langToggleMob")?.addEventListener("click", ()=>setLang(currentLang==="id"?"en":"id"));
  $("#tabPengumuman")?.addEventListener("click", () => { $("#wrapPengumuman").classList.remove("hidden"); $("#wrapArtikel").classList.add("hidden"); $("#tabs").classList.replace("tab-right","tab-left"); });
  $("#tabArtikel")?.addEventListener("click", () => { $("#wrapPengumuman").classList.add("hidden"); $("#wrapArtikel").classList.remove("hidden"); $("#tabs").classList.replace("tab-left","tab-right"); });
  if($("#year")) $("#year").textContent = new Date().getFullYear();
  
  renderSholat(); renderContent(); initCountdown(); initDonasi(); 
  initSmartCarousel(); 
  initHeroSlider(); setupAdmin(); initZakatCalculator();
  
  const obs = new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting)x.target.classList.add("active")}),{threshold:0.1});
  $$(".reveal").forEach(e=>obs.observe(e));
  window.lucide?.createIcons?.();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
