import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { getIntlLocale, getLocalizedValue, normalizeLanguage } from "@awm/shared";
import { Plus, BookOpen, Eye, Edit, Send, Calendar, AlertCircle } from "lucide-react";
import CreateDirectionModal from "../../components/CreateDirectionModal/CreateDirectionModal";
import DirectionViewModal from "../../components/directions/DirectionViewModal";
import DirectionEditModal from "../../components/directions/DirectionEditModal";
import "./SDirectionsPage.css";

export default function SDirectionsPage() {
    const { t, i18n } = useTranslation();
    const locale = getIntlLocale(i18n.language);
    const currentLanguage = normalizeLanguage(i18n.language);

    const statusLabels = {
        draft: t('status.draft'),
        pending: t('status.underReview'),
        approved: t('status.approved'),
        rejected: t('status.rejected'),
    };
    const [directions, setDirections] = useState([
        {
            id: "1",
            title: {
                kk: "Жасанды интеллект және машиналық оқыту",
                ru: "Искусственный интеллект и машинное обучение",
                en: "Artificial Intelligence and Machine Learning",
            },
            description: {
                kk: "Жасанды интеллект алгоритмдерін зерттеу және дамыту",
                ru: "Исследование и разработка алгоритмов искусственного интеллекта",
                en: "Research and development of AI algorithms",
            },
            status: "approved",
            createdAt: "2024-01-15T10:00:00Z",
            approvedAt: "2024-01-20T10:00:00Z",
        },
        {
            id: "2",
            title: { kk: "Веб-технологиялар және бұлтты есептеу", ru: "Веб-технологии и облачные вычисления", en: "Web Technologies and Cloud Computing" },
            description: { kk: "Заманауи веб-технологиялар мен бұлтты платформаларды зерттеу", ru: "Изучение современных веб-технологий и облачных платформ", en: "Study of modern web technologies and cloud platforms" },
            status: "rejected",
            createdAt: "2024-01-20T14:30:00Z",
            rejectionReason: {
                kk: "Зерттеу саласын және нақты технологияларды толығырақ сипаттау қажет",
                ru: "Необходимо более детально описать область исследования и добавить конкретные технологии",
                en: "The research area and specific technologies need to be described in more detail",
            },
        },
    ]);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedDirection, setSelectedDirection] = useState(null);

    const handleCreateDirection = (newDirection) => {
        const dir = {
            id: Date.now().toString(),
            title: newDirection.title,
            description: newDirection.description,
            status: "draft",
            createdAt: new Date().toISOString(),
        };
        setDirections((prev) => [dir, ...prev]);
    };

    const handleSendForReview = (id) => {
        setDirections((prev) =>
            prev.map((d) => (d.id === id ? { ...d, status: "pending" } : d))
        );
    };

    const openView = (direction) => {
        setSelectedDirection(direction);
        setIsViewModalOpen(true);
    };

    const openEdit = (direction) => {
        setSelectedDirection(direction);
        setIsEditModalOpen(true);
    };

    return (
        <div className="directions-page">
            <header className="directions-header">
                <div className="header-text">
                    <h1>{t('supervisor.directionsTitle')}</h1>
                    <p>{t('supervisor.directionsSubtitle')}</p>
                </div>
                <button
                    className="btn-create-new"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    <Plus size={20} strokeWidth={1.5} />
                    <span>{t('supervisor.createDirection')}</span>
                </button>
            </header>

            {directions.length === 0 ? (
                <div className="empty-state-wrapper">
                    <div className="empty-icon-circle">
                        <BookOpen size={40} strokeWidth={1.5} />
                    </div>
                    <h3>{t('supervisor.noDirections')}</h3>
                    <p>{t('supervisor.directionsSubtitle')}</p>
                    <button className="btn-empty-action" onClick={() => setIsCreateModalOpen(true)}>
                        {t('supervisor.createFirstDirection')}
                    </button>
                </div>
            ) : (
                <div className="directions-grid-layout">
                    {directions.map((direction) => (
                        <div key={direction.id} className={`custom-dir-card status-border-${direction.status}`}>
                            <div className="card-inner-content">
                                <div className="card-meta-top">
                                    <span className={`status-badge badge-${direction.status}`}>
                                        {statusLabels[direction.status]}
                                    </span>
                                    <span className="creation-date">
                                        <Calendar size={13} strokeWidth={2} />
                                        {new Date(direction.createdAt).toLocaleDateString(locale)}
                                    </span>
                                </div>

                                <h3 className="direction-item-title">
                                    {getLocalizedValue(direction.title, currentLanguage)}
                                </h3>
                                <p className="direction-item-desc">
                                    {getLocalizedValue(direction.description, currentLanguage)}
                                </p>

                                {direction.status === "rejected" && (
                                    <div className="rejection-box">
                                        <AlertCircle size={14} />
                                        <span>{getLocalizedValue(direction.rejectionReason, currentLanguage)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="card-footer-actions">
                                <div className="left-actions">
                                    <button className="minimal-btn" onClick={() => openView(direction)} title={t('common.view')}>
                                        <Eye size={18} />
                                        <span>{t('common.details')}</span>
                                    </button>
                                    {direction.status === "draft" && (
                                        <button className="minimal-btn" onClick={() => openEdit(direction)} title={t('common.edit')}>
                                            <Edit size={18} />
                                            <span>{t('common.edit')}</span>
                                        </button>
                                    )}
                                </div>

                                {direction.status === "draft" && (
                                    <button
                                        className="send-for-review-btn"
                                        onClick={() => handleSendForReview(direction.id)}
                                    >
                                        <Send size={14} />
                                        {t('common.send')}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isCreateModalOpen && (
                <CreateDirectionModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreate={(payload) => {
                        handleCreateDirection(payload);
                        setIsCreateModalOpen(false);
                    }}
                />
            )}
            {isViewModalOpen && selectedDirection && (
                <DirectionViewModal
                    direction={selectedDirection}
                    onClose={() => {
                        setIsViewModalOpen(false);
                        setSelectedDirection(null);
                    }}
                />
            )}
            {isEditModalOpen && selectedDirection && (
                <DirectionEditModal
                    direction={selectedDirection}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedDirection(null);
                    }}
                    onSave={(updated) => {
                        setDirections(prev => prev.map(d => d.id === updated.id ? {...d, ...updated} : d));
                        setIsEditModalOpen(false);
                        setSelectedDirection(null);
                    }}
                />
            )}
        </div>
    );
}
