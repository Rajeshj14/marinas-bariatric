"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const concerns = [
  "Weight Loss Surgery",
  "Obesity & High BMI",
  "Type 2 Diabetes Management",
  "Hypertension",
  "Sleep Apnea",
  "Joint Pain due to Weight",
  "Other",
];

type Status = "idle" | "loading" | "success" | "error";

export default function BookingModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", concern: "" });
  const [status, setStatus] = useState<Status>("idle");
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const show = () => { setOpen(true); setStatus("idle"); };
    window.addEventListener("open-booking-modal", show);
    return () => window.removeEventListener("open-booking-modal", show);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "Bariatric-Form",
          name: form.name,
          phone: form.phone,
          concern: form.concern,
          pageUrl: window.location.href,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      router.push("/thank-you");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div className="modal-card" ref={dialogRef} role="dialog" aria-modal="true" aria-label="Book Consultation">
        <button className="modal-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>

        {status === "success" ? (
          <div className="modal-success">
            <div className="modal-success-icon">✓</div>
            <h2 className="modal-title">Slot Confirmed!</h2>
            <p className="modal-success-msg">We&apos;ve received your request. Our team will call you shortly to confirm your appointment.</p>
            <button className="btn modal-submit" onClick={() => setOpen(false)}>Done</button>
          </div>
        ) : (
          <>
            <div className="modal-eyebrow">Book Your Consultation</div>
            <h2 className="modal-title">Rs.1500 · In-Clinic · Limited Slots</h2>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="modal-field">
                <label htmlFor="m-name">Full Name</label>
                <input id="m-name" type="text" placeholder="Your name" value={form.name} onChange={set("name")} required disabled={status === "loading"} />
              </div>
              <div className="modal-field">
                <label htmlFor="m-phone">Phone Number</label>
                <input id="m-phone" type="tel" placeholder="+91 99999 99999" value={form.phone} onChange={set("phone")} required disabled={status === "loading"} />
              </div>
              <div className="modal-field">
                <label htmlFor="m-concern">Primary Concern</label>
                <select id="m-concern" value={form.concern} onChange={set("concern")} required disabled={status === "loading"}>
                  <option value="" disabled>Select your concern</option>
                  {concerns.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {status === "error" && <p className="modal-error">Something went wrong. Please try again.</p>}
              <button type="submit" className="btn modal-submit" disabled={status === "loading"}>
                {status === "loading" ? "Booking…" : "Confirm My Slot"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
