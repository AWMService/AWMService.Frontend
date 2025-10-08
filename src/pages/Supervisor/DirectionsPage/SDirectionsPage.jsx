import React, { useState } from "react";
import { Plus, BookOpen, Eye, Edit, Send } from "lucide-react";
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
            title: {
                ru: "Веб-технологии и облачные вычисления",
            },
            description: {
                ru: "Изучение современных веб-технологий и облачных платформ",
            },
            status: "rejected",
            createdAt: "2024-01-20T14:30:00Z",
            rejectionReason:
                "Необходимо более детально описать область исследования и добавить конкретные технологии",
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

    const handleSaveEdit = (updated) => {
        setDirections((prev) =>
            prev.map((d) => (d.id === updated.id ? { ...d, ...updated } : d))
        );
    };

    return (
        <div className="directions-page">
            {/* Header */}
            <div className="directions-header">
                <div className="directions-header-left">
                    <BookOpen className="icon" />
                    <div>
                        <h1>Мои направления</h1>
                        <p>Управление направлениями дипломных проектов и работ</p>
                    </div>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    <Plus className="icon" />
                    Создать направление
                </button>
            </div>

            {/* Directions List */}
            {directions.length === 0 ? (
                <div className="empty-card">
                    <BookOpen className="icon-lg" />
                    <h3>Направления не созданы</h3>
                    <p>Начните с создания первого направления для дипломных проектов</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <Plus className="icon" />
                        Создать направление
                    </button>
                </div>
            ) : (
                <div className="directions-list">
                    {directions.map((direction) => (
                        <div key={direction.id} className="card">
                            <div className="card-header">
                                <div>
                                    <h4>
                                        {direction.title.ru ??
                                            direction.title.kk ??
                                            direction.title.en}
                                    </h4>
                                    <p>
                                        {direction.description.ru ??
                                            direction.description.kk ??
                                            direction.description.en}
                                    </p>
                                </div>
                                <span
                                    className={`badge ${direction.status}`}
                                >
                                    {statusLabels[direction.status]}
                                </span>
                            </div>

                            <div className="card-footer">
                                <span className="date">
                                    Создано:{" "}
                                    {new Date(
                                        direction.createdAt
                                    ).toLocaleDateString("ru-RU")}
                                </span>

                                <div className="actions">
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => openView(direction)}
                                    >
                                        <Eye className="icon" /> Просмотр
                                    </button>

                                    {direction.status === "draft" && (
                                        <>
                                            <button
                                                className="btn btn-outline"
                                                onClick={() =>
                                                    openEdit(direction)
                                                }
                                            >
                                                <Edit className="icon" />{" "}
                                                Редактировать
                                            </button>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() =>
                                                    handleSendForReview(
                                                        direction.id
                                                    )
                                                }
                                            >
                                                <Send className="icon" />{" "}
                                                Отправить на кафедру
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {direction.status === "rejected" && (
                                <div className="rejected-box">
                                    <p>
                                        <strong>Отклонено:</strong>
                                    </p>
                                    <p>{direction.rejectionReason}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {isCreateModalOpen && (
                <CreateDirectionModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreate={(payload) => {
                        handleCreateDirection(payload);
                        setIsCreateModalOpen(false);
                    }}
                />
            )}

            {/* View Modal */}
            {isViewModalOpen && selectedDirection && (
                <DirectionViewModal
                    direction={selectedDirection}
                    onClose={() => {
                        setIsViewModalOpen(false);
                        setSelectedDirection(null);
                    }}
                />
            )}

            {/* Edit Modal */}
            {isEditModalOpen && selectedDirection && (
                <DirectionEditModal
                    direction={selectedDirection}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedDirection(null);
                    }}
                    onSave={(updated) => {
                        handleSaveEdit(updated);
                        setIsEditModalOpen(false);
                        setSelectedDirection(null);
                    }}
                />
            )}
        </div>
    );
}
