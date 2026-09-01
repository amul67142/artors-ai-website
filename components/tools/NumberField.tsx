"use client";

import c from "./calculator.module.css";

/**
 * One labelled numeric input. No form library — the brief rules those out and
 * two calculators do not justify one.
 *
 * inputMode="numeric" brings up the number pad on a phone while keeping the
 * field a text input, which avoids the scroll-wheel-changes-the-value problem
 * that type="number" has on desktop.
 */
export default function NumberField({
  id,
  label,
  hint,
  value,
  onChange,
  prefix,
  suffix,
  max,
  invalid,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (next: string) => void;
  prefix?: string;
  suffix?: string;
  max?: number;
  invalid?: boolean;
}) {
  return (
    <div className={c.field}>
      <label htmlFor={id} className={c.label}>
        {label}
      </label>
      {hint && (
        <span id={`${id}-hint`} className={c.hint}>
          {hint}
        </span>
      )}
      <div className={c.inputRow}>
        {prefix && (
          <span className={c.prefix} aria-hidden="true">
            {prefix}
          </span>
        )}
        <input
          id={id}
          className={c.input}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={value}
          aria-describedby={hint ? `${id}-hint` : undefined}
          aria-invalid={invalid || undefined}
          onChange={(e) => {
            // Digits and one decimal point only, so a stray letter cannot
            // silently turn the whole result into NaN.
            const cleaned = e.target.value.replace(/[^\d.]/g, "");
            if (max !== undefined && Number(cleaned) > max) return;
            onChange(cleaned);
          }}
        />
        {suffix && (
          <span className={c.suffix} aria-hidden="true">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
