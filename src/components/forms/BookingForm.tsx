"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useRef, useState, type FormEvent } from "react";
import clsx from "clsx";
import { TextField, TextArea, SelectField, isEmail, isPhone, formatPhone } from "./Field";
import { Mark } from "@/components/brand/Logo";

const reasons = [
  { id: "new-patient", label: "New-patient visit", note: "Exam, 3D scan, x-rays & cleaning", minutes: 90 },
  { id: "cleanings-exams", label: "Cleaning & checkup", note: "For returning patients", minutes: 60 },
  { id: "emergency-dentistry", label: "Emergency / pain", note: "Same-day when possible", minutes: 45 },
  { id: "cosmetic-dentistry", label: "Cosmetic consult", note: "Whitening, veneers, bonding", minutes: 45 },
  { id: "clear-aligners", label: "Aligner consult", note: "3D scan & smile preview", minutes: 45 },
  { id: "dental-implants", label: "Implant consult", note: "3D scan & all-in quote", minutes: 60 },
  { id: "kids-dentistry", label: "Kids' visit", note: "With Dr. Delgado", minutes: 45 },
  { id: "sedation-dentistry", label: "Meet & greet", note: "No chair, just coffee & questions", minutes: 30 },
];

const doctorsList = [
  { id: "any", label: "First available" },
  { id: "elena-marsh", label: "Dr. Elena Marsh" },
  { id: "julian-ashford", label: "Dr. Julian Ashford" },
  { id: "sofia-delgado", label: "Dr. Sofia Delgado (español)" },
];

const comfortsList = ["Weighted blanket", "Noise-cancelling headphones", "Show on the ceiling", "Nitrous oxide (ask me)", "Extra time to talk first"];

const slotsFor = (day: number) =>
  day === 6 ? ["8:00 am", "9:30 am", "11:00 am", "12:30 pm"] : day === 5 ? ["7:30 am", "9:00 am", "10:30 am", "1:00 pm"] : ["7:30 am", "9:00 am", "11:30 am", "2:00 pm", "4:30 pm", "6:00 pm"];

type Data = {
  reason: string;
  date: string;
  time: string;
  doctor: string;
  comforts: string[];
  first: string;
  last: string;
  phone: string;
  email: string;
  insurance: string;
  notes: string;
  consent: boolean;
};

const steps = ["Reason", "Day & time", "About you", "Review"];

/** Treatment pages link here with ?treatment=<slug>; map each to the closest visit type. */
const presetFor: Record<string, string> = {
  "general-family-dentistry": "new-patient",
  "teeth-whitening": "cosmetic-dentistry",
  "porcelain-veneers": "cosmetic-dentistry",
};

/** Four-step booking flow. Validates properly; sends nothing (concept site). */
export function BookingForm() {
  const params = useSearchParams();
  const preset = params.get("treatment");
  const presetDoctor = params.get("doctor");
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [data, setData] = useState<Data>({
    reason: reasons.find((r) => r.id === (presetFor[preset ?? ""] ?? preset))?.id ?? (params.get("membership") ? "new-patient" : ""),
    date: "",
    time: "",
    doctor: doctorsList.find((d) => d.id === presetDoctor)?.id ?? "any",
    comforts: [],
    first: "",
    last: "",
    phone: "",
    email: "",
    insurance: params.get("membership") ? "membership" : "ppo",
    notes: "",
    consent: false,
  });
  const panel = useRef<HTMLDivElement>(null);

  const days = useMemo(() => {
    const out: { iso: string; day: number; label: string; sub: string }[] = [];
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    while (out.length < 10) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() === 0) continue;
      out.push({
        iso: d.toISOString().slice(0, 10),
        day: d.getDay(),
        label: d.toLocaleDateString("en-US", { weekday: "short" }),
        sub: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      });
    }
    return out;
  }, []);

  const set = <K extends keyof Data>(k: K, v: Data[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    setErrors((e) => {
      const n = { ...e };
      delete n[k as string];
      return n;
    });
  };

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 0 && !data.reason) e.reason = "Choose what you'd like to come in for.";
    if (s === 1) {
      if (!data.date) e.date = "Pick a day that works for you.";
      if (!data.time) e.time = "Pick a time.";
    }
    if (s === 2) {
      if (!data.first.trim()) e.first = "Please enter your first name.";
      if (!data.last.trim()) e.last = "Please enter your last name.";
      if (!isPhone(data.phone)) e.phone = "Enter a 10-digit US phone number.";
      if (!isEmail(data.email)) e.email = "Enter a valid email, like you@example.com.";
    }
    if (s === 3 && !data.consent) e.consent = "Please confirm so we can contact you about this appointment.";
    setErrors(e);
    if (Object.keys(e).length) {
      window.requestAnimationFrame(() => {
        const first = panel.current?.querySelector<HTMLElement>("[aria-invalid='true'], [data-error='true'] input, [data-error='true'] button");
        first?.focus();
      });
      return false;
    }
    return true;
  };

  const go = (n: number) => {
    setStep(n);
    window.requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>("h2")?.focus());
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      if (validate(step)) go(step + 1);
      return;
    }
    if (validate(3)) {
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const reason = reasons.find((r) => r.id === data.reason);
  const dayObj = days.find((d) => d.iso === data.date);

  if (done) {
    return (
      <div className="rounded-[2rem] bg-shell p-8 text-center ring-1 ring-line sm:p-14" role="status" aria-live="polite">
        <div className="mx-auto grid size-28 place-items-center rounded-t-full rounded-b-2xl bg-mist-soft" style={{ animation: "fade-in 1.2s var(--ease-soft) both" }}>
          <Mark className="h-16 w-auto text-sage" />
        </div>
        <h2 className="display h-md mt-8">You&apos;re booked, {data.first}.</h2>
        <p className="lede mx-auto mt-4 max-w-lg">
          {reason?.label} on {dayObj?.label} {dayObj?.sub} at {data.time}. We&apos;ll text {data.phone} to confirm within the hour, with a link to your forms.
        </p>
        <ul className="mx-auto mt-10 grid max-w-2xl gap-4 text-left sm:grid-cols-3">
          {[
            ["1", "Forms by text", "About eight minutes on your phone."],
            ["2", "Insurance checked", "We verify benefits before you arrive."],
            ["3", "Park & come up", "Linden Row garage, 2nd floor. We validate."],
          ].map(([n, t, b]) => (
            <li key={n} className="rounded-2xl bg-porcelain p-5 ring-1 ring-line">
              <span className="display text-[1.8rem] text-sage">0{n}</span>
              <p className="mt-2 font-semibold">{t}</p>
              <p className="text-[0.92rem] text-ink-soft">{b}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10 rounded-2xl bg-sand-soft px-5 py-3 text-[0.9rem]">
          This is a concept site by DBS Media, so nothing was actually sent. In a live build, this would reach the practice instantly.
        </p>
        <Link href="/" className="mt-8 inline-flex min-h-12 items-center rounded-full bg-sage px-6 font-semibold text-porcelain">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={submit} className="rounded-[2rem] bg-shell ring-1 ring-line">
      {/* Progress */}
      <ol className="flex border-b border-line px-4 sm:px-8" aria-label="Booking steps">
        {steps.map((s, i) => (
          <li key={s} className="flex-1" aria-current={i === step ? "step" : undefined}>
            <button
              type="button"
              disabled={i > step}
              onClick={() => i < step && go(i)}
              className={clsx("flex w-full items-center gap-2 py-5 text-left text-[0.85rem] font-semibold", i === step ? "text-ink" : i < step ? "text-sage" : "text-ink-soft/70")}
            >
              <span
                aria-hidden
                className={clsx("inline-block h-4 w-3 shrink-0 rounded-t-full transition-colors duration-500", i <= step ? "bg-sage" : "bg-ink/15")}
              />
              <span className={clsx(i !== step && "hidden sm:inline")}>{s}</span>
              <span className="sr-only">{i < step ? "(done)" : i === step ? "(current)" : ""}</span>
            </button>
          </li>
        ))}
      </ol>

      <div ref={panel} key={step} className="p-6 sm:p-10" style={{ animation: "fade-in 0.8s var(--ease-soft) both" }}>
        {step === 0 && (
          <fieldset data-error={!!errors.reason}>
            <legend>
              <h2 tabIndex={-1} className="display h-sm outline-none">
                What brings you in?
              </h2>
            </legend>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {reasons.map((r) => (
                <label
                  key={r.id}
                  className={clsx(
                    "flex cursor-pointer items-start gap-4 rounded-2xl bg-porcelain p-5 ring-1 transition-shadow has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sage",
                    data.reason === r.id ? "ring-2 ring-sage" : "ring-line hover:ring-ink/30",
                  )}
                >
                  <input type="radio" name="reason" value={r.id} checked={data.reason === r.id} onChange={() => set("reason", r.id)} className="sr-only" />
                  <span aria-hidden className={clsx("mt-1 inline-block h-5 w-4 shrink-0 rounded-t-full border-2", data.reason === r.id ? "border-sage bg-sage" : "border-ink/25")} />
                  <span>
                    <span className="block font-semibold">{r.label}</span>
                    <span className="text-[0.9rem] text-ink-soft">
                      {r.note} · {r.minutes} min
                    </span>
                  </span>
                </label>
              ))}
            </div>
            {errors.reason && <p className="mt-4 font-medium text-[#9c3f2a]">{errors.reason}</p>}
          </fieldset>
        )}

        {step === 1 && (
          <div>
            <h2 tabIndex={-1} className="display h-sm outline-none">
              When suits you?
            </h2>
            <fieldset className="mt-8" data-error={!!errors.date}>
              <legend className="text-[0.92rem] font-semibold">Day</legend>
              <div className="no-scrollbar -mx-2 mt-3 flex gap-2 overflow-x-auto px-2 pb-2">
                {days.map((d) => (
                  <label
                    key={d.iso}
                    className={clsx(
                      "flex min-w-20 shrink-0 cursor-pointer flex-col items-center rounded-t-full rounded-b-2xl px-3 pt-5 pb-3 ring-1 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sage",
                      data.date === d.iso ? "bg-sage text-porcelain ring-sage" : "bg-porcelain ring-line hover:ring-ink/30",
                    )}
                  >
                    <input
                      type="radio"
                      name="date"
                      value={d.iso}
                      checked={data.date === d.iso}
                      onChange={() => {
                        set("date", d.iso);
                        set("time", "");
                      }}
                      className="sr-only"
                    />
                    <span className="text-[0.8rem] font-semibold uppercase">{d.label}</span>
                    <span className="display text-[1.3rem]">{d.sub.split(" ")[1]}</span>
                    <span className="text-[0.75rem] opacity-80">{d.sub.split(" ")[0]}</span>
                  </label>
                ))}
              </div>
              {errors.date && <p className="mt-2 font-medium text-[#9c3f2a]">{errors.date}</p>}
            </fieldset>

            <fieldset className="mt-8" data-error={!!errors.time}>
              <legend className="text-[0.92rem] font-semibold">Time {dayObj && <span className="font-normal text-ink-soft">on {dayObj.label} {dayObj.sub}</span>}</legend>
              {dayObj ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {slotsFor(dayObj.day).map((t) => (
                    <label
                      key={t}
                      className={clsx(
                        "inline-flex min-h-11 cursor-pointer items-center rounded-full px-5 ring-1 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sage",
                        data.time === t ? "bg-sage text-porcelain ring-sage" : "bg-porcelain ring-line hover:ring-ink/30",
                      )}
                    >
                      <input type="radio" name="time" value={t} checked={data.time === t} onChange={() => set("time", t)} className="sr-only" />
                      {t}
                    </label>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-ink-soft">Choose a day to see open times.</p>
              )}
              {errors.time && <p className="mt-2 font-medium text-[#9c3f2a]">{errors.time}</p>}
            </fieldset>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <SelectField
                label="Doctor"
                name="doctor"
                value={data.doctor}
                onChange={(e) => set("doctor", e.target.value)}
                options={doctorsList.map((d) => ({ value: d.id, label: d.label }))}
              />
              <fieldset>
                <legend className="text-[0.92rem] font-semibold">
                  Comforts <span className="font-normal text-ink-soft">(optional)</span>
                </legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {comfortsList.map((c) => {
                    const on = data.comforts.includes(c);
                    return (
                      <label
                        key={c}
                        className={clsx(
                          "inline-flex min-h-10 cursor-pointer items-center rounded-full px-4 text-[0.9rem] ring-1 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sage",
                          on ? "bg-mist-soft ring-sage" : "bg-porcelain ring-line",
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => set("comforts", on ? data.comforts.filter((x) => x !== c) : [...data.comforts, c])}
                          className="sr-only"
                        />
                        {on ? "✓ " : "+ "}
                        {c}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 tabIndex={-1} className="display h-sm outline-none">
              A little about you
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <TextField label="First name" name="first" autoComplete="given-name" value={data.first} onChange={(e) => set("first", e.target.value)} error={errors.first} />
              <TextField label="Last name" name="last" autoComplete="family-name" value={data.last} onChange={(e) => set("last", e.target.value)} error={errors.last} />
              <TextField
                label="Mobile phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="(214) 555-0123"
                value={data.phone}
                onChange={(e) => set("phone", formatPhone(e.target.value))}
                error={errors.phone}
                hint="We'll text to confirm. No marketing."
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={data.email}
                onChange={(e) => set("email", e.target.value)}
                error={errors.email}
              />
              <SelectField
                label="Insurance"
                name="insurance"
                value={data.insurance}
                onChange={(e) => set("insurance", e.target.value)}
                options={[
                  { value: "ppo", label: "I have dental insurance (PPO)" },
                  { value: "other", label: "I have another plan / not sure" },
                  { value: "membership", label: "No insurance: interested in membership" },
                  { value: "self", label: "No insurance: I'll pay per visit" },
                ]}
              />
              <TextArea
                label="Anything we should know?"
                name="notes"
                optional
                value={data.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Nervous about needles, a tooth that's bothering you, prefer Spanish…"
                className="md:col-span-2"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 tabIndex={-1} className="display h-sm outline-none">
              Look right?
            </h2>
            <dl className="mt-8 divide-y divide-line rounded-2xl bg-porcelain ring-1 ring-line">
              {[
                ["Visit", `${reason?.label} (${reason?.minutes} min)`, 0],
                ["When", `${dayObj?.label} ${dayObj?.sub}, ${data.time}`, 1],
                ["Doctor", doctorsList.find((d) => d.id === data.doctor)?.label ?? "", 1],
                ["Comforts", data.comforts.length ? data.comforts.join(", ") : "None selected", 1],
                ["You", `${data.first} ${data.last} · ${data.phone} · ${data.email}`, 2],
              ].map(([k, v, s]) => (
                <div key={k as string} className="flex items-start justify-between gap-4 px-5 py-4">
                  <div>
                    <dt className="text-[0.85rem] text-ink-soft">{k}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                  <button type="button" onClick={() => go(s as number)} className="shrink-0 text-[0.9rem] font-semibold text-sage-deep underline underline-offset-4">
                    Edit<span className="sr-only"> {k}</span>
                  </button>
                </div>
              ))}
            </dl>
            <div data-error={!!errors.consent} className="mt-6">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={data.consent}
                  onChange={(e) => set("consent", e.target.checked)}
                  aria-invalid={!!errors.consent}
                  aria-describedby={errors.consent ? "consent-error" : undefined}
                  className="mt-1 size-5 shrink-0 accent-[var(--color-sage)]"
                />
                <span className="text-[0.95rem] text-ink-soft">
                  It&apos;s OK to text and email me about this appointment. I&apos;ve read the{" "}
                  <Link href="/privacy" className="font-semibold text-ink underline underline-offset-4">
                    privacy notice
                  </Link>
                  .
                </span>
              </label>
              {errors.consent && (
                <p id="consent-error" className="mt-2 font-medium text-[#9c3f2a]">
                  {errors.consent}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-6">
          {step > 0 ? (
            <button type="button" onClick={() => go(step - 1)} className="min-h-12 rounded-full px-5 font-semibold ring-1 ring-line hover:ring-ink/40">
              Back
            </button>
          ) : (
            <span className="text-[0.9rem] text-ink-soft">Step 1 of 4 · about a minute</span>
          )}
          <button type="submit" className="min-h-12 rounded-full bg-sage px-7 font-semibold text-porcelain transition-colors hover:bg-sage-deep">
            {step < 3 ? "Continue" : "Request appointment"}
          </button>
        </div>
      </div>
    </form>
  );
}
