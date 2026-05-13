import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmModal } from "@awm/shared";
import "./TopicCoordinationPage.css";

const mockTopics = [
    { id: "1", student: "Сергеев Н.С.", topic: "Разработка веб-приложения для управления проектами", supervisor: "Петров А.В.", status: "pending" },
    { id: "2", student: "Иванова А.П.", topic: "Анализ данных с использованием ML", supervisor: "Сидорова М.И.", status: "approved" },
    { id: "3", student: "Козлова Е.В.", topic: "Мобильное приложение для расписания", supervisor: "Козлов В.П.", status: "rejected", rejectionReason: "Тема дублирует существующую" },
    { id: "4", student: "Ахметов Д.Р.", topic: "Система автоматизации документооборота", supervisor: "Волков Д.С.", status: "pending" },
    { id: "5", student: "Нурланова А.К.", topic: "Разработка чат-бота на основе NLP", supervisor: "Петров А.В.", status: "approved" },
    { id: "6", student: "Тулеуов Б.М.", topic: "Платформа для онлайн-обучения", supervisor: "Сидорова М.И.", status: "approved" },
    { id: "7", student: "Жумабаев К.Е.", topic: "Интеграция IoT-устройств в систему умного дома", supervisor: "Козлов В.П.", status: "pending" },
    { id: "8", student: "Серикова А.Н.", topic: "Визуализация данных в реальном времени", supervisor: "Волков Д.С.", status: "approved" },
    { id: "9", student: "Омаров Т.А.", topic: "Разработка системы рекомендаций", supervisor: "Петров А.В.", status: "rejected", rejectionReason: "Недостаточная научная новизна" },
    { id: "10", student: "Касымова Л.Д.", topic: "Блокчейн-система для верификации документов", supervisor: "Сидорова М.И.", status: "approved" },
];

const STATUS_OPTIONS = [
    { value: "all", labelKey: "common.all" },
    { value: "pending", labelKey: "status.pending" },
    { value: "approved", labelKey: "status.approved" },
    { value: "rejected", labelKey: "status.rejected" },
];

const TopicCoordinationPage = () => {
    const { t } = useTranslation();

    const [topics, setTopics] = useState(mockTopics);
    const [selectedIds, setSelectedIds] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    // Reject modal state
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [rejectTargetIds, setRejectTargetIds] = useState([]);
    const [rejectError, setRejectError] = useState(false);

    // Finalize confirm
    const [finalizeModalOpen, setFinalizeModalOpen] = useState(false);

    /* ===================== DERIVED DATA ===================== */

    const stats = useMemo(() => {
        const total = topics.length;
        const approved = topics.filter((t) => t.status === "approved").length;
        const rejected = topics.filter((t) => t.status === "rejected").length;
        const pending = topics.filter((t) => t.status === "pending").length;
        return { total, approved, rejected, pending };
    }, [topics]);

    const filteredTopics = useMemo(() => {
        return topics.filter((item) => {
            const matchesStatus = filterStatus === "all" || item.status === filterStatus;
            const term = searchTerm.toLowerCase();
            const matchesSearch =
                !term ||
                item.student.toLowerCase().includes(term) ||
                item.topic.toLowerCase().includes(term);
            return matchesStatus && matchesSearch;
        });
    }, [topics, filterStatus, searchTerm]);

    /* ===================== HANDLERS ===================== */

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const pendingIds = filteredTopics
                .filter((t) => t.status === "pending")
                .map((t) => t.id);
            setSelectedIds(pendingIds);
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleApprove = (id) => {
        setTopics((prev) =>
            prev.map((t) => (t.id === id ? { ...t, status: "approved" } : t))
        );
        setSelectedIds((prev) => prev.filter((x) => x !== id));
    };

    const handleBulkApprove = () => {
        setTopics((prev) =>
            prev.map((t) =>
                selectedIds.includes(t.id) ? { ...t, status: "approved" } : t
            )
        );
        setSelectedIds([]);
    };

    const openRejectModal = (ids) => {
        setRejectTargetIds(ids);
        setRejectReason("");
        setRejectError(false);
        setRejectModalOpen(true);
    };

    const confirmReject = () => {
        if (!rejectReason.trim()) {
            setRejectError(true);
            return;
        }
        setTopics((prev) =>
            prev.map((t) =>
                rejectTargetIds.includes(t.id)
                    ? { ...t, status: "rejected", rejectionReason: rejectReason.trim() }
                    : t
            )
        );
        setSelectedIds((prev) => prev.filter((x) => !rejectTargetIds.includes(x)));
        setRejectModalOpen(false);
    };

    const handleFinalize = () => {
        setFinalizeModalOpen(false);
        // In a real app, this would call an API to finalize the stage
    };

    /* ===================== HELPERS ===================== */

    const getStatusBadge = (status) => {
        const labelMap = {
            pending: t("status.pending"),
            approved: t("status.approved"),
            rejected: t("status.rejected"),
        };
        return (
            <span className={`tc-status-badge tc-status-badge--${status}`}>
                {labelMap[status]}
            </span>
        );
    };

    const pendingInFiltered = filteredTopics.filter((t) => t.status === "pending");
    const allPendingSelected =
        pendingInFiltered.length > 0 &&
        pendingInFiltered.every((t) => selectedIds.includes(t.id));

    /* ===================== RENDER ===================== */

    return (
        <div className="topic-coordination-page">
            {/* Header */}
            <div className="page-header-info">
                <div>
                    <h1 className="page-title">{t("department.topicCoordinationTitle")}</h1>
                    <p className="page-subtitle">{t("department.topicCoordinationSubtitle")}</p>
                </div>
            </div>

            {/* Stats summary */}
            <div className="tc-stats-summary">
                <span className="tc-stat-item">
                    {stats.total} {t("department.topicsCount")}
                </span>
                <span className="tc-stat-item">
                    {stats.approved} {t("department.approvedCount")}
                </span>
                <span className="tc-stat-item">
                    {stats.rejected} {t("department.rejectedCount")}
                </span>
                <span className="tc-stat-item">
                    {stats.pending} {t("department.pendingCount")}
                </span>
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
                            {t(opt.labelKey)}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    className="tc-search-input"
                    placeholder={t("department.searchTopicOrStudent")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="tc-table-wrapper">
                {filteredTopics.length === 0 ? (
                    <p className="tc-no-results">{t("common.noResults")}</p>
                ) : (
                    <table className="tc-table">
                        <thead>
                            <tr>
                                <th className="tc-col-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={allPendingSelected}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className="tc-col-number">№</th>
                                <th>{t("department.studentColumn")}</th>
                                <th>{t("department.topicColumn")}</th>
                                <th>{t("department.supervisorColumn")}</th>
                                <th>{t("common.status")}</th>
                                <th className="tc-col-actions">{t("common.actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTopics.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="tc-col-checkbox">
                                        {item.status === "pending" && (
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(item.id)}
                                                onChange={() => handleSelectOne(item.id)}
                                            />
                                        )}
                                    </td>
                                    <td className="tc-col-number">{index + 1}</td>
                                    <td>{item.student}</td>
                                    <td>{item.topic}</td>
                                    <td>{item.supervisor}</td>
                                    <td>{getStatusBadge(item.status)}</td>
                                    <td className="tc-col-actions">
                                        {item.status === "pending" && (
                                            <>
                                                <button
                                                    className="tc-btn tc-btn--approve"
                                                    onClick={() => handleApprove(item.id)}
                                                >
                                                    {t("department.approve")}
                                                </button>
                                                <button
                                                    className="tc-btn tc-btn--reject"
                                                    onClick={() => openRejectModal([item.id])}
                                                >
                                                    {t("department.reject")}
                                                </button>
                                            </>
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
                        onClick={handleBulkApprove}
                    >
                        {t("department.approveSelected", { count: selectedIds.length })}
                    </button>
                    <button
                        className="tc-bulk-btn tc-bulk-btn--reject"
                        onClick={() => openRejectModal(selectedIds)}
                    >
                        {t("department.rejectSelected", { count: selectedIds.length })}
                    </button>
                </div>
            )}

            {/* Reject modal */}
            {rejectModalOpen && (
                <div className="tc-reject-modal-backdrop" onClick={() => setRejectModalOpen(false)}>
                    <div className="tc-reject-modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="tc-reject-modal__title">
                            {t("department.rejectionReasonTitle")}
                        </h2>
                        <textarea
                            placeholder={t("department.enterRejectionReason")}
                            value={rejectReason}
                            onChange={(e) => {
                                setRejectReason(e.target.value);
                                if (e.target.value.trim()) setRejectError(false);
                            }}
                        />
                        {rejectError && (
                            <p className="tc-reject-modal__error">
                                {t("department.rejectionReasonRequired")}
                            </p>
                        )}
                        <div className="tc-reject-modal__actions">
                            <button
                                className="tc-reject-modal__btn tc-reject-modal__btn--cancel"
                                onClick={() => setRejectModalOpen(false)}
                            >
                                {t("common.cancel")}
                            </button>
                            <button
                                className="tc-reject-modal__btn tc-reject-modal__btn--confirm"
                                disabled={!rejectReason.trim()}
                                onClick={confirmReject}
                            >
                                {t("department.confirmRejection")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Finalize section */}
            <div className="tc-finalize-section">
                <button
                    className="tc-finalize-btn"
                    disabled={stats.pending > 0}
                    onClick={() => setFinalizeModalOpen(true)}
                >
                    {t("department.finalizeCoordination")}
                </button>
            </div>

            {/* Finalize confirmation */}
            <ConfirmModal
                isOpen={finalizeModalOpen}
                title={t("department.confirmFinalize")}
                message={t("department.allTopicsProcessed")}
                onConfirm={handleFinalize}
                onCancel={() => setFinalizeModalOpen(false)}
                confirmText={t("common.confirm")}
                cancelText={t("common.cancel")}
            />
        </div>
    );
};

export default TopicCoordinationPage;
