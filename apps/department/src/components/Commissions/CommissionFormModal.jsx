import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import "./CommissionFormModal.css";

const emptyForm = {
    name: '',
    type: 'PreDefense', // Matches backend enum string
    chairmanId: '',
    secretaryId: '',
    memberIds: [],
    preDefenseNumber: 1,
};

export default function CommissionFormModal({ isOpen, onClose, onSubmit, editingCommission, staff = [] }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState(emptyForm);
    const [memberSearch, setMemberSearch] = useState('');

    useEffect(() => {
        if (editingCommission) {
            setFormData({
                name: editingCommission.name || '',
                type: editingCommission.commissionType || 'PreDefense',
                chairmanId: editingCommission.chairmanId || '',
                secretaryId: editingCommission.secretaryId || '',
                memberIds: editingCommission.memberIds || [],
                preDefenseNumber: editingCommission.preDefenseNumber || 1,
            });
        } else {
            setFormData(emptyForm);
        }
        setMemberSearch('');
    }, [editingCommission, isOpen]);

    const filteredStaff = useMemo(() => {
        if (!memberSearch) return staff;
        const q = memberSearch.toLowerCase();
        return staff.filter(
            (s) => s.fullName.toLowerCase().includes(q) || s.positionName?.toLowerCase().includes(q)
        );
    }, [memberSearch, staff]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleMemberToggle = (userId) => {
        setFormData((prev) => {
            const exists = prev.memberIds.includes(userId);
            return {
                ...prev,
                memberIds: exists
                    ? prev.memberIds.filter((id) => id !== userId)
                    : [...prev.memberIds, userId],
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Map to backend request format using unified StaffRoleType IDs:
        // 2 = Chairman, 3 = Secretary, 4 = Member
        const members = [];
        if (formData.chairmanId) members.push({ userId: parseInt(formData.chairmanId), role: 2 });
        if (formData.secretaryId) members.push({ userId: parseInt(formData.secretaryId), role: 3 });
        formData.memberIds.forEach(id => members.push({ userId: parseInt(id), role: 4 }));

        onSubmit({
            name: formData.name,
            // 1 = PreDefense, 2 = GAK (CommissionTypes)
            commissionType: formData.type === 'PreDefense' ? 1 : 2,
            preDefenseNumber: formData.type === 'PreDefense' ? parseInt(formData.preDefenseNumber) : null,
            members: members
        });
    };

    return (
        <div className="commission-modal-backdrop" onClick={onClose}>
            <div className="commission-modal" onClick={(e) => e.stopPropagation()}>
                <h2>
                    {editingCommission
                        ? t('department.editCommission')
                        : t('department.createCommission')}
                </h2>

                <form className="commission-modal__form" onSubmit={handleSubmit}>
                    <label className="commission-modal__field">
                        {t('commission.commissions')}
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label className="commission-modal__field">
                        {t('commission.commissionList')}
                        <select name="type" value={formData.type} onChange={handleChange}>
                            <option value="PreDefense">{t('department.predefense')}</option>
                            <option value="GAK">{t('department.defenseCommission')}</option>
                        </select>
                    </label>

                    {formData.type === 'PreDefense' && (
                        <label className="commission-modal__field">
                            {t('department.predefenseNumber', 'Round Number')}
                            <select name="preDefenseNumber" value={formData.preDefenseNumber} onChange={handleChange}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                        </label>
                    )}

                    <label className="commission-modal__field">
                        {t('commission.chairman')}
                        <select name="chairmanId" value={formData.chairmanId} onChange={handleChange} required>
                            <option value="">{t('department.selectTeacher')}</option>
                            {staff.map((s) => (
                                <option key={s.userId} value={s.userId}>
                                    {s.fullName} {s.positionName ? `— ${s.positionName}` : ''}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="commission-modal__field">
                        {t('commission.secretary')}
                        <select name="secretaryId" value={formData.secretaryId} onChange={handleChange} required>
                            <option value="">{t('department.selectTeacher')}</option>
                            {staff.map((s) => (
                                <option key={s.userId} value={s.userId}>
                                    {s.fullName} {s.positionName ? `— ${s.positionName}` : ''}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="commission-modal__field">
                        <span>{t('commission.members')}</span>
                        <div className="commission-modal__members-box">
                            <input
                                type="text"
                                className="commission-modal__members-search"
                                placeholder={t('department.searchTeacher')}
                                value={memberSearch}
                                onChange={(e) => setMemberSearch(e.target.value)}
                            />
                            {filteredStaff.map((s) => (
                                <label key={s.userId} className="commission-modal__member-item">
                                    <input
                                        type="checkbox"
                                        checked={formData.memberIds.includes(s.userId)}
                                        onChange={() => handleMemberToggle(s.userId)}
                                    />
                                    <span>{s.fullName}</span>
                                    <span className="commission-modal__member-position">
                                        {s.positionName}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="commission-modal__buttons">
                        <button type="submit" className="button primary-button">
                            {t('common.save')}
                        </button>
                        <button
                            type="button"
                            className="button secondary-button"
                            onClick={onClose}
                        >
                            {t('common.cancel')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
