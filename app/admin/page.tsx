"use client";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import styles from "./panel.module.css";
type Row = { date: string; fields: Record<string, number> };
const number = (n: number) => n.toLocaleString("es-AR");
export default function AdminPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [days, setDays] = useState(7);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(true);
  const [updated, setUpdated] = useState("");
  const load = useCallback(async () => {
    setBusy(true);
    try {
      const response = await fetch(`/api/stats?days=${days}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) { setRows(null); setMessage(data.error); return; }
      setRows(data.rows); setUpdated(data.updatedAt); setMessage("");
    } catch { setMessage("No se pudo conectar. Probá de nuevo."); }
    finally { setBusy(false); }
  }, [days]);
  useEffect(() => { void load(); }, [load]);
  async function login(e: FormEvent) {
    e.preventDefault(); setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/stats", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "login", password }) });
      const data = await response.json();
      setPassword("");
      if (!response.ok) setMessage(data.error); else await load();
    } catch { setMessage("No se pudo conectar. Probá de nuevo."); }
    finally { setBusy(false); }
  }
  async function logout() {
    setBusy(true);
    try {
      const response = await fetch("/api/stats", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) });
      if (!response.ok) throw new Error();
      setRows(null); setMessage("Sesión cerrada.");
    } catch { setMessage("No se pudo cerrar la sesión. Intentá nuevamente."); }
    finally { setBusy(false); }
  }
  const totals: Record<string, number> = {};
  rows?.forEach(row => Object.entries(row.fields).forEach(([key, value]) => { totals[key] = (totals[key] || 0) + value; }));
  const max = Math.max(1, ...((rows || []).map(row => row.fields.visit || 0)));
  const hours = Array.from({ length: 24 }, (_, h) => ({ hour: String(h).padStart(2, "0"), visits: totals[`hour:${String(h).padStart(2, "0")}`] || 0 }));
  const maxHour = Math.max(1, ...hours.map(h => h.visits));
  return <main className={styles.panel}>
    <header className={styles.header}><div><p className={styles.eyebrow}>MICA & ADRI · PANEL PRIVADO</p><h1>La historia, en números.</h1></div><a href="/">Volver a la web ↗</a></header>
    <p role="status" className={styles.message}>{message || (busy ? "Cargando…" : "")}</p>
    {!rows ? <form onSubmit={login} className={styles.login}>
      <h2>Bienvenido</h2><p>Ingresá la contraseña para consultar las visitas.</p>
      <label htmlFor="admin-password">Contraseña</label>
      <input id="admin-password" type="password" autoComplete="current-password" required maxLength={200} value={password} onChange={e => setPassword(e.target.value)} />
      <button disabled={busy} type="submit">{busy ? "Conectando…" : "Entrar al panel"}</button>
    </form> : <>
      <div className={styles.toolbar}><label>Período <select value={days} disabled={busy} onChange={e => setDays(Number(e.target.value))}><option value={7}>Últimos 7 días</option><option value={30}>Últimos 30 días</option><option value={90}>Últimos 90 días</option></select></label><button disabled={busy} onClick={load}>Actualizar</button><button disabled={busy} onClick={logout}>Cerrar sesión</button></div>
      <div className={styles.cards}>{[["Visitas", totals.visit || 0], ["Hoy", rows.at(-1)?.fields.visit || 0], ["Lista de regalos", totals.registry || 0], ["Alias copiado", totals.alias || 0]].map(([label, value]) => <section key={label}><span>{label}</span><strong>{number(Number(value))}</strong></section>)}</div>
      {!totals.visit && <p className={styles.empty}>Todavía no hay visitas registradas en este período. Los datos van a aparecer cuando entren visitantes a la web.</p>}
      <section className={styles.section}><h2>Visitas por día</h2><p>Cada apertura cuenta como una visita. “Personas estimadas” agrupa visitas similares dentro del mismo día, no identifica personas.</p>
        <div className={styles.table}><table><thead><tr><th>Fecha</th><th>Visitas</th><th>Personas estimadas</th><th aria-label="Comparación visual" /></tr></thead><tbody>{[...rows].reverse().map(row => <tr key={row.date}><td>{row.date.split("-").reverse().join("/")}</td><td>{number(row.fields.visit || 0)}</td><td>{number(row.fields.unique || 0)}</td><td><div className={styles.bar} style={{ width: `${((row.fields.visit || 0) / max) * 100}%` }} /></td></tr>)}</tbody></table></div>
      </section>
      <section className={styles.section}><h2>¿A qué hora entran?</h2><p>Horario de Argentina. Total del período seleccionado.</p><div className={styles.hours}>{hours.map(h => <div key={h.hour}><span>{h.hour}:00</span><div><i style={{ width: `${h.visits / maxHour * 100}%` }} /></div><strong>{number(h.visits)}</strong></div>)}</div></section>
      <div className={styles.columns}>{["country:", "device:"].map(prefix => <section className={styles.section} key={prefix}><h2>{prefix === "country:" ? "Países" : "Dispositivos"}</h2>{Object.entries(totals).filter(([key]) => key.startsWith(prefix)).sort((a,b) => b[1]-a[1]).map(([key,value]) => <p className={styles.statline} key={key}><span>{prefix === "country:" ? (key.endsWith("ZZ") ? "Sin identificar" : new Intl.DisplayNames(["es"], { type: "region" }).of(key.slice(prefix.length))) : key.slice(prefix.length)}</span><strong>{number(value)}</strong></p>)}</section>)}</div>
      <p className={styles.note}>Actualizado: {new Date(updated).toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" })} (Argentina). Conservamos 90 días. Los clics y las copias de alias no confirman regalos ni transferencias. Los bloqueadores, “No rastrear” y filtros de bots pueden reducir el conteo.</p>
    </>}
  </main>;
}
