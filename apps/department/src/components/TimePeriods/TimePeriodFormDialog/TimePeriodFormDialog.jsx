import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./TimePeriodFormDialog.css";

export default function TimePeriodFormDialog({
                                                 isOpen,
                                                 onClose,
                                                 onSubmit,
                                                 editingPeriod,
                                             }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: "",
        startDate: "",
        endDate: "",
    });

    const periodOptions = [
        { value: "Предзащита 1", label: t('student.preDefense1') },
        { value: "Предзащита 2", label: t('student.preDefense2') },
        { value: "Предзащита 3", label: `${t('commission.preDefense')} 3` },
        { value: "Защита", label: t('commission.defense') },
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
                <h2>{editingPeriod ? t('department.editPeriod') : t('department.createPeriod')}</h2>

                <form onSubmit={handleSubmit}>
                    <label>
                        {t('common.period')}:
                        <select
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        >
                            <option value="">{t('department.selectPeriod')}</option>
                            {periodOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        {t('department.startDate')}:
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        {t('department.endDate')}:
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
                            {editingPeriod ? t('common.save') : t('common.create')}
                        </button>

                        <button
                            type="button"
                            className="button secondary-button"
                            onClick={onClose}
                        >
                            {t('common.cancel')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
