import React, { useState } from "react";
import {
    Plus,
    BookText,
    Calendar,
    Users,
    Eye,
    Edit3,
    Send,
    Info,
    Trash2
} from "lucide-react";

import CreateTopicModal from "../../../components/Supervisor/CreateTopicModal/CreateTopicModal.jsx";
import TopicViewModal from "../../../components/Supervisor/topics/TopicViewModal";
import TopicEditModal from "../../../components/Supervisor/topics/TopicEditModal";

import "./STopicsPage.css";

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

// --- MOCK DATA: Добавили поле requests ---
const mockTopics = [
    {
        id: "1",
        directionTitle: "Искусственный интеллект и машинное обучение",
        title: { ru: "Алгоритмы машинного обучения" },
        description: { ru: "Исследование алгоритмов для классификации и кластеризации данных." },
        workType: "diploma_project",
        participantCount: 3, // Увеличил лимит, чтобы можно было добавить студентов
        status: "approved",
        createdAt: "2024-01-15T10:00:00Z",
        students: [{ id: 101, fullName: "Иванов Иван Иванович" }],
        requests: [
            {
                id: "req1",
                student: { id: 202, fullName: "Смирнов Алексей" },
                createdAt: "2024-02-10T12:00:00Z"
            },
            {
                id: "req2",
                student: { id: 203, fullName: "Петрова Мария" },
                createdAt: "2024-02-11T09:30:00Z"
            }
        ]
    },
    {
        id: "2",
        directionTitle: "Веб-разработка и информационные системы",
        title: { ru: "Разработка веб-приложений" },
        description: { ru: "Создание современного веб-приложения с React и Node.js." },
        workType: "diploma_work",
        participantCount: 2,
        status: "rejected",
        createdAt: "2024-01-10T09:00:00Z",
        rejectionReason: "Необходимо более детально описать используемые технологии.",
        students: [],
        requests: []
    },
];

export default function STopicsPage() {
    const [topics, setTopics] = useState(mockTopics);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);

    /* ===== CREATE ===== */
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
            students: [],
            requests: []
        };

        setTopics(prev => [newTopic, ...prev]);
    };

    /* ===== SEND FOR REVIEW ===== */
    const handleSendForReview = (id) => {
        setTopics(prev =>
            prev.map(t =>
                t.id === id
                    ? { ...t, status: "pending" }
                    : t
            )
        );
    };

    /* ===== ЛОГИКА ОДОБРЕНИЯ ЗАЯВКИ ===== */
    const handleApproveStudent = (requestId) => {
        if (!selectedTopic) return;

        // 1. Находим заявку
        const requestToApprove = selectedTopic.requests.find(r => r.id === requestId);
        if (!requestToApprove) return;

        // 2. Создаем обновленный объект темы
        const updatedTopic = {
            ...selectedTopic,
            // Добавляем студента в список принятых
            students: [
                ...(selectedTopic.students || []),
                { id: requestToApprove.student.id, fullName: requestToApprove.student.fullName }
            ],
            // Удаляем из заявок
            requests: selectedTopic.requests.filter(r => r.id !== requestId)
        };

        // 3. Обновляем состояние selectedTopic (чтобы модалка обновилась мгновенно)
        setSelectedTopic(updatedTopic);

        // 4. Обновляем общий список тем
        setTopics(prev => prev.map(t => t.id === updatedTopic.id ? updatedTopic : t));
    };

    /* ===== ЛОГИКА ОТКЛОНЕНИЯ ЗАЯВКИ ===== */
    const handleRejectStudent = (requestId, reason) => {
        if (!selectedTopic) return;

        console.log(`Заявка ${requestId} отклонена по причине: ${reason}`);

        // 1. Создаем обновленный объект темы (просто удаляем заявку)
        // В реальном бэкенде мы бы, возможно, переносили её в список "rejectedRequests"
        const updatedTopic = {
            ...selectedTopic,
            requests: selectedTopic.requests.filter(r => r.id !== requestId)
        };

        // 2. Обновляем состояние
        setSelectedTopic(updatedTopic);
        setTopics(prev => prev.map(t => t.id === updatedTopic.id ? updatedTopic : t));
    };

    const directions = Array.from(
        new Set(topics.map(t => t.directionTitle).filter(Boolean))
    );

    const openView = (topic) => {
        setSelectedTopic(topic);
        setIsViewOpen(true);
    };

    const openEdit = (topic) => {
        setSelectedTopic(topic);
        setIsEditOpen(true);
    };

    const handleSaveEdit = (updatedTopic) => {
        setTopics(prev =>
            prev.map(t => (t.id === updatedTopic.id ? updatedTopic : t))
        );
        setIsEditOpen(false);
        setSelectedTopic(null);
    };

    return (
        <div className="topics-page">
            <div className="topics-container">
                <header className="topics-header">
                    <div className="header-text">
                        <h1>Мои темы</h1>
                        <p>Управление темами и областями дипломных проектов</p>
                    </div>
                    <button className="btn-create-new" onClick={() => setIsCreateOpen(true)}>
                        <Plus size={18} />
                        <span>Создать тему</span>
                    </button>
                </header>

                <div className="topics-grid">
                    {topics.map(topic => (
                        <div
                            key={topic.id}
                            className={`topic-card status-border-${topic.status}`}
                        >
                            <div className="topic-card-body">
                                <div className="card-top-row">
                                    <div className="card-date">
                                        <Calendar size={13} />
                                        {new Date(topic.createdAt).toLocaleDateString("ru-RU")}
                                    </div>
                                    <span className={`status-pill pill-${topic.status}`}>
                                        {statusLabels[topic.status]}
                                    </span>
                                </div>

                                <div className="card-direction-badge">
                                    {topic.directionTitle}
                                </div>

                                <h3 className="card-title">{topic.title?.ru}</h3>
                                <p className="card-description">{topic.description?.ru}</p>

                                {topic.status === "rejected" && (
                                    <div className="card-rejection-info">
                                        <Info size={14} />
                                        <span>{topic.rejectionReason}</span>
                                    </div>
                                )}

                                <div className="card-stats-row">
                                    <div className="stat-item">
                                        <Users size={14} />
                                        <span>
                                            {topic.students?.length > 0
                                                ? `Студентов: ${topic.students.length}/${topic.participantCount}`
                                                : "Нет студентов"}
                                        </span>
                                    </div>
                                    <div className="stat-item">
                                        <BookText size={14} />
                                        <span>{workTypeLabels[topic.workType]}</span>
                                    </div>
                                    {/* Индикатор новых заявок */}
                                    {topic.requests?.length > 0 && (
                                        <div className="stat-item requests-indicator">
                                            <div className="indicator-dot"></div>
                                            <span>Заявок: {topic.requests.length}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="topic-card-footer">
                                <button
                                    className="btn-details-link"
                                    onClick={() => openView(topic)}
                                >
                                    <Eye size={16} />
                                    <span>Детали</span>
                                </button>

                                {topic.status === "draft" && (
                                    <div className="draft-actions-group">
                                        <button
                                            className="btn-icon-only"
                                            onClick={() => openEdit(topic)}
                                        >
                                            <Edit3 size={16} />
                                        </button>

                                        <button
                                            className="btn-send-mini"
                                            onClick={() => handleSendForReview(topic.id)}
                                            title="Отправить на рассмотрение"
                                        >
                                            <Send size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== MODALS ===== */}
            <CreateTopicModal
                open={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onCreate={handleCreateTopic}
                directions={directions}
            />

            <TopicViewModal
                open={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                topic={selectedTopic}
                onApproveStudent={handleApproveStudent} // Передаем функцию
                onRejectStudent={handleRejectStudent}   // Передаем функцию
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