import { create } from "zustand";

const useLocaleStore = create((set) => ({
  contentLocale: "en",
  setContentLocale: (locale) => set({ contentLocale: locale || "en" }),
}));

export default useLocaleStore;
