// app.js (ES Module)

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];

function normalizeUrl(u) {
  if (!u) return "";
  const s = String(u).trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  return "https://" + s;
}

// CSV parser (mendukung koma di dalam tanda kutip)
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

async function loadFromCsv(url) {
  if (!url) return null;
  try {
    const txt = await fetch(url, { cache: "no-store" }).then((r) => r.text());
    const data = parseCSV(txt);
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

export const fmtJPY = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }).format(Number(n || 0));

export const fmtIDR = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(n || 0));

// =====================
// DEFAULT (global) CSV URLs (untuk semua pengguna)
// =====================
export const DEFAULT_KAJIAN_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=0&single=true&output=csv";

export const DEFAULT_PENGUMUMAN_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=991747005&single=true&output=csv";

export const DEFAULT_ARTIKEL_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=1625529193&single=true&output=csv";

// opsional (kosong = fitur Kegiatan Terdekat otomatis nonaktif)
export const DEFAULT_KEGIATAN_TERDEKAT_CSV = "";

// =====================
// Admin gate (Data button khusus admin)
// =====================
export const Admin = (function () {
  const KEY = "is_admin";
  const CODE = "as-sunnah-2025";

  function isAdmin() {
    return localStorage.getItem(KEY) === "1";
  }

  function reveal() {
    $$(".admin-only").forEach((el) => el.classList.remove("hidden"));
  }

  function setup() {
    if (isAdmin()) reveal();

    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "a") {
        const code = prompt("Masukkan kode admin:");
        if (code === CODE) {
          localStorage.setItem(KEY, "1");
          reveal();
          alert("Admin mode aktif.");
        } else if (code) {
          alert("Kode salah.");
        }
      }
    });
  }

  return { isAdmin, setup };
})();

// =====================
// Config store (override hanya untuk admin; default tetap global)
// =====================
export const Config = (function () {
  const keys = {
    kajian: "sheet_kajian",
    kegiatan: "sheet_kegiatan",
    pengumuman: "sheet_pengumuman",
    artikel: "sheet_artikel",
  };

  function getUrl(kind) {
    const v = (localStorage.getItem(keys[kind]) || "").trim();
    if (v) return v;

    if (kind === "kajian") return DEFAULT_KAJIAN_CSV;
    if (kind === "pengumuman") return DEFAULT_PENGUMUMAN_CSV;
    if (kind === "artikel") return DEFAULT_ARTIKEL_CSV;
    if (kind === "kegiatan") return DEFAULT_KEGIATAN_TERDEKAT_CSV;
    return "";
  }

  function setUrl(kind, url) {
    const k = keys[kind];
    const v = (url || "").trim();
    if (!k) return;
    if (v) localStorage.setItem(k, v);
    else localStorage.removeItem(k);
  }

  return { getUrl, setUrl };
})();

export const AdminDataModal = (function () {
  function open() {
    if (!Admin.isAdmin()) return;
    const m = $("#dataModal");
    if (!m) return;

    const setVal = (id, kind) => {
      const el = $(id);
      if (!el) return;
      el.value = Config.getUrl(kind) || "";
    };

    setVal("#csvKajian", "kajian");
    setVal("#csvKegiatan", "kegiatan");
    setVal("#csvPengumuman", "pengumuman");
    setVal("#csvArtikel", "artikel");

    m.classList.remove("hidden");
    m.classList.add("flex");
  }

  function close() {
    const m = $("#dataModal");
    if (!m) return;
    m.classList.add("hidden");
    m.classList.remove("flex");
  }

  function init() {
    $("#openData")?.addEventListener("click", (e) => { e.preventDefault(); open(); });
    $("#closeData")?.addEventListener("click", close);

    $("#dataModal")?.addEventListener("click", (e) => {
      if (e.target && e.target.id === "dataModal") close();
    });

    $("#saveData")?.addEventListener("click", () => {
      if (!Admin.isAdmin()) return;

      const v = (id) => ($(id)?.value || "").trim();
      if ($("#csvKajian")) Config.setUrl("kajian", v("#csvKajian"));
      if ($("#csvKegiatan")) Config.setUrl("kegiatan", v("#csvKegiatan"));
      if ($("#csvPengumuman")) Config.setUrl("pengumuman", v("#csvPengumuman"));
      if ($("#csvArtikel")) Config.setUrl("artikel", v("#csvArtikel"));

      close();
      try { KajianLatestModule.init(); } catch {}
      try { KegiatanTerdekatModule.init(); } catch {}
      try { PengumumanModule.init(); } catch {}
      try { ArtikelModule.init(); } catch {}
    });
  }

  return { init };
})();

// =====================
// Sholat (lokasi pengguna)
// =====================
export const SholatWidget = (function () {
  async function getLoc() {
    return new Promise((res, rej) => {
      if (!navigator.geolocation) return rej(new Error("no geolocation"));
      navigator.geolocation.getCurrentPosition(
        (p) => res({ lat: p.coords.latitude, lon: p.coords.longitude }),
        (e) => rej(e),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  async function times(lat, lon) {
    const url = `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`;
    const j = await fetch(url, { cache: "no-store" }).then((r) => r.json());
    return j?.data?.timings || null;
  }

  function tile(icon, label, value) {
    const d = document.createElement("div");
    d.className = "rounded-2xl border border-slate-200 bg-white p-4 text-center";
    d.innerHTML = `
      <i data-lucide="${icon}" class="w-5 h-5 mx-auto text-sky-600 mb-2"></i>
      <div class="text-xs text-slate-500">${label}</div>
      <div class="text-lg font-bold text-slate-900">${value || "—"}</div>
    `;
    return d;
  }

  async function render() {
    const grid = $("#sholatGrid");
    const btn = $("#refreshSholat");
    const locLabel = $("#locLabel");
    if (!grid) return;

    btn?.classList.add("animate-spin");
    grid.innerHTML = "";

    try {
      const loc = await getLoc();
      if (locLabel) locLabel.textContent = "Lokasi terdeteksi.";

      const t = await times(loc.lat, loc.lon);
      grid.innerHTML = "";
      [
        ["sunrise", "Subuh", t?.Fajr],
        ["sun", "Syuruq", t?.Sunrise],
        ["clock", "Dzuhur", t?.Dhuhr],
        ["cloud-sun", "Ashar", t?.Asr],
        ["moon", "Maghrib", t?.Maghrib],
        ["star", "Isya", t?.Isha],
      ].forEach(([ic, label, val]) => grid.appendChild(tile(ic, label, val)));

      window.lucide?.createIcons?.();
    } catch {
      if (locLabel) locLabel.textContent = "";
      grid.innerHTML = '<p class="col-span-6 text-center text-red-600">Gagal memuat jadwal sholat.</p>';
    }

    btn?.classList.remove("animate-spin");
  }

  function init() {
    if (!$("#sholatGrid")) return;
    $("#refreshSholat")?.addEventListener("click", render);
    render();
  }

  return { init };
})();

// =====================
// Kajian Terbaru (CSV)
// =====================
export const KajianLatestModule = (function () {
  function toDateTime(tanggal, waktu) {
    if (!tanggal) return null;
    const w = waktu || "00:00";
    const d = new Date(`${tanggal}T${w}:00`);
    return isNaN(d.getTime()) ? null : d;
  }

  function card(r) {
    const el = document.createElement("article");
    el.className = "rounded-2xl border border-slate-200 bg-white p-5 shadow";

    const when = [r.tanggal || r.date || "", r.waktu || r.time || ""].filter(Boolean).join(" • ");
    const judul = r.judul || r.title || "";
    const pemateri = r.pemateri || "";
    const platform = r.platform || "";
    const link = normalizeUrl(r.link || r.url || "");
    const poster = normalizeUrl(r.poster || "");

    el.innerHTML = `
      ${poster ? `<img src="${poster}" alt="" class="w-full h-40 object-cover rounded-xl mb-4" loading="lazy">` : ""}
      <div class="text-xs text-slate-500">${when}</div>
      <h3 class="mt-1 font-bold text-slate-900">${judul}</h3>
      <p class="mt-2 text-sm text-slate-700">${[pemateri, platform].filter(Boolean).join(" • ")}</p>
      ${link ? `<a href="${link}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 mt-4 text-sky-700 hover:underline text-sm">
        <i data-lucide="external-link" class="w-4 h-4"></i> Link Kajian
      </a>` : ""}
    `;
    return el;
  }

  async function init() {
    const wrap = $("#kajianLatest");
    const empty = $("#kajianEmpty");
    if (!wrap) return;

    const url = Config.getUrl("kajian");
    const rows = (await loadFromCsv(url)) || [];

    const now = new Date();
    const data = rows
      .filter((r) => (r.status || "").toLowerCase() !== "nonaktif")
      .map((r) => ({ ...r, _dt: toDateTime(r.tanggal || r.date, r.waktu || r.time) }))
      .sort((a, b) => (a._dt?.getTime() || 0) - (b._dt?.getTime() || 0))
      .filter((r) => !r._dt || r._dt >= new Date(now.getTime() - 24 * 60 * 60 * 1000))
      .slice(0, 6);

    wrap.innerHTML = "";
    if (!data.length) {
      empty?.classList.remove("hidden");
      return;
    }
    empty?.classList.add("hidden");

    data.forEach((r) => wrap.appendChild(card(r)));
    window.lucide?.createIcons?.();
  }

  return { init };
})();

// =====================
// Kegiatan Terdekat (CSV opsional)
// =====================
export const KegiatanTerdekatModule = (function () {
  function toDT(r) {
    const t = r.tanggal || r.date || "";
    const w = r.waktu || r.time || "00:00";
    const d = new Date(`${t}T${w}:00`);
    return isNaN(d.getTime()) ? null : d;
  }

  async function init() {
    const box = $("#kegiatanTerdekatBox");
    const list = $("#kegiatanTerdekat");
    if (!box || !list) return;

    const url = Config.getUrl("kegiatan");
    if (!url) { box.classList.add("hidden"); return; }

    const rows = (await loadFromCsv(url)) || [];
    const now = new Date();

    const data = rows
      .filter((r) => (r.status || "").toLowerCase() !== "nonaktif")
      .map((r) => ({ ...r, _dt: toDT(r) }))
      .filter((r) => r._dt && r._dt >= now)
      .sort((a, b) => a._dt.getTime() - b._dt.getTime())
      .slice(0, 5);

    list.innerHTML = "";
    if (!data.length) { box.classList.add("hidden"); return; }
    box.classList.remove("hidden");

    data.forEach((r) => {
      const li = document.createElement("div");
      li.className = "rounded-xl border border-slate-200 bg-white p-4";
      const when = `${r.tanggal || ""} • ${r.waktu || ""}`.trim();
      const link = normalizeUrl(r.link || r.url || "");
      li.innerHTML = `
        <div class="text-xs text-slate-500">${when}</div>
        <div class="mt-1 font-semibold text-slate-900">${r.judul || ""}</div>
        <div class="mt-1 text-sm text-slate-700">${[r.pemateri, r.lokasi].filter(Boolean).join(" • ")}</div>
        ${link ? `<a href="${link}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 mt-3 text-sky-700 hover:underline text-sm">
          <i data-lucide="external-link" class="w-4 h-4"></i> Detail
        </a>` : ""}
      `;
      list.appendChild(li);
    });

    window.lucide?.createIcons?.();
  }

  return { init };
})();

// =====================
// Pengumuman (CSV)
// =====================
export const PengumumanModule = (function () {
  function card(r) {
    const el = document.createElement("article");
    el.className = "rounded-2xl border border-slate-200 bg-white p-5 shadow";

    const date = r.date || r.tanggal || "";
    const title = r.title || r.judul || "";
    const desc = r.desc || r.deskripsi || r.isi || "";
    const link = normalizeUrl(r.link || r.url || "");

    el.innerHTML = `
      <div class="flex items-start justify-between gap-3">
        <h3 class="font-bold text-slate-900">${title}</h3>
        <span class="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">${date}</span>
      </div>
      <p class="mt-2 text-sm text-slate-700">${desc}</p>
      ${link ? `<a href="${link}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 mt-3 text-sky-700 hover:underline text-sm">
        <i data-lucide="external-link" class="w-4 h-4"></i> Selengkapnya
      </a>` : ""}
    `;
    return el;
  }

  async function init() {
    const wrap = $("#board") || $("#wrapPengumuman");
    const empty = $("#boardEmpty");
    if (!wrap) return;

    const url = Config.getUrl("pengumuman");
    const rows = (await loadFromCsv(url)) || [];

    wrap.innerHTML = "";
    if (!rows.length) {
      empty?.classList.remove("hidden");
      return;
    }
    empty?.classList.add("hidden");

    rows.forEach((x) => wrap.appendChild(card(x)));
    window.lucide?.createIcons?.();
  }

  return { init };
})();

// =====================
// Artikel (CSV)
// =====================
export const ArtikelModule = (function () {
  let CACHE = [];

  function card(a) {
    const el = document.createElement("article");
    el.className = "rounded-2xl border border-slate-200 bg-white p-5 shadow";

    const title = a.title || a.judul || "";
    const excerpt = a.excerpt || a.ringkasan || a.desc || "";
    const tag = a.tag || a.kategori || "";
    const link = normalizeUrl(a.link || a.url || "");

    const badges = String(tag)
      .split("|")
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => `<span class="text-xs px-2 py-1 rounded-full bg-slate-100">${t}</span>`)
      .join("");

    el.innerHTML = `
      <h3 class="font-bold text-slate-900">${title}</h3>
      <p class="mt-2 text-sm text-slate-700">${excerpt}</p>
      <div class="mt-3 flex flex-wrap gap-2">${badges}</div>
      ${link ? `<a href="${link}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 mt-4 text-emerald-700 hover:underline text-sm">
        <i data-lucide="book-open" class="w-4 h-4"></i> Baca
      </a>` : ""}
    `;
    return el;
  }

  function renderList(q = "", listId = "#artikelList", emptyId = "#artikelEmpty") {
    const list = $(listId);
    const empty = $(emptyId);
    if (!list) return;

    const s = (q || "").toLowerCase().trim();
    const data = CACHE.filter((a) => {
      const t = (a.title || a.judul || "").toLowerCase();
      const e = (a.excerpt || a.ringkasan || a.desc || "").toLowerCase();
      const g = (a.tag || a.kategori || "").toLowerCase();
      return !s || t.includes(s) || e.includes(s) || g.includes(s);
    });

    list.innerHTML = "";
    if (!data.length) {
      empty?.classList.remove("hidden");
      return;
    }
    empty?.classList.add("hidden");

    data.forEach((a) => list.appendChild(card(a)));
    window.lucide?.createIcons?.();
  }

  async function init() {
    const isArtikelPage = !!$("#artikelList");
    const isIndexWrap = !!$("#wrapArtikelList");

    if (!isArtikelPage && !isIndexWrap) return;

    const url = Config.getUrl("artikel");
    CACHE = (await loadFromCsv(url)) || [];

    if (isArtikelPage) {
      renderList($("#searchArtikel")?.value || "", "#artikelList", "#artikelEmpty");
      $("#searchArtikel")?.addEventListener("input", (e) => renderList(e.target.value, "#artikelList", "#artikelEmpty"));
    }

    if (isIndexWrap) {
      renderList($("#searchArtikel")?.value || "", "#wrapArtikelList", "#artikelEmpty");
      $("#searchArtikel")?.addEventListener("input", (e) => renderList(e.target.value, "#wrapArtikelList", "#artikelEmpty"));
    }
  }

  return { init };
})();

// =====================
// Tabs Info (index)
// =====================
export const InfoTabs = (function () {
  function init() {
    const tabs = $("#tabs");
    const tabP = $("#tabPengumuman");
    const tabA = $("#tabArtikel");
    const wrapP = $("#wrapPengumuman");
    const wrapA = $("#wrapArtikel");
    if (!tabs || !tabP || !tabA || !wrapP || !wrapA) return;

    const showP = () => {
      wrapP.classList.remove("hidden");
      wrapA.classList.add("hidden");
      tabs.classList.add("tab-left");
      tabs.classList.remove("tab-right");
    };

    const showA = () => {
      wrapP.classList.add("hidden");
      wrapA.classList.remove("hidden");
      tabs.classList.remove("tab-left");
      tabs.classList.add("tab-right");
    };

    tabP.addEventListener("click", showP);
    tabA.addEventListener("click", showA);
  }

  return { init };
})();

// =====================
// Donasi (angka sesuai permintaan)
// =====================
export const DonasiModule = (function () {
  const TARGET = 42000000;
  const KEKURANGAN = 33800000;
  const TERKUMPUL = TARGET - KEKURANGAN; // 8,200,000
  const WA_NUMBER = "818013909425";

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function progress() {
    if (!$("#progressBar")) return;

    $("#terkumpulLabel").textContent = fmtJPY(TERKUMPUL);
    $("#targetLabel").textContent = fmtJPY(TARGET);

    const p = clamp(Math.round((TERKUMPUL / TARGET) * 100), 0, 100);
    $("#percentLabel").textContent = String(p);

    const bar = $("#progressBar");
    bar.style.width = "0%";
    requestAnimationFrame(() => setTimeout(() => (bar.style.width = p + "%"), 50));
  }

  function nominal() {
    const j = $("#inputJPY");
    const r = $("#inputIDR");
    const btn = $("#donasiBtn");
    if (!j || !r || !btn) return;

    $$(".quick-jpy").forEach((b) => b.addEventListener("click", () => (j.value = b.dataset.v || "")));
    $$(".quick-idr").forEach((b) => b.addEventListener("click", () => (r.value = b.dataset.v || "")));

    btn.addEventListener("click", () => {
      const vj = Number(j.value) || 0;
      const vr = Number(r.value) || 0;
      if (vj < 1000 && vr < 10000) { alert("Minimal 1.000 JPY atau 10.000 IDR."); return; }

      const msg = encodeURIComponent(
        `Assalamu'alaikum, saya ingin donasi sebesar ${vj > 0 ? fmtJPY(vj) : fmtIDR(vr)} untuk Masjid As-Sunnah Hekinan.`
      );
      window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
    });
  }

  function copy() {
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

  function init() {
    progress();
    nominal();
    copy();
  }

  return { init };
})();

// =====================
// Carousel Galeri (kegiatan.html & index)
// =====================
export const KegiatanCarousel = (function () {
  function init() {
    const track = $("#kgTrack");
    if (!track) return;

    const prevs = [$("#kgPrev"), $("#kgPrevMob")].filter(Boolean);
    const nexts = [$("#kgNext"), $("#kgNextMob")].filter(Boolean);

    const page = () => track.clientWidth;
    const go = (d) => track.scrollBy({ left: d * page(), behavior: "smooth" });

    prevs.forEach((b) => b.addEventListener("click", () => go(-1)));
    nexts.forEach((b) => b.addEventListener("click", () => go(1)));

    let t = setInterval(() => go(1), 6000);
    track.addEventListener("mouseenter", () => clearInterval(t));
    track.addEventListener("mouseleave", () => (t = setInterval(() => go(1), 6000)));
  }

  return { init };
})();

// =====================
// Boot
// =====================
export function boot() {
  if ($("#year")) $("#year").textContent = String(new Date().getFullYear());
  window.lucide?.createIcons?.();

  Admin.setup();
  AdminDataModal.init();

  SholatWidget.init();
  KajianLatestModule.init();
  KegiatanTerdekatModule.init();
  KegiatanCarousel.init();

  InfoTabs.init();
  PengumumanModule.init();
  ArtikelModule.init();

  DonasiModule.init();
}
