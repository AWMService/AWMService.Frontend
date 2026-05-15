import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
    ConfirmModal, 
    useAuth, 
    useCommissions, 
    useStaffByDepartment, 
    useCreateCommission, 
    useUpdateCommission,
    commissionApi
} from "@awm/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CommissionFormModal from "../../components/Commissions/CommissionFormModal.jsx";
import plusIcon from "../../assets/icons/plus-icon.svg";
import "./CommissionsPage.css";

// Temporary delete mutation until we add it to commissionQueries.js

// We need to add deleteCommission to apiClient or commissionApi if not there.
// I'll update commissionQueries.js to include it.

function CommissionsPage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    
    const departmentId = user?.departmentId;
    const academicYearId = user?.currentAcademicYearId;

    const { data: commissions = [], isLoading: isCommsLoading } = useCommissions(departmentId, academicYearId);
    const { data: staff = [], isLoading: isStaffLoading } = useStaffByDepartment(departmentId);

    const createMutation = useCreateCommission(departmentId, academicYearId);
    const updateMutation = useUpdateCommission(departmentId, academicYearId);
    
    const deleteMutation = useMutation({
        mutationFn: (id) => commissionApi.deleteCommission(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['commissions', 'department', departmentId, academicYearId] });
        }
    });

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCommission, setEditingCommission] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const handleCreate = () => {
        setEditingCommission(null);
        setIsFormOpen(true);
    };

    const handleEdit = (commission) => {
        // Prepare data for modal
        setEditingCommission({
            ...commission,
            // We don't have IDs for members in the list view yet, so edit might be limited to name
        });
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingCommission) {
                await updateMutation.mutateAsync({ id: editingCommission.id, name: formData.name });
            } else {
                await createMutation.mutateAsync({
                    ...formData,
                    departmentId: departmentId,
                    academicYearId: academicYearId
                });
            }
            setIsFormOpen(false);
            setEditingCommission(null);
        } catch (error) {
            console.error("Failed to submit commission", error);
        }
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingCommission(null);
    };

    const handleDeleteConfirm = async () => {
        if (deleteTarget) {
            try {
                await deleteMutation.mutateAsync(deleteTarget.id);
                setDeleteTarget(null);
            } catch (error) {
                console.error("Failed to delete commission", error);
            }
        }
    };

    const getMembersLabel = (count) => {
        if (count === 1) return `${count} член`;
        if (count >= 2 && count <= 4) return `${count} члена`;
        return `${count} членов`;
    };

    if (isCommsLoading || isStaffLoading) {
        return <div className="commissions-page"><p>{t('common.loading')}</p></div>;
    }

    return (
        <div className="commissions-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">{t('department.commissionsTitle')}</h1>
                </div>
                <button className="button primary-button" onClick={handleCreate}>
                    <img src={plusIcon} alt="" className="button-icon" />
                    {t('department.createCommission')}
                </button>
            </div>

            <div className="commissions-grid">
                {commissions.length === 0 && (
                    <div className="commissions-empty">
                        {t('commission.noCommissionsDay')}
                    </div>
                )}

                {commissions.map((commission) => (
                    <div key={commission.id} className="commission-card">
                        <div className="commission-card__header">
                            <h3 className="commission-card__name">{commission.name}</h3>
                            <span
                                className={`commission-card__type-badge commission-card__type-badge--${commission.commissionType.toLowerCase()}`}
                            >
                                {commission.commissionType === 'PreDefense'
                                    ? t('department.predefense')
                                    : t('department.defenseCommission')}
                            </span>
                        </div>

                        <div className="commission-card__info">
                            <div className="commission-card__info-row">
                                <span className="commission-card__info-label">
                                    {t('commission.chairman')}:
                                </span>
                                <span>{commission.chairmanName || t('common.notAssigned', 'Not assigned')}</span>
                            </div>
                            <div className="commission-card__info-row">
                                <span className="commission-card__info-label">
                                    {t('commission.secretary')}:
                                </span>
                                <span>{commission.secretaryName || t('common.notAssigned', 'Not assigned')}</span>
                            </div>
                            <div className="commission-card__info-row">
                                <span className="commission-card__info-label">
                                    {t('commission.members')}:
                                </span>
                                <span>{getMembersLabel(commission.memberCount)}</span>
                            </div>
                        </div>

                        <div className="commission-card__actions">
                            <button
                                className="commission-card__action-btn"
                                onClick={() => handleEdit(commission)}
                            >
                                {t('department.editCommission')}
                            </button>
                            <button
                                className="commission-card__action-btn commission-card__action-btn--danger"
                                onClick={() => setDeleteTarget(commission)}
                            >
                                {t('department.deleteCommission')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <CommissionFormModal
                isOpen={isFormOpen}
                onClose={handleFormClose}
                onSubmit={handleFormSubmit}
                editingCommission={editingCommission}
                staff={staff}
            />

            <ConfirmModal
                isOpen={!!deleteTarget}
                title={t('department.deleteCommission')}
                message={deleteTarget?.name}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteTarget(null)}
                variant="danger"
            />
        </div>
    );
}

export default CommissionsPage;
