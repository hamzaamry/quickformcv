"use client";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import {
  createDateString,
  createSectionVisibilityChecker,
  formatDate,
  formatDateRange,
  getAllSectionData,
  getSocialIcon,
  parseLocation,
} from "@/app/builder/utils/TemplateUtils";
import { FontLoader } from "@/app/builder/components/FontLoader";
import { TemplateStyles } from "./templateStyles";

export const ModernTemplate = ({
  resumeData,
  isPrintMode = false,
  activePage = null,
}) => {
  const { metadata, basics, sections } = resumeData || {};
  const {
    summaryContent,
    experienceItems,
    educationItems,
    skillItems,
    certificationItems,
    socialItems,
    languageItems,
  } = getAllSectionData(sections);

  const shouldShowSection = createSectionVisibilityChecker(
    isPrintMode,
    activePage,
  );

  const styles = new TemplateStyles(metadata);
  const locationData = parseLocation(basics?.location);

  return (
    <>
      <FontLoader fontFamily={styles.fontFamily} />
      <div
        className="mx-auto resume-page"
        style={styles.getPageStyle(isPrintMode)}
      >
        {/* Header Section */}
        {shouldShowSection("basics") && (
          <HeaderSection
            basics={basics}
            locationData={locationData}
            socialItems={socialItems}
            shouldShowSection={shouldShowSection}
            styles={styles}
          />
        )}

        {/* About Me / Summary Section */}
        {shouldShowSection("summary") && summaryContent && (
          <AboutMeSection content={summaryContent} styles={styles} />
        )}

        {/* Education Section */}
        {shouldShowSection("education") && educationItems?.length > 0 && (
          <EducationSection items={educationItems} styles={styles} />
        )}

        {/* Work Experience Section */}
        {shouldShowSection("experience") && experienceItems?.length > 0 && (
          <WorkExperienceSection items={experienceItems} styles={styles} />
        )}

        {/* Skills Section */}
        {shouldShowSection("skills") && skillItems?.length > 0 && (
          <SkillsSection items={skillItems} styles={styles} />
        )}

        {/* Languages Section */}
        {shouldShowSection("languages") && languageItems?.length > 0 && (
          <LanguagesSection items={languageItems} styles={styles} />
        )}

        {/* Certifications Section */}
        {shouldShowSection("certifications") &&
          certificationItems?.length > 0 && (
            <CertificationsSection items={certificationItems} styles={styles} />
          )}
      </div>
    </>
  );
};

const HeaderSection = ({
  basics,
  locationData,
  socialItems,
  shouldShowSection,
  styles,
}) => {
  const hasImage = basics?.picture?.url && !basics?.picture?.effects?.hidden;
  return (
    <header className="flex items-start gap-6 mb-8">
      {/* Profile Photo - Only show if image exists */}
      {hasImage && (
        <div className="flex-shrink-0">
          <img
            src={basics.picture.url}
            alt={`${basics?.firstName} ${basics?.lastName}`}
            className="object-cover border-2"
            style={{
              width: `${150}px`,
              height: `${150}px`,
              borderRadius: "50%",
              borderColor: basics.picture.effects?.border
                ? styles.primaryColor
                : "transparent",
              filter: basics.picture.effects?.grayscale
                ? "grayscale(100%)"
                : "none",
              aspectRatio: basics.picture.aspect_ratio || 1,
            }}
          />
        </div>
      )}
      {/* Name and Contact Info */}
      <div className={hasImage ? "flex-1" : "flex-1 ml-0"}>
        <h1 className="mb-1" style={styles.nameStyle}>
          {basics?.firstName} {basics?.lastName}
        </h1>
        <p className="mb-3" style={styles.headlineStyle}>
          {basics?.headline}
        </p>
        <ContactInfo
          basics={basics}
          locationData={locationData}
          styles={styles}
        />
        {shouldShowSection("socials") && socialItems?.length > 0 && (
          <SocialLinks items={socialItems} styles={styles} />
        )}
      </div>
    </header>
  );
};

const ContactInfo = ({ basics, locationData, styles }) => (
  <div className="flex flex-wrap gap-4 mb-2" style={styles.smallTextStyle}>
    {basics?.phone && (
      <ContactItem
        icon={<Phone size={14} />}
        text={basics.phone}
        styles={styles}
      />
    )}
    {basics?.email && (
      <ContactItem
        icon={<Mail size={14} />}
        text={basics.email}
        styles={styles}
      />
    )}
    {locationData.city && (
      <ContactItem
        icon={<MapPin size={14} />}
        text={`${locationData.city}${locationData.region ? `, ${locationData.region}` : ""}`}
        styles={styles}
      />
    )}
    {basics?.url?.href && (
      <div className="flex items-center gap-1">
        <Globe size={14} style={styles.iconStyle} />
        <a
          href={basics?.url?.href || basics?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          style={styles.linkStyle}
        >
          {typeof basics?.url === "string"
            ? basics?.url
            : basics?.url?.label || basics?.url?.href}
        </a>
      </div>
    )}
  </div>
);

const ContactItem = ({ icon, text, styles }) => (
  <div className="flex items-center gap-1">
    <span style={styles.iconStyle}>{icon}</span>
    <span>{text}</span>
  </div>
);

const SocialLinks = ({ items, styles }) => (
  <div className="flex flex-wrap gap-4 mt-2" style={styles.smallTextStyle}>
    {items.map((social, index) => (
      <div key={index} className="flex items-center gap-1">
        <span style={styles.iconStyle}>{getSocialIcon(social.network)}</span>
        <a
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.linkStyle}
          className="underline"
        >
          {social.network || social.title || "Profile"}
        </a>
      </div>
    ))}
  </div>
);

const AboutMeSection = ({ content, styles }) => (
  <section className="mb-8">
    <div
      className="mb-4 text-center font-bold tracking-wider py-2 px-4"
      style={{
        backgroundColor: styles.primaryColor,
        color: styles.textColor,
        fontSize: `${Math.round(styles.fontSize * 1.1)}px`,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}
    >
      ABOUT ME
    </div>
    {/* Use dangerouslySetInnerHTML to render rich text content */}
    <div
      style={styles.baseTextStyle}
      dangerouslySetInnerHTML={{ __html: content }}
      className="prose prose-sm max-w-none text-justify leading-relaxed [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6 [&>li]:mb-1 [&>p]:mb-2 [&>*:last-child]:mb-0"
    />
  </section>
);

const EducationSection = ({ items, styles }) => (
  <section className="mb-8">
    <div
      className="mb-4 text-center font-bold tracking-wider py-2 px-4"
      style={{
        backgroundColor: styles.primaryColor,
        color: styles.textColor,
        fontSize: `${Math.round(styles.fontSize * 1.1)}px`,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}
    >
      EDUCATION
    </div>
    <div className="space-y-4">
      {items.map((edu, index) => (
        <EducationItem key={index} item={edu} styles={styles} />
      ))}
    </div>
  </section>
);

const EducationItem = ({ item, styles }) => (
  <div className="flex gap-4 mb-4">
    <div
      className="flex-shrink-0 w-20 text-right"
      style={styles.getBoldTextStyle()}
    >
      {formatDateRange(item)}
    </div>
    <div className="flex-1">
      <h3 style={styles.getBoldTextStyle()} className="mb-1">
        {item.institution || item.school}
      </h3>
      <div style={styles.baseTextStyle} className="mb-1">
        {item.degree || item.studyType}
        {item.area && ` | ${item.area}`}
      </div>
      {item.description && (
        <div
          style={styles.baseTextStyle}
          dangerouslySetInnerHTML={{ __html: item.description }}
          className="prose prose-sm max-w-none text-justify [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6 [&>li]:mb-1 [&>p]:mb-2 [&>*:last-child]:mb-0"
        />
      )}
    </div>
  </div>
);

const WorkExperienceSection = ({ items, styles }) => (
  <section className="mb-8">
    <div
      className="mb-4 text-center font-bold tracking-wider py-2 px-4"
      style={{
        backgroundColor: styles.primaryColor,
        color: styles.textColor,
        fontSize: `${Math.round(styles.fontSize * 1.1)}px`,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}
    >
      WORK EXPERIENCE
    </div>
    <div className="space-y-4">
      {items.map((exp, index) => (
        <ExperienceItem key={index} item={exp} styles={styles} />
      ))}
    </div>
  </section>
);

const ExperienceItem = ({ item, styles }) => (
  <div className="flex gap-4 mb-4">
    <div
      className="flex-shrink-0 w-20 text-right"
      style={styles.getBoldTextStyle()}
    >
      {formatDateRange(item)}
    </div>
    <div className="flex-1">
      <h3 style={styles.getBoldTextStyle()} className="mb-1">
        {item.companyName || item.company} {/* Ensure company name is shown */}
      </h3>
      <div style={styles.baseTextStyle} className="mb-1">
        {item.position || item.title}
        {item.employmentType && ` | ${item.employmentType}`}{" "}
        {/* Show employment type */}
      </div>
      <div style={styles.smallTextStyle} className="mb-2">
        {item.location}
      </div>
      {(item.description || item.summary) && (
        <div
          style={styles.baseTextStyle}
          dangerouslySetInnerHTML={{ __html: item.description || item.summary }}
          className="prose prose-sm max-w-none text-justify mb-2 [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6 [&>li]:mb-1 [&>p]:mb-2 [&>*:last-child]:mb-0"
        />
      )}
      {item.highlights?.length > 0 && (
        <ul
          className="list-disc list-inside space-y-1"
          style={styles.baseTextStyle}
        >
          {item.highlights.map((highlight, hIndex) => (
            <li key={hIndex} className="text-justify">
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

const SkillsSection = ({ items, styles }) => (
  <section className="mb-8">
    <div
      className="mb-4 text-center font-bold tracking-wider py-2 px-4"
      style={{
        backgroundColor: styles.primaryColor,
        color: styles.textColor,
        fontSize: `${Math.round(styles.fontSize * 1.1)}px`,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}
    >
      SKILLS
    </div>
    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
      {items.map((skill, index) => (
        <div key={index} className="flex items-center">
          <div
            className="w-2 h-2 rounded-full mr-3"
            style={{ backgroundColor: styles.primaryColor }}
          ></div>
          <span style={styles.baseTextStyle}>{skill.skill}</span>
        </div>
      ))}
    </div>
  </section>
);

const LanguagesSection = ({ items, styles }) => (
  <section className="mb-8">
    <div
      className="mb-4 text-center font-bold tracking-wider py-2 px-4"
      style={{
        backgroundColor: styles.primaryColor,
        color: styles.textColor,
        fontSize: `${Math.round(styles.fontSize * 1.1)}px`,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}
    >
      LANGUAGES
    </div>
    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
      {items.map((lang, index) => (
        <LanguageItem key={index} item={lang} styles={styles} />
      ))}
    </div>
  </section>
);

const LanguageItem = ({ item, styles }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center">
      <div
        className="w-2 h-2 rounded-full mr-3"
        style={{ backgroundColor: styles.primaryColor }}
      ></div>
      <span style={styles.baseTextStyle}>{item.language}</span>
    </div>
    <span
      style={{
        ...styles.baseTextStyle,
        fontSize: `${Math.round(styles.fontSize * 0.9)}px`,
        color: styles.primaryColor,
        fontWeight: "500",
      }}
    >
      {item.proficiency}
    </span>
  </div>
);

const CertificationsSection = ({ items, styles }) => (
  <section className="mb-6">
    <div
      className="mb-4 text-center font-bold tracking-wider py-2 px-4"
      style={{
        backgroundColor: styles.primaryColor,
        color: styles.textColor,
        fontSize: `${Math.round(styles.fontSize * 1.1)}px`,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}
    >
      CERTIFICATIONS
    </div>
    <div className="space-y-3">
      {items.map((cert, index) => (
        <CertificationItem key={index} item={cert} styles={styles} />
      ))}
    </div>
  </section>
);

const CertificationItem = ({ item, styles }) => (
  <div className="flex gap-4 mb-4">
    <div
      className="flex-shrink-0 w-20 text-right"
      style={styles.getBoldTextStyle()}
    >
      {item.month && item.year
        ? formatDate(createDateString(item.month, item.year))
        : item.year
          ? item.year
          : ""}
    </div>
    <div className="flex-1">
      <h3 style={styles.getBoldTextStyle()} className="mb-1">
        {item.name || item.title}
      </h3>
      <div style={styles.baseTextStyle} className="mb-1">
        {item.issuer}
      </div>
      {item.description && (
        <div
          style={styles.baseTextStyle}
          dangerouslySetInnerHTML={{ __html: item.description }}
          className="prose prose-sm max-w-none text-justify [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6 [&>li]:mb-1 [&>p]:mb-2 [&>*:last-child]:mb-0"
        />
      )}
    </div>
  </div>
);
