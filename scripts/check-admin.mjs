import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
// Freeze time after analytics activation so tests do not depend on today's date.
const RealDate = Date;
globalThis.Date = class extends RealDate {
  constructor(...args) { super(...(args.length ? args : ['2026-10-02T15:00:00Z'])); }
  static now() { return new RealDate('2026-10-02T15:00:00Z').getTime(); }
};
// Load server helpers without a production database or extra test dependencies.
const source = ts.transpileModule(readFileSync(new URL('../lib/site-stats.ts', import.meta.url), 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const stats = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
delete process.env.ADMIN_PASSWORD;
assert.equal(stats.authenticated('123.invalid'), false);
process.env.ADMIN_PASSWORD = randomBytes(24).toString('hex');
process.env.UPSTASH_REDIS_REST_URL = 'https://redis.test';
process.env.UPSTASH_REDIS_REST_TOKEN = 'test-only';
assert.equal(stats.ready(), true);
const token = stats.session();
assert.equal(stats.authenticated(token), true);
assert.equal(stats.authenticated(token + '.extra'), false);
assert.equal(stats.authenticated(token.slice(0, -1) + (token.endsWith('0') ? '1' : '0')), false);
const expired = String(Date.now() - 1000);
assert.equal(stats.authenticated(`${expired}.${stats.digest(`session:${expired}`)}`), false);
process.env.ADMIN_PASSWORD = randomBytes(24).toString('hex');
assert.equal(stats.authenticated(token), false, 'Password change revokes existing sessions');
assert.equal(stats.localDate(new Date('2026-09-30T01:00:00Z')), '2026-09-29');
let command;
globalThis.fetch = async (_url, options) => {
 command = JSON.parse(options.body);
 assert.equal(options.cache, 'no-store');
 return Response.json({ result: 6 });
};
assert.equal(await stats.limited('test', 5, 900), true);
assert.equal(command[0], 'EVAL');
await stats.record('visit', 'hashed-visitor', 'AR', 'Computadora');
assert.equal(command[2], 2);
assert.ok(command.includes(7776000), '90-day retention');
globalThis.fetch = async () => Response.json({ result: [['visit', '3', 'unique', '2'], []] });
const rows = await stats.report(2);
assert.equal(rows[0].date, '2026-10-01');
assert.equal(rows[0].fields.visit, 3);
assert.equal(rows[0].fields.unique, 2);
assert.deepEqual(rows[1].fields, {});
globalThis.fetch = async () => Response.json({ error: 'unavailable' });
await assert.rejects(stats.redis(['PING']));
console.log('Passed: missing configuration, signed session, tampering, expiration, password rotation, Argentina dates, rate-limit response, retention, report parsing, storage failures.');
