import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { BarChart3, CalendarDays, CheckCircle2, Cloud, Database, Download, FileSpreadsheet, FileText, LogIn, LogOut, Search, TrendingDown, TrendingUp, UploadCloud } from 'lucide-react';
import './styles.css';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const today = new Date().toISOString().slice(0, 10);

const demo = {
  projects: [
    { id: 'demo-project', kode: '11485140', no_spi: '0390/SPI', bulan_spi: '8 June 26', tahun_sp: 2026, name: 'RS HARUM SISMA MEDIKA - NC', nama_proyek: 'RS HARUM SISMA MEDIKA - NC', pekerjaan: 'NC', jenis: 'NC', jenis2: 'PROYEK', wilayah: 'BARAT', project_area: 'BARTEN 1', rekan_kerja: 'SANDANA', dok_spk_term_payment: 'Progress 30% - dibayarkan', status: 'PROGRESS', sheet_progress_percent: 0, tgl_ba_bast: null, start_date: '2026-06-10', end_date: '2026-06-26', duration_days: 17, delay_days: -1, tgl_retensi: null, nama_relasi: '', pic_sales: 'ANNISA', pic_teknik: '', owner: 'RS Harum Sisma Medika', location: 'BARAT', contract_value: 30000000, nilai_kontrak: 30000000 }
  ],
  items: [
    { id: 'ok1-hpl', project_id: 'demo-project', area: 'OK 1', code: '1', description: 'Antibacterial HPL Cladding Wall Panel', unit: 'm2', volume: 62.1, unit_price: 3724400, total_price: 231285240 },
    { id: 'ok1-glass', project_id: 'demo-project', area: 'OK 1', code: '2', description: 'Glass Cladding Wall Panel', unit: 'm2', volume: 9.9, unit_price: 5959100, total_price: 58995090 },
    { id: 'ok1-ceiling', project_id: 'demo-project', area: 'OK 1', code: '3', description: 'Medical Panel Ceiling System', unit: 'm2', volume: 43, unit_price: 730000, total_price: 31390000 },
    { id: 'ok1-light', project_id: 'demo-project', area: 'OK 1', code: '4', description: 'Lighting Fixture', unit: 'unit', volume: 12, unit_price: 1117400, total_price: 13408800 },
    { id: 'ok1-door', project_id: 'demo-project', area: 'OK 1', code: '5', description: 'Air Tight Sealed Automatic Single Sliding Door', unit: 'unit', volume: 1, unit_price: 59590400, total_price: 59590400 },
    { id: 'ok1-floor', project_id: 'demo-project', area: 'OK 1', code: '6', description: 'Electrostatic Conductive Floor System', unit: 'm2', volume: 47, unit_price: 908800, total_price: 42713600 },
    { id: 'ok1-hvac', project_id: 'demo-project', area: 'OK 1', code: '13', description: 'Air Conditioner AHU UNIPRO, HVAC', unit: 'unit', volume: 1, unit_price: 893854800, total_price: 893854800 },
    { id: 'ok2-hpl', project_id: 'demo-project', area: 'OK 2', code: '1', description: 'Antibacterial HPL Cladding Wall Panel', unit: 'm2', volume: 63.1, unit_price: 3724400, total_price: 235009640 },
    { id: 'ok2-ceiling', project_id: 'demo-project', area: 'OK 2', code: '3', description: 'Medical Panel Ceiling System', unit: 'm2', volume: 45, unit_price: 730000, total_price: 32850000 },
    { id: 'ok5-hpl', project_id: 'demo-project', area: 'OK 5', code: '1', description: 'Antibacterial HPL Cladding Wall Panel', unit: 'm2', volume: 54, unit_price: 3724400, total_price: 201117600 },
    { id: 'ok6-hpl', project_id: 'demo-project', area: 'OK 6', code: '1', description: 'Antibacterial HPL Cladding Wall Panel', unit: 'm2', volume: 55, unit_price: 3724400, total_price: 204842000 }
  ],
  targets: [
    { id: 't1', project_id: 'demo-project', period_date: '2026-06-07', planned_percent: 2 },
    { id: 't2', project_id: 'demo-project', period_date: '2026-06-14', planned_percent: 5 },
    { id: 't3', project_id: 'demo-project', period_date: '2026-06-21', planned_percent: 10 },
    { id: 't4', project_id: 'demo-project', period_date: '2026-06-28', planned_percent: 17 },
    { id: 't5', project_id: 'demo-project', period_date: '2026-07-05', planned_percent: 25 },
    { id: 't6', project_id: 'demo-project', period_date: '2026-07-12', planned_percent: 34 },
    { id: 't7', project_id: 'demo-project', period_date: '2026-07-19', planned_percent: 45 },
    { id: 't8', project_id: 'demo-project', period_date: '2026-07-26', planned_percent: 57 },
    { id: 't9', project_id: 'demo-project', period_date: '2026-08-02', planned_percent: 69 },
    { id: 't10', project_id: 'demo-project', period_date: '2026-08-09', planned_percent: 79 },
    { id: 't11', project_id: 'demo-project', period_date: '2026-08-16', planned_percent: 87 },
    { id: 't12', project_id: 'demo-project', period_date: '2026-08-23', planned_percent: 93 },
    { id: 't13', project_id: 'demo-project', period_date: '2026-08-30', planned_percent: 97 },
    { id: 't14', project_id: 'demo-project', period_date: '2026-09-06', planned_percent: 100 }
  ],
  uploads: [],
  entries: [
    { id: 'e1', project_id: 'demo-project', boq_item_id: 'ok1-hpl', entry_date: '2026-06-07', actual_volume: 12, actual_percent: 19.32, notes: 'Mockup & pemasangan awal' },
    { id: 'e2', project_id: 'demo-project', boq_item_id: 'ok1-ceiling', entry_date: '2026-06-07', actual_volume: 8, actual_percent: 18.6, notes: 'Panel area awal' },
    { id: 'e3', project_id: 'demo-project', boq_item_id: 'ok2-hpl', entry_date: '2026-06-14', actual_volume: 10, actual_percent: 15.85, notes: 'Start OK 2' }
  ]
};

demo.items = demo.items.map((item) => ({
  ...item,
  weight_percent: Number(((item.total_price / demo.projects[0].contract_value) * 100).toFixed(4))
}));

function safeFileName(name) {
  return String(name || 'export').replace(/[^a-z0-9-_]+/gi, '-').replace(/^-+|-+$/g, '').slice(0, 90) || 'export';
}
function downloadBlob(filename, content, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 200);
}
function csvEscape(value) {
  const s = value == null ? '' : String(value);
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function toCsv(rows) {
  return rows.map(row => row.map(csvEscape).join(';')).join('\n');
}
function rupiah(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
}
function pct(value, digits = 2) {
  return `${Number(value || 0).toFixed(digits)}%`;
}
function clamp(n, min, max) { return Math.min(Math.max(Number(n || 0), min), max); }

function projectTitle(project) {
  return project?.nama_proyek || project?.name || 'Tanpa nama proyek';
}
function projectStatus(project) {
  return project?.status || project?.sheet_status || '-';
}
function projectOptionLabel(project) {
  return [project?.no_spi, projectTitle(project), projectStatus(project)].filter(Boolean).join(' — ');
}
function projectSearchText(project) {
  return [project?.kode, project?.no_spi, projectTitle(project), project?.pekerjaan, project?.jenis, project?.jenis2, project?.wilayah, project?.project_area, project?.rekan_kerja, project?.nama_relasi, project?.pic_sales, project?.pic_teknik, projectStatus(project)].filter(Boolean).join(' ').toLowerCase();
}

function latestEntriesByItem(entries, upToDate) {
  const map = new Map();
  entries
    .filter((e) => !upToDate || e.entry_date <= upToDate)
    .sort((a, b) => `${a.entry_date}-${a.id}`.localeCompare(`${b.entry_date}-${b.id}`))
    .forEach((e) => map.set(e.boq_item_id, e));
  return map;
}

function actualCumulative(items, entries, upToDate) {
  const latest = latestEntriesByItem(entries, upToDate);
  return items.reduce((sum, item) => {
    const e = latest.get(item.id);
    return sum + (Number(item.weight_percent || 0) * clamp(e?.actual_percent, 0, 100) / 100);
  }, 0);
}

function plannedAt(targets, date) {
  const valid = targets.filter((t) => t.period_date <= date).sort((a,b) => a.period_date.localeCompare(b.period_date));
  return valid.length ? Number(valid[valid.length - 1].planned_percent) : 0;
}

function buildCurve(targets, items, entries) {
  const dates = Array.from(new Set([...targets.map(t => t.period_date), ...entries.map(e => e.entry_date)])).sort();
  return dates.map((date) => ({
    date,
    planned: plannedAt(targets, date),
    actual: actualCumulative(items, entries, date)
  }));
}

function SChart({ data }) {
  const width = 900, height = 320, pad = 42;
  const maxY = Math.max(100, ...data.flatMap(d => [d.planned, d.actual]));
  const x = (i) => pad + (data.length <= 1 ? 0 : i * (width - pad * 2) / (data.length - 1));
  const y = (v) => height - pad - (v / maxY) * (height - pad * 2);
  const line = (key) => data.map((d, i) => `${x(i)},${y(d[key])}`).join(' ');
  return <div className="chart-wrap">
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Grafik Kurva S target dan aktual">
      <defs>
        <linearGradient id="gridFade" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#e5e7eb"/><stop offset="100%" stopColor="#f3f4f6"/></linearGradient>
      </defs>
      {[0,25,50,75,100].map((v) => <g key={v}>
        <line x1={pad} x2={width-pad} y1={y(v)} y2={y(v)} stroke="url(#gridFade)" strokeWidth="1" />
        <text x="8" y={y(v)+4} fontSize="12" fill="#6b7280">{v}%</text>
      </g>)}
      <polyline points={line('planned')} fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={line('actual')} fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => <g key={d.date}>
        <circle cx={x(i)} cy={y(d.planned)} r="4" fill="#f59e0b" />
        <circle cx={x(i)} cy={y(d.actual)} r="4" fill="#2563eb" />
        {i % Math.ceil(data.length / 6 || 1) === 0 && <text x={x(i)} y={height-12} fontSize="11" fill="#6b7280" textAnchor="middle">{d.date.slice(5)}</text>}
      </g>)}
    </svg>
    <div className="legend"><span><i className="planned"/> Target</span><span><i className="actual"/> Aktual</span></div>
  </div>;
}

function Login({ onDemo }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const signIn = async (e) => {
    e.preventDefault();
    if (!supabase) return onDemo();
    setBusy(true); setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setMessage(error.message);
  };
  return <main className="login-shell">
    <section className="login-card">
      <div className="brand"><BarChart3 size={32}/><div><h1>RAB S-Curve</h1><p>Progress target vs aktual berbasis Supabase</p></div></div>
      <form onSubmit={signIn} className="login-form">
        <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="koordinator@perusahaan.com" required={!!supabase}/></label>
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required={!!supabase}/></label>
        <button className="primary" disabled={busy}><LogIn size={18}/>{busy ? 'Masuk...' : supabase ? 'Masuk' : 'Buka Mode Demo'}</button>
        {message && <p className="error">{message}</p>}
      </form>
      {!supabase && <div className="demo-note"><Database size={18}/> Env Supabase belum diisi, aplikasi berjalan dengan data demo dari RAB lampiran.</div>}
    </section>
  </main>;
}

function Metric({ icon, label, value, sub, tone }) {
  return <div className={`metric ${tone || ''}`}>{icon}<div><span>{label}</span><strong>{value}</strong>{sub && <small>{sub}</small>}</div></div>;
}

function App() {
  const [session, setSession] = useState(null);
  const [demoMode, setDemoMode] = useState(!supabase);
  const [projects, setProjects] = useState([]);
  const [items, setItems] = useState([]);
  const [targets, setTargets] = useState([]);
  const [entries, setEntries] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [projectSearch, setProjectSearch] = useState('');
  const [projectStatusFilter, setProjectStatusFilter] = useState('ALL');
  const [wilayahFilter, setWilayahFilter] = useState('ALL');
  const [statusDate, setStatusDate] = useState(today);
  const [area, setArea] = useState('ALL');
  const [query, setQuery] = useState('');
  const [form, setForm] = useState({ boq_item_id: '', entry_date: today, actual_volume: '', actual_percent: '', notes: '' });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!supabase) { setDemoData(); return; }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (demoMode) setDemoData();
    else if (session) loadRemote();
  }, [session, demoMode]);

  function setDemoData() {
    setProjects(demo.projects); setItems(demo.items); setTargets(demo.targets); setEntries(demo.entries); setUploads(demo.uploads || []);
    setSelectedProjectId(demo.projects[0].id); setLoading(false);
  }

  async function loadRemote() {
    setLoading(true);
    const [{ data: p, error: pe }, { data: i, error: ie }, { data: t, error: te }, { data: e, error: ee }, { data: u, error: ue }] = await Promise.all([
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('boq_items').select('*').order('area').order('code'),
      supabase.from('progress_targets').select('*').order('period_date'),
      supabase.from('progress_entries').select('*').order('entry_date'),
      supabase.from('rab_uploads').select('*').order('created_at', { ascending: false })
    ]);
    if (pe || ie || te || ee || ue) setToast([pe, ie, te, ee, ue].filter(Boolean).map(x => x.message).join(' | '));
    setProjects(p || []); setItems(i || []); setTargets(t || []); setEntries(e || []); setUploads(u || []);
    if (!selectedProjectId && p?.length) setSelectedProjectId(p[0].id);
    setLoading(false);
  }

  const projectStatuses = useMemo(() => ['ALL', ...Array.from(new Set(projects.map(projectStatus).filter(Boolean))).sort()], [projects]);
  const projectWilayahs = useMemo(() => ['ALL', ...Array.from(new Set(projects.map(p => p.wilayah).filter(Boolean))).sort()], [projects]);
  const filteredProjects = useMemo(() => projects.filter(p =>
    (projectStatusFilter === 'ALL' || projectStatus(p) === projectStatusFilter) &&
    (wilayahFilter === 'ALL' || p.wilayah === wilayahFilter) &&
    projectSearchText(p).includes(projectSearch.toLowerCase())
  ), [projects, projectSearch, projectStatusFilter, wilayahFilter]);
  const project = projects.find(p => p.id === selectedProjectId) || projects[0];
  const projectItems = useMemo(() => items.filter(i => i.project_id === project?.id), [items, project]);
  const projectTargets = useMemo(() => targets.filter(t => t.project_id === project?.id), [targets, project]);
  const projectEntries = useMemo(() => entries.filter(e => e.project_id === project?.id), [entries, project]);
  const latest = useMemo(() => latestEntriesByItem(projectEntries, statusDate), [projectEntries, statusDate]);
  const filteredItems = useMemo(() => projectItems.filter(i => (area === 'ALL' || i.area === area) && `${i.area || i.section_name || ''} ${i.section_code || ''} ${i.code} ${i.description}`.toLowerCase().includes(query.toLowerCase())), [projectItems, area, query]);
  const areas = useMemo(() => ['ALL', ...Array.from(new Set(projectItems.map(i => i.area))).sort()], [projectItems]);
  const totalValue = project?.contract_value || projectItems.reduce((a,b)=>a+Number(b.total_price||0),0);
  const planned = plannedAt(projectTargets, statusDate);
  const actual = actualCumulative(projectItems, projectEntries, statusDate);
  const deviation = actual - planned;
  const spi = planned > 0 ? actual / planned : 0;
  const curve = buildCurve(projectTargets, projectItems, projectEntries);

  function selectItemForProgress(item) {
    const last = latest.get(item.id);
    setForm({ boq_item_id: item.id, entry_date: statusDate, actual_volume: last?.actual_volume || '', actual_percent: last?.actual_percent || '', notes: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function saveProgress(e) {
    e.preventDefault();
    if (!project) return;
    const payload = {
      project_id: project.id,
      boq_item_id: form.boq_item_id,
      entry_date: form.entry_date,
      actual_volume: Number(form.actual_volume || 0),
      actual_percent: clamp(form.actual_percent, 0, 100),
      notes: form.notes || null,
      created_by: session?.user?.id || null
    };
    if (!payload.boq_item_id) return setToast('Pilih item pekerjaan terlebih dahulu.');
    if (demoMode) {
      setEntries(prev => [...prev, { ...payload, id: crypto.randomUUID() }]);
      setToast('Progress demo tersimpan.');
    } else {
      const { error } = await supabase.from('progress_entries').insert(payload);
      if (error) setToast(error.message); else { setToast('Progress tersimpan.'); await loadRemote(); }
    }
    setForm({ boq_item_id: '', entry_date: form.entry_date, actual_volume: '', actual_percent: '', notes: '' });
  }


  async function handleRabUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !project) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    const allowed = ['xlsx', 'xls', 'csv', 'pdf'];
    if (!allowed.includes(ext)) return setToast('Format harus Excel (.xlsx/.xls/.csv) atau PDF.');
    setUploading(true);
    const uploadRecord = {
      project_id: project.id,
      file_name: file.name,
      file_type: ext,
      file_size: file.size,
      status: ext === 'pdf' ? 'stored' : 'uploaded',
      uploaded_by: session?.user?.id || null
    };
    if (demoMode) {
      setUploads(prev => [{ ...uploadRecord, id: crypto.randomUUID(), created_at: new Date().toISOString() }, ...prev]);
      setToast(`File ${file.name} tercatat di mode demo. Untuk produksi file disimpan ke Supabase Storage.`);
      setUploading(false);
      return;
    }
    const storagePath = `${project.id}/${Date.now()}-${safeFileName(file.name)}`;
    const { error: storageError } = await supabase.storage.from('rab-files').upload(storagePath, file, { upsert: false });
    if (storageError) {
      setToast(`Upload gagal: ${storageError.message}. Pastikan bucket rab-files sudah dibuat.`);
      setUploading(false);
      return;
    }
    const { error: dbError } = await supabase.from('rab_uploads').insert({ ...uploadRecord, storage_path: storagePath });
    if (dbError) setToast(dbError.message); else { setToast('File RAB berhasil diupload. Parsing/import bisa dijalankan dari pipeline Google Sheet/Supabase.'); await loadRemote(); }
    setUploading(false);
  }

  function exportExcelFile() {
    if (!project) return;
    const curveRows = curve.map(d => `<tr><td>${d.date}</td><td>${d.planned.toFixed(4)}</td><td>${d.actual.toFixed(4)}</td><td>${(d.actual - d.planned).toFixed(4)}</td></tr>`).join('');
    const itemRows = projectItems.map(item => {
      const last = latest.get(item.id);
      const actualPct = Number(last?.actual_percent || 0);
      const earnedWeight = Number(item.weight_percent || 0) * actualPct / 100;
      return `<tr><td>${item.area}</td><td>${item.code || ''}</td><td>${item.description}</td><td>${item.volume}</td><td>${item.unit || ''}</td><td>${item.total_price}</td><td>${Number(item.weight_percent || 0).toFixed(6)}</td><td>${actualPct.toFixed(4)}</td><td>${earnedWeight.toFixed(6)}</td><td>${last?.notes || ''}</td></tr>`;
    }).join('');
    const entryRows = projectEntries.map(e => {
      const item = projectItems.find(i => i.id === e.boq_item_id);
      return `<tr><td>${e.entry_date}</td><td>${item?.area || item?.section_name || ''}</td><td>${item?.code || ''}</td><td>${item?.description || ''}</td><td>${e.actual_volume}</td><td>${e.actual_percent}</td><td>${e.notes || ''}</td></tr>`;
    }).join('');
    const html = `<!doctype html><html><head><meta charset="utf-8"></head><body>
      <table><tr><th colspan="4">Laporan Kurva S & Progress Aktual</th></tr><tr><td>Project</td><td colspan="3">${projectTitle(project)}</td></tr><tr><td>Status Date</td><td>${statusDate}</td></tr><tr><td>Target</td><td>${planned.toFixed(4)}</td><td>Aktual</td><td>${actual.toFixed(4)}</td></tr><tr><td>Deviasi</td><td>${deviation.toFixed(4)}</td><td>SPI</td><td>${spi ? spi.toFixed(4) : ''}</td></tr></table>
      <br/><table><tr><th colspan="4">DATA KURVA S</th></tr><tr><th>Tanggal</th><th>Target Kumulatif %</th><th>Aktual Kumulatif %</th><th>Deviasi %</th></tr>${curveRows}</table>
      <br/><table><tr><th colspan="10">REKAP ITEM TARGET/AKTUAL</th></tr><tr><th>Area</th><th>Kode</th><th>Uraian</th><th>Volume</th><th>Satuan</th><th>Nilai</th><th>Bobot %</th><th>Aktual Item %</th><th>Aktual Berbobot %</th><th>Catatan Terakhir</th></tr>${itemRows}</table>
      <br/><table><tr><th colspan="7">HISTORI INPUT KOORDINATOR</th></tr><tr><th>Tanggal</th><th>Area</th><th>Kode</th><th>Uraian</th><th>Volume Aktual</th><th>Progress Aktual %</th><th>Catatan</th></tr>${entryRows}</table>
    </body></html>`;
    downloadBlob(`${safeFileName(projectTitle(project))}-kurva-s-${statusDate}.xls`, html, 'application/vnd.ms-excel;charset=utf-8');
  }

  function exportPdfPrint() {
    if (!project) return;
    const curveRows = curve.map(d => `<tr><td>${d.date}</td><td>${d.planned.toFixed(2)}%</td><td>${d.actual.toFixed(2)}%</td><td>${(d.actual-d.planned).toFixed(2)}%</td></tr>`).join('');
    const itemRows = projectItems.map(item => {
      const last = latest.get(item.id);
      const actualPct = Number(last?.actual_percent || 0);
      const earnedWeight = Number(item.weight_percent || 0) * actualPct / 100;
      return `<tr><td>${item.area}</td><td>${item.code || ''}</td><td>${item.description}</td><td>${item.volume} ${item.unit || ''}</td><td>${rupiah(item.total_price)}</td><td>${Number(item.weight_percent || 0).toFixed(4)}%</td><td>${actualPct.toFixed(2)}%</td><td>${earnedWeight.toFixed(4)}%</td></tr>`;
    }).join('');
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Report ${projectTitle(project)}</title><style>
      body{font-family:Arial,sans-serif;color:#111827;margin:28px} h1{margin:0 0 4px;font-size:22px} h2{font-size:16px;margin-top:24px} .meta{color:#4b5563;margin-bottom:18px}.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:16px 0}.card{border:1px solid #d1d5db;border-radius:10px;padding:10px}.card span{display:block;color:#6b7280;font-size:12px}.card b{font-size:20px} table{width:100%;border-collapse:collapse;font-size:11px} th,td{border:1px solid #d1d5db;padding:6px;text-align:left;vertical-align:top} th{background:#f3f4f6}@media print{@page{size:A4 landscape;margin:12mm}.no-print{display:none}}
    </style></head><body>
      <button class="no-print" onclick="window.print()" style="padding:10px 14px;margin-bottom:14px">Print / Save as PDF</button>
      <h1>Laporan Kurva S & Progress Aktual</h1><div class="meta">${projectTitle(project)} — Status Date: ${statusDate}</div>
      <div class="cards"><div class="card"><span>Target</span><b>${pct(planned)}</b></div><div class="card"><span>Aktual</span><b>${pct(actual)}</b></div><div class="card"><span>Deviasi</span><b>${pct(deviation)}</b></div><div class="card"><span>SPI</span><b>${spi ? spi.toFixed(2) : '-'}</b></div></div>
      <h2>Data Kurva S</h2><table><thead><tr><th>Tanggal</th><th>Target Kumulatif</th><th>Aktual Kumulatif</th><th>Deviasi</th></tr></thead><tbody>${curveRows}</tbody></table>
      <h2>Rekap Item Target/Aktual</h2><table><thead><tr><th>Area</th><th>Kode</th><th>Uraian</th><th>Volume</th><th>Nilai</th><th>Bobot</th><th>Aktual Item</th><th>Aktual Berbobot</th></tr></thead><tbody>${itemRows}</tbody></table>
    </body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html); w.document.close();
  }

  const chosen = projectItems.find(i => i.id === form.boq_item_id);
  useEffect(() => {
    if (chosen && form.actual_volume !== '') {
      const val = clamp((Number(form.actual_volume) / Number(chosen.volume || 1)) * 100, 0, 100);
      if (Math.abs(Number(form.actual_percent || 0) - val) > 0.5) setForm(f => ({ ...f, actual_percent: val.toFixed(2) }));
    }
  }, [form.actual_volume, chosen?.id]);

  if (!session && !demoMode) return <Login onDemo={() => setDemoMode(true)} />;
  if (loading) return <div className="loading">Memuat data...</div>;

  return <main className="app-shell">
    <header className="topbar">
      <div><h1>RAB S-Curve Progress</h1><p>Input aktual koordinator teknik tanpa akses ke Google Sheet</p></div>
      <div className="top-actions">
        {demoMode && <span className="pill"><Cloud size={15}/> Demo Mode</span>}
        {!demoMode && <button className="ghost" onClick={() => supabase.auth.signOut()}><LogOut size={17}/> Keluar</button>}
      </div>
    </header>

    {toast && <div className="toast" onClick={() => setToast('')}>{toast}</div>}

    <section className="panel controls monitoring-controls">
      <label className="search"><Search size={16}/><input value={projectSearch} onChange={e=>setProjectSearch(e.target.value)} placeholder="Cari No SPI / nama proyek / rekan kerja..."/></label>
      <label>Status Proyek<select value={projectStatusFilter} onChange={e=>setProjectStatusFilter(e.target.value)}>{projectStatuses.map(s => <option key={s} value={s}>{s === 'ALL' ? 'Semua Status' : s}</option>)}</select></label>
      <label>Wilayah<select value={wilayahFilter} onChange={e=>setWilayahFilter(e.target.value)}>{projectWilayahs.map(w => <option key={w} value={w}>{w === 'ALL' ? 'Semua Wilayah' : w}</option>)}</select></label>
      <label>Project<select value={project?.id || ''} onChange={e=>setSelectedProjectId(e.target.value)}>{filteredProjects.map(p => <option key={p.id} value={p.id}>{projectOptionLabel(p)}</option>)}</select></label>
      <label>Status Date<input type="date" value={statusDate} onChange={e=>{setStatusDate(e.target.value); setForm(f=>({...f, entry_date:e.target.value}));}} /></label>
      <label>Area Item RAB<select value={area} onChange={e=>setArea(e.target.value)}>{areas.map(a => <option key={a} value={a}>{a === 'ALL' ? 'Semua Area Item' : a}</option>)}</select></label>
      <label className="search item-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari item pekerjaan RAB..."/></label>
    </section>

    <section className="panel project-summary">
      <div><span>Kode</span><b>{project?.kode || '-'}</b></div>
      <div><span>No. SPI</span><b>{project?.no_spi || '-'}</b></div>
      <div className="wide"><span>Nama Proyek</span><b>{projectTitle(project)}</b></div>
      <div><span>Status Sheet</span><b className={projectStatus(project) === 'FINISH' ? 'green-text' : 'blue-text'}>{projectStatus(project)}</b></div>
      <div><span>% Progress Sheet</span><b>{pct(project?.sheet_progress_percent || project?.progress_percent || 0, 0)}</b></div>
      <div><span>Jenis</span><b>{[project?.jenis, project?.jenis2].filter(Boolean).join(' / ') || '-'}</b></div>
      <div><span>Wilayah / Area</span><b>{[project?.wilayah, project?.project_area].filter(Boolean).join(' / ') || '-'}</b></div>
      <div><span>Rekan Kerja</span><b>{project?.rekan_kerja || '-'}</b></div>
      <div><span>PIC Sales</span><b>{project?.pic_sales || '-'}</b></div>
      <div><span>PIC Teknik</span><b>{project?.pic_teknik || '-'}</b></div>
      <div><span>Start - End</span><b>{project?.start_date || '-'} → {project?.end_date || '-'}</b></div>
      <div><span>Delay</span><b className={Number(project?.delay_days || 0) > 0 ? 'red-text' : 'green-text'}>{project?.delay_days ?? 0} hari</b></div>
      <div><span>Nilai Kontrak</span><b>{rupiah(project?.nilai_kontrak || project?.contract_value || 0)}</b></div>
    </section>

    <section className="panel file-actions">
      <div>
        <h2><FileText size={19}/> File RAB Proyek</h2>
        <p>Upload Excel/PDF per proyek. File produksi disimpan ke Supabase Storage bucket <b>rab-files</b>.</p>
        <div className="upload-list">{uploads.filter(u => u.project_id === project?.id).slice(0,3).map(u => <span key={u.id}>{u.file_name}</span>)}</div>
      </div>
      <div className="file-buttons">
        <label className="button-like"><FileSpreadsheet size={18}/> {uploading ? 'Uploading...' : 'Upload Excel/PDF'}<input type="file" accept=".xlsx,.xls,.csv,.pdf,application/pdf" onChange={handleRabUpload} disabled={uploading}/></label>
        <button className="ghost" onClick={exportExcelFile}><Download size={17}/> Export Excel</button>
        <button className="ghost" onClick={exportPdfPrint}><FileText size={17}/> Export PDF</button>
      </div>
    </section>

    <section className="metrics">
      <Metric icon={<CalendarDays/>} label="Target Kumulatif" value={pct(planned)} sub={statusDate} />
      <Metric icon={<CheckCircle2/>} label="Aktual Kumulatif" value={pct(actual)} sub={rupiah(totalValue * actual / 100)} tone="blue" />
      <Metric icon={deviation < 0 ? <TrendingDown/> : <TrendingUp/>} label="Deviasi" value={pct(deviation)} sub={rupiah(totalValue * deviation / 100)} tone={deviation < -2 ? 'red' : deviation >= 0 ? 'green' : 'yellow'} />
      <Metric icon={<BarChart3/>} label="SPI" value={spi ? spi.toFixed(2) : '-'} sub={spi >= 1 ? 'On/Ahead schedule' : planned ? 'Behind schedule' : 'Belum ada target'} tone={spi >= 1 ? 'green' : 'red'} />
    </section>

    <section className="grid-main">
      <div className="panel progress-form">
        <h2><UploadCloud size={20}/> Input Progress Aktual</h2>
        <form onSubmit={saveProgress}>
          <label>Item Pekerjaan<select value={form.boq_item_id} onChange={e=>setForm({...form, boq_item_id:e.target.value})} required><option value="">Pilih item...</option>{filteredItems.map(i => <option key={i.id} value={i.id}>{i.area || i.section_name || '-'} - {i.code}. {i.description}</option>)}</select></label>
          <div className="two-col">
            <label>Tanggal Opname<input type="date" value={form.entry_date} onChange={e=>setForm({...form, entry_date:e.target.value})} required /></label>
            <label>Volume Aktual<input type="number" step="0.01" value={form.actual_volume} onChange={e=>setForm({...form, actual_volume:e.target.value})} placeholder={chosen ? `max ${chosen.volume} ${chosen.unit}` : '0'} /></label>
          </div>
          <div className="two-col">
            <label>Progress Aktual (%)<input type="number" min="0" max="100" step="0.01" value={form.actual_percent} onChange={e=>setForm({...form, actual_percent:e.target.value})} required /></label>
            <label>Bobot Item<input value={chosen ? pct(chosen.weight_percent, 4) : '-'} readOnly /></label>
          </div>
          <label>Catatan<textarea value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} placeholder="Kendala, area kerja, bukti opname, dsb." /></label>
          <button className="primary"><CheckCircle2 size={18}/> Simpan Progress</button>
        </form>
      </div>

      <div className="panel chart-panel">
        <h2>Grafik Kurva S</h2>
        <SChart data={curve.length ? curve : [{ date: statusDate, planned, actual }]} />
      </div>
    </section>

    <section className="panel table-panel">
      <h2>Bobot & Aktual per Item</h2>
      <div className="table-wrap"><table>
        <thead><tr><th>Area</th><th>Kode</th><th>Uraian</th><th>Volume</th><th>Nilai</th><th>Bobot</th><th>Aktual</th><th>Deviasi thd Bobot</th><th>Aksi</th></tr></thead>
        <tbody>{filteredItems.map(item => {
          const last = latest.get(item.id);
          const actualPct = Number(last?.actual_percent || 0);
          const earnedWeight = Number(item.weight_percent || 0) * actualPct / 100;
          return <tr key={item.id}>
            <td>{item.area || item.section_name || '-'}</td><td>{item.code}</td><td className="desc">{item.description}</td><td>{item.volume} {item.unit}</td><td>{rupiah(item.total_price)}</td><td>{pct(item.weight_percent, 4)}</td><td>{pct(actualPct)}</td><td>{pct(earnedWeight, 4)}</td><td><button className="small" onClick={() => selectItemForProgress(item)}>Input</button></td>
          </tr>;
        })}</tbody>
      </table></div>
    </section>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
