import { Droppable, Draggable } from "@hello-pangea/dnd";
import "./CommissionScheduleCard.css";

export default function CommissionScheduleCard({ commission }) {
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
                                    {new Date(session.date).toLocaleDateString("ru-RU")}
                                </span>
                                <span>{session.time}</span>
                                <span className="slot-count">
                                    {session.students.length}
                                </span>
                            </div>

                            {session.students.length === 0 && (
                                <div className="slot-empty">
                                    Перетащите студентов сюда
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
                                                        Команда
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
