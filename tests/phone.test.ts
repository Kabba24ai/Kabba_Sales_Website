// U.S. phone formatting on kabba.ai forms (Kabba #282).
// Run: npm test   (Node 22.6+ runs these TypeScript tests directly; no extra packages)
import { test } from "node:test";
import assert from "node:assert/strict";
import { caretAfterDigits, caretBeforeNextDigit, formatUsPhone, isValidUsPhone, nextUsPhoneEdit, usPhoneDigits } from "../src/lib/phone.ts";

/** Types `chars` one at a time at the end, as a keyboard would, and returns the field value. */
function typeChars(chars: string, start = ""): string {
  let value = start;
  for (const ch of chars) {
    const raw = value + ch;
    value = nextUsPhoneEdit(value, raw, raw.length, "insertText").value;
  }
  return value;
}

/** Backspace with the caret at `caret` in `value` (what the browser does, then the mask). */
function backspace(value: string, caret: number) {
  const raw = value.slice(0, caret - 1) + value.slice(caret);
  return nextUsPhoneEdit(value, raw, caret - 1, "deleteContentBackward");
}

/** Forward Delete with the caret at `caret`. */
function forwardDelete(value: string, caret: number) {
  const raw = value.slice(0, caret) + value.slice(caret + 1);
  return nextUsPhoneEdit(value, raw, caret, "deleteContentForward");
}

/** Pastes `text` over the selection [from, to) of `value`. */
function paste(value: string, text: string, from = 0, to = value.length) {
  const raw = value.slice(0, from) + text + value.slice(to);
  return nextUsPhoneEdit(value, raw, from + text.length, "insertFromPaste");
}

test("ten typed digits read (615) 969-3789, formatting as they arrive", () => {
  const steps: string[] = [];
  let value = "";
  for (const ch of "6159693789") {
    value = typeChars(ch, value);
    steps.push(value);
  }
  assert.deepEqual(steps, ["6", "61", "615", "(615) 9", "(615) 96", "(615) 969", "(615) 969-3", "(615) 969-37", "(615) 969-378", "(615) 969-3789"]);
});

test("pasted numbers in any common form become the standard form", () => {
  for (const text of ["6159693789", "615-969-3789", "615.969.3789", "(615) 969-3789", "615 969 3789", "+1 (615) 969-3789", "+16159693789", "1-615-969-3789", "16159693789"]) {
    assert.equal(paste("", text).value, "(615) 969-3789", text);
    assert.equal(formatUsPhone(text), "(615) 969-3789", text);
  }
  // Pasting over a whole existing number replaces it.
  assert.equal(paste("(212) 555-0101", "+1 615 969 3789").value, "(615) 969-3789");
});

test("a leading 1 or +1 is the country code when typed first", () => {
  assert.equal(typeChars("16159693789"), "(615) 969-3789");
  assert.equal(typeChars("+16159693789"), "(615) 969-3789");
  // Browser autofill hands over the whole number at once.
  assert.equal(nextUsPhoneEdit("", "+1 615-969-3789", 15, "insertReplacementText").value, "(615) 969-3789");
});

test("typing past ten digits does nothing; a longer paste stays visible so the check refuses it", () => {
  const full = "(615) 969-3789";
  const typed = nextUsPhoneEdit(full, full + "5", full.length + 1, "insertText");
  assert.equal(typed.value, full);
  assert.equal(typed.caret, full.length);
  const pasted = paste("", "615969378912");
  assert.equal(pasted.value, "(615) 969-378912", "never silently cut to a different number");
  assert.equal(isValidUsPhone(pasted.value), false);
});

test("backspace removes one digit and keeps the caret beside it", () => {
  // At the end.
  assert.deepEqual(backspace("(615) 969-3789", 14), { value: "(615) 969-378", caret: 13 });
  // In the middle: after the 9 of 969 (caret 7) → (615) 693-789, caret after "6".
  assert.deepEqual(backspace("(615) 969-3789", 7), { value: "(615) 693-789", caret: 6 });
  // Over punctuation: deleting the "-" takes the digit before it.
  assert.deepEqual(backspace("(615) 969-3789", 10), { value: "(615) 963-789", caret: 8 });
  // Over ") ": the space and the parenthesis each take the area code's last digit.
  assert.deepEqual(backspace("(615) 969-3789", 6), { value: "(619) 693-789", caret: 3 });
  assert.deepEqual(backspace("(615) 969-3789", 5), { value: "(619) 693-789", caret: 3 });
  // Back down to three digits: no stray parentheses.
  assert.deepEqual(backspace("(615) 9", 7), { value: "615", caret: 3 });
  // Clearing completely.
  assert.deepEqual(backspace("6", 1), { value: "", caret: 0 });
});

test("deleting the first digit of an area code never swallows the 1 that follows", () => {
  // Select "6" in (615) and delete it: (15) → "159…" stays a (wrong) national number, not a country code.
  const raw = "(15) 969-3789";
  const edit = nextUsPhoneEdit("(615) 969-3789", raw, 1, "deleteContentBackward");
  assert.equal(edit.value, "(159) 693-789");
  assert.equal(isValidUsPhone(edit.value), false);
});

test("forward delete removes the digit after the caret, skipping punctuation", () => {
  assert.deepEqual(forwardDelete("(615) 969-3789", 6), { value: "(615) 693-789", caret: 6 });
  // On the "-": the digit after it goes.
  assert.deepEqual(forwardDelete("(615) 969-3789", 9), { value: "(615) 969-789", caret: 9 });
});

test("typing in the middle inserts there and the caret follows the new digit", () => {
  // "(615) 693-789" is missing the 9 that starts the exchange: caret before the "6" (position 6), type 9.
  const before = "(615) 693-789";
  const raw = before.slice(0, 6) + "9" + before.slice(6);
  const edit = nextUsPhoneEdit(before, raw, 7, "insertText");
  assert.equal(edit.value, "(615) 969-3789");
  assert.equal(edit.caret, 7, "just after the inserted 9");
  // Typing the fourth digit opens the parentheses and the caret lands after it, not before ") ".
  assert.deepEqual(nextUsPhoneEdit("615", "6159", 4, "insertText"), { value: "(615) 9", caret: 7 });
});

test("replacing a selection in the middle keeps the rest of the number", () => {
  // Select "969" and type 555.
  let value = "(615) 969-3789";
  let edit = nextUsPhoneEdit(value, "(615) 5-3789", 7, "insertText");
  value = edit.value;
  edit = nextUsPhoneEdit(value, value.slice(0, edit.caret) + "5" + value.slice(edit.caret), edit.caret + 1, "insertText");
  value = edit.value;
  edit = nextUsPhoneEdit(value, value.slice(0, edit.caret) + "5" + value.slice(edit.caret), edit.caret + 1, "insertText");
  assert.equal(edit.value, "(615) 555-3789");
  assert.equal(edit.caret, 9);
});

test("the check accepts complete dialable U.S. numbers only, like the server", () => {
  for (const ok of ["(615) 969-3789", "6159693789", "+1 615 969 3789", "16159693789", "(212) 555-0123"]) {
    assert.equal(isValidUsPhone(ok), true, ok);
  }
  for (const bad of ["", "615", "(615) 969-378", "(615) 969-378912", "(015) 969-3789", "(115) 969-3789", "(615) 069-3789", "(615) 169-3789", "+44 20 7946 0958", "call me"]) {
    assert.equal(isValidUsPhone(bad), false, bad);
  }
});

test("helpers", () => {
  assert.equal(usPhoneDigits("+1 (615) 969-3789"), "6159693789");
  assert.equal(usPhoneDigits("(161) 596-9378"), "1615969378", "ten digits starting with 1 are not a country code");
  assert.equal(caretAfterDigits("(615) 969-3789", 0), 0);
  assert.equal(caretAfterDigits("(615) 969-3789", 3), 4);
  assert.equal(caretAfterDigits("(615) 969-3789", 4), 7);
  assert.equal(caretAfterDigits("(615) 969-3789", 10), 14);
  assert.equal(caretBeforeNextDigit("(615) 969-3789", 3), 6);
  assert.equal(caretBeforeNextDigit("(615) 969-3789", 10), 14);
});
