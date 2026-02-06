// app.js (FINAL FIX: Zakat Link, Popup Fixed, Math Fixed)

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// === DATA UTAMA ===
const TARGET_DONASI = 42000000;
const TERKUMPUL_SAAT_INI = 9519843; // Update manual di sini
const HEK_LAT = 34.884, HEK_LON = 136.993; // Hekinan

// === KAMUS BAHASA ===
const TRANSLATIONS = {
  id: {
    hero_btn_wakaf: "Ikut Wakaf",
    donasi_title: "Investasi Kekal Akhirat",
    progress_title: "Progres Pembangunan", 
    collected: "Terkumpul", needed: "Kekurangan",
    search_title: "Mencari:", search_people: "Orang Baik Lagi!",
    joined_label: "Orang Lagi Dibutuhkan", 
    btn_join_movement: "Gabung Gerakan Ini",
    target_complete: "Menuju Lunas"
  },
  en: {
    hero_btn_wakaf: "Donate Now",
    donasi_title: "Invest for Hereafter",
    progress_title: "Construction Progress", 
    collected: "Collected", needed: "Remaining",
    search_title: "Mission to Find:", search_people: "Good People More!",
    joined_label: "People Still Needed", 
    btn_join_movement: "Join This Movement",
    target_complete: "Towards Completion"
  }
};

let currentLang = localStorage.getItem("lang") || "id";

// === 1. FUNGSI POPUP (AUTO SHOW) ===
function initPopup() {
  const popup = $("#popupPromo");
  if (!popup) return;

  // Tampilkan setelah 1.5 detik
  setTimeout(() => {
    popup.classList.remove("hidden");
    popup.style.display = 'flex';
  }, 1500);

  const close = () => { 
    popup.classList.add("hidden"); 
    popup.style.display = 'none'; 
  };

  $("#closePopupBtn")?.addEventListener("click", close);
  $("#closePopupBackdrop")?.addEventListener("click", close);
  
  // Tombol Share di Popup
  $("#popupShareBtn")?.addEventListener("click", () => {
      window.open(`https://wa.me/?text=${encodeURIComponent("Yuk bantu wakaf masjid Hekinan! https://assunnahhekinan.org")}`, "_blank");
  });
}

// === 2. FUNGSI HITUNG DONASI (MATH FIX) ===
function initDonasi() {
  const T = TARGET_DONASI;
  const C = TERKUMPUL_SAAT_INI;
  const K = T - C;

  // Format Uang (JPY)
  const fmt = (n) => "¥ " + new Intl.NumberFormat('id-ID').format(n);

  // Isi Angka Utama
  if ($("#targetLabel")) $("#targetLabel").textContent = fmt(T);
  if ($("#terkumpulLabel")) $("#terkumpulLabel").textContent = fmt(C);
  if ($("#kekuranganLabel")) $("#kekuranganLabel").textContent = fmt(K);

  // Progress Bar
  const percent = Math.min(Math.round((C / T) * 100), 100);
  if ($("#progressBar")) $("#progressBar").style.width = percent + "%";
  if ($("#percentLabel")) $("#percentLabel").textContent = percent;

  // Widget "Mencari X Orang"
  const NOMINAL_SATUAN = 1000; // Asumsi 1 orang wakaf 1000 yen
  const sisaOrang = Math.ceil(K / NOMINAL_SATUAN);
  const sudahOrang = Math.ceil(C / NOMINAL_SATUAN); // Dummy data berdasarkan nominal

  if ($("#targetOrang")) $("#targetOrang").textContent = new Intl.NumberFormat('id-ID').format(sisaOrang);
  if ($("#terkumpulOrang")) $("#terkumpulOrang").textContent = new Intl.NumberFormat('id-ID').format(sudahOrang);
  
  // Progress Bar Orang
  if ($("#progressOrang")) {
      const orangPercent = Math.min(Math.round((sudahOrang / (sudahOrang + sisaOrang)) * 100), 100);
      $("#progressOrang").style.width = orangPercent + "%";
  }
}

// === 3. JADWAL SHOLAT (SIMPLE FIX) ===
async function renderSholat() {
    const g = $("#sholatGrid");
    if (!g) return;
    
    g.innerHTML = `<div class="col-span-full text-center text-xs text-slate-400 py-4">Memuat jadwal...</div>`;
    
    try {
        const d = await fetch(`https://api.aladhan.com/v1/timings?latitude=${HEK_LAT}&longitude=${HEK_LON}&method=2`).then(r => r.json());
        const t = d.data.timings;
        const list = [
            {n:"Subuh", t:t.Fajr, i:"sunrise"},
            {n:"Syuruq", t:t.Sunrise, i:"sun"},
            {n:"Dzuhur", t:t.Dhuhr, i:"sun"},
            {n:"Ashar", t:t.Asr, i:"cloud-sun"},
            {n:"Maghrib", t:t.Maghrib, i:"moon"},
            {n:"Isya", t:t.Isha, i:"star"}
        ];

        let html = "";
        list.forEach(item => {
            html += `
            <div class="rounded-2xl border border-slate-100 p-3 text-center bg-slate-50 hover:bg-white hover:border-sky-200 transition-all">
                <i data-lucide="${item.i}" class="w-4 h-4 mx-auto text-slate-400 mb-1"></i>
                <div class="text-[10px] uppercase font-bold text-slate-400">${item.n}</div>
                <div class="mt-1 text-lg font-extrabold text-slate-800">${item.t}</div>
            </div>`;
        });
        g.innerHTML = html;
        window.lucide?.createIcons?.();
        if($("#locLabel")) $("#locLabel").textContent = "Hekinan, Japan";
    } catch (e) {
        g.innerHTML = "Gagal memuat.";
    }
}

// === 4. BAHASA ===
function setLang(lang) {
  currentLang = lang; localStorage.setItem("lang", lang);
  const t = TRANSLATIONS[lang];
  $$("[data-i18n]").forEach(el => { 
    const k = el.getAttribute("data-i18n"); 
    if (t[k]) el.textContent = t[k]; 
  });
}

// === BOOTSTRAP ===
function boot() {
  setLang(currentLang);
  $("#langToggle")?.addEventListener("click", () => setLang(currentLang === "id" ? "en" : "id"));
  $("#langToggleMob")?.addEventListener("click", () => setLang(currentLang === "id" ? "en" : "id"));

  initPopup();
  initDonasi();
  renderSholat();
  
  // Zakat Calculator tidak butuh JS lagi, karena sudah jadi Link HTML
  
  window.lucide?.createIcons?.();
  
  const obs = new IntersectionObserver(e => e.forEach(x => { if (x.isIntersecting) x.target.classList.add("active") }), { threshold: 0.1 });
  $$(".reveal").forEach(e => obs.observe(e));
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
