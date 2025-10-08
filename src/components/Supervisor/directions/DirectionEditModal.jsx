import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "./DirectionEditModal.css";

export default function DirectionEditModal({ direction, onClose, onSave }) {
    // helper to normalise title/description objects
    const normalizeLangObj = (obj) => ({
        kk: obj?.kk ?? "",
        ru: obj?.ru ?? "",
        en: obj?.en ?? "",
    });

    const [form, setForm] = useState({
        id: direction?.id ?? Date.now().toString(),
        title: normalizeLangObj(direction?.title),
        description: normalizeLangObj(direction?.description),
        status: direction?.status ?? "draft",
        createdAt: direction?.createdAt ?? new Date().toISOString(),
        approvedAt: direction?.approvedAt ?? null,
    });

    useEffect(() => {
        // whenever direction changes, re-normalize fields to always contain kk/ru/en
        if (direction) {
            setForm({
                id: direction.id,
                title: normalizeLangObj(direction.title),
                description: normalizeLangObj(direction.description),
                status: direction.status ?? "draft",
                createdAt: direction.createdAt ?? new Date().toISOString(),
                approvedAt: direction.approvedAt ?? null,
            });
        } else {
            // if no direction (editing new), reset to defaults
            setForm({
                id: Date.now().toString(),
                title: { kk: "", ru: "", en: "" },
                description: { kk: "", ru: "", en: "" },
                status: "draft",
                createdAt: new Date().toISOString(),
                approvedAt: null,
            });
        }
    }, [direction]);

    const handleChange = (field, lang, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: { ...prev[field], [lang]: value },
        }));
    };

    const handleSaveClick = () => {
        // Можно тут добавить валидацию перед сохранением
        onSave({
            ...form,
            // убедимся, что в сохраняемом объекте тоже всегда есть все языки
            title: normalizeLangObj(form.title),
            description: normalizeLangObj(form.description),
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container modal-large">
                <button className="modal-close" onClick={onClose} aria-label="Закрыть">
                    <X />
                </button>

                <div className="modal-header">
                    <div>
                        <h2>Редактировать направление</h2>
                        <p className="modal-sub">Внесите необходимые изменения в направление дипломного проекта</p>
                    </div>
                    <div>
                        <span className="status filled">Заполнено</span>
                    </div>
                </div>

                <div className="modal-section">
                    <h3 className="section-title">Название направления</h3>

                    <label className="field-label">Қазақша</label>
                    <input
                        className="input"
                        value={form.title?.kk ?? ""}
                        onChange={(e) => handleChange("title", "kk", e.target.value)}
                        placeholder="Қазақша"
                    />

                    <label className="field-label">Русский</label>
                    <input
                        className="input"
                        value={form.title?.ru ?? ""}
                        onChange={(e) => handleChange("title", "ru", e.target.value)}
                        placeholder="Русский"
                    />

                    <label className="field-label">English</label>
                    <input
                        className="input"
                        value={form.title?.en ?? ""}
                        onChange={(e) => handleChange("title", "en", e.target.value)}
                        placeholder="English"
                    />
                </div>

                <div className="modal-section">
                    <h3 className="section-title">Описание направления</h3>

                    <label className="field-label">Қазақша</label>
                    <textarea
                        className="textarea"
                        value={form.description?.kk ?? ""}
                        onChange={(e) => handleChange("description", "kk", e.target.value)}
                        placeholder="Зерттеу саласының толық сипаттамасы..."
                        rows={4}
                    />

                    <label className="field-label">Русский</label>
                    <textarea
                        className="textarea"
                        value={form.description?.ru ?? ""}
                        onChange={(e) => handleChange("description", "ru", e.target.value)}
                        placeholder="Детальное описание области исследования..."
                        rows={4}
                    />

                    <label className="field-label">English</label>
                    <textarea
                        className="textarea"
                        value={form.description?.en ?? ""}
                        onChange={(e) => handleChange("description", "en", e.target.value)}
                        placeholder="Detailed description..."
                        rows={4}
                    />
                </div>

                <div className="modal-footer">
                    <button className="btn btn-outline" onClick={onClose}>
                        Отмена
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleSaveClick}
                    >
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
}
