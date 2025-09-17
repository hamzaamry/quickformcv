import { Github, Globe, Linkedin, Mail, Phone, Twitter } from "lucide-react";
import { getFontCSS, getFontWeightCSS } from "@/app/builder/constants/fonts";

export const createDateString = (month, year) => {
  if (!month || !year) return null;
  return `${month} 1, ${year}`;
};

export const formatDate = (dateInput) => {
  if (!dateInput) return "Present";

  let dateString;

  if (typeof dateInput === "object" && dateInput.month && dateInput.year) {
    dateString = createDateString(dateInput.month, dateInput.year);
  } else if (typeof dateInput === "string") {
    dateString = dateInput;
  }

  if (!dateString) return "Present";

  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) return "Present";

    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch (error) {
    return "Present";
  }
};

export const formatDateRange = (item) => {
  const startDate = formatDate(
    createDateString(item.startMonth, item.startYear),
  );

  // If currently working/studying, show "Present"
  if (item.currentlyWorking || item.currentlyStudying) {
    return `${startDate} - Present`;
  }

  const endDate = formatDate(createDateString(item.endMonth, item.endYear));
  return `${startDate} - ${endDate}`;
};

// Get social icon based on network name
export const getSocialIcon = (network) => {
  network = network?.toLowerCase() || "";
  if (network.includes("linkedin")) return <Linkedin size={16} />;
  if (network.includes("github")) return <Github size={16} />;
  if (network.includes("twitter")) return <Twitter size={16} />;
  if (network.includes("mail") || network.includes("email"))
    return <Mail size={16} />;
  if (network.includes("phone")) return <Phone size={16} />;
  if (network.includes("web") || network.includes("site"))
    return <Globe size={16} />;
  return <Globe size={16} />;
};

// Get section data from sections array
export const getSectionData = (sections, sectionType) => {
  const section = sections?.find((s) => s.section_type === sectionType);
  return section?.section_data || {};
};

// Helper to get all common section data at once
export const getAllSectionData = (sections) => {
  return {
    summaryContent: getSectionData(sections, "summary").content || "",
    experienceItems: getSectionData(sections, "experiences").items || [],
    educationItems: getSectionData(sections, "education").items || [],
    skillItems: getSectionData(sections, "skills").items || [],
    certificationItems: getSectionData(sections, "certifications").items || [],
    socialItems: getSectionData(sections, "socials").items || [],
    languageItems: getSectionData(sections, "languages").items || [],
  };
};

export const createSectionVisibilityChecker = (isPrintMode, activePage) => {
  return (sectionId) => {
    if (activePage) {
      return activePage.sections.includes(sectionId);
    }
    if (isPrintMode) return true;
    return true;
  };
};

// Font handling utilities
export const getTypographyStyles = (typography) => {
  const fontFamily = typography?.font?.family || "inter";
  const fontWeight = typography?.font?.variants?.[0] || "regular";
  const fontSize = typography?.font?.size || 14;
  const lineHeight = typography?.line_height || 1.5;

  return {
    fontFamily: getFontCSS(fontFamily),
    fontWeight: getFontWeightCSS(fontWeight),
    fontSize: `${fontSize}px`,
    lineHeight: lineHeight,
  };
};

export const parseLocation = (location) => {
  if (typeof location === "string") {
    const parts = location.split(",").map((part) => part.trim());
    return {
      city: parts[0] || "",
      region: parts[1] || "",
    };
  }
  return location || {};
};

export const filterVisibleItems = (items) => {
  return items?.filter(item => !item.hidden) || [];
};
