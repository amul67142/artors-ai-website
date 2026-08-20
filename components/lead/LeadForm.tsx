"use client";

import { useState } from "react";
import { pillars } from "@/lib/content/services";
import s from "./lead.module.css";

type Status = "idle" | "sending" | "done" | "error";

/**
 * The lead form, used both inside the consultation popup and embedded
 * on service and contact pages. Posts to /api/lead, which sits behind
 * the lib/leads adapter (email + WhatsApp delivery per docs/PLAN.md).
 */
export default function LeadForm({ presetService }: { presetService?: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className={s.done} role="status">
        <p className={s.doneTitle}>Got it.</p>
        <p className={s.doneText}>
          We reply within a day with a clear next step. If it's urgent, say so
          in a follow-up and we move faster.
        </p>
      </div>
    );
  }

  return (
    <form className={s.form} onSubmit={onSubmit}>
      <div className={s.row2}>
        <label className={s.field}>
          <span className={s.label}>Name</span>
          <input className={s.input} name="name" required autoComplete="name" />
        </label>
        <label className={s.field}>
          <span className={s.label}>Company</span>
          <input className={s.input} name="company" autoComplete="organization" />
        </label>
      </div>

      <div className={s.row2}>
        <label className={s.field}>
          <span className={s.label}>Phone / WhatsApp</span>
          <input className={s.input} name="phone" required inputMode="tel" autoComplete="tel" />
        </label>
        <label className={s.field}>
          <span className={s.label}>Email</span>
          <input className={s.input} name="email" type="email" autoComplete="email" />
        </label>
      </div>

      <label className={s.field}>
        <span className={s.label}>What do you need?</span>
        <select className={s.input} name="service" defaultValue={presetService ?? ""}>
          <option value="">Not sure yet — help me scope it</option>
          {pillars.map((p) => (
            <option key={p.title} value={p.title}>
              {p.title}
            </option>
          ))}
        </select>
      </label>

      <label className={s.field}>
        <span className={s.label}>Anything we should know?</span>
        <textarea className={`${s.input} ${s.textarea}`} name="message" rows={3} />
      </label>

      {/* Honeypot — humans never see it. */}
      <input className={s.hp} name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <button type="submit" className={`btn ${s.submit}`} disabled={status === "sending"}>
        <span className="btn__mask">
          <span className="btn__track">
            <span className="btn__label">
              {status === "sending" ? "Sending…" : "Book My Strategy Call"}
            </span>
            <span className="btn__label btn__label--ghost" aria-hidden="true">
              {status === "sending" ? "Sending…" : "Book My Strategy Call"}
            </span>
          </span>
        </span>
      </button>

      {status === "error" && (
        <p className={s.error} role="alert">
          That didn't send. Try again, or reach us on WhatsApp.
        </p>
      )}
      <p className={s.note}>We reply within a day. No spam, no retainer pitch.</p>
    </form>
  );
}
