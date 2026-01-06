// app.js (ES Module) — jangan pakai <script> di dalam file ini

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const DEFAULT_KAJIAN_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=0&single=true&output=csv";

const DEFAULT_PENGUMUMAN_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=991747005&single=true&output=csv";

const DEFAULT_ARTIKEL_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=1625529193&single=true&output=csv";

// ===== Admin gate (Data hanya muncul kalau: ?admin=1 DAN sudah login admin) =====
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

// ===== CSV parser (aman untuk koma dalam tanda kutip) =====
function parseCSV(text) {
  const rows = [];
  let i = 0,
    cur = "",
    row = [],
    inQ = false;

  while (i < text.length) {
    const c = text[i];

    if (c === '"') {
      if (inQ && text[i + 1] === '"') {
        cur += '"';
        i += 2;
        continue;
      }
      inQ = !inQ;
      i++;
      continue;
    }

    if (!inQ && c === ",") {
      row.push(cur);
      cur = "";
      i++;
      continue;
    }

    if (!inQ && (c === "\n" || c === "\r")) {
      if (cur !== "" || row.length) {
        row.push(cur);
        rows.push(row);
        row = [];
        cur = "";
      }
      if (c === "\r" && text[i + 1] === "\n") i++;
      i++;
      continue;
    }

    cur += c;
    i++;
  }

  if (cur !== "" || row.length) {
    row.push(cur);
    rows.push(row);
  }

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
  } catch {
    return [];
  }
}

function normalizeUrl(u) {
  if (!u) return "";
  const s = String(u).trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  return "https://" + s;
}

function getCsvUrl(kind) {
  // override hanya berlaku untuk admin (agar user umum tidak “ikut” setingan lokal)
  const fromLs = isAdmin() ? (localStorage.getItem(`sheet_${kind}`) || "").trim() : "";
  if (fromLs) return fromLs;

  if (kind === "kajian") return DEFAULT_KAJIAN_CSV;
  if (kind === "pengumuman") return DEFAULT_PENGUMUMAN_CSV;
  if (kind === "artikel") return DEFAULT_ARTIKEL_CSV;
  return "";
}

// ===== Modal Data (kalau ada di halaman) =====
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

  modal.addEventListener("click", (e) => {
    if (e.target && e.target.id === "dataModal") close();
  });

  saveBtn?.addEventListener("click", () => {
    if (!isAdmin()) return;

    const v = (id) => ($(id)?.value || "").trim();

    if ($("#csvKajian")) {
      const x = v("#csvKajian");
      x ? localStorage.setItem("sheet_kajian", x) : localStorage.removeItem("sheet_kajian");
    }

    if ($("#csvPengumuman")) {
      const x = v("#csvPengumuman");
      x ? localStorage.setItem("sheet_pengumuman", x) : localStorage.removeItem("sheet_pengumuman");
    }

    if ($("#csvArtikel")) {
      const x = v("#csvArtikel");
      x ? localStorage.setItem("sheet_artikel", x) : localStorage.removeItem("sheet_artikel");
    }

    close();

    renderPengumuman();
    renderArtikel();
    renderKajianLatest();
  });
}

// ===== Jadwal Sholat =====
const FALLBACK = { lat: 34.884, lon: 136.993 };

async function getTimes(lat, lon) {
  const j = await fetch(
    `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`,
    { cache: "no-store" }
  ).then((r) => r.json());
  return j?.data?.timings || null;
}

function tile(label, time, ic) {
  const d = document.createElement("div");
  d.className =
    "rounded-[20px] border border-slate-200 p-4 text-center bg-white";
  d.innerHTML = `
    <i data-lucide="${ic}" class="w-5 h-5 mx-auto text-fig-primary mb-2"></i>
    <div class="text-xs text-slate-500">${label}</div>
    <div class="mt-1 text-xl font-bold">${time || "—"}</div>
  `;
  return d;
}

async function renderSholat() {
  const grid = $("#sholatGrid");
  const lab = $("#locLabel");
  if (!grid) return;

  grid.innerHTML = `<p class="col-span-6 text-center text-slate-500">Memuat...</p>`;

  let pos = null;
  try {
    pos = await new Promise((res) =>
      navigator.geolocation.getCurrentPosition(
        (p) => res({ lat: p.coords.latitude, lon: p.coords.longitude }),
        () => res(null),
        { enableHighAccuracy: true, timeout: 7000 }
      )
    );
  } catch {}

  pos = pos || FALLBACK;
  if (lab) lab.textContent = `Lokasi: (${pos.lat.toFixed(3)}, ${pos.lon.toFixed(3)})`;

  try {
    const t = await getTimes(pos.lat, pos.lon);
    grid.innerHTML = "";

    const map = {
      Fajr: ["Subuh", "sunrise"],
      Sunrise: ["Syuruq", "sun"],
      Dhuhr: ["Dzuhur", "clock"],
      Asr: ["Ashar", "cloud-sun"],
      Maghrib: ["Maghrib", "moon"],
      Isha: ["Isya", "star"],
    };

    Object.keys(map).forEach((k) => {
      grid.appendChild(tile(map[k][0], t?.[k], map[k][1]));
    });

    window.lucide?.createIcons?.();
  } catch {
    grid.innerHTML = `<p class="col-span-6 text-center text-red-600">Gagal memuat jadwal. Coba Perbarui.</p>`;
  }
}

// ===== Carousel Kegiatan =====
function initKegiatanCarousel() {
  const track = $("#kgTrack");
  if (!track) return;

  const prevs = [$("#kgPrev"), $("#kgPrevMob")].filter(Boolean);
  const nexts = [$("#kgNext"), $("#kgNextMob")].filter(Boolean);

  const page = () => track.clientWidth;
  const go = (d) => track.scrollBy({ left: d * page(), behavior: "smooth" });

  prevs.forEach((b) => b.addEventListener("click", () => go(-1)));
  nexts.forEach((b) => b.addEventListener("click", () => go(1)));

  let timer = setInterval(() => go(1), 6000);
  track.addEventListener("mouseenter", () => clearInterval(timer));
  track.addEventListener("mouseleave", () => (timer = setInterval(() => go(1), 6000)));
}

// ===== Pengumuman =====
function pengCard({ title, date, desc, link }) {
  const el = document.createElement("article");
  el.className = "rounded-[20px] border border-slate-200 bg-white p-5 shadow-soft card";
  const d = date ? new Date(date) : null;
  const disp =
    d && !isNaN(d)
      ? d.toLocaleDateString("id-ID", { weekday: "short", year: "numeric", month: "short", day: "numeric" })
      : "";

  const href = normalizeUrl(link);

  el.innerHTML = `
    <div class="text-xs text-slate-500">${disp}</div>
    <h3 class="mt-1 font-bold">${title || ""}</h3>
    <p class="mt-2 text-sm text-slate-700">${desc || ""}</p>
    ${
      href
        ? `<a href="${href}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 mt-3 text-fig-primary hover:underline text-sm">
            <i data-lucide="arrow-right"></i> Detail
          </a>`
        : ""
    }
  `;
  return el;
}

async function renderPengumuman() {
  const wrapIndex = $("#wrapPengumuman");
  const wrapPage = $("#board");
  const empty = $("#boardEmpty");
  const wrap = wrapIndex || wrapPage;
  if (!wrap) return;

  const url = getCsvUrl("pengumuman");
  const data = await loadCsv(url);

  wrap.innerHTML = "";
  if (!data.length) {
    empty?.classList.remove("hidden");
  } else {
    empty?.classList.add("hidden");
    data.forEach((x) => wrap.appendChild(pengCard(x)));
  }

  window.lucide?.createIcons?.();
}

// ===== Artikel =====
function artCard({ title, excerpt, link, tag }) {
  const el = document.createElement("article");
  el.className = "rounded-[20px] border border-slate-200 bg-white p-5 shadow-soft card";

  const badges = String(tag || "")
    .split("|")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => `<span class="text-xs px-2 py-1 rounded-full bg-slate-100">${t}</span>`)
    .join("");

  const href = normalizeUrl(link);

  el.innerHTML = `
    <h3 class="font-bold">${title || ""}</h3>
    <p class="mt-2 text-sm text-slate-700">${excerpt || ""}</p>
    <div class="mt-3 flex flex-wrap gap-2">${badges}</div>
    ${
      href
        ? `<a href="${href}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 mt-3 text-fig-success hover:underline text-sm">
            <i data-lucide="book-open"></i> Baca
          </a>`
        : ""
    }
  `;
  return el;
}

async function renderArtikel() {
  const listIndex = $("#artikelList");       // index.html
  const listPage = $("#artikelList");        // artikel.html (id sama)
  const list = listIndex || listPage;
  const empty = $("#artikelEmpty");
  if (!list) return;

  const url = getCsvUrl("artikel");
  const all = await loadCsv(url);

  const input = $("#searchArtikel");
  const query = (input?.value || "").toLowerCase().trim();

  const data = all.filter((a) => {
    if (!query) return true;
    const t = (a.title || "").toLowerCase();
    const e = (a.excerpt || "").toLowerCase();
    const g = (a.tag || "").toLowerCase();
    return t.includes(query) || e.includes(query) || g.includes(query);
  });

  list.innerHTML = "";
  if (!data.length) {
    empty?.classList.remove("hidden");
  } else {
    empty?.classList.add("hidden");
    data.forEach((x) => list.appendChild(artCard(x)));
  }

  window.lucide?.createIcons?.();
}

// ===== Tab switch (index) =====
function initTabs() {
  const tabP = $("#tabPengumuman");
  const tabA = $("#tabArtikel");
  const wrapP = $("#wrapPengumuman");
  const wrapA = $("#wrapArtikel");
  const tabs = $("#tabs");
  if (!tabP || !tabA || !wrapP || !wrapA || !tabs) return;

  tabP.addEventListener("click", () => {
    wrapP.classList.remove("hidden");
    wrapA.classList.add("hidden");
    tabs.classList.add("tab-left");
    tabs.classList.remove("tab-right");
  });

  tabA.addEventListener("click", () => {
    wrapP.classList.add("hidden");
    wrapA.classList.remove("hidden");
    tabs.classList.remove("tab-left");
    tabs.classList.add("tab-right");
  });
}

// ===== Kajian Terbaru (kalau ada elemen kajianLatest) =====
async function renderKajianLatest() {
  const wrap = $("#kajianLatest");
  const empty = $("#kajianEmpty");
  if (!wrap) return;

  const url = getCsvUrl("kajian");
  const rows = await loadCsv(url);

  wrap.innerHTML = "";
  if (!rows.length) {
    empty?.classList.remove("hidden");
    return;
  }
  empty?.classList.add("hidden");

  rows
    .filter((r) => String(r.status || "").toLowerCase() !== "nonaktif")
    .slice(0, 6)
    .forEach((r) => {
      const el = document.createElement("article");
      el.className = "rounded-[20px] border border-slate-200 bg-white p-5 shadow-soft card";

      const when = [r.tanggal || "", r.waktu || ""].filter(Boolean).join(" • ");
      const href = normalizeUrl(r.link || "");

      el.innerHTML = `
        <div class="text-xs text-slate-500">${when}</div>
        <h3 class="mt-1 font-bold">${r.judul || ""}</h3>
        <p class="mt-2 text-sm text-slate-700">${[r.pemateri, r.platform].filter(Boolean).join(" • ")}</p>
        ${
          href
            ? `<a href="${href}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 mt-3 text-fig-primary hover:underline text-sm">
                <i data-lucide="external-link"></i> Link Kajian
              </a>`
            : ""
        }
      `;
      wrap.appendChild(el);
    });

  window.lucide?.createIcons?.();
}

// ===== Donasi =====
function fmtJPY(n) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }).format(Number(n || 0));
}
function fmtIDR(n) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(n || 0));
}

function initDonasi() {
  const targetEl = $("#targetLabel");
  const terkumpulEl = $("#terkumpulLabel");
  const percentEl = $("#percentLabel");
  const bar = $("#progressBar");
  if (!targetEl || !terkumpulEl || !percentEl || !bar) return;

  const TARGET = 42000000;     // JPY
  const KEKURANGAN = 33800000; // JPY
  const TERKUMPUL = TARGET - KEKURANGAN; // 8,200,000

  targetEl.textContent = fmtJPY(TARGET);
  terkumpulEl.textContent = fmtJPY(TERKUMPUL);

  const p = Math.min(100, Math.round((TERKUMPUL / TARGET) * 100));
  percentEl.textContent = String(p);

  bar.style.width = "0%";
  requestAnimationFrame(() => setTimeout(() => (bar.style.width = p + "%"), 40));

  const WA_NUMBER = "818013909425";

  $$(".quick-jpy").forEach((b) => b.addEventListener("click", () => ($("#inputJPY").value = b.dataset.v || "")));
  $$(".quick-idr").forEach((b) => b.addEventListener("click", () => ($("#inputIDR").value = b.dataset.v || "")));

  $("#donasiBtn")?.addEventListener("click", () => {
    const j = Number($("#inputJPY")?.value || 0);
    const r = Number($("#inputIDR")?.value || 0);
    if (j < 1000 && r < 10000) {
      alert("Minimal 1.000 JPY atau 10.000 IDR.");
      return;
    }
    const msg = encodeURIComponent(
      `Assalamu'alaikum, saya ingin donasi sebesar ${j > 0 ? fmtJPY(j) : fmtIDR(r)} untuk Masjid As-Sunnah Hekinan.`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  });

  $$("[data-copy]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const sel = btn.getAttribute("data-copy");
      const t = sel ? document.querySelector(sel) : null;
      if (!t) return;
      navigator.clipboard.writeText(String(t.textContent).trim());
      const o = btn.textContent;
      btn.textContent = "Disalin!";
      setTimeout(() => (btn.textContent = o), 1100);
    })
  );
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
  renderKajianLatest();

  $("#searchArtikel")?.addEventListener("input", renderArtikel);

  initDonasi();
}

boot();
