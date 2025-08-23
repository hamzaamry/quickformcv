"use client";

import { FileText, Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePageContext } from "../../../context/PageContext";
import {
  CurrentPageInfo,
  PageCard,
  UnassignedSectionsWarning,
} from "../../PageManagement";
import { MAX_ALLOWED_PAGES } from "../../../constants/constants";

export default function PageManagement() {
  const {
    pages,
    activePageId,
    activePage,
    unassignedSections,
    setActivePageId,
    addPage,
    removePage,
    toggleSectionOnPage,
  } = usePageContext();

  const reachedMaxPages = pages.length >= MAX_ALLOWED_PAGES;

  return (
    <Accordion type="single" defaultValue="pageFormat" collapsible>
      <AccordionItem value="pageFormat" className="border-none">
        <AccordionTrigger className="hover:no-underline p-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <FileText className="h-4 w-4" />
              <div className="text-primary-style font-medium text-base">
                Page management
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {pages.length} page{pages.length !== 1 ? "s" : ""}
            </Badge>
          </div>
        </AccordionTrigger>

        <AccordionContent>
          <div className="px-4 pb-4 space-y-4">
            <Button
              onClick={addPage}
              size="sm"
              className="w-full flex items-center gap-2"
              disabled={reachedMaxPages}
            >
              <Plus size={14} />
              Add New Page
              {reachedMaxPages && (
                <span className="ml-1 text-xs">(max reached)</span>
              )}
            </Button>

            <UnassignedSectionsWarning sections={unassignedSections} />

            <div className="space-y-2">
              {pages.map((page) => (
                <PageCard
                  key={page.id}
                  page={page}
                  isActive={activePageId === page.id}
                  onSetActive={setActivePageId}
                  onRemove={removePage}
                  canRemove={pages.length > 1}
                  onToggleSection={toggleSectionOnPage}
                />
              ))}
            </div>

            <CurrentPageInfo activePage={activePage} />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
