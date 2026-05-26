import React, { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { 
    useAuth,
    useStaffByDepartment,
    useCreateCommission,
    useAutoDistributeStudents,
    useCommissions
} from "@awm/shared";

import CommissionSetupStep from "./steps/CommissionSetupStep";
import DistributionStep from "./steps/DistributionStep";
import FinalizationStep from "./steps/FinalizationStep";

import "./TimePeriodSetupPage.css";

const getCommissionTypeAndNumber = (stageId) => {
    const id = Number(stageId);
    if (id === 5) return { commissionTypeId: 1, preDefenseNumber: 1 };
    if (id === 6) return { commissionTypeId: 1, preDefenseNumber: 2 };
    if (id === 7) return { commissionTypeId: 1, preDefenseNumber: 3 };
    if (id === 8) return { commissionTypeId: 2, preDefenseNumber: null };
    return { commissionTypeId: 1, preDefenseNumber: 1 };
};

export default function TimePeriodSetupPage() {
    const navigate = useNavigate();
    const { id } = useParams(); // Stage ID (e.g. 5, 6, 7, 8)
    const { t } = useTranslation();
    const { user } = useAuth();

    const orgUnitId = user?.orgUnitId;
    const semesterId = user?.currentSemesterId;

    const [currentStep, setCurrentStep] = useState(1);
    const [commissions, setCommissions] = useState([]);
    
    // Fetch teachers/staff for commission selection
    const { data: allTeachers = [] } = useStaffByDepartment(orgUnitId);
    const teachersList = useMemo(() => {
        return allTeachers.map(t => ({
            id: t.userId || t.id,
            name: t.fullName || "Unknown"
        }));
    }, [allTeachers]);

    // Backend mutations
    const createCommissionMutation = useCreateCommission(orgUnitId, semesterId);
    const autoDistributeMutation = useAutoDistributeStudents();

    // Fetch existing commissions to populate if any exist in DB
    const { data: existingCommissions = [] } = useCommissions(orgUnitId, semesterId);
    const filteredCommissions = useMemo(() => {
        const { commissionTypeId, preDefenseNumber } = getCommissionTypeAndNumber(id);
        const filtered = existingCommissions.filter(c => 
            c.commissionTypeId === commissionTypeId && 
            c.preDefenseNumber === preDefenseNumber
        );
        return filtered.map(c => ({
            id: c.id.toString(),
            dbId: c.id,
            name: c.name,
            chairman: c.members.find(m => m.roleType === 1)?.userId || "",
            secretary: c.members.find(m => m.roleType === 3)?.userId || "",
            members: c.members.filter(m => m.roleType === 2).map(m => m.userId),
            sessions: []
        }));
    }, [existingCommissions, id]);

    // Initialize commissions state with existing ones
    React.useEffect(() => {
        if (filteredCommissions.length > 0 && commissions.length === 0) {
            setCommissions(filteredCommissions);
        }
    }, [filteredCommissions, commissions.length]);

    // --- ЛОГИКА НАВИГАЦИИ НАЗАД ---
    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        } else {
            navigate(-1);
        }
    };

    const removeCommission = (commissionId) => {
        setCommissions(prev => prev.filter(c => c.id !== commissionId));
    };

    const addCommission = () => {
        setCommissions(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                name: `${t('department.commissionLabel')} ${prev.length + 1}`,
                chairman: "",
                secretary: "",
                members: [],
                sessions: [],
            },
        ]);
    };

    const updateCommission = (updated) => {
        setCommissions(prev =>
            prev.map(c => (c.id === updated.id ? updated : c))
        );
    };

    // Step 1 Finish: Save designed commissions to backend
    const handleSaveCommissions = async () => {
        const { commissionTypeId, preDefenseNumber } = getCommissionTypeAndNumber(id);
        const savedCommissions = [];
        
        try {
            for (const c of commissions) {
                if (c.dbId) {
                    savedCommissions.push(c);
                    continue;
                }
                const payload = {
                    orgUnitId,
                    semesterId,
                    specialityId: null,
                    commissionTypeId,
                    preDefenseNumber,
                    name: c.name,
                    chairmanUserId: c.chairman,
                    secretaryUserId: c.secretary,
                    memberUserIds: c.members
                };
                const dbId = await createCommissionMutation.mutateAsync(payload);
                savedCommissions.push({ ...c, dbId });
            }
            setCommissions(savedCommissions);
            setCurrentStep(2);
        } catch (error) {
            console.error("Failed to save commissions to backend", error);
        }
    };

    // Step 2 Trigger auto distribute on backend
    const handleAutoDistribute = async () => {
        const { commissionTypeId, preDefenseNumber } = getCommissionTypeAndNumber(id);
        try {
            await autoDistributeMutation.mutateAsync({
                orgUnitId,
                semesterId,
                commissionTypeId,
                preDefenseNumber,
                specialityId: null
            });
            setCurrentStep(3);
        } catch (error) {
            console.error("Auto distribution failed", error);
        }
    };

    const steps = [
        { id: 1, title: t('department.createCommissions') },
        { id: 2, title: t('department.planningDistribution') },
        { id: 3, title: t('department.finalization') },
    ];

    const progressPercent = Math.round(
        ((currentStep - 1) / (steps.length - 1)) * 100
    );

    return (
        <div className="setup-page">
            <button className="back-button" onClick={handleBack}>
                <ArrowLeft size={18} /> {t('common.back')}
            </button>

            <h1>{t('department.setupPeriod')}</h1>

            <div className="progress-section">
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <p className="progress-label">
                    {t('department.stageProgress', { current: currentStep, total: steps.length, title: steps[currentStep - 1].title })}
                </p>
            </div>

            <div className="setup-main">
                {currentStep === 1 && (
                    <CommissionSetupStep
                        commissions={commissions}
                        addCommission={addCommission}
                        updateCommission={updateCommission}
                        removeCommission={removeCommission}
                        onNext={handleSaveCommissions}
                        teachersList={teachersList}
                    />
                )}

                {currentStep === 2 && (
                    <DistributionStep
                        commissions={commissions}
                        autoDistribute={handleAutoDistribute}
                        onNext={() => setCurrentStep(3)}
                    />
                )}

                {currentStep === 3 && (
                    <FinalizationStep
                        commissions={commissions}
                        onFinish={() => navigate("/time-periods")}
                    />
                )}
            </div>
        </div>
    );
}