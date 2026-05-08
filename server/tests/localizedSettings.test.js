import test from "node:test";
import assert from "node:assert/strict";
import { resolveLocalizedSettingsMap, resolveLocalizedValue } from "../utils/localizedSettings.js";

test("resolveLocalizedValue returns locale value with fallback", () => {
  const value = {
    _localized: true,
    values: {
      en: "Hello",
      el: "Geia",
    },
  };

  assert.equal(resolveLocalizedValue(value, "el", "en"), "Geia");
  assert.equal(resolveLocalizedValue(value, "fr", "en"), "Hello");
});

test("resolveLocalizedSettingsMap resolves localized wrappers to scalars", () => {
  const settings = {
    title: {
      _localized: true,
      values: { en: "Headline", el: "Titlos" },
    },
    eyebrow: "Static value",
  };

  const resolved = resolveLocalizedSettingsMap(settings, "el", "en");
  assert.deepEqual(resolved, {
    title: "Titlos",
    eyebrow: "Static value",
  });
});
