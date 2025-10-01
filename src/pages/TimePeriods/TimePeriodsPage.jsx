import React, { useState } from "react";
import "./TimePeriodsPage.css";

import Button from "../../components/TimePeriods/Button/Button";
import PageHeader from "../../components/TimePeriods/PageHeader/PageHeader";
import StatusMessage from "../../components/TimePeriods/StatusMessage/StatusMessage";
import StatisticsGrid from "../../components/TimePeriods/StatisticsGrid/StatisticsGrid";
import EmptyState from "../../components/TimePeriods/EmptyState/EmptyState";
import TimePeriodCard from "../../components/TimePeriods/TimePeriodCard/TimePeriodCard";
import TimePeriodFormDialog from "../../components/TimePeriods/TimePeriodFormDialog/TimePeriodFormDialog";

export default function TimePeriodsPage() {
    const [timePeriods, setTimePeriods] = useState([]);
    const [saveMessage, setSaveMessage] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingPeriod, setEditingPeriod] = useState(null);

    const addPeriod = (period) => {
        setTimePeriods((prev) => [
            ...prev,
            { ...period, id: Date.now().toString(), status: "upcoming" },
        ]);
        setSaveMessage("Период создан");
    };

    const updatePeriod = (id, newData) => {
        setTimePeriods((prev) =>
            prev.map((p) => (p.id === id ? { ...p, ...newData } : p))
        );
        setSaveMessage("Период обновлен");
    };

    const deletePeriod = (id) => {
        setTimePeriods((prev) => prev.filter((p) => p.id !== id));
        setSaveMessage("Период удален");
    };

    const clearSaveMessage = () => setSaveMessage("");

    const handleFormSubmit = (data) => {
        if (editingPeriod) {
            updatePeriod(editingPeriod.id, data);
            setEditingPeriod(null);
        } else {
            addPeriod(data);
        }
        setIsAddDialogOpen(false);
    };

    const handleEdit = (period) => {
        setEditingPeriod(period);
        setIsAddDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsAddDialogOpen(false);
        setEditingPeriod(null);
    };

    const statistics = [
        { label: "Предстоящие", value: timePeriods.filter((p) => p.status === "upcoming").length },
        { label: "Активные", value: timePeriods.filter((p) => p.status === "active").length },
        { label: "Завершенные", value: timePeriods.filter((p) => p.status === "completed").length },
        { label: "Всего периодов", value: timePeriods.length },
    ];

    return (
        <div className="time-periods-page">
            <PageHeader
                title="Временные периоды"
                description="Определение и управление периодами"
            >
                <Button onClick={() => setIsAddDialogOpen(true)}>Добавить период</Button>
            </PageHeader>

            {saveMessage && (
                <StatusMessage message={saveMessage} onDismiss={clearSaveMessage} />
            )}

            {timePeriods.length > 0 ? (
                <div className="periods-list">
                    {timePeriods.map((period) => (
                        <TimePeriodCard
                            key={period.id}
                            period={period}
                            onEdit={handleEdit}
                            onDelete={deletePeriod}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="Временные периоды отсутствуют"
                    description="Создайте первый период"
                >
                    <Button onClick={() => setIsAddDialogOpen(true)}>Создать период</Button>
                </EmptyState>
            )}

            <TimePeriodFormDialog
                isOpen={isAddDialogOpen}
                onClose={handleDialogClose}
                onSubmit={handleFormSubmit}
                editingPeriod={editingPeriod}
            />

            <StatisticsGrid statistics={statistics} />
        </div>
    );
}
