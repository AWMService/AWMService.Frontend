import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, Calendar, BookText, AlignLeft, AlertCircle } from "lucide-react";
import "./DirectionViewModal.css";

export default function DirectionViewModal({ onClose, direction }) {
    const { t } = useTranslation();

    const statusLabels = {
        draft: t('status.draft'),
        pending: t('status.underReview'),
        approved: t('status.approved'),
        rejected: t('status.rejected'),
    };
    const [titleTab, setTitleTab] = useState("ru");
    const [descTab, setDescTab] = useState("ru");

    useEffect(() => {
        if (direction) {
            if (direction.title?.ru) setTitleTab("ru");
            else if (direction.title?.kk) setTitleTab("kk");
            else setTitleTab("en");

            if (direction.description?.ru) setDescTab("ru");
            else if (direction.description?.kk) setDescTab("kk");
            else setDescTab("en");
        }
    }, [direction]);

    if (!direction) return null;

    const formatDate = (iso) => {
        if (!iso) return "—";
        try {
            return new Date(iso).toLocaleDateString("ru-RU", {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch {
            return iso ?? "—";
        }
    };

    return (
        <div className="dvm-overlay" onClick={onClose}>
            <div className="dvm-modal" onClick={(e) => e.stopPropagation()}>
                <div className="dvm-header">
                    <div className="dvm-header-info">
                        <h2>{t('common.details')}</h2>
                        <span className={`dvm-status-pill st-${direction.status}`}>
                            {statusLabels[direction.status] || direction.status}
                        </span>
                    </div>
                    <button className="dvm-close-btn" onClick={onClose}>
                        <X size={20} strokeWidth={2} />
                    </button>
                </div>

                <div className="dvm-content">
                    {/* Если статус отклонен — показываем причину сразу сверху */}
                    {direction.status === "rejected" && direction.rejectionReason && (
                        <div className="dvm-rejection-alert">
                            <AlertCircle size={20} />
                            <div className="dvm-rejection-content">
                                <strong>{t('supervisor.rejectionReason')}</strong>
                                <p>{direction.rejectionReason}</p>
                            </div>
                        </div>
                    )}

                    <div className="dvm-info-grid">
                        <div className="dvm-info-card">
                            <Calendar size={18} />
                            <div className="dvm-info-text">
                                <label>{t('supervisor.createdDate')}</label>
                                <span>{formatDate(direction.createdAt)}</span>
                            </div>
                        </div>
                        {direction.approvedAt && (
                            <div className="dvm-info-card">
                                <Calendar size={18} />
                                <div className="dvm-info-text">
                                    <label>{t('supervisor.approvedDate')}</label>
                                    <span>{formatDate(direction.approvedAt)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="dvm-section">
                        <div className="dvm-section-header">
                            <div className="dvm-section-title">
                                <BookText size={18} />
                                <h3>{t('supervisor.directionTitle')}</h3>
                            </div>
                            <div className="dvm-tabs-mini">
                                {['kk', 'ru', 'en'].map((lang) => (
                                    <button
                                        key={lang}
                                        className={`dvm-tab-btn ${titleTab === lang ? "active" : ""}`}
                                        onClick={() => setTitleTab(lang)}
                                    >
                                        {lang.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="dvm-text-box">
                            {direction.title?.[titleTab] || <span className="dvm-no-data">{t('common.noData')}</span>}
                        </div>
                    </div>

                    <div className="dvm-section">
                        <div className="dvm-section-header">
                            <div className="dvm-section-title">
                                <AlignLeft size={18} />
                                <h3>{t('common.description')}</h3>
                            </div>
                            <div className="dvm-tabs-mini">
                                {['kk', 'ru', 'en'].map((lang) => (
                                    <button
                                        key={lang}
                                        className={`dvm-tab-btn ${descTab === lang ? "active" : ""}`}
                                        onClick={() => setDescTab(lang)}
                                    >
                                        {lang.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="dvm-text-box description-area">
                            {direction.description?.[descTab] || <span className="dvm-no-data">{t('supervisor.noDescription')}</span>}
                        </div>
                    </div>
                </div>

                <div className="dvm-footer">
                    <button className="dvm-btn-primary" onClick={onClose}>{t('common.close')}</button>
                </div>
            </div>
        </div>
    );
}