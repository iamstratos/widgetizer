export function getStandalonePreviewTarget(href) {
  if (!href || typeof href !== "string") return null;
  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;

  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("http:") ||
    lower.startsWith("https:") ||
    lower.startsWith("mailto:") ||
    lower.startsWith("tel:") ||
    lower.startsWith("javascript:") ||
    trimmed.startsWith("//")
  ) {
    return null;
  }

  const withoutQuery = trimmed.split("?")[0].split("#")[0];
  const previewMatch = withoutQuery.match(/^\/?preview\/([^/]+)$/);
  if (previewMatch) {
    return `/preview/${previewMatch[1]}`;
  }

  const localizedPreviewMatch = withoutQuery.match(/^\/?preview\/([a-z]{2})\/([^/]+)$/i);
  if (localizedPreviewMatch) {
    return `/preview/${localizedPreviewMatch[1].toLowerCase()}/${localizedPreviewMatch[2]}`;
  }

  const htmlMatch = withoutQuery.match(/^\/?([^/]+)\.html$/);
  if (htmlMatch) {
    return `/preview/${htmlMatch[1]}`;
  }

  const localeHtmlMatch = withoutQuery.match(/^\/?([a-z]{2})\/([^/]+)\.html$/i);
  if (localeHtmlMatch) {
    return `/preview/${localeHtmlMatch[1].toLowerCase()}/${localeHtmlMatch[2]}`;
  }

  return null;
}

export function isStandalonePreviewNavigationUrl(url) {
  return typeof url === "string" && /^\/preview\/([a-z]{2}\/)?[^/?#]+$/.test(url);
}
