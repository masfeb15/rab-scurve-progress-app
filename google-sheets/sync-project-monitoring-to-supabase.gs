/**
 * Google Apps Script contoh untuk sync sheet "DB" / "PROJECT MONITORING" ke Supabase table projects.
 * Simpan SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di Script Properties.
 * Jangan expose service_role key ke frontend.
 */
const SHEET_NAME = 'DB';
const SUPABASE_TABLE = 'projects';

function syncProjectMonitoringToSupabase() {
  const props = PropertiesService.getScriptProperties();
  const SUPABASE_URL = props.getProperty('SUPABASE_URL');
  const SUPABASE_KEY = props.getProperty('SUPABASE_SERVICE_ROLE_KEY');
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Isi SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di Script Properties');

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(h => String(h).trim().toUpperCase());

  const idx = (name) => headers.indexOf(name.toUpperCase());
  const get = (row, name) => {
    const i = idx(name);
    return i >= 0 ? row[i] : '';
  };
  const asDate = (v) => v instanceof Date ? Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd') : (v || null);
  const asNumber = (v) => typeof v === 'number' ? v : Number(String(v || '').replace(/[^0-9.-]/g, '')) || 0;
  const asPercent = (v) => {
    if (typeof v === 'number') return v <= 1 ? v * 100 : v;
    return Number(String(v || '0').replace('%', '').replace(',', '.')) || 0;
  };

  const rows = values.slice(1).filter(r => get(r, 'NO. SPI') || get(r, 'NAMA PROYEK'));
  const payload = rows.map((r, n) => {
    const nama = String(get(r, 'NAMA PROYEK') || '').trim();
    const noSpi = String(get(r, 'NO. SPI') || '').trim();
    const kode = String(get(r, 'KODE') || '').trim();
    return {
      source_row_id: `${kode || 'NO-KODE'}-${noSpi || n + 2}`,
      source_sheet_gid: String(sheet.getSheetId()),
      kode,
      no_spi: noSpi,
      bulan_spi: String(get(r, 'BULAN SPI') || '').trim(),
      tahun_sp: asNumber(get(r, 'TAHUN SP')) || null,
      name: nama,
      nama_proyek: nama,
      pekerjaan: String(get(r, 'PEKERJAAN') || '').trim(),
      jenis: String(get(r, 'JENIS') || '').trim(),
      jenis2: String(get(r, 'JENIS2') || '').trim(),
      wilayah: String(get(r, 'WILAYAH') || '').trim(),
      project_area: String(get(r, 'AREA') || '').trim(),
      rekan_kerja: String(get(r, 'REKAN KERJA') || '').trim(),
      dok_spk_term_payment: String(get(r, 'DOK SPK/ TERM PAYMENT') || get(r, 'DOK SPK/TERM PAYMENT') || '').trim(),
      status: String(get(r, 'STATUS') || '').trim(),
      sheet_progress_percent: asPercent(get(r, '% PROGRESS')),
      tgl_ba_bast: asDate(get(r, 'TGL BA/ BAST') || get(r, 'TGL BA/BAST')),
      start_date: asDate(get(r, 'START')),
      end_date: asDate(get(r, 'END')),
      duration_days: asNumber(get(r, 'DURASI')),
      delay_days: asNumber(get(r, 'DELAY')),
      tgl_retensi: asDate(get(r, 'Tgl RETENSI') || get(r, 'TGL RETENSI')),
      nama_relasi: String(get(r, 'NAMA RELASI') || '').trim(),
      pic_sales: String(get(r, 'PIC SALES') || '').trim(),
      pic_teknik: String(get(r, 'PIC TEKNIK') || '').trim(),
      nilai_kontrak: asNumber(get(r, 'NILAI KONTRAK')),
      contract_value: asNumber(get(r, 'NILAI KONTRAK')),
      updated_at: new Date().toISOString()
    };
  });

  // Batch upsert agar aman untuk >100 project.
  for (let i = 0; i < payload.length; i += 500) {
    const chunk = payload.slice(i, i + 500);
    const url = `${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}?on_conflict=source_row_id`;
    const res = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(chunk),
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'resolution=merge-duplicates,return=minimal'
      },
      muteHttpExceptions: true
    });
    if (res.getResponseCode() >= 300) throw new Error(res.getContentText());
  }
  Logger.log(`Synced ${payload.length} project rows to Supabase.`);
}
