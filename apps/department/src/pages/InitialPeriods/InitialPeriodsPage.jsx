import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmModal, getIntlLocale, useAuth, usePeriods, useApproveInitialPeriods } from "@awm/shared";
import { validateDateRange, validateAllPeriods } from "../../utils/periodValidation";
import "./InitialPeriodsPage.css";

const PERIOD_CONFIG = [
    { key: "directions", stage: "DirectionSubmission", labelKey: "department.directionsFormationPeriod" },
    { key: "selection", stage: "TopicSelection", labelKey: "department.topicSelectionPeriod" },
];

function getEmptyFormData() {
    return {
        directions: { startDate: "", endDate: "" },
        selection: { startDate: "", endDate: "" },
    };
}

export default function InitialPeriodsPage() {
    const { t, i18n } = useTranslation();
    const locale = getIntlLocale(i18n.language);
    const { user } = useAuth();
    
    const departmentId = user?.departmentId;
    const academicYearId = user?.currentAcademicYearId;

    const { data: periodsData = [], isLoading } = usePeriods(departmentId, academicYearId);
    const approveMutation = useApproveInitialPeriods(departmentId, academicYearId);

    const [formData, setFormData] = useState(getEmptyFormData());
    const [isApproved, setIsApproved] = useState(false);
    const [errors, setErrors] = useState({});
    const [orderError, setOrderError] = useState("");
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    useEffect(() => {
        if (periodsData && periodsData.length > 0) {
            const initialPeriods = periodsData.filter(p => 
                ["DirectionSubmission", "TopicSelection"].includes(p.workflowStage)
            );
            
            if (initialPeriods.length > 0) {
                const newFormData = getEmptyFormData();
                initialPeriods.forEach(p => {
                    const config = PERIOD_CONFIG.find(c => c.stage === p.workflowStage);
                    if (config) {
                        newFormData[config.key] = {
                            startDate: p.startDate ? p.startDate.split('T')[0] : "",
                            endDate: p.endDate ? p.endDate.split('T')[0] : "",
                        };
                    }
                });
                setFormData(newFormData);
                // If periods exist in backend, they are considered approved for view mode
                setIsApproved(true);
            }
        }
    }, [periodsData]);

    const handleDateChange = (periodKey, field, value) => {
        setFormData((prev) => ({
            ...prev,
            [periodKey]: { ...prev[periodKey], [field]: value },
        }));
        setErrors((prev) => ({ ...prev, [periodKey]: undefined }));
        setOrderError("");
    };

    const allDatesFilled = PERIOD_CONFIG.every(
        ({ key }) => formData[key].startDate && formData[key].endDate
    );

    const handleSubmit = () => {
        const newErrors = {};
        let hasError = false;

        for (const { key } of PERIOD_CONFIG) {
            const result = validateDateRange(formData[key].startDate, formData[key].endDate);
            if (!result.valid) {
                newErrors[key] = result.error === "startAfterEnd"
                    ? t("department.validationStartBeforeEnd")
                    : t("department.validationPeriodsOrder");
                hasError = true;
            }
        }

        setErrors(newErrors);

        if (hasError) {
            setOrderError("");
            return;
        }

        const periodsForValidation = PERIOD_CONFIG.map(({ key }) => ({
            key,
            startDate: formData[key].startDate,
            endDate: formData[key].endDate,
        }));

        const orderResult = validateAllPeriods(periodsForValidation);
        if (!orderResult.valid) {
            setOrderError(t("department.validationPeriodsOverlap"));
            return;
        }

        setOrderError("");
        setIsConfirmOpen(true);
    };

    const handleConfirm = async () => {
        const payload = PERIOD_CONFIG.map(({ key, stage }) => ({
            workflowStage: stage,
            startDate: new Date(formData[key].startDate).toISOString(),
            endDate: new Date(formData[key].endDate).toISOString(),
        }));

        try {
            await approveMutation.mutateAsync(payload);
            setIsApproved(true);
            setIsConfirmOpen(false);
        } catch {
            setOrderError("Failed to save periods. Please try again.");
        }
    };

    const handleEdit = () => {
        setIsApproved(false);
        setErrors({});
        setOrderError("");
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString(locale, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    if (isLoading) {
        return <div className="initial-periods-page"><p>{t('common.loading', 'Loading...')}</p></div>;
    }

    if (!departmentId || !academicYearId) {
        return <div className="initial-periods-page"><p>{t('department.noDepartmentSelected', 'Department or Academic Year missing.')}</p></div>;
    }

    // ===================== SUMMARY VIEW =====================
    if (isApproved) {
        return (
            <div className="initial-periods-page">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">{t("department.initialPeriodsTitle")}</h1>
                        <p className="page-subtitle">{t("department.initialPeriodsSubtitle")}</p>
                    </div>
                </div>

                <div className="periods-summary">
                    {PERIOD_CONFIG.map(({ key, labelKey }) => (
                        <div key={key} className="period-summary-card">
                            <div className="period-summary-card__info">
                                <span className="period-summary-card__name">{t(labelKey)}</span>
                                <span className="period-summary-card__dates">
                                    {formatDate(formData[key].startDate)} — {formatDate(formData[key].endDate)}
                                </span>
                            </div>
                            <span className="period-summary-card__status">
                                {t("department.approved")}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="periods-summary__actions">
                    <button className="button secondary-button" onClick={handleEdit}>
                        {t("department.editPeriods")}
                    </button>
                </div>
            </div>
        );
    }

    // ===================== FORM VIEW =====================
    return (
        <div className="initial-periods-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">{t("department.initialPeriodsTitle")}</h1>
                    <p className="page-subtitle">{t("department.initialPeriodsSubtitle")}</p>
                </div>
            </div>

            <div className="periods-form">
                {PERIOD_CONFIG.map(({ key, labelKey }) => (
                    <div key={key} className="period-group">
                        <div className="period-group__title">{t(labelKey)}</div>
                        <div className="period-group__dates">
                            <div className="period-group__date-field">
                                <label>{t("common.startDate")}</label>
                                <input
                                    type="date"
                                    value={formData[key].startDate}
                                    onChange={(e) => handleDateChange(key, "startDate", e.target.value)}
                                />
                            </div>
                            <div className="period-group__date-field">
                                <label>{t("common.endDate")}</label>
                                <input
                                    type="date"
                                    value={formData[key].endDate}
                                    onChange={(e) => handleDateChange(key, "endDate", e.target.value)}
                                />
                            </div>
                        </div>
                        {errors[key] && (
                            <div className="period-group__error">{errors[key]}</div>
                        )}
                    </div>
                ))}

                {orderError && (
                    <div className="periods-form__order-error">{orderError}</div>
                )}

                <div className="periods-form__actions">
                    <button
                        className="button primary-button"
                        disabled={!allDatesFilled || approveMutation.isPending}
                        onClick={handleSubmit}
                    >
                        {t("department.approveInitialPeriods")}
                    </button>
                </div>
            </div>

            <ConfirmModal
                isOpen={isConfirmOpen}
                title={t("department.approveInitialPeriods")}
                message={t("department.periodsApproved")}
                onConfirm={handleConfirm}
                onCancel={() => setIsConfirmOpen(false)}
            />
        </div>
    );
}
