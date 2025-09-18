import puppeteer from "puppeteer";

export const exportResumeToPDF = async (resumeData) => {
  if (!resumeData?.metadata) {
    throw new Error("Resume data with metadata is required");
  }

  const isDocker = process.env.DOCKER_BUILD === 'true';
  const baseUrl = isDocker
      ? 'http://localhost:3000'
      : process.env.NEXT_PUBLIC_APP_URL;

  const previewUrl = `${baseUrl}/builder/print-preview/${resumeData.id}`;

  let browser = null;
  try {
    console.log("PDF Service - Launching browser...");
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-web-security",
        "--allow-running-insecure-content",
        "--disable-features=VizDisplayCompositor",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        "--disable-extensions",
        "--disable-plugins",
        "--disable-default-apps",
        "--no-zygote",
        "--single-process",
        "--disable-accelerated-2d-canvas",
        "--memory-pressure-off",
        "--max_old_space_size=4096"
      ],
      timeout: 60000,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    });

    console.log("PDF Service - Browser launched successfully");

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600 });

    page.on('error', (error) => {
      console.error('PDF Service - Page error:', error);
    });

    page.on('pageerror', (error) => {
      console.error('PDF Service - Page script error:', error);
    });

    console.log("PDF Service - Injecting resume data...");
    await page.evaluateOnNewDocument((data) => {
      window.__RESUME_DATA__ = data;
    }, resumeData);

    try {
      const response = await page.goto(previewUrl, {
        waitUntil: "networkidle0",
        timeout: 45000,
      });

      if (!response || !response.ok()) {
        throw new Error(`Failed to load page: ${response?.status()} ${response?.statusText()}`);
      }
    } catch (navigationError) {
      console.error("PDF Service - Navigation failed:", navigationError.message);

      // Try alternative approach: check if it's a network issue
      try {
        const alternativeUrl = previewUrl.replace('localhost', '127.0.0.1');

        const altResponse = await page.goto(alternativeUrl, {
          waitUntil: "networkidle0",
          timeout: 30000,
        });

        if (!altResponse || !altResponse.ok()) {
          throw navigationError;
        }
      } catch {
        throw navigationError;
      }
    }

    await page.waitForSelector("[data-resume-page]", {
      timeout: 45000,
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
        { timeout: 45000 },
        expectedPageCount,
    );

    try {
      await page.waitForFunction(
          (expectedCount) => {
            const pageElements = document.querySelectorAll("[data-resume-page]");
            if (pageElements.length < expectedCount) {
              return false;
            }
            const checkCount = Math.min(expectedCount, 3);
            for (let i = 0; i < checkCount; i++) {
              const element = pageElements[i];
              if (!element) {
                return false;
              }

              const hasContent = element.offsetHeight > 50 ||
                  (element.textContent && element.textContent.trim().length > 5) ||
                  element.children.length > 0; // Has child elements

              if (!hasContent) {
                return false;
              }
            }
            return true;
          },
          { timeout: 20000 },
          expectedPageCount,
      );
    } catch (contentValidationError) {

      // Continue anyway if we have the basic elements
      const elementCount = await page.evaluate(() =>
          document.querySelectorAll("[data-resume-page]").length
      );

      if (elementCount < expectedPageCount) {
        throw new Error(`Not enough resume page elements found: ${elementCount} < ${expectedPageCount}`);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log("PDF Service - Generating PDF...");
    const pdfOptions = {
      printBackground: true,
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
      console.log("PDF Service - Closing browser...");
      await browser.close().catch(console.error);
    }
  }
};