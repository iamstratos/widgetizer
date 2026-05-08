function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function isLocalizedValue(value) {
  return isObject(value) && value._localized === true && isObject(value.values);
}

export function resolveLocalizedValue(value, locale = "en", fallbackLocale = "en") {
  if (!isLocalizedValue(value)) return value;

  const values = value.values || {};
  if (locale && values[locale] !== undefined) return values[locale];
  if (fallbackLocale && values[fallbackLocale] !== undefined) return values[fallbackLocale];

  const firstValue = Object.values(values).find((entry) => entry !== undefined);
  return firstValue ?? "";
}

export function resolveLocalizedSettingsMap(settings = {}, locale = "en", fallbackLocale = "en") {
  const resolved = {};
  Object.entries(settings || {}).forEach(([key, value]) => {
    resolved[key] = resolveLocalizedValue(value, locale, fallbackLocale);
  });
  return resolved;
}
