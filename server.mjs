import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const envText = await readFile(path.join(root, '.env'), 'utf8').catch(() => '');
for (const line of envText.split(/\r?\n/)) {
  const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
  if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
}
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '0.0.0.0';
const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
const prokeralaClientId = process.env.PROKERALA_CLIENT_ID;
const prokeralaClientSecret = process.env.PROKERALA_CLIENT_SECRET;
let prokeralaToken = '';
let prokeralaTokenExpiry = 0;
const placeCache = new Map();

async function getProkeralaToken() {
  if (prokeralaToken && Date.now() < prokeralaTokenExpiry) return prokeralaToken;
  if (!prokeralaClientId || !prokeralaClientSecret) throw Object.assign(new Error('Birth-chart calculation is temporarily unavailable because the astrology provider is not connected. The app is running, but accurate planetary positions require the site owner to configure PROKERALA_CLIENT_ID and PROKERALA_CLIENT_SECRET in the server environment. No sample chart will be presented as a real calculation.'), { status: 503 });
  const response = await fetch('https://api.prokerala.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'client_credentials', client_id: prokeralaClientId, client_secret: prokeralaClientSecret }), signal: AbortSignal.timeout(15000) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) throw Object.assign(new Error(data.error_description || data.error || 'Could not authenticate with the ephemeris service.'), { status: 502 });
  prokeralaToken = data.access_token; prokeralaTokenExpiry = Date.now() + Math.max(60, Number(data.expires_in || 3600) - 60) * 1000; return prokeralaToken;
}
function timezoneOffsetAt(date, timezone) {
  const value = new Intl.DateTimeFormat('en-US', { timeZone: timezone, timeZoneName: 'longOffset' }).formatToParts(date).find(x => x.type === 'timeZoneName')?.value || 'GMT+00:00';
  const match = value.match(/GMT([+-])(\d{2}):(\d{2})/); return match ? (match[1] === '-' ? -1 : 1) * (Number(match[2]) * 60 + Number(match[3])) : 0;
}
function localIso(date, time, timezone) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}(?::\d{2})?$/.test(time)) throw Object.assign(new Error('Enter a valid birth date and time.'), { status: 400 });
  const wallTime = time.length === 5 ? `${time}:00` : time; const naive = Date.parse(`${date}T${wallTime}Z`); if (!Number.isFinite(naive)) throw Object.assign(new Error('Invalid birth date or time.'), { status: 400 });
  let offset = timezoneOffsetAt(new Date(naive), timezone); offset = timezoneOffsetAt(new Date(naive - offset * 60000), timezone);
  const sign = offset < 0 ? '-' : '+', abs = Math.abs(offset); return `${date}T${wallTime}${sign}${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(abs % 60).padStart(2, '0')}`;
}

async function google(pathname, body, method = 'POST') {
  if (!apiKey) throw Object.assign(new Error('Live translation is not enabled yet. The app remains usable in its original language; the site owner must configure GOOGLE_TRANSLATE_API_KEY in the server environment to activate translations.'), { status: 503 });
  const url = new URL(`https://translation.googleapis.com/language/translate/v2/${pathname}`);
  url.searchParams.set('key', apiKey);
  const response = await fetch(url, {
    method, headers: { 'content-type': 'application/json' },
    ...(method === 'POST' ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(20000)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(data.error?.message || 'Translation provider request failed.'), { status: response.status });
  return data.data;
}

const server = http.createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    if (req.method === 'GET' && url.pathname === '/api/health') {
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
      res.end(JSON.stringify({
        ok: true, app: 'Darshan’s Astrology World', node: process.versions.node,
        integrations: {
          googleTranslate: Boolean(apiKey),
          prokeralaKundli: Boolean(prokeralaClientId && prokeralaClientSecret)
        },
        savedData: 'Browser-local only; no hosted database configured',
        setup: 'Copy .env.example to .env and add provider credentials to enable live integrations.'
      }));
      return;
    }
    if (req.method === 'POST' && url.pathname === '/api/kundli') {
      let raw = ''; for await (const part of req) { raw += part; if (raw.length > 12_000) throw Object.assign(new Error('Request too large.'), { status: 413 }); }
      const input = JSON.parse(raw || '{}'); const lat = Number(input.latitude), lon = Number(input.longitude), timezone = String(input.timezone || '');
      if (input.consent !== true) throw Object.assign(new Error('Confirm that birth date, time, and location may be sent to Prokerala for calculation.'), { status: 400 });
      if (!Number.isFinite(lat) || Math.abs(lat) > 90 || !Number.isFinite(lon) || Math.abs(lon) > 180 || timezone.length > 80) throw Object.assign(new Error('Choose a birthplace from search and enter a valid time zone.'), { status: 400 });
      try { new Intl.DateTimeFormat('en-US', { timeZone: timezone }); } catch { throw Object.assign(new Error('Enter a valid IANA time zone, such as Asia/Kolkata.'), { status: 400 }); }
      const datetime = localIso(String(input.date || ''), String(input.time || ''), timezone), token = await getProkeralaToken();
      const language = ['en', 'hi', 'ta', 'ml'].includes(input.language) ? input.language : 'en';
      const params = new URLSearchParams({ ayanamsa: '1', coordinates: `${lat},${lon}`, datetime, la: language });
      const upstream = await fetch(`https://api.prokerala.com/v2/astrology/kundli/advanced?${params}`, { headers: { authorization: `Bearer ${token}`, accept: 'application/json' }, signal: AbortSignal.timeout(25000) });
      const payload = await upstream.json().catch(() => ({})); if (!upstream.ok) throw Object.assign(new Error(payload.errors?.[0]?.detail || payload.message || 'Ephemeris service could not calculate this birth chart.'), { status: upstream.status === 401 ? 502 : upstream.status });
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }); res.end(JSON.stringify(payload)); return;
    }
    if (req.method === 'GET' && url.pathname === '/api/timezone') {
      const lat = Number(url.searchParams.get('lat')), lon = Number(url.searchParams.get('lon'));
      if (!Number.isFinite(lat) || Math.abs(lat) > 90 || !Number.isFinite(lon) || Math.abs(lon) > 180) throw Object.assign(new Error('Valid birthplace coordinates are required to detect its time zone.'), { status: 400 });
      let upstream, payload;
      try {
        upstream = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&current=temperature_2m&timezone=auto`, { headers: { 'User-Agent': 'DarshansAstrologyWorld/1.0' }, signal: AbortSignal.timeout(12000) });
        payload = await upstream.json().catch(() => ({}));
      } catch { throw Object.assign(new Error('Time-zone lookup service is unreachable. Check your internet connection or enter the IANA time zone manually.'), { status: 502 }); }
      if (!upstream.ok || !payload.timezone) throw Object.assign(new Error('Could not automatically detect the birth time zone. You can enter the IANA time zone manually.'), { status: 502 });
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=86400' });
      res.end(JSON.stringify({ timezone: payload.timezone, timezoneAbbreviation: payload.timezone_abbreviation || '', utcOffsetSeconds: payload.utc_offset_seconds ?? null })); return;
    }
    if (req.method === 'GET' && (url.pathname === '/api/places' || url.pathname === '/api/place')) {
      const reverse = url.pathname === '/api/place';
      const q = url.searchParams.get('q')?.trim();
      const lat = Number(url.searchParams.get('lat')), lon = Number(url.searchParams.get('lon'));
      if ((!reverse && (!q || q.length > 120)) || (reverse && (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180))) throw Object.assign(new Error('Enter a valid place or map location.'), { status: 400 });
      const params = new URLSearchParams(reverse ? { lat: String(lat), lon: String(lon), lang: 'en' } : { q, limit: '5', lang: 'en' });
      const cacheKey = `${url.pathname}?${params}`;
      let payload = placeCache.get(cacheKey);
      if (!payload) {
        const upstream = await fetch(`https://photon.komoot.io/${reverse ? 'reverse' : 'api'}?${params}`, { headers: { 'User-Agent': 'DarshansAstrologyWorld/1.0' }, signal: AbortSignal.timeout(12000) });
        if (!upstream.ok) throw Object.assign(new Error('Place lookup is temporarily unavailable.'), { status: 502 });
        payload = await upstream.json(); placeCache.set(cacheKey, payload);
        if (placeCache.size > 200) placeCache.delete(placeCache.keys().next().value);
      }
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=3600' }); res.end(JSON.stringify(payload)); return;
    }
    if (req.method === 'POST' && url.pathname === '/api/translate') {
      let raw = ''; for await (const part of req) { raw += part; if (raw.length > 100_000) throw Object.assign(new Error('Request too large.'), { status: 413 }); }
      const { text, target, source } = JSON.parse(raw || '{}');
      if (!Array.isArray(text) || text.length > 128 || text.some(v => typeof v !== 'string' || v.length > 5000) || !/^[a-zA-Z-]{2,15}$/.test(target || '')) throw Object.assign(new Error('Invalid translation request.'), { status: 400 });
      const data = await google('translate', { q: text, target, ...(source && source !== 'auto' ? { source } : {}), format: 'text' });
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
      res.end(JSON.stringify({ translations: data.translations.map(x => x.translatedText) })); return;
    }
    if (req.method === 'GET' && url.pathname === '/api/languages') {
      const data = await google('languages?target=en', {}, 'GET');
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=86400' });
      res.end(JSON.stringify({ languages: data.languages.map(x => ({ code: x.language, name: x.name || x.language })) })); return;
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); res.end('Method not allowed'); return; }
    const requested = url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname.slice(1));
    if (!['index.html', 'read-learn.js', 'report-sources.js'].includes(requested)) { res.writeHead(404); res.end('Not found'); return; }
    const file = path.resolve(root, requested);
    if (!file.startsWith(root + path.sep) && file !== path.join(root, 'index.html')) { res.writeHead(403); res.end('Forbidden'); return; }
    const content = await readFile(file);
    const type = file.endsWith('.html') ? 'text/html; charset=utf-8' : file.endsWith('.js') || file.endsWith('.mjs') ? 'text/javascript; charset=utf-8' : 'application/octet-stream';
    res.writeHead(200, { 'content-type': type, 'cache-control': 'no-cache' }); res.end(req.method === 'HEAD' ? undefined : content);
  } catch (error) {
    res.writeHead(error.status || 500, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
    res.end(JSON.stringify({ error: error.message || 'Server error.' }));
  }
});
server.listen(port, host, () => console.log(`Jyotish app listening on ${host}:${port}`));
