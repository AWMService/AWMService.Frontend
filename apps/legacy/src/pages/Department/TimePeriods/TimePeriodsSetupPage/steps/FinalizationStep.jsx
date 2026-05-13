import React from "react";

export default function FinalizationStep({
                                             commissions,
                                             freeStudents,
                                             totalStudents,
                                             onFinish
                                         }) {
    const distributedStudents = commissions.reduce((sum, c) => {
        return (
            sum +
            c.sessions.reduce((sSum, s) => sSum + s.students.length, 0)
        );
    }, 0);

    return (
        <>
            <h3>Финализация</h3>

            <div className="final-summary">
                <div className="summary-card">
                    <span>Всего студентов</span>
                    <strong>{totalStudents}</strong>
                </div>

                <div className="summary-card success">
                    <span>Распределено</span>
                    <strong>{distributedStudents}</strong>
                </div>

                <div className="summary-card danger">
                    <span>Не распределено</span>
                    <strong>{freeStudents.length}</strong>
                </div>
            </div>

            <div className="final-commissions">
                {commissions.map(c => (
                    <div key={c.id} className="final-commission">
                        <h4>{c.name}</h4>

                        {c.sessions.map(s => (
                            <div key={s.sessionId} className="final-session">
                                <div className="session-datetime">
                                    <span>
                                        {new Date(s.date).toLocaleDateString("ru-RU", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </span>
                                    <span> {s.time}</span>
                                </div>

                                <div className="session-students">
                                    Студентов: <strong>{s.students.length}</strong>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <button
                className="btn-primary"
                disabled={freeStudents.length > 0}
                onClick={onFinish}
            >
                Утвердить период
            </button>

            {freeStudents.length > 0 && (
                <p className="final-warning">
                    Не все студенты распределены
                </p>
            )}
        </>
    );
}
