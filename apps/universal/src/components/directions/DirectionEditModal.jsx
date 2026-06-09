import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, Edit3, Globe, AlignLeft, Layers } from "lucide-react";
import "./DirectionEditModal.css";

export default function DirectionEditModal({ direction, onClose, onSave, workTypes = [] }) {
    const { t } = useTranslation();
    const normalizeLangObj = (obj) => ({
        kk: obj?.kk ?? "",
        ru: obj?.ru ?? "",
        en: obj?.en ?? "",
    });

    const [form, setForm] = useState({
        id: direction?.id ?? Date.now().toString(),
        title: normalizeLangObj(direction?.title),
        description: normalizeLangObj(direction?.description),
        workTypeId: direction?.workTypeId ?? "",
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
                workTypeId: direction.workTypeId ?? "",
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

    const handleWorkTypeChange = (value) => {
        setForm(prev => ({ ...prev, workTypeId: parseInt(value, 10) }));
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
                            <h2>{t('supervisor.editDirection')}</h2>
                        </div>
                        <p>{t('supervisor.editTopicSubtitle')}</p>
                    </div>
                    <button className="dem-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="dem-body">
                    {}
                    <div className="dem-section">
                        <div className="dem-section-label">
                            <Layers size={16} />
                            <h3>{t('supervisor.workType')}</h3>
                        </div>
                        <select
                            className="dem-select"
                            value={form.workTypeId}
                            onChange={(e) => handleWorkTypeChange(e.target.value)}
                        >
                            <option value="">{t('common.select')}</option>
                            {workTypes.map((wt) => (
                                <option key={wt.id} value={wt.id}>
                                    {wt.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {}
                    <div className="dem-section">
                        <div className="dem-section-label">
                            <Globe size={16} />
                            <h3>{t('supervisor.directionTitle')}</h3>
                        </div>

                        <div className="dem-input-group">
                            {['kk', 'ru', 'en'].map((lang) => (
                                <div className="dem-field" key={`title-${lang}`}>
                                    <div className="dem-lang-tag">{lang.toUpperCase()}</div>
                                    <input
                                        className="dem-input"
                                        value={form.title[lang]}
                                        onChange={(e) => handleChange("title", lang, e.target.value)}
                                        placeholder={`${t('common.title')}...`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {}
                    <div className="dem-section">
                        <div className="dem-section-label">
                            <AlignLeft size={16} />
                            <h3>{t('common.description')}</h3>
                        </div>

                        <div className="dem-input-group">
                            {['kk', 'ru', 'en'].map((lang) => (
                                <div className="dem-field vertical" key={`desc-${lang}`}>
                                    <div className="dem-lang-tag">{lang.toUpperCase()}</div>
                                    <textarea
                                        className="dem-textarea"
                                        value={form.description[lang]}
                                        onChange={(e) => handleChange("description", lang, e.target.value)}
                                        placeholder={`${t('common.description')}...`}
                                        rows={3}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="dem-footer">
                    <button className="dem-btn-secondary" onClick={onClose}>
                        {t('common.cancel')}
                    </button>
                    <button className="dem-btn-primary" onClick={handleSaveClick}>
                        {t('common.saveChanges')}
                    </button>
                </div>
            </div>
        </div>
    );
}
