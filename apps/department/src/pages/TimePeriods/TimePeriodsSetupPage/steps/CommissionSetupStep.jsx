import React from "react";
import { useTranslation } from "react-i18next";
import { CommissionCard } from "@awm/shared";

export default function CommissionSetupStep({
                                                commissions,
                                                addCommission,
                                                updateCommission,
                                                removeCommission,
                                                onNext
                                            }) {
    const { t } = useTranslation();

    return (
        <>
            <h3>{t('department.createCommissions')}</h3>

            <div className="setup-first">
                {commissions.map(c => (
                    <CommissionCard
                        key={c.id}
                        commission={c}
                        onChange={updateCommission}
                        onRemove={removeCommission}
                    />
                ))}
            </div>

            <div className="setup-actions">
                <button
                    className="btn-add-Commission"
                    onClick={addCommission}
                >
                    {t('department.addCommission')}
                </button>

                {commissions.length > 0 && (
                    <button
                        className="btn-primary"
                        onClick={onNext}
                    >
                        {t('department.nextStage')}
                    </button>
                )}
            </div>
        </>
    );
}
