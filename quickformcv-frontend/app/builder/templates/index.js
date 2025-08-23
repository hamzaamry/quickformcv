import { ColorCraftTemplate } from "./ColorCraftTemplate";
import { ModernTemplate } from "./ModernTemplate";
import { ProfessionalTemplate } from "./ProfessionalTemplate";
import colorCraftImage from "./assets/colorCraft.png";
import modernImage from "./assets/modern.png";
import professionalImage from "./assets/professional.png";

export const templates = {
  colorcraft: {
    name: "ColorCraft",
    component: ColorCraftTemplate,
    image: colorCraftImage.src,
    defaultLayout: [
      [
        ["profiles", "summary", "experience", "education"],
        ["skills", "certifications", "languages", "interests"],
      ],
    ],
  },
  modern: {
    name: "Modern",
    component: ModernTemplate,
    image: modernImage.src,
    defaultLayout: [
      [
        [
          "profiles",
          "summary",
          "education",
          "experience",
          "skills",
          "certifications",
        ],
      ],
    ],
  },
  professional: {
    name: "Professional",
    component: ProfessionalTemplate,
    image: professionalImage.src,
    defaultLayout: [
      [
        ["basics", "skills", "languages", "references"],
        ["summary", "experience", "education"],
      ],
    ],
  },
};

export const getTemplateByName = (name) => {
  if (!name || !templates[name]) {
    console.warn(`Template "${name}" not found, falling back to "colorcraft"`);
    return templates["colorcraft"];
  }
  return templates[name];
};
