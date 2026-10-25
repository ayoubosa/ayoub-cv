"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
}

const ACCENTS = ["#8b6cff", "#2f7bff", "#ff5e9c", "#3fd6c0", "#ffb84d"];
const CARD_W = 150;
const CARD_H = 270;
const SWIPE_THRESHOLD = 30;

export default function GalleryCard() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [fsIndex, setFsIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reduced, setReduced] = useState(false);

  const dragStartX = useRef<number | null>(null);
  const [dragDelta, setDragDelta] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const accent = ACCENTS[current % ACCENTS.length];

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/gallery");
        const imgs = await res.json();
        setImages(Array.isArray(imgs) ? imgs : []);
      } catch {
        /* network error — silent */
      }
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (!fullscreen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setFullscreen(false);
      if (e.key === "ArrowLeft") setFsIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setFsIndex((i) => Math.min(images.length - 1, i + 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen, images.length]);

  function onPointerDown(e: React.PointerEvent) {
    dragStartX.current = e.clientX;
    setDragDelta(0);
    setIsDragging(false);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 8) setIsDragging(true);
    setDragDelta(delta);
  }

  function onPointerUp() {
    const delta = dragDelta;
    const wasDragging = isDragging;
    dragStartX.current = null;
    setDragDelta(0);
    setIsDragging(false);
    if (!wasDragging) {
      setFsIndex(current);
      setFullscreen(true);
      return;
    }
    if (delta < -SWIPE_THRESHOLD && current < images.length - 1) setCurrent((c) => c + 1);
    else if (delta > SWIPE_THRESHOLD && current > 0) setCurrent((c) => c - 1);
  }

  function onPointerCancel() {
    dragStartX.current = null;
    setDragDelta(0);
    setIsDragging(false);
  }

  const clampedDelta = Math.max(-CARD_W * 0.35, Math.min(CARD_W * 0.35, dragDelta));
  const stripX = -(current * CARD_W) + (isDragging ? clampedDelta : 0);
  const stripTransition = isDragging
    ? "none"
    : reduced
    ? "transform 0s"
    : "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)";

  // Card visual — loading, empty, or photo strip. Heart is always outside.
  function CardFace() {
    if (loading) {
      return (
        <div style={{
          width: CARD_W, height: CARD_H, borderRadius: "28px 8px 28px 8px",
          background: "rgba(255,255,255,0.04)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: reduced ? "none" : "rotate(-2deg)",
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.15)",
            borderTopColor: "#8b6cff",
            animation: "spin 1s linear infinite",
          }} />
        </div>
      );
    }

    if (images.length === 0) {
      return (
        <div style={{
          width: CARD_W, height: CARD_H, borderRadius: "28px 8px 28px 8px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: reduced ? "none" : "rotate(-2deg)",
        }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.18)", textAlign: "center", padding: "0 14px", lineHeight: 1.5 }}>
            Photos coming soon
          </span>
        </div>
      );
    }

    return (
      <div
        style={{
          width: CARD_W, height: CARD_H,
          borderRadius: "28px 8px 28px 8px",
          overflow: "hidden",
          transform: reduced ? "none" : "rotate(-2deg)",
          boxShadow: `0 0 40px ${accent}55, 0 8px 32px rgba(0,0,0,0.4)`,
          border: `1.5px solid ${accent}66`,
          position: "relative",
          cursor: images.length > 1 ? "grab" : "pointer",
          userSelect: "none",
          touchAction: "none",
          transition: reduced ? "none" : "box-shadow 0.4s ease, border-color 0.4s ease",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        {/* Corner accent */}
        <div style={{
          position: "absolute", top: 0, left: 0, zIndex: 2, pointerEvents: "none",
          width: 46, height: 46,
          borderRadius: "26px 0 100% 0",
          background: `linear-gradient(135deg, ${accent}aa, transparent 70%)`,
          transition: reduced ? "none" : "background 0.4s ease",
        }} />

        {/* Photo strip */}
        <div style={{
          display: "flex",
          width: images.length * CARD_W,
          height: CARD_H,
          transform: `translateX(${stripX}px)`,
          transition: stripTransition,
        }}>
          {images.map((img, i) => (
            <div key={img.id} style={{ width: CARD_W, height: CARD_H, flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={`Gallery photo ${i + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        {images.length > 1 && (
          <div style={{
            position: "absolute", bottom: 10, left: 0, right: 0, zIndex: 3,
            display: "flex", justifyContent: "center", gap: 5, pointerEvents: "none",
          }}>
            {images.map((_, i) => (
              <div key={i} style={{
                width: i === current ? 14 : 5, height: 5,
                borderRadius: 3,
                background: i === current ? accent : "rgba(255,255,255,0.35)",
                transition: reduced ? "none" : "width 0.3s ease, background 0.3s ease",
              }} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "inline-block", marginBottom: 24 }}>
        <CardFace />
      </div>

      {/* Fullscreen viewer */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            style={{
              position: "fixed", inset: 0, zIndex: 200,
              background: "rgba(0,0,0,0.92)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.22 }}
            onClick={(e) => { if (e.target === e.currentTarget) setFullscreen(false); }}
          >
            <button
              onClick={() => setFullscreen(false)}
              style={{
                position: "absolute", top: 20, right: 20, zIndex: 10,
                background: "rgba(255,255,255,0.1)", border: "none",
                borderRadius: 10, width: 40, height: 40,
                color: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <X size={20} />
            </button>

            <div style={{
              position: "absolute", top: 26, left: 0, right: 0,
              textAlign: "center", color: "rgba(255,255,255,0.45)", fontSize: 12,
            }}>
              {fsIndex + 1} / {images.length}
            </div>

            <motion.img
              key={fsIndex}
              src={images[fsIndex]?.url}
              alt={`Gallery photo ${fsIndex + 1}`}
              style={{ maxWidth: "90vw", maxHeight: "80vh", objectFit: "contain", borderRadius: 16 }}
              initial={reduced ? {} : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={reduced ? { duration: 0 } : { duration: 0.2 }}
            />

            {fsIndex > 0 && (
              <button
                onClick={() => setFsIndex((i) => i - 1)}
                style={{
                  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                  background: "rgba(255,255,255,0.1)", border: "none",
                  borderRadius: 10, width: 44, height: 44,
                  color: "#fff", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <ChevronLeft size={22} />
              </button>
            )}

            {fsIndex < images.length - 1 && (
              <button
                onClick={() => setFsIndex((i) => i + 1)}
                style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "rgba(255,255,255,0.1)", border: "none",
                  borderRadius: 10, width: 44, height: 44,
                  color: "#fff", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <ChevronRight size={22} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
