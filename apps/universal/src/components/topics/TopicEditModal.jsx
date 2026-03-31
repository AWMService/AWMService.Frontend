import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, Edit3, Globe, AlignLeft, Layers, Users, Info } from "lucide-react";
import "./TopicEditModal.css";

export default function TopicEditModal({ open, onClose, topic, onSave, directions }) {
    const { t } = useTranslation();
    const [form, setForm] = useState({
        titleRu: "",
        titleKk: "",
        titleEn: "",
        descRu: "",
        descKk: "",
        descEn: "",
        direction: "",
        workType: "diploma_project",
        participantCount: 1,
    });

    useEffect(() => {
        if (topic) {
            setForm({
                titleRu: topic.title?.ru ?? "",
                titleKk: topic.title?.kk ?? "",
                titleEn: topic.title?.en ?? "",
                descRu: topic.description?.ru ?? "",
                descKk: topic.description?.kk ?? "",
                descEn: topic.description?.en ?? "",
                direction: topic.directionTitle ?? "",
                workType: topic.workType ?? "diploma_project",
                participantCount: topic.participantCount ?? 1,
            });
        }
    }, [topic]);

    if (!open || !topic) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const updatedTopic = {
            ...topic,
            title: {
                ru: form.titleRu,
                kk: form.titleKk,
                en: form.titleEn,
            },
            description: {
                ru: form.descRu,
                kk: form.descKk,
                en: form.descEn,
            },
            directionTitle: form.direction,
            workType: form.workType,
            participantCount: Number(form.participantCount),
        };

        onSave(updatedTopic);
    };

    return (
        <div className="tem-overlay" onClick={onClose}>
            <div className="tem-modal" onClick={(e) => e.stopPropagation()}>
                <div className="tem-header">
                    <div className="tem-header-text">
                        <div className="tem-title-row">
                            <Edit3 size={18} className="tem-icon-accent" />
                            <h2>{t('supervisor.editTopicTitle')}</h2>
                        </div>
                        <p>{t('supervisor.editTopicSubtitle')}</p>
                    </div>
                    <button className="tem-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="tem-body">
                    {/* Название */}
                    <div className="tem-section">
                        <div className="tem-section-label">
                            <Globe size={16} className="tem-icon-muted" />
                            <h3>{t('supervisor.topicTitle')}</h3>
                        </div>
                        <div className="tem-input-group">
                            <div className="tem-field">
                                <div className="tem-lang-tag">KK</div>
                                <input
                                    name="titleKk"
                                    value={form.titleKk}
                                    onChange={handleChange}
                                    placeholder={t('supervisor.topicTitle') + '...'}
                                    className="tem-input"
                                />
                            </div>
                            <div className="tem-field">
                                <div className="tem-lang-tag">RU</div>
                                <input
                                    name="titleRu"
                                    value={form.titleRu}
                                    onChange={handleChange}
                                    placeholder={t('supervisor.topicTitle') + '...'}
                                    className="tem-input"
                                />
                            </div>
                            <div className="tem-field">
                                <div className="tem-lang-tag">EN</div>
                                <input
                                    name="titleEn"
                                    value={form.titleEn}
                                    onChange={handleChange}
                                    placeholder="Topic title..."
                                    className="tem-input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Описание */}
                    <div className="tem-section">
                        <div className="tem-section-label">
                            <AlignLeft size={16} className="tem-icon-muted" />
                            <h3>{t('supervisor.descriptionTasks')}</h3>
                        </div>
                        <div className="tem-input-group">
                            <div className="tem-field vertical">
                                <div className="tem-lang-tag">KK</div>
                                <textarea
                                    name="descKk"
                                    value={form.descKk}
                                    onChange={handleChange}
                                    className="tem-textarea-fixed"
                                />
                            </div>

                            <div className="tem-field vertical">
                                <div className="tem-lang-tag">RU</div>
                                <textarea
                                    name="descRu"
                                    value={form.descRu}
                                    onChange={handleChange}
                                    className="tem-textarea-fixed"
                                />
                            </div>

                            {/* 🔥 EN DESCRIPTION */}
                            <div className="tem-field vertical">
                                <div className="tem-lang-tag">EN</div>
                                <textarea
                                    name="descEn"
                                    value={form.descEn}
                                    onChange={handleChange}
                                    className="tem-textarea-fixed"

                                />
                            </div>
                        </div>
                    </div>

                    {/* Параметры */}
                    <div className="tem-grid-params">
                        <div className="tem-section">
                            <div className="tem-section-label">
                                <Info size={16} className="tem-icon-muted" />
                                <h3>{t('nav.directions')}</h3>
                            </div>
                            <select
                                name="direction"
                                value={form.direction}
                                onChange={handleChange}
                                className="tem-select"
                            >
                                <option value="">{t('common.select')}</option>
                                {directions.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>

                        <div className="tem-section">
                            <div className="tem-section-label">
                                <Layers size={16} className="tem-icon-muted" />
                                <h3>{t('supervisor.workType')}</h3>
                            </div>
                            <select
                                name="workType"
                                value={form.workType}
                                onChange={handleChange}
                                className="tem-select"
                            >
                                <option value="diploma_project">{t('supervisor.diplomaProject')}</option>
                                <option value="diploma_work">{t('supervisor.diplomaWork')}</option>
                                <option value="course_work">{t('supervisor.courseWork')}</option>
                            </select>
                        </div>

                        <div className="tem-section">
                            <div className="tem-section-label">
                                <Users size={16} className="tem-icon-muted" />
                                <h3>{t('supervisor.students')}</h3>
                            </div>
                            <input
                                type="number"
                                min="1"
                                name="participantCount"
                                value={form.participantCount}
                                onChange={handleChange}
                                className="tem-input-number"
                            />
                        </div>
                    </div>
                </div>

                <div className="tem-footer">
                    <button className="tem-btn-secondary" onClick={onClose}>
                        {t('common.cancel')}
                    </button>
                    <button className="tem-btn-primary" onClick={handleSave}>
                        {t('common.saveChanges')}
                    </button>
                </div>
            </div>
        </div>
    );
}
