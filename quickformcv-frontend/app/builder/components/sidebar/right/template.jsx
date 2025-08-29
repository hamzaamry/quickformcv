"use client";

import { Layout } from "lucide-react";
import { useParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { templates } from "@/app/builder/templates";
import { useResumeData } from "@/hooks/useResumeData";

export default function Template() {
  const params = useParams();
  const resumeId = params?.id;
  const { metadata, changeTemplate, isUpdating } = useResumeData(resumeId);
  const currentTemplateName = metadata?.template;

  const handleTemplateChange = async (templateName) => {
    if (isUpdating || currentTemplateName === templateName) return;
    await changeTemplate(templateName);
  };

  return (
    <Accordion type="single" defaultValue="template" collapsible>
      <AccordionItem value="template" className="border-none">
        <AccordionTrigger className="hover:no-underline p-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <Layout className="h-4 w-4" />
              <div className="text-primary-style font-medium text-base">
                Template
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="px-4 pb-4 space-y-2 mt-2">
            <div className="grid grid-cols-3 gap-2">
              {" "}
              {Object.entries(templates).map(([key, template]) => (
                <div
                  key={key}
                  className={`relative aspect-[1/1.4] overflow-hidden rounded-lg border cursor-pointer transition-all ${
                    currentTemplateName === key
                      ? "ring-2 ring-primary shadow-md"
                      : "shadow-sm hover:shadow"
                  }`}
                  onClick={() => handleTemplateChange(key)}
                >
                  <img
                    src={template.image}
                    alt={template.name}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 text-xs truncate px-1">
                    {template.name}
                  </div>
                  {isUpdating && currentTemplateName !== key && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
