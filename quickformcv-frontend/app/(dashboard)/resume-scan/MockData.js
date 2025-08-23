export const scannedResumes = [
  {
    id: 1,
    fileName: "john_doe_resume.pdf",
    scanDate: "2025-04-03",
    overallScore: 0.63,
    sectionScores: {
      first_impression: 0.42,
      appearance: 0.72,
      career_goals: 0.7,
      writing_style: 0.72,
    },
    status: "Needs Improvement",
    color: "#FF5A5F",
  },
  {
    id: 2,
    fileName: "jane_smith_resume.pdf",
    scanDate: "2025-04-01",
    overallScore: 0.85,
    sectionScores: {
      first_impression: 0.82,
      appearance: 0.88,
      career_goals: 0.79,
      writing_style: 0.91,
    },
    status: "High Score",
    color: "#00A699",
  },
  {
    id: 3,
    fileName: "alex_johnson_resume.pdf",
    scanDate: "2025-03-28",
    overallScore: 0.71,
    sectionScores: {
      first_impression: 0.65,
      appearance: 0.75,
      career_goals: 0.68,
      writing_style: 0.76,
    },
    status: "Good",
    color: "#0066ff",
  },
  {
    id: 4,
    fileName: "sarah_williams_resume.pdf",
    scanDate: "2025-03-25",
    overallScore: 0.92,
    sectionScores: {
      first_impression: 0.9,
      appearance: 0.95,
      career_goals: 0.88,
      writing_style: 0.94,
    },
    status: "High Score",
    color: "#00A699",
  },
];

export const resumeScanData = [
  {
    id: 1,
    overall_score: 0.61,
    section_scores: {
      first_impression: 0.33,
      appearance: 0.8,
      career_goals: 0.7,
      writing_style: 0.72,
    },
    detailed_analysis: {
      first_impression: {
        overall_score: 0.325,
        metrics: {
          readability: {
            score: 0.3,
            explanation:
              "The average line spacing is 12.03, which is slightly higher than the ideal range. The line spacing is also inconsistent, making it difficult to scan. The content density is 77 words per page, which is relatively low.",
            suggestion:
              "Increase the line spacing to 1.5 or 2 to improve readability. Consider using a consistent font size and style throughout the resume.",
          },
          design: {
            score: 0.2,
            explanation:
              "The font choices are mixed, and the font consistency is various. The bullet style is consistent, but the overall font professionalism is low.",
            suggestion:
              "Choose a maximum of 2-3 fonts and use them consistently throughout the resume. Consider using a standard font like Arial, Calibri, or Helvetica.",
          },
          summary: {
            score: 0.4,
            explanation:
              "The summary text is lengthy and includes unnecessary information like contact details and a résumé title. It also uses technical terms that may not be familiar to non-technical readers.",
            suggestion:
              "Keep the summary text concise and focused on the candidate's career goals and relevant skills. Avoid using technical jargon and remove unnecessary information.",
          },
          appearance: {
            score: 0.4,
            explanation:
              "The space utilization is uneven, and the content distribution is balanced. The structure is 12 bullet points, which is a good start.",
            suggestion:
              "Consider using a more consistent spacing between sections and bullet points. Use headings and subheadings to break up the content and improve organization.",
          },
        },
        processing_time: "7.55s",
      },
      appearance: {
        overall_score: 0.8,
        metrics: {
          visual_presentation: {
            score: 0.8,
            explanation:
              "The margin balance ratio is good, but the line spacing is variable, which may affect readability. Font variations are moderate, but could be reduced for a more cohesive look. Content density is relatively high, which may make the text feel dense.",
            suggestion:
              "Consider using a consistent font size and style throughout the resume, and adjust the line spacing to a standard 1.5 or double spacing to improve readability.",
          },
          margins: {
            score: 0.9,
            explanation:
              "The margins are generally well-balanced, with a good ratio of left to right margins. However, the top and bottom margins could be adjusted to create a more symmetrical layout.",
            suggestion:
              "Consider adjusting the top and bottom margins to 30-35% of the page height to create a more balanced layout.",
          },
          design_consistency: {
            score: 0.7,
            explanation:
              "While the font types are varied, there is only one bullet style used, which is consistent. However, the use of multiple font types may create visual clutter.",
            suggestion:
              "Consider reducing the number of font types used to 2-3, and using a consistent font size and style throughout the resume.",
          },
          page_formatting: {
            score: 0.8,
            explanation:
              "The header is present, which is a good practice. The content distribution is generally balanced, but could be improved by breaking up large blocks of text into smaller sections.",
            suggestion:
              "Consider using section headings and subheadings to break up the content and create a clear structure. This will also help to guide the reader's attention and improve readability.",
          },
        },
        processing_time: "16.10s",
      },
      career_goals: {
        overall_score: 0.7,
        metrics: {
          position_targeting: {
            score: 0.8,
            explanation:
              "The resume targets a specific role in the field of software engineering, with a focus on data analysis and machine learning. The industry alignment is good, but the requirements match could be improved by highlighting more specific technical skills.",
            suggestion:
              "Consider adding a section highlighting specific technical skills, such as programming languages, frameworks, and tools, to better match the requirements of the target role.",
          },
          career_transition: {
            score: 0.6,
            explanation:
              "The resume does not clearly state a career transition goal, and the experience section is mostly focused on internships and projects. The student section is relevant, but could be more prominent. The transferable skills are not explicitly emphasized.",
            suggestion:
              "Consider adding a clear career transition statement at the top of the resume, highlighting the desired role and industry. Emphasize transferable skills, such as problem-solving, teamwork, and communication, to demonstrate relevance to the target role.",
          },
        },
        processing_time: "6.93s",
      },
      writing_style: {
        overall_score: 0.725,
        metrics: {
          first_person_voice: {
            score: 0.5,
            explanation:
              "The text is written in a professional tone, but it lacks personal pronouns, making it difficult to determine if it's written in the first person or not. The text implies a first-person perspective, but it would be more effective to explicitly use personal pronouns.",
            suggestion:
              'Use first-person pronouns (e.g., "I", "me", "my") to explicitly convey the writer\'s perspective.',
          },
          logical_flow: {
            score: 0.8,
            explanation:
              "The text is well-organized, with clear sections for education, experience, projects, and skills. The transitions between sections are smooth, and the progression is clear. However, some sections could be further divided or reorganized for better clarity.",
            suggestion:
              'Consider dividing the "Experience" section into separate entries for each internship or project, and reorganize the "Projects" section to prioritize the most relevant or impressive projects.',
          },
          crisp_phrases: {
            score: 0.7,
            explanation:
              "The text uses direct bullet points and action verbs, which helps to convey the writer's skills and experience clearly. However, some sentences could be condensed or rephrased for greater clarity and concision.",
            suggestion:
              "Consider rephrasing sentences that are overly long or wordy, and use more concise language to convey the same information.",
          },
          error_free_writing: {
            score: 0.9,
            explanation:
              "The text appears to be free of major spelling, grammar, and typos. However, there may be minor errors or inconsistencies in formatting or punctuation.",
            suggestion:
              "Double-check the text for minor errors, such as inconsistent formatting or punctuation, and make any necessary corrections.",
          },
        },
        processing_time: "7.21s",
      },
    },
    processing_time: "29.32s",
  },
];
