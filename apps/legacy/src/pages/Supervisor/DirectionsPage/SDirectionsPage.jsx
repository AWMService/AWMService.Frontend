import React, { useState } from "react";
import { Plus, BookOpen, Eye, Edit, Send, Calendar, AlertCircle } from "lucide-react";
import CreateDirectionModal from "../../../components/Supervisor/CreateDirectionModal/CreateDirectionModal";
import DirectionViewModal from "../../../components/Supervisor/directions/DirectionViewModal";
import DirectionEditModal from "../../../components/Supervisor/directions/DirectionEditModal";
import "./SDirectionsPage.css";

const statusLabels = {
    draft: "Черновик",
    pending: "На рассмотрении",
    approved: "Утверждено",
    rejected: "Отклонено",
};

export default function SDirectionsPage() {
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
            title: { ru: "Веб-технологии и облачные вычисления" },
            description: { ru: "Изучение современных веб-технологий и облачных платформ" },
            status: "rejected",
            createdAt: "2024-01-20T14:30:00Z",
            rejectionReason: "Необходимо более детально описать область исследования и добавить конкретные технологии",
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
                    <h1>Направления</h1>
                    <p>Управление темами и областями дипломных проектов</p>
                </div>
                <button
                    className="btn-create-new"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    <Plus size={20} strokeWidth={1.5} />
                    <span>Создать направление</span>
                </button>
            </header>

            {directions.length === 0 ? (
                <div className="empty-state-wrapper">
                    <div className="empty-icon-circle">
                        <BookOpen size={40} strokeWidth={1.5} />
                    </div>
                    <h3>Список направлений пуст</h3>
                    <p>Вы еще не создали ни одного направления для работы со студентами</p>
                    <button className="btn-empty-action" onClick={() => setIsCreateModalOpen(true)}>
                        Создать первое направление
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
                                        {new Date(direction.createdAt).toLocaleDateString("ru-RU")}
                                    </span>
                                </div>

                                <h3 className="direction-item-title">
                                    {direction.title.ru ?? direction.title.kk ?? direction.title.en}
                                </h3>
                                <p className="direction-item-desc">
                                    {direction.description.ru ?? direction.description.kk ?? direction.description.en}
                                </p>

                                {direction.status === "rejected" && (
                                    <div className="rejection-box">
                                        <AlertCircle size={14} />
                                        <span>{direction.rejectionReason}</span>
                                    </div>
                                )}
                            </div>

                            <div className="card-footer-actions">
                                <div className="left-actions">
                                    <button className="minimal-btn" onClick={() => openView(direction)} title="Просмотр">
                                        <Eye size={18} />
                                        <span>Детали</span>
                                    </button>
                                    {direction.status === "draft" && (
                                        <button className="minimal-btn" onClick={() => openEdit(direction)} title="Редактировать">
                                            <Edit size={18} />
                                            <span>Правка</span>
                                        </button>
                                    )}
                                </div>

                                {direction.status === "draft" && (
                                    <button
                                        className="send-for-review-btn"
                                        onClick={() => handleSendForReview(direction.id)}
                                    >
                                        <Send size={14} />
                                        Отправить
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