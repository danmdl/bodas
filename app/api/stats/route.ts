import { NextRequest, NextResponse } from "next/server";
import { authenticated, COOKIE, digest, equal, limited, localDate, ready, record, report, session } from "@/lib/site-stats";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const json = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
export async function GET(request: NextRequest) {
  if (!ready()) return json({ error: "El panel está preparado. Falta activar el almacenamiento y la contraseña en Vercel." }, 503);
  if (!authenticated(request.cookies.get(COOKIE)?.value)) return json({ error: "Ingresá tu contraseña." }, 401);
  const days = Number(request.nextUrl.searchParams.get("days") || 7);
  if (![7, 30, 90].includes(days)) return json({ error: "Período inválido." }, 400);
  try { return json({ rows: await report(days), updatedAt: new Date().toISOString() }); }
  catch { return json({ error: "No se pudieron consultar las estadísticas. Intentá nuevamente." }, 503); }
}
export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) return json({ error: "Origen no permitido." }, 403);
  if (!ready()) return json({ error: "Estadísticas pendientes de activación." }, 503);
  if (Number(request.headers.get("content-length") || 0) > 2048) return json({}, 413);
  let body;
  try { const text = await request.text(); if (text.length > 2048) return json({}, 413); body = JSON.parse(text); }
  catch { return json({}, 400); }
  if (!body || typeof body !== "object") return json({}, 400);
  // Vercel overwrites x-vercel-forwarded-for with the connecting client's IP.
  const ip = request.headers.get("x-vercel-forwarded-for") || "local";
  try {
    if (body.action === "logout") {
      const response = json({ ok: true });
      response.cookies.set(COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 });
      return response;
    }
    if (body.action === "login") {
      if (await limited(`login:${digest(ip)}`, 5, 900)) return json({ error: "Demasiados intentos. Volvé a probar en 15 minutos." }, 429);
      if (typeof body.password !== "string" || !equal(digest(body.password), digest(process.env.ADMIN_PASSWORD!))) return json({ error: "Contraseña incorrecta." }, 401);
      const response = json({ ok: true });
      response.cookies.set(COOKIE, session(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 8 * 3600 });
      return response;
    }
    if (!["visit", "registry", "alias"].includes(body.event)) return json({}, 400);
    if (authenticated(request.cookies.get(COOKIE)?.value)) return json({ ok: true });
    if (/bot|crawler|spider|headless/i.test(request.headers.get("user-agent") || "")) return json({ ok: true });
    if (await limited(`events:${digest(ip)}`, 60, 60)) return json({}, 429);
    const ua = request.headers.get("user-agent") || "";
    const country = request.headers.get("x-vercel-ip-country") || "ZZ";
    await record(body.event, digest(`${localDate()}:${ip}:${ua}`), /^[A-Z]{2}$/.test(country) ? country : "ZZ", /mobile|android|iphone|ipad/i.test(ua) ? "Celular/tablet" : "Computadora");
    return json({ ok: true });
  } catch { return json({ error: "Servicio temporalmente no disponible." }, 503); }
}
