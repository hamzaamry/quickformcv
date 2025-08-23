"use client";

import { useEffect } from "react";
import { getFontFamily } from "@/app/builder/constants/fonts";

export const FontLoader = ({ fontFamily }) => {
  useEffect(() => {
    const font = getFontFamily(fontFamily);

    if (font?.import) {
      // Check if font is already loaded
      const existingLink = document.querySelector(
        `link[href="${font.import}"]`,
      );

      if (!existingLink) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = font.import;
        link.crossOrigin = "anonymous";

        link.onerror = () => {
          console.warn(`Failed to load font: ${font.name}`);
        };

        document.head.appendChild(link);

        // Cleanup function
        return () => {
          const linkToRemove = document.querySelector(
            `link[href="${font.import}"]`,
          );
          if (linkToRemove) {
            document.head.removeChild(linkToRemove);
          }
        };
      }
    }
  }, [fontFamily]);

  return null;
};
