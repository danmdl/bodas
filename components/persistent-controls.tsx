"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { WeddingData } from "@/lib/wedding-data";
export default function PersistentControls({
  data,
  onGift,
  hidden,
}: {
  data: WeddingData;
  onGift: () => void;
  hidden: boolean;
}) {
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    const update = () =>
      setRemaining(
        Math.max(0, new Date(data.countdownTo).getTime() - Date.now()),
      );
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [data.countdownTo]);
  const values =
    remaining === null
      ? ["··", "··", "··", "··"]
      : [
          Math.floor(remaining / 86400000),
          Math.floor(remaining / 3600000) % 24,
          Math.floor(remaining / 60000) % 60,
          Math.floor(remaining / 1000) % 60,
        ].map((n) => String(n).padStart(2, "0"));
  return (
    <div
      className={`persistent-ui ${hidden ? "ui-hidden" : ""}`}
      inert={hidden}
    >
      <button
        className="floating-support"
        onClick={onGift}
        aria-label={`Tu apoyo. Ver y copiar el alias ${data.gifts.alias ?? ""}`}
      >
        <span className="support-symbol">
          <Sparkles size={21} />
        </span>
        <span>
          <strong>Tu apoyo</strong>
          <small>{data.gifts.alias ?? "Acompañá nuestro viaje"}</small>
        </span>
        <ArrowUpRight size={18} />
      </button>
      <aside
        className="countdown-orbit"
        aria-label="Cuenta regresiva siempre visible"
      >
        <a className="orbit-intro" href="#fechas">
          {remaining === 0 ? "LLEGÓ NUESTRO DÍA" : "PARA NUESTRO SÍ"}
        </a>
        <div
          className="orbit-countdown"
          role="timer"
          aria-live="off"
          aria-label={
            remaining === null
              ? "Cuenta regresiva al casamiento"
              : `Faltan ${values[0]} días, ${values[1]} horas y ${values[2]} minutos`
          }
        >
          {values.map((value, i) => (
            <div key={i}>
              <strong>{value}</strong>
              <span>{["DÍAS", "HORAS", "MIN", "SEG"][i]}</span>
              {i < 3 && <i aria-hidden="true">:</i>}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
