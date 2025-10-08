import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "./CreateDirectionModal.css";

export default function CreateDirectionModal({ onClose, onCreate }) {
    // form state
    const [title, setTitle] = useState({ kk: "", ru: "", en: "" });
    const [description, setDescription] = useState({ kk: "", ru: "", en: "" });
    const [touched, setTouched] = useState({ title: { kk: false, ru: false, en: false }, description: { kk: false, ru: false, en: false } });
    const [canSubmit, setCanSubmit] = useState(false);

    // Простая валидация: требуем хотя бы казахский и русский названия + хотя бы казахский описание
    useEffect(() => {
        const valid =
            title.kk.trim() !== "" &&
            title.ru.trim() !== "" &&
            description.kk.trim() !== "";
        setCanSubmit(valid);
    }, [title, description]);

    const handleChangeTitle = (lang, value) => {
        setTitle((s) => ({ ...s, [lang]: value }));
    };
    const handleChangeDesc = (lang, value) => {
        setDescription((s) => ({ ...s, [lang]: value }));
    };

    const markTouched = (field, lang) => {
        setTouched((t) => ({ ...t, [field]: { ...t[field], [lang]: true } }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // mark all touched to show error states if any
        setTouched({
            title: { kk: true, ru: true, en: true },
            description: { kk: true, ru: true, en: true },
        });

        if (!canSubmit) return;

        onCreate({
            title: { kk: title.kk.trim(), ru: title.ru.trim(), en: title.en.trim() },
            description: { kk: description.kk.trim(), ru: description.ru.trim(), en: description.en.trim() },
        });
    };

    return (
        <div className="cdm-overlay" role="dialog" aria-modal="true">
            <div className="cdm-modal">
                <div className="cdm-header">
                    <div>
                        <h2>Создать новое направление</h2>
                        <p className="muted">Заполните информацию о направлении дипломного проекта на всех языках</p>
                    </div>
                    <button className="cdm-close" onClick={onClose} aria-label="Закрыть">
                        <X />
                    </button>
                </div>

                <form className="cdm-body" onSubmit={handleSubmit} noValidate>
                    {/* Title section */}
                    <div className="cdm-section">
                        <div className="cdm-section-title">
                            <h3>Название направления</h3>
                            {/* Показать badge если нужные поля пустые */}
                            {( (touched.title.kk && title.kk.trim() === "") || (touched.title.ru && title.ru.trim() === "") ) && (
                                <span className="cdm-required">⚠ Требуется заполнение</span>
                            )}
                        </div>

                        <label className="cdm-field-label">Қазақша</label>
                        <input
                            value={title.kk}
                            onChange={(e) => handleChangeTitle("kk", e.target.value)}
                            onBlur={() => markTouched("title", "kk")}
                            placeholder="Бағыттың атауы қазақ тілінде"
                            className={`cdm-input ${touched.title.kk && title.kk.trim() === "" ? "invalid" : ""}`}
                        />

                        <label className="cdm-field-label">Русский</label>
                        <input
                            value={title.ru}
                            onChange={(e) => handleChangeTitle("ru", e.target.value)}
                            onBlur={() => markTouched("title", "ru")}
                            placeholder="Название направления на русском языке"
                            className={`cdm-input ${touched.title.ru && title.ru.trim() === "" ? "invalid" : ""}`}
                        />

                        <label className="cdm-field-label">English</label>
                        <input
                            value={title.en}
                            onChange={(e) => handleChangeTitle("en", e.target.value)}
                            onBlur={() => markTouched("title", "en")}
                            placeholder="Direction title in English"
                            className="cdm-input"
                        />
                    </div>

                    {/* Description section */}
                    <div className="cdm-section">
                        <div className="cdm-section-title">
                            <h3>Описание направления</h3>
                            {(touched.description.kk && description.kk.trim() === "") && (
                                <span className="cdm-required">⚠ Требуется заполнение</span>
                            )}
                        </div>

                        <label className="cdm-field-label">Қазақша</label>
                        <textarea
                            value={description.kk}
                            onChange={(e) => handleChangeDesc("kk", e.target.value)}
                            onBlur={() => markTouched("description", "kk")}
                            placeholder="Зерттеу саласының, негізгі міндеттер мен мақсаттардың толық сипаттамасы..."
                            className={`cdm-textarea ${touched.description.kk && description.kk.trim() === "" ? "invalid" : ""}`}
                            rows={4}
                        />

                        <label className="cdm-field-label">Русский</label>
                        <textarea
                            value={description.ru}
                            onChange={(e) => handleChangeDesc("ru", e.target.value)}
                            onBlur={() => markTouched("description", "ru")}
                            placeholder="Детальное описание области исследования, основных задач и целей направления..."
                            className="cdm-textarea"
                            rows={4}
                        />

                        <label className="cdm-field-label">English</label>
                        <textarea
                            value={description.en}
                            onChange={(e) => handleChangeDesc("en", e.target.value)}
                            onBlur={() => markTouched("description", "en")}
                            placeholder="Detailed description of the research area, main tasks and goals..."
                            className="cdm-textarea"
                            rows={4}
                        />
                    </div>

                    <div className="cdm-footer">
                        <button type="button" className="btn btn-outline" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className={`btn btn-primary ${!canSubmit ? "disabled" : ""}`} disabled={!canSubmit}>
                            Создать
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
