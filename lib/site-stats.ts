import { createHmac, timingSafeEqual } from "node:crypto";

// Server-only configuration. Never use NEXT_PUBLIC_ for these secrets.
export const COOKIE = "wedding_admin";
const ttl = 60 * 60 * 24 * 90;
export const storageReady = () => Boolean(process.env.STORAGE_REDIS_URL || process.env.REDIS_URL) || Boolean((process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) && (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN));
export const ready = () => storageReady() && (process.env.ADMIN_PASSWORD?.length ?? 0) >= 16;
export const digest = (value: string) => createHmac("sha256", process.env.ADMIN_PASSWORD || "disabled").update(value).digest("hex");
export function equal(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
export function session() {
  const expires = String(Date.now() + 8 * 3600000);
  return `${expires}.${digest(`session:${expires}`)}`;
}
export function authenticated(value?: string) {
  if (!ready() || !value) return false;
  const [expires, signature, extra] = value.split(".");
  return !extra && /^\d{13}$/.test(expires) && Number(expires) > Date.now() && Number(expires) <= Date.now() + 8 * 3600000 && equal(signature || "", digest(`session:${expires}`));
}
export async function redis(command: (string | number)[]) {
  const tcpUrl = process.env.STORAGE_REDIS_URL || process.env.REDIS_URL;
  if (tcpUrl) {
    // Redis Cloud connection supplied by Vercel. Loaded only on the server.
    const { createClient } = await import("redis");
    const client = createClient({ url: tcpUrl, socket: { connectTimeout: 5000, reconnectStrategy: false }, disableOfflineQueue: true });
    client.on("error", () => {}); // Never log credentials from connection errors.
    const timeout = setTimeout(() => { if (client.isOpen) client.destroy(); }, 8000);
    try {
      await client.connect();
      return await client.sendCommand(command.map(String));
    } finally {
      clearTimeout(timeout);
      if (client.isOpen) client.destroy();
    }
  }
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error("Storage not configured");
  const response = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(command), cache: "no-store", signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error("Storage unavailable");
  const data = await response.json();
  if (data.error) throw new Error("Storage command failed");
  return data.result;
}
export function localDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Buenos_Aires", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}
export async function limited(key: string, max: number, seconds: number) {
  const count = await redis(["EVAL", "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return n", 1, `wedding:limit:${key}`, seconds]);
  return Number(count) > max;
}
export async function record(event: string, visitor: string, country: string, device: string) {
  const day = localDate();
  const hour = new Intl.DateTimeFormat("en-GB", { timeZone: "America/Argentina/Buenos_Aires", hour: "2-digit", hourCycle: "h23" }).format(new Date());
  // Atomic aggregates, no raw IP addresses or individual browsing history.
  await redis(["EVAL", `
    redis.call('HINCRBY',KEYS[1],ARGV[1],1)
    if ARGV[1]=='visit' then
      if redis.call('SADD',KEYS[2],ARGV[2])==1 then redis.call('HINCRBY',KEYS[1],'unique',1) end
      redis.call('EXPIRE',KEYS[2],172800)
      redis.call('HINCRBY',KEYS[1],'hour:'..ARGV[3],1)
      redis.call('HINCRBY',KEYS[1],'country:'..ARGV[4],1)
      redis.call('HINCRBY',KEYS[1],'device:'..ARGV[5],1)
    end
    redis.call('EXPIRE',KEYS[1],ARGV[6])
    return 1`, 2, `wedding:day:${day}`, `wedding:unique:${day}`, event, visitor, hour, country, device, ttl]);
}
export async function report(days: number) {
  const dates = Array.from({ length: days }, (_, i) => localDate(new Date(Date.now() - (days - i - 1) * 86400000)));
  // One bounded read for the selected date range.
  const result = await redis(["EVAL", "local r={}; for i,k in ipairs(KEYS) do r[i]=redis.call('HGETALL',k) end; return r", dates.length, ...dates.map(d => `wedding:day:${d}`)]) as string[][];
  return dates.map((date, i) => {
    const fields: Record<string, number> = {};
    for (let j = 0; j < result[i].length; j += 2) fields[result[i][j]] = Number(result[i][j + 1]);
    return { date, fields };
  });
}
