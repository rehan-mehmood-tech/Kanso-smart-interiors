#!/usr/bin/env node
/**
 * Kanso media migration.
 *
 * 1. Scans the app for external Unsplash / Pexels asset URLs.
 * 2. Downloads each one into public/assets/... under a descriptive filename.
 * 3. Rewrites every reference in source to the local /assets/... path.
 *
 * Idempotent: already-downloaded files are skipped, and once source has been
 * rewritten the scan simply finds nothing left to do.
 *
 * Usage:
 *   node scripts/download-media.js              # download + rewrite
 *   node scripts/download-media.js --no-rewrite # download only
 *   node scripts/download-media.js --dry-run    # report, touch nothing
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC_ASSETS = path.join(ROOT, 'public', 'assets');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const REWRITE = !args.includes('--no-rewrite');

/** Directories that must exist before anything is written. */
const DIRS = [
  'videos',
  'images/rooms',
  'images/artisans',
  'images/styles',
  'images/hero',
  'images/story',
  'images/auth',
];

/** Source trees scanned for external asset URLs. */
const SCAN_DIRS = ['app', 'components', 'data', 'constants', 'lib'];
const SCAN_EXTS = ['.tsx', '.ts', '.jsx', '.js'];
/** Stitch reference screens are visual reference only, so they stay untouched. */
const SCAN_IGNORE = ['(preview)', 'node_modules', '.next'];

const U = (id, q) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&${q}`;
const P = (id) => `https://videos.pexels.com/video-files/${id}/${id}-hd_1920_1080_30fps.mp4`;

/** url -> path under public/assets. One entry per distinct remote asset. */
const ASSET_MAP = {
  // --- Hero background clips (landing page carousel) ---
  [P('3773486')]: 'videos/hero-japandi.mp4',
  [P('7578552')]: 'videos/hero-warm-minimalist.mp4',
  [P('3444434')]: 'videos/hero-quiet-luxury.mp4',
  [P('3773489')]: 'videos/hero-modern-organic.mp4',
  [P('7578550')]: 'videos/hero-editorial-neutral.mp4',

  // --- Hero video posters (first paint before the clip decodes) ---
  [U('1616486338812-3dadae4b4ace', 'w=1600&q=80')]: 'images/hero/poster-japandi.jpg',
  [U('1615874959474-d609969a20ed', 'w=1600&q=80')]: 'images/hero/poster-warm-minimalist.jpg',
  [U('1600210492486-724fe5c67fb0', 'w=1600&q=80')]: 'images/hero/poster-quiet-luxury.jpg',
  [U('1567767292278-a4f21aa2d36e', 'w=1600&q=80')]: 'images/hero/poster-modern-organic.jpg',
  [U('1583847268964-b28dc8f51f92', 'w=1600&q=80')]: 'images/hero/poster-editorial-neutral.jpg',

  // --- Curated aesthetics cards ---
  [U('1618221195710-dd6b41faaea6', 'w=900&q=80')]: 'images/styles/japandi.jpg',
  [U('1600607686527-6fb886090705', 'w=900&q=80')]: 'images/styles/warm-minimalist.jpg',
  [U('1594026112284-02bb6f3352fe', 'w=900&q=80')]: 'images/styles/quiet-luxury.jpg',
  [U('1560448204-e02f11c3d0e2', 'w=900&q=80')]: 'images/styles/modern-organic.jpg',

  // --- Room type wizard ---
  [U('1618221195710-dd6b41faaea6', 'w=800&q=80')]: 'images/rooms/living-room.jpg',
  [U('1522771739844-6a9f6d5f14af', 'w=800&q=80')]: 'images/rooms/bedroom.jpg',
  [U('1617806118233-18e1de247200', 'w=800&q=80')]: 'images/rooms/dining-room.jpg',
  [U('1518455027359-f3f8164ba6bd', 'w=800&q=80')]: 'images/rooms/home-office.jpg',
  [U('1615874959474-d609969a20ed', 'w=800&q=80')]: 'images/rooms/kids-room.jpg',

  // --- Dashboard / project / pro placeholders ---
  [U('1600210492486-724fe5c67fb0', 'w=800&q=80')]: 'images/rooms/living-room-retreat.jpg',
  [U('1600607687920-4e2a09cf159d', 'w=800&q=80')]: 'images/rooms/master-bedroom.jpg',
  [U('1600607687920-4e2a09cf159d', 'w=1800&q=85')]: 'images/rooms/interior-wide-1.jpg',
  [U('1600210492486-724fe5c67fb0', 'w=1800&q=85')]: 'images/rooms/interior-wide-2.jpg',
  [U('1600210492486-724fe5c67fb0', 'w=1800&q=80')]: 'images/rooms/interior-wide-3.jpg',
  [U('1618221195710-dd6b41faaea6', 'w=1800&q=85')]: 'images/rooms/interior-wide-4.jpg',
  [U('1600607687920-4e2a09cf159d', 'w=1200&q=80')]: 'images/rooms/interior-wide-5.jpg',
  [U('1600210492486-724fe5c67fb0', 'w=1200&q=80')]: 'images/rooms/interior-wide-6.jpg',

  // --- Story section chapters ---
  [U('1522708323590-d24dbb6b0267', 'w=1200&q=80')]: 'images/story/chapter-1-guesswork.jpg',
  [U('1586023492125-27b2c045efd7', 'w=1200&q=80')]: 'images/story/chapter-2-specification.jpg',
  [U('1601058268499-e52658b8bb88', 'w=1200&q=80')]: 'images/story/chapter-3-trades.jpg',

  // --- People (testimonials + partner avatars) ---
  [U('1494790108377-be9c29b29330', 'w=200&q=80')]: 'images/artisans/ayesha-raza.jpg',
  [U('1500648767791-00dcc994a43e', 'w=200&q=80')]: 'images/artisans/daniyal-khan.jpg',
  [U('1507003211169-0a1dd7228f2d', 'w=200&q=80')]: 'images/artisans/imran-sethi.jpg',
  [U('1519345182560-3f2917c472ef', 'w=200&q=80')]: 'images/artisans/faisal-mahmood.jpg',
  [U('1534528741775-53994a69daeb', 'w=200&q=80')]: 'images/artisans/sana-iqbal.jpg',
  [U('1506794778202-cad84cf45f1d', 'w=200&q=80')]: 'images/artisans/yousuf-ali.jpg',
  [U('1573496359142-b8d87734a5a2', 'w=150&q=80')]: 'images/artisans/partner-avatar.jpg',

  // --- Auth split-screen backgrounds ---
  [U('1631679706909-1844bbd07221', 'w=2400&q=90')]: 'images/auth/login-bg.jpg',
  [U('1615529182904-14819c35db37', 'w=2400&q=90')]: 'images/auth/signup-bg.jpg',
};

const URL_RE = /https:\/\/(?:images\.unsplash\.com|videos\.pexels\.com)\/[^"'`)\s]+/g;

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SCAN_IGNORE.some((skip) => entry.name.includes(skip))) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (SCAN_EXTS.includes(path.extname(entry.name))) out.push(full);
  }
  return out;
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const request = (target, redirects = 0) => {
      https
        .get(target, { headers: { 'User-Agent': 'kanso-media-downloader' } }, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            res.resume();
            if (redirects > 5) return reject(new Error(`Too many redirects: ${url}`));
            return request(new URL(res.headers.location, target).toString(), redirects + 1);
          }
          if (res.statusCode !== 200) {
            res.resume();
            return reject(new Error(`HTTP ${res.statusCode}`));
          }
          const tmp = `${dest}.part`;
          const file = fs.createWriteStream(tmp);
          res.pipe(file);
          file.on('finish', () =>
            file.close(() => {
              fs.renameSync(tmp, dest);
              resolve(fs.statSync(dest).size);
            })
          );
          file.on('error', (err) => {
            fs.rmSync(tmp, { force: true });
            reject(err);
          });
        })
        .on('error', reject);
    };
    request(url);
  });
}

async function main() {
  const files = SCAN_DIRS.flatMap((dir) => walk(path.join(ROOT, dir)));
  const found = new Map(); // url -> [files]
  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    for (const url of src.match(URL_RE) || []) {
      if (!found.has(url)) found.set(url, []);
      const list = found.get(url);
      if (!list.includes(file)) list.push(file);
    }
  }

  console.log(`Scanned ${files.length} source files, found ${found.size} external asset URL(s).`);

  const unmapped = [...found.keys()].filter((url) => !ASSET_MAP[url]);
  if (unmapped.length) {
    console.warn('\n! No local filename mapped for these URLs (left untouched):');
    unmapped.forEach((url) => console.warn(`  ${url}`));
    console.warn('  Add them to ASSET_MAP in this script.\n');
  }

  if (!DRY_RUN) {
    for (const dir of DIRS) fs.mkdirSync(path.join(PUBLIC_ASSETS, dir), { recursive: true });
  }

  // Download every mapped asset, whether or not it is still referenced, so the
  // public/assets tree stays complete on re-runs after a rewrite.
  let downloaded = 0;
  let skipped = 0;
  const failures = [];
  for (const [url, rel] of Object.entries(ASSET_MAP)) {
    const dest = path.join(PUBLIC_ASSETS, rel);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      skipped++;
      continue;
    }
    if (DRY_RUN) {
      console.log(`  would download -> assets/${rel}`);
      continue;
    }
    try {
      const bytes = await download(url, dest);
      console.log(`  OK  assets/${rel}  (${(bytes / 1024).toFixed(0)} KB)`);
      downloaded++;
    } catch (err) {
      console.error(`  FAIL assets/${rel}  ${err.message}`);
      failures.push(rel);
    }
  }
  console.log(`\nDownloads: ${downloaded} new, ${skipped} already present, ${failures.length} failed.`);

  if (!REWRITE || DRY_RUN) {
    console.log(DRY_RUN ? 'Dry run - no files written.' : 'Rewrite skipped (--no-rewrite).');
    return;
  }

  let rewritten = 0;
  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    let out = src;
    for (const [url, rel] of Object.entries(ASSET_MAP)) {
      if (!out.includes(url)) continue;
      if (!fs.existsSync(path.join(PUBLIC_ASSETS, rel))) continue; // never point at a missing file
      out = out.split(url).join(`/assets/${rel}`);
    }
    if (out !== src) {
      fs.writeFileSync(file, out);
      console.log(`  rewrote ${path.relative(ROOT, file)}`);
      rewritten++;
    }
  }
  console.log(`\nRewrote ${rewritten} source file(s) to local /assets paths.`);
  if (failures.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
