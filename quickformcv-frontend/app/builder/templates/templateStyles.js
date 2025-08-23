import { getFontCSS, getFontWeightCSS } from "@/app/builder/constants/fonts";

export class TemplateStyles {
  constructor(metadata) {
    const { theme, typography, page } = metadata || {};

    // Extract base values
    this.primaryColor = theme?.primary;
    this.textColor = theme?.text;
    this.backgroundColor = theme?.background;
    this.secondaryColor = "#6B7280";

    // Font configuration
    this.fontFamily = typography?.font?.family || "inter";
    this.fontSize = typography?.font?.size || 14;
    this.fontWeight = typography?.font?.variants?.[0] || "regular";
    this.lineHeight = typography?.line_height || 1.5;

    // Page configuration
    this.pageFormat = page?.format || "a4";
    this.pageMargin = page?.margin || 18;

    // Compute derived values once
    this.fontFamilyCSS = getFontCSS(this.fontFamily);
    this.fontWeightCSS = getFontWeightCSS(this.fontWeight);
  }

  // Base style building blocks
  get baseTextStyle() {
    return {
      fontSize: `${this.fontSize}px`,
      lineHeight: this.lineHeight,
      fontWeight: this.fontWeightCSS,
    };
  }

  get smallTextStyle() {
    return {
      ...this.baseTextStyle,
      fontSize: `${Math.round(this.fontSize * 0.875)}px`,
    };
  }

  get subHeadingStyle() {
    return {
      ...this.baseTextStyle,
      color: this.primaryColor,
      fontSize: `${Math.round(this.fontSize * 1.1)}px`,
    };
  }

  get sectionHeadingStyle() {
    return {
      ...this.baseTextStyle,
      color: this.primaryColor,
      borderBottomWidth: "2px",
      borderBottomColor: this.primaryColor,
      fontSize: `${Math.round(this.fontSize * 1.25)}px`,
      marginBottom: "1rem",
      paddingBottom: "0.25rem",
    };
  }

  get nameStyle() {
    return {
      ...this.baseTextStyle,
      color: this.secondaryColor,
      fontSize: `${Math.round(this.fontSize * 2.25)}px`,
    };
  }

  get headlineStyle() {
    return {
      ...this.baseTextStyle,
      fontSize: `${Math.round(this.fontSize * 1.375)}px`,
    };
  }

  get linkStyle() {
    return {
      color: this.primaryColor,
    };
  }

  get iconStyle() {
    return {
      color: this.secondaryColor,
    };
  }

  // Page layout styles
  getPageStyle(isPrintMode = false) {
    let pageStyle = {
      color: this.textColor,
      backgroundColor: this.backgroundColor,
      fontFamily: this.fontFamilyCSS,
      ...this.baseTextStyle,
      paddingLeft: `${this.pageMargin}px`,
      paddingRight: `${this.pageMargin}px`,
      paddingTop: `${this.pageMargin}px`,
      paddingBottom: `${this.pageMargin}px`,
      overflow: "hidden",
      boxSizing: "border-box",
    };

    if (this.pageFormat === "a4") {
      pageStyle = {
        ...pageStyle,
        width: "210mm",
        height: "297mm",
        minHeight: "297mm",
      };
    }

    if (isPrintMode) {
      pageStyle = {
        ...pageStyle,
        margin: 0,
        border: "none",
        boxShadow: "none",
      };
    }

    return pageStyle;
  }

  // Utility methods for common style combinations
  getBoldTextStyle() {
    return {
      ...this.baseTextStyle,
      fontWeight: "500",
    };
  }

  getColoredTextStyle(color = this.primaryColor) {
    return {
      ...this.baseTextStyle,
      color,
      fontWeight: "500",
    };
  }
}
