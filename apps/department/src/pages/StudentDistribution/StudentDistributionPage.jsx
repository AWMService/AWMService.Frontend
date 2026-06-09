import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useQueries, useQueryClient, useMutation } from '@tanstack/react-query';
import { 
    getIntlLocale,
    useAuth, 
    useCommissions, 
    useOrgUnitEmployees,
    useCreateCommission,
    useUpdateCommission,
    useDeleteCommission,
    useAutoDistributeStudents,
    useUpdateSchedule,
    useDeleteSchedule,
    useGenerateSchedule,
    useDefenseReadiness,
    useOrgUnitSpecialities,
    usePeriods,
    scheduleApi,
    fetchPreDefenseSchedule,
    ConfirmModal
} from "@awm/shared";
import { 
    Users, 
    Calendar as CalendarIcon, 
    Clock, 
    Plus, 
    Trash2, 
    Edit, 
    AlertCircle, 
    Sparkles, 
    Check, 
    X,
    Search,
    MapPin,
    Eraser,
    CheckCircle2,
    XCircle
} from "lucide-react";
import CommissionFormModal from "../../components/Commissions/CommissionFormModal.jsx";
import "./StudentDistributionPage.css";

const WORKFLOW_STAGES = [
    { key: "PreDefense1", translationKey: "student.preDefense1", defaultLabel: "Предзащита 1", typeId: 1, num: 1 },
    { key: "PreDefense2", translationKey: "student.preDefense2", defaultLabel: "Предзащита 2", typeId: 1, num: 2 },
    { key: "PreDefense3", translationKey: "student.preDefense3", defaultLabel: "Предзащита 3", typeId: 1, num: 3 },
    { key: "FinalDefense", translationKey: "student.defense", defaultLabel: "Защита (ГАК)", typeId: 2, num: null }
];

export default function StudentDistributionPage() {
    const { t, i18n } = useTranslation();
    const locale = getIntlLocale(i18n.language);
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();

    const departmentId = user?.orgUnitId;
    const semesterId = user?.currentSemesterId;

    
    const [selectedSpecialityId, setSelectedSpecialityId] = useState(null);
    const [activeStageKey, setActiveStageKey] = useState("PreDefense1");

    
    const [scheduleSearch, setScheduleSearch] = useState("");
    const [unassignedSearch, setUnassignedSearch] = useState("");

    
    const [editingSlotId, setEditingSlotId] = useState(null);
    const [editFormData, setEditFormData] = useState({ commissionId: '', date: '', time: '', location: '' });
    const [assignState, setAssignState] = useState({}); 

    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCommission, setEditingCommission] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    
    const [unscheduleTarget, setUnscheduleTarget] = useState(null);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    
    const [toasts, setToasts] = useState([]);
    const toastIdRef = useRef(0);

    const showToast = useCallback((message, variant = 'info') => {
        const id = ++toastIdRef.current;
        setToasts(prev => [...prev, { id, message, variant }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    
    const { data: specialities = [] } = useOrgUnitSpecialities(departmentId);
    const { data: periods = [] } = usePeriods(departmentId, semesterId, selectedSpecialityId);
    const { data: allCommissions = [], isLoading: isCommsLoading } = useCommissions(departmentId, semesterId);
    const { data: staff = [], isLoading: isStaffLoading } = useOrgUnitEmployees(departmentId);
    const { data: allStudents = [], isLoading: isStudentsLoading } = useDefenseReadiness({ 
        orgUnitId: departmentId, 
        semesterId,
        specialityId: selectedSpecialityId 
    });

    
    const createCommissionMutation = useCreateCommission(departmentId, semesterId, selectedSpecialityId);
    const updateCommissionMutation = useUpdateCommission(departmentId, semesterId, selectedSpecialityId);
    const deleteCommissionMutation = useDeleteCommission(departmentId, semesterId, selectedSpecialityId);
    const autoDistributeMutation = useAutoDistributeStudents();
    const updateScheduleMutation = useUpdateSchedule();
    const deleteScheduleMutation = useDeleteSchedule();
    const generateScheduleMutation = useGenerateSchedule();

    
    const stageIdParam = searchParams.get('stageId');
    useEffect(() => {
        if (periods && periods.length > 0 && stageIdParam) {
            const matchedPeriod = periods.find(p => p.id === Number(stageIdParam) || p.id.toString() === stageIdParam);
            if (matchedPeriod && matchedPeriod.workflowStage) {
                setActiveStageKey(matchedPeriod.workflowStage);
                
                const nextParams = new URLSearchParams(searchParams);
                nextParams.delete('stageId');
                setSearchParams(nextParams);
            }
        }
    }, [periods, stageIdParam, searchParams, setSearchParams]);

    const activeStage = useMemo(() => {
        return WORKFLOW_STAGES.find(s => s.key === activeStageKey) || WORKFLOW_STAGES[0];
    }, [activeStageKey]);

    const currentPeriod = useMemo(() => {
        if (!periods || !activeStageKey) return null;
        return periods.find(p => p.workflowStage === activeStageKey);
    }, [periods, activeStageKey]);

    
    const filteredCommissions = useMemo(() => {
        const stageComms = allCommissions.filter(c => 
            c.commissionTypeId === activeStage.typeId && 
            (activeStage.typeId === 2 || c.preDefenseNumber === activeStage.num)
        );

        if (selectedSpecialityId) {
            const specComms = stageComms.filter(c => c.specialityId === selectedSpecialityId);
            if (specComms.length > 0) return specComms;
            
            return stageComms.filter(c => !c.specialityId);
        }

        return stageComms;
    }, [allCommissions, activeStage, selectedSpecialityId]);

    
    const scheduleQueries = useQueries({
        queries: filteredCommissions.map(c => ({
            queryKey: ['preDefense', 'schedule', c.id],
            queryFn: () => fetchPreDefenseSchedule(c.id),
            enabled: !!c.id
        }))
    });

    const isSchedulesLoading = scheduleQueries.some(q => q.isLoading);

    const allSchedules = useMemo(() => {
        return scheduleQueries.flatMap((q, index) => {
            const comm = filteredCommissions[index];
            const slots = q.data || [];
            return slots.map(slot => ({
                ...slot,
                commissionName: comm?.name,
                commissionId: comm?.id
            }));
        });
    }, [scheduleQueries, filteredCommissions]);

    
    const scheduledStudents = useMemo(() => {
        return allSchedules
            .filter(slot => slot.studentWorkId)
            .map(slot => ({
                id: slot.id,
                studentWorkId: slot.studentWorkId,
                studentName: slot.studentName || t('department.student', 'Студент'),
                topicTitle: slot.topicTitle || t('department.topic', 'Тема'),
                commissionId: slot.commissionId,
                commissionName: slot.commissionName,
                defenseDate: slot.date || (slot.defenseDate ? slot.defenseDate.split('T')[0] : ''),
                defenseTime: slot.startTime || (slot.defenseDate && slot.defenseDate.includes('T') ? slot.defenseDate.split('T')[1].substring(0, 5) : ''),
                location: slot.location || ''
            }));
    }, [allSchedules, t]);

    
    const cohortStudents = useMemo(() => {
        return allStudents.filter(student => {
            const state = student.currentState;
            if (activeStageKey === "PreDefense1") {
                return ["Draft", "PreDefense1.WaitingForFiles", "PreDefense1.WaitingForSchedule", "PreDefense1.Scheduled"].includes(state);
            }
            if (activeStageKey === "PreDefense2") {
                return ["PreDefense1.Passed", "PreDefense1.Failed", "PreDefense2.WaitingForFiles", "PreDefense2.WaitingForSchedule", "PreDefense2.Scheduled"].includes(state);
            }
            if (activeStageKey === "PreDefense3") {
                return ["PreDefense2.Failed", "PreDefense3.WaitingForFiles", "PreDefense3.WaitingForSchedule", "PreDefense3.Scheduled"].includes(state);
            }
            if (activeStageKey === "FinalDefense") {
                return ["ReadyForDefense", "Defense.WaitingForSchedule", "Defense.Scheduled"].includes(state);
            }
            return false;
        });
    }, [allStudents, activeStageKey]);

    
    const unassignedStudents = useMemo(() => {
        return cohortStudents.filter(student => {
            const isScheduled = scheduledStudents.some(s => s.studentWorkId === student.workId);
            return !isScheduled;
        });
    }, [cohortStudents, scheduledStudents]);

    
    const filteredScheduledStudents = useMemo(() => {
        if (!scheduleSearch) return scheduledStudents;
        const term = scheduleSearch.toLowerCase();
        return scheduledStudents.filter(s => 
            s.studentName.toLowerCase().includes(term) || 
            s.topicTitle.toLowerCase().includes(term)
        );
    }, [scheduledStudents, scheduleSearch]);

    const filteredUnassignedStudents = useMemo(() => {
        if (!unassignedSearch) return unassignedStudents;
        const term = unassignedSearch.toLowerCase();
        return unassignedStudents.filter(s => 
            s.studentName.toLowerCase().includes(term) || 
            s.topicTitle.toLowerCase().includes(term)
        );
    }, [unassignedStudents, unassignedSearch]);

    
    const handleAutoDistribute = async () => {
        try {
            await autoDistributeMutation.mutateAsync({
                orgUnitId: departmentId,
                semesterId: semesterId,
                commissionTypeId: activeStage.typeId,
                preDefenseNumber: activeStage.num,
                specialityId: selectedSpecialityId
            });
            queryClient.invalidateQueries({ queryKey: ['works'] });
            queryClient.invalidateQueries({ queryKey: ['preDefense'] });
            showToast(t('department.distributionSuccess', 'Студенты успешно распределены!'), 'success');
        } catch (error) {
            console.error('Failed to auto distribute', error);
            const errorMsg = error?.response?.data?.Message || error?.message || t('department.distributionFailed', 'Ошибка при распределении');
            showToast(errorMsg, 'error');
        }
    };

    
    const startEditingSlot = (slot) => {
        setEditingSlotId(slot.id);
        setEditFormData({
            commissionId: String(slot.commissionId),
            date: slot.defenseDate || '',
            time: slot.defenseTime || '',
            location: slot.location || ''
        });
    };

    const saveSlotEdit = async () => {
        if (!editFormData.date || !editFormData.time || !editFormData.commissionId) {
            showToast(t('department.fillAllFields', 'Заполните все поля!'), 'error');
            return;
        }
        try {
            const defenseDate = `${editFormData.date}T${editFormData.time}:00`;
            await updateScheduleMutation.mutateAsync({
                id: editingSlotId,
                commissionId: Number(editFormData.commissionId),
                defenseDate: defenseDate,
                location: editFormData.location || null
            });
            queryClient.invalidateQueries({ queryKey: ['works'] });
            queryClient.invalidateQueries({ queryKey: ['preDefense'] });
            setEditingSlotId(null);
            showToast('Слот обновлён', 'success');
        } catch (error) {
            console.error('Failed to update schedule', error);
            showToast(t('common.error', 'Ошибка сохранения'), 'error');
        }
    };

    
    const handleUnschedule = (scheduleId) => {
        setUnscheduleTarget(scheduleId);
    };

    const confirmUnschedule = async () => {
        if (!unscheduleTarget) return;
        try {
            await deleteScheduleMutation.mutateAsync(unscheduleTarget);
            queryClient.invalidateQueries({ queryKey: ['works'] });
            queryClient.invalidateQueries({ queryKey: ['preDefense'] });
            showToast('Студент убран из расписания', 'success');
        } catch (error) {
            console.error('Failed to delete schedule', error);
            showToast(t('common.error', 'Ошибка удаления'), 'error');
        } finally {
            setUnscheduleTarget(null);
        }
    };

    
    const handleClearAllSchedule = async () => {
        setShowClearConfirm(false);
        let failCount = 0;
        for (const slot of scheduledStudents) {
            try {
                await deleteScheduleMutation.mutateAsync(slot.id);
            } catch {
                failCount++;
            }
        }
        queryClient.invalidateQueries({ queryKey: ['works'] });
        queryClient.invalidateQueries({ queryKey: ['preDefense'] });
        if (failCount === 0) {
            showToast('Расписание полностью очищено', 'success');
        } else {
            showToast(`Очищено с ошибками (${failCount} не удалены)`, 'error');
        }
    };

    
    const handleAssignChange = (workId, field, value) => {
        setAssignState(prev => ({
            ...prev,
            [workId]: {
                ...prev[workId],
                [field]: value
            }
        }));
    };

    const handleManualAssign = async (student) => {
        const studentState = assignState[student.workId];
        if (!studentState || !studentState.commissionId || !studentState.date || !studentState.time) {
            showToast(t('department.fillAllFields', 'Заполните все поля для назначения!'), 'error');
            return;
        }

        try {
            const defenseDate = `${studentState.date}T${studentState.time}:00`;
            await generateScheduleMutation.mutateAsync({
                commissionId: Number(studentState.commissionId),
                startDate: defenseDate,
                location: studentState.location || 'Кафедра',
                slotDurationMinutes: 30,
                workIds: [student.workId]
            });
            queryClient.invalidateQueries({ queryKey: ['works'] });
            queryClient.invalidateQueries({ queryKey: ['preDefense'] });
            
            
            setAssignState(prev => {
                const next = { ...prev };
                delete next[student.workId];
                return next;
            });
            showToast('Студент успешно назначен', 'success');
        } catch (error) {
            console.error('Failed to generate schedule', error);
            showToast(t('common.error', 'Ошибка сохранения'), 'error');
        }
    };

    
    const handleCreateCommission = () => {
        setEditingCommission(null);
        setIsFormOpen(true);
    };

    const handleEditCommission = (comm) => {
        const chairman = comm.members?.find(m => m.roleType === 2);
        const secretary = comm.members?.find(m => m.roleType === 3);
        const members = comm.members?.filter(m => m.roleType === 4).map(m => m.userId) || [];

        setEditingCommission({
            ...comm,
            chairmanId: chairman?.userId || '',
            secretaryId: secretary?.userId || '',
            memberIds: members
        });
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingCommission) {
                await updateCommissionMutation.mutateAsync({
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
                await createCommissionMutation.mutateAsync({
                    ...formData,
                    orgUnitId: departmentId,
                    semesterId: semesterId
                });
            }
            setIsFormOpen(false);
            setEditingCommission(null);
            showToast(editingCommission ? 'Комиссия обновлена' : 'Комиссия создана', 'success');
        } catch (error) {
            console.error("Failed to submit commission", error);
            const msg = error?.response?.data?.message || error?.response?.data?.Message || error?.message || 'Ошибка сохранения комиссии';
            showToast(msg, 'error');
        }
    };

    const handleDeleteCommissionConfirm = async () => {
        if (deleteTarget) {
            try {
                await deleteCommissionMutation.mutateAsync(deleteTarget.id);
                setDeleteTarget(null);
                showToast('Комиссия удалена', 'success');
            } catch (error) {
                console.error("Failed to delete commission", error);
                const msg = error?.response?.data?.message || error?.response?.data?.Message || error?.message || 'Ошибка удаления комиссии';
                showToast(msg, 'error');
                setDeleteTarget(null);
            }
        }
    };

    const getMembersCountText = (count) => {
        if (count === 1) return `${count} член`;
        if (count >= 2 && count <= 4) return `${count} члена`;
        return `${count} членов`;
    };

    const formatDateStr = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString(locale, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };

    if (isCommsLoading || isStaffLoading || isStudentsLoading) {
        return (
            <div className="unified-distribution-workspace">
                <div className="loader-overlay">{t('common.loading', 'Загрузка...')}</div>
            </div>
        );
    }

    return (
        <div className="unified-distribution-workspace">
            {}
            <div className="workspace-controls-bar">
                <div className="workspace-stage-speciality">
                    <select
                        className="workspace-select"
                        value={activeStageKey}
                        onChange={(e) => {
                            setActiveStageKey(e.target.value);
                            setEditingSlotId(null);
                        }}
                    >
                        {WORKFLOW_STAGES.map(s => (
                            <option key={s.key} value={s.key}>
                                {t(s.translationKey, s.defaultLabel)}
                            </option>
                        ))}
                    </select>

                    <select
                        className="workspace-select"
                        value={selectedSpecialityId || ""}
                        onChange={(e) => {
                            setSelectedSpecialityId(e.target.value ? Number(e.target.value) : null);
                            setEditingSlotId(null);
                        }}
                    >
                        <option value="">{t('department.allSpecialities', 'Общее для кафедры')}</option>
                        {specialities.map(s => (
                            <option key={s.id} value={s.id}>{s.code} - {s.title}</option>
                        ))}
                    </select>
                </div>

                {currentPeriod && (
                    <div className="workspace-dates-badge">
                        <CalendarIcon size={14} />
                        <span>Сроки этапа:</span> {formatDateStr(currentPeriod.startDate)} — {formatDateStr(currentPeriod.endDate)}
                    </div>
                )}
            </div>

            {}
            <div className="workspace-grid">
                {}
                <div className="workspace-column">
                    <div className="column-header">
                        <div className="column-title-group">
                            <h3 className="column-title">
                                <Users size={16} /> Комиссии
                            </h3>
                            <span className="column-subtitle">Созданные комиссии для этапа</span>
                        </div>
                        <button className="btn-sm-primary" onClick={handleCreateCommission}>
                            <Plus size={14} /> Создать
                        </button>
                    </div>

                    <div className="column-content">
                        {filteredCommissions.map(comm => {
                            const chairman = comm.members?.find(m => m.roleType === 2)?.fullName;
                            const secretary = comm.members?.find(m => m.roleType === 3)?.fullName;
                            const membersCount = comm.members?.filter(m => m.roleType === 4).length || 0;
                            const studentCount = scheduledStudents.filter(s => s.commissionId === comm.id).length;

                            return (
                                <div key={comm.id} className="commission-card-item">
                                    <div className="commission-card-header">
                                        <h4 className="commission-card-title">{comm.name}</h4>
                                        <span className="commission-card-badge">
                                            {studentCount} студ.
                                        </span>
                                    </div>

                                    <div className="commission-card-meta">
                                        <div className="commission-meta-row">
                                            <span className="commission-meta-label">Председатель:</span>
                                            <span className="commission-meta-val" title={chairman}>{chairman || "—"}</span>
                                        </div>
                                        <div className="commission-meta-row">
                                            <span className="commission-meta-label">Секретарь:</span>
                                            <span className="commission-meta-val" title={secretary}>{secretary || "—"}</span>
                                        </div>
                                        <div className="commission-meta-row">
                                            <span className="commission-meta-label">Члены:</span>
                                            <span className="commission-meta-val">{getMembersCountText(membersCount)}</span>
                                        </div>
                                    </div>

                                    <div className="commission-card-footer">
                                        <button className="btn-sm-icon primary" onClick={() => handleEditCommission(comm)} title={t('common.edit', 'Изменить')}>
                                            <Edit size={13} />
                                        </button>
                                        <button className="btn-sm-icon danger" onClick={() => setDeleteTarget(comm)} title={t('common.delete', 'Удалить')}>
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {filteredCommissions.length === 0 && (
                            <p className="empty-state-text">
                                {activeStage.typeId === 2 
                                    ? "Комиссии ГАК не найдены." 
                                    : "Комиссии предзащит не найдены."}
                            </p>
                        )}
                    </div>
                </div>

                {}
                <div className="workspace-column">
                    <div className="column-header">
                        <div className="column-title-group">
                            <h3 className="column-title">
                                Расписание защит ({filteredScheduledStudents.length})
                            </h3>
                            <span className="column-subtitle">Распределенные студенты по времени</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                                className="btn-sm-primary" 
                                onClick={handleAutoDistribute}
                                disabled={autoDistributeMutation.isPending || filteredCommissions.length === 0 || unassignedStudents.length === 0}
                                title="Автоматически распределить оставшихся студентов"
                            >
                                <Sparkles size={13} /> Автораспределение
                            </button>
                            <button
                                className="btn-sm-outline danger-outline"
                                onClick={() => setShowClearConfirm(true)}
                                disabled={scheduledStudents.length === 0 || deleteScheduleMutation.isPending}
                                title="Удалить всё расписание этапа"
                            >
                                <Eraser size={13} /> Очистить
                            </button>
                        </div>
                    </div>

                    <div className="column-content" style={{ padding: 0 }}>
                        <div style={{ padding: '12px 16px 0 16px' }}>
                            <div className="column-search-wrapper">
                                <input
                                    type="text"
                                    className="column-search-input"
                                    placeholder="Поиск по студенту или теме..."
                                    value={scheduleSearch}
                                    onChange={(e) => setScheduleSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        {isSchedulesLoading ? (
                            <div className="loader-overlay" style={{ padding: '20px' }}>Загрузка расписания...</div>
                        ) : (
                            <div className="schedule-table-wrapper">
                                <table className="schedule-table">
                                    <thead>
                                        <tr>
                                            <th>Студент / Тема</th>
                                            <th>Комиссия</th>
                                            <th>Дата и время</th>
                                            <th>Кабинет</th>
                                            <th style={{ textAlign: 'right' }}>Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredScheduledStudents.map(student => {
                                            const isEditing = editingSlotId === student.id;

                                            return (
                                                <tr key={student.id}>
                                                    <td>
                                                        <div className="student-cell">
                                                            <span className="student-cell-name">{student.studentName}</span>
                                                            <span className="student-cell-topic" title={student.topicTitle}>{student.topicTitle}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {isEditing ? (
                                                            <select
                                                                className="inline-input"
                                                                style={{ width: '130px' }}
                                                                value={editFormData.commissionId}
                                                                onChange={(e) => setEditFormData({ ...editFormData, commissionId: e.target.value })}
                                                            >
                                                                {filteredCommissions.map(c => (
                                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            <span className="scheduled-commission-badge">
                                                                {student.commissionName}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {isEditing ? (
                                                            <div style={{ display: 'flex', gap: '4px', flexDirection: 'column' }}>
                                                                <input
                                                                    type="date"
                                                                    className="inline-input"
                                                                    value={editFormData.date}
                                                                    onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                                                                />
                                                                <input
                                                                    type="time"
                                                                    className="inline-input"
                                                                    value={editFormData.time}
                                                                    onChange={(e) => setEditFormData({ ...editFormData, time: e.target.value })}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="scheduled-time-badge">
                                                                <Clock size={12} />
                                                                <span>
                                                                    {formatDateStr(student.defenseDate)} {student.defenseTime}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {isEditing ? (
                                                            <input
                                                                type="text"
                                                                className="inline-input"
                                                                style={{ width: '100px' }}
                                                                placeholder="Кабинет"
                                                                value={editFormData.location}
                                                                onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                                                            />
                                                        ) : (
                                                            student.location ? (
                                                                <span className="scheduled-location-badge">
                                                                    <MapPin size={11} /> {student.location}
                                                                </span>
                                                            ) : (
                                                                <span style={{ color: '#9ca3af', fontSize: '12px' }}>—</span>
                                                            )
                                                        )}
                                                    </td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        {isEditing ? (
                                                            <div style={{ display: 'inline-flex', gap: '6px' }}>
                                                                <button className="btn-sm-icon success" onClick={saveSlotEdit} title={t('common.save', 'Сохранить')}>
                                                                    <Check size={14} />
                                                                </button>
                                                                <button className="btn-sm-icon" onClick={() => setEditingSlotId(null)} title={t('common.cancel', 'Отмена')}>
                                                                    <X size={14} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div style={{ display: 'inline-flex', gap: '6px' }}>
                                                                <button className="btn-sm-icon primary" onClick={() => startEditingSlot(student)} title={t('common.edit', 'Изменить')}>
                                                                    <Edit size={13} />
                                                                </button>
                                                                <button className="btn-sm-icon danger" onClick={() => handleUnschedule(student.id)} title="Убрать из расписания">
                                                                    <Trash2 size={13} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}

                                        {filteredScheduledStudents.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="empty-state-text" style={{ padding: '32px' }}>
                                                    Студенты не найдены. Выберите другой этап или проведите автораспределение.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {}
                <div className="workspace-column">
                    <div className="column-header">
                        <div className="column-title-group">
                            <h3 className="column-title">
                                Очередь ожидания ({filteredUnassignedStudents.length})
                            </h3>
                            <span className="column-subtitle">Студенты без времени защиты</span>
                        </div>
                    </div>

                    <div className="column-content">
                        <div className="column-search-wrapper">
                            <input
                                type="text"
                                className="column-search-input"
                                placeholder="Поиск неготовых..."
                                value={unassignedSearch}
                                onChange={(e) => setUnassignedSearch(e.target.value)}
                            />
                        </div>

                        {filteredUnassignedStudents.map(student => {
                            const currentAssign = assignState[student.workId] || {};
                            
                            return (
                                <div key={student.workId} className="unassigned-card-item">
                                    <div>
                                        <h4 className="unassigned-student-name">{student.studentName}</h4>
                                        <p className="unassigned-student-topic" title={student.topicTitle}>{student.topicTitle}</p>
                                    </div>

                                    <div className="quick-assign-panel">
                                        <div className="quick-assign-inputs">
                                            <select
                                                className="quick-select"
                                                value={currentAssign.commissionId || ""}
                                                onChange={(e) => handleAssignChange(student.workId, 'commissionId', e.target.value)}
                                            >
                                                <option value="">-- Выберите комиссию --</option>
                                                {filteredCommissions.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>

                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                <input
                                                    type="date"
                                                    className="quick-input"
                                                    value={currentAssign.date || ""}
                                                    onChange={(e) => handleAssignChange(student.workId, 'date', e.target.value)}
                                                />
                                                <input
                                                    type="time"
                                                    className="quick-input"
                                                    value={currentAssign.time || ""}
                                                    onChange={(e) => handleAssignChange(student.workId, 'time', e.target.value)}
                                                />
                                            </div>

                                            <input
                                                type="text"
                                                className="quick-input"
                                                placeholder="Кабинет (напр. 305)"
                                                value={currentAssign.location || ""}
                                                onChange={(e) => handleAssignChange(student.workId, 'location', e.target.value)}
                                            />
                                        </div>

                                        <button 
                                            className="btn-sm-primary" 
                                            style={{ marginTop: '4px', justifyContent: 'center' }}
                                            onClick={() => handleManualAssign(student)}
                                            disabled={!currentAssign.commissionId || !currentAssign.date || !currentAssign.time}
                                        >
                                            Назначить время
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {filteredUnassignedStudents.length === 0 && (
                            <p className="empty-state-text">Все студенты этапа распределены по слотам.</p>
                        )}
                    </div>
                </div>
            </div>

            {}
            <CommissionFormModal
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingCommission(null);
                }}
                onSubmit={handleFormSubmit}
                editingCommission={editingCommission}
                staff={staff}
                orgUnitId={departmentId}
            />

            <ConfirmModal
                isOpen={!!deleteTarget}
                title="Удалить комиссию"
                message={deleteTarget?.name}
                onConfirm={handleDeleteCommissionConfirm}
                onCancel={() => setDeleteTarget(null)}
                variant="danger"
            />

            <ConfirmModal
                isOpen={!!unscheduleTarget}
                title="Убрать из расписания"
                message="Вы уверены, что хотите убрать студента из расписания?"
                onConfirm={confirmUnschedule}
                onCancel={() => setUnscheduleTarget(null)}
                variant="danger"
            />

            <ConfirmModal
                isOpen={showClearConfirm}
                title="Очистить расписание"
                message={`Удалить все ${scheduledStudents.length} слотов расписания для текущего этапа? Все студенты вернутся в очередь ожидания.`}
                onConfirm={handleClearAllSchedule}
                onCancel={() => setShowClearConfirm(false)}
                variant="danger"
            />

            {}
            {toasts.length > 0 && (
                <div className="toast-container">
                    {toasts.map(toast => (
                        <div key={toast.id} className={`toast-item toast-${toast.variant}`}>
                            {toast.variant === 'success' && <CheckCircle2 size={16} />}
                            {toast.variant === 'error' && <XCircle size={16} />}
                            {toast.variant === 'info' && <AlertCircle size={16} />}
                            <span>{toast.message}</span>
                            <button className="toast-close" onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}>
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
