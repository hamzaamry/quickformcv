import {
  Basics,
  Certifications,
  Education,
  Experiences,
  Languages,
  Skills,
  Socials,
  Summary,
} from "../components/sidebar/left";
import {
  PageFormat,
  PageManagement,
  Template,
  Theme,
  Typography,
} from "../components/sidebar/right";
import {
  Award,
  Briefcase,
  FileStack,
  FileText,
  Globe,
  GraduationCap,
  Languages as LanguagesIcon,
  Layout,
  Palette,
  Settings,
  Star,
  Type,
  User,
} from "lucide-react";

export const RESUME_SECTIONS = [
  { id: "basics", name: "Basics", icon: User },
  { id: "summary", name: "Summary", icon: FileText },
  { id: "experience", name: "Experience", icon: Briefcase },
  { id: "education", name: "Education", icon: GraduationCap },
  { id: "skills", name: "Skills", icon: Star },
  { id: "certifications", name: "Certifications", icon: Award },
  { id: "socials", name: "Socials", icon: Globe },
  { id: "languages", name: "Languages", icon: LanguagesIcon },
];

export const LEFT_SIDEBAR_SECTIONS = [
  { Component: Basics, showSeparator: false, icon: User, title: "Basics" },
  {
    Component: Summary,
    showSeparator: false,
    icon: FileText,
    title: "Summary",
  },
  { Component: Socials, showSeparator: false, icon: Globe, title: "Socials" },
  {
    Component: Experiences,
    showSeparator: false,
    icon: Briefcase,
    title: "Experience",
  },
  {
    Component: Education,
    showSeparator: false,
    icon: GraduationCap,
    title: "Education",
  },
  { Component: Skills, showSeparator: false, icon: Star, title: "Skills" },
  {
    Component: Certifications,
    showSeparator: false,
    icon: Award,
    title: "Certifications",
  },
  {
    Component: Languages,
    showSeparator: false,
    icon: LanguagesIcon,
    title: "Languages",
  },
];

export const RIGHT_SIDEBAR_SECTIONS = [
  {
    Component: Template,
    showSeparator: false,
    icon: Layout,
    title: "Template",
  },
  {
    Component: PageManagement,
    showSeparator: false,
    icon: FileStack,
    title: "Page Management",
  },
  {
    Component: Typography,
    showSeparator: false,
    icon: Type,
    title: "Typography",
  },
  { Component: Theme, showSeparator: false, icon: Palette, title: "Theme" },
  {
    Component: PageFormat,
    showSeparator: false,
    icon: Settings,
    title: "Page Format",
  },
];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const YEARS = (() => {
  const currentYear = new Date().getFullYear();
  const startYear = 1980;
  return Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => currentYear - i,
  );
})();

export const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Self-employed",
  "Freelance",
  "Contract",
  "Internship",
];

export const WORK_TYPES = ["On-site", "Hybrid", "Remote"];

export const SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "HTML",
  "CSS",
  "TailwindCSS",
  "Git",
  "Docker",
  "AWS",
  "MongoDB",
  "PostgreSQL",
  "Redux",
  "GraphQL",
  "REST API",
  "Vue.js",
  "Angular",
  "Express.js",
  "Firebase",
  "Webpack",
  "Jest",
].map((skill) => ({
  id: skill.toLowerCase().replace(/\s+/g, "-"),
  skill: skill,
}));

export const MAX_ALLOWED_PAGES = 2;
export const CHARATERS_LIMIT = 600;

export const ONBOARDING_STEPS = [
  {
    id: "welcome",
    title: "Welcome to QuickFormCV! 🎉",
    description: "Let's take a quick tour to help you create your perfect resume. This will only take a minute!",
    target: "body",
    position: "top",
  },
  {
    id: "left-sidebar",
    title: "Resume Content",
    description:
        "This is where you'll add all your resume information. Start with the Basics section to add your personal details.",
    target: "[data-onboarding='left-sidebar']",
    position: "right",
  },
  {
    id: "basics-section",
    title: "Personal Information",
    description: "Fill in your name, contact details, and professional headline. This forms the header of your resume.",
    target: "[data-onboarding='basics-section']",
    position: "right",
  },
  {
    id: "resume-preview",
    title: "Live Preview",
    description: "Watch your resume come to life! Every change you make will be instantly reflected here.",
    target: "[data-onboarding='resume-preview']",
    position: "left",
  },
  {
    id: "right-sidebar",
    title: "Customization Panel",
    description: "Personalize your resume's appearance with different templates, fonts, and layouts.",
    target: "[data-onboarding='right-sidebar']",
    position: "left",
  },
  {
    id: "template-selection",
    title: "Choose Your Template",
    description: "Select from professional templates that best match your industry and style preferences.",
    target: "[data-onboarding='template-selection']",
    position: "left",
  },
  {
    id: "export-button",
    title: "Export Your Resume",
    description: "Once you're happy with your resume, click here to download it as a PDF.",
    target: "[data-onboarding='export-button']",
    position: "bottom",
  },
  {
    id: "complete",
    title: "You're All Set! ✨",
    description: "You now know the basics of creating a resume. Start building your professional story!",
    target: "body",
    position: "top",
  },
]
