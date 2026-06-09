import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { 
    useAuth, 
    useOrgUnitEmployees, 
    useAssignedExperts, 
    useSaveExpertAssignments,
    useOrgUnitSpecialities 
} from "@awm/shared";
import "./ExpertAssignmentPage.css";

export default function ExpertAssignmentPage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const orgUnitId = user?.orgUnitId;

    const [selectedSpecialityId, setSelectedSpecialityId] = useState(null);
    const { data: specialities = [] } = useOrgUnitSpecialities(orgUnitId);

    const { data: teachers = [], isLoading: isLoadingTeachers } = useOrgUnitEmployees(orgUnitId);
    const { data: expertAssignments = [], isLoading: isLoadingExperts } = useAssignedExperts(orgUnitId);
    const saveMutation = useSaveExpertAssignments(orgUnitId);

    const [assignmentsState, setAssignmentsState] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    
    useEffect(() => {
        if (expertAssignments && teachers) {
            const initialMap = {};
            teachers.forEach(t => {
                initialMap[t.userId || t.id] = {
                    1: false, 
                    2: false, 
                    3: false  
                };
            });
            expertAssignments.forEach(a => {
                if (initialMap[a.userId]) {
                    initialMap[a.userId][a.checkTypeId] = a.isActive;
                }
            });
            setAssignmentsState(initialMap);
        }
    }, [expertAssignments, teachers]);

    const handleToggleCheck = (userId, checkTypeId) => {
        setAssignmentsState(prev => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                [checkTypeId]: !prev[userId]?.[checkTypeId]
            }
        }));
        setSaveSuccess(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveSuccess(false);
        try {
            const assignments = [];
            Object.entries(assignmentsState).forEach(([userIdStr, types]) => {
                const userId = Number(userIdStr);
                Object.entries(types).forEach(([checkTypeIdStr, isActive]) => {
                    const checkTypeId = Number(checkTypeIdStr);
                    assignments.push({
                        userId,
                        checkTypeId,
                        isActive
                    });
                });
            });

            await saveMutation.mutateAsync({
                orgUnitId,
                assignments
            });
            setSaveSuccess(true);
        } catch (error) {
            console.error("Failed to save expert assignments", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoadingTeachers || isLoadingExperts) {
        return (
            <div className="expert-assignment-page">
                <p>{t("common.loading", "Loading...")}</p>
            </div>
        );
    }

    if (!orgUnitId) {
        return (
            <div className="expert-assignment-page">
                <p>{t("department.noDepartmentSelected", "No department selected.")}</p>
            </div>
        );
    }

    return (
        <div className="expert-assignment-page">
            {specialities.length > 0 && (
                <div className="speciality-scope-selector">
                    <label className="speciality-scope-label">{t('department.speciality', 'Специальность')}:</label>
                    <select
                        value={selectedSpecialityId || ""}
                        onChange={(e) => setSelectedSpecialityId(e.target.value ? Number(e.target.value) : null)}
                        className="speciality-scope-select"
                    >
                        <option value="">{t('department.allSpecialities', 'Общее для кафедры (По умолчанию)')}</option>
                        {specialities.map(s => (
                            <option key={s.id} value={s.id}>{s.code} - {s.title}</option>
                        ))}
                    </select>
                </div>
            )}
            <div className="page-header">
                <div className="ea-header-actions">
                    {saveSuccess && (
                        <span className="ea-save-success-msg">
                            ✓ {t("common.saved", "Saved successfully")}
                        </span>
                    )}
                    <button
                        className="ea-bulk-btn"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? t("common.saving", "Saving...") : t("common.save", "Save Changes")}
                    </button>
                </div>
            </div>

            <div className="ea-table-wrapper">
                <table className="ea-table">
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>{t("department.student", "Teacher")}</th>
                            <th>{t("department.position", "Position")}</th>
                            <th style={{ textAlign: 'center' }}>{t("department.normocontroller", "NormControl")}</th>
                            <th style={{ textAlign: 'center' }}>{t("department.plagiarismExpert", "AntiPlagiarism")}</th>
                            <th style={{ textAlign: 'center' }}>{t("student.softwareCheck", "Software Check")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map((teacher, idx) => {
                            const userId = teacher.userId || teacher.id;
                            const isNorm = assignmentsState[userId]?.[1] || false;
                            const isPlag = assignmentsState[userId]?.[2] || false;
                            const isSoft = assignmentsState[userId]?.[3] || false;

                            return (
                                <tr key={userId}>
                                    <td>{idx + 1}</td>
                                    <td className="ea-student-name">{teacher.fullName}</td>
                                    <td>{teacher.positionTitle || "—"}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <input
                                            type="checkbox"
                                            className="ea-checkbox"
                                            checked={isNorm}
                                            onChange={() => handleToggleCheck(userId, 1)}
                                        />
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <input
                                            type="checkbox"
                                            className="ea-checkbox"
                                            checked={isPlag}
                                            onChange={() => handleToggleCheck(userId, 2)}
                                        />
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <input
                                            type="checkbox"
                                            className="ea-checkbox"
                                            checked={isSoft}
                                            onChange={() => handleToggleCheck(userId, 3)}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                        {teachers.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center' }}>
                                    {t("department.teachersNotFound", "No teachers found.")}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
