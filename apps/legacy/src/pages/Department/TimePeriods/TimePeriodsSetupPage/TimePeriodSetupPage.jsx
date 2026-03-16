import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import CommissionSetupStep from "./steps/CommissionSetupStep";
import DistributionStep from "./steps/DistributionStep";
import FinalizationStep from "./steps/FinalizationStep";

import "./TimePeriodSetupPage.css";

const studentsMock = [
    { id: "s1", name: "Студент 1", teamId: "t1" },
    { id: "s2", name: "Студент 2", teamId: "t1" },
    { id: "s3", name: "Студент 3", teamId: null },
    { id: "s4", name: "Студент 4", teamId: "t2" },
    { id: "s5", name: "Студент 5", teamId: "t2" },
    { id: "s6", name: "Студент 6", teamId: null },
    { id: "s7", name: "Студент 7", teamId: "t1" },
    { id: "s8", name: "Студент 8", teamId: "t3" },
    { id: "s9", name: "Студент 9", teamId: null },
    { id: "s10", name: "Студент 10", teamId: "t2" },
    { id: "s11", name: "Студент 11", teamId: "t1" },
    { id: "s12", name: "Студент 12", teamId: null },
    { id: "s13", name: "Студент 13", teamId: "t3" },
    { id: "s14", name: "Студент 14", teamId: "t2" },
    { id: "s15", name: "Студент 15", teamId: null },
    { id: "s16", name: "Студент 16", teamId: "t1" },
    { id: "s17", name: "Студент 17", teamId: "t3" },
    { id: "s18", name: "Студент 18", teamId: null },
    { id: "s19", name: "Студент 19", teamId: "t2" },
    { id: "s20", name: "Студент 20", teamId: "t1" },
    { id: "s21", name: "Студент 21", teamId: null },
    { id: "s22", name: "Студент 22", teamId: "t3" },
    { id: "s23", name: "Студент 23", teamId: "t2" },
    { id: "s24", name: "Студент 24", teamId: null },
    { id: "s25", name: "Студент 25", teamId: "t1" },
    { id: "s26", name: "Студент 26", teamId: "t3" },
    { id: "s27", name: "Студент 27", teamId: null },
    { id: "s28", name: "Студент 28", teamId: "t2" },
    { id: "s29", name: "Студент 29", teamId: "t1" },
    { id: "s30", name: "Студент 30", teamId: null },
    { id: "s31", name: "Студент 31", teamId: "t3" },
    { id: "s32", name: "Студент 32", teamId: "t2" },
    { id: "s33", name: "Студент 33", teamId: null },
    { id: "s34", name: "Студент 34", teamId: "t1" },
    { id: "s35", name: "Студент 35", teamId: "t3" },
    { id: "s36", name: "Студент 36", teamId: null },
    { id: "s37", name: "Студент 37", teamId: "t2" },
    { id: "s38", name: "Студент 38", teamId: "t1" },
    { id: "s39", name: "Студент 39", teamId: null },
    { id: "s40", name: "Студент 40", teamId: "t3" },
    { id: "s41", name: "Студент 41", teamId: "t2" },
    { id: "s42", name: "Студент 42", teamId: null },
    { id: "s43", name: "Студент 43", teamId: "t1" },
    { id: "s44", name: "Студент 44", teamId: "t3" },
    { id: "s45", name: "Студент 45", teamId: null },
    { id: "s46", name: "Студент 46", teamId: "t2" },
    { id: "s47", name: "Студент 47", teamId: "t1" },
    { id: "s48", name: "Студент 48", teamId: null },
    { id: "s49", name: "Студент 49", teamId: "t3" },
    { id: "s50", name: "Студент 50", teamId: "t2" },
    { id: "s51", name: "Студент 51", teamId: null },
    { id: "s52", name: "Студент 52", teamId: "t1" },
    { id: "s53", name: "Студент 53", teamId: "t3" },
    { id: "s54", name: "Студент 54", teamId: null },
    { id: "s55", name: "Студент 55", teamId: "t2" },
    { id: "s56", name: "Студент 56", teamId: "t1" },
    { id: "s57", name: "Студент 57", teamId: null },
    { id: "s58", name: "Студент 58", teamId: "t3" },
    { id: "s59", name: "Студент 59", teamId: "t2" },
    { id: "s60", name: "Студент 60", teamId: null },
    { id: "s61", name: "Студент 61", teamId: "t1" },
    { id: "s62", name: "Студент 62", teamId: "t3" },
    { id: "s63", name: "Студент 63", teamId: null },
    { id: "s64", name: "Студент 64", teamId: "t2" },
    { id: "s65", name: "Студент 65", teamId: "t1" },
    { id: "s66", name: "Студент 66", teamId: null },
    { id: "s67", name: "Студент 67", teamId: "t3" },
    { id: "s68", name: "Студент 68", teamId: "t2" },
    { id: "s69", name: "Студент 69", teamId: null },
    { id: "s70", name: "Студент 70", teamId: "t1" },
    { id: "s71", name: "Студент 71", teamId: "t3" },
    { id: "s72", name: "Студент 72", teamId: null },
    { id: "s73", name: "Студент 73", teamId: "t2" },
    { id: "s74", name: "Студент 74", teamId: "t1" },
    { id: "s75", name: "Студент 75", teamId: null },
    { id: "s76", name: "Студент 76", teamId: "t3" },
    { id: "s77", name: "Студент 77", teamId: "t2" },
    { id: "s78", name: "Студент 78", teamId: null },
    { id: "s79", name: "Студент 79", teamId: "t1" },
    { id: "s80", name: "Студент 80", teamId: "t3" },
    { id: "s81", name: "Студент 81", teamId: null },
    { id: "s82", name: "Студент 82", teamId: "t2" },
    { id: "s83", name: "Студент 83", teamId: "t1" },
    { id: "s84", name: "Студент 84", teamId: null },
    { id: "s85", name: "Студент 85", teamId: "t3" },
    { id: "s86", name: "Студент 86", teamId: "t2" },
    { id: "s87", name: "Студент 87", teamId: null },
    { id: "s88", name: "Студент 88", teamId: "t1" },
    { id: "s89", name: "Студент 89", teamId: "t3" },
    { id: "s90", name: "Студент 90", teamId: null },
    { id: "s91", name: "Студент 91", teamId: "t2" },
    { id: "s92", name: "Студент 92", teamId: "t1" },
    { id: "s93", name: "Студент 93", teamId: null },
    { id: "s94", name: "Студент 94", teamId: "t3" },
    { id: "s95", name: "Студент 95", teamId: "t2" },
    { id: "s96", name: "Студент 96", teamId: null },
    { id: "s97", name: "Студент 97", teamId: "t1" },
    { id: "s98", name: "Студент 98", teamId: "t3" },
    { id: "s99", name: "Студент 99", teamId: null },
    { id: "s100", name: "Студент 100", teamId: "t2" }
];

export default function TimePeriodSetupPage() {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [commissions, setCommissions] = useState([]);
    const [freeStudents, setFreeStudents] = useState(studentsMock);

    const [slotDate, setSlotDate] = useState("");
    const [slotTime, setSlotTime] = useState("");
    const [slotCommissionId, setSlotCommissionId] = useState("");

    // --- ЛОГИКА НАВИГАЦИИ НАЗАД ---
    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        } else {
            // Если мы на первом шаге, выходим со страницы
            navigate(-1);
        }
    };

    const removeCommission = (id) => {
        setCommissions(prev => prev.filter(c => c.id !== id));
    };

    const addCommission = () => {
        setCommissions(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                name: `Комиссия ${prev.length + 1}`,
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

    const addSessionToCommission = () => {
        if (!slotDate || !slotTime || !slotCommissionId) return;

        setCommissions(prev =>
            prev.map(c =>
                c.id === slotCommissionId
                    ? {
                        ...c,
                        sessions: [
                            ...c.sessions,
                            {
                                sessionId: crypto.randomUUID(),
                                date: slotDate,
                                time: slotTime,
                                students: [],
                            },
                        ],
                    }
                    : c
            )
        );

        setSlotDate("");
        setSlotTime("");
        setSlotCommissionId("");
    };

    const autoDistribute = () => {
        const allSessions = commissions.flatMap(c =>
            c.sessions.map(s => ({
                commissionId: c.id,
                sessionId: s.sessionId,
            }))
        );

        if (allSessions.length === 0) return;

        let index = 0;
        const updated = commissions.map(c => ({
            ...c,
            sessions: c.sessions.map(s => ({
                ...s,
                students: [],
            })),
        }));

        freeStudents.forEach(student => {
            const target = allSessions[index % allSessions.length];
            index++;

            const commission = updated.find(c => c.id === target.commissionId);
            const session = commission.sessions.find(
                s => s.sessionId === target.sessionId
            );

            session.students.push(student);
        });

        setCommissions(updated);
        setFreeStudents([]);
    };

    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;

        let movedStudent = null;

        // FROM FREE
        if (source.droppableId === "free") {
            movedStudent = freeStudents.find(s => s.id === draggableId);
            setFreeStudents(prev => prev.filter(s => s.id !== draggableId));
        }

        // FROM COMMISSION
        if (source.droppableId !== "free") {
            const [fromCommissionId, fromSessionId] = source.droppableId.split("|");

            setCommissions(prev =>
                prev.map(c =>
                    c.id !== fromCommissionId
                        ? c
                        : {
                            ...c,
                            sessions: c.sessions.map(s => {
                                if (s.sessionId !== fromSessionId) return s;
                                const student = s.students.find(st => st.id === draggableId);
                                movedStudent = student;
                                return {
                                    ...s,
                                    students: s.students.filter(st => st.id !== draggableId),
                                };
                            }),
                        }
                )
            );
        }

        if (!movedStudent) return;

        // TO FREE
        if (destination.droppableId === "free") {
            setFreeStudents(prev => [...prev, movedStudent]);
            return;
        }

        // TO COMMISSION
        const [toCommissionId, toSessionId] = destination.droppableId.split("|");

        setCommissions(prev =>
            prev.map(c =>
                c.id !== toCommissionId
                    ? c
                    : {
                        ...c,
                        sessions: c.sessions.map(s =>
                            s.sessionId !== toSessionId
                                ? s
                                : {
                                    ...s,
                                    students: [...s.students, movedStudent],
                                }
                        ),
                    }
            )
        );
    };

    const steps = [
        { id: 1, title: "Создание комиссий" },
        { id: 2, title: "Планирование и распределение" },
        { id: 3, title: "Финализация" },
    ];

    const progressPercent = Math.round(
        ((currentStep - 1) / (steps.length - 1)) * 100
    );

    return (
        <div className="setup-page">
            {/* ИСПОЛЬЗУЕМ НОВУЮ ФУНКЦИЮ handleBack */}
            <button className="back-button" onClick={handleBack}>
                <ArrowLeft size={18} /> Назад
            </button>

            <h1>Настройка периода</h1>

            <div className="progress-section">
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <p className="progress-label">
                    Этап {currentStep} из {steps.length} — {steps[currentStep - 1].title}
                </p>
            </div>

            <div className="setup-main">
                {currentStep === 1 && (
                    <CommissionSetupStep
                        commissions={commissions}
                        addCommission={addCommission}
                        updateCommission={updateCommission}
                        removeCommission={removeCommission}
                        onNext={() => setCurrentStep(2)}
                    />
                )}

                {currentStep === 2 && (
                    <DistributionStep
                        commissions={commissions}
                        freeStudents={freeStudents}
                        slotDate={slotDate}
                        slotTime={slotTime}
                        slotCommissionId={slotCommissionId}
                        setSlotDate={setSlotDate}
                        setSlotTime={setSlotTime}
                        setSlotCommissionId={setSlotCommissionId}
                        addSessionToCommission={addSessionToCommission}
                        autoDistribute={autoDistribute}
                        onDragEnd={onDragEnd}
                        onNext={() => setCurrentStep(3)}
                    />
                )}

                {currentStep === 3 && (
                    <FinalizationStep
                        commissions={commissions}
                        freeStudents={freeStudents}
                        totalStudents={studentsMock.length}
                        onFinish={() => navigate("/department/time-periods")}
                    />
                )}
            </div>
        </div>
    );
}