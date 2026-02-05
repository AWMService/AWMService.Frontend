import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import CommissionCard from "../../../components/Department/TimePeriods/SetUp/CommissionCard";
import CommissionScheduleCard from "../../../components/Department/TimePeriods/SetUp/CommissionScheduleCard/CommissionScheduleCard";
import "./TimePeriodSetupPage.css";

/* ===== MOCK STUDENTS ===== */
const studentsMock = [
    { id: "s1", name: "Иванов И.И.", teamId: "t1" },
    { id: "s2", name: "Петров П.П.", teamId: "t1" },
    { id: "s3", name: "Сидоров С.С.", teamId: null },
    { id: "s4", name: "Козлов К.К.", teamId: "t2" },
    { id: "s5", name: "Орлов О.О.", teamId: "t2" },
    { id: "s6", name: "Смирнов С.С.", teamId: null },
];

export default function TimePeriodSetupPage() {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [commissions, setCommissions] = useState([]);
    const [freeStudents, setFreeStudents] = useState(studentsMock);

    /* ===== SLOT FORM (STEP 2) ===== */
    const [slotDate, setSlotDate] = useState("");
    const [slotTime, setSlotTime] = useState("");
    const [slotCommissionId, setSlotCommissionId] = useState("");

    const removeCommission = (id) => {
        setCommissions(prev => prev.filter(c => c.id !== id));
    };

    const steps = [
        { id: 1, title: "Создание комиссий" },
        { id: 2, title: "Планирование и распределение" },
        { id: 3, title: "Финализация" },
    ];

    const progressPercent = Math.round(
        ((currentStep - 1) / (steps.length - 1)) * 100
    );

    /* ===== STEP 1: CREATE COMMISSION ===== */
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

    /* ===== STEP 2: ADD SLOT ===== */
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

    /* ===== AUTO DISTRIBUTE (STEP 2) ===== */
    const autoDistribute = () => {
        const allSessions = commissions.flatMap(c =>
            c.sessions.map(s => ({
                commissionId: c.id,
                sessionId: s.sessionId,
            }))
        );

        if (allSessions.length === 0) return;

        // сгруппировать студентов по командам
        const groups = [];
        const used = new Set();

        freeStudents.forEach(s => {
            if (used.has(s.id)) return;

            if (s.teamId) {
                const team = freeStudents.filter(x => x.teamId === s.teamId);
                team.forEach(x => used.add(x.id));
                groups.push(team);
            } else {
                used.add(s.id);
                groups.push([s]);
            }
        });

        let index = 0;

        const updatedCommissions = commissions.map(c => ({
            ...c,
            sessions: c.sessions.map(s => ({
                ...s,
                students: [],
            })),
        }));

        groups.forEach(group => {
            const target = allSessions[index % allSessions.length];
            index++;

            const commission = updatedCommissions.find(
                c => c.id === target.commissionId
            );
            const session = commission.sessions.find(
                s => s.sessionId === target.sessionId
            );

            session.students.push(...group);
        });

        setCommissions(updatedCommissions);
        setFreeStudents([]);
    };

    /* ===== DRAG & DROP ===== */
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
            const [fromCommissionId, fromSessionId] =
                source.droppableId.split("|");

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
        const [toCommissionId, toSessionId] =
            destination.droppableId.split("|");

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

    // ===== SUMMARY (STEP 3) =====
    const totalStudents = studentsMock.length;

    const distributedStudents = commissions.reduce((sum, c) => {
        return (
            sum +
            c.sessions.reduce((sSum, s) => sSum + s.students.length, 0)
        );
    }, 0);

    const undistributedStudents = totalStudents - distributedStudents;


    return (
        <div className="setup-page">
            <button className="back-button" onClick={() => navigate(-1)}>
                <ArrowLeft size={18} /> Назад
            </button>

            <h1>Настройка периода</h1>

            {/* ===== PROGRESS ===== */}
            <div className="progress-section">
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <p className="progress-label">
                    Этап {currentStep} из {steps.length}
                </p>
            </div>

            <div className="setup-content">
                {/* ===== STEPS ===== */}
                <div className="setup-steps">
                    {steps.map(s => (
                        <div
                            key={s.id}
                            className={`setup-step ${
                                currentStep === s.id ? "active" : ""
                            } ${currentStep > s.id ? "done" : ""}`}
                            onClick={() =>
                                currentStep > s.id && setCurrentStep(s.id)
                            }
                        >
                            <CheckCircle size={16} />
                            <span>{s.title}</span>
                        </div>
                    ))}
                </div>

                {/* ===== MAIN ===== */}
                <div className="setup-main">
                    {/* ===== STEP 1 ===== */}
                    {currentStep === 1 && (
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
                                    className="btn-outline"
                                    onClick={addCommission}
                                >
                                    + Создать комиссию
                                </button>

                                {commissions.length > 0 && (
                                    <button
                                        className="btn-primary"
                                        onClick={() => setCurrentStep(2)}
                                    >
                                        Следующий этап
                                    </button>
                                )}
                            </div>
                        </>
                    )}

                    {/* ===== STEP 2 ===== */}
                    {currentStep === 2 && (
                        <DragDropContext onDragEnd={onDragEnd}>
                            <div className="layout">
                                {/* LEFT — STUDENTS */}
                                <Droppable droppableId="free">
                                    {(p) => (
                                        <div
                                            ref={p.innerRef}
                                            {...p.droppableProps}
                                            className="students-column"
                                        >
                                            <h3>Студенты</h3>

                                            {freeStudents.map((s, i) => (
                                                <Draggable
                                                    key={s.id}
                                                    draggableId={s.id}
                                                    index={i}
                                                >
                                                    {(p) => (
                                                        <div
                                                            ref={p.innerRef}
                                                            {...p.draggableProps}
                                                            {...p.dragHandleProps}
                                                            className="student-card"
                                                        >
                                                            {s.name}
                                                            {s.teamId && (
                                                                <span className="team-badge">
                                                                    Команда
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {p.placeholder}
                                        </div>
                                    )}
                                </Droppable>

                                {/* RIGHT — SLOTS */}
                                <div className="slots-column">
                                    <div className="slot-create-card">
                                        <h3>Создать слот защиты</h3>

                                        <div className="slot-form">
                                            <input
                                                type="date"
                                                value={slotDate}
                                                onChange={e =>
                                                    setSlotDate(e.target.value)
                                                }
                                            />
                                            <input
                                                type="time"
                                                value={slotTime}
                                                onChange={e =>
                                                    setSlotTime(e.target.value)
                                                }
                                            />
                                            <select
                                                value={slotCommissionId}
                                                onChange={e =>
                                                    setSlotCommissionId(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Комиссия
                                                </option>
                                                {commissions.map(c => (
                                                    <option
                                                        key={c.id}
                                                        value={c.id}
                                                    >
                                                        {c.name}
                                                    </option>
                                                ))}
                                            </select>

                                            <button
                                                className="btn-primary"
                                                onClick={addSessionToCommission}
                                            >
                                                Добавить
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        className="btn-outline"
                                        onClick={autoDistribute}
                                    >
                                        Распределить автоматически
                                    </button>

                                    {commissions.map(c => (
                                        <CommissionScheduleCard
                                            key={c.id}
                                            commission={c}
                                        />
                                    ))}

                                    <button
                                        className="btn-primary"
                                        onClick={() => setCurrentStep(3)}
                                    >
                                        Следующий этап
                                    </button>
                                </div>
                            </div>
                        </DragDropContext>
                    )}

                    {/* ===== STEP 3 ===== */}
                    {currentStep === 3 && (
                        <>
                            <h3>Финализация</h3>

                            {/* ===== SUMMARY ===== */}
                            <div className="final-summary">
                                <div className="summary-card">
                                    <span>Всего студентов</span>
                                    <strong>{studentsMock.length}</strong>
                                </div>

                                <div className="summary-card success">
                                    <span>Распределено</span>
                                    <strong>
                                        {commissions.reduce(
                                            (sum, c) =>
                                                sum +
                                                c.sessions.reduce(
                                                    (sSum, s) => sSum + s.students.length,
                                                    0
                                                ),
                                            0
                                        )}
                                    </strong>
                                </div>

                                <div className="summary-card danger">
                                    <span>Не распределено</span>
                                    <strong>{freeStudents.length}</strong>
                                </div>
                            </div>

                            {/* ===== COMMISSIONS ===== */}
                            <div className="final-commissions">
                                {commissions.map(c => (
                                    <div key={c.id} className="final-commission">
                                        <h4>{c.name}</h4>

                                        {c.sessions.map(s => (
                                            <div
                                                key={s.sessionId}
                                                className="final-session"
                                            >
                                                <div className="session-datetime">
                                <span>
                                    {" "}
                                    {new Date(s.date).toLocaleDateString(
                                        "ru-RU",
                                        {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        }
                                    )}
                                </span>
                                                    <span> {s.time}</span>
                                                </div>

                                                <div className="session-students">
                                                    Студентов:{" "}
                                                    <strong>{s.students.length}</strong>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            <button
                                className="btn-primary"
                                disabled={freeStudents.length > 0}
                                onClick={() => navigate("/department/time-periods")}
                            >
                                Утвердить период
                            </button>

                            {freeStudents.length > 0 && (
                                <p className="final-warning">
                                     Не все студенты распределены
                                </p>
                            )}
                        </>
                    )}


                </div>
            </div>
        </div>
    );
}
