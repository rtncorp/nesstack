#!/usr/bin/env node
// Refuses anything in this repository that could reveal a real system:
// IP and MAC addresses outside the documentation ranges, email addresses
// outside the reserved example domains, credential shapes, and private names.
//
// Private names (customers, sites, internal hosts) are NOT listed here: a list
// of private names in a public repository is itself the leak. They come from
// the NESSTACK_PRIVATE_TERMS environment variable (comma or newline separated),
// set as a CI secret, and a match prints the file and line, never the term.
//
// Usage: node scripts/check-no-leaks.mjs [dir]   (default: the repository root)

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

const SKIP_DIRS = new Set(['.git', 'node_modules']);
const TEXT_EXT = new Set(['.md', '.mjs', '.js', '.json', '.yml', '.yaml', '.txt', '.toml', '.sh', '']);

// IPv4 documentation ranges (RFC 5737) and two values that name no host.
const ALLOWED_IPV4 = [/^192\.0\.2\./, /^198\.51\.100\./, /^203\.0\.113\./, /^0\.0\.0\.0$/, /^127\.0\.0\.1$/];
// MAC documentation range (RFC 7042).
const ALLOWED_MAC = /^00[:-]00[:-]5e[:-]00[:-]53[:-]/i;
// Reserved example domains (RFC 2606) and no-reply senders.
const ALLOWED_EMAIL = /@(example\.(com|org|net)|[a-z0-9-]+\.example)$|^noreply@/i;

const RULES = [
  {
    id: 'ipv4',
    re: /(?<![\d.])(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)(?![\d.])/g,
    allow: (m) => ALLOWED_IPV4.some((r) => r.test(m)),
  },
  {
    id: 'mac',
    re: /\b[0-9a-f]{2}(?:[:-][0-9a-f]{2}){5}\b/gi,
    allow: (m) => ALLOWED_MAC.test(m),
  },
  {
    id: 'email',
    re: /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/gi,
    allow: (m) => ALLOWED_EMAIL.test(m),
  },
  { id: 'private-key', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g },
  { id: 'aws-key', re: /\bAKIA[0-9A-Z]{16}\b/g },
  { id: 'github-token', re: /\bgh[pousr]_[A-Za-z0-9]{30,}\b/g },
  { id: 'slack-token', re: /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/g },
  { id: 'api-key', re: /\bsk-[A-Za-z0-9_-]{20,}\b/g },
  { id: 'google-key', re: /\bAIza[0-9A-Za-z_-]{35}\b/g },
  { id: 'jwt', re: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g },
];

function privateTerms() {
  return (process.env.NESSTACK_PRIVATE_TERMS || '')
    .split(/[\n,]/)
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length >= 3)
    // Whole words only: a term inside a longer word ("tomadas") is not the name.
    .map((t) => new RegExp(`(?<![\\p{L}\\p{N}])${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\p{N}])`, 'u'));
}

function* files(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) yield* files(p);
    else if (TEXT_EXT.has(extname(name)) || name === 'LICENSE') yield p;
  }
}

export function scan(root) {
  const terms = privateTerms();
  const findings = [];
  for (const file of files(root)) {
    const rel = relative(root, file);
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      for (const rule of RULES) {
        for (const m of line.matchAll(rule.re)) {
          if (rule.allow && rule.allow(m[0])) continue;
          findings.push({ file: rel, line: i + 1, rule: rule.id, match: m[0] });
        }
      }
      const lower = line.toLowerCase();
      for (const t of terms) {
        if (t.test(lower)) findings.push({ file: rel, line: i + 1, rule: 'private-term', match: '[redacted]' });
      }
    });
  }
  return { findings, privateTermsLoaded: terms.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const root = process.argv[2] || new URL('..', import.meta.url).pathname;
  const { findings, privateTermsLoaded } = scan(root);
  if (process.env.CI && process.env.NESSTACK_REQUIRE_TERMS && privateTermsLoaded === 0) {
    // "Could not check" must not read as "nothing found".
    console.error('NESSTACK_PRIVATE_TERMS is empty: the private-name check did not run.');
    process.exit(2);
  }
  for (const f of findings) {
    // Credential shapes are never echoed in full.
    const shown = ['ipv4', 'mac', 'email'].includes(f.rule) ? f.match : '[redacted]';
    console.error(`LEAK ${f.rule}: ${f.file}:${f.line} ${shown}`);
  }
  console.log(`Scanned for leaks: ${findings.length} finding(s), ${privateTermsLoaded} private term(s) loaded.`);
  process.exit(findings.length ? 1 : 0);
}
