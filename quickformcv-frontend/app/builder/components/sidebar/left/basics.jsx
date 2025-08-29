"use client";

import { AlertCircle, ImagePlus, Loader2, X } from "lucide-react";
import { UserIcon } from "@/components/icons/userIcon";
import { BasicsSkeleton } from "@/app/builder/components/skeletons/BasicsSkeleton";
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
import { useRef, useState } from "react";
import { useResumeData } from "@/hooks/useResumeData";
import { useImageUpload } from "@/app/builder/hooks/useImageUpload";
import { useParams } from "next/navigation";
import { getCountries } from 'react-phone-number-input/input';
import { getCountryCallingCode } from 'react-phone-number-input';

const getCountryFlag = (countryCode) => {
  const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
};

const countries = getCountries();
const COUNTRY_OPTIONS = countries.map(country => {
  const callingCode = getCountryCallingCode(country);
  const flag = getCountryFlag(country);

  return {
    code: callingCode,
    country: country,
    flag: flag,
    label: `${flag} +${callingCode}`
  };
}).sort((a, b) => parseInt(a.code) - parseInt(b.code));

export default function Basics() {
  const params = useParams();
  const resumeId = params?.id;
  const { basics, updateBasics, isLoading } = useResumeData(resumeId);
  const { uploadImage, isUploading, uploadError, reset } = useImageUpload();
  const fileInputRef = useRef(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState("216");

  const selectedCountryOption = COUNTRY_OPTIONS.find(option => option.code === selectedCountryCode);

  const updatePicture = (updates) => {
    updateBasics({
      picture: {
        ...(basics.picture || {}),
        ...updates,
        effects: {
          ...(basics.picture?.effects || {}),
          ...(updates.effects || {}),
        },
      },
    });
  };

  const updateUrl = (updates) => {
    updateBasics({
      url: {
        ...(basics.url || {}),
        ...updates,
      },
    });
  };

  const handleImageClick = () => {
    reset();
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const result = await uploadImage(file);
      if (result.success) {
        updatePicture({ url: result.url });
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }

    event.target.value = "";
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    updatePicture({ url: "" });
    reset();
  };

  return (
    <Accordion type="single" defaultValue="basics" collapsible>
      <AccordionItem value="basics" className="border-none">
        <AccordionTrigger className="hover:no-underline p-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <UserIcon />
              <div className="text-primary-style font-medium text-base">
                Basics
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {isLoading ? (
            <BasicsSkeleton />
          ) : (
            <div className="px-4 pb-4 space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Picture
                </Label>
                <div className="flex justify-center">
                  <div className="relative group">
                    <div
                      className="relative cursor-pointer transition-all duration-200 hover:scale-105"
                      onClick={handleImageClick}
                    >
                      <div className="flex h-24 w-24 items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 group-hover:border-blue-400 transition-colors overflow-hidden">
                        {isUploading ? (
                          <div className="flex flex-col items-center gap-1">
                            <Loader2
                              className="text-blue-500 animate-spin"
                              size={20}
                            />
                            <span className="text-xs text-gray-500">
                              Uploading...
                            </span>
                          </div>
                        ) : basics.picture?.url ? (
                          <img
                            src={basics.picture.url}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <ImagePlus
                              className="text-gray-400 group-hover:text-blue-500 transition-colors"
                              size={20}
                            />
                            <span className="text-xs text-gray-500">
                              Upload
                            </span>
                          </div>
                        )}
                      </div>
                      {basics.picture?.url && !isUploading && (
                        <button
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        >
                          <X size={12} />
                        </button>
                      )}

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </div>

                    {uploadError ? (
                      <div className="flex items-center gap-1 text-xs text-red-500 text-center mt-2">
                        <AlertCircle size={12} />
                        <span>{uploadError.message || "Upload failed"}</span>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 text-center mt-2">
                        {isUploading
                          ? "Uploading image..."
                          : "Click to upload image"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="firstName"
                  >
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    className="h-10 bg-white border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                    value={basics.firstName ?? ""}
                    onChange={(e) =>
                      updateBasics({ firstName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="lastName"
                  >
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    className="h-10 bg-white border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                    value={basics.lastName ?? ""}
                    onChange={(e) => updateBasics({ lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="headline"
                >
                  Professional Headline
                </Label>
                <Input
                  id="headline"
                  placeholder="Senior UX UI Designer"
                  className="h-10 bg-white border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                  value={basics.headline ?? ""}
                  onChange={(e) => updateBasics({ headline: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="email"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="johndoe@gmail.com"
                    className="h-10 bg-white border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                    value={basics.email ?? ""}
                    onChange={(e) => updateBasics({ email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="website"
                  >
                    Website
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://example.com"
                    className="h-10 bg-white border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                    value={basics.url?.href ?? ""}
                    onChange={(e) =>
                      updateUrl({
                        href: e.target.value,
                        label: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Phone and Location - Fixed Layout */}
              <div className="space-y-4">
                {/* Phone Number - Full Width for Better Layout */}
                <div className="space-y-2">
                  <Label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="phone"
                  >
                    Phone number
                  </Label>
                  <div className="flex gap-3">
                    <Select
                        value={selectedCountryCode}
                        onValueChange={setSelectedCountryCode}
                    >
                      <SelectTrigger className="w-[140px] h-10 bg-white border-gray-200">
                        <SelectValue>
                          {selectedCountryOption ? selectedCountryOption.label : "Select..."}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {COUNTRY_OPTIONS.map((option) => (
                            <SelectItem key={`${option.country}-${option.code}`} value={option.code}>
                              {option.label}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="your phone number"
                      className="flex-1 h-10 bg-white border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                      value={basics.phone ?? ""}
                      onChange={(e) => updateBasics({ phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="location"
                  >
                    Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="City, Country"
                    className="h-10 bg-white border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                    value={basics.location ?? ""}
                    onChange={(e) => updateBasics({ location: e.target.value })}
                  />
                </div>
              </div>
            </div>
        )}
      </AccordionContent>
    </AccordionItem>
  </Accordion>
  );
}
