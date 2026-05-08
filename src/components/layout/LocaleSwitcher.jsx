import { useEffect, useMemo } from "react";
import useLocaleStore from "../../stores/localeStore";
import useProjectStore from "../../stores/projectStore";

export default function LocaleSwitcher() {
  const activeProject = useProjectStore((state) => state.activeProject);
  const contentLocale = useLocaleStore((state) => state.contentLocale);
  const setContentLocale = useLocaleStore((state) => state.setContentLocale);

  const locales = useMemo(() => activeProject?.locales || ["en"], [activeProject?.locales]);

  useEffect(() => {
    const fallback = activeProject?.defaultLocale || "en";
    if (!locales.includes(contentLocale)) {
      setContentLocale(fallback);
    }
  }, [activeProject?.defaultLocale, contentLocale, locales, setContentLocale]);

  if (!activeProject) return null;

  return (
    <select
      className="h-10 rounded-md border border-slate-500 bg-slate-800 px-2 text-sm text-white"
      value={locales.includes(contentLocale) ? contentLocale : (activeProject.defaultLocale || "en")}
      onChange={(event) => setContentLocale(event.target.value)}
      aria-label="Content locale switcher"
    >
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {locale.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
