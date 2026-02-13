import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import CommissionScheduleCard from "../../../../../components/Department/TimePeriods/SetUp/CommissionScheduleCard/CommissionScheduleCard";

export default function DistributionStep({
                                             commissions,
                                             freeStudents,
                                             slotDate,
                                             slotTime,
                                             slotCommissionId,
                                             setSlotDate,
                                             setSlotTime,
                                             setSlotCommissionId,
                                             addSessionToCommission,
                                             autoDistribute,
                                             onDragEnd,
                                             onNext
                                         }) {
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="layout">

                {/* LEFT */}
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

                {/* RIGHT */}
                <div className="slots-column">
                    <div className="slot-create-card">
                        <h3>Создать слот защиты</h3>

                        <div className="slot-form">
                            <input
                                type="date"
                                value={slotDate}
                                onChange={e => setSlotDate(e.target.value)}
                            />
                            <input
                                type="time"
                                value={slotTime}
                                onChange={e => setSlotTime(e.target.value)}
                            />
                            <select
                                value={slotCommissionId}
                                onChange={e => setSlotCommissionId(e.target.value)}
                            >
                                <option value="">Комиссия</option>
                                {commissions.map(c => (
                                    <option key={c.id} value={c.id}>
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
                        onClick={onNext}
                    >
                        Следующий этап
                    </button>
                </div>
            </div>
        </DragDropContext>
    );
}
