"use client";
import { ResumePreview } from "@/app/builder/components/ResumePreview";
import { useResumeData } from "@/hooks/useResumeData";
import { useParams } from "next/navigation";
import { getTemplateByName } from "@/app/builder/templates";
import { FullPageLoader } from "@/components/ui/loader";
import { usePageContext } from "@/app/builder/context/PageContext";
import PageNavigationTabs from "@/app/builder/components/PageNavigationTabs";

export default function ResumeBuilder() {
  const params = useParams();
  const resumeId = params?.id;
  const { pages, activePageId } = usePageContext();
  const { resumeData, isLoading, isUpdating } = useResumeData(resumeId);
  const templateName = resumeData?.metadata?.template;
  const templateData = getTemplateByName(templateName);
  const activePage = pages.find((page) => page.id === activePageId);

  if (isLoading || isUpdating) return <FullPageLoader />;

  return (
    <div className="absolute inset-0 overflow-hidden flex flex-col">
      <div className="flex-1 overflow-hidden">
        <ResumePreview>
          {templateData && (
            <div key={activePage?.id}>
              <templateData.component
                resumeData={resumeData}
                isPrintMode={false}
                activePage={activePage}
              />
            </div>
          )}
        </ResumePreview>
      </div>
      <PageNavigationTabs />
    </div>
  );
}
