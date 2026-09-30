"use client";

import { useState, type FormEvent } from "react";
import { TextField, TextArea, SelectField, isEmail, isPhone, formatPhone } from "./Field";

/** Validated contact form with a polished success state. Sends nothing (concept site). */
export function ContactForm() {
  const [v, setV] = useState({ name: "", phone: "", email: "", topic: "question", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof v, val: string) => {
    setV((s) => ({ ...s, [k]: val }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!v.name.trim()) err.name = "Please tell us your name.";
    if (!v.email.trim() && !v.phone.trim()) err.email = "Add an email or phone so we can reply.";
    if (v.email.trim() && !isEmail(v.email)) err.email = "That email doesn't look quite right.";
    if (v.phone.trim() && !isPhone(v.phone)) err.phone = "Enter a 10-digit US phone number.";
    if (v.message.trim().length < 10) err.message = "A few more words, please (at least 10 characters).";
    setErrors(err);
    const first = Object.keys(err).find((k) => err[k]);
    if (first) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div role="status" className="rounded-[2rem] bg-shell p-10 text-center ring-1 ring-line" style={{ animation: "fade-in 1s var(--ease-soft) both" }}>
        <span aria-hidden className="mx-auto block h-16 w-12 rounded-t-full bg-sage" />
        <h2 className="display h-sm mt-6">Thank you, {v.name.split(" ")[0]}.</h2>
        <p className="lede mx-auto mt-3 max-w-md">We reply within one business hour, usually much sooner.</p>
        <p className="mt-6 text-[0.85rem] text-ink-soft">Concept site by Scale by Noon: this form doesn&apos;t send anything.</p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={submit} className="grid gap-6 rounded-[2rem] bg-shell p-6 ring-1 ring-line sm:grid-cols-2 sm:p-10">
      <h2 className="display h-sm sm:col-span-2">Send us a note</h2>
      <TextField label="Your name" name="name" autoComplete="name" value={v.name} onChange={(e) => set("name", e.target.value)} error={errors.name} className="sm:col-span-2" />
      <TextField label="Email" name="email" type="email" autoComplete="email" value={v.email} onChange={(e) => set("email", e.target.value)} error={errors.email} />
      <TextField
        label="Phone"
        name="phone"
        type="tel"
        autoComplete="tel-national"
        optional
        value={v.phone}
        onChange={(e) => set("phone", formatPhone(e.target.value))}
        error={errors.phone}
      />
      <SelectField
        label="Topic"
        name="topic"
        value={v.topic}
        onChange={(e) => set("topic", e.target.value)}
        className="sm:col-span-2"
        options={[
          { value: "question", label: "A general question" },
          { value: "insurance", label: "Insurance or billing" },
          { value: "records", label: "Records transfer" },
          { value: "feedback", label: "Feedback" },
        ]}
      />
      <TextArea
        label="Message"
        name="message"
        value={v.message}
        onChange={(e) => set("message", e.target.value)}
        error={errors.message}
        hint="Please don't include sensitive health details here."
        className="sm:col-span-2"
      />
      <div className="sm:col-span-2">
        <button type="submit" className="min-h-12 rounded-full bg-sage px-7 font-semibold text-porcelain transition-colors hover:bg-sage-deep">
          Send message
        </button>
      </div>
    </form>
  );
}
