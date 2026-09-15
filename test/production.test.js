import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("Analytics n’est pas intégré directement dans le document initial", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  assert.equal(html.includes("googletagmanager.com/gtag/js"), false);
  assert.equal(html.includes("google-analytics.com/g/collect"), false);
});

test("les services externes sont configurés par les variables Vercel", async () => {
  const analytics = await readFile(
    new URL("../src/lib/analytics.js", import.meta.url),
    "utf8",
  );
  const contactHook = await readFile(
    new URL("../src/hooks/useContactForm.js", import.meta.url),
    "utf8",
  );

  assert.equal(analytics.includes("G-NC0WNJEG3M"), false);
  assert.equal(contactHook.includes("https://formspree.io/f/"), false);
});

test("les principaux en-têtes de sécurité sont déclarés pour Vercel", async () => {
  const config = JSON.parse(
    await readFile(new URL("../vercel.json", import.meta.url), "utf8"),
  );
  const names = config.headers[0].headers.map(({ key }) => key);
  assert.ok(names.includes("Content-Security-Policy"));
  assert.ok(names.includes("X-Content-Type-Options"));
  assert.ok(names.includes("Referrer-Policy"));
  assert.ok(names.includes("Permissions-Policy"));
});
