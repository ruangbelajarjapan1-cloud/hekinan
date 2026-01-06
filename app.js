// ========== Utils ==========
export const $  = (s, r=document)=> r.querySelector(s);
export const $$ = (s, r=document)=> [...r.querySelectorAll(s)];
export const fmtJPY = n => new Intl.NumberFormat('id-ID',{style:'currency',currency:'JPY',maximumFractionDigits:0}).format(n||0);
export const fmtIDR = n => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n||0);
export function once(fn){ let d=false; return (...a)=>{ if(d) return; d=true; fn(...a);}}

// Default CSV Kajian (pakai link yang Anda kirim)
export const DEFAULT_KAJIAN_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSlE8S0iOWE3ssrAkrsm1UE_qMfFZAHLXD057zfZslsu1VCdiIDI2jdHc_gjGBOKqQFFo-iLYouGwm9/pub?gid=0&single=true&output=csv';

// ========== Admin Gate ==========
export const Admin = (function(){
  const KEY = 'is_admin';
  const CODE = 'as-sunnah-2025'; // ganti sewaktu-waktu

  const isAdmin = ()=> localStorage.getItem(KEY)==='1' || new URLSearchParams(location.search).get('admin')==='1';

  function revealButtons(){
    $$('.admin-only').forEach(el=> el.classList.remove('hidden'));
  }

  function setup(){
    if(isAdmin()) revealButtons();

    // Shortcut admin: Ctrl+Alt+A
    document.addEventListener('keydown', (e)=>{
      if(e.ctrlKey && e.altKey && (e.key==='a' || e.key==='A')){
        const inCode = prompt('Masukkan kode admin:');
        if(inCode === CODE){
          localStorage.setItem(KEY,'1');
          revealButtons();
          alert('Admin aktif di browser ini.');
        }else{
          alert('Kode salah.');
        }
      }
    });
  }

  return { setup };
})();

// ========== Data Store (CSV/JSON) ==========
export const DataStore = (function(){
  const cfg = {
    pengumuman: { sheetCsv: localStorage.getItem('sheet_pengumuman')||'', json:'pengumuman.json' },
    artikel:    { sheetCsv: localStorage.getItem('sheet_artikel')||'',    json:'artikel.json'    },
    // Kajian: gunakan Google Sheet CSV (rekomendasi) atau fallback kajian.json
    kajian:     { sheetCsv: localStorage.getItem('sheet_kajian')||DEFAULT_KAJIAN_CSV, json:'kajian.json' },
    // Kegiatan terjadwal (agenda/event): opsional. Galeri foto tetap di HTML.
    kegiatan:   { sheetCsv: localStorage.getItem('sheet_kegiatan')||'', json:'kegiatan.json' },
  };

  // CSV parser sederhana (cocok untuk pemula). Hindari koma di dalam cell (kecuali Anda paham CSV quoted).
  function parseCSV(text){
    return text.trim().split(/\r?\n/).map(r=> r.split(',').map(c=>c.trim()));
  }

  async function loadFromCsv(url){
    if(!url) return null;
    try{
      const txt = await fetch(url, {cache:'no-store'}).then(r=>r.text());
      const rows = parseCSV(txt);
      if(!rows.length) return [];
      const head = rows[0].map(h=>h.toLowerCase());
      return rows.slice(1).map(cols=>{
        const o = {};
        head.forEach((h,i)=> o[h] = cols[i] || '');
        return o;
      });
    }catch{
      return null;
    }
  }

  async function loadFromJson(url){
    try{
      return await fetch(url,{cache:'no-store'}).then(r=>r.json());
    }catch{
      return null;
    }
  }

  function saveSheet(key, url){
    if(url) localStorage.setItem(key, url);
    else localStorage.removeItem(key);
  }

  return {
    cfg,
    saveSheet,
    async pengumuman(FALLBACK){
      const c = await loadFromCsv(cfg.pengumuman.sheetCsv); if(c && c.length) return c;
      const j = await loadFromJson(cfg.pengumuman.json);   if(j && j.length) return j;
      return FALLBACK||[];
    },
    async artikel(FALLBACK){
      const c = await loadFromCsv(cfg.artikel.sheetCsv); if(c && c.length) return c;
      const j = await loadFromJson(cfg.artikel.json);   if(j && j.length) return j;
      return FALLBACK||[];
    },
    async kajian(FALLBACK){
      const c = await loadFromCsv(cfg.kajian.sheetCsv); if(c && c.length) return c;
      const j = await loadFromJson(cfg.kajian.json);   if(j && j.length) return j;
      return FALLBACK||[];
    },
    async kegiatan(FALLBACK){
      const c = await loadFromCsv(cfg.kegiatan.sheetCsv); if(c && c.length) return c;
      const j = await loadFromJson(cfg.kegiatan.json);   if(j && j.length) return j;
      return FALLBACK||[];
    }
  };
})();

// ========== Modal Data (admin only) ==========
export const AdminDataModal = (function(){
  function open(){
    const m = $('#dataModal'); if(!m) return;
    $('#csvPengumuman') && ($('#csvPengumuman').value = localStorage.getItem('sheet_pengumuman')||'');
    $('#csvArtikel')    && ($('#csvArtikel').value    = localStorage.getItem('sheet_artikel')||'');
    $('#csvKajian')     && ($('#csvKajian').value     = localStorage.getItem('sheet_kajian')||DEFAULT_KAJIAN_CSV);
    $('#csvKegiatan')   && ($('#csvKegiatan').value   = localStorage.getItem('sheet_kegiatan')||'');
    m.classList.remove('hidden'); m.classList.add('flex');
  }
  function close(){
    const m=$('#dataModal'); if(!m) return;
    m.classList.add('hidden'); m.classList.remove('flex');
  }
  function init(){
    const openBtn = $('#openData');
    const closeBtn = $('#closeData');
    const saveBtn = $('#saveData');

    if(openBtn) openBtn.addEventListener('click', (e)=>{ e.preventDefault(); open(); });
    if(closeBtn) closeBtn.addEventListener('click', close);
    $('#dataModal')?.addEventListener('click', (e)=>{ if(e.target.id==='dataModal') close(); });

    if(saveBtn) saveBtn.addEventListener('click', ()=>{
      DataStore.saveSheet('sheet_pengumuman', $('#csvPengumuman')?.value.trim()||'');
      DataStore.saveSheet('sheet_artikel',    $('#csvArtikel')?.value.trim()||'');
      DataStore.saveSheet('sheet_kajian',     $('#csvKajian')?.value.trim()||'');
      DataStore.saveSheet('sheet_kegiatan',   $('#csvKegiatan')?.value.trim()||'');
      alert('Sumber data tersimpan. Silakan refresh halaman konten.');
      close();
    });
  }
  return { init, open, close };
})();

// ========== Sholat (GPS user) ==========
export const SholatWidget = (function(){
  // Mengambil jadwal sholat dari Aladhan API (simple & gratis)
  async function times(lat, lon){
    const url = `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=3`;
    const j = await fetch(url, {cache:'no-store'}).then(r=>r.json());
    return j?.data?.timings || null;
  }

  function tile(icon, label, value){
    const d=document.createElement('div');
    d.className='rounded-[16px] border border-slate-200 bg-white p-4 text-center';
    d.innerHTML = `
      <div class="flex items-center justify-center gap-2 text-slate-600 text-sm">
        <i data-lucide="${icon}" class="w-4 h-4"></i>
        <span>${label}</span>
      </div>
      <div class="mt-2 text-xl font-extrabold text-slate-900">${value || '-'}</div>
    `;
    return d;
  }

  async function render(){
    const grid = $('#sholatGrid');
    const btn  = $('#refreshSholat');
    if(!grid) return;

    btn?.classList.add('animate-spin');

    try{
      const loc = await new Promise((resolve, reject)=>{
        navigator.geolocation.getCurrentPosition(
          p=> resolve({lat:p.coords.latitude, lon:p.coords.longitude}),
          err=> reject(err),
          {enableHighAccuracy:true, timeout:10000}
        );
      });

      const t = await times(loc.lat, loc.lon);
      if(!t) throw new Error('no timings');

      grid.innerHTML = '';
      [
        ['Fajr','moon','Subuh'],
        ['Sunrise','sun','Syuruq'],
        ['Dhuhr','sunrise','Dzuhur'],
        ['Asr','cloud-sun','Ashar'],
        ['Maghrib','sunset','Maghrib'],
        ['Isha','moon-star','Isya'],
      ].forEach(([k,ic,l])=> grid.appendChild(tile(ic,l,t[k])));

      lucide.createIcons();
    }catch{
      grid.innerHTML = '<p class="col-span-6 text-center text-red-600">Gagal memuat jadwal. Izinkan lokasi (GPS) lalu coba lagi.</p>';
    }

    btn?.classList.remove('animate-spin');
  }

  function init(){
    if(!$('#sholatGrid')) return;
    $('#refreshSholat')?.addEventListener('click', render);
    render();
  }

  return { init };
})();

// ========== Kegiatan (slideshow/galeri foto) ==========
export const KegiatanModule = (function(){
  function init(){
    const track = $('#kgTrack'); if(!track) return;
    const prevs = [$('#kgPrev'), $('#kgPrevMob')].filter(Boolean);
    const nexts = [$('#kgNext'), $('#kgNextMob')].filter(Boolean);
    const page = ()=> track.clientWidth;
    const go = d => track.scrollBy({left: d*page(), behavior:'smooth'});
    prevs.forEach(b=>b.addEventListener('click',()=>go(-1)));
    nexts.forEach(b=>b.addEventListener('click',()=>go(1)));
    let t = setInterval(()=>go(1), 6000);
    track.addEventListener('mouseenter', ()=> clearInterval(t));
    track.addEventListener('mouseleave', ()=> t = setInterval(()=>go(1), 6000));
  }
  return { init };
})();

// ========== Pengumuman ==========
export const PengumumanModule = (function(){
  const FALLBACK = [
    { title:'Contoh Pengumuman', date:'2026-01-01', desc:'Isi via Google Sheet.', link:'#' },
  ];
  let CACHE=[];

  function normalize(r){
    return {
      title: r.title || r.judul || '',
      date: r.date || r.tanggal || '',
      desc: r.desc || r.deskripsi || r.isi || '',
      link: r.link || r.url || ''
    };
  }

  function card(p){
    const el=document.createElement('article');
    el.className='rounded-2xl border border-slate-200 bg-white p-5 shadow';
    el.innerHTML=`
      <div class="flex items-start justify-between gap-3">
        <h3 class="font-extrabold text-slate-900">${p.title||'Pengumuman'}</h3>
        <span class="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">${p.date||''}</span>
      </div>
      <p class="text-sm text-slate-600 mt-3">${p.desc||''}</p>
      ${p.link? `<a href="${p.link}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-sky-700 hover:text-sky-800">
        <i data-lucide="external-link" class="w-4 h-4"></i> Selengkapnya
      </a>`:''}
    `;
    return el;
  }

  function render(targetId, emptyId){
    const wrap = $(targetId);
    const empty = $(emptyId);
    if(!wrap) return;

    wrap.innerHTML='';
    if(!CACHE.length){
      empty?.classList.remove('hidden');
      return;
    }
    empty?.classList.add('hidden');

    CACHE.forEach(p=> wrap.appendChild(card(p)));
    lucide.createIcons();
  }

  async function init(){
    // Halaman pengumuman.html memakai #board
    // Halaman index.html memakai #wrapPengumuman
    const isPengPage = !!$('#board');
    const isIndex    = !!$('#wrapPengumuman');

    if(!isPengPage && !isIndex) return;

    const rows = await DataStore.pengumuman(FALLBACK);
    CACHE = (rows||[]).map(normalize);

    if(isPengPage) render('#board', '#boardEmpty');
    if(isIndex)    render('#wrapPengumuman', '#boardEmpty');
  }

  return { init };
})();

// ========== Artikel ==========
export const ArtikelModule = (function(){
  const FALLBACK = [
    { title:'Contoh Artikel', tag:'info', excerpt:'Isi via Google Sheet.', link:'#' }
  ];
  let CACHE=[];

  function normalize(r){
    return {
      title: r.title || r.judul || '',
      tag: r.tag || r.kategori || '',
      excerpt: r.excerpt || r.ringkasan || r.desc || '',
      link: r.link || r.url || '#'
    };
  }

  function card(a){
    const badges = (a.tag||'')
      .split('|')
      .map(t=>t.trim())
      .filter(Boolean)
      .map(t=>`<span class="text-xs px-2 py-1 rounded-full bg-slate-100">${t}</span>`)
      .join('');

    const el=document.createElement('article');
    el.className='rounded-2xl border border-slate-200 bg-white p-5 shadow';
    el.innerHTML=`
      <h3 class="font-extrabold text-slate-900">${a.title||'Artikel'}</h3>
      <div class="mt-2 flex flex-wrap gap-2">${badges}</div>
      <p class="text-sm text-slate-600 mt-3">${a.excerpt||''}</p>
      <a href="${a.link}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-sky-700 hover:text-sky-800">
        <i data-lucide="external-link" class="w-4 h-4"></i> Baca
      </a>
    `;
    return el;
  }

  function renderList(q=''){
    const list = $('#artikelList');
    const empty= $('#artikelEmpty');
    if(!list) return;

    const s = (q||'').toLowerCase().trim();
    const data = CACHE.filter(a=>{
      const tags=(a.tag||'').toLowerCase();
      return !s ||
        (a.title||'').toLowerCase().includes(s) ||
        (a.excerpt||'').toLowerCase().includes(s) ||
        tags.includes(s);
    });

    list.innerHTML='';
    if(!data.length){
      empty?.classList.remove('hidden');
      return;
    }
    empty?.classList.add('hidden');

    data.forEach(a=> list.appendChild(card(a)));
    lucide.createIcons();
  }

  function renderIndex(){
    const wrap = $('#wrapArtikel');
    const empty= $('#artikelEmpty');
    if(!wrap) return;

    wrap.innerHTML='';
    if(!CACHE.length){
      empty?.classList.remove('hidden');
      return;
    }
    empty?.classList.add('hidden');

    // Di index, tampilkan 6 artikel pertama
    CACHE.slice(0,6).forEach(a=> wrap.appendChild(card(a)));
    lucide.createIcons();
  }

  async function init(){
    const isPage = !!$('#artikelList');
    const isIndex = !!$('#wrapArtikel');

    if(!isPage && !isIndex) return;

    const rows = await DataStore.artikel(FALLBACK);
    CACHE = (rows||[]).map(normalize);

    if(isPage){
      $('#searchArtikel')?.addEventListener('input', (e)=> renderList(e.target.value));
      renderList($('#searchArtikel')?.value||'');
    }
    if(isIndex){
      renderIndex();
      // index punya search #searchArtikel juga (di tab artikel)
      $('#searchArtikel')?.addEventListener('input', (e)=> renderIndex()); // sederhana
    }
  }

  return { init };
})();

// ========== Info Tabs (Pengumuman vs Artikel pada index) ==========
export const InfoTabsModule = (function(){
  function show(which){
    const wrapP = $('#wrapPengumuman');
    const wrapA = $('#wrapArtikel');
    const tabs  = $('#tabs');
    const btnP  = $('#tabPengumuman');
    const btnA  = $('#tabArtikel');
    if(!wrapP || !wrapA || !tabs || !btnP || !btnA) return;

    const active = 'border-fig-primaryDark bg-white shadow';
    const inactive = 'border-slate-300 bg-slate-50';

    if(which === 'artikel'){
      wrapP.classList.add('hidden');
      wrapA.classList.remove('hidden');
      tabs.classList.remove('tab-left'); tabs.classList.add('tab-right');

      btnP.classList.remove(...active.split(' '));
      btnP.classList.add(...inactive.split(' '));

      btnA.classList.remove(...inactive.split(' '));
      btnA.classList.add(...active.split(' '));
    }else{
      wrapA.classList.add('hidden');
      wrapP.classList.remove('hidden');
      tabs.classList.remove('tab-right'); tabs.classList.add('tab-left');

      btnA.classList.remove(...active.split(' '));
      btnA.classList.add(...inactive.split(' '));

      btnP.classList.remove(...inactive.split(' '));
      btnP.classList.add(...active.split(' '));
    }
  }

  function init(){
    if(!$('#tabPengumuman') || !$('#tabArtikel')) return;
    $('#tabPengumuman').addEventListener('click', ()=> show('pengumuman'));
    $('#tabArtikel').addEventListener('click', ()=> show('artikel'));
    show('pengumuman'); // default
  }
  return { init };
})();

// ========== Kajian ==========
export const KajianModule = (function(){
  const FALLBACK = [
    {
      tanggal: '2026-01-10',
      waktu: '19:30',
      judul: 'Tafsir Surat Al-Mulk',
      pemateri: 'Ustadz (isi di Google Sheet)',
      platform: 'YouTube',
      link: '#',
      poster: '',
      catatan: 'Contoh data. Silakan ganti via Google Sheet.',
      status: 'aktif'
    }
  ];

  let CACHE = [];

  function parseDT(tanggal, waktu){
    if(!tanggal) return NaN;
    const t = (waktu && /^\d{1,2}:\d{2}$/.test(waktu)) ? waktu : '00:00';
    return new Date(`${tanggal}T${t}:00`).getTime();
  }

  function normalize(row){
    return {
      tanggal:  row.tanggal || row.date || '',
      waktu:    row.waktu || row.time || '',
      judul:    row.judul || row.title || '',
      pemateri: row.pemateri || row.ustadz || row.speaker || '',
      platform: row.platform || row.media || '',
      link:     row.link || row.url || '',
      poster:   row.poster || row.image || row.img || '',
      catatan:  row.catatan || row.note || row.desc || '',
      status:   (row.status || '').toLowerCase() || 'aktif',
    };
  }

  function isActive(k){ return (k.status||'').toLowerCase() !== 'arsip'; }

  function upcomingSorted(list){
    const now = Date.now();
    const arr = list
      .filter(isActive)
      .map(k => ({...k, _ts: parseDT(k.tanggal, k.waktu)}))
      .filter(k => !Number.isNaN(k._ts))
      .filter(k => k._ts >= (now - 24*60*60*1000));
    arr.sort((a,b)=> a._ts - b._ts);
    return arr;
  }

  function card(k){
    const dateLabel = (k.tanggal ? k.tanggal : '') + (k.waktu ? ` • ${k.waktu}` : '');
    const poster = k.poster
      ? `<img src="${k.poster}" alt="Poster kajian" class="w-full h-40 object-cover rounded-xl border border-slate-200 bg-slate-50">`
      : '';
    const linkBtn = k.link
      ? `<a href="${k.link}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-sky-700 hover:text-sky-800">
           <i data-lucide="external-link" class="w-4 h-4"></i> Buka Link
         </a>`
      : '';

    const el = document.createElement('article');
    el.className = 'rounded-2xl border border-slate-200 bg-white p-5 shadow';
    el.innerHTML = `
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="font-extrabold text-slate-900">${k.judul || 'Kajian'}</h3>
          <p class="text-sm text-slate-600 mt-1">${dateLabel}</p>
        </div>
        <span class="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">${k.platform || 'Kajian'}</span>
      </div>
      ${poster ? `<div class="mt-4">${poster}</div>` : ''}
      ${k.pemateri ? `<p class="text-sm text-slate-700 mt-4"><span class="font-semibold">Pemateri:</span> ${k.pemateri}</p>` : ''}
      ${k.catatan ? `<p class="text-sm text-slate-600 mt-2">${k.catatan}</p>` : ''}
      ${linkBtn}
    `;
    return el;
  }

  function renderList(targetId, emptyId, query='', platform=''){
    const wrap = $(targetId);
    const empty = $(emptyId);
    if(!wrap) return;

    const q = (query || '').toLowerCase().trim();
    const p = (platform || '').toLowerCase().trim();

    const data = upcomingSorted(CACHE).filter(k=>{
      const okText = !q ||
        (k.judul||'').toLowerCase().includes(q) ||
        (k.pemateri||'').toLowerCase().includes(q) ||
        (k.catatan||'').toLowerCase().includes(q);
      const okPlat = !p || (k.platform||'').toLowerCase() === p;
      return okText && okPlat;
    });

    wrap.innerHTML = '';
    if(!data.length){
      empty?.classList.remove('hidden');
      return;
    }
    empty?.classList.add('hidden');

    data.forEach(k=> wrap.appendChild(card(k)));
    lucide.createIcons();
  }

  function fillPlatformOptions(){
    const sel = $('#filterPlatform');
    if(!sel) return;
    const set = new Set(upcomingSorted(CACHE).map(k=> (k.platform||'').trim()).filter(Boolean));
    const opts = [''].concat([...set]);
    sel.innerHTML = opts.map(v=> `<option value="${v}">${v || 'Semua Platform'}</option>`).join('');
  }

  async function load(){
    const rows = await DataStore.kajian(FALLBACK);
    CACHE = (rows || []).map(normalize);
  }

  async function init(){
    const latestWrap = $('#kajianLatestList'); // index
    const pageWrap   = $('#kajianList');       // kajian.html
    if(!latestWrap && !pageWrap) return;

    await load();
    fillPlatformOptions();

    if(latestWrap){
      const data = upcomingSorted(CACHE).slice(0,3);
      latestWrap.innerHTML = '';
      if(!data.length){
        $('#kajianLatestEmpty')?.classList.remove('hidden');
      }else{
        $('#kajianLatestEmpty')?.classList.add('hidden');
        data.forEach(k => latestWrap.appendChild(card(k)));
        lucide.createIcons();
      }
    }

    if(pageWrap){
      const search = $('#searchKajian');
      const filter = $('#filterPlatform');
      const render = ()=> renderList('#kajianList', '#kajianEmpty', search?.value||'', filter?.value||'');
      search?.addEventListener('input', render);
      filter?.addEventListener('change', render);
      render();
    }
  }

  return { init };
})();

// ========== Kegiatan Terdekat (Agenda/Event dari Google Sheet) ==========
export const KegiatanAgendaModule = (function(){
  const FALLBACK = [
    { tanggal:'2026-01-12', waktu:'09:00', title:'Kerja Bakti Masjid', lokasi:'Masjid', pemateri:'', desc:'Contoh data agenda. Isi via Google Sheet.', poster:'', link:'#', status:'aktif' }
  ];
  let CACHE=[];

  function parseDT(tanggal,waktu){
    if(!tanggal) return NaN;
    const t = (waktu && /^\d{1,2}:\d{2}$/.test(waktu)) ? waktu : '00:00';
    return new Date(`${tanggal}T${t}:00`).getTime();
  }

  function normalize(r){
    return {
      tanggal: r.tanggal || r.date || '',
      waktu: r.waktu || r.time || '',
      title: r.title || r.nama || r.kegiatan || r.judul || '',
      lokasi: r.lokasi || r.tempat || '',
      pemateri: r.pemateri || r.speaker || '',
      desc: r.desc || r.deskripsi || r.catatan || '',
      poster: r.poster || r.image || '',
      link: r.link || r.url || '',
      status: (r.status || '').toLowerCase() || 'aktif'
    };
  }

  function isActive(x){ return (x.status||'').toLowerCase() !== 'arsip'; }

  function upcoming(list){
    const now = Date.now();
    const arr = list
      .filter(isActive)
      .map(x=>({...x,_ts:parseDT(x.tanggal,x.waktu)}))
      .filter(x=>!Number.isNaN(x._ts))
      .filter(x=>x._ts >= (now - 24*60*60*1000));
    arr.sort((a,b)=>a._ts-b._ts);
    return arr;
  }

  function itemRow(x){
    const dateLabel = (x.tanggal ? x.tanggal : '') + (x.waktu ? ` • ${x.waktu}` : '');
    const poster = x.poster
      ? `<img src="${x.poster}" alt="Poster kegiatan" class="w-full h-28 object-cover rounded-xl border border-slate-200 bg-slate-50">`
      : '';
    const linkBtn = x.link
      ? `<a href="${x.link}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-800 mt-3">
           <i data-lucide="external-link" class="w-4 h-4"></i> Detail
         </a>`
      : '';

    const el = document.createElement('div');
    el.className = 'rounded-2xl border border-slate-200 bg-white p-5 shadow';
    el.innerHTML = `
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="font-extrabold text-slate-900">${x.title || 'Kegiatan'}</h3>
          <p class="text-sm text-slate-600 mt-1">${dateLabel}</p>
          ${x.lokasi ? `<p class="text-sm text-slate-700 mt-2"><span class="font-semibold">Lokasi:</span> ${x.lokasi}</p>` : ''}
          ${x.pemateri ? `<p class="text-sm text-slate-700 mt-1"><span class="font-semibold">Pemateri:</span> ${x.pemateri}</p>` : ''}
        </div>
      </div>
      ${poster ? `<div class="mt-4">${poster}</div>` : ''}
      ${x.desc ? `<p class="text-sm text-slate-600 mt-3">${x.desc}</p>` : ''}
      ${linkBtn}
    `;
    return el;
  }

  async function init(){
    const homeWrap = $('#kegiatanUpcomingList'); // index
    const pageWrap = $('#kegiatanAgendaList');   // kegiatan.html
    if(!homeWrap && !pageWrap) return;

    const rows = await DataStore.kegiatan(FALLBACK);
    CACHE = (rows||[]).map(normalize);

    const data = upcoming(CACHE);

    if(homeWrap){
      homeWrap.innerHTML = '';
      const items = data.slice(0,3);
      if(!items.length){
        $('#kegiatanUpcomingEmpty')?.classList.remove('hidden');
      }else{
        $('#kegiatanUpcomingEmpty')?.classList.add('hidden');
        items.forEach(x=> homeWrap.appendChild(itemRow(x)));
        lucide.createIcons();
      }
    }

    if(pageWrap){
      pageWrap.innerHTML = '';
      if(!data.length){
        $('#kegiatanAgendaEmpty')?.classList.remove('hidden');
      }else{
        $('#kegiatanAgendaEmpty')?.classList.add('hidden');
        data.forEach(x=> pageWrap.appendChild(itemRow(x)));
        lucide.createIcons();
      }
    }
  }

  return { init };
})();

// ========== Donasi ==========
export const DonasiModule = (function(){
  // Silakan ubah angka ini sesuai kebutuhan
  const TARGET_JPY = 500000;
  let terkumpulJPY = 0;

  function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

  function setProgress(){
    const bar = $('#progressBar');
    const percentLabel = $('#percentLabel');
    const terkumpulLabel = $('#terkumpulLabel');
    const targetLabel = $('#targetLabel');
    if(!bar || !percentLabel || !terkumpulLabel || !targetLabel) return;

    const pct = clamp(Math.round((terkumpulJPY / TARGET_JPY) * 100), 0, 100);
    bar.style.width = pct + '%';
    percentLabel.textContent = pct;
    terkumpulLabel.textContent = fmtJPY(terkumpulJPY);
    targetLabel.textContent = fmtJPY(TARGET_JPY);
  }

  function init(){
    if(!$('#progressBar')) return;
    setProgress();

    const inputJPY = $('#inputJPY');
    const inputIDR = $('#inputIDR');
    const rate = 110; // contoh kurs (ubah sesuai kebutuhan)
    const quicks = $$('.quick-jpy');

    quicks.forEach(b=>{
      b.addEventListener('click', ()=>{
        const v = Number(b.dataset.v||0);
        if(inputJPY) inputJPY.value = String(v);
        if(inputIDR) inputIDR.value = String(Math.round(v*rate));
      });
    });

    inputJPY?.addEventListener('input', ()=>{
      const v = Number(inputJPY.value||0);
      if(inputIDR) inputIDR.value = String(Math.round(v*rate));
    });
    inputIDR?.addEventListener('input', ()=>{
      const v = Number(inputIDR.value||0);
      if(inputJPY) inputJPY.value = String(Math.round(v/rate));
    });

    $('#donasiBtn')?.addEventListener('click', ()=>{
      alert('Silakan hubungi pengurus masjid untuk info donasi. (Tombol ini bisa Anda arahkan ke rekening/QRIS.)');
    });
  }

  return { init };
})();

// ========== Boot ==========
export function boot(){
  document.getElementById('year') && ($('#year').textContent = new Date().getFullYear());
  lucide.createIcons();

  Admin.setup();             // menyembunyikan tombol admin untuk non-admin
  AdminDataModal.init();     // aman: tidak tampil tanpa admin

  // halaman index: tab info
  InfoTabsModule.init();

  SholatWidget.init();
  KegiatanModule.init();         // galeri/slider foto
  KegiatanAgendaModule.init();   // kegiatan terdekat (agenda)
  PengumumanModule.init();
  ArtikelModule.init();
  KajianModule.init();
  DonasiModule.init();
}
