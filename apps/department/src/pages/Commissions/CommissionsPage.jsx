import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ConfirmModal,
    useAuth,
    useCommissions,
    useStaffByDepartment,
    useCreateCommission,
    useUpdateCommission,
    useApprovePreDefensePeriods,
    useOrgUnitSpecialities,
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
    
    const orgUnitId = user?.orgUnitId;
    const semesterId = user?.currentSemesterId;

    const [selectedSpecialityId, setSelectedSpecialityId] = useState(null);
    const { data: specialities = [] } = useOrgUnitSpecialities(orgUnitId);

    const { data: commissions = [], isLoading: isCommsLoading } = useCommissions(orgUnitId, semesterId, selectedSpecialityId);
    const { data: staff = [], isLoading: isStaffLoading } = useStaffByDepartment(orgUnitId);

    const createMutation = useCreateCommission(orgUnitId, semesterId, selectedSpecialityId);
    const updateMutation = useUpdateCommission(orgUnitId, semesterId, selectedSpecialityId);
    const approveMutation = useApprovePreDefensePeriods();

    const [approveError, setApproveError] = useState(null);
    const [approveSuccess, setApproveSuccess] = useState(false);

    const handleApprove = async () => {
        setApproveError(null);
        setApproveSuccess(false);
        try {
            await approveMutation.mutateAsync({ orgUnitId, semesterId });
            setApproveSuccess(true);
        } catch (err) {
            setApproveError(err?.response?.data?.detail || t('common.error'));
        }
    };
    
    const deleteMutation = useMutation({
        mutationFn: (id) => commissionApi.deleteCommission(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['commissions', 'department', orgUnitId, semesterId] });
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
        // Find chairman and secretary from members array
        const chairman = commission.members?.find(m => m.roleType === 2); // StaffRoleType.CommissionChairman
        const secretary = commission.members?.find(m => m.roleType === 3); // StaffRoleType.CommissionSecretary
        const members = commission.members?.filter(m => m.roleType === 4).map(m => m.userId) || [];

        setEditingCommission({
            ...commission,
            chairmanId: chairman?.userId || '',
            secretaryId: secretary?.userId || '',
            memberIds: members
        });
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingCommission) {
                // For update, we might need a separate UpdateCommissionRequest on backend
                // or just update name for now if PUT /v1/commissions/{id} only supports that
                await updateMutation.mutateAsync({ id: editingCommission.id, name: formData.name });
            } else {
                await createMutation.mutateAsync({
                    ...formData,
                    orgUnitId: orgUnitId,
                    semesterId: semesterId
                });
            }
            setIsFormOpen(false);
            setEditingCommission(null);
        } catch (error) {
            console.error("Failed to submit commission", error);
        }
    };

    // ... inside return, update card rendering:
    // {commissions.map((commission) => {
    //    const chairman = commission.members?.find(m => m.roleType === 2)?.fullName;
    //    const secretary = commission.members?.find(m => m.roleType === 3)?.fullName;
    //    const memberCount = commission.members?.filter(m => m.roleType === 4).length || 0;
    // ...


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
            {specialities.length > 0 && (
                <div className="speciality-scope-selector">
                    <label className="speciality-scope-label">{t('department.speciality', 'Специальность')}:</label>
                    <select
                        value={selectedSpecialityId || ""}
                        onChange={(e) => setSelectedSpecialityId(e.target.value ? Number(e.target.value) : null)}
                        className="speciality-scope-select"
                    >
                        <option value="">{t('department.allSpecialities', 'Общее для кафедры (По умолчанию)')}</option>
                        {specialities.map(s => (
                            <option key={s.id} value={s.id}>{s.code} - {s.title}</option>
                        ))}
                    </select>
                </div>
            )}
            <div className="page-header">
                <div>
                    <h1 className="page-title">{t('department.commissionsTitle')}</h1>
                </div>
                <div className="page-header__actions">
                    <button
                        className="button secondary-button"
                        onClick={handleApprove}
                        disabled={approveMutation.isPending || commissions.length === 0}
                    >
                        {approveMutation.isPending
                            ? t('common.loading')
                            : t('department.approvePreDefenseCommissions', 'Утвердить периоды предзащит и комиссии')}
                    </button>
                    <button className="button primary-button" onClick={handleCreate}>
                        <img src={plusIcon} alt="" className="button-icon" />
                        {t('department.createCommission')}
                    </button>
                </div>
            </div>

            {approveSuccess && (
                <div className="alert alert--success">
                    {t('department.approvePreDefenseSuccess', 'Периоды предзащит и комиссии утверждены.')}
                </div>
            )}
            {approveError && (
                <div className="alert alert--error">{approveError}</div>
            )}

            <div className="commissions-grid">
                {commissions.length === 0 && (
                    <div className="commissions-empty">
                        {t('commission.noCommissionsDay')}
                    </div>
                )}

                {commissions.map((commission) => {
                    const chairman = commission.members?.find(m => m.roleType === 2)?.fullName;
                    const secretary = commission.members?.find(m => m.roleType === 3)?.fullName;
                    const memberCount = commission.members?.filter(m => m.roleType === 4).length || 0;

                    return (
                        <div key={commission.id} className="commission-card">
                            <div className="commission-card__header">
                                <h3 className="commission-card__name">{commission.name}</h3>
                                <span
                                    className={`commission-card__type-badge commission-card__type-badge--${commission.commissionTypeId === 1 ? 'predefense' : 'defense'}`}
                                >
                                    {commission.commissionTypeId === 1
                                        ? t('department.predefense')
                                        : t('department.defenseCommission')}
                                </span>
                            </div>

                            <div className="commission-card__info">
                                <div className="commission-card__info-row">
                                    <span className="commission-card__info-label">
                                        {t('commission.chairman')}:
                                    </span>
                                    <span>{chairman || t('common.notAssigned')}</span>
                                </div>
                                <div className="commission-card__info-row">
                                    <span className="commission-card__info-label">
                                        {t('commission.secretary')}:
                                    </span>
                                    <span>{secretary || t('common.notAssigned')}</span>
                                </div>
                                <div className="commission-card__info-row">
                                    <span className="commission-card__info-label">
                                        {t('commission.members')}:
                                    </span>
                                    <span>{getMembersLabel(memberCount)}</span>
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
                    );
                })}
            </div>

            <CommissionFormModal
                isOpen={isFormOpen}
                onClose={handleFormClose}
                onSubmit={handleFormSubmit}
                editingCommission={editingCommission}
                staff={staff}
                orgUnitId={orgUnitId}
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



