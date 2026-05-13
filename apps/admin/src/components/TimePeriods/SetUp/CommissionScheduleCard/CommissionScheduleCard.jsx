import { useTranslation } from "react-i18next";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { getIntlLocale } from "@awm/shared";
import "./CommissionScheduleCard.css";

export default function CommissionScheduleCard({ commission }) {
    const { t, i18n } = useTranslation();
    const locale = getIntlLocale(i18n.language);
    return (
        <div className="schedule-card">
            <h4>{commission.name}</h4>

            {commission.sessions.map(session => (
                <Droppable
                    key={session.sessionId}
                    droppableId={`${commission.id}|${session.sessionId}`}
                >
                    {(p) => (
                        <div
                            ref={p.innerRef}
                            {...p.droppableProps}
                            className="slot-card"
                        >
                            <div className="slot-header">
                                <span>
                                    {new Date(session.date).toLocaleDateString(locale)}
                                </span>
                                <span>{session.time}</span>
                                <span className="slot-count">
                                    {session.students.length}
                                </span>
                            </div>

                            {session.students.length === 0 && (
                                <div className="slot-empty">
                                    {t('department.dragStudentsHere')}
                                </div>
                            )}

                            <div className="students-list">
                                {session.students.map((s, index) => (
                                    <Draggable
                                        key={s.id}
                                        draggableId={s.id}
                                        index={index}
                                    >
                                        {(p) => (
                                            <div
                                                ref={p.innerRef}
                                                {...p.draggableProps}
                                                {...p.dragHandleProps}
                                                className="student-chip"
                                            >
                                                {s.name}
                                                {s.teamId && (
                                                    <span className="team-badge">
                                                        {t('common.team')}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                            </div>

                            {p.placeholder}
                        </div>
                    )}
                </Droppable>
            ))}
        </div>
    );
}
