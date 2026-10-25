"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GraduationCap, MapPin, Heart } from "lucide-react";
import CVLockScreen from "@/components/CVLockScreen";

// ─── Easy-edit constants ────────────────────────────────────────────────────
const NAME = "Ayoub Osama Ayoub";
const TITLE = "Software Engineer · AI · Entrepreneur";
const ACCENT = "linear-gradient(135deg, #8b6cff, #2f7bff)";

const STATUS_BANNERS = [
  {
    Icon: GraduationCap,
    text: "Üsküdar Graduate",
    title: "Education",
    detail:
      "Software engineer graduated from Üsküdar University, Istanbul. Focused on building practical software and AI-powered applications.",
  },
  {
    Icon: MapPin,
    text: "Istanbul · Abu Dhabi",
    title: "Where I am now",
    detail:
      "Splitting time between Istanbul, Turkey and Abu Dhabi, UAE. Open to remote work, collaborations, and new opportunities anywhere.",
  },
];

const SOCIAL_LINKS = [
  { label: "LinkedIn",  url: "https://linkedin.com/in/ayoubosamaayoub", color: "#0a66c2",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width={19} height={19}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { label: "GitHub",    url: "https://github.com/ayoubosa",             color: "#fff",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width={19} height={19}><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> },
  { label: "Instagram", url: "https://instagram.com/ayouboma",          color: "#e1306c",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width={19} height={19}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
  { label: "TikTok",   url: "https://tiktok.com/@ayouboam_",           color: "#fff",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width={19} height={19}><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg> },
  { label: "WhatsApp",  url: "https://wa.me/905310159490",              color: "#25d366",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width={19} height={19}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
  { label: "X",         url: "https://x.com/ayouboam",                 color: "#fff",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width={19} height={19}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { label: "Facebook",  url: "https://facebook.com/ayoubosama",         color: "#1877f2",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width={19} height={19}><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
];
// ────────────────────────────────────────────────────────────────────────────

// ── Fixed top-left like button ───────────────────────────────────────────────
function LikeCorner({ reduce }: { reduce: boolean }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setLiked(localStorage.getItem("gallery_liked") === "1");
    fetch("/api/gallery/likes")
      .then((r) => r.json())
      .then((d) => { if (typeof d.count === "number") setCount(d.count); })
      .catch(() => {});
  }, []);

  function handleLike() {
    if (liked) return;
    setLiked(true);
    setCount((c) => c + 1);
    localStorage.setItem("gallery_liked", "1");
    fetch("/api/gallery/like", { method: "POST" }).catch(() => {});
  }

  return (
    <div style={{
      position: "fixed", top: 16, left: 16, zIndex: 50,
      display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
    }}>
      <motion.button
        onClick={handleLike}
        aria-label={liked ? "Already liked" : "Like this page"}
        whileTap={reduce ? {} : { scale: 0.80 }}
        style={{
          background: liked ? "rgba(255,94,156,0.15)" : "rgba(0,0,0,0.45)",
          border: `1px solid ${liked ? "#ff5e9c" : "rgba(255,255,255,0.18)"}`,
          borderRadius: 10, width: 36, height: 36,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: liked ? "default" : "pointer",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          transition: "background 0.2s, border-color 0.2s",
        }}
      >
        <Heart
          size={15}
          fill={liked ? "#ff5e9c" : "none"}
          color={liked ? "#ff5e9c" : "rgba(255,255,255,0.65)"}
          style={{ transition: "fill 0.2s, color 0.2s" }}
        />
      </motion.button>
      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
        {count}
      </span>
    </div>
  );
}

// ── Rocket mascot ────────────────────────────────────────────────────────────
function RocketMascot({ reduce }: { reduce: boolean }) {
  const [launching, setLaunching] = useState(false);
  const [bubble, setBubble] = useState(false);

  const launch = () => {
    if (launching) return;
    setLaunching(true);
    setBubble(true);
    if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
    setTimeout(() => { setLaunching(false); setBubble(false); }, 1800);
  };

  return (
    <div style={{
      position: "absolute", bottom: 6, left: 16, zIndex: 4,
      width: 46, height: 64, display: "flex", alignItems: "flex-end", justifyContent: "center",
    }}>
      {/* Speech bubble */}
      <AnimatePresence>
        {bubble && (
          <motion.div
            style={{
              position: "absolute", bottom: 60, left: 0,
              padding: "5px 10px", borderRadius: 10,
              background: "rgba(22,20,38,0.92)",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "#fff", fontSize: 11.5, whiteSpace: "nowrap",
            }}
            initial={{ scale: 0.6, y: 6, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.6, y: 6, opacity: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.22 }}
          >
            🚀 liftoff!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flame trail */}
      {launching && !reduce && (
        <span style={{
          position: "absolute", bottom: 14, width: 9, borderRadius: 6,
          background: "linear-gradient(to top, transparent, #ffd05e, #ff5e3a)",
          filter: "blur(2px)",
          animation: "rocket-trail 1.8s ease-in forwards",
        }} />
      )}

      {/* Rocket emoji — replace with <img src="/mascot.gif" …> when ready */}
      <button
        onClick={launch}
        aria-label="Launch rocket"
        style={{
          position: "relative", background: "none", border: "none", cursor: "pointer",
          fontSize: 34, lineHeight: 1, zIndex: 1,
          transform: "translateY(34%) rotate(-45deg)",
          animation: launching && !reduce ? "rocket-launch 1.8s cubic-bezier(.45,0,.5,1) forwards" : "none",
          filter: "drop-shadow(0 4px 10px rgba(0,0,0,.5))",
        }}
      >
        🚀
      </button>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function ProfileLanding() {
  const router = useRouter();
  const [showLock, setShowLock] = useState(false);
  const [activeSheet, setActiveSheet] = useState<(typeof STATUS_BANNERS)[0] | null>(null);
  const [reduced, setReduced] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const anim = !reduced;

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#07060f" }}>

      {/* ── Aurora mesh (mix-blend-mode: screen over dark base) ── */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {/* Deep dark base */}
        <div style={{ position: "absolute", inset: 0,
          background: "radial-gradient(130% 90% at 50% 0%, #1c1640 0%, #0e0b22 50%, #07060f 100%)" }} />

        {/* Blobs with screen blend */}
        <div style={{ position: "absolute", inset: 0, mixBlendMode: "screen" }}>
          {[
            { c: "rgba(139,108,255,0.60)", w: 300, t: "-12%", l: "-15%", dur: 16 },
            { c: "rgba(47,123,255,0.55)",  w: 320, t: "18%",  l: "52%",  dur: 20 },
            { c: "rgba(198,107,255,0.45)", w: 260, t: "52%",  l: "-12%", dur: 18 },
            { c: "rgba(63,214,192,0.32)",  w: 240, t: "58%",  l: "48%",  dur: 23 },
          ].map((b, i) =>
            mounted && anim ? (
              <motion.div
                key={i}
                style={{
                  position: "absolute", top: b.t, left: b.l,
                  width: b.w, height: b.w, borderRadius: "50%",
                  background: `radial-gradient(circle, ${b.c}, transparent 65%)`,
                  filter: "blur(46px)",
                  willChange: "transform",
                }}
                animate={{ x: [0, 42, -28, 0], y: [0, 32, -36, 0], scale: [1, 1.22, 0.92, 1] }}
                transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut", delay: i * 4 }}
              />
            ) : (
              <div
                key={i}
                style={{
                  position: "absolute", top: b.t, left: b.l,
                  width: b.w, height: b.w, borderRadius: "50%",
                  background: `radial-gradient(circle, ${b.c}, transparent 65%)`,
                  filter: "blur(46px)",
                }}
              />
            )
          )}
        </div>

        {/* Vignette */}
        <div style={{ position: "absolute", inset: 0,
          background: "radial-gradient(85% 62% at 50% 46%, transparent 38%, rgba(7,6,15,0.55) 100%)" }} />
      </div>

      {/* ── Content (scrollable so gallery + all elements fit on any screen) ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        overflowY: "auto", overflowX: "hidden",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        WebkitOverflowScrolling: "touch" as any,
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          width: "100%", maxWidth: 340,
          paddingTop: "max(env(safe-area-inset-top), 32px)",
          paddingBottom: "max(env(safe-area-inset-bottom), 48px)",
          paddingLeft: 28, paddingRight: 28,
          color: "#fff",
          margin: "auto",
        }}>

          {/* Profile photo */}
          <motion.div
            style={{ marginBottom: 16 }}
            initial={anim ? { scale: 0.82 } : {}}
            animate={{ scale: 1 }}
            transition={anim ? { duration: 0.7, ease: "easeOut" } : { duration: 0 }}
          >
            <div style={{
              width: 96, height: 96, borderRadius: "50%", padding: 3,
              background: ACCENT,
              boxShadow: "0 0 32px rgba(139,108,255,0.55)",
            }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "#15131f" }}>
                <Image
                  src="/photo5.jpg"
                  alt={NAME}
                  width={96}
                  height={96}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  priority
                />
              </div>
            </div>
          </motion.div>

          {/* Name + title */}
          <motion.div
            style={{ textAlign: "center", marginBottom: 18 }}
            initial={anim ? { y: 12 } : {}}
            animate={{ y: 0 }}
            transition={anim ? { duration: 0.5, delay: 0.1, ease: "easeOut" } : { duration: 0 }}
          >
            <div style={{ fontSize: 23, fontWeight: 700, letterSpacing: -0.3 }}>{NAME}</div>
            <div style={{ fontSize: 12.5, opacity: 0.6, marginTop: 5 }}>{TITLE}</div>
          </motion.div>

          {/* Status pills */}
          <motion.div
            style={{ display: "flex", gap: 9, flexWrap: "wrap", justifyContent: "center", marginBottom: 26 }}
            initial={anim ? { y: 12 } : {}}
            animate={{ y: 0 }}
            transition={anim ? { duration: 0.5, delay: 0.18, ease: "easeOut" } : { duration: 0 }}
          >
            {STATUS_BANNERS.map((b) => (
              <button
                key={b.text}
                onClick={() => setActiveSheet(b)}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "7px 13px",
                  borderRadius: 999, border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.06)", backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  color: "#fff", fontSize: 11.5, fontWeight: 500, cursor: "pointer",
                }}
              >
                <b.Icon size={13} style={{ opacity: 0.85 }} />
                {b.text}
              </button>
            ))}
          </motion.div>

          {/* Social row */}
          <motion.div
            style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 0 }}
            initial={anim ? { y: 12 } : {}}
            animate={{ y: 0 }}
            transition={anim ? { duration: 0.5, delay: 0.26, ease: "easeOut" } : { duration: 0 }}
          >
            {SOCIAL_LINKS.map((s) => (
              <motion.a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                style={{
                  width: 42, height: 42, borderRadius: 13,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.06)", backdropFilter: "blur(10px)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: s.color,
                }}
                whileHover={anim ? { y: -3, background: "rgba(255,255,255,0.12)" } : {}}
                whileTap={anim ? { scale: 0.88 } : {}}
                transition={{ type: "spring", stiffness: 380, damping: 20 }}
              >
                {s.icon}
              </motion.a>
            ))}
          </motion.div>

          {/* CV button (hidden for now) */}
          {/*
          <motion.div
            style={{ width: "100%" }}
            initial={anim ? { y: 12 } : {}}
            animate={{ y: 0 }}
            transition={anim ? { duration: 0.5, delay: 0.34, ease: "easeOut" } : { duration: 0 }}
          >
            <motion.button
              onClick={() => setShowLock(true)}
              style={{
                width: "100%", padding: "15px 0", borderRadius: 16, border: "none",
                background: ACCENT, color: "#fff", fontSize: 15.5, fontWeight: 700,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                gap: 9, boxShadow: "0 14px 34px rgba(139,108,255,0.4)",
              }}
              whileHover={anim ? { scale: 1.02, boxShadow: "0 18px 40px rgba(139,108,255,0.55)" } : {}}
              whileTap={anim ? { scale: 0.97 } : {}}
              transition={{ type: "spring", stiffness: 380, damping: 20 }}
            >
              <Lock size={17} />
              View my CV
            </motion.button>
            <div style={{ fontSize: 11, opacity: 0.4, textAlign: "center", marginTop: 10 }}>
              Passcode protected
            </div>
          </motion.div>
          */}

        </div>
      </div>

      {/* ── Fixed top-left like button ── */}
      {mounted && <LikeCorner reduce={reduced} />}

      {/* ── Rocket mascot (bottom-left, peeks from corner) ── */}
      {mounted && <RocketMascot reduce={reduced} />}

      {/* ── Bottom sheet ── */}
      <AnimatePresence>
        {activeSheet && (
          <>
            <motion.div
              style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.5)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveSheet(null)}
            />
            <motion.div
              style={{
                position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
                background: "rgba(24,22,38,0.92)", backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderTopLeftRadius: 26, borderTopRightRadius: 26,
                padding: "20px 24px 32px",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff",
              }}
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={anim ? { type: "spring", damping: 32, stiffness: 310 } : { duration: 0 }}
              drag="y" dragConstraints={{ top: 0 }}
              onDragEnd={(_, info) => { if (info.offset.y > 80) setActiveSheet(null); }}
            >
              <div style={{ width: 38, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.25)", margin: "0 auto 16px" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{activeSheet.title}</div>
                <button
                  onClick={() => setActiveSheet(null)}
                  style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 9, width: 30, height: 30, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  ×
                </button>
              </div>
              <div style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.7 }}>{activeSheet.detail}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Passcode lock screen ── */}
      <AnimatePresence>
        {showLock && (
          <CVLockScreen
            onSuccess={() => router.push("/cv")}
            onCancel={() => setShowLock(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
