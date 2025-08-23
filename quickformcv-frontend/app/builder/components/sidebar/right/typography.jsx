"use client";

import { Type } from "lucide-react";
import { useParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { useResumeData } from "@/hooks/useResumeData";
import {
  FONT_FAMILIES,
  FONT_WEIGHTS,
  getFontFamily,
  getFontWeight,
} from "@/app/builder/constants/fonts";

export default function Typography() {
  const params = useParams();
  const resumeId = params?.id;
  const { typography, updateTypography } = useResumeData(resumeId);

  const fontFamily = typography?.font?.family || "inter";
  const fontWeight = typography?.font?.variants?.[0] || "regular";
  const fontSize = (typography?.font?.size || 14).toString();
  const lineHeight = (typography?.line_height || 1.5).toString();

  const currentFont = getFontFamily(typography?.font?.family);
  const currentWeight = getFontWeight(fontWeight);

  const handleFontFamilyChange = (value) => {
    updateTypography({
      font: {
        ...typography?.font,
        family: value,
      },
    });
  };

  const handleFontWeightChange = (value) => {
    updateTypography({
      font: {
        ...typography?.font,
        variants: [value],
      },
    });
  };

  const handleFontSizeChange = (value) => {
    updateTypography({
      font: {
        ...typography?.font,
        size: parseInt(value, 10),
      },
    });
  };

  const handleLineHeightChange = (e) => {
    updateTypography({
      line_height: parseFloat(e.target.value),
    });
  };

  const fontCategories = {
    "Sans Serif": Object.values(FONT_FAMILIES).filter(
      (font) => font.category === "sans-serif",
    ),
    Serif: Object.values(FONT_FAMILIES).filter(
      (font) => font.category === "serif",
    ),
    Monospace: Object.values(FONT_FAMILIES).filter(
      (font) => font.category === "monospace",
    ),
    System: Object.values(FONT_FAMILIES).filter(
      (font) => font.category === "system",
    ),
  };

  return (
    <Accordion type="single" defaultValue="typography" collapsible>
      <AccordionItem value="typography" className="border-none">
        <AccordionTrigger className="hover:no-underline p-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <Type className="h-4 w-4" />
              <div className="text-primary-style font-medium text-base">
                Typography
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="px-4 pb-4 space-y-4">
            <div className="space-y-2">
              <Label className="label">Font family</Label>
              <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
                <SelectTrigger className="h-[2.5rem]">
                  <SelectValue placeholder="Select font">
                    <span style={{ fontFamily: currentFont.css }}>
                      {currentFont.name}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  {Object.entries(fontCategories).map(
                    ([category, fonts]) =>
                      fonts.length > 0 && (
                        <div key={category}>
                          <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase sticky top-0 bg-white z-10">
                            {category}
                          </div>
                          {fonts.map((font) => (
                            <SelectItem
                              key={font.value}
                              value={font.value}
                              className="cursor-pointer"
                            >
                              <span style={{ fontFamily: font.css }}>
                                {font.name}
                              </span>
                            </SelectItem>
                          ))}
                        </div>
                      ),
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="label">Font weight</Label>
                <Select
                  value={fontWeight}
                  onValueChange={handleFontWeightChange}
                >
                  <SelectTrigger className="h-[2.5rem]">
                    <SelectValue placeholder="Select weight">
                      <span
                        style={{
                          fontFamily: currentFont.css,
                          fontWeight: currentWeight.css,
                        }}
                      >
                        {currentWeight.name}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {Object.values(FONT_WEIGHTS).map((weight) => (
                      <SelectItem
                        key={weight.value}
                        value={weight.value}
                        className="cursor-pointer"
                      >
                        <span
                          style={{
                            fontFamily: currentFont.css,
                            fontWeight: weight.css,
                          }}
                        >
                          {weight.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="label">Font Size</Label>
                <Select value={fontSize} onValueChange={handleFontSizeChange}>
                  <SelectTrigger className="h-[2.5rem]">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    <SelectItem value="10">10px</SelectItem>
                    <SelectItem value="11">11px</SelectItem>
                    <SelectItem value="12">12px</SelectItem>
                    <SelectItem value="13">13px</SelectItem>
                    <SelectItem value="14">14px</SelectItem>
                    <SelectItem value="15">15px</SelectItem>
                    <SelectItem value="16">16px</SelectItem>
                    <SelectItem value="17">17px</SelectItem>
                    <SelectItem value="18">18px</SelectItem>
                    <SelectItem value="20">20px</SelectItem>
                    <SelectItem value="22">22px</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="label">Line height</Label>
              <Input
                type="number"
                value={lineHeight}
                onChange={handleLineHeightChange}
                className="h-[2.5rem]"
                min="1"
                max="3"
                step="0.1"
                placeholder="1.5"
              />
            </div>

            {/* Font Preview */}
            <div className="space-y-2">
              <Label className="label">Preview</Label>
              <div
                className="p-3 border rounded-md bg-gray-50"
                style={{
                  fontFamily: currentFont.css,
                  fontWeight: currentWeight.css,
                  fontSize: `${fontSize}px`,
                  lineHeight: lineHeight,
                }}
              >
                <p>The quick brown fox jumps over the lazy dog.</p>
                <p className="text-sm text-gray-600 mt-1">
                  AaBbCcDd 1234567890
                </p>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
