import {RESUME_SECTIONS} from "../../constants/constants";

export const CurrentPageInfo = ({activePage}) => (
    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
        <div className="font-medium mb-1">
            Currently viewing: {activePage?.name}
        </div>
        <div>
            Sections: {activePage?.sections.length || 0} / {RESUME_SECTIONS.length}
        </div>
    </div>
);
