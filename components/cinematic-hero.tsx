"use client";
import { memo, useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { WeddingData } from "@/lib/wedding-data";
import { Magnetic } from "./motion-primitives";

function CinematicHero({ data }: { data: WeddingData }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { margin: "100px" });
  const pointerFrame = useRef(0);
  const latestPointer = useRef({ x: 0, y: 0 });
  useEffect(() => () => cancelAnimationFrame(pointerFrame.current), []);
  const px = useMotionValue(0),
    py = useMotionValue(0);
  const x = useSpring(px, { stiffness: 45, damping: 22 });
  const y = useSpring(py, { stiffness: 45, damping: 22 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const centerY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const centerScale = useTransform(scrollYProgress, [0, 0.8], [1, 1.15]);
  const sideLeft = useTransform(scrollYProgress, [0, 0.9], [0, -200]);
  const sideRight = useTransform(scrollYProgress, [0, 0.9], [0, 200]);
  const sideRotate = useTransform(scrollYProgress, [0, 1], [-12, -26]);
  const textY = useTransform(scrollYProgress, [0, 0.85], [0, -70]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  return (
    <section
      id="inicio"
      ref={ref}
      className={`cinema-hero chapter ${inView ? "is-in-view" : ""}`}
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== "mouse") return;
        // One compositor update per frame. No layout reads on pointer movement.
        latestPointer.current = { x: e.clientX, y: e.clientY };
        if (pointerFrame.current) return;
        pointerFrame.current = requestAnimationFrame(() => {
          pointerFrame.current = 0;
          px.set((latestPointer.current.x - window.innerWidth / 2) * 0.023);
          py.set((latestPointer.current.y - window.innerHeight / 2) * 0.016);
        });
      }}
      onPointerLeave={() => {
        cancelAnimationFrame(pointerFrame.current);
        pointerFrame.current = 0;
        px.set(0);
        py.set(0);
      }}
    >
      <div className="cinema-sky" aria-hidden="true">
        <Image src={data.finale.backgroundImage} fill sizes="100vw" alt="" />
      </div>
      <div className="cinema-light light-emerald" aria-hidden="true" />
      <div className="cinema-light light-violet" aria-hidden="true" />
      <div className="cinema-stars" aria-hidden="true" />
      <motion.div className="portrait-universe" style={reduced ? {} : { x, y }}>
        <div className="portrait-orbit orbit-one" aria-hidden="true" />
        <div className="portrait-orbit orbit-two" aria-hidden="true" />
        <motion.div
          className="hero-memory memory-left"
          style={reduced ? {} : { x: sideLeft, rotate: sideRotate }}
        >
          <Image
            src={data.story.photos[1].src}
            alt=""
            fill
            sizes="(max-width: 700px) 27vw, 20vw"
            style={{ objectPosition: data.story.photos[1].objectPosition }}
          />
          <span>vos + yo</span>
        </motion.div>
        <motion.div
          className="hero-memory memory-right"
          style={reduced ? {} : { x: sideRight, rotate: 12 }}
        >
          <Image
            src={data.gallery[4].src}
            alt=""
            fill
            sizes="(max-width: 700px) 27vw, 20vw"
            style={{ objectPosition: data.gallery[4].objectPosition }}
          />
          <span>un mismo camino</span>
        </motion.div>
        <motion.div
          className="portrait-frame"
          style={reduced ? {} : { y: centerY, scale: centerScale }}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={data.hero.photo.src}
            alt={data.hero.photo.alt}
            fill
            priority
            quality={85}
            sizes="(max-width: 700px) 82vw, 46vw"
            style={{ objectPosition: data.hero.photo.objectPosition }}
          />
          <div className="portrait-shade" />
        </motion.div>
      </motion.div>
      <div className="hero-top-note">
        <span>UN ENCUENTRO QUE DIOS HIZO POSIBLE</span>
        <span>ARGENTINA · {data.compactDate}</span>
      </div>
      <motion.div
        className="cinema-copy"
        style={reduced ? {} : { y: textY, opacity: textOpacity }}
      >
        <motion.p
          className="cinema-eyebrow"
          initial={reduced ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
        >
          NUESTRO SÍ, ANTE DIOS
        </motion.p>
        <h1 aria-label={`${data.names.first} & ${data.names.second}`}>
          <motion.span
            initial={reduced ? false : { opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.15,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {data.names.first}
          </motion.span>
          <motion.span
            className="cinema-second-name"
            initial={reduced ? false : { opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.15,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <em>&</em> {data.names.second}
          </motion.span>
        </h1>
        <p className="cinema-tagline">{data.hero.tagline}</p>
        <Magnetic>
          <a className="button button-gold cinema-cta" href="#recuerdos">
            Entrá en nuestra historia <ArrowUpRight size={17} />
          </a>
        </Magnetic>
      </motion.div>
      <a className="cinema-scroll" href="#recuerdos">
        <span>DESLIZÁ Y DEJATE LLEVAR</span>
        <ArrowDown size={18} />
      </a>
      <span className="hero-handwritten">Siempre, con vos.</span>
    </section>
  );
}

// Navigation and dialog state do not redraw the hero.
export default memo(CinematicHero);
