import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, MessageSquare, Clock } from 'lucide-react';
import './RemarksFormModal.css';

const mockPreviousRemarks = [
    {
        id: 1,
        category: 'formatting',
        text: 'Отступы на страницах 12-15 не соответствуют ГОСТ. Необходимо выровнять поля.',
        date: '2025-05-10',
    },
    {
        id: 2,
        category: 'citations',
        text: 'Ссылка [3] не найдена в списке литературы.',
        date: '2025-05-12',
    },
];

const CATEGORIES = ['formatting', 'content', 'structure', 'citations', 'other'];

export default function RemarksFormModal({ document, onClose, onSubmit }) {
    const { t } = useTranslation();
    const [category, setCategory] = useState('');
    const [remarkText, setRemarkText] = useState('');
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
        });
    };

    const previousRemarks = document.remarks ? mockPreviousRemarks : [];

    return (
        <div className="rfm-overlay" onClick={onClose}>
            <div className="rfm-modal" onClick={(e) => e.stopPropagation()}>
                <div className="rfm-header">
                    <div className="rfm-header-text">
                        <h2>{t('normocontrol.addRemark')}</h2>
                        <p>{document.studentName} — {document.themeTitle}</p>
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
                                                <span className="rfm-history-date">{remark.date}</span>
                                            </div>
                                            <p className="rfm-history-text">{remark.text}</p>
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
