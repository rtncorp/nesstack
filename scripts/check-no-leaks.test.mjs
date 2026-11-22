// Proves the leak check fails on each thing it claims to catch, and passes on
// the documentation ranges. The leaking samples are built at run time in a
// temporary folder, so this file itself holds nothing the check would refuse.

import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { scan } from './check-no-leaks.mjs';

function scanText(text) {
  const dir = mkdtempSync(join(tmpdir(), 'nesstack-leak-'));
  try {
    writeFileSync(join(dir, 'sample.md'), text);
    return scan(dir).findings.map((f) => f.rule);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const ip = ['10', '20', '30', '40'].join('.');
const mac = ['3c', 'a1', '0b', '22', 'ff', '01'].join(':');
const email = 'someone' + '@' + 'realcompany.mx';
const ghToken = 'ghp' + '_' + 'a'.repeat(36);
const awsKey = 'AKIA' + 'B'.repeat(16);

const mustFail = [
  ['ipv4', `server at ${ip}`],
  ['mac', `device ${mac}`],
  ['email', `write to ${email}`],
  ['github-token', `token ${ghToken}`],
  ['aws-key', `key ${awsKey}`],
  ['private-key', '-----BEGIN ' + 'RSA PRIVATE KEY-----'],
];
for (const [rule, text] of mustFail) {
  assert.ok(scanText(text).includes(rule), `expected ${rule} to be caught in: ${text}`);
}

const mustPass = [
  'docs range 192.0.2.10 and 203.0.113.5',
  'mac range 00:00:5E:00:53:01',
  'mail fan@example.com and noreply@anything.dev',
  'version 0.1.0 and 1.2.3',
];
for (const text of mustPass) {
  assert.deepEqual(scanText(text), [], `expected no finding in: ${text}`);
}

process.env.NESSTACK_PRIVATE_TERMS = 'Acme Hidden Corp';
assert.ok(scanText('built for acme hidden corp').includes('private-term'), 'private term not caught');
assert.deepEqual(scanText('the acme hidden corporation'), [], 'a term inside a longer word must not match');
delete process.env.NESSTACK_PRIVATE_TERMS;

console.log(`leak check: ${mustFail.length} leaks caught, ${mustPass.length} allowed samples passed, private terms caught`);
