import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import "./CommissionFormModal.css";

const mockStaff = [
    { id: '1', name: 'Петров А.В.', position: 'Профессор' },
    { id: '2', name: 'Сидорова М.И.', position: 'Доцент' },
    { id: '3', name: 'Козлов В.П.', position: 'Доцент' },
    { id: '4', name: 'Морозова Е.А.', position: 'Ст. преподаватель' },
    { id: '5', name: 'Волков Д.С.', position: 'Профессор' },
    { id: '6', name: 'Лебедева Н.Н.', position: 'Доцент' },
    { id: '7', name: 'Иванова А.П.', position: 'Ассистент' },
];

const emptyForm = {
    name: '',
    type: 'predefense',
    chairman: '',
    secretary: '',
    members: [],
    date: '',
    time: '',
    room: '',
};

export default function CommissionFormModal({ isOpen, onClose, onSubmit, editingCommission }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState(emptyForm);
    const [memberSearch, setMemberSearch] = useState('');

    useEffect(() => {
        if (editingCommission) {
            setFormData({
                name: editingCommission.name || '',
                type: editingCommission.type || 'predefense',
                chairman: editingCommission.chairman || '',
                secretary: editingCommission.secretary || '',
                members: editingCommission.members || [],
                date: editingCommission.date || '',
                time: editingCommission.time || '',
                room: editingCommission.room || '',
            });
        } else {
            setFormData(emptyForm);
        }
        setMemberSearch('');
    }, [editingCommission, isOpen]);

    const filteredStaff = useMemo(() => {
        if (!memberSearch) return mockStaff;
        const q = memberSearch.toLowerCase();
        return mockStaff.filter(
            (s) => s.name.toLowerCase().includes(q) || s.position.toLowerCase().includes(q)
        );
    }, [memberSearch]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleMemberToggle = (staffName) => {
        setFormData((prev) => {
            const exists = prev.members.includes(staffName);
            return {
                ...prev,
                members: exists
                    ? prev.members.filter((m) => m !== staffName)
                    : [...prev.members, staffName],
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            date: formData.date || null,
            time: formData.time || null,
            room: formData.room || null,
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
                            <option value="predefense">{t('department.predefense')}</option>
                            <option value="defense">
                                {t('department.defenseCommission')}
                            </option>
                        </select>
                    </label>

                    <label className="commission-modal__field">
                        {t('commission.chairman')}
                        <select name="chairman" value={formData.chairman} onChange={handleChange} required>
                            <option value="">{t('department.selectTeacher')}</option>
                            {mockStaff.map((s) => (
                                <option key={s.id} value={s.name}>
                                    {s.name} — {s.position}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="commission-modal__field">
                        {t('commission.secretary')}
                        <select name="secretary" value={formData.secretary} onChange={handleChange} required>
                            <option value="">{t('department.selectTeacher')}</option>
                            {mockStaff.map((s) => (
                                <option key={s.id} value={s.name}>
                                    {s.name} — {s.position}
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
                                <label key={s.id} className="commission-modal__member-item">
                                    <input
                                        type="checkbox"
                                        checked={formData.members.includes(s.name)}
                                        onChange={() => handleMemberToggle(s.name)}
                                    />
                                    <span>{s.name}</span>
                                    <span className="commission-modal__member-position">
                                        {s.position}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="commission-modal__optional-row">
                        <label className="commission-modal__field">
                            {t('commission.date')}
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                            />
                        </label>
                        <label className="commission-modal__field">
                            {t('commission.time')}
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                            />
                        </label>
                        <label className="commission-modal__field">
                            {t('department.room')}
                            <input
                                type="text"
                                name="room"
                                value={formData.room}
                                onChange={handleChange}
                            />
                        </label>
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
