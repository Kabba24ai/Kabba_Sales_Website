import { ChangeEvent, InputHTMLAttributes, useLayoutEffect, useRef } from "react";
import { formatUsPhone, nextUsPhoneEdit } from "../lib/phone";

/**
 * A phone field that shows U.S. numbers as (615) 969-3789 while people type,
 * paste or let the browser autofill (Kabba #282). The caret stays beside the
 * digit it was next to, so editing the middle of a number works, and the phone
 * keypad opens on mobile. The value handed to `onValueChange` is the formatted
 * text; the server validates and stores it on its own.
 */
type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type" | "defaultValue"> & {
  value: string;
  onValueChange: (value: string) => void;
};

export default function UsPhoneInput({ value, onValueChange, onBlur, ...rest }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const caret = useRef<number | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (caret.current !== null && el && document.activeElement === el) {
      el.setSelectionRange(caret.current, caret.current);
    }
    caret.current = null;
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const el = e.target;
    const inputType = (e.nativeEvent as InputEvent).inputType ?? "";
    const next = nextUsPhoneEdit(value, el.value, el.selectionStart ?? el.value.length, inputType);
    caret.current = next.caret;
    if (next.value === value) {
      // React keeps the old value but the browser already moved the caret: put it back.
      el.value = value;
      el.setSelectionRange(next.caret, next.caret);
      caret.current = null;
      return;
    }
    onValueChange(next.value);
  };

  return (
    <input
      {...rest}
      ref={ref}
      type="tel"
      inputMode="tel"
      autoComplete={rest.autoComplete ?? "tel"}
      value={value}
      onChange={handleChange}
      onBlur={(e) => {
        const tidy = formatUsPhone(value);
        if (tidy !== value) onValueChange(tidy);
        onBlur?.(e);
      }}
    />
  );
}
