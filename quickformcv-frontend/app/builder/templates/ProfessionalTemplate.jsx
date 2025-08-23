"use client";
import {
  Briefcase,
  Globe,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import {
  createSectionVisibilityChecker,
  formatDateRange,
  getAllSectionData,
  parseLocation,
} from "@/app/builder/utils/TemplateUtils";
import { FontLoader } from "@/app/builder/components/FontLoader";
import { TemplateStyles } from "./templateStyles";

export const ProfessionalTemplate = ({
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
    referenceItems,
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
        {shouldShowSection("basics") && basics && (
          <HeaderSection
            basics={basics}
            locationData={locationData}
            socialItems={socialItems}
            shouldShowSection={shouldShowSection}
            styles={styles}
          />
        )}
        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-6 overflow-hidden">
          {/* Left Sidebar */}
          <div className="col-span-1 space-y-6 min-w-0">
            {/* Contact Section */}
            {shouldShowSection("basics") && (
              <ContactSection
                basics={basics}
                locationData={locationData}
                styles={styles}
              />
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
                <CertificationsSection
                  items={certificationItems}
                  styles={styles}
                />
              )}
            {/* References Section */}
            {shouldShowSection("references") && referenceItems?.length > 0 && (
              <ReferencesSection items={referenceItems} styles={styles} />
            )}
          </div>
          {/* Right Main Content */}
          <div className="col-span-2 space-y-6 min-w-0 overflow-hidden">
            {/* Profile Section */}
            {shouldShowSection("summary") && summaryContent && (
              <ProfileSection content={summaryContent} styles={styles} />
            )}
            {/* Work Experience Section */}
            {shouldShowSection("experience") && experienceItems?.length > 0 && (
              <WorkExperienceSection items={experienceItems} styles={styles} />
            )}
            {/* Education Section */}
            {shouldShowSection("education") && educationItems?.length > 0 && (
              <EducationSection items={educationItems} styles={styles} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const HeaderSection = ({ basics }) => {
  const profileImage = basics?.picture?.url;
  const shouldShowImage = profileImage && !basics?.picture?.effects?.hidden;
  return (
    <header
      className="flex items-center gap-6 p-6 mb-6 text-white"
      style={{ backgroundColor: "#4A5568" }}
    >
      {/* Profile Photo - Only show if image exists and is not hidden */}
      {shouldShowImage && (
        <div className="flex-shrink-0">
          <img
            src={profileImage}
            alt={`${basics?.firstName} ${basics?.lastName}`}
            className="w-24 h-24 rounded-full object-cover border-4 border-white"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      )}
      {/* Name and Title */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-2 tracking-wide">
          {basics?.firstName?.toUpperCase()} {basics?.lastName?.toUpperCase()}
        </h1>
        <p className="text-lg opacity-90">{basics?.headline}</p>
      </div>
    </header>
  );
};

const ContactSection = ({ basics, locationData, styles }) => (
  <section>
    <h2
      className="text-lg font-bold mb-4 tracking-wide"
      style={{ color: "#4A5568" }}
    >
      CONTACT
    </h2>
    <div className="space-y-3" style={styles.smallTextStyle}>
      {basics?.phone && (
        <ContactItem icon={<Phone size={16} />} text={basics.phone} />
      )}
      {basics?.email && (
        <ContactItem icon={<Mail size={16} />} text={basics.email} />
      )}
      {locationData.city && (
        <ContactItem
          icon={<MapPin size={16} />}
          text={`${locationData.city}${locationData.region ? `, ${locationData.region}` : ""}`}
        />
      )}
      {basics?.url?.href && (
        <ContactItem
          icon={<Globe size={16} />}
          text={
            typeof basics?.url === "string"
              ? basics?.url
              : basics?.url?.label || basics?.url?.href
          }
        />
      )}
    </div>
  </section>
);

const ContactItem = ({ icon, text }) => (
  <div className="flex items-center gap-3">
    <span className="text-gray-600">{icon}</span>
    <span className="text-sm">{text}</span>
  </div>
);

const SkillsSection = ({ items, styles }) => (
  <section>
    <h2
      className="text-lg font-bold mb-4 tracking-wide"
      style={{ color: "#4A5568" }}
    >
      SKILLS
    </h2>
    <ul className="space-y-2" style={styles.smallTextStyle}>
      {items.map((skill, index) => (
        <li key={index} className="flex items-center">
          <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
          {skill.skill}
        </li>
      ))}
    </ul>
  </section>
);

const LanguagesSection = ({ items, styles }) => (
  <section>
    <h2
      className="text-lg font-bold mb-4 tracking-wide"
      style={{ color: "#4A5568" }}
    >
      LANGUAGES
    </h2>
    <ul className="space-y-2" style={styles.smallTextStyle}>
      {items.map((language, index) => (
        <li key={index} className="flex items-center">
          <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
          <span>
            {language.language}
            {language.fluency && (
              <span className="text-gray-600 ml-1">({language.fluency})</span>
            )}
            {/* Fallback for proficiency if fluency doesn't exist */}
            {language.proficiency && !language.fluency && (
              <span className="text-gray-600 ml-1">
                ({language.proficiency})
              </span>
            )}
          </span>
        </li>
      ))}
    </ul>
  </section>
);

const CertificationsSection = ({ items, styles }) => (
  <section>
    <h2
      className="text-lg font-bold mb-4 tracking-wide"
      style={{ color: "#4A5568" }}
    >
      CERTIFICATIONS
    </h2>
    <div className="space-y-4">
      {items.map((cert, index) => (
        <div key={index} className="border-l-4 border-gray-300 pl-4">
          <div className="font-semibold" style={styles.baseTextStyle}>
            {cert.name || cert.title}
          </div>
          <div className="text-gray-600" style={styles.smallTextStyle}>
            {cert.issuer}{" "}
            {cert.year && cert.month && `• ${cert.month} ${cert.year}`}
          </div>
          {cert.website && (
            <div className="text-blue-600 mt-1" style={styles.smallTextStyle}>
              <a href={cert.website} target="_blank" rel="noopener noreferrer">
                View Certificate
              </a>
            </div>
          )}
          {cert.description && (
            <div
              className="mt-2 text-gray-700 leading-relaxed break-words prose prose-sm max-w-none [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6 [&>li]:mb-1 [&>p]:mb-2 [&>*:last-child]:mb-0"
              style={styles.smallTextStyle}
              dangerouslySetInnerHTML={{ __html: cert.description }}
            />
          )}
        </div>
      ))}
    </div>
  </section>
);

const ReferencesSection = ({ items, styles }) => (
  <section>
    <h2
      className="text-lg font-bold mb-4 tracking-wide"
      style={{ color: "#4A5568" }}
    >
      REFERENCES
    </h2>
    <div className="space-y-4" style={styles.smallTextStyle}>
      {items.map((reference, index) => (
        <div key={index}>
          <div className="font-semibold">{reference.name}</div>
          <div className="text-gray-600">{reference.position}</div>
          <div className="text-gray-600">{reference.company}</div>
          {reference.phone && <div>Phone: {reference.phone}</div>}
          {reference.email && <div>Email: {reference.email}</div>}
        </div>
      ))}
    </div>
  </section>
);

const ProfileSection = ({ content, styles }) => {
  const isContentEmpty = (htmlContent) => {
    if (!htmlContent) return true;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    return textContent.trim().length === 0;
  };
  if (isContentEmpty(content)) {
    return null;
  }
  return (
    <section>
      <SectionHeader icon={<User size={20} />} title="PROFILE" />
      <div
        style={styles.baseTextStyle}
        className="text-justify leading-relaxed break-words prose prose-sm max-w-none [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6 [&>li]:mb-1 [&>p]:mb-2 [&>*:last-child]:mb-0"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </section>
  );
};

const WorkExperienceSection = ({ items, styles }) => (
  <section>
    <SectionHeader icon={<Briefcase size={20} />} title="WORK EXPERIENCE" />
    <div className="space-y-6">
      {items.map((exp, index) => (
        <ExperienceItem key={index} item={exp} styles={styles} />
      ))}
    </div>
  </section>
);

const ExperienceItem = ({ item, styles }) => (
  <div className="relative pl-6">
    {/* Timeline dot */}
    <div className="absolute left-0 top-1 w-3 h-3 bg-gray-400 rounded-full"></div>
    <div className="absolute left-1.5 top-4 w-0.5 h-full bg-gray-300"></div>
    <div className="flex justify-between items-start mb-2">
      <div>
        <h3 className="font-bold text-lg" style={styles.subHeadingStyle}>
          {item.companyName || item.company}
        </h3>
        <div className="font-semibold" style={styles.baseTextStyle}>
          {item.position || item.title}
          {item.employmentType && (
            <span className="ml-2 font-normal">- {item.employmentType}</span>
          )}
        </div>
      </div>
      <div className="text-right" style={styles.smallTextStyle}>
        {formatDateRange(item)}
      </div>
    </div>
    <div className="text-gray-600 mb-2" style={styles.smallTextStyle}>
      {item.location}
    </div>
    {(item.description || item.summary) && (
      <div
        style={styles.baseTextStyle}
        className="mt-2 break-words prose prose-sm max-w-none [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6 [&>li]:mb-1 [&>p]:mb-2 [&>*:last-child]:mb-0"
        dangerouslySetInnerHTML={{ __html: item.description || item.summary }}
      />
    )}
    {item.highlights?.length > 0 && !(item.description || item.summary) && (
      <ul
        className="list-disc list-inside space-y-1 mt-2"
        style={styles.smallTextStyle}
      >
        {item.highlights.map((highlight, hIndex) => (
          <li key={hIndex}>{highlight}</li>
        ))}
      </ul>
    )}
  </div>
);

const EducationSection = ({ items, styles }) => (
  <section>
    <SectionHeader icon={<GraduationCap size={20} />} title="EDUCATION" />
    <div className="space-y-6">
      {items.map((edu, index) => (
        <EducationItem key={index} item={edu} styles={styles} />
      ))}
    </div>
  </section>
);

const EducationItem = ({ item, styles }) => (
  <div className="relative pl-6">
    {/* Timeline dot */}
    <div className="absolute left-0 top-1 w-3 h-3 bg-gray-400 rounded-full"></div>
    <div className="absolute left-1.5 top-4 w-0.5 h-full bg-gray-300"></div>
    <div className="flex justify-between items-start mb-2">
      <div>
        <h3 className="font-bold text-lg" style={styles.subHeadingStyle}>
          {item.degree || item.studyType}
          {item.area && ` in ${item.area}`}
        </h3>
        <div className="font-semibold" style={styles.baseTextStyle}>
          {item.institution || item.school}
        </div>
        {item.gpa && <div style={styles.smallTextStyle}>GPA: {item.gpa}</div>}
      </div>
      <div className="text-right" style={styles.smallTextStyle}>
        {formatDateRange(item)}
      </div>
    </div>
    {item.description && (
      <div
        style={styles.baseTextStyle}
        className="mt-2 break-words prose prose-sm max-w-none [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6 [&>li]:mb-1 [&>p]:mb-2 [&>*:last-child]:mb-0"
        dangerouslySetInnerHTML={{ __html: item.description }}
      />
    )}
  </div>
);

const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-gray-300">
    <span style={{ color: "#4A5568" }}>{icon}</span>
    <h2
      className="text-lg font-bold tracking-wide"
      style={{ color: "#4A5568" }}
    >
      {title}
    </h2>
  </div>
);
