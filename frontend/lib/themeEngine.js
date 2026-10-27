/**
 * FitConnect Canonical Theme Engine (design.md Section 9)
 * Computes derived brand tokens using WCAG 2.1 relative luminance and contrast ratios.
 */

// Converts hex to { r, g, b } (0-255)
export function hexToRgb(hex) {
  if (!hex || typeof hex !== 'string') return null;
  let cleanHex = hex.trim().replace(/^#/, '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  if (!/^[0-9a-fA-F]{6}$/.test(cleanHex)) return null;
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// Converts { r, g, b } to hex "#RRGGBB"
export function rgbToHex({ r, g, b }) {
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (v) => clamp(v).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Converts { r, g, b } to RGB space-separated triplet string: "30 63 32"
export function rgbToTriplet({ r, g, b }) {
  return `${Math.round(r)} ${Math.round(g)} ${Math.round(b)}`;
}

// Calculates linearized sRGB relative luminance per WCAG 2.1
export function getRelativeLuminance({ r, g, b }) {
  const linearize = (val) => {
    const c = val / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const rLin = linearize(r);
  const gLin = linearize(g);
  const bLin = linearize(b);
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

// Calculates contrast ratio between two colors (>= 1.0 to 21.0)
export function getContrastRatio(rgb1, rgb2) {
  const l1 = getRelativeLuminance(rgb1);
  const l2 = getRelativeLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Converts RGB to HSL
export function rgbToHsl({ r, g, b }) {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

// Converts HSL to RGB
export function hslToRgb({ h, s, l }) {
  const hNorm = (h % 360) / 360;
  const sNorm = Math.max(0, Math.min(100, s)) / 100;
  const lNorm = Math.max(0, Math.min(100, l)) / 100;

  if (sNorm === 0) {
    const val = Math.round(lNorm * 255);
    return { r: val, g: val, b: val };
  }

  const hue2rgb = (p, q, t) => {
    let tAdj = t;
    if (tAdj < 0) tAdj += 1;
    if (tAdj > 1) tAdj -= 1;
    if (tAdj < 1 / 6) return p + (q - p) * 6 * tAdj;
    if (tAdj < 1 / 2) return q;
    if (tAdj < 2 / 3) return p + (q - p) * (2 / 3 - tAdj) * 6;
    return p;
  };

  const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
  const p = 2 * lNorm - q;

  return {
    r: Math.round(hue2rgb(p, q, hNorm + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hNorm) * 255),
    b: Math.round(hue2rgb(p, q, hNorm - 1 / 3) * 255),
  };
}

// Mixes color A with color B (e.g. 92% surface + 8% primary)
export function mixColors(colorA, colorB, weightA = 0.92) {
  const weightB = 1 - weightA;
  return {
    r: Math.round(colorA.r * weightA + colorB.r * weightB),
    g: Math.round(colorA.g * weightA + colorB.g * weightB),
    b: Math.round(colorA.b * weightA + colorB.b * weightB),
  };
}

// Validates whether a hex seed is acceptable per Section 9 Rule 8
export function validateThemeSeed(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return { valid: false, message: "Invalid hex color format" };
  }
  const lum = getRelativeLuminance(rgb);
  const hsl = rgbToHsl(rgb);

  if (lum > 0.85) {
    return { valid: false, message: "Choose a color with more contrast (too light)" };
  }
  if (lum < 0.02) {
    return { valid: false, message: "Choose a color with more contrast (too dark)" };
  }
  if (hsl.s < 8) {
    return { valid: false, message: "Choose a color with more saturation (nearly grey)" };
  }
  return { valid: true, rgb };
}

// Default Pine Brand
export const DEFAULT_BRAND_HEX = "#1E3F20";

/**
 * Derives complete brand tokens from a hex seed color for light or dark mode.
 */
export function deriveBrandTokens(seedHex = DEFAULT_BRAND_HEX, isDark = false) {
  const validation = validateThemeSeed(seedHex);
  const primaryRgb = validation.valid ? validation.rgb : hexToRgb(DEFAULT_BRAND_HEX);

  const surfaceRgb = isDark ? { r: 24, g: 26, b: 24 } : { r: 255, g: 255, b: 255 };
  const darkTextRgb = { r: 26, g: 27, b: 25 }; // #1A1B19
  const whiteRgb = { r: 255, g: 255, b: 255 };

  // Rule 2: on-primary
  const whiteContrast = getContrastRatio(whiteRgb, primaryRgb);
  const darkContrast = getContrastRatio(darkTextRgb, primaryRgb);
  const onPrimaryRgb = whiteContrast >= darkContrast ? whiteRgb : darkTextRgb;

  // Rule 4: primary-hover (-10% lightness in light, +8% in dark)
  const primaryHsl = rgbToHsl(primaryRgb);
  const hoverHsl = {
    ...primaryHsl,
    l: isDark ? Math.min(100, primaryHsl.l + 8) : Math.max(0, primaryHsl.l - 10),
  };
  const primaryHoverRgb = hslToRgb(hoverHsl);

  // Rule 5: primary-soft (92% surface + 8% primary)
  const primarySoftRgb = mixColors(surfaceRgb, primaryRgb, 0.92);

  // Rule 3: primary-ink (text & focus ring, must reach >= 4.5:1 against surface and primary-soft)
  let inkHsl = { ...primaryHsl };
  let primaryInkRgb = hslToRgb(inkHsl);
  let attempts = 0;

  if (!isDark) {
    while (
      attempts < 45 &&
      (getContrastRatio(primaryInkRgb, surfaceRgb) < 4.5 ||
        getContrastRatio(primaryInkRgb, primarySoftRgb) < 4.5)
    ) {
      inkHsl.l = Math.max(0, inkHsl.l - 2);
      primaryInkRgb = hslToRgb(inkHsl);
      attempts++;
    }
  } else {
    while (
      attempts < 45 &&
      getContrastRatio(primaryInkRgb, surfaceRgb) < 4.5
    ) {
      inkHsl.l = Math.min(100, inkHsl.l + 2);
      primaryInkRgb = hslToRgb(inkHsl);
      attempts++;
    }
  }

  // Rule 6: Fill visibility border
  const fillContrast = getContrastRatio(primaryRgb, surfaceRgb);
  const needsFillBorder = fillContrast < 3.0;

  return {
    primary: primaryRgb,
    primaryHover: primaryHoverRgb,
    primarySoft: primarySoftRgb,
    primaryInk: primaryInkRgb,
    onPrimary: onPrimaryRgb,
    needsFillBorder,
    contrastRatio: Math.max(whiteContrast, darkContrast).toFixed(1),
    isWhiteText: onPrimaryRgb === whiteRgb,
  };
}

/**
 * Applies derived tokens directly to documentElement CSS custom variables.
 */
export function applyGymTheme(themeColor, isDark = false) {
  if (typeof document === 'undefined') return;
  const seed = themeColor || DEFAULT_BRAND_HEX;
  const tokens = deriveBrandTokens(seed, isDark);

  const root = document.documentElement;
  root.style.setProperty('--primary', rgbToTriplet(tokens.primary));
  root.style.setProperty('--primary-hover', rgbToTriplet(tokens.primaryHover));
  root.style.setProperty('--primary-soft', rgbToTriplet(tokens.primarySoft));
  root.style.setProperty('--primary-ink', rgbToTriplet(tokens.primaryInk));
  root.style.setProperty('--on-primary', rgbToTriplet(tokens.onPrimary));
  root.style.setProperty(
    '--fill-border',
    tokens.needsFillBorder ? `1px solid rgb(${rgbToTriplet(tokens.primaryInk)})` : 'none'
  );
}
