// app.js (ES Module)

// ========== Utils ==========
export const $  = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];

export const fmtJPY = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }).format(Number(n || 0));

export const fmtIDR = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(n || 0));

function normalizeUrl(u) {
  if (!u) return "";
  const s = String(u).trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  return "https://" + s;
}

// CSV parser yang mendukung koma di dalam tanda kutip ("...")
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
    return parseCSV(txt);
  } catch {
    return null;
  }
}

async function loadFromJson(url) {
  try {
    return await fetch(url, { cache: "no-store" }).then((r) => r.json());
  } catch {
    return null;
  }
}

// ========== Admin Gate ==========
export const Admin = (function () {
  const KEY = "is_admin";
  const CODE = "as-sunnah-2025";

  function isAdmin() {
    return localStorage.getItem(KEY) === "1" || new URLSearchParams(location.search).get("admin") === "1";
  }

  function revealButtons() {
    $$(".admin-only").forEach((el) => el.classList.remove("hidden"));
  }

  function setup() {
    if (isAdmin()) revealButtons();

    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "a") {
        const code = prompt("Masukkan kode admin:");
        if (code === CODE) {
          localStorage.setItem(KEY, "1");
          revealButtons();
          alert("Admin mode aktif.");
        } else if (code) {
          alert("Kode salah.");
        }
      }
    });
  }

  return { isAdmin, setup, revealButtons };
})();

// ========== Data Store ==========
export const DataStore = (function () {
  const cfg = {
    kajian:     { sheetKey: "sheet_kajian",     json: "kajian.json" },
    kegiatan:   { sheetKey: "sheet_kegiatan",   json: "kegiatan.json" }, // opsional
    pengumuman: { sheetKey: "sheet_pengumuman", json: "pengumuman.json" },
    artikel:    { sheetKey: "sheet_artikel",    json: "artikel.json" },
  };

  function sheetUrl(key) {
    return localStorage.getItem(key) || "";
  }

  function saveSheet(key, url) {
    const v = (url || "").trim();
    if (v) localStorage.setItem(key, v);
    else localStorage.removeItem(key);
  }

  async function get(kind, fallback = []) {
    const c = cfg[kind];
    const csvUrl = sheetUrl(c.sheetKey);

    const csv = await loadFromCsv(csvUrl);
    if (csv && csv.length) return csv;

    const j = await loadFromJson(c.json);
    if (j && j.length) return j;

    return fallback;
  }

  return { cfg, saveSheet, get, sheetUrl };
})();

// ========== Modal Data (Admin Only) ==========
export const AdminDataModal = (function () {
  function open() {
    const m = $("#dataModal");
    if (!m) return;

    const setVal = (id, key) => {
      const el = $(id);
      if (!el) return;
      el.value = DataStore.sheetUrl(key);
    };

    setVal("#csvKajian", "sheet_kajian");
    setVal("#csvKegiatan", "sheet_kegiatan");
    setVal("#csvPengumuman", "sheet_pengumuman");
    setVal("#csvArtikel", "sheet_artikel");

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
    const openBtn = $("#openData");
    const closeBtn = $("#closeData");
    const saveBtn = $("#saveData");

    if (openBtn) openBtn.addEventListener("click", (e) => { e.preventDefault(); open(); });
    if (closeBtn) closeBtn.addEventListener("click", close);

    $("#dataModal")?.addEventListener("click", (e) => { if (e.target && e.target.id === "dataModal") close(); });

    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        const getVal = (id) => ($(id)?.value || "").trim();

        if ($("#csvKajian")) DataStore.saveSheet("sheet_kajian", getVal("#csvKajian"));
        if ($("#csvKegiatan")) DataStore.saveSheet("sheet_kegiatan", getVal("#csvKegiatan"));
        if ($("#csvPengumuman")) DataStore.saveSheet("sheet_pengumuman", getVal("#csvPengumuman"));
        if ($("#csvArtikel")) DataStore.saveSheet("sheet_artikel", getVal("#csvArtikel"));

        close();
        try { KajianLatestModule.init(); } catch {}
        try { KegiatanTerdekatModule.init(); } catch {}
        try { PengumumanModule.init(); } catch {}
        try { ArtikelModule.init(); } catch {}
      });
    }
  }

  return { init, open, close };
})();

// ========== SholatWidget ==========
export const SholatWidget = (function () {
  async function getLoc() {
    return new Promise((res) => {
      if (!navigator.geolocation) return res(null);
      navigator.geolocation.getCurrentPosition(
        (p) => res({ lat: p.coords.latitude, lon: p.coords.longitude }),
        () => res(null),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  async function times(lat, lon) {
    const j = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`, { cache: "no-store" }).then((r) => r.json());
    return j.data?.timings || null;
  }

  function tile(ic, label, val) {
    const d = document.createElement("div");
    d.className = "rounded-2xl border border-slate-200 bg-white p-4 text-center";
    d.innerHTML = `
      <i data-lucide="${ic}" class="w-5 h-5 mx-auto text-sky-600 mb-2"></i>
      <div class="text-xs text-slate-500">${label}</div>
      <div class="text-lg font-bold text-slate-900">${val || "—"}</div>
    `;
    return d;
  }

  async function render() {
    const grid = $("#sholatGrid");
    const btn = $("#refreshSholat");
    const lab = $("#locLabel");
    if (!grid) return;

    btn?.classList.add("animate-spin");
    grid.innerHTML = '<p class="col-span-6 text-center text-slate-500">Memuat...</p>';

    const loc = (await getLoc()) || { lat: 34.884, lon: 136.993 };
    if (lab) lab.textContent = `Lokasi: (${loc.lat.toFixed(3)}, ${loc.lon.toFixed(3)})`;

    try {
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
      grid.innerHTML = '<p class="col-span-6 text-center text-red-600">Gagal memuat jadwal.</p>';
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

// ========== Kajian Terbaru (Index) ==========
export const KajianLatestModule = (function () {
  const SAMPLE = [
    { tanggal: "2026-01-10", waktu: "19:30", judul: "Tafsir Surat Al-Mulk", pemateri: "Ustadz Fulan", platform: "YouTube", link: "#", status: "aktif" },
  ];

  function toDateTimeISO(tanggal, waktu) {
    if (!tanggal) return null;
    const w = waktu || "00:00";
    const iso = `${tanggal}T${w}:00`;
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
  }

  function card(r) {
    const el = document.createElement("article");
    el.className = "rounded-2xl border border-slate-200 bg-white p-5 shadow";
    const when = [r.tanggal || r.date || "", r.waktu || ""].filter(Boolean).join(" • ");

    const poster = r.poster ? normalizeUrl(r.poster) : "";
    const link = normalizeUrl(r.link || "");

    el.innerHTML = `
      ${poster ? `<img src="${poster}" alt="" class="w-full h-40 object-cover rounded-xl mb-4" loading="lazy">` : ""}
      <div class="text-xs text-slate-500">${when}</div>
      <h3 class="mt-1 font-bold text-slate-900">${r.judul || r.title || "Kajian"}</h3>
      <p class="mt-2 text-sm text-slate-700">${[r.pemateri, r.platform].filter(Boolean).join(" • ")}</p>
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

    const rows = await DataStore.get("kajian", SAMPLE);

    const now = new Date();
    const data = (rows || [])
      .filter((r) => (r.status || "").toLowerCase() !== "nonaktif")
      .map((r) => ({ ...r, _dt: toDateTimeISO(r.tanggal || r.date, r.waktu || r.time) }))
      .filter((r) => !r._dt || r._dt >= new Date(now.getTime() - 60 * 60 * 1000))
      .sort((a, b) => (a._dt?.getTime() || 0) - (b._dt?.getTime() || 0))
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

// ========== Kegiatan Terdekat (Index) - opsional ==========
export const KegiatanTerdekatModule = (function () {
  async function init() {
    const box = $("#kegiatanTerdekatBox");
    const list = $("#kegiatanTerdekat");
    if (!box || !list) return;

    const url = DataStore.sheetUrl("sheet_kegiatan");
    if (!url) {
      box.classList.add("hidden");
      return;
    }

    const rows = (await DataStore.get("kegiatan", [])) || [];
    const now = new Date();

    function toDT(r) {
      const t = r.tanggal || r.date || "";
      const w = r.waktu || r.time || "00:00";
      const d = new Date(`${t}T${w}:00`);
      return isNaN(d.getTime()) ? null : d;
    }

    const data = rows
      .filter((r) => (r.status || "").toLowerCase() !== "nonaktif")
      .map((r) => ({ ...r, _dt: toDT(r) }))
      .filter((r) => r._dt && r._dt >= now)
      .sort((a, b) => a._dt.getTime() - b._dt.getTime())
      .slice(0, 5);

    list.innerHTML = "";
    if (!data.length) {
      box.classList.add("hidden");
      return;
    }
    box.classList.remove("hidden");

    data.forEach((r) => {
      const li = document.createElement("div");
      li.className = "rounded-xl border border-slate-200 bg-white p-4";
      const when = `${r.tanggal || ""} • ${r.waktu || ""}`.trim();
      const link = normalizeUrl(r.link || "");
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

// ========== Pengumuman ==========
export const PengumumanModule = (function () {
  const SAMPLE = [{ title: "Contoh Pengumuman", date: "2026-01-01", desc: "Isi via Google Sheet.", link: "#" }];

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

    const data = await DataStore.get("pengumuman", SAMPLE);

    wrap.innerHTML = "";
    if (!data.length) {
      empty?.classList.remove("hidden");
      return;
    }
    empty?.classList.add("hidden");

    data.forEach((x) => wrap.appendChild(card(x)));
    window.lucide?.createIcons?.();
  }

  return { init };
})();

// ========== Artikel ==========
export const ArtikelModule = (function () {
  const SAMPLE = [{ title: "Contoh Artikel", tag: "info", excerpt: "Isi via Google Sheet.", link: "#" }];
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

  function render(q = "") {
    const list = $("#artikelList");
    const empty = $("#artikelEmpty");
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
    if (!$("#artikelList") && !$("#wrapArtikel")) return;

    CACHE = await DataStore.get("artikel", SAMPLE);

    if ($("#artikelList")) {
      render($("#searchArtikel")?.value || "");
      $("#searchArtikel")?.addEventListener("input", (e) => render(e.target.value));
    }

    if ($("#wrapArtikel") && !$("#artikelList")) {
      const list = $("#wrapArtikelList");
      const empty = $("#artikelEmpty");
      if (!list) return;

      const s = $("#searchArtikel")?.value || "";
      const data = CACHE.filter((a) => {
        const q = (s || "").toLowerCase().trim();
        const t = (a.title || a.judul || "").toLowerCase();
        const e = (a.excerpt || a.ringkasan || a.desc || "").toLowerCase();
        const g = (a.tag || a.kategori || "").toLowerCase();
        return !q || t.includes(q) || e.includes(q) || g.includes(q);
      });

      list.innerHTML = "";
      if (!data.length) empty?.classList.remove("hidden");
      else empty?.classList.add("hidden");

      data.forEach((a) => list.appendChild(card(a)));
      window.lucide?.createIcons?.();

      $("#searchArtikel")?.addEventListener("input", () => init());
    }
  }

  return { init };
})();

// ========== Info Tabs (Index) ==========
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

// ========== Donasi ==========
export const DonasiModule = (function () {
  const TARGET = 42000000;   // JPY
  const TERKUMPUL = 5290797; // JPY
  const WA_NUMBER = "818013909425";

  function progress() {
    if (!$("#progressBar")) return;

    $("#terkumpulLabel").textContent = fmtJPY(TERKUMPUL);
    $("#targetLabel").textContent = fmtJPY(TARGET);

    const p = Math.min(100, Math.round((TERKUMPUL / TARGET) * 100));
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
      if (vj < 1000 && vr < 10000) { alert('Minimal 1.000 JPY atau 10.000 IDR.'); return; }

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
        btn.textContent = 'Disalin!';
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

// ========== Galeri Kegiatan (kegiatan.html) ==========
export const KegiatanModule = (function () {
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

// ========== Bootstrap ==========
export function boot() {
  if (document.getElementById("year")) $("#year").textContent = String(new Date().getFullYear());
  window.lucide?.createIcons?.();

  Admin.setup();
  AdminDataModal.init();

  SholatWidget.init();
  KajianLatestModule.init();
  KegiatanModule.init();
  KegiatanTerdekatModule.init();

  InfoTabs.init();
  PengumumanModule.init();
  ArtikelModule.init();

  DonasiModule.init();
}
