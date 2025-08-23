// Not used yet !!!
//TODO

import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req) {
  try {
    const { resumeData } = await req.json();

    // Launch a headless browser
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Set viewport to A4 size with higher resolution for better quality
    await page.setViewport({
      width: 794, // A4 width in pixels at 96 DPI
      height: 1123, // A4 height in pixels at 96 DPI
      deviceScaleFactor: 2, // Higher resolution for better image quality
    });

    // Use the same HTML template as in the PDF export
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            background-color: white;
          }
          .resume-container {
            width: 210mm;
            height: 297mm;
            padding: 20mm;
            position: relative;
            background-color: white;
          }
        </style>
      </head>
      <body>
        <div id="resumeContainer" class="resume-container">
          <!-- Inject resume data here -->
          <div class="w-full bg-white p-8 relative overflow-hidden">
            <!-- Header Section -->
            <div class="flex items-start gap-6 flex-wrap">
              ${
                resumeData.basics.picture.url &&
                !resumeData.basics.picture.effects.hidden
                  ? `
                <img
                  src="${resumeData.basics.picture.url}"
                  alt="Profile"
                  class="max-w-[120px] max-h-[120px] object-cover flex-shrink-0 ${
                    resumeData.basics.picture.effects.border
                      ? "border-4 border-gray-100"
                      : ""
                  } ${resumeData.basics.picture.effects.grayscale ? "grayscale" : ""}"
                  style="
                    aspect-ratio: ${resumeData.basics.picture.aspect_ratio};
                    border-radius: ${resumeData.basics.picture.border_radius}px;
                  "
                />
              `
                  : ""
              }
              <div class="flex-1 min-w-[200px]">
                <h1 class="text-4xl font-bold text-gray-800 break-words">
                  ${resumeData.basics.firstName} ${resumeData.basics.lastName}
                </h1>
                <p class="text-xl text-gray-600 mt-2 break-words">${resumeData.basics.headline}</p>

                <!-- Contact Information -->
                <div class="mt-4 grid sm:grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600">
                  ${
                    resumeData.basics.email
                      ? `
                    <div class="flex items-center gap-2 min-w-0">
                      <span class="text-gray-400 flex-shrink-0">📧</span>
                      <span class="truncate">${resumeData.basics.email}</span>
                    </div>
                  `
                      : ""
                  }
                  ${
                    resumeData.basics.phone
                      ? `
                    <div class="flex items-center gap-2 min-w-0">
                      <span class="text-gray-400 flex-shrink-0">📱</span>
                      <span class="truncate">${resumeData.basics.phone}</span>
                    </div>
                  `
                      : ""
                  }
                  ${
                    resumeData.basics.url.href
                      ? `
                    <div class="flex items-center gap-2 min-w-0">
                      <span class="text-gray-400 flex-shrink-0">🌐</span>
                      <span class="truncate">${resumeData.basics.url.label || resumeData.basics.url.href}</span>
                    </div>
                  `
                      : ""
                  }
                  ${
                    resumeData.basics.location
                      ? `
                    <div class="flex items-center gap-2 min-w-0">
                      <span class="text-gray-400 flex-shrink-0">📍</span>
                      <span class="truncate">${resumeData.basics.location}</span>
                    </div>
                  `
                      : ""
                  }
                </div>

                <!-- Social Links -->
                ${
                  resumeData.sections.socials.items.length > 0
                    ? `
                  <div class="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                    ${resumeData.sections.socials.items
                      .map(
                        (social) => `
                      <div class="flex items-center gap-2 min-w-0 max-w-full">
                        <span class="text-gray-400 flex-shrink-0">🔗</span>
                        <span class="flex-shrink-0">${social.title}:</span>
                        <span class="text-blue-600 truncate">${social.description}</span>
                      </div>
                    `,
                      )
                      .join("")}
                  </div>
                `
                    : ""
                }
              </div>
            </div>

            <!-- Summary Section -->
            ${
              resumeData.summary.content
                ? `
              <div class="mt-8">
                <h2 class="text-xl font-semibold text-gray-800 mb-3">Summary</h2>
                <p class="text-gray-600 leading-relaxed whitespace-pre-wrap break-words">${resumeData.summary.content}</p>
              </div>
            `
                : ""
            }

            <!-- Experience Section -->
            ${
              resumeData.sections.experiences.items.length > 0
                ? `
              <div class="mt-8">
                <h2 class="text-xl font-semibold text-gray-800 mb-4">Experience</h2>
                <div class="space-y-6">
                  ${resumeData.sections.experiences.items
                    .map(
                      (experience) => `
                    <div class="relative">
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                        <div>
                          <h3 class="text-lg font-medium text-gray-800">${experience.details.title}</h3>
                          <div class="flex items-center gap-2 text-gray-600 mt-1">
                            <span class="text-gray-400 flex-shrink-0">🏢</span>
                            <span>${experience.title}</span>
                            ${
                              experience.details.location
                                ? `
                              <span class="text-gray-400">•</span>
                              <div class="flex items-center gap-1">
                                <span class="text-gray-400 flex-shrink-0">📍</span>
                                <span>${experience.details.location}</span>
                              </div>
                            `
                                : ""
                            }
                          </div>
                          <div class="flex items-center gap-2 text-gray-600 mt-1">
                            <span class="text-gray-400 flex-shrink-0">📅</span>
                            <span>${experience.details.dateRange}</span>
                            <span class="text-gray-400">•</span>
                            <span>${experience.details.employmentType}</span>
                            ${
                              experience.details.workType
                                ? `
                              <span class="text-gray-400">•</span>
                              <span>${experience.details.workType}</span>
                            `
                                : ""
                            }
                          </div>
                        </div>
                      </div>
                      ${
                        experience.details.description
                          ? `
                        <p class="text-gray-600 whitespace-pre-wrap mt-2">
                          ${experience.details.description}
                        </p>
                      `
                          : ""
                      }
                    </div>
                  `,
                    )
                    .join("")}
                </div>
              </div>
            `
                : ""
            }

            <!-- Education Section -->
            ${
              resumeData.sections.education.items.length > 0
                ? `
              <div class="mt-8">
                <h2 class="text-xl font-semibold text-gray-800 mb-4">Education</h2>
                <div class="space-y-6">
                  ${resumeData.sections.education.items
                    .map(
                      (education) => `
                    <div class="relative">
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                        <div>
                          <h3 class="text-lg font-medium text-gray-800">${education.title}</h3>
                          <div class="flex items-center gap-2 text-gray-600 mt-1">
                            <span class="text-gray-400 flex-shrink-0">🎓</span>
                            <span>${education.details.fieldOfStudy}</span>
                            ${
                              education.details.studyType
                                ? `
                              <span class="text-gray-400">•</span>
                              <span>${education.details.studyType}</span>
                            `
                                : ""
                            }
                          </div>
                          <div class="flex items-center gap-2 text-gray-600 mt-1">
                            <span class="text-gray-400 flex-shrink-0">📅</span>
                            <span>${education.details.dateRange}</span>
                            ${
                              education.details.location
                                ? `
                              <span class="text-gray-400">•</span>
                              <div class="flex items-center gap-1">
                                <span class="text-gray-400 flex-shrink-0">📍</span>
                                <span>${education.details.location}</span>
                              </div>
                            `
                                : ""
                            }
                          </div>
                        </div>
                      </div>
                      ${
                        education.details.description
                          ? `
                        <p class="text-gray-600 whitespace-pre-wrap mt-2">
                          ${education.details.description}
                        </p>
                      `
                          : ""
                      }
                    </div>
                  `,
                    )
                    .join("")}
                </div>
              </div>
            `
                : ""
            }

            <!-- Certifications Section -->
            ${
              resumeData.sections.certifications.items.length > 0
                ? `
              <div class="mt-8">
                <h2 class="text-xl font-semibold text-gray-800 mb-4">Certifications</h2>
                <div class="space-y-6">
                  ${resumeData.sections.certifications.items
                    .map(
                      (certification) => `
                    <div class="relative">
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                        <div>
                          <h3 class="text-lg font-medium text-gray-800">${certification.title}</h3>
                          <div class="flex items-center gap-2 text-gray-600 mt-1">
                            <span class="text-gray-400 flex-shrink-0">🏆</span>
                            <span>${certification.details.issuer}</span>
                          </div>
                          <div class="flex items-center gap-2 text-gray-600 mt-1">
                            <span class="text-gray-400 flex-shrink-0">📅</span>
                            <span>${certification.details.dateRange || `${certification.details.month} ${certification.details.year}`}</span>
                          </div>
                        </div>
                      </div>
                      ${
                        certification.details.description
                          ? `
                        <p class="text-gray-600 whitespace-pre-wrap mt-2">
                          ${certification.details.description}
                        </p>
                      `
                          : ""
                      }
                    </div>
                  `,
                    )
                    .join("")}
                </div>
              </div>
            `
                : ""
            }

            <!-- Skills Section -->
            ${
              resumeData.sections.skills.items.length > 0
                ? `
              <div class="mt-8">
                <h2 class="text-xl font-semibold text-gray-800 mb-4">Skills</h2>
                <div class="flex flex-wrap gap-2">
                  ${resumeData.sections.skills.items
                    .map(
                      (skill) => `
                    <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                      ${skill.name}
                    </span>
                  `,
                    )
                    .join("")}
                </div>
              </div>
            `
                : ""
            }
          </div>
        </div>
      </body>
      </html>
    `;

    // Set the content
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Take a screenshot as PNG
    const screenshot = await page.screenshot({
      type: "png",
      fullPage: true,
      omitBackground: false,
      quality: 100,
    });

    await browser.close();

    // Return the PNG as a response
    return new NextResponse(screenshot, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'attachment; filename="resume.png"',
      },
    });
  } catch (error) {
    console.error("PNG generation error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to generate PNG" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
