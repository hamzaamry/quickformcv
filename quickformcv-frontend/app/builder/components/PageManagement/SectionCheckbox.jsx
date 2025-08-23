import {Checkbox} from "@/components/ui/checkbox";

export const SectionCheckbox = ({page, section, onToggle}) => {
    const isAssigned = page.sections.includes(section.id);
    const Icon = section.icon;
    const checkboxId = `${page.id}-${section.id}`;

    return (
        <div className="flex items-center space-x-2">
            <Checkbox
                id={checkboxId}
                checked={isAssigned}
                onCheckedChange={() => onToggle(page.id, section.id)}
                className="h-3 w-3"
            />
            <label
                htmlFor={checkboxId}
                className="text-xs flex items-center gap-1 cursor-pointer flex-1"
            >
                <Icon size={10} className="text-gray-500"/>
                {section.name}
            </label>
        </div>
    );
};
