import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmModal } from "@awm/shared";
import { validateDateRange, validateAllPeriods } from "../../utils/periodValidation";
import "./InitialPeriodsPage.css";

const STORAGE_KEY = "initialPeriods";

const PERIOD_KEYS = ["directions", "topics", "selection"];

const PERIOD_CONFIG = [
    { key: "directions", labelKey: "department.directionsFormationPeriod" },
    { key: "topics", labelKey: "department.topicsFormationPeriod" },
    { key: "selection", labelKey: "department.topicSelectionPeriod" },
];

function getEmptyFormData() {
    return {
        directions: { startDate: "", endDate: "" },
        topics: { startDate: "", endDate: "" },
        selection: { startDate: "", endDate: "" },
    };
}

function loadFromStorage() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            return { formData: parsed.formData, isApproved: parsed.isApproved };
        }
    } catch {
        // ignore corrupt data
    }
    return { formData: getEmptyFormData(), isApproved: false };
}

export default function InitialPeriodsPage() {
    const { t } = useTranslation();

    const [formData, setFormData] = useState(() => loadFromStorage().formData);
    const [isApproved, setIsApproved] = useState(() => loadFromStorage().isApproved);
    const [errors, setErrors] = useState({});
    const [orderError, setOrderError] = useState("");
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    useEffect(() => {
        if (isApproved) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, isApproved }));
        }
    }, [formData, isApproved]);

    const handleDateChange = (periodKey, field, value) => {
        setFormData((prev) => ({
            ...prev,
            [periodKey]: { ...prev[periodKey], [field]: value },
        }));
        setErrors((prev) => ({ ...prev, [periodKey]: undefined }));
        setOrderError("");
    };

    const allDatesFilled = PERIOD_KEYS.every(
        (key) => formData[key].startDate && formData[key].endDate
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

        const periods = PERIOD_CONFIG.map(({ key }) => ({
            key,
            startDate: formData[key].startDate,
            endDate: formData[key].endDate,
        }));

        const orderResult = validateAllPeriods(periods);
        if (!orderResult.valid) {
            setOrderError(t("department.validationPeriodsOverlap"));
            return;
        }

        setOrderError("");
        setIsConfirmOpen(true);
    };

    const handleConfirm = () => {
        setIsApproved(true);
        setIsConfirmOpen(false);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, isApproved: true }));
    };

    const handleEdit = () => {
        setIsApproved(false);
        setErrors({});
        setOrderError("");
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

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
                        disabled={!allDatesFilled}
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
