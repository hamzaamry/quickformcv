"use client";

import React from "react";
import {
  Award,
  Briefcase,
  Globe,
  Languages,
  Mail,
  MapPin,
  Phone,
  School,
} from "lucide-react";
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

export const ColorCraftTemplate = ({
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

        {/* Summary Section */}
        {shouldShowSection("summary") && summaryContent && (
          <SummarySection content={summaryContent} styles={styles} />
        )}

        {/* Work Experience Section */}
        {shouldShowSection("experience") && experienceItems?.length > 0 && (
          <ExperienceSection items={experienceItems} styles={styles} />
        )}

        {/* Education Section */}
        {shouldShowSection("education") && educationItems?.length > 0 && (
          <EducationSection items={educationItems} styles={styles} />
        )}

        {/* Certifications Section */}
        {shouldShowSection("certifications") &&
          certificationItems?.length > 0 && (
            <CertificationsSection items={certificationItems} styles={styles} />
          )}

        {/* Skills Section */}
        {shouldShowSection("skills") && skillItems?.length > 0 && (
          <SkillsSection items={skillItems} styles={styles} />
        )}

        {/* Languages Section */}
        {shouldShowSection("languages") && languageItems?.length > 0 && (
          <LanguagesSection items={languageItems} styles={styles} />
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
}) => (
  <header className="text-center mb-8">
    <h1 className="mb-2" style={styles.nameStyle}>
      <span>{basics?.firstName} </span>
      <span>{basics?.lastName} </span>
    </h1>

    <p className="mb-4" style={styles.headlineStyle}>
      {basics?.headline}
    </p>

    <ContactInfo basics={basics} locationData={locationData} styles={styles} />

    {shouldShowSection("socials") && socialItems?.length > 0 && (
      <SocialLinks items={socialItems} styles={styles} />
    )}
  </header>
);

const ContactInfo = ({ basics, locationData, styles }) => (
  <div
    className="flex flex-wrap justify-center gap-4"
    style={styles.smallTextStyle}
  >
    {basics?.email && (
      <ContactItem
        icon={<Mail size={16} />}
        text={basics.email}
        styles={styles}
      />
    )}

    {basics?.phone && (
      <ContactItem
        icon={<Phone size={16} />}
        text={basics.phone}
        styles={styles}
      />
    )}

    {locationData.city && (
      <ContactItem
        icon={<MapPin size={16} />}
        text={`${locationData.city}${locationData.region ? `, ${locationData.region}` : ""}`}
        styles={styles}
      />
    )}

    {basics?.url?.href && (
      <div className="flex items-center gap-1">
        <Globe size={16} style={styles.iconStyle} />
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
  <div
    className="flex flex-wrap justify-center gap-4 mt-4"
    style={styles.smallTextStyle}
  >
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

const SummarySection = ({ content, styles }) => (
  <section className="mb-6">
    <h2 style={styles.sectionHeadingStyle}>Summary</h2>
    <div
      style={styles.baseTextStyle}
      dangerouslySetInnerHTML={{ __html: content }}
      className="prose prose-sm max-w-none text-justify leading-relaxed [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6 [&>li]:mb-1 [&>p]:mb-2 [&>*:last-child]:mb-0"
    />
  </section>
);

const ExperienceSection = ({ items, styles }) => (
  <section className="mb-6">
    <h2 style={styles.sectionHeadingStyle}>Experience</h2>
    <div className="space-y-4">
      {items.map((exp, index) => (
        <ExperienceItem key={index} item={exp} styles={styles} />
      ))}
    </div>
  </section>
);

const ExperienceItem = ({ item, styles }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-1">
      <h3 style={styles.getBoldTextStyle()}>
        <Briefcase
          size={16}
          style={{
            display: "inline",
            color: styles.secondaryColor,
            marginRight: "0.5rem",
          }}
        />
        {item.position || item.title}
        {item.companyName && (
          <span style={styles.smallTextStyle} className="ml-2">
            - {item.companyName}
          </span>
        )}
      </h3>
      <span style={styles.smallTextStyle}>{formatDateRange(item)}</span>
    </div>
    <div style={styles.smallTextStyle} className="mb-2">
      {item.employmentType && (
        <span className="mr-2">• {item.employmentType}</span>
      )}
      {item.location && <span>• {item.location}</span>}
    </div>
    {(item.description || item.summary) && (
      <div
        style={styles.baseTextStyle}
        dangerouslySetInnerHTML={{ __html: item.description || item.summary }}
        className="prose prose-sm max-w-none text-justify leading-relaxed [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6 [&>li]:mb-1 [&>p]:mb-2 [&>*:last-child]:mb-0"
      />
    )}
    {item.highlights?.length > 0 && !(item.description || item.summary) && (
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
);

const EducationSection = ({ items, styles }) => (
  <section className="mb-6">
    <h2 style={styles.sectionHeadingStyle}>Education</h2>
    <div className="space-y-4">
      {items.map((edu, index) => (
        <EducationItem key={index} item={edu} styles={styles} />
      ))}
    </div>
  </section>
);

const EducationItem = ({ item, styles }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-1">
      <h3 style={styles.getBoldTextStyle()}>
        <School
          size={16}
          style={{
            display: "inline",
            color: styles.secondaryColor,
            marginRight: "0.5rem",
          }}
        />
        {item.degree || item.studyType}
        {item.area && (
          <span style={styles.smallTextStyle} className="ml-2">
            - {item.area}
          </span>
        )}
      </h3>
      <span style={styles.smallTextStyle}>{formatDateRange(item)}</span>
    </div>
    <div style={styles.smallTextStyle} className="mb-1">
      {item.institution || item.school}
      {item.location && ` • ${item.location}`}
    </div>
    {item.description && (
      <div
        style={styles.baseTextStyle}
        className="prose prose-sm max-w-none [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6 [&>li]:mb-1 [&>p]:mb-2 [&>*:last-child]:mb-0"
        dangerouslySetInnerHTML={{ __html: item.description }}
      />
    )}
    {item.courses?.length > 0 && (
      <div style={styles.smallTextStyle} className="mt-1">
        <span style={styles.getBoldTextStyle()}>Relevant Courses:</span>{" "}
        {item.courses.join(", ")}
      </div>
    )}
  </div>
);

const CertificationsSection = ({ items, styles }) => (
  <section className="mb-6">
    <h2 style={styles.sectionHeadingStyle}>Certifications</h2>
    <div className="space-y-4">
      {items.map((cert, index) => (
        <CertificationItem key={index} item={cert} styles={styles} />
      ))}
    </div>
  </section>
);

const CertificationItem = ({ item, styles }) => (
  <div className="mb-2">
    <h3 style={styles.getColoredTextStyle()}>
      <Award
        size={16}
        style={{
          display: "inline",
          color: styles.secondaryColor,
          marginRight: "0.5rem",
        }}
      />
      {item.name || item.title}
    </h3>
    <div className="ml-6" style={styles.baseTextStyle}>
      {" "}
      {/* Indent details */}
      <div style={styles.getBoldTextStyle()}>{item.issuer}</div>
      {/* Style issuer */}
      {/* Display Issued Date */}
      {item.month && item.year && (
        <div>Issued: {formatDate(createDateString(item.month, item.year))}</div>
      )}
      {item.description && (
        <div
          style={{ ...styles.baseTextStyle, marginTop: "0.5rem" }} // Add some top margin
          className="prose prose-sm max-w-none [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6 [&>li]:mb-1 [&>p]:mb-2 [&>*:last-child]:mb-0"
          dangerouslySetInnerHTML={{ __html: item.description }}
        />
      )}
      {item.website && (
        <div style={{ marginTop: "0.25rem" }}>
          <a
            href={item.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...styles.linkStyle,
              color: styles.secondaryColor,
              textDecoration: "underline",
            }} // Style the link
          >
            View Certificate
          </a>
        </div>
      )}
    </div>
  </div>
);

const SkillsSection = ({ items, styles }) => (
  <section className="mb-6">
    <h2 style={styles.sectionHeadingStyle}>Skills</h2>
    <div className="grid grid-cols-4 gap-x-4 gap-y-1">
      {items.map((skill, index) => (
        <div key={index} style={styles.baseTextStyle}>
          <span style={{ color: styles.secondaryColor, marginRight: "8px" }}>
            •
          </span>
          {skill.skill}
        </div>
      ))}
    </div>
  </section>
);

const LanguagesSection = ({ items, styles }) => (
  <section className="mb-6">
    <h2 style={styles.sectionHeadingStyle}>
      <Languages
        size={16}
        style={{ display: "inline", marginRight: "0.5rem" }}
      />
      Languages
    </h2>
    <div className="space-y-2">
      {items.map((language, index) => (
        <div key={index} className="mb-2">
          {language.language && (
            <h3 style={styles.baseTextStyle}>
              <Languages
                size={14}
                style={{
                  display: "inline",
                  color: styles.secondaryColor,
                  marginRight: "0.5rem",
                }}
              />
              {language.language}
              {language.proficiency && (
                <span style={styles.smallTextStyle} className="ml-2">
                  ({language.proficiency})
                </span>
              )}
            </h3>
          )}
        </div>
      ))}
    </div>
  </section>
);
