"use client";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Copy,
  Gift,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import type { WeddingData } from "@/lib/wedding-data";
import { Magnetic, Reveal } from "./motion-primitives";
import Journey from "./journey";
import PhotoGallery from "./photo-gallery";
import CinematicHero from "./cinematic-hero";
import PersistentControls from "./persistent-controls";
import EventDates from "./event-dates";
const chapters = [
  { id: "recuerdos", label: "Nuestra historia" },
  { id: "promesa", label: "Nuestro sí" },
  { id: "viaje", label: "El viaje" },
  { id: "fechas", label: "El gran día" },
];

function GiftDialog({
  open,
  data,
  onClose,
}: {
  open: boolean;
  data: WeddingData;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
      setCopied(false);
      setCopyError(false);
    } else if (dialog.open) dialog.close();
    const previous = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  async function copyAlias() {
    if (!data.gifts.alias) return;
    let success = false;
    try {
      await navigator.clipboard.writeText(data.gifts.alias);
      success = true;
    } catch {
      // Fallback for browsers without the Clipboard API or secure context.
      const input = document.getElementById(
        "bank-alias",
      ) as HTMLInputElement | null;
      if (input) {
        input.focus();
        input.select();
        try {
          success = document.execCommand("copy");
        } catch {
          /* Keep manual selection available. */
        }
      }
    }
    setCopied(success);
    setCopyError(!success);
  }

  return (
    <dialog
      className="detail-dialog"
      ref={dialogRef}
      onCancel={onClose}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-labelledby="dialog-title"
    >
      <div className="dialog-inner">
        <button
          className="dialog-close"
          onClick={onClose}
          aria-label="Cerrar"
          autoFocus
        >
          <X size={21} />
        </button>
        <div className="dialog-symbol">
          <Gift size={30} strokeWidth={1} />
        </div>
        <p className="eyebrow">TU APOYO, UN NUEVO RECUERDO</p>
        <h2 id="dialog-title">
          Un pedacito de
          <br />
          nuestro <em>viaje.</em>
        </h2>
        <p>
          Tu compañía es lo más importante. Si querés acompañarnos también
          en nuestra luna de miel, gracias de corazón.
        </p>
        {data.gifts.alias ? (
          <div className="account-details">
            <span>
              {data.gifts.bank}
              {data.gifts.accountHolder
                ? ` · ${data.gifts.accountHolder}`
                : ""}
            </span>
            <label htmlFor="bank-alias">ALIAS PARA TU APOYO</label>
            <input
              id="bank-alias"
              readOnly
              value={data.gifts.alias}
              onFocus={(e) => e.currentTarget.select()}
            />
            <button className="button button-gold" onClick={copyAlias}>
              {copied ? <Check size={17} /> : <Copy size={17} />}{" "}
              {copied ? "Alias copiado" : "Copiar alias"}
            </button>
            <p role="status">
              {copyError
                ? "Seleccioná el alias y copialo manualmente."
                : copied
                  ? "Listo, ya podés pegarlo en tu banco."
                  : ""}
            </p>
          </div>
        ) : (
          <div className="coming-soon">
            <Sparkles size={20} />
            <strong>Pronto compartiremos el alias</strong>
            <span>
              Los datos para acompañarnos van a estar disponibles acá.
            </span>
          </div>
        )}
      </div>
    </dialog>
  );
}

export default function WeddingExperience({ data }: { data: WeddingData }) {
  const reduced = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState("inicio");
  const [scrolled, setScrolled] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [celebrated, setCelebrated] = useState(false);
  const burstTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 150, damping: 35 });
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveChapter(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -50% 0px" },
    );
    document
      .querySelectorAll(".chapter")
      .forEach((section) => observer.observe(section));
    const update = () => setScrolled(window.scrollY > 60);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
      if (burstTimer.current) clearTimeout(burstTimer.current);
    };
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [menuOpen]);
  function celebrate() {
    setCelebrated(true);
    setCelebrating(true);
    if (burstTimer.current) clearTimeout(burstTimer.current);
    burstTimer.current = setTimeout(() => setCelebrating(false), 1300);
  }
  const gift = useCallback(() => setGiftOpen(true), []);
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">
        Saltar al contenido
      </a>
      <motion.div
        className="page-progress"
        style={{ scaleX: reduced ? scrollYProgress : progress }}
        aria-hidden="true"
      />
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <a
          href="#inicio"
          className="monogram"
          aria-label="Micaela y Adriaham, inicio"
        >
          m<span>&</span>a<span className="monogram-star">✦</span>
        </a>
        <nav className="desktop-nav" aria-label="Navegación principal">
          {chapters.map((c) => (
            <a
              href={`#${c.id}`}
              key={c.id}
              aria-current={activeChapter === c.id ? "location" : undefined}
            >
              {c.label}
            </a>
          ))}
        </nav>
        <button className="header-gift" onClick={gift}>
          Tu apoyo <ArrowUpRight size={15} />
        </button>
        <span className="mobile-date">{data.compactDate}</span>
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
        {menuOpen && (
          <nav
            id="mobile-menu"
            className="mobile-menu"
            aria-label="Navegación móvil"
          >
            {chapters.map((c, i) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                onClick={() => setMenuOpen(false)}
              >
                <span>0{i + 1}</span>
                {c.label}
                <ArrowUpRight size={18} />
              </a>
            ))}
            <button
              onClick={() => {
                setMenuOpen(false);
                gift();
              }}
            >
              Tu apoyo <Gift size={18} />
            </button>
          </nav>
        )}
      </header>
      <main id="main">
        <CinematicHero data={data} />
        <PhotoGallery photos={data.gallery} />
        <section
          id="historia"
          className="story-section chapter"
          aria-labelledby="story-title"
        >
          <div className="story-copy">
            <Reveal>
              <p className="eyebrow">{data.story.eyebrow}</p>
              <h2 id="story-title">
                {data.story.title}
                <br />
                <em>{data.story.titleAccent}</em>
              </h2>
              <span className="little-star" aria-hidden="true">
                ✦
              </span>
              {data.story.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p className="story-blessing">{data.story.ending}</p>
              <span className="story-signature">{data.story.handwritten}</span>
            </Reveal>
          </div>
          <div className="story-photos">
            <span className="story-photo-note">NUESTRO DESTINO FAVORITO</span>
            <Reveal className="story-main-photo">
              <figure>
                <div>
                  <Image
                    src={data.story.photos[0].src}
                    alt={data.story.photos[0].alt}
                    fill
                    sizes="(max-width: 700px) 67vw, 32vw"
                    style={{
                      objectPosition: data.story.photos[0].objectPosition,
                    }}
                  />
                </div>
                <figcaption>{data.story.photos[0].caption}</figcaption>
              </figure>
            </Reveal>
            <Reveal className="story-small-photo" delay={0.15}>
              <figure>
                <div>
                  <Image
                    src={data.story.photos[1].src}
                    alt={data.story.photos[1].alt}
                    fill
                    sizes="(max-width: 700px) 48vw, 22vw"
                    style={{
                      objectPosition: data.story.photos[1].objectPosition,
                    }}
                  />
                </div>
                <figcaption>{data.story.photos[1].caption}</figcaption>
              </figure>
            </Reveal>
            <span className="photo-coordinate">
              DOS CAMINOS. UNA MISMA HISTORIA.
            </span>
            <span className="story-orbit" aria-hidden="true" />
          </div>
        </section>
        <section
          id="promesa"
          className="faith-moment chapter"
          aria-labelledby="faith-title"
        >
          <Reveal>
            <p className="eyebrow">NUESTRA PROMESA</p>
            <h2 id="faith-title">
              Un sí ante Dios.
              <br />
              <em>Una vida juntos.</em>
            </h2>
            <blockquote>{data.faith.marriage.text}</blockquote>
            <a
              href={data.faith.marriage.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {data.faith.marriage.reference} · {data.faith.version}
            </a>
          </Reveal>
        </section>
        <Journey data={data} onGift={gift} />
        <section
          id="celebrar"
          className="finale chapter"
          aria-labelledby="finale-title"
        >
          <div className="finale-landscape">
            <Image
              src={data.finale.backgroundImage}
              alt=""
              fill
              sizes="100vw"
            />
          </div>
          <div className="finale-shade" />
          <div className="aurora finale-aurora" aria-hidden="true" />
          <div className="finale-content">
            <Reveal>
              <span className="finale-star" aria-hidden="true">
                ✦
              </span>
              <p className="eyebrow">
                EL PRÓXIMO CAPÍTULO LO ESCRIBIMOS JUNTOS
              </p>
              <h2 id="finale-title">
                Lo más lindo del viaje{" "}
                <br />
                es <em>compartirlo.</em>
              </h2>
              <p className="finale-subtitle">{data.finale.subtitle}</p>
              <blockquote className="finale-verse">
                {data.faith.love.text}
                <a
                  href={data.faith.love.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data.faith.love.reference} · {data.faith.version}
                </a>
              </blockquote>
              <div className="finale-actions">
                <Magnetic>
                  <button className="button button-gold" onClick={gift}>
                    Ser parte del viaje <Gift size={16} />
                  </button>
                </Magnetic>
              </div>
              <div className="celebrate-wrap">
                <button className="celebrate-button" onClick={celebrate}>
                  <Sparkles size={16} /> Celebrar con nosotros
                </button>
                <AnimatePresence>
                  {celebrating && !reduced && (
                    <div className="sparkle-burst" aria-hidden="true">
                      {Array.from({ length: 18 }, (_, i) => (
                        <motion.span
                          key={i}
                          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                          animate={{
                            x:
                              Math.cos((i * Math.PI) / 9) * (70 + (i % 3) * 30),
                            y:
                              Math.sin((i * Math.PI) / 9) *
                                (65 + (i % 4) * 20) -
                              35,
                            opacity: [1, 1, 0],
                            scale: [0, 1, 0],
                            rotate: i * 50,
                          }}
                          transition={{ duration: 1.1, ease: "easeOut" }}
                          style={
                            {
                              "--spark-color":
                                i % 3 === 0
                                  ? "#a8c9b2"
                                  : i % 3 === 1
                                    ? "#dec797"
                                    : "#c4b1d7",
                            } as CSSProperties
                          }
                        />
                      ))}
                    </div>
                  )}
                </AnimatePresence>
                <p className="celebrate-message" role="status">
                  {celebrated ? "¡Que empiece nuestra gran aventura!" : ""}
                </p>
              </div>
              <div className="finale-signature">
                {data.names.first} <em>&</em> {data.names.second}
              </div>
              <span className="finale-date">{data.compactDate}</span>
            </Reveal>
          </div>
        </section>
        <EventDates data={data} />
      </main>
      <footer>
        <span>{data.names.full}</span>
        <span>HECHO CON AMOR, PARA COMPARTIR.</span>
        <a href="#inicio">
          Volver al comienzo <ArrowUpRight size={14} />
        </a>
      </footer>
      <nav className="chapter-dots" aria-label="Progreso del recorrido">
        {[
          { id: "inicio", label: "Inicio" },
          ...chapters,
          { id: "celebrar", label: "Celebrar" },
        ].map((c) => (
          <a
            href={`#${c.id}`}
            key={c.id}
            aria-label={c.label}
            aria-current={activeChapter === c.id ? "location" : undefined}
          >
            <span>{c.label}</span>
          </a>
        ))}
      </nav>
      <PersistentControls
        data={data}
        onGift={gift}
        hidden={giftOpen || menuOpen}
      />
      <GiftDialog open={giftOpen} data={data} onClose={() => setGiftOpen(false)} />
    </MotionConfig>
  );
}
