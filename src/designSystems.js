import { parse } from "yaml";

const designModules = import.meta.glob("../design-md/*/DESIGN.md", {
  query: "?raw",
  import: "default",
});

const moduleBySlug = new Map(
  Object.entries(designModules).map(([path, loader]) => [
    getSlugFromPath(path),
    { path, loader },
  ]),
);
const cache = new Map();

const fallbackTheme = {
  primary: "#f54e00",
  primaryActive: "#d04200",
  ink: "#26251e",
  body: "#5a5852",
  muted: "#807d72",
  hairline: "#e6e5e0",
  hairlineSoft: "#efeee8",
  hairlineStrong: "#cfcdc4",
  canvas: "#f7f7f4",
  canvasSoft: "#fafaf7",
  surfaceCard: "#ffffff",
  surfaceStrong: "#e6e5e0",
  onPrimary: "#ffffff",
  timelineThinking: "#dfa88f",
  timelineGrep: "#9fc9a2",
  timelineRead: "#9fbbe0",
  timelineEdit: "#c0a8dd",
  timelineDone: "#c08532",
};

export const designSystemOptions = Array.from(moduleBySlug.keys())
  .map((slug) => ({
    slug,
    label: formatLabel(slug),
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

export const defaultDesignSystem = {
  slug: "cursor",
  label: "Cursor",
  name: "Cursor design system",
  description: "디자인 시스템을 불러오는 중입니다.",
  colors: {},
  typography: {},
  rounded: {},
  spacing: {},
  components: {},
};

export async function loadDesignSystem(slug) {
  const targetSlug = moduleBySlug.has(slug) ? slug : designSystemOptions[0]?.slug;

  if (cache.has(targetSlug)) {
    return cache.get(targetSlug);
  }

  const module = moduleBySlug.get(targetSlug);
  const raw = await module.loader();
  const system = parseDesignSystem(targetSlug, raw);
  cache.set(targetSlug, system);

  return system;
}

export function createThemeVars(system) {
  const colors = system?.colors ?? {};
  const typography = system?.typography ?? {};
  const rounded = system?.rounded ?? {};
  const spacing = system?.spacing ?? {};
  const components = system?.components ?? {};

  const displayType =
    typography["display-mega"] ??
    typography["display-xxl"] ??
    typography["display-xl"] ??
    typography["hero-display"] ??
    typography["display-lg"] ??
    {};
  const bodyType = typography["body-md"] ?? typography.body ?? typography["body-lg"] ?? {};
  const codeType = typography.code ?? typography["caption-mono"] ?? {};
  const nav = pickComponent(components, ["top-nav", "nav-bar", "global-nav"]);
  const primaryButton = pickComponent(components, [
    "button-primary",
    "nav-cta-signup",
    "button-download",
    "button-store-hero",
  ]);
  const secondaryButton = pickComponent(components, [
    "button-secondary",
    "button-secondary-pill",
    "button-tertiary-text",
  ]);
  const hero = pickComponent(components, ["hero-band", "product-tile-light", "showcase-band-light"]);
  const card = pickComponent(components, [
    "feature-card",
    "card-marketing",
    "card-soft",
    "property-card",
    "template-card",
  ]);
  const codeBlock = pickComponent(components, [
    "code-editor-mockup",
    "code-block",
    "ide-pane",
    "terminal-card",
  ]);
  const input = pickComponent(components, ["form-input", "text-input", "search-input", "search-field"]);
  const footer = pickComponent(components, ["footer", "footer-light", "legal-band"]);

  return {
    "--primary": pick(colors, ["primary", "accent", "link"], fallbackTheme.primary),
    "--primary-active": pick(
      colors,
      ["primary-active", "primary-press", "primary-deep", "primary-focus"],
      pick(colors, ["primary"], fallbackTheme.primaryActive),
    ),
    "--ink": pick(colors, ["ink", "body-strong", "carbon"], fallbackTheme.ink),
    "--body": pick(colors, ["body", "ink-secondary", "muted"], fallbackTheme.body),
    "--muted": pick(colors, ["muted", "mute", "ink-mute", "body-muted"], fallbackTheme.muted),
    "--muted-soft": pick(colors, ["muted-soft", "ink-muted-48"], fallbackTheme.mutedSoft),
    "--hairline": pick(colors, ["hairline", "divider-soft", "border"], fallbackTheme.hairline),
    "--hairline-soft": pick(colors, ["hairline-soft", "divider-soft"], fallbackTheme.hairlineSoft),
    "--hairline-strong": pick(
      colors,
      ["hairline-strong", "border-strong", "hairline-input"],
      fallbackTheme.hairlineStrong,
    ),
    "--canvas": pick(colors, ["canvas", "background"], fallbackTheme.canvas),
    "--canvas-soft": pick(
      colors,
      ["canvas-soft", "canvas-parchment", "surface-soft", "canvas-soft-2"],
      fallbackTheme.canvasSoft,
    ),
    "--surface-card": pick(
      colors,
      ["surface-card", "surface", "canvas", "surface-pearl"],
      fallbackTheme.surfaceCard,
    ),
    "--surface-strong": pick(
      colors,
      ["surface-strong", "surface-tile-1", "canvas-soft-2", "hairline"],
      fallbackTheme.surfaceStrong,
    ),
    "--on-primary": pick(colors, ["on-primary", "on-dark"], fallbackTheme.onPrimary),
    "--timeline-thinking": pick(
      colors,
      ["timeline-thinking", "warning-soft", "canvas-cream"],
      fallbackTheme.timelineThinking,
    ),
    "--timeline-grep": pick(colors, ["timeline-grep", "success", "cyan"], fallbackTheme.timelineGrep),
    "--timeline-read": pick(colors, ["timeline-read", "link", "primary-on-dark"], fallbackTheme.timelineRead),
    "--timeline-edit": pick(colors, ["timeline-edit", "violet", "plus"], fallbackTheme.timelineEdit),
    "--timeline-done": pick(colors, ["timeline-done", "warning", "primary"], fallbackTheme.timelineDone),
    "--radius-md": pick(rounded, ["md", "base", "sm"], "8px"),
    "--radius-lg": pick(rounded, ["lg", "xl", "md"], "12px"),
    "--radius-xl": pick(rounded, ["xl", "lg", "md"], "16px"),
    "--radius-pill": pick(rounded, ["pill", "full", "pill-sm"], "9999px"),
    "--space-xs": pick(spacing, ["xs", "xxs"], "8px"),
    "--space-sm": pick(spacing, ["sm", "xs"], "12px"),
    "--space-base": pick(spacing, ["base", "md", "sm"], "16px"),
    "--space-md": pick(spacing, ["md", "lg", "base"], "20px"),
    "--space-lg": pick(spacing, ["lg", "xl"], "24px"),
    "--space-xl": pick(spacing, ["xl", "2xl", "xxl"], "32px"),
    "--space-xxl": pick(spacing, ["xxl", "2xl", "3xl"], "48px"),
    "--space-section": pick(spacing, ["section", "5xl", "4xl"], "80px"),
    "--font-sans": normalizeFont(displayType.fontFamily ?? bodyType.fontFamily, fallbackFontSans),
    "--font-body": normalizeFont(bodyType.fontFamily ?? displayType.fontFamily, fallbackFontSans),
    "--font-mono": normalizeFont(codeType.fontFamily, fallbackFontMono),
    "--display-weight": String(displayType.fontWeight ?? 400),
    "--display-tracking": displayType.letterSpacing ?? "-0.04em",
    "--page-bg": pick(
      colors,
      ["canvas", "background", "canvas-parchment", "surface"],
      fallbackTheme.canvas,
    ),
    "--page-bg-soft": pick(
      colors,
      ["canvas-soft", "surface-soft", "canvas-parchment", "surface-pearl"],
      fallbackTheme.canvasSoft,
    ),
    "--nav-bg": resolveTokenValue(nav.backgroundColor, system, pick(colors, ["canvas"], fallbackTheme.canvas)),
    "--nav-color": resolveTokenValue(nav.textColor, system, pick(colors, ["ink"], fallbackTheme.ink)),
    "--nav-height": resolveTokenValue(nav.height, system, "64px"),
    "--nav-padding": resolveTokenValue(nav.padding, system, "14px clamp(20px, 5vw, 56px)"),
    "--button-primary-bg": resolveTokenValue(
      primaryButton.backgroundColor,
      system,
      pick(colors, ["primary"], fallbackTheme.primary),
    ),
    "--button-primary-color": resolveTokenValue(
      primaryButton.textColor,
      system,
      pick(colors, ["on-primary", "on-dark"], fallbackTheme.onPrimary),
    ),
    "--button-primary-radius": resolveTokenValue(primaryButton.rounded, system, "8px"),
    "--button-primary-padding": resolveTokenValue(primaryButton.padding, system, "0 18px"),
    "--button-primary-height": resolveTokenValue(primaryButton.height, system, "40px"),
    "--button-secondary-bg": resolveTokenValue(
      secondaryButton.backgroundColor,
      system,
      pick(colors, ["surface-card", "canvas"], fallbackTheme.surfaceCard),
    ),
    "--button-secondary-color": resolveTokenValue(
      secondaryButton.textColor,
      system,
      pick(colors, ["ink"], fallbackTheme.ink),
    ),
    "--hero-bg": resolveTokenValue(hero.backgroundColor, system, pick(colors, ["canvas"], fallbackTheme.canvas)),
    "--hero-color": resolveTokenValue(hero.textColor, system, pick(colors, ["ink"], fallbackTheme.ink)),
    "--hero-padding-token": resolveTokenValue(hero.padding, system, "clamp(72px, 9vw, 128px) clamp(20px, 5vw, 64px) var(--space-section)"),
    "--card-bg": resolveTokenValue(
      card.backgroundColor,
      system,
      pick(colors, ["surface-card", "canvas"], fallbackTheme.surfaceCard),
    ),
    "--card-color": resolveTokenValue(card.textColor, system, pick(colors, ["ink"], fallbackTheme.ink)),
    "--card-radius": resolveTokenValue(card.rounded, system, "12px"),
    "--card-padding": resolveTokenValue(card.padding, system, "24px"),
    "--code-bg": resolveTokenValue(
      codeBlock.backgroundColor,
      system,
      pick(colors, ["ink", "surface-card"], fallbackTheme.ink),
    ),
    "--code-color": resolveTokenValue(
      codeBlock.textColor,
      system,
      pick(colors, ["canvas", "on-primary"], fallbackTheme.canvas),
    ),
    "--code-radius": resolveTokenValue(codeBlock.rounded, system, "12px"),
    "--code-padding": resolveTokenValue(codeBlock.padding, system, "20px"),
    "--input-bg": resolveTokenValue(
      input.backgroundColor,
      system,
      pick(colors, ["surface-card", "canvas"], fallbackTheme.surfaceCard),
    ),
    "--input-color": resolveTokenValue(input.textColor, system, pick(colors, ["ink"], fallbackTheme.ink)),
    "--input-radius": resolveTokenValue(input.rounded, system, "8px"),
    "--footer-bg": resolveTokenValue(footer.backgroundColor, system, pick(colors, ["canvas"], fallbackTheme.canvas)),
    "--footer-color": resolveTokenValue(footer.textColor, system, pick(colors, ["body"], fallbackTheme.body)),
  };
}

export function getSystemStats(system) {
  return {
    colors: Object.keys(system.colors).length,
    typeStyles: Object.keys(system.typography).length,
    components: Object.keys(system.components).length,
  };
}

function pick(source, keys, fallback) {
  for (const key of keys) {
    if (source[key] != null) {
      return String(source[key]);
    }
  }

  return fallback;
}

function pickComponent(components, names) {
  for (const name of names) {
    if (components[name]) {
      return components[name];
    }
  }

  return {};
}

function resolveTokenValue(value, system, fallback) {
  if (value == null) {
    return fallback;
  }

  return String(value).replace(/\{([^}]+)\}/g, (_, path) => {
    const [section, key] = path.split(".");
    const source = system?.[section];
    const resolved = source?.[key];

    if (resolved && typeof resolved === "object") {
      return fallback;
    }

    return resolved ?? fallback;
  });
}

function parseDesignSystem(slug, raw) {
  const frontmatter = raw.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  const parsed = parse(frontmatter) ?? {};

  return {
    slug,
    label: formatLabel(slug),
    name: parsed.name ?? `${formatLabel(slug)} design system`,
    description: parsed.description ?? "",
    colors: parsed.colors ?? {},
    typography: parsed.typography ?? {},
    rounded: parsed.rounded ?? {},
    spacing: parsed.spacing ?? {},
    components: parsed.components ?? {},
  };
}

function getSlugFromPath(path) {
  return path.match(/design-md\/([^/]+)\/DESIGN\.md$/)?.[1] ?? path;
}

function formatLabel(slug) {
  return slug
    .split(/[-.]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeFont(value, fallback) {
  return value ? `${value}, ${fallback}` : fallback;
}

const fallbackFontSans =
  '"Helvetica Neue", Helvetica, Arial, system-ui, -apple-system, sans-serif';
const fallbackFontMono =
  '"JetBrains Mono", "Fira Code", "SFMono-Regular", Consolas, monospace';
