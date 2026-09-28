import clsx from "clsx";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const control =
  "mt-2 block w-full rounded-2xl bg-porcelain px-5 py-3.5 text-[1rem] ring-1 ring-line transition-shadow outline-none placeholder:text-ink-soft/70 focus:ring-2 focus:ring-sage aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[#b4533c]";

type Base = { label: string; name: string; error?: string; hint?: ReactNode; className?: string };

function Wrap({ label, name, error, hint, className, children, optional }: Base & { children: ReactNode; optional?: boolean }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="text-[0.92rem] font-semibold">
        {label} {optional && <span className="font-normal text-ink-soft">(optional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${name}-hint`} className="mt-1.5 text-[0.85rem] text-ink-soft">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-[0.88rem] font-medium text-[#9c3f2a]">
          {error}
        </p>
      )}
    </div>
  );
}

const describedBy = (name: string, error?: string, hint?: ReactNode) => (error ? `${name}-error` : hint ? `${name}-hint` : undefined);

export function TextField({ label, name, error, hint, className, optional, ...rest }: Base & { optional?: boolean } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Wrap label={label} name={name} error={error} hint={hint} className={className} optional={optional}>
      <input id={name} name={name} aria-invalid={!!error} aria-describedby={describedBy(name, error, hint)} className={control} {...rest} />
    </Wrap>
  );
}

export function TextArea({ label, name, error, hint, className, optional, ...rest }: Base & { optional?: boolean } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Wrap label={label} name={name} error={error} hint={hint} className={className} optional={optional}>
      <textarea id={name} name={name} aria-invalid={!!error} aria-describedby={describedBy(name, error, hint)} className={clsx(control, "min-h-32 resize-y")} {...rest} />
    </Wrap>
  );
}

export function SelectField({
  label,
  name,
  error,
  hint,
  className,
  options,
  ...rest
}: Base & { options: { value: string; label: string }[] } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Wrap label={label} name={name} error={error} hint={hint} className={className}>
      <select id={name} name={name} aria-invalid={!!error} aria-describedby={describedBy(name, error, hint)} className={clsx(control, "appearance-none")} {...rest}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Wrap>
  );
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const isPhone = (v: string) => v.replace(/\D/g, "").replace(/^1/, "").length === 10;
export const formatPhone = (v: string) => {
  const d = v.replace(/\D/g, "").replace(/^1/, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};
