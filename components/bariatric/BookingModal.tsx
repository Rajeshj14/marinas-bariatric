"use client";

import { useEffect, useRef, useState } from "react";

const concerns = [
  "Weight Loss Surgery",
  "Obesity & High BMI",
  "Type 2 Diabetes Management",
  "Hypertension",
  "Sleep Apnea",
  "Joint Pain due to Weight",
  "Other",
];

export default function BookingModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", concern: "" });
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const show = () => setOpen(true);
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

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div className="modal-card" ref={dialogRef} role="dialog" aria-modal="true" aria-label="Book Consultation">
        <button className="modal-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
        <div className="modal-eyebrow">Book Your Consultation</div>
        <h2 className="modal-title">Rs.1500 · In-Clinic · Limited Slots</h2>
        <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
          <div className="modal-field">
            <label htmlFor="m-name">Full Name</label>
            <input id="m-name" type="text" placeholder="Your name" value={form.name} onChange={set("name")} required />
          </div>
          <div className="modal-field">
            <label htmlFor="m-phone">Phone Number</label>
            <input id="m-phone" type="tel" placeholder="+91 99999 99999" value={form.phone} onChange={set("phone")} required />
          </div>
          <div className="modal-field">
            <label htmlFor="m-concern">Primary Concern</label>
            <select id="m-concern" value={form.concern} onChange={set("concern")} required>
              <option value="" disabled>Select your concern</option>
              {concerns.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button type="submit" className="btn modal-submit">Confirm My Slot</button>
        </form>
      </div>
    </div>
  );
}
