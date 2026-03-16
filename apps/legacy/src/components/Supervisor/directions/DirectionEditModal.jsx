import React, { useState, useEffect } from "react";
import { X, Edit3, Globe, AlignLeft } from "lucide-react";
import "./DirectionEditModal.css";

export default function DirectionEditModal({ direction, onClose, onSave }) {
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
        if (direction) {
            setForm({
                id: direction.id,
                title: normalizeLangObj(direction.title),
                description: normalizeLangObj(direction.description),
                status: direction.status ?? "draft",
                createdAt: direction.createdAt ?? new Date().toISOString(),
                approvedAt: direction.approvedAt ?? null,
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
        onSave({
            ...form,
            title: normalizeLangObj(form.title),
            description: normalizeLangObj(form.description),
        });
    };

    return (
        <div className="dem-overlay" onClick={onClose}>
            <div className="dem-modal" onClick={(e) => e.stopPropagation()}>
                <div className="dem-header">
                    <div className="dem-header-text">
                        <div className="dem-title-row">
                            <Edit3 size={20} className="dem-icon-edit" />
                            <h2>Редактирование</h2>
                        </div>
                        <p>Внесите изменения в информацию о направлении</p>
                    </div>
                    <button className="dem-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="dem-body">
                    {/* Title Section */}
                    <div className="dem-section">
                        <div className="dem-section-label">
                            <Globe size={16} />
                            <h3>Название направления</h3>
                        </div>

                        <div className="dem-input-group">
                            {['kk', 'ru', 'en'].map((lang) => (
                                <div className="dem-field" key={`title-${lang}`}>
                                    <div className="dem-lang-tag">{lang.toUpperCase()}</div>
                                    <input
                                        className="dem-input"
                                        value={form.title[lang]}
                                        onChange={(e) => handleChange("title", lang, e.target.value)}
                                        placeholder={`Название (${lang.toUpperCase()})...`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="dem-section">
                        <div className="dem-section-label">
                            <AlignLeft size={16} />
                            <h3>Описание направления</h3>
                        </div>

                        <div className="dem-input-group">
                            {['kk', 'ru', 'en'].map((lang) => (
                                <div className="dem-field vertical" key={`desc-${lang}`}>
                                    <div className="dem-lang-tag">{lang.toUpperCase()}</div>
                                    <textarea
                                        className="dem-textarea"
                                        value={form.description[lang]}
                                        onChange={(e) => handleChange("description", lang, e.target.value)}
                                        placeholder={`Описание (${lang.toUpperCase()})...`}
                                        rows={3}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="dem-footer">
                    <button className="dem-btn-secondary" onClick={onClose}>
                        Отмена
                    </button>
                    <button className="dem-btn-primary" onClick={handleSaveClick}>
                        Сохранить изменения
                    </button>
                </div>
            </div>
        </div>
    );
}