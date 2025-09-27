import { useState } from 'react';
import { UpgradeDialog } from '@/components/Dialogs/UpgradeDialog';
import { LIMIT_TYPES } from '@/components/constants';
import { determineLimitType, extractLimitNumbers } from "@/lib/utils";

export function useLimitHandler() {
    const [upgradeDialog, setUpgradeDialog] = useState(null);

    const parseError = (error) => {
        const detail = error.response?.data?.detail || '';

        if (!detail.includes('limit reached')) return null;

        const { current, limit } = extractLimitNumbers(detail);
        const limitType = determineLimitType(detail);

        return { current, limit, limitType };
    };

    const handleLimitError = (error, fallbackLimitType = LIMIT_TYPES.RESUME) => {
        const limitInfo = parseError(error);

        if (!limitInfo) {
            return false; // Not a limit error
        }

        // Set dialog data (opening it)
        setUpgradeDialog({
            limitType: limitInfo.limitType || fallbackLimitType,
            currentUsage: limitInfo.current,
            currentLimit: limitInfo.limit
        });

        return true; // Was a limit error and handled
    };

    const closeUpgradeDialog = () => {
        setUpgradeDialog(null);
    };

    const UpgradeDialogComponent = () => (
        upgradeDialog ? (
            <UpgradeDialog
                open={true}
                onOpenChange={(open) => !open && closeUpgradeDialog()}
                currentLimit={upgradeDialog.currentLimit}
                currentUsage={upgradeDialog.currentUsage}
                limitType={upgradeDialog.limitType}
            />
        ) : null
    );

    return {
        handleLimitError,
        closeUpgradeDialog,
        UpgradeDialogComponent,
        isUpgradeDialogOpen: !!upgradeDialog
    }
}