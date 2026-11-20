// Browser check for Kabba #282: the Contact page layout at phone, tablet and desktop widths,
// its three destinations, and the support form's phone field typed, pasted and edited in a
// real Chrome. Nothing leaves the machine: every request to the Kabba API is blocked, and
// the support form is never submitted with valid data.
//
//   npm run build && npx vite preview --port 4174 --strictPort --host 127.0.0.1
//   node tests/browser/support-polish.check.mjs [base-url] [screenshot-dir]
//
// Needs Google Chrome (CHROME=/path/to/chrome to override) and Node 22+ (global WebSocket).
import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const BASE = process.argv[2] || "http://127.0.0.1:4174";
const SHOTS = process.argv[3] || "";
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9333 + Math.floor(Math.random() * 500);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok: !!ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

const profile = mkdtempSync(join(tmpdir(), "kabba-check-"));
const chrome = spawn(CHROME, [`--headless=new`, `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, "--no-first-run", "--no-default-browser-check", "about:blank"], { stdio: "ignore" });

let ws;
let seq = 0;
const pending = new Map();
const listeners = [];
function send(method, params = {}) {
  const id = ++seq;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject, method }));
}
async function evaluate(fn, ...args) {
  const expression = `(${fn.toString()})(...${JSON.stringify(args)})`;
  const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
}
async function navigate(path) {
  const loaded = new Promise((resolve) => listeners.push({ method: "Page.loadEventFired", resolve }));
  await send("Page.navigate", { url: BASE + path });
  await loaded;
  await sleep(600);
}
async function viewport(width, height, mobile) {
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: mobile ? 2 : 1, mobile });
  await send("Emulation.setTouchEmulationEnabled", { enabled: mobile });
}
async function key(keyName, code, vk) {
  await send("Input.dispatchKeyEvent", { type: "rawKeyDown", key: keyName, code, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: keyName, code, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk });
  await sleep(30);
}
async function typeText(text) {
  for (const ch of text) {
    await send("Input.insertText", { text: ch });
    await sleep(15);
  }
}
async function shot(name) {
  if (!SHOTS) return;
  mkdirSync(SHOTS, { recursive: true });
  const r = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
  writeFileSync(join(SHOTS, name + ".png"), Buffer.from(r.data, "base64"));
}

try {
  let version;
  for (let i = 0; i < 50 && !version; i++) {
    try {
      version = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json();
    } catch {
      await sleep(200);
    }
  }
  const target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" })).json();
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  ws.addEventListener("message", async (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) {
      const p = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? p.reject(new Error(`${p.method}: ${msg.error.message}`)) : p.resolve(msg.result);
    } else if (msg.method === "Fetch.requestPaused") {
      // Block the Kabba API: no real case, consultation or lookup can come from this check.
      send("Fetch.failRequest", { requestId: msg.params.requestId, errorReason: "BlockedByClient" });
    } else if (msg.method) {
      for (let i = listeners.length - 1; i >= 0; i--) {
        if (listeners[i].method === msg.method) listeners.splice(i, 1)[0].resolve(msg.params);
      }
    }
  });
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Fetch.enable", { patterns: [{ urlPattern: "*api.kabba.ai*" }, { urlPattern: "*kabba.ai/api*" }] });

  /* ---------------- Contact page layout ---------------- */
  const measure = () => {
    const r = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { top: Math.round(b.top + scrollY), bottom: Math.round(b.bottom + scrollY), left: Math.round(b.left), right: Math.round(b.right), height: Math.round(b.height) };
    };
    const text = document.body.innerText;
    const cta = document.querySelector("[data-contact-support-cta]");
    return {
      innerWidth, scrollWidth: document.documentElement.scrollWidth,
      phone: r("[data-contact-phone]"), support: r("[data-contact-support]"), sales: r("[data-contact-sales]"),
      green: r("[data-contact-support-cta]"), impl: r("[data-contact-implementation]"), discuss: r("[data-contact-consultation]"),
      greenText: cta?.textContent.trim(), greenHref: cta?.getAttribute("href"), greenBg: cta ? getComputedStyle(cta).backgroundColor : null,
      implHref: document.querySelector("[data-contact-implementation]")?.getAttribute("href"),
      discussHref: document.querySelector("[data-contact-consultation]")?.getAttribute("href"),
      phoneHref: document.querySelector("[data-contact-phone]")?.getAttribute("href"),
      hasWhy: text.includes("Why reach out"), hasForm: !!document.querySelector("section form"), has24h: /24 hours|within 24/i.test(text),
      supportHeading: document.querySelector("#contact-support-heading")?.textContent.trim(),
      salesHeading: document.querySelector("#contact-sales-heading")?.textContent.trim(),
      supportText: document.querySelector("[data-contact-support] p")?.textContent.trim(),
      navTrial: [...document.querySelectorAll("nav a, nav button")].map((e) => e.textContent.trim()).find((t) => /Trial/.test(t)) || null,
    };
  };
  for (const [w, h, mobile, label] of [[1440, 1000, false, "desktop-1440"], [1280, 900, false, "desktop-1280"], [1024, 900, false, "tablet-1024"], [768, 1024, false, "tablet-768"], [390, 844, true, "phone-390"], [360, 780, true, "phone-360"]]) {
    await viewport(w, h, mobile);
    await navigate("/contact");
    const m = await evaluate(measure);
    check(`[${label}] no horizontal scrolling`, m.scrollWidth <= m.innerWidth, `${m.scrollWidth} <= ${m.innerWidth}`);
    check(`[${label}] green "Get Kabba Support" → /support`, m.greenText === "Get Kabba Support" && m.greenHref === "/support" && /rgb\(5, 150, 105\)/.test(m.greenBg), `${m.greenText} ${m.greenHref} ${m.greenBg}`);
    check(`[${label}] support heading and text`, m.supportHeading === "Already a Kabba customer?" && m.supportText === "Need help with Kabba? Open a support case, even if you can't sign in.");
    check(`[${label}] sales heading kept`, m.salesHeading === "Let's talk about your rental business");
    check(`[${label}] Implementation Services above Discuss Kabba`, m.impl && m.discuss && m.impl.bottom <= m.discuss.top, `${m.impl?.bottom} <= ${m.discuss?.top}`);
    check(`[${label}] destinations`, m.implHref === "/implementation-services" && m.discussHref === "/?scroll=consultation" && m.phoneHref === "tel:6152896429");
    check(`[${label}] "Why reach out?", old form and 24-hour promise gone`, !m.hasWhy && !m.hasForm && !m.has24h);
    check(`[${label}] buttons fully inside their cards`, m.green.right <= m.support.right && m.green.left >= m.support.left && m.discuss.right <= m.sales.right && m.impl.left >= m.sales.left);
    if (w >= 768) {
      check(`[${label}] columns start at the same height`, Math.abs(m.phone.top - m.sales.top) <= 1, `phone ${m.phone.top} / sales ${m.sales.top}`);
      check(`[${label}] columns end at the same height`, Math.abs(m.support.bottom - m.sales.bottom) <= 1, `support ${m.support.bottom} / sales ${m.sales.bottom}`);
      check(`[${label}] green and orange buttons line up`, Math.abs(m.green.bottom - m.discuss.bottom) <= 1 && Math.abs(m.green.top - m.discuss.top) <= 1, `green ${m.green.top}-${m.green.bottom} / orange ${m.discuss.top}-${m.discuss.bottom}`);
      check(`[${label}] support and sales side by side`, m.support.left < m.sales.left && m.support.right <= m.sales.left);
    } else {
      check(`[${label}] support first, then phone, then sales`, m.support.top < m.phone.top && m.phone.top < m.sales.top, `support ${m.support.top} phone ${m.phone.top} sales ${m.sales.top}`);
    }
    await shot(`contact-${label}`);
  }

  /* ---------------- Contact destinations (desktop) ---------------- */
  await viewport(1440, 1000, false);
  for (const [sel, path, name] of [["[data-contact-support-cta]", "/support", "Get Kabba Support"], ["[data-contact-implementation]", "/implementation-services", "Explore Implementation Services"]]) {
    await navigate("/contact");
    await evaluate((s) => document.querySelector(s).click(), sel);
    await sleep(800);
    const where = await evaluate(() => ({ path: location.pathname, h1: document.querySelector("h1")?.textContent.trim() }));
    check(`${name} opens ${path}`, where.path === path, `${where.path} — "${where.h1}"`);
  }
  await navigate("/contact");
  await evaluate(() => document.querySelector("[data-contact-consultation]").click());
  await sleep(1800);
  const consult = await evaluate(() => {
    const s = document.getElementById("consultation");
    const b = s?.getBoundingClientRect();
    return { path: location.pathname, search: location.search, exists: !!s, top: b ? Math.round(b.top) : null, innerHeight, heading: s?.querySelector("h2")?.textContent.trim() };
  });
  check("Discuss Kabba opens the consultation section on the home page", consult.path === "/" && consult.search === "?scroll=consultation" && consult.exists && consult.top !== null && consult.top >= -5 && consult.top < consult.innerHeight / 2, JSON.stringify(consult));

  // Keyboard: the green button can be reached with Tab and shows a focus ring.
  await navigate("/contact");
  let reached = false;
  for (let i = 0; i < 40 && !reached; i++) {
    await key("Tab", "Tab", 9);
    reached = await evaluate(() => document.activeElement?.hasAttribute("data-contact-support-cta"));
  }
  const ring = await evaluate(() => getComputedStyle(document.activeElement).boxShadow);
  check("Get Kabba Support is reachable by keyboard with a visible focus ring", reached && ring && ring !== "none", ring);

  /* ---------------- Support form phone field ---------------- */
  for (const [w, h, mobile, label] of [[1280, 900, false, "desktop"], [390, 844, true, "phone"]]) {
    await viewport(w, h, mobile);
    await navigate("/support");
    const attrs = await evaluate(() => {
      const el = document.getElementById("support-phone");
      return el ? { type: el.type, inputMode: el.inputMode, autocomplete: el.autocomplete, required: el.required, placeholder: el.placeholder } : null;
    });
    check(`[${label}] phone field: tel keypad, autofill, optional`, attrs && attrs.type === "tel" && attrs.inputMode === "tel" && attrs.autocomplete === "tel" && !attrs.required, JSON.stringify(attrs));
    const state = () => evaluate(() => {
      const el = document.getElementById("support-phone");
      return { value: el.value, caret: el.selectionStart };
    });
    const focus = () => evaluate(() => {
      const el = document.getElementById("support-phone");
      el.scrollIntoView({ block: "center" });
      el.focus();
    });
    const setCaret = (a, b = a) => evaluate((x, y) => document.getElementById("support-phone").setSelectionRange(x, y), a, b);
    const clear = async () => {
      await focus();
      await setCaret(0, 99);
      await key("Backspace", "Backspace", 8);
    };

    await focus();
    await typeText("6159693789");
    let s = await state();
    check(`[${label}] typing 6159693789 shows (615) 969-3789`, s.value === "(615) 969-3789" && s.caret === 14, JSON.stringify(s));
    await typeText("5");
    s = await state();
    check(`[${label}] an 11th typed digit is ignored`, s.value === "(615) 969-3789" && s.caret === 14, JSON.stringify(s));

    await setCaret(7);
    await key("Backspace", "Backspace", 8);
    s = await state();
    check(`[${label}] backspace in the middle removes one digit, caret stays`, s.value === "(615) 693-789" && s.caret === 6, JSON.stringify(s));
    await typeText("9");
    s = await state();
    check(`[${label}] typing in the middle puts it back, caret after it`, s.value === "(615) 969-3789" && s.caret === 7, JSON.stringify(s));
    await setCaret(10);
    await key("Backspace", "Backspace", 8);
    s = await state();
    check(`[${label}] backspace on the "-" removes the digit before it`, s.value === "(615) 963-789" && s.caret === 8, JSON.stringify(s));
    await setCaret(6);
    await key("Delete", "Delete", 46);
    s = await state();
    check(`[${label}] forward Delete removes the next digit`, s.value === "(615) 637-89" && s.caret === 6, JSON.stringify(s));

    await clear();
    s = await state();
    check(`[${label}] select all + backspace empties the field`, s.value === "", JSON.stringify(s));
    await typeText("+16159693789");
    s = await state();
    check(`[${label}] typing +1 6159693789 drops the country code`, s.value === "(615) 969-3789", JSON.stringify(s));

    // A real paste through the clipboard.
    await clear();
    await send("Browser.grantPermissions", { permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"], origin: new URL(BASE).origin }).catch(() => {});
    for (const [text, want] of [["+1 (615) 969-3789", "(615) 969-3789"], ["615.969.3789", "(615) 969-3789"], ["1-615-969-3789", "(615) 969-3789"]]) {
      await clear();
      const wrote = await evaluate((t) => navigator.clipboard.writeText(t).then(() => true, () => false), text);
      if (wrote) {
        await send("Input.dispatchKeyEvent", { type: "rawKeyDown", key: "v", code: "KeyV", windowsVirtualKeyCode: 86, modifiers: process.platform === "darwin" ? 4 : 2, commands: ["paste"] });
        await send("Input.dispatchKeyEvent", { type: "keyUp", key: "v", code: "KeyV", windowsVirtualKeyCode: 86, modifiers: process.platform === "darwin" ? 4 : 2 });
        await sleep(100);
      } else {
        await send("Input.insertText", { text });
      }
      s = await state();
      check(`[${label}] pasting "${text}" shows ${want}${wrote ? "" : " (clipboard unavailable: inserted)"}`, s.value === want, JSON.stringify(s));
    }

    // An incomplete number is refused before anything is sent.
    await clear();
    await typeText("615969378");
    await evaluate(() => document.querySelector("[data-support-form] button[type=submit]").click());
    await sleep(300);
    const err = await evaluate(() => document.getElementById("support-phone-error")?.textContent.trim() || null);
    check(`[${label}] an incomplete number shows the U.S. phone error`, err === "Enter a 10-digit U.S. phone number, e.g. (615) 555-0123, or leave it blank.", String(err));
    await clear();
    await evaluate(() => document.querySelector("[data-support-form] button[type=submit]").click());
    await sleep(300);
    const blank = await evaluate(() => document.getElementById("support-phone-error")?.textContent.trim() || null);
    check(`[${label}] a blank phone is allowed`, blank === null, String(blank));
    await shot(`support-form-${label}`);
  }
} catch (e) {
  check("browser check ran to the end", false, e.stack || String(e));
} finally {
  try { ws?.close(); } catch {}
  chrome.kill();
}
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
