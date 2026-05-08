const LOCALIZED_MARKER = "_localized";
const DEFAULT_CONTENT_LOCALE = "en";
const LOCALIZABLE_SETTING_TYPES = new Set(["text", "textarea", "richtext"]);

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function isLocalizedValue(value) {
  return isObject(value) && value[LOCALIZED_MARKER] === true && isObject(value.values);
}

export function isSettingLocalizable(setting) {
  if (!setting || typeof setting !== "object") return false;
  if (setting.id === "name") return false;
  if (setting.translatable === true || setting.localized === true) return true;
  return LOCALIZABLE_SETTING_TYPES.has(setting.type);
}

export function getLocalizedValue(value, locale, fallbackLocale = DEFAULT_CONTENT_LOCALE) {
  if (!isLocalizedValue(value)) {
    return value;
  }

  const values = value.values || {};
  if (locale && values[locale] !== undefined) return values[locale];
  if (fallbackLocale && values[fallbackLocale] !== undefined) return values[fallbackLocale];

  const firstValue = Object.values(values).find((entry) => entry !== undefined);
  return firstValue ?? "";
}

export function setLocalizedValue(existingValue, locale, nextValue, fallbackLocale = DEFAULT_CONTENT_LOCALE) {
  if (!locale) {
    return nextValue;
  }

  const localized = isLocalizedValue(existingValue)
    ? {
        ...existingValue,
        values: { ...existingValue.values },
      }
    : {
        [LOCALIZED_MARKER]: true,
        values: {},
      };

  if (!isLocalizedValue(existingValue) && existingValue !== undefined && existingValue !== null) {
    localized.values[fallbackLocale] = existingValue;
  }

  localized.values[locale] = nextValue;
  return localized;
}

export function buildLocalizedFieldValue({
  setting,
  rawValue,
  activeLocale,
  fallbackLocale = DEFAULT_CONTENT_LOCALE,
}) {
  if (!isSettingLocalizable(setting)) {
    return {
      valueForInput: rawValue,
      valueForStorage: rawValue,
      isLocalized: false,
    };
  }

  return {
    valueForInput: getLocalizedValue(rawValue, activeLocale, fallbackLocale),
    valueForStorage: setLocalizedValue(rawValue, activeLocale, getLocalizedValue(rawValue, activeLocale, fallbackLocale), fallbackLocale),
    isLocalized: true,
  };
}

export function resolveLocalizedSettingsMap(settings = {}, locale, fallbackLocale = DEFAULT_CONTENT_LOCALE) {
  const resolved = {};
  Object.entries(settings || {}).forEach(([key, value]) => {
    resolved[key] = getLocalizedValue(value, locale, fallbackLocale);
  });
  return resolved;
}
