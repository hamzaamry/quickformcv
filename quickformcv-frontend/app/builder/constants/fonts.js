export const FONT_FAMILIES = {
  // Sans-serif fonts
  inter: {
    name: "Inter",
    value: "inter",
    category: "sans-serif",
    css: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
    import:
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
  },
  roboto: {
    name: "Roboto",
    value: "roboto",
    category: "sans-serif",
    css: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    import:
      "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap",
  },
  "open-sans": {
    name: "Open Sans",
    value: "open-sans",
    category: "sans-serif",
    css: "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    import:
      "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap",
  },
  lato: {
    name: "Lato",
    value: "lato",
    category: "sans-serif",
    css: "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    import:
      "https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap",
  },
  poppins: {
    name: "Poppins",
    value: "poppins",
    category: "sans-serif",
    css: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    import:
      "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
  },

  // Serif fonts
  "ibm-plex-serif": {
    name: "IBM Plex Serif",
    value: "ibm-plex-serif",
    category: "serif",
    css: "'IBM Plex Serif', 'Times New Roman', Times, serif",
    import:
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@300;400;500;600;700&display=swap",
  },
  "playfair-display": {
    name: "Playfair Display",
    value: "playfair-display",
    category: "serif",
    css: "'Playfair Display', 'Times New Roman', Times, serif",
    import:
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap",
  },
  merriweather: {
    name: "Merriweather",
    value: "merriweather",
    category: "serif",
    css: "'Merriweather', 'Times New Roman', Times, serif",
    import:
      "https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap",
  },

  // Monospace fonts
  "jetbrains-mono": {
    name: "JetBrains Mono",
    value: "jetbrains-mono",
    category: "monospace",
    css: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace",
    import:
      "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap",
  },
  "source-code-pro": {
    name: "Source Code Pro",
    value: "source-code-pro",
    category: "monospace",
    css: "'Source Code Pro', 'Fira Code', 'Consolas', 'Monaco', monospace",
    import:
      "https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@300;400;500;600;700&display=swap",
  },

  // System fonts
  arial: {
    name: "Arial",
    value: "arial",
    category: "system",
    css: "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    import: null, // System font, no import needed
  },
  "times-new-roman": {
    name: "Times New Roman",
    value: "times-new-roman",
    category: "system",
    css: "'Times New Roman', Times, serif",
    import: null,
  },
};

// Font weight mappings
export const FONT_WEIGHTS = {
  light: { name: "Light", value: "light", css: "300" },
  regular: { name: "Regular", value: "regular", css: "400" },
  medium: { name: "Medium", value: "medium", css: "500" },
  semibold: { name: "Semi Bold", value: "semibold", css: "600" },
  bold: { name: "Bold", value: "bold", css: "700" },
};

// Helper functions
export const getFontFamily = (fontValue) => {
  return FONT_FAMILIES[fontValue] || FONT_FAMILIES.inter;
};

export const getFontWeight = (weightValue) => {
  return FONT_WEIGHTS[weightValue] || FONT_WEIGHTS.regular;
};

export const getFontCSS = (fontValue) => {
  const font = getFontFamily(fontValue);
  return font.css;
};

export const getFontWeightCSS = (weightValue) => {
  const weight = getFontWeight(weightValue);
  return weight.css;
};
