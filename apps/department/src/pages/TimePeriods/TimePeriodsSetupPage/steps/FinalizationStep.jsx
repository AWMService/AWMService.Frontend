import React from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Users, Award, Shield, Calendar, MapPin } from "lucide-react";
import "./FinalizationStep.css";

export default function FinalizationStep({ commissions, onFinish }) {
    const { t } = useTranslation();

    return (
        <div className="final-step-container">
            <div className="final-glow-sphere"></div>
            
            <div className="final-card">
                <div className="final-icon-wrapper">
                    <CheckCircle2 size={48} className="final-icon-checkmark" />
                </div>

                <h2 className="final-title">{t('department.finalization', 'Настройка успешно завершена!')}</h2>
                <p className="final-description">
                    {t('department.finalizationDesc', 'Все параметры предзащит и комиссий настроены. Составы зарегистрированы в базе данных, а студенты успешно распределены.')}
                </p>

                {}
                <div className="final-stats-summary" style={{ display: 'flex', justifyContent: 'center', gap: '24px', margin: '24px 0' }}>
                    <div className="summary-stat-box" style={{ background: '#f8fafc', padding: '16px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <span style={{ display: 'block', fontSize: '1.75rem', fontWeight: '850', color: '#4f46e5' }}>{commissions.length}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {t('department.commissions', 'Комиссии')}
                        </span>
                    </div>
                </div>

                {}
                <div className="commissions-summary-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '24px 0', maxHeight: '240px', overflowY: 'auto', textAlign: 'left', padding: '4px' }}>
                    {commissions.map(c => (
                        <div key={c.id} className="summary-comm-item" style={{
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            padding: '16px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <h4 style={{ margin: 0, fontSize: '0.925rem', fontWeight: '700', color: '#0f172a' }}>{c.name}</h4>
                                <span style={{
                                    fontSize: '0.7rem',
                                    fontWeight: '700',
                                    color: c.specialityId ? '#0f766e' : '#4f46e5',
                                    background: c.specialityId ? '#ccfbf1' : '#e0e7ff',
                                    padding: '2px 8px',
                                    borderRadius: '6px'
                                }}>
                                    {c.specialityId ? t('student.specialty', 'Спец.') : t('department.allSpecialities', 'Общая')}
                                </span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem', color: '#4b5563' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Award size={13} style={{ color: '#4f46e5' }} />
                                    <span>{t('commission.chairman', 'Председатель')}: {c.chairman ? t('common.yes', 'Назначен') : '—'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Users size={13} style={{ color: '#10b981' }} />
                                    <span>{t('commission.members', 'Члены')}: {c.members?.length || 0}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    className="final-btn ripple-effect"
                    onClick={onFinish}
                    style={{
                        width: '100%',
                        padding: '13px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                        color: '#ffffff',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)',
                        transition: 'all 0.2s'
                    }}
                >
                    {t('department.approvePeriod', 'Утвердить и завершить')}
                </button>
            </div>
        </div>
    );
}
