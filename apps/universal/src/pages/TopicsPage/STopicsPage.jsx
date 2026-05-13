import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { getIntlLocale, getLocalizedValue, normalizeLanguage } from "@awm/shared";
import {
    Plus,
    BookText,
    Calendar,
    Users,
    Eye,
    Edit3,
    Send,
    Info
} from "lucide-react";

import CreateTopicModal from "../../components/CreateTopicModal/CreateTopicModal.jsx";
import TopicViewModal from "../../components/topics/TopicViewModal";
import TopicEditModal from "../../components/topics/TopicEditModal";

import "./STopicsPage.css";

// --- MOCK DATA: Добавили поле requests ---
const mockTopics = [
    {
        id: "1",
        directionTitle: {
            kk: "Жасанды интеллект және машиналық оқыту",
            ru: "Искусственный интеллект и машинное обучение",
            en: "Artificial Intelligence and Machine Learning",
        },
        title: {
            kk: "Машиналық оқыту алгоритмдері",
            ru: "Алгоритмы машинного обучения",
            en: "Machine Learning Algorithms",
        },
        description: {
            kk: "Деректерді жіктеу және кластерлеу үшін алгоритмдерді зерттеу.",
            ru: "Исследование алгоритмов для классификации и кластеризации данных.",
            en: "Research on algorithms for data classification and clustering.",
        },
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
        directionTitle: {
            kk: "Веб-әзірлеу және ақпараттық жүйелер",
            ru: "Веб-разработка и информационные системы",
            en: "Web Development and Information Systems",
        },
        title: {
            kk: "Веб-қосымшаларды әзірлеу",
            ru: "Разработка веб-приложений",
            en: "Web Application Development",
        },
        description: {
            kk: "React және Node.js көмегімен заманауи веб-қосымшаны құру.",
            ru: "Создание современного веб-приложения с React и Node.js.",
            en: "Creating a modern web application with React and Node.js.",
        },
        workType: "diploma_work",
        participantCount: 2,
        status: "rejected",
        createdAt: "2024-01-10T09:00:00Z",
        rejectionReason: {
            kk: "Қолданылатын технологияларды және зерттеу аясын толығырақ сипаттау қажет.",
            ru: "Необходимо более детально описать используемые технологии и область исследования.",
            en: "The technologies used and the research scope need to be described in more detail.",
        },
        students: [],
        requests: []
    },
];

export default function STopicsPage() {
    const { t, i18n } = useTranslation();
    const locale = getIntlLocale(i18n.language);
    const currentLanguage = normalizeLanguage(i18n.language);

    const workTypeLabels = {
        diploma_project: t('supervisor.diplomaProject'),
        diploma_work: t('supervisor.diplomaWork'),
        course_work: t('supervisor.courseWork'),
    };

    const statusLabels = {
        draft: t('status.draft'),
        pending: t('status.underReview'),
        approved: t('status.approved'),
        rejected: t('status.rejected'),
    };

    const [topics, setTopics] = useState(mockTopics);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);

    const getDirectionTitleObject = (directionLabel) => {
        if (!directionLabel) return null;
        if (typeof directionLabel === "object") return directionLabel;

        const matched = topics.find(
            (topic) => getLocalizedValue(topic.directionTitle, currentLanguage) === directionLabel
        );

        return matched?.directionTitle || {
            kk: directionLabel,
            ru: directionLabel,
            en: directionLabel,
        };
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString(locale);
    };

    /* ===== CREATE ===== */
    const handleCreateTopic = (topic) => {
        const newTopic = {
            id: Date.now().toString(),
            directionTitle: getDirectionTitleObject(topic.direction),
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

    const openView = (topic) => {
        setSelectedTopic(topic);
        setIsViewOpen(true);
    };

    const openEdit = (topic) => {
        setSelectedTopic(topic);
        setIsEditOpen(true);
    };

    const handleSaveEdit = (updatedTopic) => {
        const directionTitle = getDirectionTitleObject(updatedTopic.directionTitle);
        const normalizedTopic = {
            ...updatedTopic,
            directionTitle,
        };

        setTopics(prev =>
            prev.map(t => (t.id === normalizedTopic.id ? normalizedTopic : t))
        );
        setIsEditOpen(false);
        setSelectedTopic(null);
    };

    const directions = Array.from(
        new Set(
            topics
                .map((topic) => getLocalizedValue(topic.directionTitle, currentLanguage))
                .filter(Boolean)
        )
    );

    return (
        <div className="topics-page">
            <div className="topics-container">
                <header className="topics-header">
                    <div className="header-text">
                        <h1>{t('supervisor.myTopics')}</h1>
                        <p>{t('supervisor.myTopicsSubtitle')}</p>
                    </div>
                    <button className="btn-create-new" onClick={() => setIsCreateOpen(true)}>
                        <Plus size={18} />
                        <span>{t('supervisor.createTopic')}</span>
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
                                        {formatDate(topic.createdAt)}
                                    </div>
                                    <span className={`status-pill pill-${topic.status}`}>
                                        {statusLabels[topic.status]}
                                    </span>
                                </div>

                                <div className="card-direction-badge">
                                    {getLocalizedValue(topic.directionTitle, currentLanguage)}
                                </div>

                                <h3 className="card-title">{getLocalizedValue(topic.title, currentLanguage)}</h3>
                                <p className="card-description">{getLocalizedValue(topic.description, currentLanguage)}</p>

                                {topic.status === "rejected" && (
                                    <div className="card-rejection-info">
                                        <Info size={14} />
                                        <span>{getLocalizedValue(topic.rejectionReason, currentLanguage)}</span>
                                    </div>
                                )}

                                <div className="card-stats-row">
                                    <div className="stat-item">
                                        <Users size={14} />
                                        <span>
                                            {topic.students?.length > 0
                                                ? `${t('supervisor.students')}: ${topic.students.length}/${topic.participantCount}`
                                                : t('supervisor.noApprovedStudents')}
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
                                            <span>{t('supervisor.requestsUnderReview')}: {topic.requests.length}</span>
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
                                    <span>{t('common.details')}</span>
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
                                            title={t('status.underReview')}
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
