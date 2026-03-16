import React, { useState, useEffect } from "react";
import "./TimePeriodFormDialog.css";

export default function TimePeriodFormDialog({
                                                 isOpen,
                                                 onClose,
                                                 onSubmit,
                                                 editingPeriod,
                                             }) {
    const [formData, setFormData] = useState({
        name: "",
        startDate: "",
        endDate: "",
    });

    const periodOptions = [
        { value: "Предзащита 1", label: "Предзащита 1" },
        { value: "Предзащита 2", label: "Предзащита 2" },
        { value: "Предзащита 3", label: "Предзащита 3" },
        { value: "Защита", label: "Защита" },
    ];

    useEffect(() => {
        if (editingPeriod) {
            setFormData({
                name: editingPeriod.name || "",
                startDate: editingPeriod.startDate || "",
                endDate: editingPeriod.endDate || "",
            });
        } else {
            setFormData({ name: "", startDate: "", endDate: "" });
        }
    }, [editingPeriod, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="dialog-backdrop">
            <div className="dialog">
                <h2>{editingPeriod ? "Редактировать период" : "Создать период"}</h2>

                <form onSubmit={handleSubmit}>
                    <label>
                        Период:
                        <select
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Выберите период</option>
                            {periodOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Дата начала:
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Дата окончания:
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <div className="dialog-buttons">
                        <button type="submit" className="button primary-button">
                            {editingPeriod ? "Сохранить" : "Создать"}
                        </button>

                        <button
                            type="button"
                            className="button secondary-button"
                            onClick={onClose}
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
