import { ChevronDown, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { RESUME_SECTIONS } from "../../constants/constants";
import { SectionCheckbox } from "./SectionCheckbox";

export const PageCard = ({
  page,
  isActive,
  onSetActive,
  onRemove,
  canRemove,
  onToggleSection,
}) => (
  <Collapsible>
    <Card className="p-3">
      <div className="flex items-center justify-between mb-2">
        <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:text-blue-600 transition-colors">
          <FileText size={14} />
          {page.name}
          <Badge variant="outline" className="text-xs">
            {page.sections.length}
          </Badge>
          <ChevronDown
            size={12}
            className="transition-transform data-[state=open]:rotate-180"
          />
        </CollapsibleTrigger>

        <div className="flex items-center gap-1">
          <Button
            onClick={() => onSetActive(page.id)}
            size="sm"
            variant={isActive ? "default" : "ghost"}
            className="h-6 px-2 text-xs"
          >
            {isActive ? "Active" : "View"}
          </Button>
          {canRemove && (
            <Button
              onClick={() => onRemove(page.id)}
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-red-100"
              aria-label="Remove page"
            >
              <X size={12} className="text-red-500" />
            </Button>
          )}
        </div>
      </div>

      <CollapsibleContent>
        <div className="space-y-2 mt-2 pt-2 border-t border-gray-100">
          {RESUME_SECTIONS.map((section) => (
            <SectionCheckbox
              key={section.id}
              page={page}
              section={section}
              onToggle={onToggleSection}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Card>
  </Collapsible>
);
