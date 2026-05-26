import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
    useAuth, 
    useCheckConfigurations, 
    useSaveCheckConfiguration, 
    useDeleteCheckConfiguration 
} from "@awm/shared";
import "./CheckSettingsPage.css";
import shieldCheckIcon from "../../assets/icons/shield-check-icon.svg";
import plusIcon from "../../assets/icons/plus-icon.svg";

// Mapped specialities for department UI representation
const SPECIALITIES = [
    { id: 1, name: "Информационные системы" },
    { id: 2, name: "Вычислительная техника и ПО" },
    { id: 3, name: "Радиотехника, электроника и телекоммуникации" }
];

export default function CheckSettingsPage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const orgUnitId = user?.orgUnitId;

    const { data: configs = [], isLoading } = useCheckConfigurations(orgUnitId);
    const saveMutation = useSaveCheckConfiguration(orgUnitId);
    const deleteMutation = useDeleteCheckConfiguration(orgUnitId);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [checkTypeId, setCheckTypeId] = useState(1); // Default to NormControl
    const [specialityId, setSpecialityId] = useState("");
    const [minPassValue, setMinPassValue] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSave = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        
        try {
            const payload = {
                orgUnitId,
                checkTypeId,
                specialityId: specialityId ? Number(specialityId) : null,
                minimumPassValue: minPassValue ? Number(minPassValue) : null,
                isActive
            };

            await saveMutation.mutateAsync(payload);
            setIsFormOpen(false);
            // Reset form
            setSpecialityId("");
            setMinPassValue("");
            setIsActive(true);
        } catch (error) {
            setErrorMsg(error.message || "Failed to save configuration");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t("admin.confirmDeleteMessage", "Are you sure you want to delete this configuration?"))) {
            try {
                await deleteMutation.mutateAsync(id);
            } catch (error) {
                console.error("Failed to delete configuration", error);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="check-settings-page">
                <p>{t("common.loading", "Loading...")}</p>
            </div>
        );
    }

    return (
        <div className="check-settings-page">
            <div className="page-header">
                <div className="page-header-info">
                    <div className="page-header-icon-bg">
                        <img src={shieldCheckIcon} alt="" className="page-header-icon" />
                    </div>
                    <div>
                        <h1 className="page-title">{t("department.notifyReviews", "Quality Check Settings")}</h1>
                        <p className="page-subtitle">
                            Configure mandatory quality checks and thresholds for department specialities
                        </p>
                    </div>
                </div>
                {!isFormOpen && (
                    <button 
                        className="button primary-button" 
                        onClick={() => setIsFormOpen(true)}
                    >
                        <img src={plusIcon} alt="" className="button-icon" />
                        Add Rule
                    </button>
                )}
            </div>

            {isFormOpen && (
                <div className="cs-form-card">
                    <h3 className="cs-form-title">Create Quality Check Rule</h3>
                    {errorMsg && <p className="cs-error-msg">{errorMsg}</p>}
                    <form onSubmit={handleSave}>
                        <div className="cs-form-grid">
                            <div className="cs-form-field">
                                <label>Check Type</label>
                                <select 
                                    value={checkTypeId} 
                                    onChange={(e) => setCheckTypeId(Number(e.target.value))}
                                    required
                                >
                                    <option value={1}>{t("department.normocontroller", "NormControl")}</option>
                                    <option value={2}>{t("department.plagiarismExpert", "AntiPlagiarism")}</option>
                                    <option value={3}>{t("student.softwareCheck", "Software Check")}</option>
                                </select>
                            </div>

                            <div className="cs-form-field">
                                <label>Speciality (Optional)</label>
                                <select 
                                    value={specialityId} 
                                    onChange={(e) => setSpecialityId(e.target.value)}
                                >
                                    <option value="">All Specialities (Default)</option>
                                    {SPECIALITIES.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            {checkTypeId === 2 && (
                                <div className="cs-form-field">
                                    <label>Minimum Originality (%)</label>
                                    <input 
                                        type="number" 
                                        min="0" 
                                        max="100"
                                        placeholder="e.g. 70"
                                        value={minPassValue} 
                                        onChange={(e) => setMinPassValue(e.target.value)}
                                        required={checkTypeId === 2}
                                    />
                                </div>
                            )}

                            <div className="cs-form-field cs-checkbox-field">
                                <input 
                                    type="checkbox" 
                                    id="isActive"
                                    checked={isActive} 
                                    onChange={(e) => setIsActive(e.target.checked)}
                                />
                                <label htmlFor="isActive">Rule Active</label>
                            </div>
                        </div>

                        <div className="cs-form-actions">
                            <button 
                                type="button" 
                                className="button secondary-button" 
                                onClick={() => setIsFormOpen(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="button primary-button"
                            >
                                Save Rule
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="ea-table-wrapper">
                <table className="ea-table">
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Check Type</th>
                            <th>Speciality</th>
                            <th>Threshold Value</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {configs.map((config, idx) => {
                            const specName = config.specialityName || SPECIALITIES.find(s => s.id === config.specialityId)?.name || "All Specialities (Default)";
                            return (
                                <tr key={config.id}>
                                    <td>{idx + 1}</td>
                                    <td className="ea-student-name">{config.checkTypeName}</td>
                                    <td>{specName}</td>
                                    <td>{config.minimumPassValue != null ? `${config.minimumPassValue}%` : "—"}</td>
                                    <td>
                                        <span className={`cs-status-badge ${config.isActive ? "active" : "inactive"}`}>
                                            {config.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            className="cs-delete-btn" 
                                            onClick={() => handleDelete(config.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {configs.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ textAlign: "center", color: "#9ca3af" }}>
                                    No quality check rules configured. Department-wide defaults apply.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
