import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    directionPayloadFromForm,
    getIntlLocale,
    getLocalizedValue,
    normalizeLanguage,
    useAuth,
    useCreateDirection,
    useDirectionsBySupervisor,
    useSubmitDirection,
    useUpdateDirection,
    useWorkTypes,
} from "@awm/shared";
import { Plus, BookOpen, Eye, Edit, Send, Calendar, AlertCircle } from "lucide-react";
import CreateDirectionModal from "../../components/CreateDirectionModal/CreateDirectionModal";
import DirectionViewModal from "../../components/directions/DirectionViewModal";
import DirectionEditModal from "../../components/directions/DirectionEditModal";
import "./SDirectionsPage.css";

export default function SDirectionsPage() {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const locale = getIntlLocale(i18n.language);
    const currentLanguage = normalizeLanguage(i18n.language);

    const supervisorId = user?.userId;
    const semesterId = user?.currentSemesterId;

    const { data: workTypes = [] } = useWorkTypes();
    const { data: directions = [], isLoading, error } = useDirectionsBySupervisor(supervisorId, semesterId);

    const createMutation = useCreateDirection();
    const updateMutation = useUpdateDirection();
    const submitMutation = useSubmitDirection();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedDirection, setSelectedDirection] = useState(null);

    const statusLabels = useMemo(() => ({
        draft: t('status.draft'),
        pending: t('status.underReview'),
        approved: t('status.approved'),
        rejected: t('status.rejected'),
        revision: t('status.revision'),
    }), [t]);

    const isContextReady = !!user?.orgUnitId && !!supervisorId && !!semesterId;
    const isMutating = createMutation.isPending || updateMutation.isPending || submitMutation.isPending;

    const handleCreateDirection = async (form) => {
        if (!isContextReady) return;
        const payload = directionPayloadFromForm({ 
            form, 
            user, 
            workTypeId: form.workTypeId 
        });
        await createMutation.mutateAsync(payload);
        setIsCreateModalOpen(false);
    };

    const handleSendForReview = async (id) => {
        await submitMutation.mutateAsync(id);
    };

    const handleUpdateDirection = async (updated) => {
        const workTypeId = updated.workTypeId || selectedDirection?.workTypeId;
        const payload = directionPayloadFromForm({ form: updated, user, workTypeId });
        await updateMutation.mutateAsync({ id: updated.id, payload });
        setIsEditModalOpen(false);
        setSelectedDirection(null);
    };

    const openView = (direction) => {
        setSelectedDirection(direction);
        setIsViewModalOpen(true);
    };

    const openEdit = (direction) => {
        setSelectedDirection(direction);
        setIsEditModalOpen(true);
    };

    const canEdit = (direction) => direction.status === "draft" || direction.status === "revision";
    const canSubmit = (direction) => direction.status === "draft" || direction.status === "revision";

    if (!supervisorId || !semesterId) {
        return (
            <div className="directions-page">
                <div className="empty-state-wrapper">
                    <h3>{t('common.noData')}</h3>
                    <p>{t('department.noDepartmentSelected', 'Department or Academic Year missing.')}</p>
                </div>
            </div>
        );
    }

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
                    disabled={!isContextReady || isMutating}
                >
                    <Plus size={20} strokeWidth={1.5} />
                    <span>{t('supervisor.createDirection')}</span>
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
            ) : !error && directions.length === 0 ? (
                <div className="empty-state-wrapper">
                    <div className="empty-icon-circle">
                        <BookOpen size={40} strokeWidth={1.5} />
                    </div>
                    <h3>{t('supervisor.noDirections')}</h3>
                    <p>{t('supervisor.directionsSubtitle')}</p>
                    <button
                        className="btn-empty-action"
                        onClick={() => setIsCreateModalOpen(true)}
                        disabled={!isContextReady || isMutating}
                    >
                        {t('supervisor.createFirstDirection')}
                    </button>
                </div>
            ) : !error && (
                <div className="directions-grid-layout">
                    {directions.map((direction) => (
                        <div key={direction.id} className={`custom-dir-card status-border-${direction.status}`}>
                            <div className="card-inner-content">
                                <div className="card-meta-top">
                                    <span className={`status-badge badge-${direction.status}`}>
                                        {statusLabels[direction.status] || direction.currentStateDisplayName || direction.status}
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

                                {(direction.status === "rejected" || direction.status === "revision") && direction.reviewComment && (
                                    <div className="rejection-box">
                                        <AlertCircle size={14} />
                                        <span>{direction.reviewComment}</span>
                                    </div>
                                )}
                            </div>

                            <div className="card-footer-actions">
                                <div className="left-actions">
                                    <button className="minimal-btn" onClick={() => openView(direction)} title={t('common.view')}>
                                        <Eye size={18} />
                                        <span>{t('common.details')}</span>
                                    </button>
                                    {canEdit(direction) && (
                                        <button className="minimal-btn" onClick={() => openEdit(direction)} title={t('common.edit')}>
                                            <Edit size={18} />
                                            <span>{t('common.edit')}</span>
                                        </button>
                                    )}
                                </div>

                                {canSubmit(direction) && (
                                    <button
                                        className="send-for-review-btn"
                                        onClick={() => handleSendForReview(direction.id)}
                                        disabled={submitMutation.isPending}
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
                    onCreate={handleCreateDirection}
                    workTypes={workTypes}
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
                    onSave={handleUpdateDirection}
                    workTypes={workTypes}
                />
            )}
        </div>
    );
}


