import { useEffect, useRef, useState } from "react";
import { Input, Label } from "@/components/ui";
import { Check, Copy, Palette, RefreshCw } from "lucide-react";

export const ColorPicker = ({ color, onChange, label, placeholder }) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const pickerRef = useRef(null);

  // Predefined color palette
  const colorPalette = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
    "#F8C471",
    "#82E0AA",
    "#F1948A",
    "#85C1E9",
    "#D7BDE2",
    "#3498DB",
    "#E74C3C",
    "#2ECC71",
    "#F39C12",
    "#9B59B6",
    "#1ABC9C",
    "#34495E",
    "#E67E22",
    "#E91E63",
    "#00BCD4",
  ];

  const isValidHex = (hex) => {
    return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
  };

  // Convert hex to HSL for advanced controls
  const hexToHsl = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  // Convert HSL to hex
  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  // Update HSL when color changes
  useEffect(() => {
    if (isValidHex(color)) {
      const [h, s, l] = hexToHsl(color);
      setHue(h);
      setSaturation(s);
      setLightness(l);
    }
  }, [color]);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTextChange = (e) => {
    const value = e.target.value;
    const formattedValue = value.startsWith("#") ? value : `#${value}`;
    onChange(formattedValue);
  };

  const handleColorPickerChange = (e) => {
    onChange(e.target.value);
  };

  const handleHslChange = (type, value) => {
    let newH = hue,
      newS = saturation,
      newL = lightness;

    switch (type) {
      case "hue":
        newH = value;
        break;
      case "saturation":
        newS = value;
        break;
      case "lightness":
        newL = value;
        break;
    }

    setHue(newH);
    setSaturation(newS);
    setLightness(newL);
    onChange(hslToHex(newH, newS, newL));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateRandomColor = () => {
    const randomColor =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");
    onChange(randomColor);
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {label}
      </Label>

      <div className="flex items-center gap-3">
        {/* Enhanced Color Preview */}
        <div className="relative" ref={pickerRef}>
          <div
            className="w-12 h-12 rounded-xl border-2 border-gray-200 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 relative overflow-hidden group"
            style={{ backgroundColor: isValidHex(color) ? color : "#000000" }}
            onClick={() => setIsPickerOpen(!isPickerOpen)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <div className="absolute bottom-1 right-1 w-2 h-2 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>

          {/* Enhanced Color Picker Modal - Fixed positioning within sidebar */}
          {isPickerOpen && (
            <div
              className="fixed z-50 bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 w-80 animate-in fade-in-0 zoom-in-95 duration-200 max-h-[80vh] overflow-y-auto"
              style={{
                top: "50%",
                right: "1rem",
                transform: "translateY(-50%)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Color Picker
                </h3>
                <button
                  onClick={generateRandomColor}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  title="Random Color"
                >
                  <RefreshCw className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Main Color Picker */}
              <div className="mb-4">
                <input
                  type="color"
                  value={isValidHex(color) ? color : "#000000"}
                  onChange={handleColorPickerChange}
                  className="w-full h-24 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-colors duration-200"
                />
              </div>

              {/* HSL Controls */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Hue
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={hue}
                    onChange={(e) => handleHslChange("hue", e.target.value)}
                    className="w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 to-red-500 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, 
                          hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), 
                          hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), 
                          hsl(360, 100%, 50%))`,
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Saturation
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={saturation}
                    onChange={(e) =>
                      handleHslChange("saturation", e.target.value)
                    }
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, 
                          hsl(${hue}, 0%, ${lightness}%), 
                          hsl(${hue}, 100%, ${lightness}%))`,
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Lightness
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={lightness}
                    onChange={(e) =>
                      handleHslChange("lightness", e.target.value)
                    }
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, 
                          hsl(${hue}, ${saturation}%, 0%), 
                          hsl(${hue}, ${saturation}%, 50%), 
                          hsl(${hue}, ${saturation}%, 100%))`,
                    }}
                  />
                </div>
              </div>

              {/* Color Palette */}
              <div className="mb-4">
                <label className="text-xs font-medium text-gray-600 mb-2 block">
                  Quick Colors
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {colorPalette.map((paletteColor, index) => (
                    <button
                      key={index}
                      className="w-8 h-8 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-all duration-200 hover:scale-110 cursor-pointer"
                      style={{ backgroundColor: paletteColor }}
                      onClick={() => onChange(paletteColor)}
                      title={paletteColor}
                    />
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500 font-mono">
                  {color.toUpperCase()}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  >
                    {copied ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={() => setIsPickerOpen(false)}
                    className="px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Text Input */}
        <div className="flex-1 relative">
          <Input
            type="text"
            value={color}
            onChange={handleTextChange}
            className={`h-12 pl-4 pr-12 text-sm font-mono transition-all duration-200 ${
              !isValidHex(color)
                ? "border-red-300 focus:border-red-500 bg-red-50"
                : "border-gray-300 focus:border-blue-500 hover:border-gray-400"
            }`}
            placeholder={placeholder}
          />
          <button
            onClick={copyToClipboard}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors duration-200"
            title="Copy color code"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Enhanced Error Message */}
      {!isValidHex(color) && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          Please enter a valid hex color (e.g., #FF0000)
        </div>
      )}
    </div>
  );
};
