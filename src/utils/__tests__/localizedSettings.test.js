import { describe, expect, it } from "vitest";
import {
  getLocalizedValue,
  isLocalizedValue,
  isSettingLocalizable,
  setLocalizedValue,
} from "../localizedSettings";

describe("localizedSettings helpers", () => {
  it("detects localized wrapper values", () => {
    expect(isLocalizedValue({ _localized: true, values: { en: "Hello" } })).toBe(true);
    expect(isLocalizedValue("Hello")).toBe(false);
  });

  it("returns locale-specific value with fallback", () => {
    const value = { _localized: true, values: { en: "Hello", el: "Geia" } };
    expect(getLocalizedValue(value, "el", "en")).toBe("Geia");
    expect(getLocalizedValue(value, "fr", "en")).toBe("Hello");
  });

  it("upgrades legacy scalar value to localized wrapper on write", () => {
    const next = setLocalizedValue("Hello", "el", "Geia", "en");
    expect(next).toEqual({
      _localized: true,
      values: {
        en: "Hello",
        el: "Geia",
      },
    });
  });

  it("keeps non-translatable settings as scalar", () => {
    expect(isSettingLocalizable({ id: "name", type: "text" })).toBe(false);
    expect(isSettingLocalizable({ id: "title", type: "text" })).toBe(true);
    expect(isSettingLocalizable({ id: "image", type: "image" })).toBe(false);
  });
});
