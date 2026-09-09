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
  'images/walls',
  'images/concepts',
  'images/products',
  'images/portfolios',
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
  [U('1616486029423-aaa4789e8c9a', 'w=1600&q=80')]: 'images/hero/poster-warm-minimalist.jpg',
  [U('1616594039964-ae9021a400a0', 'w=1600&q=80')]: 'images/hero/poster-quiet-luxury.jpg',
  [U('1567767292278-a4f21aa2d36e', 'w=1600&q=80')]: 'images/hero/poster-modern-organic.jpg',
  [U('1583847268964-b28dc8f51f92', 'w=1600&q=80')]: 'images/hero/poster-editorial-neutral.jpg',

  // --- Curated aesthetics cards ---
  [U('1616137466211-f939a420be84', 'w=900&q=80')]: 'images/styles/japandi.jpg',
  [U('1600607686527-6fb886090705', 'w=900&q=80')]: 'images/styles/warm-minimalist.jpg',
  [U('1594026112284-02bb6f3352fe', 'w=900&q=80')]: 'images/styles/quiet-luxury.jpg',
  [U('1560448204-e02f11c3d0e2', 'w=900&q=80')]: 'images/styles/modern-organic.jpg',

  // --- Style wizard catalogue (/project/new/style) ---
  // NB: japandi here is deliberately a different file from the landing page's
  // styles/japandi.jpg, so no photo appears on two screens.
  [U('1600566753086-00f18fb6b3ea', 'w=900&q=80')]: 'images/styles/modern.jpg',
  [U('1519710164239-da123dc03ef4', 'w=900&q=80')]: 'images/styles/minimal.jpg',
  [U('1600585152220-90363fe7e115', 'w=900&q=80')]: 'images/styles/scandinavian.jpg',
  [U('1513694203232-719a280e022f', 'w=900&q=80')]: 'images/styles/grey.jpg',
  [U('1616627561950-9f746e330187', 'w=900&q=80')]: 'images/styles/warm-neutral.jpg',
  [U('1497366811353-6870744d04b2', 'w=900&q=80')]: 'images/styles/industrial.jpg',
  [U('1598928506311-c55ded91a20c', 'w=900&q=80')]: 'images/styles/luxury.jpg',
  [U('1611892440504-42a792e24d32', 'w=900&q=80')]: 'images/styles/japandi-wabi-sabi.jpg',

  // --- Room type wizard ---
  [U('1618221195710-dd6b41faaea6', 'w=800&q=80')]: 'images/rooms/living-room.jpg',
  [U('1522771739844-6a9f6d5f14af', 'w=800&q=80')]: 'images/rooms/bedroom.jpg',
  [U('1617806118233-18e1de247200', 'w=800&q=80')]: 'images/rooms/dining-room.jpg',
  [U('1518455027359-f3f8164ba6bd', 'w=800&q=80')]: 'images/rooms/home-office.jpg',
  [U('1615874959474-d609969a20ed', 'w=800&q=80')]: 'images/rooms/kids-room.jpg',

  // --- Dashboard / project / pro placeholders ---
  [U('1600210492486-724fe5c67fb0', 'w=800&q=80')]: 'images/rooms/living-room-retreat.jpg',
  [U('1600607687920-4e2a09cf159d', 'w=800&q=80')]: 'images/rooms/master-bedroom.jpg',
  [U('1611048267451-e6ed903d4a38', 'w=1800&q=85')]: 'images/rooms/interior-wide-1.jpg',
  [U('1611048268330-53de574cae3b', 'w=1800&q=85')]: 'images/rooms/interior-wide-2.jpg',
  [U('1615529162924-f8605388461d', 'w=1800&q=80')]: 'images/rooms/interior-wide-3.jpg',
  [U('1615873968403-89e068629265', 'w=1800&q=85')]: 'images/rooms/interior-wide-4.jpg',
  [U('1615874694520-474822394e73', 'w=1200&q=80')]: 'images/rooms/interior-wide-5.jpg',
  [U('1616046229478-9901c5536a45', 'w=1200&q=80')]: 'images/rooms/interior-wide-6.jpg',

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


  // --- Unique-asset registry (lib/constants/assets.ts) ---
  // Every entry below is a distinct photo; no id repeats anywhere in this map.
  // Room wall captures
  [U('1484154218962-a197022b5858', 'w=1200&q=80')]: 'images/walls/wall-01.jpg',
  [U('1493809842364-78817add7ffb', 'w=1200&q=80')]: 'images/walls/wall-02.jpg',
  [U('1502005097973-6a7082348e28', 'w=1200&q=80')]: 'images/walls/wall-03.jpg',
  [U('1505693416388-ac5ce068fe85', 'w=1200&q=80')]: 'images/walls/wall-04.jpg',
  [U('1507089947368-19c1da9775ae', 'w=1200&q=80')]: 'images/walls/wall-05.jpg',
  [U('1513161455079-7dc1de15ef3e', 'w=1200&q=80')]: 'images/walls/wall-06.jpg',
  [U('1519974719765-e6559eac2575', 'w=1200&q=80')]: 'images/walls/wall-07.jpg',
  [U('1522337660859-02fbefca4702', 'w=1200&q=80')]: 'images/walls/wall-08.jpg',
  [U('1522771930-78848d9293e8', 'w=1200&q=80')]: 'images/walls/wall-09.jpg',
  [U('1524230572899-a752b3835840', 'w=1200&q=80')]: 'images/walls/wall-10.jpg',
  [U('1524758631624-e2822e304c36', 'w=1200&q=80')]: 'images/walls/wall-11.jpg',
  [U('1526057565006-20beab8dd2ed', 'w=1200&q=80')]: 'images/walls/wall-12.jpg',
  // AI design concepts
  [U('1531973576160-7125cd663d86', 'w=1400&q=82')]: 'images/concepts/concept-01.jpg',
  [U('1533779283484-8ad4940aa3a8', 'w=1400&q=82')]: 'images/concepts/concept-02.jpg',
  [U('1540638349517-3abd5afc5847', 'w=1400&q=82')]: 'images/concepts/concept-03.jpg',
  [U('1549187774-b4e9b0445b41', 'w=1400&q=82')]: 'images/concepts/concept-04.jpg',
  [U('1551298370-9d3d53740c72', 'w=1400&q=82')]: 'images/concepts/concept-05.jpg',
  [U('1554995207-c18c203602cb', 'w=1400&q=82')]: 'images/concepts/concept-06.jpg',
  [U('1556228453-efd6c1ff04f6', 'w=1400&q=82')]: 'images/concepts/concept-07.jpg',
  [U('1556911220-bff31c812dba', 'w=1400&q=82')]: 'images/concepts/concept-08.jpg',
  [U('1558211583-d26f610c1eb1', 'w=1400&q=82')]: 'images/concepts/concept-09.jpg',
  [U('1560185007-5f0bb1866cab', 'w=1400&q=82')]: 'images/concepts/concept-10.jpg',
  [U('1567016376408-0226e4d0c1ea', 'w=1400&q=82')]: 'images/concepts/concept-11.jpg',
  [U('1567225557594-88d73e55f2cb', 'w=1400&q=82')]: 'images/concepts/concept-12.jpg',
  // Catalogue products
  [U('1555041469-a586c61ea9bc', 'w=900&q=80')]: 'images/products/sofa-green-velvet.jpg',
  [U('1493663284031-b7e3aefcae8e', 'w=900&q=80')]: 'images/products/sofa-grey-tufted.jpg',
  [U('1567016432779-094069958ea5', 'w=900&q=80')]: 'images/products/sofa-terracotta-detail.jpg',
  [U('1550226891-ef816aed4a98', 'w=900&q=80')]: 'images/products/armchair-ochre.jpg',
  [U('1503602642458-232111445657', 'w=900&q=80')]: 'images/products/stool-oak.jpg',
  [U('1595428774223-ef52624120d2', 'w=900&q=80')]: 'images/products/cabinet-oak-wall.jpg',
  [U('1540932239986-30128078f3c5', 'w=900&q=80')]: 'images/products/pendant-brass-cluster.jpg',
  [U('1513506003901-1e6a229e2d15', 'w=900&q=80')]: 'images/products/pendant-white-dome.jpg',
  [U('1533090161767-e6ffed986c88', 'w=900&q=80')]: 'images/products/desk-lamp-and-clock.jpg',
  [U('1567538096630-e0c55bd6374c', 'w=900&q=80')]: 'images/products/chair-cream-tufted.jpg',
  [U('1552321554-5fefe8c9ef14', 'w=900&q=80')]: 'images/products/bathroom-fittings.jpg',
  [U('1556909212-d5b604d0c90d', 'w=900&q=80')]: 'images/products/kitchen-fittings.jpg',
  // Vendor portfolios
  [U('1571508601891-ca5e7a713859', 'w=1200&q=80')]: 'images/portfolios/portfolio-01.jpg',
  [U('1573883431205-98b5f10aaedb', 'w=1200&q=80')]: 'images/portfolios/portfolio-02.jpg',
  [U('1583845112203-29329902332e', 'w=1200&q=80')]: 'images/portfolios/portfolio-03.jpg',
  [U('1584132967334-10e028bd69f7', 'w=1200&q=80')]: 'images/portfolios/portfolio-04.jpg',
  [U('1596178065887-1198b6148b2b', 'w=1200&q=80')]: 'images/portfolios/portfolio-05.jpg',
  [U('1598300042247-d088f8ab3a91', 'w=1200&q=80')]: 'images/portfolios/portfolio-06.jpg',
  [U('1598928636135-d146006ff4be', 'w=1200&q=80')]: 'images/portfolios/portfolio-07.jpg',
  [U('1600494603989-9650cf6ddd3d', 'w=1200&q=80')]: 'images/portfolios/portfolio-08.jpg',
  [U('1600585154084-4e5fe7c39198', 'w=1200&q=80')]: 'images/portfolios/portfolio-09.jpg',
  [U('1606744837616-56c9a5c6a6eb', 'w=1200&q=80')]: 'images/portfolios/portfolio-10.jpg',

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
