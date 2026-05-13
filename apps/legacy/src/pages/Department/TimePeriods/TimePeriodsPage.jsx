import React, { useState, useEffect } from "react";
import "./TimePeriodsPage.css";

import TimePeriodCard from "../../../components/Department/TimePeriods/TimePeriodCard/TimePeriodCard.jsx";
import TimePeriodFormDialog from "../../../components/Department/TimePeriods/TimePeriodFormDialog/TimePeriodFormDialog.jsx";

import plusIcon from "../../../assets/icons/plus-icon.svg";

export default function TimePeriodsPage() {
    const [timePeriods, setTimePeriods] = useState(() => {
        const saved = localStorage.getItem("timePeriods");
        return saved ? JSON.parse(saved) : [];
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem("timePeriods", JSON.stringify(timePeriods));
    }, [timePeriods]);

    const handleAddPeriod = (formData) => {
        const newPeriod = {
            id: Date.now().toString(),
            name: formData.name,
            startDate: formData.startDate,
            endDate: formData.endDate,
            commissions: 0,
            students: 0,
            dates: 0,
            progress: 0,
            status: "upcoming",
        };

        setTimePeriods((prev) => [...prev, newPeriod]);
        setIsDialogOpen(false);
    };


    const deletePeriod = (id) => {
        setTimePeriods((prev) => prev.filter((p) => p.id !== id));
    };

    return (
        <div className="time-periods-page">
            <div className="page-header">
                <div className="page-header-info">
                    <div>
                        <h1 className="page-title">Временные периоды</h1>
                        <p className="page-subtitle">
                            Определение и управление периодами
                        </p>
                    </div>
                </div>

                <button
                    className="button primary-button"
                    onClick={() => setIsDialogOpen(true)}
                >
                    <img src={plusIcon} alt="Add" className="button-icon" />
                    Добавить период
                </button>
            </div>


            <div className="periods-list">
                {timePeriods.map((period) => (
                    <TimePeriodCard
                        key={period.id}
                        period={period}
                        onDelete={() => deletePeriod(period.id)}
                    />
                ))}
            </div>

            <TimePeriodFormDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleAddPeriod}
            />
        </div>
    );
}
