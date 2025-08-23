"use client";

import { ClipboardList, Sparkles } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, Label } from "@/components/ui";
import { useResumeData } from "@/hooks/useResumeData";
import { useParams } from "next/navigation";
import { SummarySkeleton } from "@/app/builder/components/skeletons/SummarySkeleton";
import { CHARATERS_LIMIT } from "@/app/builder/constants/constants";
import RichTextEditor from "@/components/shared/RichTextEditor";

export default function Summary() {
  const params = useParams();
  const resumeId = params?.id;
  const {
    summaryContent,
    updateSummary,
    isLoading,
    resumeData,
    getAISummarySuggestion,
    isAILoading,
  } = useResumeData(resumeId);

  const handleSummaryChange = (content) => {
    updateSummary(content);
  };

  const handleAISuggestion = async () => {
    try {
      const response = await getAISummarySuggestion({
        resumeId,
        resumeData,
      });
      updateSummary(response?.data?.summary_suggestion);
    } catch (error) {
      console.error("Error getting AI suggestion:", error);
    }
  };

  return (
    <Accordion type="single" defaultValue="summary" collapsible>
      <AccordionItem value="summary" className="border-none">
        <AccordionTrigger className="hover:no-underline p-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <ClipboardList className="h-5 w-5" />
              <h2 className="text-primary-style font-medium text-base">
                Summary
              </h2>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {isLoading ? (
            <SummarySkeleton />
          ) : (
            <div className="px-4 pb-4 space-y-4">
              <div className="space-y-2">
                <Label className="label" htmlFor="summary">
                  Professional Summary
                </Label>
                <RichTextEditor
                  value={summaryContent || ""}
                  onChange={handleSummaryChange}
                  maxLength={CHARATERS_LIMIT}
                  disabled={isLoading}
                  placeholder="Write a compelling professional summary that highlights your key achievements and skills..."
                />
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex p-[8px] px-3 justify-center items-center rounded-[10px] border border-[#333333] text-[#333333]"
                    onClick={handleAISuggestion}
                    disabled={isAILoading || isLoading}
                  >
                    <Sparkles className="mr-2" />
                    <span className="font-[500] text-[16px]">
                      {isAILoading ? "Generating..." : "suggestion"}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
