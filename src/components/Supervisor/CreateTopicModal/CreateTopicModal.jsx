import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import "./CreateTopicModal.css";

export default function CreateTopicModal({ open, onClose, onCreate, directions = [] }) {
    // directions: array of strings (названия утвержденных направлений)
    const [form, setForm] = useState({
        direction: "",
        title: { kk: "", ru: "", en: "" },
        description: { kk: "", ru: "", en: "" },
        workType: "", // e.g. "course", "diploma"
        studentCount: "1",
    });

    const [touched, setTouched] = useState(false);

    useEffect(() => {
        if (!open) {
            // reset on close
            setForm({
                direction: "",
                title: { kk: "", ru: "", en: "" },
                description: { kk: "", ru: "", en: "" },
                workType: "",
                studentCount: "1",
            });
            setTouched(false);
        }
    }, [open]);

    if (!open) return null;

    const updateField = (path, value) => {
        // path is string like "title.kk" or "direction"
        if (!path.includes(".")) {
            setForm((p) => ({ ...p, [path]: value }));
            return;
        }
        const [parent, child] = path.split(".");
        setForm((p) => ({ ...p, [parent]: { ...p[parent], [child]: value } }));
    };

    const valid = () => {
        // require direction, at least one title (prefer ru/kk), and at least one description
        const hasDirection = form.direction.trim() !== "";
        const hasTitle = (form.title.kk + form.title.ru + form.title.en).trim() !== "";
        const hasDesc = (form.description.kk + form.description.ru + form.description.en).trim() !== "";
        const hasWorkType = form.workType.trim() !== "";
        return hasDirection && hasTitle && hasDesc && hasWorkType;
    };

    const handleSave = () => {
        setTouched(true);
        if (!valid()) return;
        // assemble topic object
        const topic = {
            title: {
                kk: form.title.kk.trim(),
                ru: form.title.ru.trim(),
                en: form.title.en.trim(),
            },
            description: {
                kk: form.description.kk.trim(),
                ru: form.description.ru.trim(),
                en: form.description.en.trim(),
            },
            direction: form.direction,
            workType: form.workType,
            studentCount: parseInt(form.studentCount, 10) || 1,
            createdAt: new Date().toISOString(),
        };

        if (onCreate) onCreate(topic);
        onClose();
    };

    return (
        <div className="ctm-overlay" role="dialog" aria-modal="true">
            <div className="ctm-modal">
                <button className="ctm-close" onClick={onClose} aria-label="Закрыть">
                    <X />
                </button>

                <header className="ctm-header">
                    <h2>Создать новую тему</h2>
                    <p className="ctm-sub">Заполните информацию о теме дипломного проекта на всех языках</p>
                </header>

                <div className="ctm-required-box">
                    {(!form.direction || (form.title.kk+form.title.ru+form.title.en).trim()==="" || (form.description.kk+form.description.ru+form.description.en).trim()==="") && (
                        <div className="ctm-required">⚠ Требуется заполнение</div>
                    )}
                </div>

                <div className="ctm-body">
                    {/* Direction select */}
                    <div className="ctm-row">
                        <label className="ctm-label">Направление</label>
                        <select
                            className={`ctm-select ${touched && !form.direction ? "invalid" : ""}`}
                            value={form.direction}
                            onChange={(e) => updateField("direction", e.target.value)}
                        >
                            <option value="">Выберите направление из утвержденных</option>
                            {directions.length === 0 && <option value="__none">Нет утверждённых направлений</option>}
                            {directions.map((d, idx) => (
                                <option key={idx} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    {/* Title multilingual */}
                    <div className="ctm-section">
                        <h3 className="ctm-section-title">Название темы</h3>

                        <label className="ctm-field-label">Қазақша</label>
                        <input
                            className={`ctm-input ${touched && (form.title.kk.trim()==="") && (form.title.ru.trim()==="" && form.title.en.trim()==="") ? "invalid" : ""}`}
                            placeholder="Тақырыптың атауы қазақ тілінде"
                            value={form.title.kk}
                            onChange={(e) => updateField("title.kk", e.target.value)}
                        />

                        <label className="ctm-field-label">Русский</label>
                        <input
                            className="ctm-input"
                            placeholder="Название темы на русском языке"
                            value={form.title.ru}
                            onChange={(e) => updateField("title.ru", e.target.value)}
                        />

                        <label className="ctm-field-label">English</label>
                        <input
                            className="ctm-input"
                            placeholder="Topic title in English"
                            value={form.title.en}
                            onChange={(e) => updateField("title.en", e.target.value)}
                        />
                    </div>

                    {/* Description multilingual */}
                    <div className="ctm-section">
                        <h3 className="ctm-section-title">Описание темы</h3>

                        <label className="ctm-field-label">Қазақша</label>
                        <textarea
                            className={`ctm-textarea ${touched && (form.description.kk.trim()==="") && (form.description.ru.trim()==="" && form.description.en.trim()==="") ? "invalid" : ""}`}
                            placeholder="Тақырыптың толық сипаттамасы қазақ тілінде..."
                            rows={4}
                            value={form.description.kk}
                            onChange={(e) => updateField("description.kk", e.target.value)}
                        />

                        <label className="ctm-field-label">Русский</label>
                        <textarea
                            className="ctm-textarea"
                            placeholder="Подробное описание задач и целей темы на русском языке..."
                            rows={4}
                            value={form.description.ru}
                            onChange={(e) => updateField("description.ru", e.target.value)}
                        />

                        <label className="ctm-field-label">English</label>
                        <textarea
                            className="ctm-textarea"
                            placeholder="Detailed description of the topic in English..."
                            rows={4}
                            value={form.description.en}
                            onChange={(e) => updateField("description.en", e.target.value)}
                        />
                    </div>

                    {/* Bottom row: work type + student count */}
                    <div className="ctm-bottom-row">
                        <div className="ctm-col">
                            <label className="ctm-label">Тип работы</label>
                            <select
                                className={`ctm-select ${touched && !form.workType ? "invalid" : ""}`}
                                value={form.workType}
                                onChange={(e) => updateField("workType", e.target.value)}
                            >
                                <option value="">Выберите тип работы</option>
                                <option value="diploma">Дипломная работа</option>
                                <option value="course">Курсовая работа</option>
                                <option value="research">Научно-исследовательская</option>
                            </select>
                        </div>

                        <div className="ctm-col">
                            <label className="ctm-label">Количество студентов</label>
                            <select
                                className="ctm-select"
                                value={form.studentCount}
                                onChange={(e) => updateField("studentCount", e.target.value)}
                            >
                                <option value="1">1 - Индивидуальная</option>
                                <option value="2">2 - Двоe</option>
                                <option value="3">3 - Трое</option>
                            </select>
                        </div>
                    </div>

                    {/* Footer actions */}
                    <div className="ctm-actions">
                        <button className="btn btn-outline" onClick={onClose}>Отмена</button>
                        <button className={`btn btn-primary ${!valid() ? "disabled" : ""}`} onClick={handleSave}>Сохранить тему</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
