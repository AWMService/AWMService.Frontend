import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
    ConfirmModal,
    getLocalizedValue,
    normalizeLanguage,
    useAuth,
    useReconciliationSummary,
    useReconcileTopics,
    useMarkTopicsInactive,
    useSendTopicsBackForRevision,
    useCompleteReconciliation,
} from "@awm/shared";
import "./TopicCoordinationPage.css";

const STATUS_OPTIONS = [
    { value: "all", labelKey: "common.all" },
    { value: "approved", labelKey: "status.approved" },
    { value: "closed", labelKey: "status.closed" },
    { value: "reconciled", labelKey: "status.reconciled" },
    { value: "inactive", labelKey: "status.inactive" },
    { value: "needsrevision", labelKey: "status.needsRevision" },
];

const TopicCoordinationPage = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const currentLanguage = normalizeLanguage(i18n.language);
    const orgUnitId = user?.orgUnitId ?? user?.departmentId;
    const semesterId = user?.currentSemesterId ?? user?.currentAcademicYearId;

    const { data: summary, isLoading, error } = useReconciliationSummary(orgUnitId, semesterId);
    const reconcileMutation = useReconcileTopics();
    const markInactiveMutation = useMarkTopicsInactive();
    const sendBackMutation = useSendTopicsBackForRevision();
    const completeMutation = useCompleteReconciliation();

    const [selectedIds, setSelectedIds] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    // Revision modal state
    const [revisionModalOpen, setRevisionModalOpen] = useState(false);
    const [revisionComment, setRevisionComment] = useState("");
    const [revisionTargetIds, setRevisionTargetIds] = useState([]);
    const [revisionError, setRevisionError] = useState(false);

    // Finalize confirm
    const [finalizeModalOpen, setFinalizeModalOpen] = useState(false);

    // Mark inactive confirm
    const [inactiveModalOpen, setInactiveModalOpen] = useState(false);
    const [inactiveTargetIds, setInactiveTargetIds] = useState([]);

    /* ===================== DERIVED DATA ===================== */

    const topics = useMemo(() => (summary?.topics || []).map((item) => ({
        id: item.id,
        students: `${item.acceptedCount}/${item.maxParticipants}`,
        topic: getLocalizedValue(item.title, currentLanguage),
        supervisor: item.supervisorFullName || `#${item.createdBy}`,
        status: item.status,
        reviewComment: item.reviewComment,
        hasExcessApplications: item.hasExcessApplications,
        hasNoStudents: item.hasNoStudents,
        acceptedCount: item.acceptedCount,
        pendingCount: item.pendingCount,
        totalApplicationsCount: item.totalApplicationsCount,
        maxParticipants: item.maxParticipants,
    })), [summary, currentLanguage]);

    const stats = useMemo(() => ({
        total: summary?.totalTopics ?? topics.length,
        withStudents: summary?.topicsWithAcceptedStudents ?? 0,
        withoutStudents: summary?.topicsWithoutStudents ?? 0,
        excess: summary?.topicsWithExcessApplications ?? 0,
        reconciled: summary?.reconciledTopics ?? 0,
        inactive: summary?.inactiveTopics ?? 0,
        needsRevision: summary?.needsRevisionTopics ?? 0,
    }), [summary, topics]);

    const filteredTopics = useMemo(() => {
        return topics.filter((item) => {
            const matchesStatus = filterStatus === "all" || item.status === filterStatus;
            const term = searchTerm.toLowerCase();
            const matchesSearch =
                !term ||
                item.topic.toLowerCase().includes(term) ||
                item.supervisor.toLowerCase().includes(term);
            return matchesStatus && matchesSearch;
        });
    }, [topics, filterStatus, searchTerm]);

    // Only actionable topics (approved/closed) can be selected
    const isActionable = (status) => status === "approved" || status === "closed";

    /* ===================== HANDLERS ===================== */

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const actionableIds = filteredTopics
                .filter((t) => isActionable(t.status))
                .map((t) => t.id);
            setSelectedIds(actionableIds);
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleReconcile = async (ids) => {
        await reconcileMutation.mutateAsync(ids);
        setSelectedIds((prev) => prev.filter((x) => !ids.includes(x)));
    };

    const handleBulkReconcile = async () => {
        await reconcileMutation.mutateAsync(selectedIds);
        setSelectedIds([]);
    };

    const openInactiveModal = (ids) => {
        setInactiveTargetIds(ids);
        setInactiveModalOpen(true);
    };

    const confirmMarkInactive = async () => {
        await markInactiveMutation.mutateAsync(inactiveTargetIds);
        setSelectedIds((prev) => prev.filter((x) => !inactiveTargetIds.includes(x)));
        setInactiveModalOpen(false);
    };

    const openRevisionModal = (ids) => {
        setRevisionTargetIds(ids);
        setRevisionComment("");
        setRevisionError(false);
        setRevisionModalOpen(true);
    };

    const confirmSendBackForRevision = async () => {
        if (!revisionComment.trim()) {
            setRevisionError(true);
            return;
        }
        await sendBackMutation.mutateAsync({
            topicIds: revisionTargetIds,
            comment: revisionComment.trim(),
        });
        setSelectedIds((prev) => prev.filter((x) => !revisionTargetIds.includes(x)));
        setRevisionModalOpen(false);
    };

    const handleFinalize = async () => {
        await completeMutation.mutateAsync({ orgUnitId, semesterId });
        setFinalizeModalOpen(false);
    };

    /* ===================== HELPERS ===================== */

    const getStatusBadge = (status) => {
        const labelMap = {
            approved: t("status.approved"),
            closed: t("status.closed"),
            reconciled: t("status.reconciled", "Согласовано"),
            inactive: t("status.inactive", "Неактуальна"),
            needsrevision: t("status.needsRevision", "На доработке"),
            rejected: t("status.rejected"),
        };
        return (
            <span className={`tc-status-badge tc-status-badge--${status}`}>
                {labelMap[status] || status}
            </span>
        );
    };

    const actionableInFiltered = filteredTopics.filter((t) => isActionable(t.status));
    const allActionableSelected =
        actionableInFiltered.length > 0 &&
        actionableInFiltered.every((t) => selectedIds.includes(t.id));

    // Check whether finalize is possible: no topics in approved/closed/needsrevision
    const hasUnprocessed = topics.some(
        (t) => t.status === "approved" || t.status === "closed" || t.status === "needsrevision"
    );

    const isMutating =
        reconcileMutation.isPending ||
        markInactiveMutation.isPending ||
        sendBackMutation.isPending ||
        completeMutation.isPending;

    /* ===================== RENDER ===================== */

    return (
        <div className="topic-coordination-page">
            {/* Header */}
            <div className="page-header-info">
                <div>
                    <h1 className="page-title">{t("department.topicReconciliationTitle", "Согласование тем")}</h1>
                    <p className="page-subtitle">{t("department.topicReconciliationSubtitle", "Массовое согласование тем, обработка проблемных случаев, формирование финального списка")}</p>
                </div>
            </div>

            {/* Stats summary */}
            <div className="tc-stats-summary">
                <span className="tc-stat-item">
                    {stats.total} {t("department.topicsCount", "тем")}
                </span>
                <span className="tc-stat-item tc-stat-item--success">
                    {stats.withStudents} {t("department.withStudents", "со студентами")}
                </span>
                <span className="tc-stat-item tc-stat-item--warning">
                    {stats.withoutStudents} {t("department.withoutStudents", "без студентов")}
                </span>
                {stats.excess > 0 && (
                    <span className="tc-stat-item tc-stat-item--danger">
                        {stats.excess} {t("department.excessApplications", "с превышением")}
                    </span>
                )}
                <span className="tc-stat-item tc-stat-item--reconciled">
                    {stats.reconciled} {t("department.reconciledCount", "согласовано")}
                </span>
                {stats.inactive > 0 && (
                    <span className="tc-stat-item tc-stat-item--inactive">
                        {stats.inactive} {t("department.inactiveCount", "неактуальных")}
                    </span>
                )}
                {stats.needsRevision > 0 && (
                    <span className="tc-stat-item tc-stat-item--revision">
                        {stats.needsRevision} {t("department.needsRevisionCount", "на доработке")}
                    </span>
                )}
            </div>

            {/* Filters */}
            <div className="tc-filters">
                <select
                    className="tc-filter-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {t(opt.labelKey, opt.value)}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    className="tc-search-input"
                    placeholder={t("department.searchTopicOrSupervisor", "Поиск по теме или научному руководителю")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="tc-table-wrapper">
                {isLoading ? (
                    <p className="tc-no-results">{t("common.loading")}...</p>
                ) : error ? (
                    <p className="tc-no-results">{error.message}</p>
                ) : filteredTopics.length === 0 ? (
                    <p className="tc-no-results">{t("common.noResults")}</p>
                ) : (
                    <table className="tc-table">
                        <thead>
                            <tr>
                                <th className="tc-col-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={allActionableSelected}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className="tc-col-number">№</th>
                                <th>{t("department.topicColumn", "Тема")}</th>
                                <th>{t("department.supervisorColumn", "Научный руководитель")}</th>
                                <th>{t("department.studentsColumn", "Студенты")}</th>
                                <th>{t("department.applicationsColumn", "Заявки")}</th>
                                <th>{t("common.status", "Статус")}</th>
                                <th className="tc-col-actions">{t("common.actions", "Действия")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTopics.map((item, index) => (
                                <tr key={item.id} className={item.hasExcessApplications ? "tc-row--excess" : ""}>
                                    <td className="tc-col-checkbox">
                                        {isActionable(item.status) && (
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(item.id)}
                                                onChange={() => handleSelectOne(item.id)}
                                            />
                                        )}
                                    </td>
                                    <td className="tc-col-number">{index + 1}</td>
                                    <td>
                                        <div className="tc-topic-cell">
                                            <span className="tc-topic-title">{item.topic}</span>
                                            {item.reviewComment && (
                                                <span className="tc-topic-comment" title={item.reviewComment}>
                                                    💬 {item.reviewComment}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td>{item.supervisor}</td>
                                    <td className="tc-col-students">{item.students}</td>
                                    <td className="tc-col-applications">
                                        <span className={item.hasExcessApplications ? "tc-excess-badge" : ""}>
                                            {item.totalApplicationsCount}
                                        </span>
                                    </td>
                                    <td>{getStatusBadge(item.status)}</td>
                                    <td className="tc-col-actions">
                                        {isActionable(item.status) && (
                                            <div className="tc-action-group">
                                                <button
                                                    className="tc-btn tc-btn--approve"
                                                    onClick={() => handleReconcile([item.id])}
                                                    disabled={isMutating}
                                                    title={t("department.reconcile", "Согласовать")}
                                                >
                                                    ✓
                                                </button>
                                                {item.hasNoStudents && (
                                                    <button
                                                        className="tc-btn tc-btn--inactive"
                                                        onClick={() => openInactiveModal([item.id])}
                                                        disabled={isMutating}
                                                        title={t("department.markInactive", "Неактуальная")}
                                                    >
                                                        ⊘
                                                    </button>
                                                )}
                                                {item.hasExcessApplications && (
                                                    <button
                                                        className="tc-btn tc-btn--revision"
                                                        onClick={() => openRevisionModal([item.id])}
                                                        disabled={isMutating}
                                                        title={t("department.sendBackForRevision", "На доработку")}
                                                    >
                                                        ↩
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Bulk actions bar */}
            {selectedIds.length > 0 && (
                <div className="tc-bulk-bar">
                    <span className="tc-bulk-bar__label">
                        {t("department.selectedCount", { count: selectedIds.length })}
                    </span>
                    <button
                        className="tc-bulk-btn tc-bulk-btn--approve"
                        onClick={handleBulkReconcile}
                        disabled={isMutating}
                    >
                        ✓ {t("department.reconcileSelected", "Согласовать выбранные")} ({selectedIds.length})
                    </button>
                    <button
                        className="tc-bulk-btn tc-bulk-btn--inactive"
                        onClick={() => openInactiveModal(selectedIds)}
                        disabled={isMutating}
                    >
                        ⊘ {t("department.markInactiveSelected", "Неактуальные")} ({selectedIds.length})
                    </button>
                    <button
                        className="tc-bulk-btn tc-bulk-btn--revision"
                        onClick={() => openRevisionModal(selectedIds)}
                        disabled={isMutating}
                    >
                        ↩ {t("department.sendBackSelected", "На доработку")} ({selectedIds.length})
                    </button>
                </div>
            )}

            {/* Revision modal (Send back for revision) */}
            {revisionModalOpen && (
                <div className="tc-reject-modal-backdrop" onClick={() => setRevisionModalOpen(false)}>
                    <div className="tc-reject-modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="tc-reject-modal__title">
                            {t("department.revisionCommentTitle", "Комментарий для научного руководителя")}
                        </h2>
                        <p className="tc-reject-modal__subtitle">
                            {t("department.revisionCommentHint", "Укажите, что необходимо исправить или уточнить")}
                        </p>
                        <textarea
                            placeholder={t("department.enterRevisionComment", "Введите комментарий...")}
                            value={revisionComment}
                            onChange={(e) => {
                                setRevisionComment(e.target.value);
                                if (e.target.value.trim()) setRevisionError(false);
                            }}
                        />
                        {revisionError && (
                            <p className="tc-reject-modal__error">
                                {t("department.revisionCommentRequired", "Комментарий обязателен")}
                            </p>
                        )}
                        <div className="tc-reject-modal__actions">
                            <button
                                className="tc-reject-modal__btn tc-reject-modal__btn--cancel"
                                onClick={() => setRevisionModalOpen(false)}
                            >
                                {t("common.cancel", "Отмена")}
                            </button>
                            <button
                                className="tc-reject-modal__btn tc-reject-modal__btn--confirm"
                                disabled={!revisionComment.trim() || sendBackMutation.isPending}
                                onClick={confirmSendBackForRevision}
                            >
                                {t("department.confirmRevision", "Отправить на доработку")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mark Inactive confirmation */}
            <ConfirmModal
                isOpen={inactiveModalOpen}
                title={t("department.confirmMarkInactive", "Пометить как неактуальные?")}
                message={t("department.markInactiveMessage", "Выбранные темы будут помечены как неактуальные (без студентов). Это действие можно отменить до завершения согласования.")}
                onConfirm={confirmMarkInactive}
                onCancel={() => setInactiveModalOpen(false)}
                confirmText={t("common.confirm", "Подтвердить")}
                cancelText={t("common.cancel", "Отмена")}
            />

            {/* Finalize section */}
            <div className="tc-finalize-section">
                <button
                    className="tc-finalize-btn"
                    disabled={hasUnprocessed || isMutating || !orgUnitId || !semesterId}
                    onClick={() => setFinalizeModalOpen(true)}
                >
                    {t("department.finalizeReconciliation", "Завершить согласование тем")}
                </button>
                {hasUnprocessed && (
                    <p className="tc-finalize-hint">
                        {t("department.finalizeHint", "Для завершения все темы должны быть согласованы, помечены как неактуальные или отклонены")}
                    </p>
                )}
            </div>

            {/* Finalize confirmation */}
            <ConfirmModal
                isOpen={finalizeModalOpen}
                title={t("department.confirmFinalize", "Завершить согласование тем?")}
                message={t("department.finalizeWarning", "Это необратимое действие. Для всех согласованных тем будут автоматически созданы дипломные работы с закреплёнными студентами.")}
                onConfirm={handleFinalize}
                onCancel={() => setFinalizeModalOpen(false)}
                confirmText={t("department.completeReconciliation", "Завершить")}
                cancelText={t("common.cancel", "Отмена")}
            />
        </div>
    );
};

export default TopicCoordinationPage;
