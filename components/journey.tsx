"use client";
import { memo, useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { useInView, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, Check } from "lucide-react";
import type { WeddingData } from "@/lib/wedding-data";
import { Reveal } from "./motion-primitives";
import GiftKilometers from "./gift-kilometers";

function Journey({
  data,
  onGift,
}: {
  data: WeddingData;
  onGift: () => void;
}) {
  const shell = useRef<HTMLDivElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const count = data.destinations.length;
  // Keep distant destination images out of the initial network/decode queue.
  const nearJourney = useInView(shell, { margin: "600px", once: true });
  useEffect(() => {
    const tab = tabs.current[active];
    const list = tab?.parentElement;
    if (tab && list && list.scrollWidth > list.clientWidth) {
      list.scrollTo({
        left: tab.offsetLeft - list.clientWidth / 2 + tab.offsetWidth / 2,
        behavior: reduced ? "instant" : "smooth",
      });
    }
  }, [active, reduced]);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const updateActive = (index: number) => {
    if (activeRef.current === index) return;
    activeRef.current = index;
    setActive(index);
  };
  useEffect(() => {
    if (reduced || !shell.current) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (disposed || !track.current || !viewport.current || !sticky.current)
          return;
        gsap.registerPlugin(ScrollTrigger);
        const media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
          const animation = gsap.to(track.current, {
            x: () => -(viewport.current!.clientWidth * (count - 1)),
            ease: "none",
            scrollTrigger: {
              trigger: shell.current,
              start: () =>
                `top ${parseFloat(getComputedStyle(sticky.current!).top)}px`,
              end: "bottom bottom",
              scrub: 0.45,
              invalidateOnRefresh: true,
              onUpdate: (self) =>
                updateActive(
                  Math.min(count - 1, Math.round(self.progress * (count - 1))),
                ),
            },
          });
          return () => {
            animation.scrollTrigger?.kill();
            animation.kill();
            gsap.set(track.current, { clearProps: "transform" });
          };
        });
        cleanup = () => media.revert();
      },
      { rootMargin: "400px" },
    );
    observer.observe(shell.current);
    return () => {
      disposed = true;
      observer.disconnect();
      cleanup?.();
    };
  }, [reduced, count]);

  function choose(index: number, focus = false) {
    const next = Math.max(0, Math.min(count - 1, index));
    if (reduced) {
      viewport.current?.scrollTo({
        left: next * viewport.current.clientWidth,
        behavior: "instant",
      });
      updateActive(next);
    } else if (shell.current && sticky.current) {
      const top = parseFloat(getComputedStyle(sticky.current).top);
      const start =
        window.scrollY + shell.current.getBoundingClientRect().top - top;
      const distance = shell.current.offsetHeight - sticky.current.offsetHeight;
      window.scrollTo({
        top: start + (distance * next) / (count - 1),
        behavior: "smooth",
      });
    }
    if (focus) tabs.current[next]?.focus({ preventScroll: true });
  }
  function onKeys(event: KeyboardEvent, index: number) {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      choose(index + (event.key === "ArrowRight" ? 1 : -1), true);
    }
    if (event.key === "Home") {
      event.preventDefault();
      choose(0, true);
    }
    if (event.key === "End") {
      event.preventDefault();
      choose(count - 1, true);
    }
  }
  return (
    <section
      id="viaje"
      className="rail-journey chapter"
      aria-labelledby="journey-title"
    >
      <Reveal className="explorer-intro">
        <p className="eyebrow">DE NUESTRO SÍ A UN MUNDO POR DESCUBRIR</p>
        <h2 id="journey-title">
          ¿Hasta dónde nos lleva
          <br /> <em>tu regalo?</em>
        </h2>
        <p>{data.gifts.introduction}</p>
      </Reveal>
      <div ref={shell} className="journey-scroll-shell">
        <div className="journey-sticky" ref={sticky}>
          <div
            className="rail-tabs"
            role="tablist"
            aria-label="Destinos de nuestro viaje"
          >
            {data.destinations.map((d, i) => (
              <button
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                key={d.id}
                id={`tab-${d.id}`}
                role="tab"
                aria-selected={i === active}
                aria-controls={`scene-${d.id}`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => choose(i)}
                onKeyDown={(e) => onKeys(e, i)}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                {d.name}
                {d.unlocked && <Check size={13} />}
              </button>
            ))}
          </div>
          <div
            ref={viewport}
            className="journey-viewport"
            tabIndex={0}
            role="region"
            aria-label="Recorrido panorámico. Bajá para avanzar, o usá las flechas."
            onKeyDown={(e) => onKeys(e, active)}
            onScroll={(e) => {
              if (reduced)
                updateActive(
                  Math.min(
                    count - 1,
                    Math.round(
                      e.currentTarget.scrollLeft / e.currentTarget.clientWidth,
                    ),
                  ),
                );
            }}
            onTouchStart={(e) => {
              swipeStart.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
              };
            }}
            onTouchEnd={(e) => {
              const start = swipeStart.current;
              if (!start || reduced) return;
              const dx = e.changedTouches[0].clientX - start.x,
                dy = e.changedTouches[0].clientY - start.y;
              if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5)
                choose(active + (dx < 0 ? 1 : -1));
              swipeStart.current = null;
            }}
          >
            <div ref={track} className="journey-track">
              {data.destinations.map((d, i) => (
                <article
                  key={d.id}
                  id={`scene-${d.id}`}
                  className="journey-scene"
                  role="tabpanel"
                  aria-labelledby={`tab-${d.id}`}
                  aria-hidden={i !== active}
                  inert={i !== active}
                >
                  {nearJourney && Math.abs(i - active) <= 1 && <Image
                    src={d.image}
                    alt={d.imageAlt}
                    fill
                    sizes="(max-width: 700px) 94vw, 92vw"
                    quality={75}
                  />}
                  <div className="scene-shade" />
                  <div className="rail-topline">
                    <span>{d.coordinates}</span>
                    <span>DOS PASAJES. UN MISMO SUEÑO.</span>
                  </div>
                  <div className="rail-copy">
                    <p className="eyebrow">{d.region}</p>
                    <h3>{d.name}</h3>
                    <p>{d.description}</p>
                    {data.gifts.publicProgress === "percentage" &&
                      d.percentage !== null && (
                        <span className="destination-progress-pill">
                          {d.percentage}% de esta etapa
                        </span>
                      )}
                    {"goalLabel" in d && <p>Meta: {d.goalLabel}</p>}
                  </div>
                  <div className="rail-distance">
                    <strong>
                      {d.approxKmFromBuenosAires.toLocaleString("es-AR")}
                      <small>km</small>
                    </strong>
                    <span>
                      desde Buenos Aires
                      {d.distanceCity ? ` · ${d.distanceCity}` : ""}
                      <br />
                      distancia aérea aproximada
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="rail-navigation">
            <span className="rail-scroll-cue">
              <ArrowDown size={15} /> SEGUÍ BAJANDO. EL VIAJE SIGUE.
            </span>
            <div>
              <button
                onClick={() => choose(active - 1)}
                disabled={active === 0}
                aria-label="Destino anterior"
              >
                <ArrowLeft size={18} />
              </button>
              <span aria-live="polite" aria-atomic="true">
                {String(active + 1).padStart(2, "0")}{" "}
                <small>/ {String(count).padStart(2, "0")}</small>
              </span>
              <button
                onClick={() => choose(active + 1)}
                disabled={active === count - 1}
                aria-label="Destino siguiente"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <GiftKilometers data={data} onGift={onGift} />
      {data.gifts.publicProgress !== "hidden" && (
        <div className="explorer-progress">
          <span>
            {data.gifts.configured
              ? "Así avanza nuestro sueño"
              : "Pronto vamos a compartir los avances del viaje."}
          </span>
          {data.gifts.percentage !== null && (
            <>
              <strong>{data.gifts.percentage}%</strong>
              <progress
                aria-label="Avance del viaje"
                value={data.gifts.percentage}
                max={100}
              />
            </>
          )}
          {data.gifts.publicProgress === "unlocked" &&
            data.gifts.configured && (
              <strong>
                {data.gifts.unlockedCount} de {count} destinos desbloqueados
              </strong>
            )}
          {"receivedLabel" in data.gifts && (
            <span>{data.gifts.receivedLabel} recibidos</span>
          )}
        </div>
      )}
    </section>
  );
}

export default memo(Journey);
