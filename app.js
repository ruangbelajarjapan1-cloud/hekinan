// app.js (ES Module) — jangan pakai <script> di dalam file ini

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// ===== KONFIGURASI LINK GOOGLE SHEET (UPDATED) =====
const DEFAULT_KAJIAN_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=0&single=true&output=csv";

const DEFAULT_PENGUMUMAN_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=991747005&single=true&output=csv";

const DEFAULT_ARTIKEL_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=1625529193&single=true&output=csv";

// ===== Admin gate =====
const ADMIN_CODE = "as-sunnah-2025";
const ADMIN_QS = new URLSearchParams(location.search).get("admin") === "1";
const isAdmin = () => ADMIN_QS && localStorage.getItem("is_admin") === "1";

function revealAdminUI() {
  $$(".admin-only").forEach((el) => el.classList.remove("hidden"));
}

function setupAdmin() {
  if (isAdmin()) revealAdminUI();

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "a") {
      if (!ADMIN_QS) return;
      const code = prompt("Masukkan kode admin:");
      if (code === ADMIN_CODE) {
        localStorage.setItem("is_admin", "1");
        revealAdminUI();
        alert("Admin mode aktif.");
      } else if (code) {
        alert("Kode salah.");
      }
    }
  });
}

// ===== CSV parser =====
function parseCSV(text) {
  const rows = [];
  let i = 0, cur = "", row = [], inQ = false;
  while (i < text.length) {
    const c = text[i];
    if (c === '"') {
      if (inQ && text[i + 1] === '"') { cur += '"'; i += 2; continue; }
      inQ = !inQ; i++; continue;
    }
    if (!inQ && c === ",") { row.push(cur); cur = ""; i++; continue; }
    if (!inQ && (c === "\n" || c === "\r")) {
      if (cur !== "" || row.length) { row.push(cur); rows.push(row); row = []; cur = ""; }
      if (c === "\r" && text[i + 1] === "\n") i++;
      i++; continue;
    }
    cur += c; i++;
  }
  if (cur !== "" || row.length) { row.push(cur); rows.push(row); }
  if (!rows.length) return [];
  const head = rows[0].map((h) => String(h || "").trim().toLowerCase());
  return rows.slice(1).map((cols) => {
    const o = {};
    head.forEach((h, idx) => (o[h] = String(cols[idx] || "").trim()));
    return o;
  });
}

async function loadCsv(url) {
  if (!url) return [];
  try {
    const txt = await fetch(url, { cache: "no-store" }).then((r) => r.text());
    return parseCSV(txt);
  } catch { return []; }
}

function normalizeUrl(u) {
  if (!u) return "";
  const s = String(u).trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  return "https://" + s;
}

function getCsvUrl(kind) {
  const fromLs = isAdmin() ? (localStorage.getItem(`sheet_${kind}`) || "").trim() : "";
  if (fromLs) return fromLs;
  if (kind === "kajian") return DEFAULT_KAJIAN_CSV;
  if (kind === "pengumuman") return DEFAULT_PENGUMUMAN_CSV;
  if (kind === "artikel") return DEFAULT_ARTIKEL_CSV;
  return "";
}

// ===== Modal Data =====
function initDataModal() {
  const openBtn = $("#openData");
  const modal = $("#dataModal");
  const closeBtn = $("#closeData");
  const saveBtn = $("#saveData");

  if (!openBtn || !modal) return;

  const open = (e) => {
    e?.preventDefault?.();
    if (!isAdmin()) return;
    $("#csvKajian") && ($("#csvKajian").value = localStorage.getItem("sheet_kajian") || "");
    $("#csvPengumuman") && ($("#csvPengumuman").value = localStorage.getItem("sheet_pengumuman") || "");
    $("#csvArtikel") && ($("#csvArtikel").value = localStorage.getItem("sheet_artikel") || "");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  };

  const close = () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  };

  openBtn.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);
  modal.addEventListener("click", (e) => { if (e.target && e.target.id === "dataModal") close(); });

  saveBtn?.addEventListener("click", () => {
    if (!isAdmin()) return;
    const v = (id) => ($(id)?.value || "").trim();
    const setOrRem = (k, val) => val ? localStorage.setItem(k, val) : localStorage.removeItem(k);
    
    setOrRem("sheet_kajian", v("#csvKajian"));
    setOrRem("sheet_pengumuman", v("#csvPengumuman"));
    setOrRem("sheet_artikel", v("#csvArtikel"));

    close();
    renderPengumuman(); renderArtikel(); renderKajianLatest();
  });
}

// ===== Jadwal Sholat =====
const FALLBACK = { lat: 34.884, lon: 136.993 }; // Hekinan coordinates

async function getTimes(lat, lon) {
  const j = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`, { cache: "no-store" }).then((r) => r.json());
  return j?.data?.timings || null;
}

function tile(label, time, ic) {
  const d = document.createElement("div");
  d.className = "group rounded-2xl border border-slate-100 p-4 text-center bg-slate-50 hover:bg-white hover:border-sky-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300";
  d.innerHTML = `
    <i data-lucide="${ic}" class="w-5 h-5 mx-auto text-slate-400 group-hover:text-fig-primary mb-2 transition-colors"></i>
    <div class="text-[10px] uppercase font-bold text-slate-400 group-hover:text-slate-500 tracking-wider">${label}</div>
    <div class="mt-1 text-lg font-extrabold text-slate-800 group-hover:text-fig-primary transition-colors">${time || "—"}</div>
  `;
  return d;
}

async function renderSholat() {
  const grid = $("#sholatGrid");
  const lab = $("#locLabel");
  if (!grid) return;

  grid.innerHTML = `<p class="col-span-full text-center text-slate-400 py-4 animate-pulse">Memuat jadwal sholat...</p>`;

  let pos = null;
  try {
    pos = await new Promise((res) => navigator.geolocation.getCurrentPosition(
      (p) => res({ lat: p.coords.latitude, lon: p.coords.longitude }),
      () => res(null),
      { enableHighAccuracy: true, timeout: 5000 }
    ));
  } catch {}

  pos = pos || FALLBACK;
  if (lab) lab.textContent = `Lokasi: (${pos.lat.toFixed(3)}, ${pos.lon.toFixed(3)})`;

  try {
    const t = await getTimes(pos.lat, pos.lon);
    grid.innerHTML = "";
    const map = {
      Fajr: ["Subuh", "sunrise"], Sunrise: ["Syuruq", "sun"], Dhuhr: ["Dzuhur", "clock"],
      Asr: ["Ashar", "cloud-sun"], Maghrib: ["Maghrib", "moon"], Isha: ["Isya", "star"],
    };
    Object.keys(map).forEach((k) => grid.appendChild(tile(map[k][0], t?.[k], map[k][1])));
    window.lucide?.createIcons?.();
  } catch {
    grid.innerHTML = `<p class="col-span-full text-center text-red-500 text-sm">Gagal memuat jadwal. Coba Perbarui.</p>`;
  }
}

// ===== Carousel Kegiatan =====
function initKegiatanCarousel() {
  const track = $("#kgTrack");
  if (!track) return;
  const prevs = [$("#kgPrev"), $("#kgPrevMob")].filter(Boolean);
  const nexts = [$("#kgNext"), $("#kgNextMob")].filter(Boolean);
  const scrollAmt = () => track.firstElementChild ? track.firstElementChild.clientWidth + 16 : 300; // width + gap

  const go = (d) => track.scrollBy({ left: d * scrollAmt(), behavior: "smooth" });
  prevs.forEach((b) => b.addEventListener("click", () => go(-1)));
  nexts.forEach((b) => b.addEventListener("click", () => go(1)));

  // Auto scroll logic (paused on hover)
  let timer = setInterval(() => go(1), 5000);
  const resetTimer = () => { clearInterval(timer); timer = setInterval(() => go(1), 5000); };
  track.addEventListener("mouseenter", () => clearInterval(timer));
  track.addEventListener("mouseleave", resetTimer);
  track.addEventListener("touchstart", () => clearInterval(timer)); 
  track.addEventListener("touchend", resetTimer);
}

// ===== Pengumuman & Artikel =====
function pengCard({ title, date, desc, link }) {
  const el = document.createElement("article");
  el.className = "rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-sky-200 transition-all duration-300 flex flex-col h-full";
  const d = date ? new Date(date) : null;
  const disp = d && !isNaN(d) ? d.toLocaleDateString("id-ID", { weekday: "short", year: "numeric", month: "short", day: "numeric" }) : "";
  const href = normalizeUrl(link);

  el.innerHTML = `
    <div class="flex items-center gap-2 mb-2">
       <span class="w-2 h-2 rounded-full bg-fig-primary"></span>
       <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide">${disp}</span>
    </div>
    <h3 class="text-lg font-bold text-slate-800 leading-snug mb-2">${title || "Tanpa Judul"}</h3>
    <p class="text-sm text-slate-600 mb-4 line-clamp-3 flex-grow">${desc || ""}</p>
    ${href ? `<a href="${href}" target="_blank" rel="noopener" class="inline-flex items-center gap-1 text-sm font-bold text-fig-primary hover:text-sky-700 mt-auto self-start group">
      Baca Selengkapnya <i data-lucide="arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
    </a>` : ""}
  `;
  return el;
}

function artCard({ title, excerpt, link, tag }) {
  const el = document.createElement("article");
  el.className = "rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-sky-200 transition-all duration-300 flex flex-col h-full";
  const badges = String(tag || "").split("|").map((t) => t.trim()).filter(Boolean)
    .map((t) => `<span class="text-[10px] px-2 py-1 rounded-md bg-slate-50 text-slate-500 font-medium border border-slate-100">${t}</span>`).join("");
  const href = normalizeUrl(link);

  el.innerHTML = `
    <h3 class="text-lg font-bold text-slate-800 leading-snug mb-2">${title || "Tanpa Judul"}</h3>
    <div class="flex flex-wrap gap-1 mb-3">${badges}</div>
    <p class="text-sm text-slate-600 mb-4 line-clamp-3 flex-grow">${excerpt || ""}</p>
    ${href ? `<a href="${href}" target="_blank" rel="noopener" class="inline-flex items-center gap-1 text-sm font-bold text-fig-success hover:text-emerald-700 mt-auto self-start group">
      <i data-lucide="book-open" class="w-4 h-4"></i> Baca Artikel
    </a>` : ""}
  `;
  return el;
}

async function renderPengumuman() {
  const wrap = $("#wrapPengumuman"); const empty = $("#boardEmpty");
  if (!wrap) return;
  const data = await loadCsv(getCsvUrl("pengumuman"));
  wrap.innerHTML = "";
  if (!data.length) { empty?.classList.remove("hidden"); }
  else {
    empty?.classList.add("hidden");
    data.forEach((x) => wrap.appendChild(pengCard(x)));
  }
  window.lucide?.createIcons?.();
}

async function renderArtikel() {
  const list = $("#artikelList"); const empty = $("#artikelEmpty");
  if (!list) return;
  const all = await loadCsv(getCsvUrl("artikel"));
  const input = $("#searchArtikel");
  const query = (input?.value || "").toLowerCase().trim();
  const data = all.filter((a) => {
    if (!query) return true;
    return (a.title||"").toLowerCase().includes(query) || (a.excerpt||"").toLowerCase().includes(query) || (a.tag||"").toLowerCase().includes(query);
  });
  list.innerHTML = "";
  if (!data.length) { empty?.classList.remove("hidden"); }
  else {
    empty?.classList.add("hidden");
    data.forEach((x) => list.appendChild(artCard(x)));
  }
  window.lucide?.createIcons?.();
}

// ===== Tab Switch =====
function initTabs() {
  const tabP = $("#tabPengumuman"), tabA = $("#tabArtikel");
  const wrapP = $("#wrapPengumuman"), wrapA = $("#wrapArtikel");
  const tabs = $("#tabs");
  if (!tabP || !tabs) return;

  const switchTab = (isArt) => {
    if (isArt) {
      wrapP.classList.add("hidden"); wrapA.classList.remove("hidden");
      tabs.classList.remove("tab-left"); tabs.classList.add("tab-right");
      tabP.classList.remove("text-fig-primary"); tabA.classList.add("text-fig-primary");
    } else {
      wrapP.classList.remove("hidden"); wrapA.classList.add("hidden");
      tabs.classList.add("tab-left"); tabs.classList.remove("tab-right");
      tabP.classList.add("text-fig-primary"); tabA.classList.remove("text-fig-primary");
    }
  };
  tabP.addEventListener("click", () => switchTab(false));
  tabA.addEventListener("click", () => switchTab(true));
  // Default active style
  tabP.classList.add("text-fig-primary");
}

// ===== Kajian Latest (Stub for index if needed) =====
async function renderKajianLatest() {
  // Logic exists in kajian.html mostly, but if we add widget to index later, logic goes here.
  // For now, keeps generic compatibility.
}

// ===== Donasi & Animation Logic =====

// Helper: Format Currency
function fmtJPY(n) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }).format(Number(n || 0)); }
function fmtIDR(n) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(n || 0)); }

// Helper: Count Up Animation
function animateValue(obj, start, end, duration) {
  if (!obj) return;
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    // Format during animation
    obj.innerHTML = fmtJPY(Math.floor(progress * (end - start) + start)); 
    if (progress < 1) { window.requestAnimationFrame(step); }
  };
  window.requestAnimationFrame(step);
}

function initDonasi() {
  const targetEl = $("#targetLabel");
  const terkumpulEl = $("#terkumpulLabel");
  const kekuranganEl = $("#kekuranganLabel"); // New
  const percentEl = $("#percentLabel");
  const bar = $("#progressBar");
  
  if (!targetEl || !terkumpulEl) return;

  const TARGET = 42000000;
  const KEKURANGAN = 33800000;
  const TERKUMPUL = TARGET - KEKURANGAN;

  targetEl.textContent = fmtJPY(TARGET);
  // Initial static set (will be animated by observer)
  terkumpulEl.textContent = "JPY 0"; 
  if(kekuranganEl) kekuranganEl.textContent = new Intl.NumberFormat("id-ID").format(KEKURANGAN); // Just number for clarity

  // Intersection Observer for Animation
  const sectionDonasi = $("#donasi");
  let animated = false;

  const triggerAnimation = () => {
    if(animated) return;
    animated = true;
    
    // Animate Number
    animateValue(terkumpulEl, 0, TERKUMPUL, 2000);
    
    // Animate Bar
    const p = Math.min(100, Math.round((TERKUMPUL / TARGET) * 100));
    percentEl.textContent = String(p);
    bar.style.width = p + "%";
  };

  if(sectionDonasi) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) triggerAnimation();
      });
    }, { threshold: 0.3 });
    observer.observe(sectionDonasi);
  } else {
    // Fallback if section not found or other page
    triggerAnimation(); 
  }

  // Quick Buttons Logic
  $$(".quick-jpy").forEach((b) => b.addEventListener("click", () => {
    $("#inputJPY").value = b.dataset.v || "";
    $("#inputJPY").classList.add("bg-white/20");
    setTimeout(()=>$("#inputJPY").classList.remove("bg-white/20"), 200);
  }));
  
  $$(".quick-idr").forEach((b) => b.addEventListener("click", () => {
    $("#inputIDR").value = b.dataset.v || "";
    $("#inputIDR").classList.add("bg-white/20");
    setTimeout(()=>$("#inputIDR").classList.remove("bg-white/20"), 200);
  }));

  // Whatsapp Logic
  const WA_NUMBER = "818013909425";
  $("#donasiBtn")?.addEventListener("click", () => {
    const j = Number($("#inputJPY")?.value || 0);
    const r = Number($("#inputIDR")?.value || 0);
    if (j < 1000 && r < 10000) {
      alert("Mohon masukkan nominal donasi (Minimal 1.000 JPY atau 10.000 IDR).");
      return;
    }
    
    const nominal = j > 0 ? fmtJPY(j) : fmtIDR(r);
    const msg = encodeURIComponent(
      `Assalamu'alaikum, saya ingin konfirmasi donasi sebesar ${nominal} untuk Masjid As-Sunnah Hekinan. Mohon dicek. Jazaakumullahu Khairan.`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  });

  // Copy Logic
  $$("[data-copy]").forEach((btn) => btn.addEventListener("click", () => {
      const sel = btn.getAttribute("data-copy");
      const t = sel ? document.querySelector(sel) : null;
      if (!t) return;
      navigator.clipboard.writeText(String(t.textContent).trim());
      
      const originalIcon = btn.innerHTML;
      btn.innerHTML = `<i data-lucide="check" class="w-4 h-4 text-green-500"></i>`;
      setTimeout(() => (btn.innerHTML = originalIcon), 1500);
  }));
}

// ===== General Scroll Reveal Observer =====
function initScrollReveal() {
  const reveals = $$(".reveal");
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if(e.isIntersecting) e.target.classList.add("active");
    });
  }, { threshold: 0.1 });
  reveals.forEach((el) => obs.observe(el));
}

// ===== Boot =====
function boot() {
  $("#year") && ($("#year").textContent = String(new Date().getFullYear()));
  window.lucide?.createIcons?.();
  setupAdmin();
  initDataModal();
  
  $("#refreshSholat")?.addEventListener("click", renderSholat);
  renderSholat();
  
  initKegiatanCarousel();
  initTabs();
  
  renderPengumuman();
  renderArtikel();
  
  $("#searchArtikel")?.addEventListener("input", renderArtikel);
  
  initDonasi();
  initScrollReveal();
}

// Start
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
