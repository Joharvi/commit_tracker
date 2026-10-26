#!/usr/bin/env node
// scripts/gen-accounts.js
// Generates 60 deterministic fictional customer accounts, sorts them,
// validates the result, and writes PLACEHOLDER_ACCOUNTS to src/data/commitData.js.

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname }            from 'path';
import { fileURLToPath }               from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Seeded PRNG (Park-Miller MINSTD, BigInt to avoid float overflow) ─────────
function makePrng(seed) {
  const M = 2147483647n;
  const A = 16807n;
  let s = BigInt(seed >>> 0 || 1);
  return {
    next()        { s = (A * s) % M; return Number(s) / 2147483647; },
    bool(p = 0.5) { return this.next() < p; },
    int(lo, hi)   { return lo + Math.floor(this.next() * (hi - lo + 1)); },
    pick(arr)     { return arr[this.int(0, arr.length - 1)]; },
  };
}
const rng = makePrng(0xDEADBEEF);

// ── Country code pool ─────────────────────────────────────────────────────────
const CC = ['US','GB','DE','FR','AU','JP','CA','SG','BR','MX','IN','NL','SE','CH','ES','IT','KR','ZA','AE','PL'];

// ── Seed data: [name, globalCompany|null, countryCode|null] ──────────────────
// null fields are filled by the seeded RNG; explicit values are deterministic.
const SEED_DATA = [
  // # — number-first names (sorted to the top as a group)
  ['3 Horizons Consulting Group',                                       null,                           'US'],
  ['42 Degrees North Analytics',                                        null,                           null],
  ['8th Avenue Media Partners',                                         null,                           'US'],

  // A
  ['Acero Dynamics Ltd.',                                               null,                           'MX'],
  ['Aellion Capital Partners',                                          null,                           'CH'],
  ['Alvorada Sistemas de Informação',                        null,                           'BR'],
  ['Ámbar Telecomunicaciones',                                     null,                           'ES'],
  ['Apex River Logistics',                                              null,                           null],
  ['Arclight Semiconductor Solutions International',                    null,                           'KR'],

  // B
  ['Baltica Shipping & Freight',                                        null,                           'PL'],
  ['Beacon Crest Partners',                                             null,                           'GB'],
  ['Blue Harbor Financial Group',                                       null,                           'US'],
  ['Bluewater Agricultural Technologies and Distribution Corporation',  null,                           'AU'],
  ['Brentmoor Consumer Electronics',                                    null,                           null],

  // C
  ['Canfield & Orr Legal Associates',                                   null,                           'CA'],
  ['Caspian Software Industries',                                       null,                           null],
  ['Clearstone Capital Management',                                     null,                           'US'],

  // D
  ["D’Arcy & Webb Consulting",                                     null,                           'GB'],
  ['Daybreak Health Systems',                                           null,                           null],
  ['Dorado Renewable Energy',                                           null,                           'MX'],

  // E
  ['Eastgate Pharmaceuticals Ltd.',                                     null,                           'JP'],
  ['Emberfield Creative Agency',                                        null,                           null],

  // F
  ['Faulkner-Holt Construction',                                        null,                           'CA'],
  ['Forêt Numérique',                                         null,                           'FR'],

  // G
  ['Galactic Pathways Telecommunications & Networking Incorporated',    null,                           null],
  ['Granite Peak Infrastructure & Commercial Development Group LLC',    null,                           'US'],

  // H
  ['Hawthorn Medical Devices',                                          null,                           'DE'],
  ['Helix Strand Bioengineering',                                       null,                           null],

  // I — "The Iron Bay…" strips "The " → sorts under I
  ['The Iron Bay Shipbuilding Company',                                 null,                           'KR'],
  ['Ironridge Data Center Operations',                                  null,                           null],

  // J
  ['Jade Mountain Retail Networks',                                     null,                           'SG'],

  // K
  ['Kellerman & Sons Agricultural Equipment',                           null,                           'AU'],
  ['Kinetic Flow Dynamics',                                             null,                           null],

  // L
  ['Lavelle Financial Services',                                        null,                           'FR'],

  // M — "The Maple…" strips "The " → sorts under M
  ['The Maple Health Network',                                          null,                           'CA'],
  ["Mariner’s Cove Hospitality Group",                             null,                           null],
  ['Meridian Crest Capital',                                            'Meridian Crest Capital',       'US'],
  ['Meridian Crest Capital – Asia Pacific',                        'Meridian Crest Capital',       'SG'],

  // N
  ['Northfield Precision Engineering',                                  null,                           'SE'],

  // O
  ['Oberon Satellite Communications',                                   null,                           null],
  ['Orion Gate Software Technologies & Managed Services',               null,                           'IN'],

  // P — "The Pemberton…" strips "The " → sorts under P
  ['The Pemberton Society for Advanced Research',                       null,                           'GB'],
  ['Pinnacle Urban Development',                                        null,                           'AE'],

  // Q
  ['Quinterra Mining & Exploration Corp.',                              null,                           'ZA'],

  // R
  ['Redwood Valley Construction',                                       null,                           'US'],
  ['Reliant-Morrow Systems',                                            null,                           null],
  ['Río Blanco Servicios Logísticos S.A.',                    null,                           'MX'],

  // S
  ['Sandcliff Aviation',                                                null,                           null],
  ['Silvercroft Precision Components',                                  null,                           'DE'],
  ['Solaris-7 Energy Holdings',                                         null,                           null],
  ['Stonehaven Asset Management',                                       null,                           'GB'],

  // T
  ['Talon Aerospace Solutions International Holdings Incorporated',     null,                           null],
  ['Thornwood & Blackwell Capital Group',                               null,                           'US'],
  ['Tidewater Genomics Research Institute',                             null,                           null],

  // V
  ['Vantage Cross-Border Trade Solutions',                              null,                           null],
  ['Vega Summit Pharmaceuticals',                                       'Vega Summit Pharmaceuticals',  'US'],
  ['Vega Summit Pharmaceuticals – EMEA',                           'Vega Summit Pharmaceuticals',  'GB'],

  // W
  ['Westfall Digital Media & Communications',                           null,                           null],
  ['Windbridge Systems',                                                null,                           null],

  // Z
  ['Zephyrion Asset Management Group',                                  null,                           'NL'],
];

// ── Build account records (RNG fields are seeded — same result every run) ────
const accounts = SEED_DATA.map(([name, globalHint, ccHint], i) => ({
  id:               `acct-${String(i + 1).padStart(3, '0')}`,
  name,
  billForShortfall: rng.bool(0.3),
  globalCompany:    globalHint ?? 'none',
  accountNameLocal: 'none',
  countryCode:      ccHint ?? (rng.bool(0.55) ? rng.pick(CC) : 'none'),
  uduns:            rng.bool(0.5) ? String(rng.int(100000000, 999999999)) : 'none',
}));

// ── Sort helpers ──────────────────────────────────────────────────────────────
// Strips accents so ê, é, á etc sort with their base letter.
function sortKey(name) {
  return name
    .replace(/^The\s+/i, '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}
// Names that start with anything other than a plain or accented Latin letter.
function isSymbolStart(name) {
  return !/^[a-zA-ZÀ-ɏ]/.test(name);
}

accounts.sort((a, b) => {
  const aS = isSymbolStart(a.name), bS = isSymbolStart(b.name);
  if (aS !== bS) return aS ? -1 : 1;
  const ak = sortKey(a.name), bk = sortKey(b.name);
  return ak < bk ? -1 : ak > bk ? 1 : 0;
});

// Reassign IDs in final sorted order.
accounts.forEach((a, i) => { a.id = `acct-${String(i + 1).padStart(3, '0')}`; });

// ── Validation ────────────────────────────────────────────────────────────────
const errors = [];

const idSet = new Set(accounts.map(a => a.id));
if (idSet.size !== accounts.length)
  errors.push(`Duplicate IDs: expected ${accounts.length} unique, got ${idSet.size}`);

if (accounts.length !== 60)
  errors.push(`Expected 60 accounts, got ${accounts.length}`);

for (let i = 1; i < accounts.length; i++) {
  const [p, c] = [accounts[i - 1], accounts[i]];
  const pS = isSymbolStart(p.name), cS = isSymbolStart(c.name);
  if (pS && !cS) continue;            // # group before letters — always correct
  if (!pS && cS) { errors.push(`Sort: symbol-start "${c.name}" appears after letter-start "${p.name}"`); continue; }
  if (sortKey(p.name) > sortKey(c.name))
    errors.push(`Sort: "${p.name}" should come after "${c.name}"`);
}

// ── Emit JS source ────────────────────────────────────────────────────────────
function jsStr(v) {
  // Produces a single-quoted JS string literal with ' escaped.
  return "'" + String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

const lines = accounts.map(a =>
  `  { id: ${jsStr(a.id)}, name: ${jsStr(a.name)}, ` +
  `billForShortfall: ${a.billForShortfall}, ` +
  `globalCompany: ${jsStr(a.globalCompany)}, ` +
  `accountNameLocal: ${jsStr(a.accountNameLocal)}, ` +
  `countryCode: ${jsStr(a.countryCode)}, ` +
  `uduns: ${jsStr(a.uduns)} },`
);

const dataPath = resolve(__dirname, '../src/data/commitData.js');
let src = readFileSync(dataPath, 'utf8');
src = src.replace(
  /export const PLACEHOLDER_ACCOUNTS = \[[\s\S]*?\]/,
  `export const PLACEHOLDER_ACCOUNTS = [\n${lines.join('\n')}\n]`,
);
writeFileSync(dataPath, src, 'utf8');

// ── Summary ────────────────────────────────────────────────────────────────────
const longNames  = accounts.filter(a => a.name.length >= 60);
const withThe    = accounts.filter(a => /^The /i.test(a.name));
const withSymbol = accounts.filter(a => isSymbolStart(a.name));
const withAmp    = accounts.filter(a => a.name.includes('&'));
const withApos   = accounts.filter(a => /['’]/.test(a.name));
const withDash   = accounts.filter(a => /[-–]/.test(a.name));
const withAccent = accounts.filter(a => /[^\u0000-\u007F]/.test(a.name));

console.log('\n── Account Generation Summary ──────────────────────────────────────');
console.log(`  Total accounts:            ${accounts.length}`);
console.log(`  IDs unique:                ${idSet.size === accounts.length ? '✓' : '✗'}  (${idSet.size} unique IDs)`);
console.log(`  Sorted A–Z (# first):     ${errors.filter(e => e.startsWith('Sort')).length === 0 ? '✓' : '✗'}`);
console.log(`  Names ≥ 60 chars:          ${longNames.length}`);
longNames.forEach(a => console.log(`      • (${a.name.length}) ${a.name}`));
console.log(`  Leading "The " (stripped): ${withThe.length}  → ${withThe.map(a => a.name).join(', ')}`);
console.log(`  Starts with number/symbol: ${withSymbol.length}`);
console.log(`  Contains &:                ${withAmp.length}`);
console.log(`  Contains ' or ':           ${withApos.length}`);
console.log(`  Contains hyphen or –:      ${withDash.length}`);
console.log(`  Contains non-ASCII chars:  ${withAccent.length}`);

if (errors.length) {
  console.log(`\n  ✗ ${errors.length} validation error(s):`);
  errors.forEach(e => console.log(`    - ${e}`));
} else {
  console.log('\n  ✓ All validations passed');
}
console.log(`\n  Written → src/data/commitData.js`);
console.log('────────────────────────────────────────────────────────────────────\n');
