"use client";

import { FileText } from "lucide-react";
import { useParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
//import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useResumeData } from "@/hooks/useResumeData";

export default function PageFormat() {
  const params = useParams();
  const resumeId = params?.id;
  const { page, updatePage, isUpdating } = useResumeData(resumeId);

  const handleMarginChange = (value) => {
    updatePage({ margin: value[0] });
  };

  /*  const handlePageNumberChange = (checked) => {
      updatePage({
        options: {
          ...page?.options,
          page_numbers: checked,
        },
      });
    };

    const handleBreakLineChange = (checked) => {
      updatePage({
        options: {
          ...page?.options,
          break_line: checked,
        },
      });
    };*/

  return (
    <Accordion type="single" defaultValue="pageFormat" collapsible>
      <AccordionItem value="pageFormat" className="border-none">
        <AccordionTrigger className="hover:no-underline p-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <FileText className="h-4 w-4" />
              <div className="text-primary-style font-medium text-base">
                Page format
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="px-4 pb-4 space-y-4">
            <div>
              <div className="space-y-2">
                <Label className="label text-muted-foreground">
                  Margin: {page.margin || 18}px
                </Label>
                <Slider
                  value={[page.margin || 18]}
                  min={18}
                  max={40}
                  step={1}
                  onValueChange={handleMarginChange}
                  className="py-2"
                  disabled={isUpdating}
                />
              </div>
            </div>

            <div className="space-y-3">
              {/*              <div className="flex items-center justify-between">
                <Label className="text-sm text-muted-foreground">
                  Show page number
                </Label>
                <Switch
                  checked={page.options?.page_numbers || false}
                  onCheckedChange={handlePageNumberChange}
                  disabled={isUpdating}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm text-muted-foreground">
                  Show break line
                </Label>
                <Switch
                  checked={page.options?.break_line || false}
                  onCheckedChange={handleBreakLineChange}
                  disabled={isUpdating}
                />
              </div>*/}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
