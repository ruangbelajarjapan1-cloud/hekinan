<!-- simpan file ini sebagai app.js di folder yang sama -->
<script type="module">
// ========== Utils ==========
export const $  = (s, r=document)=> r.querySelector(s);
export const $$ = (s, r=document)=> [...r.querySelectorAll(s)];
export const fmtJPY = n => new Intl.NumberFormat('id-ID',{style:'currency',currency:'JPY',maximumFractionDigits:0}).format(n||0);
export const fmtIDR = n => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n||0);
export function once(fn){ let d=false; return (...a)=>{ if(d) return; d=true; fn(...a);}}

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
    // Shortcut: Ctrl+Alt+A untuk login admin dengan kode
    document.addEventListener('keydown', (e)=>{
      if(e.ctrlKey && e.altKey && e.key.toLowerCase()==='a'){
        const code = prompt('Masukkan kode admin:');
        if(code===CODE){ localStorage.setItem(KEY,'1'); alert('Admin mode aktif.'); revealButtons(); }
        else if(code) alert('Kode salah.');
      }
    });
  }
  return { isAdmin, setup, revealButtons };
})();

// ========== Data Source (CSV / JSON / sample) ==========
export const DataStore = (function(){
  const cfg = {
    pengumuman: { sheetCsv: localStorage.getItem('sheet_pengumuman')||'', json:'pengumuman.json' },
    artikel:    { sheetCsv: localStorage.getItem('sheet_artikel')||'',    json:'artikel.json'    },
  };
  function parseCSV(text){
    return text.trim().split(/\r?\n/).map(r=>r.split(',').map(c=>c.trim()));
  }
  async function loadFromCsv(url){
    if(!url) return null;
    try{
      const txt = await fetch(url, {cache:'no-store'}).then(r=>r.text());
      const rows = parseCSV(txt); if(!rows.length) return [];
      const head = rows[0].map(h=>h.toLowerCase());
      return rows.slice(1).map(cols=>{ const o={}; head.forEach((h,i)=> o[h]=cols[i]||'' ); return o; });
    }catch{ return null; }
  }
  async function loadFromJson(url){ try{ return await fetch(url,{cache:'no-store'}).then(r=>r.json()); }catch{ return null; } }
  function saveSheet(key, url){ if(url) localStorage.setItem(key, url); else localStorage.removeItem(key); }

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
    }
  };
})();

// ========== Modal Data (admin only) ==========
export const AdminDataModal = (function(){
  function open(){ const m=$('#dataModal'); if(!m) return; $('#csvPengumuman').value=localStorage.getItem('sheet_pengumuman')||''; $('#csvArtikel').value=localStorage.getItem('sheet_artikel')||''; m.classList.remove('hidden'); m.classList.add('flex'); }
  function close(){ const m=$('#dataModal'); if(!m) return; m.classList.add('hidden'); m.classList.remove('flex'); }
  function init(){
    const openBtn = $('#openData'); const closeBtn = $('#closeData'); const saveBtn = $('#saveData');
    if(openBtn) openBtn.addEventListener('click', (e)=>{ e.preventDefault(); open(); });
    if(closeBtn) closeBtn.addEventListener('click', close);
    $('#dataModal')?.addEventListener('click', (e)=>{ if(e.target.id==='dataModal') close(); });
    if(saveBtn) saveBtn.addEventListener('click', ()=>{
      DataStore.saveSheet('sheet_pengumuman', $('#csvPengumuman').value.trim());
      DataStore.saveSheet('sheet_artikel',    $('#csvArtikel').value.trim());
      alert('Sumber data tersimpan. Silakan refresh halaman konten.');
      close();
    });
  }
  return { init, open, close };
})();

// ========== SholatWidget ==========
export const SholatWidget = (function(){
  async function getLoc(){ return new Promise(res=>{ if(!navigator.geolocation) return res(null); navigator.geolocation.getCurrentPosition(p=>res({lat:p.coords.latitude,lon:p.coords.longitude}),()=>res(null)); }); }
  async function city(lat,lon){ try{ const j=await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`).then(r=>r.json()); return j.address?.city||j.address?.town||j.address?.state||'Tidak diketahui'; }catch{return 'Tidak diketahui'} }
  async function times(lat,lon){ const j=await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`).then(r=>r.json()); return j.data?.timings; }
  function tile(ic,label,val){ const d=document.createElement('div'); d.className='rounded-2xl border border-slate-200 bg-white p-4 text-center hover:shadow'; d.innerHTML=`<i data-lucide="${ic}" class="w-5 h-5 mx-auto text-sky-600 mb-2"></i><div class="text-xs text-slate-500">${label}</div><div class="text-lg font-bold text-slate-900">${val||'—'}</div>`; return d; }

  async function render(){
    const grid = $('#sholatGrid'); const btn=$('#refreshSholat'); const lab=$('#locLabel');
    if(!grid) return;
    btn?.classList.add('animate-spin'); grid.innerHTML='<p class="col-span-6 text-center text-slate-500">Memuat...</p>';
    const loc = await getLoc() || {lat:34.884,lon:136.993}; const cname = await city(loc.lat,loc.lon); lab && (lab.textContent=`Lokasi: ${cname} • (${loc.lat.toFixed(3)}, ${loc.lon.toFixed(3)})`);
    try{
      const t = await times(loc.lat,loc.lon); grid.innerHTML='';
      [['Fajr','sunrise','Subuh'],['Sunrise','sun','Syuruq'],['Dhuhr','clock','Dzuhur'],['Asr','cloud-sun','Ashar'],['Maghrib','moon','Maghrib'],['Isha','star','Isya']].forEach(([k,ic,l])=> grid.appendChild(tile(ic,l,t[k])));
      lucide.createIcons();
    }catch{ grid.innerHTML='<p class="col-span-6 text-center text-red-600">Gagal memuat jadwal.</p>'; }
    btn?.classList.remove('animate-spin');
  }
  function init(){ if(!$('#sholatGrid')) return; $('#refreshSholat')?.addEventListener('click', render); render(); }
  return { init };
})();

// ========== Kegiatan (slideshow) ==========
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
  const SAMPLE = [
    { title:"Kajian Ahad Pagi", date:"2025-11-10", desc:"Kajian rutin ba’da Subuh.", link:"#"},
    { title:"Open Donasi Perbaikan Wudhu", date:"2025-11-15", desc:"Bantu perbaikan area wudhu.", link:"#"},
  ];
  function card({title,date,desc,link}){
    const el=document.createElement('article'); el.className='rounded-2xl border border-slate-200 bg-white p-5 shadow';
    const dt=date?new Date(date):null; const d=dt&&!isNaN(dt)?dt.toLocaleDateString('id-ID',{weekday:'short',year:'numeric',month:'short',day:'numeric'}):'';
    el.innerHTML=`<div class="text-xs text-slate-500">${d}</div><h3 class="mt-1 font-bold text-slate-900">${title||''}</h3><p class="mt-2 text-sm text-slate-700">${desc||''}</p>${link?`<a href="${link}" class="inline-flex items-center gap-2 mt-3 text-sky-700 hover:underline text-sm"><i data-lucide="arrow-right"></i> Detail</a>`:''}`;
    return el;
  }
  async function init(){
    const wrap = $('#board'); const empty = $('#boardEmpty'); if(!wrap) return;
    const data = await DataStore.pengumuman(SAMPLE);
    wrap.innerHTML=''; if(!data.length){ empty?.classList.remove('hidden'); return; } empty?.classList.add('hidden');
    data.forEach(x=> wrap.appendChild(card(x))); lucide.createIcons();
  }
  return { init };
})();

// ========== Artikel ==========
export const ArtikelModule = (function(){
  const SAMPLE = [
    { title:"Keutamaan Membangun Masjid", tag:"donasi|masjid", excerpt:"Dalil & faedah ringkas.", link:"#"},
    { title:"Adab ke Masjid untuk Anak", tag:"adab|anak", excerpt:"Checklist adab singkat.", link:"#"},
    { title:"Panduan Wudhu Singkat", tag:"fiqih", excerpt:"Tata cara wudhu.", link:"#"}
  ];
  let CACHE=[];
  function render(q=''){
    const list = $('#artikelList'); const empty=$('#artikelEmpty'); if(!list) return;
    const s = q.toLowerCase();
    const data = CACHE.filter(a=>{
      const tags=(a.tag||'').toLowerCase();
      return !s || (a.title||'').toLowerCase().includes(s) || (a.excerpt||'').toLowerCase().includes(s) || tags.includes(s);
    });
    list.innerHTML=''; if(!data.length){ empty?.classList.remove('hidden'); return; } empty?.classList.add('hidden');
    data.forEach(a=>{
      const badges=(a.tag||'').split('|').filter(Boolean).map(t=>`<span class="text-xs px-2 py-1 rounded-full bg-slate-100">${t}</span>`).join('');
      const el=document.createElement('article'); el.className='rounded-2xl border border-slate-200 bg-white p-5 shadow';
      el.innerHTML=`<h3 class="font-bold text-slate-900">${a.title||''}</h3><p class="mt-2 text-sm text-slate-700">${a.excerpt||''}</p><div class="mt-3 flex flex-wrap gap-2">${badges}</div>${a.link?`<a href="${a.link}" class="inline-flex items-center gap-2 mt-4 text-emerald-700 hover:underline text-sm"><i data-lucide="book-open"></i> Baca</a>`:''}`;
      list.appendChild(el);
    });
    lucide.createIcons();
  }
  async function init(){
    if(!$('#artikelList')) return;
    CACHE = await DataStore.artikel(SAMPLE);
    render();
    $('#searchArtikel')?.addEventListener('input', e=>render(e.target.value));
  }
  return { init };
})();

// ========== Donasi (progress + nominal + WA) ==========
export const DonasiModule = (function(){
  const TARGET = 42000000;  // JPY
  const TERKUMPUL = 5290797; // JPY
  const WA_NUMBER = '818013909425';
  function progress(){
    if(!$('#progressBar')) return;
    $('#terkumpulLabel').textContent = fmtJPY(TERKUMPUL);
    $('#targetLabel').textContent = fmtJPY(TARGET);
    const p = Math.min(100, Math.round((TERKUMPUL/TARGET)*100));
    $('#percentLabel').textContent = p;
    const bar = $('#progressBar'); bar.style.width='0%'; requestAnimationFrame(()=> setTimeout(()=> bar.style.width=p+'%', 50));
  }
  function nominal(){
    const j = $('#inputJPY'), r = $('#inputIDR'), btn=$('#donasiBtn'); if(!j || !r || !btn) return;
    $$('.quick-btn-jpy').forEach(b=> b.addEventListener('click', ()=>{ j.value = Number(b.dataset.v)||0; }));
    $$('.quick-btn-idr').forEach(b=> b.addEventListener('click', ()=>{ r.value = Number(b.dataset.v)||0; }));
    btn.addEventListener('click', ()=>{
      const vj = Number(j.value)||0; const vr = Number(r.value)||0;
      if(vj<1000 && vr<10000){ alert('Minimal 1.000 JPY atau 10.000 IDR.'); return; }
      const msg = encodeURIComponent(`Assalamu'alaikum, saya ingin donasi sebesar ${vj>0?fmtJPY(vj):fmtIDR(vr)} untuk Masjid As-Sunnah Hekinan.`);
      window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`,'_blank');
    });
  }
  function copy(){
    $$('[data-copy]').forEach(btn=> btn.addEventListener('click', ()=>{
      const t=$(btn.getAttribute('data-copy')); if(!t) return; navigator.clipboard.writeText(String(t.textContent).trim());
      const o=btn.textContent; btn.textContent='Disalin!'; setTimeout(()=>btn.textContent=o,1200);
    }));
  }
  function init(){ progress(); nominal(); copy(); }
  return { init };
})();

// ========== Bootstrap per halaman ==========
export function boot(){
  document.getElementById('year') && ($('#year').textContent = new Date().getFullYear());
  lucide.createIcons();
  Admin.setup();             // menyembunyikan tombol admin untuk non-admin
  AdminDataModal.init();     // aman: tidak tampil tanpa admin
  SholatWidget.init();
  KegiatanModule.init();
  PengumumanModule.init();
  ArtikelModule.init();
  DonasiModule.init();
}
</script>
