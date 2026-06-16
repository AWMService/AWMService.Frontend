import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Globe, AlignLeft, Info, Layers, Users, AlertCircle } from "lucide-react";
import "./CreateTopicModal.css";

export default function CreateTopicModal({ open, onClose, onCreate, directions = [], workTypes = [] }) {
    const { t } = useTranslation();
    const [form, setForm] = useState({
        directionId: "",
        title: { kk: "", ru: "", en: "" },
        description: { kk: "", ru: "", en: "" },
        workTypeId: "",
        studentCount: "1",
    });

    const [touched, setTouched] = useState(false);

    useEffect(() => {
        if (!open) {
            setForm({
                directionId: "",
                title: { kk: "", ru: "", en: "" },
                description: { kk: "", ru: "", en: "" },
                workTypeId: "",
                studentCount: "1",
            });
            setTouched(false);
        }
    }, [open]);

    if (!open) return null;

    const updateField = (path, value) => {
        if (!path.includes(".")) {
            setForm(p => ({ ...p, [path]: value }));
            return;
        }
        const [parent, child] = path.split(".");
        setForm(p => ({ ...p, [parent]: { ...p[parent], [child]: value } }));
    };

    const valid = () => {
        const hasDirection = String(form.directionId).trim() !== "";
        const hasTitle = (form.title.kk + form.title.ru + form.title.en).trim() !== "";
        const hasDesc = (form.description.kk + form.description.ru + form.description.en).trim() !== "";
        const hasWorkType = String(form.workTypeId).trim() !== "";
        return hasDirection && hasTitle && hasDesc && hasWorkType;
    };

    const handleSave = () => {
        setTouched(true);
        if (!valid()) return;

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
            directionId: form.directionId,
            workTypeId: form.workTypeId,
            studentCount: parseInt(form.studentCount, 10) || 1,
            createdAt: new Date().toISOString(),
        };

        onCreate?.(topic);
        onClose();
    };

    return (
        <div className="ctm-overlay" onClick={onClose}>
            <div className="ctm-modal" onClick={e => e.stopPropagation()}>
                <div className="ctm-header">
                    <div className="ctm-header-text">
                        <h2>{t('supervisor.createTopic')}</h2>
                        <p>{t('supervisor.fillInfo')}</p>
                    </div>
                    <button className="ctm-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="ctm-body">
                    {}
                    <div className="ctm-section">
                        <div className="ctm-section-label">
                            <Info size={16} className="ctm-icon-muted" />
                            <h3>{t('nav.directions')}</h3>
                        </div>
                        <select
                            className={`ctm-select ${touched && !form.directionId ? "invalid" : ""}`}
                            value={form.directionId}
                            onChange={e => updateField("directionId", e.target.value)}
                        >
                            <option value="">{t('supervisor.selectDirection')}</option>
                            {directions.map((direction) => (
                                <option key={direction.id ?? direction.value ?? direction} value={direction.id ?? direction.value ?? direction}>
                                    {direction.label ?? direction.title ?? direction}
                                </option>
                            ))}
                        </select>
                    </div>

                    {}
                    <div className="ctm-section">
                        <div className="ctm-section-label">
                            <Globe size={16} className="ctm-icon-muted" />
                            <h3>{t('supervisor.topicTitle')}</h3>
                        </div>
                        <div className="ctm-input-group">
                            <div className={`ctm-field ${touched && !form.title.kk && !form.title.ru && !form.title.en ? "invalid" : ""}`}>
                                <div className="ctm-lang-tag">KK</div>
                                <input
                                    className="ctm-input"
                                    placeholder={t('supervisor.topicTitle') + '...'}
                                    value={form.title.kk}
                                    onChange={e => updateField("title.kk", e.target.value)}
                                />
                            </div>
                            <div className="ctm-field">
                                <div className="ctm-lang-tag">RU</div>
                                <input
                                    className="ctm-input"
                                    placeholder={t('supervisor.topicTitle') + '...'}
                                    value={form.title.ru}
                                    onChange={e => updateField("title.ru", e.target.value)}
                                />
                            </div>
                            <div className="ctm-field">
                                <div className="ctm-lang-tag">EN</div>
                                <input
                                    className="ctm-input"
                                    placeholder={`${t('common.title')}...`}
                                    value={form.title.en}
                                    onChange={e => updateField("title.en", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="ctm-section">
                        <div className="ctm-section-label">
                            <AlignLeft size={16} className="ctm-icon-muted" />
                            <h3>{t('supervisor.descriptionTasks')}</h3>
                        </div>
                        <div className="ctm-input-group">
                            <div className={`ctm-field vertical ${touched && !form.description.kk && !form.description.ru && !form.description.en ? "invalid" : ""}`}>
                                <div className="ctm-lang-tag">KK</div>
                                <textarea
                                    className="ctm-textarea"
                                    placeholder={t('common.description') + '...'}
                                    value={form.description.kk}
                                    onChange={e => updateField("description.kk", e.target.value)}
                                />
                            </div>

                            <div className="ctm-field vertical">
                                <div className="ctm-lang-tag">RU</div>
                                <textarea
                                    className="ctm-textarea"
                                    placeholder={t('common.description') + '...'}
                                    value={form.description.ru}
                                    onChange={e => updateField("description.ru", e.target.value)}
                                />
                            </div>

                            {}
                            <div className="ctm-field vertical">
                                <div className="ctm-lang-tag">EN</div>
                                <textarea
                                    className="ctm-textarea"
                                    placeholder={`${t('common.description')}...`}
                                    value={form.description.en}
                                    onChange={e => updateField("description.en", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="ctm-grid-params">
                        <div className="ctm-section">
                            <div className="ctm-section-label">
                                <Layers size={16} className="ctm-icon-muted" />
                                <h3>{t('supervisor.workType')}</h3>
                            </div>
                            <select
                                className={`ctm-select ${touched && !form.workType ? "invalid" : ""}`}
                                value={form.workTypeId}
                                onChange={e => updateField("workTypeId", e.target.value)}
                            >
                                <option value="">{t('common.select')}</option>
                                {workTypes.map((workType) => (
                                    <option key={workType.id} value={workType.id}>
                                        {workType.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="ctm-section">
                            <div className="ctm-section-label">
                                <Users size={16} className="ctm-icon-muted" />
                                <h3>{t('supervisor.students')}</h3>
                            </div>
                            <select
                                className="ctm-select"
                                value={form.studentCount}
                                onChange={e => updateField("studentCount", e.target.value)}
                            >
                                <option value="1">{t('supervisor.oneStudent')}</option>
                                <option value="2">{t('supervisor.twoStudents')}</option>
                                <option value="3">{t('supervisor.threeStudents')}</option>
                            </select>
                        </div>
                    </div>

                    {touched && !valid() && (
                        <div className="ctm-error-notice">
                            <AlertCircle size={14} />
                            <span>
                                {t('supervisor.requiredFields')}
                            </span>
                        </div>
                    )}
                </div>

                <div className="ctm-footer">
                    <button className="ctm-btn-secondary" onClick={onClose}>
                        {t('common.cancel')}
                    </button>
                    <button
                        className={`ctm-btn-primary ${!valid() && touched ? "disabled" : ""}`}
                        onClick={handleSave}
                    >
                        {t('supervisor.createTopic')}
                    </button>
                </div>
            </div>
        </div>
    );
}
