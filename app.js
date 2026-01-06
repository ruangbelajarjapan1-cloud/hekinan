// =====================
// Utils
// =====================
export const $  = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const fmtJPY = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }).format(Number(n || 0));

// =====================
// DEFAULT CSV (PERMANEN) - tanpa perlu admin
// =====================
export const DEFAULT_KAJIAN_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=0&single=true&output=csv";

export const DEFAULT_PENGUMUMAN_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=991747005&single=true&output=csv";

export const DEFAULT_ARTIKEL_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=1625529193&single=true&output=csv";

// (Opsional) kalau nanti Anda mau agenda kegiatan terdekat dari Sheet juga:
export const DEFAULT_KEGIATAN_CSV = ""; // isi jika sudah punya tab kegiatan & publish CSV

// =====================
// CSV Parser (lebih aman: mendukung koma dalam tanda kutip)
// =====================
function parseCSV(text) {
  const rows = [];
  let i = 0;
  let cur = "";
  let row = [];
  let inQ = false;

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

async function loadFromCsv(url) {
  if (!url) return null;
  try {
    const txt = await fetch(url, { cache: "no-store" }).then((r) => r.text());
    const data = parseCSV(txt);
    return data;
  } catch {
    return null;
  }
}

function normalizeUrl(u) {
  if (!u) return "";
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  return "https://" + u;
}

// =====================
// Sholat (GPS user) - Aladhan API
// =====================
export const SholatWidget = (function () {
  async function times(lat, lon) {
    const url = `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=3`;
    const j = await fetch(url, { cache: "no-store" }).then((r) => r.json());
    return j?.data?.timings || null;
  }

  function tile(icon, label, value) {
    const d = document.createElement("div");
    d.className = "rounded-[16px] border border-slate-200 bg-white p-4 text-center";
    d.innerHTML = `
      <div class="flex items-center justify-center gap-2 text-slate-600 text-sm">
        <i data-lucide="${icon}" class="w-4 h-4"></i>
        <span>${label}</span>
      </div>
      <div class="mt-2 text-xl font-extrabold text-slate-900">${value || "-"}</div>
    `;
    return d;
  }

  async function render() {
    const grid = $("#sholatGrid");
    const btn = $("#refreshSholat");
    if (!grid) return;

    btn?.classList.add("animate-spin");

    try {
      const loc = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (p) => resolve({ lat: p.coords.latitude, lon: p.coords.longitude }),
          (err) => reject(err),
          { enableHighAccuracy: true, timeout: 10000 }
        );
      });

      const t = await times(loc.lat, loc.lon);
      if (!t) throw new Error("no timings");

      grid.innerHTML = "";
      [
        ["Fajr", "moon", "Subuh"],
        ["Sunrise", "sun", "Syuruq"],
        ["Dhuhr", "sunrise", "Dzuhur"],
        ["Asr", "cloud-sun", "Ashar"],
        ["Maghrib", "sunset", "Maghrib"],
        ["Isha", "moon-star", "Isya"],
      ].forEach(([k, ic, l]) => grid.appendChild(tile(ic, l, t[k])));

      window.lucide?.createIcons?.();
    } catch {
      grid.innerHTML =
        '<p class="col-span-6 text-center text-red-600">Gagal memuat jadwal. Izinkan lokasi (GPS) lalu coba lagi.</p>';
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
// Pengumuman (selalu pakai CSV permanen)
// =====================
export const PengumumanModule = (function () {
  const FALLBACK = [
    { title: "Contoh Pengumuman", date: "2026-01-01", desc: "Isi via Google Sheet.", link: "#" },
  ];
  let CACHE = [];

  function normalize(r) {
    return {
      title: r.title || r.judul || "",
      date: r.date || r.tanggal || "",
      desc: r.desc || r.deskripsi || r.isi || "",
      link: r.link || r.url || "",
    };
  }

  function card(p) {
    const el = document.createElement("article");
    el.className = "rounded-2xl border border-slate-200 bg-white p-5 shadow";
    el.innerHTML = `
      <div class="flex items-start justify-between gap-3">
        <h3 class="font-extrabold text-slate-900">${p.title || "Pengumuman"}</h3>
        <span class="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">${p.date || ""}</span>
      </div>
      <p class="text-sm text-slate-600 mt-3">${p.desc || ""}</p>
      ${
        p.link
          ? `<a href="${normalizeUrl(p.link)}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-sky-700 hover:text-sky-800">
            <i data-lucide="external-link" class="w-4 h-4"></i> Selengkapnya
          </a>`
          : ""
      }
    `;
    return el;
  }

  function render(targetId, emptyId) {
    const wrap = $(targetId);
    const empty = $(emptyId);
    if (!wrap) return;

    wrap.innerHTML = "";
    if (!CACHE.length) {
      empty?.classList.remove("hidden");
      return;
    }
    empty?.classList.add("hidden");

    CACHE.forEach((p) => wrap.appendChild(card(p)));
    window.lucide?.createIcons?.();
  }

  async function init() {
    const isPengPage = !!$("#board"); // pengumuman.html
    const isIndex = !!$("#wrapPengumuman"); // index.html

    if (!isPengPage && !isIndex) return;

    const rows = (await loadFromCsv(DEFAULT_PENGUMUMAN_CSV)) || null;
    CACHE = (rows && rows.length ? rows : FALLBACK).map(normalize);

    if (isPengPage) render("#board", "#boardEmpty");
    if (isIndex) render("#wrapPengumuman", "#boardEmpty");
  }

  return { init };
})();

// =====================
// Artikel (selalu pakai CSV permanen)
// =====================
export const ArtikelModule = (function () {
  const FALLBACK = [{ title: "Contoh Artikel", tag: "info", excerpt: "Isi via Google Sheet.", link: "#" }];
  let CACHE = [];

  function normalize(r) {
    return {
      title: r.title || r.judul || "",
      tag: r.tag || r.kategori || "",
      excerpt: r.excerpt || r.ringkasan || r.desc || "",
      link: r.link || r.url || "#",
    };
  }

  function card(a) {
    const badges = (a.tag || "")
      .split("|")
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => `<span class="text-xs px-2 py-1 rounded-full bg-slate-100">${t}</span>`)
      .join("");

    const el = document.createElement("article");
    el.className = "rounded-2xl border border-slate-200 bg-white p-5 shadow";
    el.innerHTML = `
      <h3 class="font-extrabold text-slate-900">${a.title || "Artikel"}</h3>
      <div class="mt-2 flex flex-wrap gap-2">${badges}</div>
      <p class="text-sm text-slate-600 mt-3">${a.excerpt || ""}</p>
      <a href="${normalizeUrl(a.link)}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-sky-700 hover:text-sky-800">
        <i data-lucide="external-link" class="w-4 h-4"></i> Baca
      </a>
    `;
    return el;
  }

  function renderList(q = "") {
    const list = $("#artikelList");
    const empty = $("#artikelEmpty");
    if (!list) return;

    const s = (q || "").toLowerCase().trim();
    const data = CACHE.filter((a) => {
      const tags = (a.tag || "").toLowerCase();
      return (
        !s ||
        (a.title || "").toLowerCase().includes(s) ||
        (a.excerpt || "").toLowerCase().includes(s) ||
        tags.includes(s)
      );
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
    const isPage = !!$("#artikelList"); // artikel.html
    const isIndex = !!$("#wrapArtikel"); // index.html versi tab
    if (!isPage && !isIndex) return;

    const rows = (await loadFromCsv(DEFAULT_ARTIKEL_CSV)) || null;
    CACHE = (rows && rows.length ? rows : FALLBACK).map(normalize);

    if (isPage) {
      $("#searchArtikel")?.addEventListener("input", (e) => renderList(e.target.value));
      renderList($("#searchArtikel")?.value || "");
    }

    // Jika index Anda punya wrapper lain untuk artikel, sesuaikan ID-nya di HTML Anda.
    if (isIndex) {
      // Jika index Anda memakai #artikelList juga, renderList sudah cukup.
      // Kalau index punya container berbeda, boleh Anda minta saya sesuaikan setelah kirim index.html terbaru.
      $("#searchArtikel")?.addEventListener("input", (e) => renderList(e.target.value));
      renderList("");
    }
  }

  return { init };
})();

// =====================
// Donasi (TARGET JPY 42,000,000; KEKURANGAN JPY 33,800,000)
// =====================
export const DonasiModule = (function () {
  const TARGET = 42000000;
  const KEKURANGAN = 33800000;
  const TERKUMPUL = TARGET - KEKURANGAN; // 8,200,000 (konsisten)

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function setProgress() {
    const bar = $("#progressBar");
    const percentLabel = $("#percentLabel");
    const terkumpulLabel = $("#terkumpulLabel");
    const targetLabel = $("#targetLabel");
    const kurangLabel = $("#kurangLabel"); // kalau ada di HTML

    if (!bar || !percentLabel || !terkumpulLabel || !targetLabel) return;

    const pct = clamp(Math.round((TERKUMPUL / TARGET) * 100), 0, 100);

    bar.style.width = pct + "%";
    percentLabel.textContent = String(pct);
    terkumpulLabel.textContent = fmtJPY(TERKUMPUL);
    targetLabel.textContent = fmtJPY(TARGET);

    if (kurangLabel) kurangLabel.textContent = fmtJPY(KEKURANGAN);
  }

  function init() {
    if (!$("#progressBar")) return;
    setProgress();
  }

  return { init };
})();

// =====================
// Boot
// =====================
export function boot() {
  if (document.getElementById("year")) $("#year").textContent = String(new Date().getFullYear());
  window.lucide?.createIcons?.();

  SholatWidget.init();
  PengumumanModule.init();
  ArtikelModule.init();
  DonasiModule.init();
}
