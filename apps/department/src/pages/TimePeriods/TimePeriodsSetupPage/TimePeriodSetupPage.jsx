import React, { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import {
    useAuth,
    useOrgUnitEmployees,
    useCreateCommission,
    useAutoDistributeStudents,
    useCommissions,
    useDefenseReadiness,
    useOrgUnitSpecialities,
    usePeriods,
    useUpdateSchedule,
    scheduleApi,
    fetchPreDefenseSchedule
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

const generateSessionsForPeriod = (startDateStr, endDateStr) => {
    if (!startDateStr || !endDateStr) return [];
    const sessions = [];
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);


    const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());


    let count = 0;
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        if (++count > 10) break;

        const dateStr = d.toISOString().split('T')[0];


        const hourStart = 9;
        const hourEnd = 14;

        for (let h = hourStart; h < hourEnd; h++) {
            for (let m = 0; m < 60; m += 30) {
                const timeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
                const sessionKey = `${dateStr}T${timeStr}`;
                sessions.push({
                    sessionId: sessionKey,
                    date: dateStr,
                    time: timeStr,
                    students: []
                });
            }
        }
    }
    return sessions;
};

export default function TimePeriodSetupPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { t } = useTranslation();
    const { user } = useAuth();

    const orgUnitId = user?.orgUnitId;
    const semesterId = user?.currentSemesterId;

    const [currentStep, setCurrentStep] = useState(1);
    const [commissions, setCommissions] = useState([]);


    const { data: specialities = [] } = useOrgUnitSpecialities(orgUnitId);


    const { data: allTeachers = [] } = useOrgUnitEmployees(orgUnitId);
    const teachersList = useMemo(() => {
        return allTeachers.map(t => ({
            id: t.userId || t.id,
            name: t.fullName || "Unknown"
        }));
    }, [allTeachers]);


    const { data: students = [] } = useDefenseReadiness({ orgUnitId, semesterId });


    const createCommissionMutation = useCreateCommission(orgUnitId, semesterId);
    const autoDistributeMutation = useAutoDistributeStudents();
    const updateScheduleMutation = useUpdateSchedule();


    const { data: periods = [] } = usePeriods(orgUnitId, semesterId);
    const currentPeriod = useMemo(() => {
        const stageId = Number(id);
        return periods.find(p => p.id === stageId);
    }, [periods, id]);


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
            chairman: c.members.find(m => m.roleType === 2)?.userId || "",
            secretary: c.members.find(m => m.roleType === 3)?.userId || "",
            members: c.members.filter(m => m.roleType === 4).map(m => m.userId),
            specialityId: c.specialityId || null,
            preDefenseNumber: c.preDefenseNumber || preDefenseNumber,
            sessions: []
        }));
    }, [existingCommissions, id]);


    const scheduleQueries = useQueries({
        queries: commissions.map(c => ({
            queryKey: ['preDefense', 'schedule', c.dbId],
            queryFn: () => fetchPreDefenseSchedule(c.dbId),
            enabled: !!c.dbId && currentStep === 2
        }))
    });


    React.useEffect(() => {
        if (commissions.length > 0) {
            setCommissions(prev => {
                let changed = false;
                const next = prev.map((c, index) => {
                    const slots = scheduleQueries[index]?.data || [];

                    const sessionsMap = {};


                    if (currentPeriod) {
                        const standardSessions = generateSessionsForPeriod(currentPeriod.startDate, currentPeriod.endDate);
                        standardSessions.forEach(s => {
                            sessionsMap[s.sessionId] = { ...s, students: [] };
                        });
                    }

                    slots.forEach(slot => {
                        const dateStr = slot.date || (slot.defenseDate ? slot.defenseDate.split('T')[0] : "");
                        const timeStr = slot.startTime || (slot.defenseDate && slot.defenseDate.includes('T') ? slot.defenseDate.split('T')[1].substring(0, 5) : "");
                        const sessionKey = `${dateStr}T${timeStr}`;

                        if (!sessionsMap[sessionKey]) {
                            sessionsMap[sessionKey] = {
                                sessionId: sessionKey,
                                date: dateStr,
                                time: timeStr,
                                students: []
                            };
                        }

                        if (slot.studentWorkId) {
                            const exists = sessionsMap[sessionKey].students.some(st => st.id === slot.studentWorkId.toString());
                            if (!exists) {
                                sessionsMap[sessionKey].students.push({
                                    id: slot.studentWorkId.toString(),
                                    name: slot.studentName || "Студент",
                                    topic: slot.topicTitle || "Без темы",
                                    scheduleId: slot.id
                                });
                            }
                        }
                    });

                    const sessions = Object.values(sessionsMap).sort((a, b) => a.sessionId.localeCompare(b.sessionId));


                    const oldSessionsStr = JSON.stringify(c.sessions || []);
                    const newSessionsStr = JSON.stringify(sessions);
                    if (oldSessionsStr !== newSessionsStr) {
                        changed = true;
                        return {
                            ...c,
                            sessions
                        };
                    }
                    return c;
                });

                return changed ? next : prev;
            });
        }
    }, [scheduleQueries, currentPeriod, commissions.length, currentStep]);


    React.useEffect(() => {
        if (filteredCommissions.length > 0 && commissions.length === 0) {
            setCommissions(filteredCommissions);
        }
    }, [filteredCommissions, commissions.length]);


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
        const { preDefenseNumber } = getCommissionTypeAndNumber(id);
        setCommissions(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                name: `${t('department.commissionLabel', 'Комиссия')} ${prev.length + 1}`,
                chairman: "",
                secretary: "",
                members: [],
                specialityId: null,
                preDefenseNumber: preDefenseNumber || 1,
                sessions: [],
            },
        ]);
    };

    const updateCommission = (updated) => {
        setCommissions(prev =>
            prev.map(c => (c.id === updated.id ? updated : c))
        );
    };


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
                    specialityId: c.specialityId || null,
                    commissionTypeId,
                    preDefenseNumber: c.preDefenseNumber || preDefenseNumber,
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
            setCurrentStep(2);
        } catch (error) {
            console.error("Auto distribution failed", error);
            alert(error.message || t('department.distributionFailed', 'Ошибка при распределении'));
        }
    };

    const handleMoveStudent = async (scheduleId, destCommissionDbId, date, time) => {
        try {
            const defenseDate = `${date}T${time}:00`;
            await updateScheduleMutation.mutateAsync({
                id: scheduleId,
                commissionId: Number(destCommissionDbId),
                defenseDate: defenseDate
            });
        } catch (error) {
            console.error("Failed to move student", error);
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
            <button className="back-button ripple-effect" onClick={handleBack}>
                <ArrowLeft size={18} /> {t('common.back')}
            </button>

            <h1>{t('department.setupPeriod', 'Настройка этапа')}</h1>

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
                        specialities={specialities}
                    />
                )}

                {currentStep === 2 && (
                    <DistributionStep
                        commissions={commissions}
                        setCommissions={setCommissions}
                        autoDistribute={handleAutoDistribute}
                        onNext={() => setCurrentStep(3)}
                        students={students}
                        onMoveStudent={handleMoveStudent}
                    />
                )}

                {currentStep === 3 && (
                    <FinalizationStep
                        commissions={commissions}
                        onFinish={() => navigate("/periods?tab=defenses")}
                    />
                )}
            </div>
        </div>
    );
}