// ==========================================
// 1. UTILITIES & SELECTORS
// ==========================================
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// ==========================================
// 2. KONFIGURASI DATA (PUSAT PENGATURAN)
// ==========================================
const TARGET_DONASI = 42000000;
const TERKUMPUL_SAAT_INI = 9519843;

const POPUP_IMAGES_LIST = [
  "assets/foto/1e.png",
  "assets/foto/001.jpg" // Pastikan file ini ada atau beri komentar jika tidak ada
];

const VIDEO_DONASI_LIST = ["jfKfPRdk", "dQwgXcQ"];
const YOUTUBE_VIDEOS = ["OvQjcl65BR8", "zEu4jVpgB_8", "oQjqwQb6atA"];
const LOCAL_IMAGES = ["1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg", "6.jpeg", "7.jpeg", "assets/foto/a.jpeg", "assets/foto/b.jpeg"];

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzLMb1wIdcq4YZWw7wbFJGlI2su_Yyti1DoUHPzRBMDZyMmsB98cQKfpV9z9DH9RwuGmA/exec";
const DEFAULT_KAJIAN_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=0&single=true&output=csv";
const DEFAULT_PENGUMUMAN_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=991747005&single=true&output=csv";
const DEFAULT_ARTIKEL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=1625529193&single=true&output=csv";

const HIJRI_MONTHS_ID = ["Muharram", "Shafar", "Rabiul Awal", "Rabiul Akhir", "Jumadil Awal", "Jumadil Akhir", "Rajab", "Sya'ban", "Ramadhan", "Syawal", "Dzulqa'dah", "Dzulhijjah"];

const HADITHS = [
  { ar: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ", id: "Sesungguhnya setiap amalan tergantung pada niatnya.", en: "Actions are but by intentions." },
  { ar: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ", id: "Sebaik-baik kalian adalah yang belajar Al-Qur'an dan mengajarkannya.", en: "The best of you learn Quran and teach it." }
];

const DAFTAR_DOA = [
  { ar: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ", id: "Ya Allah, bukalah untukku pintu-pintu rahmat-Mu. (Doa Masuk Masjid)" },
  { ar: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ", id: "Ya Allah, sesungguhnya aku memohon keutamaan dari-Mu. (Doa Keluar Masjid)" },
  { ar: "رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا", id: "Ya Tuhanku, tambahkanlah ilmuku dan berilah aku karunia untuk dapat memahaminya." },
  { ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", id: "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat dan peliharalah kami dari siksa neraka." }
];

const TRANSLATIONS = {
  id: {
    nav_sholat: "Jadwal Sholat", nav_kegiatan: "Kegiatan", nav_info: "Info", nav_donasi: "Donasi",
    hero_title_1: "Merajut Ukhuwah,", hero_title_2: "Membangun Peradaban.",
    hero_desc: "Pusat kegiatan ibadah, pendidikan anak, dan silaturahmi masyarakat muslim Indonesia di sekitar Hekinan Aichi ken Jepang.",
    hero_btn_wakaf: "Ikut Wakaf", hero_btn_sholat: "Jadwal Sholat", hero_btn_kiblat: "Arah Kiblat",
    hadith_label: "Mutiara Hadits", sholat_title: "Jadwal Sholat",
    gallery_title: "Galeri Foto", gallery_desc: "Dokumentasi kegiatan dan kebersamaan jamaah.",
    tab_announcement: "Pengumuman", tab_article: "Artikel & Faedah",
    empty_data: "Belum ada data terbaru.", empty_search: "Tidak ditemukan.",
    donasi_badge: "Peluang Amal Jariyah", donasi_title: "Investasi Kekal Akhirat",
    deadline_label: "Batas Waktu Wakaf (Tahap 1)",
    progress_title: "Progres Pembangunan", collected: "Terkumpul", needed: "Kekurangan",
    confirm_title: "Konfirmasi Donasi", confirm_desc: "Masukkan nominal yang telah ditransfer.",
    or: "ATAU", btn_confirm: "Konfirmasi via WA", footer_links: "Tautan", footer_follow: "Lokasi",
    btn_zakat: "Hitung Zakat", btn_donate_now: "Donasi Sekarang", btn_popup_wakaf: "Ikut Wakaf Sekarang",
    video_appeal_title: "Mengapa Kita Perlu Membangun Masjid?", video_appeal_desc: "Simak pesan berikut ini.",
    view_all: "Lihat Semua", view_channel: "Lihat Channel YouTube", contact_title: "Hubungi Kami",
    read_more: "Selengkapnya", search_placeholder: "Cari artikel...",
    reminder_label: "Belum bisa transfer sekarang?", reminder_btn: "Buat Komitmen Rutin",
    reminder_date_label: "Mulai Tanggal:", reminder_freq_label: "Frekuensi:",
    freq_once: "Sekali Saja", freq_monthly: "Rutin Tiap Bulan",
    btn_save_reminder: "Pasang Pengingat", reminder_note: "*Akan membuka Google Calendar Anda.",
    reminder_title: "✨ Komitmen Wakaf Masjid Hekinan",
    reminder_desc: "Pengingat sedekah rutin. Rekening: Yucho 12160-00457031 / BSI 7329283768. Semoga berkah!",
    search_title: "Mencari:", search_people: "Orang Baik Lagi!",
    search_desc_1: "Jika 1 orang berwakaf", search_desc_2: "maka pelunasan masjid ini akan segera terwujud. Jadilah salah satu dari mereka!",
    joined_label: "Orang Lagi Dibutuhkan", btn_join_movement: "Gabung Gerakan Ini", target_complete: "Menuju Lunas",
    dedication_check: "Niatkan pahala untuk", dedication_target: "Orang Tua / Almarhum?",
    dedication_label: "Nama Orang Tua / Almarhum", dedication_placeholder: "Contoh: Bpk. Fulan bin Fulan",
    alert_nominal: "Mohon masukkan nominal donasi.", btn_loading: "Membuka WhatsApp...", btn_copied: "Tersalin",
    wa_opening: "Assalamu'alaikum, saya ingin konfirmasi donasi pembangunan Masjid As-Sunnah Hekinan.",
    wa_dedication: "🎁 Pahala diniatkan atas nama:", wa_closing: "Mohon dicek. Jazakumullah khairan."
  },
  en: {
    nav_sholat: "Prayer Times", nav_kegiatan: "Gallery", nav_info: "Info", nav_donasi: "Donate",
    hero_title_1: "Weaving Brotherhood,", hero_title_2: "Building Civilization.",
    hero_desc: "Center for worship, children's education, and gathering for the Indonesian Muslim community around Hekinan, Aichi Prefecture, Japan.",
    hero_btn_wakaf: "Donate Now", hero_btn_sholat: "Prayer Times", hero_btn_kiblat: "Qibla Finder",
    hadith_label: "Daily Hadith", sholat_title: "Prayer Times",
    gallery_title: "Photo Gallery", gallery_desc: "Documentation of community activities.",
    tab_announcement: "Announcements", tab_article: "Articles",
    empty_data: "No updates.", empty_search: "Not found.",
    donasi_badge: "Charity Opportunity", donasi_title: "Invest for Hereafter",
    deadline_label: "Donation Deadline",
    progress_title: "Construction Progress", collected: "Collected", needed: "Remaining",
    confirm_title: "Confirm Donation", confirm_desc: "Enter transferred amount.",
    or: "OR", btn_confirm: "Confirm via WA", footer_links: "Links", footer_follow: "Location",
    btn_zakat: "Zakat Calculator", btn_donate_now: "Donate Now", btn_popup_wakaf: "Donate Now",
    video_appeal_title: "Why Do We Need to Build a Mosque?", video_appeal_desc: "Watch the following message.",
    view_all: "View All", view_channel: "Visit YouTube Channel", contact_title: "Contact Us",
    read_more: "Read More", search_placeholder: "Search articles...",
    reminder_label: "Can't transfer right now?", reminder_btn: "Make a Commitment",
    reminder_date_label: "Start Date:", reminder_freq_label: "Frequency:",
    freq_once: "One Time", freq_monthly: "Monthly (Recurring)",
    btn_save_reminder: "Set Reminder", reminder_note: "*Opens Google Calendar.",
    reminder_title: "✨ Donation Commitment Hekinan Mosque",
    reminder_desc: "Routine charity reminder. Bank: Yucho 12160-00457031 / BSI 7329283768. Jazakumullah Khairan!",
    search_title: "Mission to Find:", search_people: "Good People More!",
    search_desc_1: "If 1 person donates", search_desc_2: "then this mosque will be fully paid off soon. Be one of them!",
    joined_label: "People Still Needed", btn_join_movement: "Join This Movement", target_complete: "Towards Completion",
    dedication_check: "Intend reward for", dedication_target: "Parents / Deceased?",
    dedication_label: "Name of Parents / Deceased", dedication_placeholder: "Ex: Mr. Fulan bin Fulan",
    alert_nominal: "Please enter donation amount.", btn_loading: "Opening WhatsApp...", btn_copied: "Copied",
    wa_opening: "Assalamu'alaikum, I would like to confirm my donation for As-Sunnah Hekinan Mosque construction.",
    wa_dedication: "🎁 Reward intended for:", wa_closing: "Please check. Jazakumullah Khairan."
  }
};

// ==========================================
// 3. FUNGSI INTI (SISTEM)
// ==========================================
let currentLang = localStorage.getItem("lang") || "id";

function renderHadith() {
  const day = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const h = HADITHS[day % HADITHS.length];
  if ($("#hadithArab")) $("#hadithArab").textContent = h.ar;
  if ($("#hadithTerjemah")) $("#hadithTerjemah").textContent = currentLang === 'en' ? h.en : h.id;
  if ($("#hadithRiwayat")) $("#hadithRiwayat").textContent = "Hadits Shahih";
}

let globalHijriData = null;
function renderHijri(apiData = null) {
  const el = $("#hijriDate");
  if (!el) return;
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
    el.textContent = new Intl.DateTimeFormat(loc + '-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()).replace(/ AH| H/g, " H");
  } catch (e) {
    el.textContent = new Intl.DateTimeFormat(loc + '-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()).replace(/ AH| H/g, " H");
  }
}

function setLang(lang) {
  currentLang = lang; localStorage.setItem("lang", lang);
  const t = TRANSLATIONS[lang];
  $$("[data-i18n]").forEach(el => { const k = el.getAttribute("data-i18n"); if (t[k]) el.textContent = t[k]; });
  $$("[data-placeholder]").forEach(el => { const k = el.getAttribute("data-placeholder"); if (t[k]) el.placeholder = t[k]; });
  renderHadith(); renderHijri();
}

async function loadCsv(url) {
  try {
    const t = await fetch(url, { cache: "no-store" }).then(r => r.text());
    const r = []; let i = 0, c = "", row = [], q = false;
    while (i < t.length) {
      let char = t[i];
      if (char === '"') { if (q && t[i + 1] === '"') { c += '"'; i += 2; continue; } q = !q; i++; continue; }
      if (!q && char === ',') { row.push(c); c = ""; i++; continue; }
      if (!q && (char === '\n' || char === '\r')) { if (c || row.length) { row.push(c); r.push(row); row = []; c = ""; } if (char === '\r' && t[i + 1] === '\n') i++; i++; continue; }
      c += char; i++;
    }
    if (c || row.length) { row.push(c); r.push(row); }
    const h = r[0].map(x => x.trim().toLowerCase());
    return r.slice(1).map(v => { const o = {}; h.forEach((k, x) => o[k] = v[x]?.trim() || ""); return o; });
  } catch { return []; }
}

// ==========================================
// 4. FITUR MODAL & POPUP
// ==========================================
window.openArticleModal = (dataString) => {
  try {
    const data = JSON.parse(decodeURIComponent(dataString)); 
    const modal = $("#articleModal"); if (!modal) return;
    $("#modalTitle").textContent = data.title || ""; 
    $("#modalDate").innerHTML = `<i data-lucide="calendar" class="w-3 h-3"></i> ${data.date || "-"}`; 
    $("#modalTag").textContent = data.tag || "Info";
    let contentHTML = (data.content || data.desc || "").replace(/\n/g, "<br>");
    $("#modalContent").innerHTML = contentHTML;
    const extBtn = $("#modalExternalLink");
    if (data.link && data.link.startsWith("http")) { extBtn.href = data.link; extBtn.classList.remove("hidden"); extBtn.classList.add("flex"); } 
    else { extBtn.classList.add("hidden"); extBtn.classList.remove("flex"); }
    modal.classList.remove("hidden"); modal.classList.add("flex"); window.lucide?.createIcons?.();
  } catch (e) { console.error("Gagal membuka artikel:", e); }
};

function initPopup() {
  const popup = $("#popupPromo"); const imgEl = $("#popupPromo img"); 
  if (!popup || !imgEl || !POPUP_IMAGES_LIST.length) return;
  let currentIndex = 0; let slideInterval;
  const showImage = (index) => {
    if (index >= POPUP_IMAGES_LIST.length) currentIndex = 0;
    else if (index < 0) currentIndex = POPUP_IMAGES_LIST.length - 1;
    else currentIndex = index;
    imgEl.src = POPUP_IMAGES_LIST[currentIndex];
  };
  popup.classList.remove("hidden"); popup.style.display = 'flex';
  showImage(0);
  if (POPUP_IMAGES_LIST.length > 1) {
    const nextSlide = () => showImage(currentIndex + 1);
    slideInterval = setInterval(nextSlide, 3500);
  }
  const close = () => { popup.classList.add("hidden"); popup.style.display = 'none'; clearInterval(slideInterval); };
  $("#closePopupBtn")?.addEventListener("click", close);
  $("#closePopupBackdrop")?.addEventListener("click", close);
  $("#popupDonateBtn")?.addEventListener("click", () => { close(); $("#donasi")?.scrollIntoView({ behavior: "smooth" }); });
}

// ==========================================
// 5. FITUR KALKULATOR ZAKAT
// ==========================================
function initZakatCalculator() {
  const openBtn = $("#openZakat"), modal = $("#zakatModal"), closeBtn = $("#closeZakat"), calcBtn = $("#calcBtn");
  if (!openBtn) return;
  let currentZakatCurr = 'JPY';
  const priceInput = $("#zGoldPrice");
  const setCurrency = (c) => {
    currentZakatCurr = c;
    $("#zGoldPrice").value = (c === 'JPY' ? 14000 : 1400000);
    $("#zCurrLabel").textContent = c;
  };
  openBtn.onclick = () => { modal.classList.remove("hidden"); modal.classList.add("flex"); };
  closeBtn.onclick = () => { modal.classList.add("hidden"); modal.classList.remove("flex"); };
  calcBtn.onclick = () => {
    const goldPrice = Number($("#zGoldPrice").value), cash = Number($("#zCash").value || 0), goldVal = Number($("#zGoldVal").value || 0), debt = Number($("#zDebt").value || 0);
    const nisab = goldPrice * 85, totalNet = (cash + goldVal) - debt;
    const fmt = (n) => (currentZakatCurr === 'JPY' ? '¥' : 'Rp ') + new Intl.NumberFormat('id-ID').format(n);
    $("#zTotalNet").textContent = fmt(totalNet); $("#zNisab").textContent = fmt(nisab);
    $("#zResultBox").classList.remove("hidden");
    const isWajib = totalNet >= nisab;
    $("#zStatus").textContent = isWajib ? "WAJIB ZAKAT" : "BELUM WAJIB";
    $("#zFinalAmount").textContent = isWajib ? fmt(totalNet * 0.025) : fmt(0);
  };
}

// ==========================================
// 6. FITUR DONASI & WHATSAPP
// ==========================================
function initDonasi() {
  const fmt = (n, c) => (c === 'JPY' ? '¥' : 'Rp ') + new Intl.NumberFormat('id-ID').format(n);
  const T = TARGET_DONASI, C = TERKUMPUL_SAAT_INI, K = T - C;

  if ($("#targetLabel")) $("#targetLabel").textContent = fmt(T, "JPY");
  if ($("#terkumpulLabel")) $("#terkumpulLabel").textContent = fmt(C, "JPY");
  if ($("#kekuranganLabel")) $("#kekuranganLabel").textContent = fmt(K, "JPY");

  setTimeout(() => { 
    if ($("#progressBar")) $("#progressBar").style.width = Math.round((C / T) * 100) + "%"; 
    if ($("#percentLabel")) $("#percentLabel").textContent = Math.round((C / T) * 100);
  }, 500);

  // Sisa Orang Baik
  const sisaOrang = Math.ceil(K / 1000);
  if ($("#targetOrang")) $("#targetOrang").textContent = new Intl.NumberFormat('id-ID').format(sisaOrang);
  if ($("#terkumpulOrang")) $("#terkumpulOrang").textContent = new Intl.NumberFormat('id-ID').format(sisaOrang);
  if ($("#progressOrang")) $("#progressOrang").style.width = Math.min((C / T) * 100, 100) + "%";

  // Dedikasi Toggle
  $("#checkDedikasi")?.addEventListener("change", (e) => {
    $("#boxNamaDedikasi")?.classList.toggle("hidden", !e.target.checked);
  });

  // Konfirmasi WA
  $("#donasiBtn")?.addEventListener("click", () => {
    const jpy = $("#inputJPY")?.value, idr = $("#inputIDR")?.value;
    const namaDedikasi = $("#inputNamaDedikasi")?.value;
    const isDedikasi = $("#checkDedikasi")?.checked;
    const t = TRANSLATIONS[currentLang];

    if (!jpy && !idr) { alert(t.alert_nominal); return; }

    let msg = t.wa_opening + `\n\n💰 Nominal: ${jpy ? jpy + ' JPY' : ''} ${idr ? idr + ' IDR' : ''}`;
    if (isDedikasi && namaDedikasi) msg += `\n${t.wa_dedication} *${namaDedikasi}*`;
    msg += `\n\n${t.wa_closing}`;

    window.open(`https://wa.me/818013909425?text=${encodeURIComponent(msg)}`, "_blank");
  });

  // Salin Rekening
  $$("[data-copy]").forEach(b => b.addEventListener("click", () => {
    navigator.clipboard.writeText($(b.dataset.copy).innerText);
    alert(TRANSLATIONS[currentLang].btn_copied);
  }));
}

// ==========================================
// 7. RENDER KONTEN (SHOLAT, VIDEO, CAROUSEL)
// ==========================================
async function renderSholat() {
  const g = $("#sholatGrid"); if (!g) return;
  let p = { lat: 34.884, lon: 136.993 };
  try {
    const d = await fetch(`https://api.aladhan.com/v1/timings?latitude=${p.lat}&longitude=${p.lon}&method=2`).then(r => r.json());
    if (d.data?.date?.hijri) renderHijri(d.data.date.hijri);
    const m = { Fajr: ["Subuh", "sunrise"], Sunrise: ["Syuruq", "sun"], Dhuhr: ["Dzuhur", "sun"], Asr: ["Ashar", "cloud-sun"], Maghrib: ["Maghrib", "moon"], Isha: ["Isya", "star"] };
    g.innerHTML = "";
    Object.keys(m).forEach(k => {
      g.innerHTML += `<div class="rounded-2xl border border-slate-100 p-4 text-center bg-slate-50 hover:bg-white transition-all"><i data-lucide="${m[k][1]}" class="w-5 h-5 mx-auto text-slate-400 mb-2"></i><div class="text-[10px] uppercase font-bold text-slate-400">${m[k][0]}</div><div class="mt-1 text-lg font-extrabold text-slate-800">${d.data.timings[k]}</div></div>`;
    });
    window.lucide?.createIcons?.();
  } catch { g.innerHTML = "Gagal memuat jadwal."; }
}

async function renderContent() {
  const mkCard = (x, isArt) => {
    const dataString = encodeURIComponent(JSON.stringify(x));
    return `
      <article class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col h-full transition-all">
        <h3 class="text-lg font-bold text-slate-800 mb-2">${x.title || "(Tanpa Judul)"}</h3>
        <p class="text-sm text-slate-600 mb-4 line-clamp-3 flex-grow">${(isArt ? x.excerpt : x.desc) || ""}</p>
        <button onclick="openArticleModal('${dataString}')" class="mt-auto text-sm font-bold text-fig-primary flex items-center gap-1">
          <span>${TRANSLATIONS[currentLang].read_more}</span> <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </button>
      </article>`;
  };
  const dP = await loadCsv(DEFAULT_PENGUMUMAN_CSV);
  if ($("#wrapPengumuman")) $("#wrapPengumuman").innerHTML = dP.map(x => mkCard(x, false)).join("");
  const dA = await loadCsv(DEFAULT_ARTIKEL_CSV);
  if ($("#artikelList")) $("#artikelList").innerHTML = dA.map(x => mkCard(x, true)).join("");
  window.lucide?.createIcons?.();
}

function initCountdown() {
  const end = new Date("2026-05-31T23:59:59").getTime();
  setInterval(() => {
    const gap = end - new Date().getTime();
    if (gap < 0) return;
    if ($("#cdDays")) $("#cdDays").innerText = Math.floor(gap / 86400000);
    if ($("#cdHours")) $("#cdHours").innerText = Math.floor((gap % 86400000) / 3600000);
    if ($("#cdMin")) $("#cdMin").innerText = Math.floor((gap % 3600000) / 60000);
  }, 1000);
}

// ==========================================
// 8. BOOTSTRAP (RUN)
// ==========================================
function boot() {
  setLang(currentLang);
  renderSholat();
  renderContent();
  initDonasi();
  initCountdown();
  initZakatCalculator();
  initPopup();
  
  // Tab Switcher
  $("#tabPengumuman")?.addEventListener("click", () => { 
    $("#wrapPengumuman").classList.remove("hidden"); $("#wrapArtikel").classList.add("hidden"); 
    $("#tabs").classList.replace("tab-right", "tab-left");
  });
  $("#tabArtikel")?.addEventListener("click", () => { 
    $("#wrapPengumuman").classList.add("hidden"); $("#wrapArtikel").classList.remove("hidden"); 
    $("#tabs").classList.replace("tab-left", "tab-right");
  });

  // Lang Toggle
  $("#langToggle")?.addEventListener("click", () => setLang(currentLang === "id" ? "en" : "id"));
  $("#langToggleMob")?.addEventListener("click", () => setLang(currentLang === "id" ? "en" : "id"));

  window.lucide?.createIcons?.();
}

document.addEventListener("DOMContentLoaded", boot);
