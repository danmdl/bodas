"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import type { Photo } from "@/config/wedding";
export default function PhotoGallery({ photos }: { photos: Photo[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(1);
  useEffect(() => {
    if (
      reduced ||
      !sectionRef.current ||
      !trackRef.current ||
      !windowRef.current
    )
      return;
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
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);
        const media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
          const track = trackRef.current!,
            viewport = windowRef.current!;
          const distance = () =>
            Math.max(0, track.scrollWidth - viewport.clientWidth);
          const animation = gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: shellRef.current,
              start: "top top",
              end: "bottom bottom",
              pin: false,
              scrub: 0.8,
              invalidateOnRefresh: true,
              onUpdate: (self) =>
                setIndex(
                  Math.min(
                    photos.length,
                    Math.floor(self.progress * photos.length) + 1,
                  ),
                ),
            },
          });
          return () => {
            animation.scrollTrigger?.kill();
            animation.kill();
            gsap.set(track, { clearProps: "transform" });
          };
        });
        cleanup = () => media.revert();
      },
      { rootMargin: "0px", threshold: 0.1 },
    );
    observer.observe(sectionRef.current);
    return () => {
      disposed = true;
      observer.disconnect();
      cleanup?.();
    };
  }, [reduced, photos.length]);
  const shift = (direction: number) => {
    const viewport = windowRef.current;
    if (!viewport) return;
    if (!reduced && shellRef.current) {
      const bounds = shellRef.current.getBoundingClientRect();
      const start = window.scrollY + bounds.top;
      const length = Math.max(
        1,
        shellRef.current.offsetHeight - window.innerHeight,
      );
      const current = Math.max(
        0,
        Math.min(1, (window.scrollY - start) / length),
      );
      window.scrollTo({
        top:
          start +
          Math.max(0, Math.min(1, current + direction / (photos.length - 1))) *
            length,
        behavior: "smooth",
      });
      return;
    }
    viewport.scrollBy({
      left: direction * (viewport.clientWidth * 0.84),
      behavior: reduced ? "instant" : "smooth",
    });
  };
  return (
    // Native CSS sticky owns the layout. GSAP only scrubs the photo track.
    // No pin spacer or DOM reparenting, so React and navigation remain stable.
    <div className="gallery-shell" ref={shellRef}>
      <section
        id="recuerdos"
        ref={sectionRef}
        className="gallery-section chapter"
        aria-labelledby="gallery-title"
      >
        <div className="section-heading gallery-heading">
          <div>
            <p className="eyebrow">CADA INSTANTE NOS TRAJO HASTA ACÁ</p>
            <h2 id="gallery-title">
              Nuestra forma
              <br />
              de <em>ser felices.</em>
            </h2>
          </div>
          <div className="gallery-note">
            <p>
              No son solo fotos.
              <br />
              Es todo lo que sentimos.
            </p>
            <span className="gallery-counter">
              {String(index).padStart(2, "0")}{" "}
              <span>/ {String(photos.length).padStart(2, "0")}</span>
            </span>
          </div>
        </div>
        <div
          className="gallery-window"
          ref={windowRef}
          onScroll={(e) => {
            if (!reduced) return;
            const total =
              e.currentTarget.scrollWidth - e.currentTarget.clientWidth;
            setIndex(
              Math.min(
                photos.length,
                Math.round(
                  (e.currentTarget.scrollLeft / Math.max(1, total)) *
                    (photos.length - 1),
                ) + 1,
              ),
            );
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
              e.preventDefault();
              shift(e.key === "ArrowRight" ? 1 : -1);
            }
          }}
          tabIndex={0}
          role="region"
          aria-label="Galería de recuerdos, deslizá para recorrer las fotos"
        >
          <div className="gallery-track" ref={trackRef}>
            {photos.map((photo, i) => (
              <figure className={`gallery-card card-${i}`} key={photo.src}>
                <div className="gallery-image">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 640px) 80vw, 470px"
                    style={{ objectPosition: photo.objectPosition }}
                  />
                </div>
                <figcaption>{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
        <div className="gallery-bottom">
          <span>UN ÁLBUM, INFINITAS GANAS DE SEGUIR SUMANDO.</span>
          <div className="gallery-mobile-controls">
            <button onClick={() => shift(-1)} aria-label="Foto anterior">
              <ArrowLeft size={18} />
            </button>
            <button onClick={() => shift(1)} aria-label="Foto siguiente">
              <ArrowRight size={18} />
            </button>
          </div>
          <span className="gallery-scroll-hint">
            SEGUÍ DESLIZANDO <ArrowRight size={17} />
          </span>
        </div>
      </section>
    </div>
  );
}
