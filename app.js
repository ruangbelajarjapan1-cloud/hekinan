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

// ===== IMPROVE: i18n helper (3 bahasa) + pilih kolom berdasarkan bahasa =====
const LANGS = ["id", "en", "ja"]; // IMPROVE
function getLang() {
  const v = (localStorage.getItem("lang") || "").trim().toLowerCase();
  return LANGS.includes(v) ? v : "id";
}

// IMPROVE: ambil field berdasarkan bahasa: base_{lang} fallback base
// contoh: title_en/title_ja, desc_en/desc_ja, judul_en/judul_ja, dsb.
function pickByLang(row, baseKey) {
  if (!row) return "";
  const lang = getLang();

  // FIX: dukung beberapa alias suffix (ja/jp) kalau suatu saat kepakai
  const suffixes =
    lang === "ja" ? ["_ja", "_jp"] : lang === "en" ? ["_en"] : ["_id"];

  for (const s of suffixes) {
    const k = (baseKey + s).toLowerCase();
    const v = String(row[k] || "").trim();
    if (v) return v;
  }

  // fallback default
  return String(row[String(baseKey).toLowerCase()] || "").trim();
}

// IMPROVE: teks kecil untuk tombol (hanya yang muncul dari JS)
const UI = {
  id: {
    loading: "Memuat...",
    loadFail: "Gagal memuat. Coba perbarui.",
    location: "Lokasi",
    detail: "Detail",
    read: "Baca",
    lectureLink: "Link Kajian",
    noData: "Belum ada data.",
    filterAll: "Semua Platform",
    hijriSuffix: "H",
    sholat: {
      Subuh: "Subuh",
      Syuruq: "Syuruq",
      Dzuhur: "Dzuhur",
      Ashar: "Ashar",
      Maghrib: "Maghrib",
      Isya: "Isya",
    },
  },
  en: {
    loading: "Loading...",
    loadFail: "Failed to load. Please refresh.",
    location: "Location",
    detail: "Details",
    read: "Read",
    lectureLink: "Lecture Link",
    noData: "No data yet.",
    filterAll: "All Platforms",
    hijriSuffix: "H",
    sholat: {
      Subuh: "Fajr",
      Syuruq: "Sunrise",
      Dzuhur: "Dhuhr",
      Ashar: "Asr",
      Maghrib: "Maghrib",
      Isya: "Isha",
    },
  },
  ja: {
    loading: "読み込み中...",
    loadFail: "読み込みに失敗しました。更新してください。",
    location: "位置",
    detail: "詳細",
    read: "読む",
    lectureLink: "講義リンク",
    noData: "データがありません。",
    filterAll: "すべて",
    hijriSuffix: "H",
    sholat: {
      Subuh: "ファジュル",
      Syuruq: "日の出",
      Dzuhur: "ズフル",
      Ashar: "アスル",
      Maghrib: "マグリブ",
      Isya: "イシャー",
    },
  },
};

function t(keyPath) {
  const lang = getLang();
  const dict = UI[lang] || UI.id;
  const parts = String(keyPath).split(".");
  let cur = dict;
  for (const p of parts) cur = cur?.[p];
  return cur ?? (keyPath.includes(".") ? "" : keyPath);
}

// ===== IMPROVE: locale formatter (tanggal & hijriah) =====
function getLocale() {
  const lang = getLang();
  return lang === "ja" ? "ja-JP" : lang === "en" ? "en-US" : "id-ID";
}

function fmtDate(d, opt) {
  try {
    return new Intl.DateTimeFormat(getLocale(), opt).format(d);
  } catch {
    return d.toLocaleDateString();
  }
}

function fmtHijri(d) {
  // IMPROVE: kalender hijriah, fallback kalau tidak didukung
  try {
    const loc = getLocale() + "-u-ca-islamic";
    return (
      new Intl.DateTimeFormat(loc, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(d) + " " + t("hijriSuffix")
    );
  } catch {
    return "";
  }
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

// ===== IMPROVE: konversi Google Drive share URL → direct view (poster lebih stabil) =====
function driveToDirect(url) {
  const u = normalizeUrl(url);
  if (!u) return "";

  // sudah direct
  if (u.includes("drive.google.com/uc?") || u.includes("googleusercontent.com")) return u;

  // file/d/FILEID/
  const m1 = u.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
  if (m1?.[1]) return `https://drive.google.com/uc?export=view&id=${m1[1]}`;

  // open?id=FILEID
  const m2 = u.match(/[?&]id=([^&]+)/i);
  if (m2?.[1] && u.includes("drive.google.com")) {
    return `https://drive.google.com/uc?export=view&id=${m2[1]}`;
  }

  return u;
}

function getCsvUrl(kind) {
  // override hanya berlaku untuk admin (agar user umum tidak “ikut” setingan lokal)
  const fromLs = isAdmin()
    ? (localStorage.getItem(`sheet_${kind}`) || "").trim()
    : "";
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

    $("#csvKajian") &&
      ($("#csvKajian").value = localStorage.getItem("sheet_kajian") || "");
    $("#csvPengumuman") &&
      ($("#csvPengumuman").value =
        localStorage.getItem("sheet_pengumuman") || "");
    $("#csvArtikel") &&
      ($("#csvArtikel").value = localStorage.getItem("sheet_artikel") || "");

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
    renderKajianList(); // IMPROVE
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
  d.className = "rounded-[20px] border border-slate-200 p-4 text-center bg-white";
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

  // FIX: teks loading mengikuti bahasa
  grid.innerHTML = `<p class="col-span-6 text-center text-slate-500">${t("loading")}</p>`;

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
  if (lab) lab.textContent = `${t("location")}: (${pos.lat.toFixed(3)}, ${pos.lon.toFixed(3)})`;

  try {
    const tim = await getTimes(pos.lat, pos.lon);
    grid.innerHTML = "";

    // FIX: label sholat menyesuaikan bahasa, ikon tetap non-living
    const map = {
      Fajr: [t("sholat.Subuh"), "sunrise"],
      Sunrise: [t("sholat.Syuruq"), "sun"],
      Dhuhr: [t("sholat.Dzuhur"), "clock"],
      Asr: [t("sholat.Ashar"), "cloud-sun"],
      Maghrib: [t("sholat.Maghrib"), "moon"],
      Isha: [t("sholat.Isya"), "star"],
    };

    Object.keys(map).forEach((k) => {
      grid.appendChild(tile(map[k][0], tim?.[k], map[k][1]));
    });

    window.lucide?.createIcons?.();
  } catch {
    grid.innerHTML = `<p class="col-span-6 text-center text-red-600">${t("loadFail")}</p>`;
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
function pengCard(row) {
  // FIX: dukung multi-bahasa dari sheet (title_en/title_ja, desc_en/desc_ja)
  const title = pickByLang(row, "title");
  const desc = pickByLang(row, "desc");
  const date = row?.date || "";

  const el = document.createElement("article");
  el.className = "rounded-[20px] border border-slate-200 bg-white p-5 shadow-soft card";

  const d = date ? new Date(date) : null;
  const disp =
    d && !isNaN(d)
      ? fmtDate(d, { weekday: "short", year: "numeric", month: "short", day: "numeric" }) // FIX: locale sesuai bahasa
      : "";

  const href = normalizeUrl(row?.link || "");

  el.innerHTML = `
    <div class="text-xs text-slate-500">${disp}</div>
    <h3 class="mt-1 font-bold">${title || ""}</h3>
    <p class="mt-2 text-sm text-slate-700">${desc || ""}</p>
    ${
      href
        ? `<a href="${href}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 mt-3 text-fig-primary hover:underline text-sm">
            <i data-lucide="arrow-right"></i> ${t("detail")}
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
function artCard(row) {
  // FIX: dukung multi-bahasa dari sheet (title_en/title_ja, excerpt_en/excerpt_ja, tag_en/tag_ja optional)
  const title = pickByLang(row, "title");
  const excerpt = pickByLang(row, "excerpt");
  const href = normalizeUrl(row?.link || "");

  // FIX: tag bisa dipisah "|" atau "," (sesuai kebiasaan user)
  const rawTag = pickByLang(row, "tag") || "";
  const badges = String(rawTag)
    .split(/[\|,]/) // FIX
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => `<span class="text-xs px-2 py-1 rounded-full bg-slate-100">${t}</span>`)
    .join("");

  const el = document.createElement("article");
  el.className = "rounded-[20px] border border-slate-200 bg-white p-5 shadow-soft card";

  el.innerHTML = `
    <h3 class="font-bold">${title || ""}</h3>
    <p class="mt-2 text-sm text-slate-700">${excerpt || ""}</p>
    <div class="mt-3 flex flex-wrap gap-2">${badges}</div>
    ${
      href
        ? `<a href="${href}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 mt-3 text-fig-success hover:underline text-sm">
            <i data-lucide="book-open"></i> ${t("read")}
          </a>`
        : ""
    }
  `;
  return el;
}

async function renderArtikel() {
  const listIndex = $("#artikelList"); // index.html
  const listPage = $("#artikelList");  // artikel.html (id sama)
  const list = listIndex || listPage;
  const empty = $("#artikelEmpty");
  if (!list) return;

  const url = getCsvUrl("artikel");
  const all = await loadCsv(url);

  const input = $("#searchArtikel");
  const query = (input?.value || "").toLowerCase().trim();

  const data = all.filter((a) => {
    if (!query) return true;

    // FIX: pencarian ikut bahasa (fallback tetap aman)
    const title = (pickByLang(a, "title") || "").toLowerCase();
    const excerpt = (pickByLang(a, "excerpt") || "").toLowerCase();
    const tag = (pickByLang(a, "tag") || "").toLowerCase();
    return title.includes(query) || excerpt.includes(query) || tag.includes(query);
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

      // FIX: dukung kolom multi-bahasa untuk kajian
      const judul = pickByLang(r, "judul") || r.judul || "";
      const pemateri = pickByLang(r, "pemateri") || r.pemateri || "";
      const catatan = pickByLang(r, "catatan") || r.catatan || "";

      const when = [r.tanggal || "", r.waktu || ""].filter(Boolean).join(" • ");
      const href = normalizeUrl(r.link || "");

      el.innerHTML = `
        <div class="text-xs text-slate-500">${when}</div>
        <h3 class="mt-1 font-bold">${judul}</h3>
        <p class="mt-2 text-sm text-slate-700">${[pemateri, r.platform].filter(Boolean).join(" • ")}</p>
        ${catatan ? `<p class="mt-2 text-xs text-slate-500">${catatan}</p>` : ""}
        ${
          href
            ? `<a href="${href}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 mt-3 text-fig-primary hover:underline text-sm">
                <i data-lucide="external-link"></i> ${t("lectureLink")}
              </a>`
            : ""
        }
      `;
      wrap.appendChild(el);
    });

  window.lucide?.createIcons?.();
}

// ===== IMPROVE: Halaman Kajian (list penuh) — bekerja jika ada #kajianList =====
function kajianCardFull(row) {
  const el = document.createElement("article");
  el.className = "rounded-[20px] border border-slate-200 bg-white p-5 shadow-soft card overflow-hidden";

  const judul = pickByLang(row, "judul") || row.judul || "";
  const pemateri = pickByLang(row, "pemateri") || row.pemateri || "";
  const catatan = pickByLang(row, "catatan") || row.catatan || "";

  const platform = String(row.platform || "").trim();
  const href = normalizeUrl(row.link || "");
  const poster = driveToDirect(row.poster || ""); // IMPROVE
  const tanggal = row.tanggal ? new Date(row.tanggal) : null;

  const dateLine =
    tanggal && !isNaN(tanggal)
      ? fmtDate(tanggal, { weekday: "short", year: "numeric", month: "short", day: "numeric" })
      : (row.tanggal || "");

  const hijriLine =
    tanggal && !isNaN(tanggal)
      ? fmtHijri(tanggal)
      : "";

  // FIX: jangan pakai ikon yang menyerupai makhluk hidup (pakai ikon umum saja)
  el.innerHTML = `
    ${poster ? `<div class="-mx-5 -mt-5 mb-4 bg-slate-100">
      <img src="${poster}" alt="Poster" class="w-full h-48 object-cover" loading="lazy">
    </div>` : ""}

    <div class="flex items-start justify-between gap-3">
      <div>
        <div class="text-xs text-slate-500">${[dateLine, row.waktu].filter(Boolean).join(" • ")}</div>
        ${hijriLine ? `<div class="text-[11px] text-slate-400 mt-1">${hijriLine}</div>` : ""}
        <h3 class="mt-2 font-bold">${judul}</h3>
        <p class="mt-2 text-sm text-slate-700">${[pemateri, platform].filter(Boolean).join(" • ")}</p>
        ${catatan ? `<p class="mt-2 text-xs text-slate-500">${catatan}</p>` : ""}
      </div>
    </div>

    ${
      href
        ? `<a href="${href}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 mt-4 text-fig-primary hover:underline text-sm">
            <i data-lucide="external-link"></i> ${t("lectureLink")}
          </a>`
        : ""
    }
  `;

  return el;
}

function parseKajianDateTime(row) {
  // IMPROVE: sorting stabil (tanggal + waktu)
  const d = row.tanggal ? new Date(row.tanggal) : null;
  if (!d || isNaN(d)) return null;

  const w = String(row.waktu || "").trim();
  if (w && /^\d{1,2}:\d{2}$/.test(w)) {
    const [hh, mm] = w.split(":").map((x) => Number(x));
    d.setHours(hh || 0, mm || 0, 0, 0);
  } else {
    d.setHours(0, 0, 0, 0);
  }
  return d;
}

async function renderKajianList() {
  const list = $("#kajianList");
  if (!list) return;

  const empty = $("#kajianEmpty");
  const url = getCsvUrl("kajian");
  const all = await loadCsv(url);

  // FIX: filter status (tampil kalau status bukan nonaktif)
  const base = all.filter((r) => String(r.status || "").toLowerCase() !== "nonaktif");

  // IMPROVE: filter platform dropdown + search
  const q = ($("#searchKajian")?.value || "").toLowerCase().trim();
  const fPlat = ($("#filterPlatform")?.value || "").trim().toLowerCase();

  const filtered = base.filter((r) => {
    const judul = (pickByLang(r, "judul") || r.judul || "").toLowerCase();
    const pemateri = (pickByLang(r, "pemateri") || r.pemateri || "").toLowerCase();
    const catatan = (pickByLang(r, "catatan") || r.catatan || "").toLowerCase();
    const plat = String(r.platform || "").toLowerCase();

    const matchQ = !q || judul.includes(q) || pemateri.includes(q) || catatan.includes(q) || plat.includes(q);
    const matchPlat = !fPlat || plat === fPlat;
    return matchQ && matchPlat;
  });

  // IMPROVE: sort berdasarkan tanggal terdekat
  filtered.sort((a, b) => {
    const da = parseKajianDateTime(a);
    const db = parseKajianDateTime(b);
    if (!da && !db) return 0;
    if (!da) return 1;
    if (!db) return -1;
    return da.getTime() - db.getTime();
  });

  list.innerHTML = "";
  if (!filtered.length) {
    empty?.classList.remove("hidden");
    empty && (empty.textContent = t("noData")); // FIX: teks sesuai bahasa
  } else {
    empty?.classList.add("hidden");
    filtered.forEach((r) => list.appendChild(kajianCardFull(r)));
  }

  window.lucide?.createIcons?.();
}

async function initKajianFilters() {
  // IMPROVE: isi dropdown platform otomatis dari CSV (kalau ada elemen)
  const sel = $("#filterPlatform");
  const list = $("#kajianList");
  if (!sel || !list) return;

  const url = getCsvUrl("kajian");
  const rows = await loadCsv(url);

  const plats = Array.from(
    new Set(
      rows
        .filter((r) => String(r.status || "").toLowerCase() !== "nonaktif")
        .map((r) => String(r.platform || "").trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b));

  // FIX: reset option, label ikut bahasa
  sel.innerHTML = `<option value="">${t("filterAll")}</option>` + plats.map((p) => `<option value="${p}">${p}</option>`).join("");

  $("#searchKajian")?.addEventListener("input", renderKajianList); // IMPROVE
  sel.addEventListener("change", renderKajianList); // IMPROVE
}

// ===== Donasi =====
function fmtJPY(n) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));
}
function fmtIDR(n) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));
}

function initDonasi() {
  const targetEl = $("#targetLabel");
  const terkumpulEl = $("#terkumpulLabel");
  const percentEl = $("#percentLabel");
  const bar = $("#progressBar");
  if (!targetEl || !terkumpulEl || !percentEl || !bar) return;

  const TARGET = 42000000; // JPY
  const KEKURANGAN = 33800000; // JPY
  const TERKUMPUL = TARGET - KEKURANGAN; // 8,200,000

  targetEl.textContent = fmtJPY(TARGET);
  terkumpulEl.textContent = fmtJPY(TERKUMPUL);

  const p = Math.min(100, Math.round((TERKUMPUL / TARGET) * 100));
  percentEl.textContent = String(p);

  bar.style.width = "0%";
  requestAnimationFrame(() => setTimeout(() => (bar.style.width = p + "%"), 40));

  const WA_NUMBER = "818013909425";

  $$(".quick-jpy").forEach((b) =>
    b.addEventListener("click", () => ($("#inputJPY").value = b.dataset.v || ""))
  );
  $$(".quick-idr").forEach((b) =>
    b.addEventListener("click", () => ($("#inputIDR").value = b.dataset.v || ""))
  );

  $("#donasiBtn")?.addEventListener("click", () => {
    const j = Number($("#inputJPY")?.value || 0);
    const r = Number($("#inputIDR")?.value || 0);
    if (j < 1000 && r < 10000) {
      alert("Minimal 1.000 JPY atau 10.000 IDR.");
      return;
    }
    const msg = encodeURIComponent(
      `Assalamu'alaikum, saya ingin donasi sebesar ${
        j > 0 ? fmtJPY(j) : fmtIDR(r)
      } untuk Masjid As-Sunnah Hekinan.`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  });

  $$("[data-copy]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const sel = btn.getAttribute("data-copy");
      const tEl = sel ? document.querySelector(sel) : null;
      if (!tEl) return;
      navigator.clipboard.writeText(String(tEl.textContent).trim());
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

  // IMPROVE: render halaman kajian (kalau elemen ada)
  initKajianFilters();
  renderKajianList();

  $("#searchArtikel")?.addEventListener("input", renderArtikel);

  initDonasi();
}

// ===== FIX: supaya kompatibel kalau ada halaman yang `import { boot } from "./app.js"` =====
export { boot }; // FIX

// FIX: cegah double-boot jika dipanggil manual dari halaman lain
if (typeof window !== "undefined") {
  if (!window.__ASSUNNAH_APP_BOOTED__) {
    window.__ASSUNNAH_APP_BOOTED__ = true;
    boot();
  }
}
