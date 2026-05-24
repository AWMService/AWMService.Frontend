import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    getIntlLocale,
    getLocalizedValue,
    normalizeLanguage,
    topicPayloadFromForm,
    useAcceptApplication,
    useAuth,
    useCreateTopic,
    useDirectionsBySupervisor,
    useRejectApplication,
    useSubmitTopicsForApproval,
    useTopicDetail,
    useTopicsBySupervisor,
    useUpdateTopic,
    useWorkTypes,
} from "@awm/shared";
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

export default function STopicsPage() {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const locale = getIntlLocale(i18n.language);
    const currentLanguage = normalizeLanguage(i18n.language);
    const supervisorId = user?.staffId;
    const academicYearId = user?.currentAcademicYearId;

    const { data: topics = [], isLoading, error } = useTopicsBySupervisor(supervisorId, academicYearId);
    const { data: directions = [] } = useDirectionsBySupervisor(supervisorId, academicYearId);
    const { data: workTypes = [] } = useWorkTypes();

    const createMutation = useCreateTopic();
    const updateMutation = useUpdateTopic();
    const submitMutation = useSubmitTopicsForApproval();
    const acceptMutation = useAcceptApplication();
    const rejectMutation = useRejectApplication();

    const defaultWorkTypeId = workTypes[0]?.id;

    const statusLabels = {
        draft: t('status.draft'),
        pending: t('status.underReview'),
        approved: t('status.approved'),
        rejected: t('status.rejected'),
        closed: t('student.occupied'),
    };

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const { data: selectedTopicDetail } = useTopicDetail(isViewOpen ? selectedTopic?.id : null);

    const directionOptions = useMemo(() => directions
        .filter((direction) => direction.status === "approved")
        .map((direction) => ({
            id: direction.id,
            label: getLocalizedValue(direction.title, currentLanguage),
        })), [directions, currentLanguage]);

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString(locale);
    };

    const handleCreateTopic = async (topic) => {
        const payload = topicPayloadFromForm({ form: topic, user, workTypeId: defaultWorkTypeId });
        await createMutation.mutateAsync(payload);
    };

    const handleSendForReview = async (id) => {
        await submitMutation.mutateAsync([id]);
    };

    const handleApproveStudent = async (requestId) => {
        await acceptMutation.mutateAsync(requestId);
    };

    const handleRejectStudent = async (requestId, reason) => {
        await rejectMutation.mutateAsync({ id: requestId, rejectReason: reason });
    };

    const openView = (topic) => {
        setSelectedTopic(topic);
        setIsViewOpen(true);
    };

    const openEdit = (topic) => {
        setSelectedTopic(topic);
        setIsEditOpen(true);
    };

    const handleSaveEdit = async (updatedTopic) => {
        const payload = topicPayloadFromForm({ form: updatedTopic, user, workTypeId: updatedTopic.workTypeId || defaultWorkTypeId });
        await updateMutation.mutateAsync({ id: updatedTopic.id, payload });
        setIsEditOpen(false);
        setSelectedTopic(null);
    };

    const topicForModal = selectedTopicDetail || selectedTopic;
    const isMutating = createMutation.isPending || updateMutation.isPending || submitMutation.isPending ||
        acceptMutation.isPending || rejectMutation.isPending;

    return (
        <div className="topics-page">
            <div className="topics-container">
                <header className="topics-header">
                    <div className="header-text">
                        <h1>{t('supervisor.myTopics')}</h1>
                        <p>{t('supervisor.myTopicsSubtitle')}</p>
                    </div>
                    <button
                        className="btn-create-new"
                        onClick={() => setIsCreateOpen(true)}
                        disabled={!user?.departmentId || !supervisorId || !academicYearId || !defaultWorkTypeId || isMutating}
                    >
                        <Plus size={18} />
                        <span>{t('supervisor.createTopic')}</span>
                    </button>
                </header>

                {error && (
                    <div className="empty-state-wrapper">
                        <h3>{t('common.error')}</h3>
                        <p>{error.message}</p>
                    </div>
                )}

                {isLoading ? (
                    <div className="empty-state-wrapper">
                        <p>{t('common.loading')}...</p>
                    </div>
                ) : !error && topics.length === 0 ? (
                    <div className="empty-state-wrapper">
                        <h3>{t('supervisor.noTopics', t('common.noData'))}</h3>
                    </div>
                ) : !error && (
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
                                        <span>{getLocalizedValue(topic.reviewComment, currentLanguage)}</span>
                                    </div>
                                )}

                                <div className="card-stats-row">
                                    <div className="stat-item">
                                        <Users size={14} />
                                        <span>
                                            {topic.acceptedApplicationsCount > 0
                                                ? `${t('supervisor.students')}: ${topic.acceptedApplicationsCount}/${topic.participantCount}`
                                                : t('supervisor.noApprovedStudents')}
                                        </span>
                                    </div>
                                    <div className="stat-item">
                                        <BookText size={14} />
                                        <span>{topic.workTypeName || topic.workTypeId}</span>
                                    </div>
                                    {/* Индикатор новых заявок */}
                                    {topic.pendingApplicationsCount > 0 && (
                                        <div className="stat-item requests-indicator">
                                            <div className="indicator-dot"></div>
                                            <span>{t('supervisor.requestsUnderReview')}: {topic.pendingApplicationsCount}</span>
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
                                            disabled={submitMutation.isPending}
                                        >
                                            <Send size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    </div>
                )}
            </div>

            {/* ===== MODALS ===== */}
            <CreateTopicModal
                open={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onCreate={handleCreateTopic}
                directions={directionOptions}
                workTypes={workTypes}
            />

            <TopicViewModal
                open={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                topic={topicForModal}
                onApproveStudent={handleApproveStudent}
                onRejectStudent={handleRejectStudent}
            />

            <TopicEditModal
                open={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                topic={selectedTopic}
                onSave={handleSaveEdit}
                directions={directionOptions}
                workTypes={workTypes}
            />
        </div>
    );
}
