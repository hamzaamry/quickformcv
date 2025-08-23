import puppeteer from "puppeteer";

export const exportResumeToPDF = async (resumeData) => {
  if (!resumeData?.metadata) {
    throw new Error("Resume data with metadata is required");
  }
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const previewUrl = `${baseUrl}/builder/print-preview/${resumeData.id}`;
  let browser = null;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-web-security",
        "--allow-running-insecure-content",
      ],
      timeout: 30000,
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600 });
    // Inject the resume data before navigating
    await page.evaluateOnNewDocument((data) => {
      window.__RESUME_DATA__ = data;
    }, resumeData);

    // Navigate to the preview page
    await page.goto(previewUrl, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    await page.waitForSelector("[data-resume-page]", {
      timeout: 30000,
      visible: true,
    });

    const expectedPageCount =
      resumeData.metadata?.pages?.length > 0
        ? resumeData.metadata.pages.length
        : 1;
    await page.waitForFunction(
      (expectedCount) => {
        const pageElements = document.querySelectorAll("[data-resume-page]");
        return pageElements.length >= expectedCount;
      },
      { timeout: 30000 },
      expectedPageCount,
    );

    await page.waitForFunction(
      (expectedCount) => {
        const pageElements = document.querySelectorAll("[data-resume-page]");
        if (pageElements.length < expectedCount) {
          return false;
        }
        const checkCount = Math.min(expectedCount, 3);
        for (let i = 0; i < checkCount; i++) {
          const element = pageElements[i];
          if (
            !element ||
            element.offsetHeight <= 100 ||
            !element.textContent ||
            element.textContent.trim().length <= 10
          ) {
            return false;
          }
        }
        return true;
      },
      { timeout: 15000 },
      expectedPageCount,
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate PDF with settings from metadata
    const pdfOptions = {
      //format: "A4",
      printBackground: true,
      // Use width/height for A4 in pixels (approx) to potentially avoid Puppeteer format issues
      width: "210mm",
      height: "297mm",
      margin: {
        top: `${resumeData.metadata.page?.margin || 18}mm`,
        right: `${resumeData.metadata.page?.margin || 18}mm`,
        bottom: `${resumeData.metadata.page?.margin || 18}mm`,
        left: `${resumeData.metadata.page?.margin || 18}mm`,
      },
      preferCSSPageSize: true,
    };
    const pdfBuffer = await page.pdf(pdfOptions);
    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error("Generated PDF buffer is empty");
    }
    console.log("PDF generated successfully, size:", pdfBuffer.length, "bytes");
    return pdfBuffer;
  } catch (error) {
    console.error("PDF generation error:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close().catch(console.error);
    }
  }
};
