import { exportResumeToPDF } from "@/app/builder/services/pdfExportService";

export async function POST(request, { params }) {
  try {
    const { id: resumeId } = await params;
    if (!resumeId) {
      return Response.json({ error: "Resume ID is required" }, { status: 400 });
    }
    const { resumeData } = await request.json();
    if (!resumeData?.metadata) {
      return Response.json(
        {
          error: "Resume data with metadata is required",
          received: {
            hasResumeData: !!resumeData,
            hasMetadata: !!resumeData?.metadata,
          },
        },
        { status: 400 },
      );
    }

    let correctedResumeData = { ...resumeData };
    if (resumeData.pages && Array.isArray(resumeData.pages.pages)) {
      correctedResumeData.metadata = {
        ...correctedResumeData.metadata,
        pages: resumeData.pages.pages,
      };
    } else {
      console.warn(
        "resumeData.pages.pages not found or not an array. Assuming single page or old data format.",
      );
    }
    correctedResumeData.id = resumeId;
    console.log("Generating PDF for resume:", resumeId);
    const pdfBuffer = await exportResumeToPDF(correctedResumeData);

    // Generate filename
    const firstName = correctedResumeData.basics?.firstName || "Resume";
    const lastName = correctedResumeData.basics?.lastName || "Export";
    const filename = `${firstName}_${lastName}_Resume.pdf`;

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("PDF Export Error:", error);
    return Response.json(
      {
        error: "Failed to generate PDF",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
