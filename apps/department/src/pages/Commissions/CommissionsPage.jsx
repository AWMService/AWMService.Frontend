import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmModal } from "@awm/shared";
import CommissionFormModal from "../../components/Commissions/CommissionFormModal.jsx";
import plusIcon from "../../assets/icons/plus-icon.svg";
import "./CommissionsPage.css";

const initialCommissions = [
    { id: '1', name: 'Комиссия предзащиты №1', type: 'predefense', chairman: 'Петров А.В.', secretary: 'Козлова Е.В.', members: ['Иванов И.И.', 'Сидорова М.И.', 'Волков Д.С.', 'Морозова Е.А.'], date: '2026-05-15', time: '10:00', room: 'Ауд. 305' },
    { id: '2', name: 'ГАК №1', type: 'defense', chairman: 'Сидорова М.И.', secretary: 'Морозова Е.А.', members: ['Петров А.В.', 'Козлов В.П.', 'Волков Д.С.'], date: '2026-06-20', time: '09:00', room: 'Ауд. 101' },
    { id: '3', name: 'Комиссия предзащиты №2', type: 'predefense', chairman: 'Козлов В.П.', secretary: 'Иванова А.П.', members: ['Морозова Е.А.', 'Лебедева Н.Н.'], date: null, time: null, room: null },
];

function CommissionsPage() {
    const { t } = useTranslation();
    const [commissions, setCommissions] = useState(initialCommissions);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCommission, setEditingCommission] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const handleCreate = () => {
        setEditingCommission(null);
        setIsFormOpen(true);
    };

    const handleEdit = (commission) => {
        setEditingCommission(commission);
        setIsFormOpen(true);
    };

    const handleFormSubmit = (formData) => {
        if (editingCommission) {
            setCommissions((prev) =>
                prev.map((c) =>
                    c.id === editingCommission.id ? { ...c, ...formData } : c
                )
            );
        } else {
            const newCommission = {
                ...formData,
                id: String(Date.now()),
            };
            setCommissions((prev) => [...prev, newCommission]);
        }
        setIsFormOpen(false);
        setEditingCommission(null);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingCommission(null);
    };

    const handleDeleteConfirm = () => {
        if (deleteTarget) {
            setCommissions((prev) => prev.filter((c) => c.id !== deleteTarget.id));
            setDeleteTarget(null);
        }
    };

    const formatDate = (date) => {
        if (!date) return null;
        const [y, m, d] = date.split("-");
        return `${d}.${m}.${y}`;
    };

    const getMembersLabel = (count) => {
        if (count === 1) return `${count} член`;
        if (count >= 2 && count <= 4) return `${count} члена`;
        return `${count} членов`;
    };

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
                                className={`commission-card__type-badge commission-card__type-badge--${commission.type}`}
                            >
                                {commission.type === 'predefense'
                                    ? t('department.predefense')
                                    : t('department.defenseCommission')}
                            </span>
                        </div>

                        <div className="commission-card__info">
                            <div className="commission-card__info-row">
                                <span className="commission-card__info-label">
                                    {t('commission.chairman')}:
                                </span>
                                <span>{commission.chairman}</span>
                            </div>
                            <div className="commission-card__info-row">
                                <span className="commission-card__info-label">
                                    {t('commission.secretary')}:
                                </span>
                                <span>{commission.secretary}</span>
                            </div>
                            <div className="commission-card__info-row">
                                <span className="commission-card__info-label">
                                    {t('commission.members')}:
                                </span>
                                <span>{getMembersLabel(commission.members.length)}</span>
                            </div>
                        </div>

                        {commission.date && (
                            <div className="commission-card__schedule">
                                <span>{formatDate(commission.date)}</span>
                                {commission.time && <span>·</span>}
                                {commission.time && <span>{commission.time}</span>}
                                {commission.room && <span>·</span>}
                                {commission.room && <span>{commission.room}</span>}
                            </div>
                        )}

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
