import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getIntlLocale, getLocalizedValue } from '@awm/shared';
import { X, MessageSquare, Clock } from 'lucide-react';
import './RemarksFormModal.css';

const mockPreviousRemarks = [
    {
        id: 1,
        category: 'formatting',
        text: {
            ru: 'Отступы на страницах 12-15 не соответствуют ГОСТ. Необходимо выровнять поля.',
            kk: '12-15 беттердегі шегіністер ГОСТ-қа сәйкес келмейді. Өрістерді туралау қажет.',
            en: 'Margins on pages 12-15 do not meet the standard. The page layout needs to be aligned.',
        },
        date: '2025-05-10',
    },
    {
        id: 2,
        category: 'citations',
        text: {
            ru: 'Ссылка [3] не найдена в списке литературы.',
            kk: '[3] сілтемесі әдебиеттер тізімінде табылмады.',
            en: 'Reference [3] was not found in the bibliography list.',
        },
        date: '2025-05-12',
    },
];

const CATEGORIES = ['formatting', 'content', 'structure', 'citations', 'other'];

export default function RemarksFormModal({ document, onClose, onSubmit }) {
    const { t, i18n } = useTranslation();
    const locale = getIntlLocale(i18n.language);
    const [category, setCategory] = useState('');
    const [remarkText, setRemarkText] = useState('');
    const [file, setFile] = useState(null);
    const [touched, setTouched] = useState({ category: false, text: false });

    if (!document) return null;

    const canSubmit = category !== '' && remarkText.trim().length > 0;

    const getCategoryLabel = (cat) => {
        const map = {
            formatting: t('normocontrol.formatting'),
            content: t('normocontrol.content'),
            structure: t('normocontrol.structure'),
            citations: t('normocontrol.citations'),
            other: t('normocontrol.other'),
        };
        return map[cat] || cat;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setTouched({ category: true, text: true });

        if (!canSubmit) return;

        onSubmit({
            documentId: document.id,
            category,
            text: remarkText.trim(),
            date: new Date().toISOString().split('T')[0],
            file: file,
        });
    };

    const previousRemarks = document.remarks ? mockPreviousRemarks : [];

    return (
        <div className="rfm-overlay" onClick={onClose}>
            <div className="rfm-modal" onClick={(e) => e.stopPropagation()}>
                <div className="rfm-header">
                    <div className="rfm-header-text">
                        <h2>{t('normocontrol.addRemark')}</h2>
                        <p>{document.studentName} — {getLocalizedValue(document.themeTitle, i18n.language)}</p>
                    </div>
                    <button className="rfm-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="rfm-body">
                        {/* New remark form */}
                        <div className="rfm-section">
                            <h3 className="rfm-section-title">
                                <MessageSquare size={16} />
                                {t('normocontrol.newRemark')}
                            </h3>

                            <div className="rfm-field">
                                <label className="rfm-label">{t('normocontrol.remarkCategory')}</label>
                                <select
                                    className={`rfm-select ${touched.category && !category ? 'error' : ''}`}
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    onBlur={() => setTouched((s) => ({ ...s, category: true }))}
                                >
                                    <option value="">{t('normocontrol.selectCategory')}</option>
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {getCategoryLabel(cat)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="rfm-field">
                                <label className="rfm-label">{t('normocontrol.remarkText')}</label>
                                <textarea
                                    className={`rfm-textarea ${touched.text && !remarkText.trim() ? 'error' : ''}`}
                                    value={remarkText}
                                    onChange={(e) => setRemarkText(e.target.value)}
                                    onBlur={() => setTouched((s) => ({ ...s, text: true }))}
                                    placeholder={t('normocontrol.remarkPlaceholder')}
                                    rows={4}
                                />
                            </div>

                            <div className="rfm-field">
                                <label className="rfm-label">{t('normocontrol.uploadDocument')}</label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            setFile(e.target.files[0]);
                                        }
                                    }}
                                />
                                {file && <span className="rfm-filename" style={{marginTop: 5, fontSize: '0.85em', color: '#666'}}>{file.name}</span>}
                            </div>
                        </div>

                        {/* Previous remarks */}
                        {previousRemarks.length > 0 && (
                            <div className="rfm-section">
                                <h3 className="rfm-section-title">
                                    <Clock size={16} />
                                    {t('normocontrol.previousRemarks')}
                                </h3>
                                <div className="rfm-history-list">
                                    {previousRemarks.map((remark) => (
                                        <div key={remark.id} className="rfm-history-item">
                                            <div className="rfm-history-meta">
                                                <span className="rfm-history-category">
                                                    {getCategoryLabel(remark.category)}
                                                </span>
                                                <span className="rfm-history-date">
                                                    {new Date(remark.date).toLocaleDateString(locale)}
                                                </span>
                                            </div>
                                            <p className="rfm-history-text">{getLocalizedValue(remark.text, i18n.language)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="rfm-footer">
                        <button type="button" className="rfm-btn-secondary" onClick={onClose}>
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            className="rfm-btn-primary"
                            disabled={!canSubmit}
                        >
                            {t('normocontrol.submitRemark')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
