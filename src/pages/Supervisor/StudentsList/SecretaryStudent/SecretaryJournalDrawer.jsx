import React, { useState, useEffect } from "react";

export default function SecretaryJournalDrawer({ open, onClose, student }) {
    // Начальный статус
    const [status, setStatus] = useState(student?.globalStatus || "gathering");
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Список комиссии (5 человек)
    const [members, setMembers] = useState([
        { id: 1, name: "Иванов И.И.", role: "Председатель", status: "submitted", score: 88 },
        { id: 2, name: "Смирнова А.В.", role: "Член комиссии", status: "submitted", score: 82 },
        { id: 3, name: "Оспанов Д.К.", role: "Член комиссии", status: "submitted", score: 85 },
        { id: 4, name: "Ким Е.В.", role: "Член комиссии", status: "submitted", score: 90 },
        { id: 5, name: "Алиев М.М.", role: "Член комиссии", status: "submitted", score: 78 },
    ]);

    useEffect(() => {
        if (student) setStatus(student.globalStatus);
    }, [student]);

    // 1. Открытие модалки
    const handleRevealClick = () => setShowConfirmModal(true);

    // 2. Подтверждение открытия баллов (переход в режим обсуждения)
    const confirmRevealScores = () => {
        setShowConfirmModal(false);
        setStatus("reviewing");
    };

    // 3. СИМУЛЯЦИЯ: Члены комиссии поменяли баллы и подтвердили
    // (Эту функцию мы вызываем кликом по тексту ожидания)
    const simulateMembersFinalizing = () => {
        const updatedMembers = members.map(m => {
            // Симулируем, что пару человек изменили мнение в ходе обсуждения
            let newScore = m.score;
            if (m.id === 2) newScore = 85; // Смирнова подняла балл
            if (m.id === 5) newScore = 80; // Алиев подняла балл

            return {
                ...m,
                score: newScore,
                status: "locked" // Все подтвердили финал
            };
        });

        setMembers(updatedMembers);
        setStatus("ready_to_lock"); // Теперь секретарь может закрыть протокол
    };

    // 4. Финальное утверждение секретарем
    const handleFinalLock = () => {
        setStatus("completed");
    };

    // Пересчет среднего балла на лету
    const submittedScores = members.filter(m => m.score !== null).map(m => m.score);
    const averageScore = submittedScores.length
        ? (submittedScores.reduce((a, b) => a + b, 0) / submittedScores.length).toFixed(1)
        : 0;

    return (
        <>
            <aside className={`s-journal-drawer ${open ? "s-open" : ""}`}>
                <div className="s-drawer-header">
                    <button className="s-close-btn" onClick={onClose}>×</button>
                    <h2 className="s-drawer-title">Управление оценкой</h2>
                    {student && (
                        <div className="s-student-info">
                            <div className="s-student-name-large">{student.name}</div>
                            <div className="s-topic-sub">{student.topicTitle}</div>
                        </div>
                    )}
                </div>

                <div className="s-drawer-body">
                    {/* Список комиссии */}
                    <div className="sec-members-section">
                        <h4>Статусы комиссии (5 человек)</h4>
                        <ul className="sec-members-list">
                            {members.map(m => (
                                <li key={m.id} className={`sec-member-item ${m.status === 'locked' ? 'finalized' : ''}`}>
                                    <div className="sec-member-details">
                                        <span className="sec-member-name">
                                            {m.name} <span className="sec-role-tag">{m.role}</span>
                                        </span>
                                        {m.status === "editing" && <span className="sec-m-status editing">Оценивает...</span>}
                                        {m.status === "submitted" && <span className="sec-m-status submitted">Оценка отправлена</span>}
                                        {m.status === "locked" && <span className="sec-m-status locked">Подтвержден финал</span>}
                                    </div>
                                    <div className="sec-member-score">
                                        {m.score !== null ? m.score : "-"}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <hr className="s-divider" />

                    {/* Итоговый балл */}
                    <div className={`sec-summary-box ${status === 'completed' ? 'locked' : ''}`}>
                        <span>
                            {status === 'completed' ? 'Итоговый балл в протоколе:' : 'Текущий средний балл:'}
                        </span>
                        <strong>{averageScore}</strong>
                    </div>

                    {/* БЛОКИ СООБЩЕНИЙ */}

                    {status === "gathering" && (
                        <div className="s-status-message">
                            Ожидаем первоначальные баллы от всех членов комиссии...
                        </div>
                    )}

                    {/* СИМУЛЯТОР: Нажми сюда, чтобы завершить обсуждение */}
                    {status === "reviewing" && (
                        <div
                            className="s-status-message sec-msg-blue clickable-simulate"
                            onClick={simulateMembersFinalizing}
                            title="Нажмите, чтобы симулировать подтверждение всеми членами комиссии"
                        >
                            <span style={{cursor: "pointer", textDecoration: "underline"}}>
                                (Тест) Баллы открыты. Ожидаем подтверждения от комиссии... (Нажмите здесь)
                            </span>
                        </div>
                    )}

                    {status === "ready_to_lock" && (
                        <div className="s-status-message sec-msg-success">
                            Все члены комиссии подтвердили финальные оценки!
                        </div>
                    )}
                </div>

                <div className="s-drawer-footer">
                    <div className="s-actions">
                        {/* Кнопка 1: Показать баллы */}
                        {(status === "ready_to_reveal" || status === "gathering") && (
                            // Для теста разрешаем нажать даже в gathering, если все submitted
                            <button
                                className="s-btn-primary"
                                onClick={handleRevealClick}
                                disabled={members.some(m => m.status !== 'submitted')}
                            >
                                {members.some(m => m.status !== 'submitted') ? "Ждем оценок..." : "Показать баллы комиссии"}
                            </button>
                        )}

                        {/* Кнопка 2: Ждем (выключена) */}
                        {status === "reviewing" && (
                            <button className="s-btn-secondary" disabled>
                                Идет обсуждение...
                            </button>
                        )}

                        {/* Кнопка 3: УТВЕРДИТЬ */}
                        {status === "ready_to_lock" && (
                            <button className="s-btn-primary sec-btn-success" onClick={handleFinalLock}>
                                Утвердить оценку студента
                            </button>
                        )}

                        {/* Финал */}
                        {status === "completed" && (
                            <div className="s-locked-badge">Протокол утвержден и закрыт</div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Модальное окно */}
            {showConfirmModal && (
                <div className="sec-modal-overlay">
                    <div className="sec-modal-content">
                        <h3>Открытие баллов</h3>
                        <p>Показать оценки всем членам комиссии для обсуждения?</p>
                        <div className="sec-modal-actions">
                            <button className="s-btn-secondary" onClick={() => setShowConfirmModal(false)}>Отмена</button>
                            <button className="s-btn-primary" onClick={confirmRevealScores}>Да, показать</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}