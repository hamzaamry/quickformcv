"use client";

import { Palette } from "lucide-react";
import { useParams } from "next/navigation";
import { ColorPicker } from "@/app/builder/components/sidebar/right/ColorPicker";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui";
import { useResumeData } from "@/hooks/useResumeData";

export default function Theme() {
  const params = useParams();
  const resumeId = params?.id;
  const { theme, updateTheme } = useResumeData(resumeId);

  const primaryColor = theme?.primary || "#3E6AF2";
  const textColor = theme?.text || "#000000";
  const backgroundColor = theme?.background || "#FFFFFF";

  const handlePrimaryColorChange = (color) => {
    updateTheme({ primary: color });
  };

  const handleTextColorChange = (color) => {
    updateTheme({ text: color });
  };

  const handleBackgroundColorChange = (color) => {
    updateTheme({ background: color });
  };

  return (
    <Accordion type="single" defaultValue="theme" collapsible>
      <AccordionItem value="theme" className="border-none">
        <AccordionTrigger className="hover:no-underline p-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <Palette className="h-4 w-4" />
              <div className="text-primary-style font-medium text-base">
                Theme
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="px-4 pb-4 space-y-4">
            <div className="space-y-4">
              <ColorPicker
                color={primaryColor}
                onChange={handlePrimaryColorChange}
                label="Primary Color"
                placeholder="Enter hex color (e.g., #3E6AF2)"
              />

              <ColorPicker
                color={textColor}
                onChange={handleTextColorChange}
                label="Text Color"
                placeholder="Enter hex color (e.g., #000000)"
              />

              <ColorPicker
                color={backgroundColor}
                onChange={handleBackgroundColorChange}
                label="Background Color"
                placeholder="Enter hex color (e.g., #FFFFFF)"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px bg-gradient-to-r from-gray-300 to-transparent flex-1" />
                <Label className="text-sm font-semibold text-gray-700 bg-gray-50 px-3 py-1 rounded-full">
                  Live Preview
                </Label>
                <div className="h-px bg-gradient-to-l from-gray-300 to-transparent flex-1" />
              </div>

              <div
                className="p-6 rounded-2xl border-2 shadow-lg transition-all duration-300 hover:shadow-xl relative overflow-hidden"
                style={{
                  backgroundColor: backgroundColor,
                  color: textColor,
                  borderColor: primaryColor,
                }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
                <div
                  className="text-xl font-bold mb-3 relative z-10"
                  style={{ color: primaryColor }}
                >
                  John Doe
                </div>
                <div className="text-sm opacity-80 mb-2 relative z-10">
                  Senior Software Engineer
                </div>
                <div className="text-xs opacity-60 relative z-10">
                  This is how your resume colors will look with the selected
                  theme
                </div>
                <div className="mt-4 flex gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <div
                    className="w-3 h-3 rounded-full opacity-60"
                    style={{ backgroundColor: textColor }}
                  />
                  <div
                    className="w-3 h-3 rounded-full opacity-30"
                    style={{
                      backgroundColor: backgroundColor,
                      border: `1px solid ${textColor}`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
