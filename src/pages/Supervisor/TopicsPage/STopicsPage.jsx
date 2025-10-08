import React, { useState } from "react";
import "./STopicsPage.css";
import CreateTopicModal from "../../../components/Supervisor/CreateTopicModal/CreateTopicModal.jsx";
import TopicViewModal from "../../../components/Supervisor/topics/TopicViewModal";
import TopicEditModal from "../../../components/Supervisor/topics/TopicEditModal";

const workTypeLabels = {
    diploma_project: "Дипломный проект",
    diploma_work: "Дипломная работа",
    course_work: "Курсовая работа",
};

const statusLabels = {
    draft: "Черновик",
    pending: "На рассмотрении",
    approved: "Утверждено",
    rejected: "Отклонено",
};

const mockTopics = [
    {
        id: "1",
        directionTitle: "Искусственный интеллект и машинное обучение",
        title: { ru: "Алгоритмы машинного обучения" },
        description: { ru: "Исследование алгоритмов для классификации" },
        workType: "diploma_project",
        participantCount: 1,
        status: "approved",
        createdAt: "2024-01-15T10:00:00Z",
        approvedAt: "2024-01-20T14:30:00Z",
    },
    {
        id: "2",
        directionTitle: "Веб-разработка и информационные системы",
        title: { ru: "Разработка веб-приложений" },
        description: { ru: "Создание современного веб-приложения с React и Node.js" },
        workType: "diploma_work",
        participantCount: 2,
        status: "draft",
        createdAt: "2024-01-10T09:00:00Z",
    },
];

export default function STopicsPage() {
    const [topics, setTopics] = useState(mockTopics);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);

    const handleCreateTopic = (topic) => {
        const newTopic = {
            id: Date.now().toString(),
            directionTitle: topic.direction,
            title: topic.title,
            description: topic.description,
            workType: topic.workType,
            participantCount: topic.studentCount || 1,
            status: "draft",
            createdAt: new Date().toISOString(),
        };
        setTopics((prev) => [newTopic, ...prev]);
    };

    const directions = Array.from(new Set(topics.map((t) => t.directionTitle).filter(Boolean)));

    const openView = (topic) => {
        setSelectedTopic(topic);
        setIsViewOpen(true);
    };

    const openEdit = (topic) => {
        setSelectedTopic(topic);
        setIsEditOpen(true);
    };

    const handleSaveEdit = (updatedTopic) => {
        setTopics((prev) =>
            prev.map((t) => (t.id === updatedTopic.id ? updatedTopic : t))
        );
        setIsEditOpen(false);
        setSelectedTopic(null);
    };

    return (
        <div className="topics-page">
            <div className="topics-header">
                <div>
                    <h1 className="topics-title">Мои темы</h1>
                    <p className="topics-subtitle">
                        Управление темами дипломных проектов и работ
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>
                    Создать тему
                </button>
            </div>

            <div className="topics-list">
                {topics.map((topic) => (
                    <div key={topic.id} className="topic-card">
                        <div className="topic-header">
                            <div>
                                <span className="badge">{topic.directionTitle}</span>
                                <span className="badge">{workTypeLabels[topic.workType]}</span>
                                <h2 className="topic-title">{topic.title?.ru}</h2>
                                <p className="topic-desc">{topic.description?.ru}</p>
                            </div>
                            <span className={`status status-${topic.status}`}>
                                {statusLabels[topic.status]}
                            </span>
                        </div>

                        <div className="topic-footer">
                            <span>
                                {" "}
                                {topic.participantCount === 1
                                    ? "Индивидуальная"
                                    : `Командная (${topic.participantCount} чел.)`}
                            </span>
                            <span>
                                Создано:{" "}
                                {new Date(topic.createdAt).toLocaleDateString("ru-RU")}
                            </span>
                        </div>

                        <div className="topic-actions">
                            <button
                                className="btn btn-outline"
                                onClick={() => openView(topic)}
                            >
                                Просмотр
                            </button>
                            {topic.status === "draft" && (
                                <>
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => openEdit(topic)}
                                    >
                                        Редактировать
                                    </button>
                                    <button className="btn btn-primary">Отправить</button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>


            <CreateTopicModal
                open={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onCreate={(payload) => {
                    handleCreateTopic(payload);
                    setIsCreateOpen(false);
                }}
                directions={directions}
            />


            <TopicViewModal
                open={isViewOpen}
                onClose={() => {
                    setIsViewOpen(false);
                    setSelectedTopic(null);
                }}
                topic={selectedTopic}
            />


            <TopicEditModal
                open={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                topic={selectedTopic}
                onSave={handleSaveEdit}
                directions={directions}
            />
        </div>
    );
}
