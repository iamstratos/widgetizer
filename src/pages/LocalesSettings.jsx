import { useState } from "react";
import { useTranslation } from "react-i18next";
import PageLayout from "../components/layout/PageLayout";
import Button from "../components/ui/Button";
import useProjectStore from "../stores/projectStore";
import useToastStore from "../stores/toastStore";
import { updateProject } from "../queries/projectManager";

export default function LocalesSettings() {
  const { t } = useTranslation();
  const activeProject = useProjectStore((state) => state.activeProject);
  const setActiveProject = useProjectStore((state) => state.setActiveProject);
  const showToast = useToastStore((state) => state.showToast);
  const [newLocale, setNewLocale] = useState("");
  const [saving, setSaving] = useState(false);

  const locales = activeProject?.locales || ["en"];
  const defaultLocale = activeProject?.defaultLocale || "en";

  const saveLocales = async (nextLocales, nextDefaultLocale) => {
    if (!activeProject?.id) return;
    setSaving(true);
    try {
      const updated = await updateProject(activeProject.id, {
        name: activeProject.name,
        folderName: activeProject.folderName,
        description: activeProject.description || "",
        siteTitle: activeProject.siteTitle || "",
        siteUrl: activeProject.siteUrl || "",
        receiveThemeUpdates: activeProject.receiveThemeUpdates || false,
        locales: nextLocales,
        defaultLocale: nextDefaultLocale,
      });
      setActiveProject(updated);
      showToast(t("localesSettings.toasts.saveSuccess"), "success");
    } catch (error) {
      showToast(error.message || t("localesSettings.toasts.saveError"), "error");
    } finally {
      setSaving(false);
    }
  };

  const addLocale = async () => {
    const locale = newLocale.trim().toLowerCase();
    if (!/^[a-z]{2}$/.test(locale)) {
      showToast(t("localesSettings.toasts.invalidLocale"), "error");
      return;
    }
    const nextLocales = Array.from(new Set([...locales, locale]));
    setNewLocale("");
    await saveLocales(nextLocales, defaultLocale);
  };

  const removeLocale = async (localeToRemove) => {
    if (locales.length <= 1) return;
    const nextLocales = locales.filter((locale) => locale !== localeToRemove);
    const nextDefault = defaultLocale === localeToRemove ? nextLocales[0] : defaultLocale;
    await saveLocales(nextLocales, nextDefault);
  };

  const updateDefaultLocale = async (locale) => {
    await saveLocales(locales, locale);
  };

  return (
    <PageLayout title={t("localesSettings.title")} description={t("localesSettings.description")}>
      <div className="space-y-6 max-w-2xl">
        <div className="form-field">
          <label className="form-label">{t("localesSettings.languagesLabel")}</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newLocale}
              onChange={(event) => setNewLocale(event.target.value)}
              className="form-input"
              placeholder={t("localesSettings.localePlaceholder")}
              maxLength={2}
              disabled={saving}
            />
            <Button type="button" variant="secondary" onClick={addLocale} disabled={saving}>
              {t("localesSettings.addLocale")}
            </Button>
          </div>
          <p className="form-description">{t("localesSettings.languagesHelp")}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {locales.map((locale) => (
            <span key={locale} className="inline-flex items-center gap-2 rounded bg-slate-100 px-2 py-1 text-sm">
              {locale.toUpperCase()}
              {locales.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLocale(locale)}
                  className="text-slate-500 hover:text-slate-700"
                  aria-label={t("localesSettings.removeLocaleAria", { locale })}
                  disabled={saving}
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>

        <div className="form-field">
          <label className="form-label">{t("localesSettings.defaultLocaleLabel")}</label>
          <select
            value={defaultLocale}
            onChange={(event) => updateDefaultLocale(event.target.value)}
            className="form-select"
            disabled={saving}
          >
            {locales.map((locale) => (
              <option key={locale} value={locale}>
                {locale.toUpperCase()}
              </option>
            ))}
          </select>
          <p className="form-description">{t("localesSettings.defaultLocaleHelp")}</p>
        </div>
      </div>
    </PageLayout>
  );
}
