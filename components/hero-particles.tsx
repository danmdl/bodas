"use client";
import { useEffect, useRef } from "react";
export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(pointer: fine)");
    if (media.matches || !fine.matches) return;
    let width = 0,
      height = 0,
      frame = 0,
      lastTime = 0,
      visible = true,
      inside = false;
    const mouse = { x: 0, y: 0 };
    const points = Array.from({ length: 30 }, (_, i) => ({
      x: ((i * 137.508) % 997) / 997,
      y: ((i * 293.137) % 991) / 991,
      radius: 0.65 + (i % 3) * 0.35,
      phase: i * 0.8,
    }));
    const tail = Array.from({ length: 7 }, () => ({ x: 0, y: 0 }));
    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const ratio = Math.min(devicePixelRatio, 1.5);
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
      if (!inside)
        tail.forEach((p) => {
          p.x = mouse.x;
          p.y = mouse.y;
        });
      inside = true;
    };
    const leave = () => {
      inside = false;
    };
    const draw = (time: number) => {
      if (!visible || document.hidden || media.matches) {
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(draw);
      if (time - lastTime < 32) return;
      lastTime = time;
      ctx.clearRect(0, 0, width, height);
      points.forEach((p) => {
        const influence = inside ? (mouse.x / width - 0.5) * 7 : 0;
        const x =
          p.x * width + Math.sin(time * 0.00015 + p.phase) * 13 + influence;
        const y = p.y * height + Math.cos(time * 0.00018 + p.phase) * 10;
        ctx.beginPath();
        ctx.arc(x, y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,214,170,${0.22 + Math.sin(time * 0.0007 + p.phase) * 0.14})`;
        ctx.fill();
      });
      if (inside)
        tail.forEach((p, i) => {
          const target = i === 0 ? mouse : tail[i - 1];
          p.x += (target.x - p.x) * 0.21;
          p.y += (target.y - p.y) * 0.21;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.8 - i * 0.18, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(224,211,163,${0.65 - i * 0.075})`;
          ctx.fill();
        });
    };
    const restart = () => {
      if (!frame && visible && !document.hidden && !media.matches)
        frame = requestAnimationFrame(draw);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      restart();
    });
    observer.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const parent = canvas.parentElement;
    parent?.addEventListener("pointermove", move);
    parent?.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", restart);
    media.addEventListener("change", restart);
    resize();
    restart();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      ro.disconnect();
      parent?.removeEventListener("pointermove", move);
      parent?.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", restart);
      media.removeEventListener("change", restart);
    };
  }, []);
  return (
    <canvas ref={canvasRef} className="hero-particles" aria-hidden="true" />
  );
}
