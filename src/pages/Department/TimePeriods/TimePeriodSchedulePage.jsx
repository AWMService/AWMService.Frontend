import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import "./TimePeriodSchedulePage.css";

/* ===== MOCK DATA ===== */
const mockSchedule = {
    name: "Период защиты ВКР — Июнь 2026",
    commissions: [
        {
            id: "c1",
            name: "Комиссия 1",
            chairman: "Доцент Сидоров П.П.",
            secretary: "Доцент Иванова Е.Е.",
            members: [
                "Профессор Козлова М.М.",
                "Доцент Морозов В.В.",
            ],
            sessions: [
                {
                    id: "s1",
                    date: "2026-06-10",
                    time: "10:00",
                    students: [
                        "Иванов И.И.",
                        "Петров П.П.",
                        "Сидоров С.С.",
                    ],
                },
                {
                    id: "s2",
                    date: "2026-06-11",
                    time: "14:00",
                    students: ["Козлов К.К."],
                },
            ],
        },
    ],
};

export default function TimePeriodSchedulePage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [openCommission, setOpenCommission] = useState(null);

    const toggleCommission = (cid) => {
        setOpenCommission(prev => (prev === cid ? null : cid));
    };

    return (
        <div className="schedule-page">
            {/* ===== HEADER ===== */}
            <div className="schedule-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ArrowLeft size={16} /> Назад
                </button>

                <h1>
                    <Calendar size={20} />
                    Расписание защит
                </h1>

                <p className="schedule-subtitle">
                    {mockSchedule.name}
                </p>
            </div>

            {/* ===== COMMISSIONS ===== */}
            <div className="schedule-commissions">
                {mockSchedule.commissions.map((c) => (
                    <div key={c.id} className="commission-schedule-card">
                        {/* HEADER */}
                        <div className="commission-header">
                            <h2>{c.name}</h2>

                            <button
                                className="members-toggle"
                                onClick={() => toggleCommission(c.id)}
                            >
                                Состав комиссии
                                {openCommission === c.id ? (
                                    <ChevronUp size={16} />
                                ) : (
                                    <ChevronDown size={16} />
                                )}
                            </button>
                        </div>

                        {/* MEMBERS */}
                        {openCommission === c.id && (
                            <div className="commission-members">
                                <div>
                                    <strong>Председатель:</strong>
                                    <span>{c.chairman}</span>
                                </div>

                                <div>
                                    <strong>Секретарь:</strong>
                                    <span>{c.secretary}</span>
                                </div>

                                <div>
                                    <strong>Члены комиссии:</strong>
                                    <ul>
                                        {c.members.map((m, i) => (
                                            <li key={i}>{m}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* SESSIONS */}
                        {c.sessions.map((s) => (
                            <div key={s.id} className="session-row">
                                <div className="session-datetime">
                                    <span className="session-date">
                                        {new Date(s.date).toLocaleDateString(
                                            "ru-RU",
                                            {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            }
                                        )}
                                    </span>
                                    <span className="session-time">
                                        {s.time}
                                    </span>
                                </div>

                                <div className="session-students">
                                    {s.students.map((st, i) => (
                                        <span key={i} className="student-pill">
                                            {st}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
