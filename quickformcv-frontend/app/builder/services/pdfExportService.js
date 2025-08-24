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
  console.log("PDF Service - Target URL:", previewUrl);
  console.log("PDF Service - Environment:", { isDocker, NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL });

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
      console.log('Resume data injected:', !!data);
    }, resumeData);

    console.log("PDF Service - Navigating to:", previewUrl);

    try {
      const response = await page.goto(previewUrl, {
        waitUntil: "networkidle0",
        timeout: 45000,
      });

      console.log("PDF Service - Navigation response:", {
        status: response?.status(),
        ok: response?.ok(),
        url: response?.url()
      });

      if (!response || !response.ok()) {
        throw new Error(`Failed to load page: ${response?.status()} ${response?.statusText()}`);
      }
    } catch (navigationError) {
      console.error("PDF Service - Navigation failed:", navigationError.message);

      // Try alternative approach: check if it's a network issue
      try {
        const alternativeUrl = previewUrl.replace('localhost', '127.0.0.1');
        console.log("PDF Service - Trying alternative URL:", alternativeUrl);

        const altResponse = await page.goto(alternativeUrl, {
          waitUntil: "networkidle0",
          timeout: 30000,
        });

        if (!altResponse || !altResponse.ok()) {
          throw navigationError; // Re-throw original error
        }
      } catch {
        throw navigationError; // Re-throw original error
      }
    }

    console.log("PDF Service - Waiting for resume page selector...");

    const pageContent = await page.content();
    if (pageContent.length < 1000) {
      console.error("PDF Service - Page seems empty, content length:", pageContent.length);
      console.error("PDF Service - Page content preview:", pageContent.substring(0, 500));
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
          console.log('Current page elements found:', pageElements.length);
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
              console.log('Not enough page elements:', pageElements.length, 'expected:', expectedCount);
              return false;
            }
            const checkCount = Math.min(expectedCount, 3);
            for (let i = 0; i < checkCount; i++) {
              const element = pageElements[i];
              if (!element) {
                console.log('Page element', i, 'does not exist');
                return false;
              }

              const hasContent = element.offsetHeight > 50 ||
                  (element.textContent && element.textContent.trim().length > 5) ||
                  element.children.length > 0; // Has child elements

              if (!hasContent) {
                console.log('Page element', i, 'failed content check:', {
                  height: element?.offsetHeight,
                  textLength: element?.textContent?.trim()?.length,
                  childCount: element?.children?.length
                });
                return false;
              }
            }
            console.log('All page elements passed content check');
            return true;
          },
          { timeout: 20000 },
          expectedPageCount,
      );
    } catch (contentValidationError) {
      console.log('Content validation failed, but proceeding anyway:', contentValidationError.message);

      const debugInfo = await page.evaluate(() => {
        const elements = document.querySelectorAll("[data-resume-page]");
        return Array.from(elements).map((el, i) => ({
          index: i,
          height: el.offsetHeight,
          width: el.offsetWidth,
          textLength: el.textContent?.trim().length || 0,
          childCount: el.children.length,
          hasClass: el.className
        }));
      });

      console.log('Current page elements state:', JSON.stringify(debugInfo, null, 2));
      // Continue anyway if we have the basic elements
      const elementCount = await page.evaluate(() =>
          document.querySelectorAll("[data-resume-page]").length
      );

      if (elementCount < expectedPageCount) {
        throw new Error(`Not enough resume page elements found: ${elementCount} < ${expectedPageCount}`);
      }
    }

    console.log("PDF Service - Content validation passed");
    console.log("PDF Service - Waiting for final rendering...");
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