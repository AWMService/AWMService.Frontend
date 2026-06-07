import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Shield, Users, Trash2, Check, ChevronDown, Award } from "lucide-react";

export default function CommissionSetupStep({
    commissions,
    addCommission,
    updateCommission,
    removeCommission,
    onNext,
    teachersList = [],
    specialities = []
}) {
    const { t } = useTranslation();

    // Local state to track open dropdowns for member multi-select on each card
    const [openMembersCardId, setOpenMembersCardId] = useState(null);

    const handleSpecialityChange = (comm, specIdStr) => {
        const specId = specIdStr ? Number(specIdStr) : null;
        const spec = specialities.find(s => s.id === specId);
        const specName = spec ? spec.code : "Общая";
        const preDefenseNum = comm.preDefenseNumber || 1;
        updateCommission({
            ...comm,
            specialityId: specId,
            name: `Комиссия предзащиты №${preDefenseNum} — ${specName}`
        });
    };

    const handlePreDefenseChange = (comm, preDefenseNumStr) => {
        const num = Number(preDefenseNumStr);
        const spec = specialities.find(s => s.id === comm.specialityId);
        const specName = spec ? spec.code : "Общая";
        updateCommission({
            ...comm,
            preDefenseNumber: num,
            name: `Комиссия предзащиты №${num} — ${specName}`
        });
    };

    const toggleMemberSelection = (comm, teacherId) => {
        const currentMembers = comm.members || [];
        let nextMembers;
        if (currentMembers.includes(teacherId)) {
            nextMembers = currentMembers.filter(id => id !== teacherId);
        } else {
            nextMembers = [...currentMembers, teacherId];
        }
        updateCommission({ ...comm, members: nextMembers });
    };

    return (
        <div className="commission-setup-step">
            <div className="step-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#111827' }}>
                        {t('department.createCommissions', 'Создание комиссий')}
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#6b7280' }}>
                        {t('department.createCommissionsDesc', 'Настройте составы комиссий для различных этапов предзащит и специальностей')}
                    </p>
                </div>
                <button
                    className="button primary-button ripple-effect"
                    onClick={addCommission}
                    style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)' }}
                >
                    <PlusIcon /> {t('department.addCommission', '+ Создать комиссию')}
                </button>
            </div>

            <div className="commissions-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                {commissions.map(c => {
                    const availableMembers = teachersList.filter(t => t.id !== c.chairman && t.id !== c.secretary);
                    const isMembersDropdownOpen = openMembersCardId === c.id;

                    return (
                        <div key={c.id} className="premium-commission-card" style={{
                            position: 'relative',
                            background: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        }}>
                            <div className="card-top-glow" style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'radial-gradient(circle at 100% 0%, #4f46e508, transparent 70%)', pointerEvents: 'none' }} />
                            
                            {/* Card Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <input
                                    className="commission-name-input"
                                    value={c.name}
                                    onChange={(e) => updateCommission({ ...c, name: e.target.value })}
                                    style={{
                                        fontSize: '1rem',
                                        fontWeight: '750',
                                        color: '#111827',
                                        border: 'none',
                                        borderBottom: '1.5px dashed #d1d5db',
                                        padding: '4px 0',
                                        outline: 'none',
                                        width: '80%',
                                        background: 'transparent'
                                    }}
                                />
                                <button
                                    className="stage-delete-btn"
                                    onClick={() => removeCommission(c.id)}
                                    title={t('department.deleteCommission')}
                                    style={{ padding: '6px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Specialty Binding */}
                            <div className="form-group-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <label style={{ fontSize: '0.725rem', fontWeight: '700', color: '#4b5563', textTransform: 'uppercase' }}>
                                        {t('student.specialty', 'Специальность')}
                                    </label>
                                    <select
                                        value={c.specialityId || ""}
                                        onChange={(e) => handleSpecialityChange(c, e.target.value)}
                                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '0.825rem', fontWeight: '500', color: '#374151', outline: 'none' }}
                                    >
                                        <option value="">{t('department.allSpecialities', 'Общая (По умолчанию)')}</option>
                                        {specialities.map(s => (
                                            <option key={s.id} value={s.id}>{s.code}</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <label style={{ fontSize: '0.725rem', fontWeight: '700', color: '#4b5563', textTransform: 'uppercase' }}>
                                        {t('preDefense', 'Предзащита')}
                                    </label>
                                    <select
                                        value={c.preDefenseNumber || 1}
                                        onChange={(e) => handlePreDefenseChange(c, e.target.value)}
                                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '0.825rem', fontWeight: '500', color: '#374151', outline: 'none' }}
                                    >
                                        <option value="1">№1</option>
                                        <option value="2">№2</option>
                                        <option value="3">№3</option>
                                    </select>
                                </div>
                            </div>

                            {/* Chairman Selection */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.725rem', fontWeight: '700', color: '#4b5563', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Award size={14} style={{ color: '#4f46e5' }} /> {t('commission.chairman', 'Председатель')}
                                </label>
                                <select
                                    value={c.chairman || ""}
                                    onChange={(e) => updateCommission({ ...c, chairman: e.target.value })}
                                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '0.85rem', fontWeight: '500', color: '#374151', outline: 'none' }}
                                >
                                    <option value="">{t('department.selectTeacher', 'Выберите преподавателя...')}</option>
                                    {teachersList.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Secretary Selection */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.725rem', fontWeight: '700', color: '#4b5563', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Shield size={14} style={{ color: '#0f766e' }} /> {t('department.technicalSecretary', 'Технический секретарь')}
                                </label>
                                <select
                                    value={c.secretary || ""}
                                    onChange={(e) => updateCommission({ ...c, secretary: e.target.value })}
                                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '0.85rem', fontWeight: '500', color: '#374151', outline: 'none' }}
                                >
                                    <option value="">{t('department.selectTeacher', 'Выберите преподавателя...')}</option>
                                    {teachersList.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Multi-Select Members Collapsible Dropdown */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', position: 'relative' }}>
                                <label style={{ fontSize: '0.725rem', fontWeight: '700', color: '#4b5563', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Users size={14} style={{ color: '#10b981' }} /> {t('commission.members', 'Члены комиссии')}
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setOpenMembersCardId(isMembersDropdownOpen ? null : c.id)}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #e5e7eb',
                                        background: '#ffffff',
                                        fontSize: '0.85rem',
                                        fontWeight: '500',
                                        color: '#374151',
                                        cursor: 'pointer',
                                        textAlign: 'left'
                                    }}
                                >
                                    <span>
                                        {c.members && c.members.length > 0
                                            ? t('department.selectedCount', { count: c.members.length })
                                            : t('common.select', 'Выбрать...')
                                        }
                                    </span>
                                    <ChevronDown size={16} style={{ transition: 'transform 0.2s', transform: isMembersDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                                </button>

                                {isMembersDropdownOpen && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        background: '#ffffff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                                        padding: '8px',
                                        zIndex: 10,
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                        marginTop: '4px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '2px'
                                    }}>
                                        {availableMembers.map(t => {
                                            const isSelected = c.members?.includes(t.id);
                                            return (
                                                <div
                                                    key={t.id}
                                                    onClick={() => toggleMemberSelection(c, t.id)}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        padding: '8px 12px',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        background: isSelected ? '#eff6ff' : 'transparent',
                                                        transition: 'background 0.15s'
                                                    }}
                                                >
                                                    <span style={{ fontSize: '0.825rem', fontWeight: isSelected ? '600' : '500', color: isSelected ? '#1d4ed8' : '#374151' }}>
                                                        {t.name}
                                                    </span>
                                                    {isSelected && <Check size={14} style={{ color: '#1d4ed8' }} />}
                                                </div>
                                            );
                                        })}
                                        {availableMembers.length === 0 && (
                                            <div style={{ padding: '8px', fontSize: '0.8rem', color: '#9ca3af', textAlign: 'center' }}>
                                                {t('department.teachersNotFound', 'Преподаватели не найдены')}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Render Members Chips directly on card */}
                            {c.members && c.members.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                                    {c.members.map(memberId => {
                                        const tInfo = teachersList.find(x => x.id === memberId);
                                        return (
                                            <span key={memberId} style={{
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                color: '#4b5563',
                                                background: '#f3f4f6',
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                border: '1px solid #e5e7eb'
                                            }}>
                                                {tInfo?.name || memberId}
                                            </span>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {commissions.length === 0 && (
                <div className="empty-state" style={{
                    background: '#fafafa',
                    border: '2px dashed #e5e7eb',
                    borderRadius: '16px',
                    padding: '48px',
                    textAlign: 'center',
                    color: '#6b7280',
                    fontWeight: '500',
                    marginBottom: '32px'
                }}>
                    {t('department.preDefenseCommissionsNotFound', 'Комиссии не добавлены. Создайте первую комиссию, нажав кнопку «Создать комиссию» выше.')}
                </div>
            )}

            <div className="setup-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                {commissions.length > 0 && (
                    <button
                        className="button primary-button ripple-effect"
                        onClick={onNext}
                        style={{ padding: '10px 24px', fontSize: '0.9rem' }}
                    >
                        {t('department.nextStage')}
                    </button>
                )}
            </div>
        </div>
    );
}

// Inline simple icons
function PlusIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    );
}
