import React from "react";
import CommissionCard from "../../../../../components/Department/TimePeriods/SetUp/CommissionCard";

export default function CommissionSetupStep({
                                                commissions,
                                                addCommission,
                                                updateCommission,
                                                removeCommission,
                                                onNext
                                            }) {
    return (
        <>
            <h3>Создание комиссий</h3>

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
                    + Создать комиссию
                </button>

                {commissions.length > 0 && (
                    <button
                        className="btn-primary"
                        onClick={onNext}
                    >
                        Следующий этап
                    </button>
                )}
            </div>
        </>
    );
}
