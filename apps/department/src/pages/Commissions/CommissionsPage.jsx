import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
    ConfirmModal,
    useAuth,
    useCommissions,
    useOrgUnitEmployees,
    useCreateCommission,
    useUpdateCommission,
    useOrgUnitSpecialities,
    commissionApi
} from "@awm/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CommissionFormModal from "../../components/Commissions/CommissionFormModal.jsx";
import plusIcon from "../../assets/icons/plus-icon.svg";
import "./CommissionsPage.css";

function CommissionsPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    
    const orgUnitId = user?.orgUnitId;
    const semesterId = user?.currentSemesterId;

    const [selectedSpecialityId, setSelectedSpecialityId] = useState(null);
    const { data: specialities = [] } = useOrgUnitSpecialities(orgUnitId);

    const { data: commissions = [], isLoading: isCommsLoading } = useCommissions(orgUnitId, semesterId, selectedSpecialityId);
    const { data: staff = [], isLoading: isStaffLoading } = useOrgUnitEmployees(orgUnitId);

    const createMutation = useCreateCommission(orgUnitId, semesterId, selectedSpecialityId);
    const updateMutation = useUpdateCommission(orgUnitId, semesterId, selectedSpecialityId);
    
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
        
        const chairman = commission.members?.find(m => m.roleType === 2); 
        const secretary = commission.members?.find(m => m.roleType === 3); 
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
                await updateMutation.mutateAsync({
                    id: editingCommission.id,
                    name: formData.name,
                    commissionTypeId: formData.commissionTypeId,
                    preDefenseNumber: formData.preDefenseNumber,
                    specialityId: formData.specialityId,
                    chairmanUserId: formData.chairmanUserId,
                    secretaryUserId: formData.secretaryUserId,
                    memberUserIds: formData.memberUserIds
                });
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
                <div className="page-header__actions">
                    <button className="button primary-button" onClick={handleCreate}>
                        <img src={plusIcon} alt="" className="button-icon" />
                        {t('department.createCommission')}
                    </button>
                </div>
            </div>

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
                                    className="commission-card__action-btn"
                                    onClick={() => navigate('/defenses?tab=distribution')}
                                    style={{ border: '1px solid #4f46e5', color: '#4f46e5' }}
                                >
                                    {t('commission.schedule', 'Расписание')}
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
