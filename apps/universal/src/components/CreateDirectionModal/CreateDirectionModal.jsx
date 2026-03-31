import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, Globe, AlignLeft, Info } from "lucide-react";
import "./CreateDirectionModal.css";

export default function CreateDirectionModal({ onClose, onCreate }) {
    const { t } = useTranslation();
    const [title, setTitle] = useState({ kk: "", ru: "", en: "" });
    const [description, setDescription] = useState({ kk: "", ru: "", en: "" });
    const [touched, setTouched] = useState({
        title: { kk: false, ru: false, en: false },
        description: { kk: false, ru: false, en: false }
    });
    const [canSubmit, setCanSubmit] = useState(false);

    useEffect(() => {
        const valid =
            title.kk.trim() !== "" &&
            title.ru.trim() !== "" &&
            description.kk.trim() !== "";
        setCanSubmit(valid);
    }, [title, description]);

    const handleChangeTitle = (lang, value) => setTitle((s) => ({ ...s, [lang]: value }));
    const handleChangeDesc = (lang, value) => setDescription((s) => ({ ...s, [lang]: value }));

    const markTouched = (field, lang) => {
        setTouched((t) => ({ ...t, [field]: { ...t[field], [lang]: true } }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
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
        <div className="cdm-overlay" onClick={onClose}>
            <div className="cdm-modal" onClick={(e) => e.stopPropagation()}>
                <div className="cdm-header">
                    <div className="cdm-header-text">
                        <h2>{t('supervisor.newDirection')}</h2>
                        <p>{t('supervisor.fillInfo')}</p>
                    </div>
                    <button className="cdm-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form className="cdm-form" onSubmit={handleSubmit} noValidate>
                    <div className="cdm-body">
                        {/* Title Section */}
                        <div className="cdm-section">
                            <div className="cdm-section-label">
                                <Globe size={16} />
                                <h3>{t('supervisor.directionTitle')}</h3>
                            </div>

                            <div className="cdm-input-group">
                                <div className="cdm-field">
                                    <div className="cdm-lang-tag">KK</div>
                                    <input
                                        value={title.kk}
                                        onChange={(e) => handleChangeTitle("kk", e.target.value)}
                                        onBlur={() => markTouched("title", "kk")}
                                        placeholder={t('supervisor.directionTitle') + '...'}
                                        className={`cdm-input ${touched.title.kk && !title.kk.trim() ? "error" : ""}`}
                                    />
                                </div>

                                <div className="cdm-field">
                                    <div className="cdm-lang-tag">RU</div>
                                    <input
                                        value={title.ru}
                                        onChange={(e) => handleChangeTitle("ru", e.target.value)}
                                        onBlur={() => markTouched("title", "ru")}
                                        placeholder={t('supervisor.directionTitle') + '...'}
                                        className={`cdm-input ${touched.title.ru && !title.ru.trim() ? "error" : ""}`}
                                    />
                                </div>

                                <div className="cdm-field">
                                    <div className="cdm-lang-tag">EN</div>
                                    <input
                                        value={title.en}
                                        onChange={(e) => handleChangeTitle("en", e.target.value)}
                                        placeholder="Title in English..."
                                        className="cdm-input"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="cdm-section">
                            <div className="cdm-section-label">
                                <AlignLeft size={16} />
                                <h3>{t('supervisor.descriptionTasks')}</h3>
                            </div>

                            <div className="cdm-input-group">
                                <div className="cdm-field vertical">
                                    <div className="cdm-lang-tag">KK</div>
                                    <textarea
                                        value={description.kk}
                                        onChange={(e) => handleChangeDesc("kk", e.target.value)}
                                        onBlur={() => markTouched("description", "kk")}
                                        placeholder={t('common.description') + '...'}
                                        className={`cdm-textarea ${touched.description.kk && !description.kk.trim() ? "error" : ""}`}
                                        rows={3}
                                    />
                                </div>

                                <div className="cdm-field vertical">
                                    <div className="cdm-lang-tag">RU</div>
                                    <textarea
                                        value={description.ru}
                                        onChange={(e) => handleChangeDesc("ru", e.target.value)}
                                        placeholder={t('common.description') + '...'}
                                        className="cdm-textarea"
                                        rows={3}
                                    />
                                </div>

                                <div className="cdm-field vertical">
                                    <div className="cdm-lang-tag">EN</div>
                                    <textarea
                                        value={description.en}
                                        onChange={(e) => handleChangeDesc("en", e.target.value)}
                                        placeholder="Detailed description..."
                                        className="cdm-textarea"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        {!canSubmit && (
                            <div className="cdm-validation-hint">
                                <Info size={14} />
                                <span>{t('supervisor.fillDirectionFields')}</span>
                            </div>
                        )}
                    </div>

                    <div className="cdm-footer">
                        <button type="button" className="cdm-btn-secondary" onClick={onClose}>
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            className="cdm-btn-primary"
                            disabled={!canSubmit}
                        >
                            {t('supervisor.createDirection')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}