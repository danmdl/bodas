"use client";
import { useEffect, useRef } from "react";
export function trackWeddingEvent(event: "visit" | "registry" | "alias") {
  if (navigator.doNotTrack === "1") return;
  void fetch("/api/stats", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event }), keepalive: true }).catch(() => {});
}
export default function TrafficTracker() {
  const sent = useRef(false);
  useEffect(() => {
    if (location.pathname !== "/") return;
    const visit = () => {
      if (!sent.current && document.visibilityState === "visible") { sent.current = true; trackWeddingEvent("visit"); }
    };
    // Does not block rendering or fetch any third-party script.
    const timer = window.setTimeout(visit, 1500);
    document.addEventListener("visibilitychange", visit);
    const click = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.("a.floating-registry")) trackWeddingEvent("registry");
    };
    document.addEventListener("click", click);
    return () => { clearTimeout(timer); document.removeEventListener("visibilitychange", visit); document.removeEventListener("click", click); };
  }, []);
  return null;
}
