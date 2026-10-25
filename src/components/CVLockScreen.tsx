"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ArrowLeft, Delete } from "lucide-react";

interface CVLockScreenProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const LEN = 6;
const ACCENT = "linear-gradient(135deg, #8b6cff, #2f7bff)";

function haptic(level: "light" | "error") {
  if (typeof navigator !== "undefined" && navigator.vibrate)
    navigator.vibrate(level === "light" ? 12 : [40, 60, 40]);
}

interface RippleState { key: number; x: number; y: number; }

// ── Round keypad button ─────────────────────────────────────────────────────
function KeyButton({
  digit, ripple, disabled, reduce, onPress,
}: {
  digit: string;
  ripple: RippleState | null;
  disabled: boolean;
  reduce: boolean;
  onPress: (x: number, y: number) => void;
}) {
  const [pressed, setPressed] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onPress(
      ((e.clientX - rect.left) / rect.width) * 100,
      ((e.clientY - rect.top) / rect.height) * 100,
    );
    if (navigator.vibrate) navigator.vibrate(12);
  };

  const isRippling = ripple !== null && !reduce;

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      aria-label={`Number ${digit}`}
      className="kbtn-round relative select-none disabled:opacity-40 transition-transform"
      style={{
        width: 74, height: 74, borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.12)",
        background: pressed ? "rgba(139,108,255,0.25)" : "rgba(255,255,255,0.07)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        color: "#fff", fontSize: 28, fontWeight: 500,
        cursor: "pointer", overflow: "hidden",
        transition: "background 0.15s",
      }}
    >
      {digit}

      {/* Press-point ripple */}
      <AnimatePresence>
        {isRippling && (
          <motion.span
            key={ripple!.key}
            className="absolute rounded-full pointer-events-none"
            style={{
              inset: 0,
              background: `radial-gradient(circle at ${ripple!.x}% ${ripple!.y}%, rgba(139,108,255,0.55), transparent 62%)`,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2.6, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
    </button>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function CVLockScreen({ onSuccess, onCancel }: CVLockScreenProps) {
  const [code, setCode] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "wrong" | "success">("idle");
  const [ripple, setRipple] = useState<RippleState | null>(null);
  const rippleKey = useRef(0);
  const reduce = useRef(false);
  const onCancelRef = useRef(onCancel);

  useEffect(() => { onCancelRef.current = onCancel; }, [onCancel]);
  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const busy = status !== "idle";

  const fireRipple = (x: number, y: number) => {
    if (reduce.current) return;
    rippleKey.current++;
    setRipple({ key: rippleKey.current, x, y });
    setTimeout(() => setRipple(null), 520);
  };

  const handleDigit = useCallback((d: string, x = 50, y = 50) => {
    if (code.length >= LEN || busy) return;
    haptic("light");
    fireRipple(x, y);
    setCode(prev => [...prev, d]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code.length, busy]);

  const handleDelete = useCallback(() => {
    if (code.length === 0 || busy) return;
    haptic("light");
    setCode(prev => prev.slice(0, -1));
  }, [code.length, busy]);

  const shakeAndClear = useCallback(() => {
    haptic("error");
    setStatus("wrong");
    setTimeout(() => { setStatus("idle"); setCode([]); }, 700);
  }, []);

  // Keyboard input
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") handleDigit(e.key);
      else if (e.key === "Backspace") handleDelete();
      else if (e.key === "Escape") onCancelRef.current();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [handleDigit, handleDelete]);

  // Auto-submit at 6 digits
  useEffect(() => {
    if (code.length !== LEN || status !== "idle") return;
    setStatus("loading");
    fetch("/api/cv-unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code.join("") }),
    })
      .then(async res => {
        if (res.ok) {
          setStatus("success");
          if (!reduce.current) await new Promise(r => setTimeout(r, 700));
          onSuccess();
        } else {
          shakeAndClear();
        }
      })
      .catch(() => shakeAndClear());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, status]);

  const isWrong = status === "wrong";
  const isSuccess = status === "success";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center"
      style={{ background: "rgba(9,8,20,0.97)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
      initial={false}
      animate={{ opacity: 1 }}
      exit={isSuccess ? { opacity: 0, scale: 0.97 } : { opacity: 0 }}
      transition={reduce.current ? { duration: 0 } : isSuccess ? { duration: 0.35 } : { duration: 0.2 }}
    >
      {/* Aurora backdrop */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background:
          "radial-gradient(ellipse at 30% 25%, rgba(139,108,255,0.18) 0%, transparent 55%)," +
          "radial-gradient(ellipse at 70% 75%, rgba(47,123,255,0.15) 0%, transparent 55%)",
      }} />

      {/* Back button */}
      <button
        onClick={onCancel}
        disabled={busy}
        className="absolute top-5 left-5 z-10 flex items-center justify-center disabled:opacity-30"
        style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", cursor: "pointer" }}
      >
        <ArrowLeft size={18} />
      </button>

      {/* Centre panel */}
      <div className="relative z-10 flex flex-col items-center" style={{ marginTop: "auto", paddingBottom: 4 }}>
        {/* Lock icon box */}
        <div style={{
          width: 54, height: 54, borderRadius: 16, background: ACCENT,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 28px rgba(139,108,255,0.5)", marginBottom: 18,
        }}>
          <Lock size={22} color="#fff" />
        </div>

        <p style={{ fontSize: 17, fontWeight: 600, color: "#fff", margin: 0 }}>
          {isSuccess ? "Access Granted" : "Enter passcode"}
        </p>
        <p style={{
          fontSize: 12, marginTop: 5, marginBottom: 28,
          color: isWrong ? "#ff7a7a" : "rgba(255,255,255,0.45)",
        }}>
          {isWrong ? "Wrong passcode — try again" : isSuccess ? "Redirecting to your CV…" : "6-digit code to unlock my CV"}
        </p>

        {/* Dot indicators */}
        <motion.div
          style={{ display: "flex", gap: 16, marginBottom: 44 }}
          animate={isWrong && !reduce.current ? { x: [0, -9, 9, -7, 7, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {Array.from({ length: LEN }).map((_, i) => {
            const filled = i < code.length;
            return (
              <motion.span
                key={i}
                style={{
                  display: "inline-block",
                  width: 14, height: 14, borderRadius: "50%",
                  border: `1.5px solid ${isWrong ? "#ff5b5b" : "rgba(255,255,255,0.55)"}`,
                  background: filled
                    ? isWrong
                      ? "#ff5b5b"
                      : isSuccess
                        ? "transparent"
                        : "#fff"
                    : "transparent",
                  backgroundImage: filled && isSuccess ? ACCENT : "none",
                  boxShadow: filled && isSuccess ? "0 0 14px rgba(139,108,255,0.8)" : undefined,
                }}
                animate={filled && !reduce.current && !isWrong
                  ? { scale: [1, 1.5, 1] }
                  : isSuccess && !reduce.current
                    ? { scale: [1, 1.3, 1] }
                    : {}}
                transition={{ duration: 0.22, delay: isSuccess ? i * 0.055 : 0 }}
              />
            );
          })}
        </motion.div>

        {/* 3×3 number grid + 0 row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 74px)", gap: 16 }}>
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
            <KeyButton
              key={d}
              digit={d}
              ripple={ripple?.key ? ripple : null}
              disabled={busy}
              reduce={reduce.current}
              onPress={(x, y) => handleDigit(d, x, y)}
            />
          ))}

          {/* empty cell */}
          <div />

          <KeyButton
            digit="0"
            ripple={ripple?.key ? ripple : null}
            disabled={busy}
            reduce={reduce.current}
            onPress={(x, y) => handleDigit("0", x, y)}
          />

          {/* Delete */}
          <button
            onClick={handleDelete}
            disabled={busy || code.length === 0}
            aria-label="Delete"
            style={{
              background: "transparent", border: "none",
              color: code.length > 0 ? "#fff" : "rgba(255,255,255,0.3)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              width: 74, height: 74, borderRadius: "50%",
            }}
            className="kbtn-round disabled:opacity-30"
          >
            <Delete size={22} />
          </button>
        </div>
      </div>

      <div style={{ flex: 1 }} />
    </motion.div>
  );
}
