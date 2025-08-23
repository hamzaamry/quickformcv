export const UnassignedSectionsWarning = ({sections}) => {
    if (sections.length === 0) return null;

    return (
        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
            <p className="font-medium text-yellow-800 mb-1">Unassigned sections:</p>
            <div className="flex flex-wrap gap-1">
                {sections.map((section) => (
                    <span key={section.id} className="text-yellow-700">
            {section.name}
          </span>
                ))}
            </div>
        </div>
    );
};
