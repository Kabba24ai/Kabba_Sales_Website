/**
 * U.S. phone numbers on kabba.ai forms (Kabba #282): one formatter and one check,
 * shared by every form, so "(615) 969-3789" looks and validates the same way
 * everywhere. Pure functions (no React, no DOM) so they can be tested directly.
 *
 * Kabba Central checks the number again on the server (NotificationSettings::usPhone)
 * and stores it as +1 and ten digits; this mask only helps people type it.
 */

export const US_PHONE_EXAMPLE = "(615) 555-0123";

export const US_PHONE_ERROR = "Enter a 10-digit U.S. phone number, e.g. (615) 555-0123, or leave it blank.";

const onlyDigits = (value: string): string => value.replace(/\D/g, "");

/**
 * The ten-digit national number inside what was typed: digits only, without the U.S.
 * country code when it is clearly one (an explicit "+1", or eleven digits starting with 1).
 */
export function usPhoneDigits(value: string): string {
  const digits = onlyDigits(value);
  if (digits.startsWith("1") && (value.trim().startsWith("+1") || digits.length === 11)) {
    return digits.slice(1);
  }
  return digits;
}

/**
 * Formats national digits as far as they go: "615" → "615", "615969" → "(615) 969",
 * "6159693789" → "(615) 969-3789". Digits past ten are kept, never silently dropped,
 * so a pasted number that is too long stays visible and the check refuses it.
 */
export function formatNationalDigits(digits: string): string {
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/** Any typed or pasted number in the standard display form, e.g. "+1 615.969.3789" → "(615) 969-3789". */
export function formatUsPhone(value: string): string {
  return formatNationalDigits(usPhoneDigits(value));
}

/**
 * A complete, dialable U.S. number: ten digits, and neither the area code nor the
 * exchange starts with 0 or 1. The same rule as the server.
 */
export function isValidUsPhone(value: string): boolean {
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(usPhoneDigits(value));
}

/** Position just after the `count`-th digit of `formatted` (0 when count is 0). */
export function caretAfterDigits(formatted: string, count: number): number {
  if (count <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (formatted[i] >= "0" && formatted[i] <= "9") {
      seen++;
      if (seen === count) return i + 1;
    }
  }
  return formatted.length;
}

/** Position just before the digit that follows the first `count` digits (the end if there is none). */
export function caretBeforeNextDigit(formatted: string, count: number): number {
  let seen = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (formatted[i] >= "0" && formatted[i] <= "9") {
      if (seen === count) return i;
      seen++;
    }
  }
  return formatted.length;
}

export interface PhoneEdit {
  value: string;
  caret: number;
}

/**
 * The next value of a formatted phone input after one edit, and where the caret goes.
 *
 * @param previous  what the input showed before (always formatted national digits)
 * @param raw       what the browser holds after the edit (typing, paste, autofill, delete)
 * @param caret     the browser's caret position in `raw`
 * @param inputType InputEvent.inputType, e.g. "insertText", "insertFromPaste", "deleteContentBackward"
 *
 * The caret stays after the same digit it followed, whatever punctuation is added or removed,
 * so editing in the middle never jumps to the end. Deleting a "(", ")", " " or "-" deletes
 * the digit beside it, as people expect. A leading 1 / +1 is read as the country code only
 * when the field was empty, the text says "+1", or the result has eleven digits, so deleting
 * the first digit of 615 never swallows the 1 that follows. A digit typed after ten is
 * ignored; a longer paste is kept for the check to refuse.
 */
export function nextUsPhoneEdit(previous: string, raw: string, caret: number, inputType = ""): PhoneEdit {
  let digits = onlyDigits(raw);
  let before = onlyDigits(raw.slice(0, Math.max(0, caret))).length;
  const previousDigits = onlyDigits(previous);
  // A caret that sat just after "(", ")", " " or "-" goes before the next digit; one after a digit stays after it.
  const afterPunctuation = caret > 0 && !/\d/.test(raw[caret - 1] ?? "");

  if (digits === previousDigits && raw.length < previous.length) {
    // Only punctuation went: take the digit beside it instead.
    if (inputType === "deleteContentBackward" && before > 0) {
      digits = digits.slice(0, before - 1) + digits.slice(before);
      before -= 1;
    } else if (inputType === "deleteContentForward" && before < digits.length) {
      digits = digits.slice(0, before) + digits.slice(before + 1);
    }
  }

  const replacedEverything = digits.length > 0 && raw.trim().length === digits.length && digits.length <= 1 && inputType.startsWith("insert");
  const countryCode =
    digits.startsWith("1") &&
    (raw.trim().startsWith("+1") || previousDigits === "" || replacedEverything || digits.length === 11);
  if (countryCode) {
    digits = digits.slice(1);
    before = Math.max(0, before - 1);
  }

  if (digits.length > 10 && inputType === "insertText" && previousDigits.length >= 10) {
    // Typing past a complete number does nothing; the caret stays where it was.
    const kept = Math.max(0, before - 1);
    return { value: previous, caret: caretAfterDigits(previous, kept) };
  }

  const value = formatNationalDigits(digits);
  return { value, caret: afterPunctuation ? caretBeforeNextDigit(value, before) : caretAfterDigits(value, before) };
}
