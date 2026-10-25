"use client";

import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="px-4 py-24">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
          Get In <span className="text-blue-400">Touch</span>
        </h2>
        <form onSubmit={handleSubmit} className="glass space-y-6 rounded-xl p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white placeholder-gray-500"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white placeholder-gray-500"
              required
            />
          </div>
          <input
            type="text"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white placeholder-gray-500"
            required
          />
          <textarea
            placeholder="Your Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={5}
            className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white placeholder-gray-500"
            required
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white transition hover:shadow-lg disabled:opacity-50"
          >
            {status === "loading" ? "Sending..." : "Send Message"}
          </button>
          {status === "success" && (
            <p className="text-center text-green-400">Message sent successfully!</p>
          )}
          {status === "error" && (
            <p className="text-center text-red-400">Something went wrong. Please try again.</p>
          )}
        </form>
      </div>
    </section>
  );
}
