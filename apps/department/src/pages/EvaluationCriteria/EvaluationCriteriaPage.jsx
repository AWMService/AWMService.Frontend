import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ConfirmModal,
    useAuth,
    useOrgUnitSpecialities,
    useEvaluationCriteria,
    useCreateEvaluationCriteria,
    evaluationApi,
    useWorkTypes
} from "@awm/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import plusIcon from "../../assets/icons/plus-icon.svg";
import "./EvaluationCriteriaPage.css";


function CriteriaForm({ initialData, onSubmit, onCancel }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState(initialData || { criteriaName: '', maxScore: 10, weight: 1.0, sortOrder: 0 });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form className="criteria-form" onSubmit={handleSubmit}>
            <div className="criteria-form__fields">
                <div className="form-group">
                    <label>{t('criteria.name', 'Название критерия')}</label>
                    <input 
                        type="text" 
                        placeholder={t('criteria.namePlaceholder', 'Например: Актуальность темы')} 
                        value={formData.criteriaName}
                        onChange={e => setFormData({...formData, criteriaName: e.target.value})}
                        required
                    />
                </div>
                <div className="form-group">
                    <label title={t('criteria.maxScoreHelp', 'Оценка ставится от 0 до этого значения')}>
                        {t('criteria.maxScore', 'Макс. балл')} ℹ️
                    </label>
                    <input 
                        type="number" 
                        value={formData.maxScore}
                        onChange={e => setFormData({...formData, maxScore: parseInt(e.target.value)})}
                        required
                        min="1"
                    />
                </div>
                <div className="form-group">
                    <label title={t('criteria.weightHelp', 'Например, 0.5 (оценка умножается на этот вес)')}>
                        {t('criteria.weight', 'Вес')} ℹ️
                    </label>
                    <input 
                        type="number" 
                        step="0.1"
                        value={formData.weight}
                        onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})}
                        required
                        min="0"
                    />
                </div>
                <div className="form-group">
                    <label>{t('criteria.sortOrder', 'Порядок')}</label>
                    <input 
                        type="number" 
                        value={formData.sortOrder}
                        onChange={e => setFormData({...formData, sortOrder: parseInt(e.target.value) || 0})}
                        min="0"
                        className="criteria-form__sort-order"
                    />
                </div>
            </div>

            <div className="criteria-form__actions">
                <button type="submit" className="button primary-button">{t('common.save')}</button>
                <button type="button" className="button secondary-button" onClick={onCancel}>{t('common.cancel')}</button>
            </div>
        </form>
    );
}

function EvaluationCriteriaPage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    
    const orgUnitId = user?.orgUnitId;

    const [workTypeId, setWorkTypeId] = useState(1); 
    const [selectedSpecialityId, setSelectedSpecialityId] = useState(null);
    const [defenseStageType, setDefenseStageType] = useState(1); 
    const [isAdding, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const { data: specialities = [] } = useOrgUnitSpecialities(orgUnitId);
    const { data: workTypes = [] } = useWorkTypes();
    
    React.useEffect(() => {
        if (workTypes.length > 0 && !workTypes.find(wt => String(wt.id) === String(workTypeId))) {
            setWorkTypeId(workTypes[0].id);
        }
    }, [workTypes, workTypeId]);

    const { data: criteria = [], isLoading } = useEvaluationCriteria(workTypeId, orgUnitId, selectedSpecialityId, defenseStageType);
    
    const createMutation = useCreateEvaluationCriteria();
    
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => evaluationApi.updateCriteria(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['evaluation', 'criteria'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => evaluationApi.deleteCriteria(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['evaluation', 'criteria'] });
        }
    });

    const handleCreate = (formData) => {
        createMutation.mutate({
            ...formData,
            workTypeId,
            orgUnitId,
            specialityId: selectedSpecialityId,
            defenseStageType,
        }, {
            onSuccess: () => setIsFormOpen(false)
        });
    };

    const handleUpdate = (id, formData) => {
        updateMutation.mutate({ id, data: formData }, {
            onSuccess: () => setEditingId(null)
        });
    };

    if (isLoading) return <div className="criteria-page"><p>{t('common.loading')}</p></div>;

    return (
        <div className="criteria-page">
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
                    <div className="work-type-selector">
                        {workTypes.map(wt => (
                            <button 
                                key={wt.id}
                                className={`type-btn ${workTypeId === wt.id ? 'active' : ''}`}
                                onClick={() => setWorkTypeId(wt.id)}
                            >
                                {wt.name}
                            </button>
                        ))}
                    </div>
                </div>
                {!isAdding && (
                    <button className="button primary-button" onClick={() => setIsFormOpen(true)}>
                        <img src={plusIcon} alt="" className="button-icon" />
                        {t('criteria.add', 'Добавить критерий')}
                    </button>
                )}
            </div>

            {}
            <div className="defense-stage-tabs">
                <button 
                    className={`stage-tab ${defenseStageType === 1 ? 'active' : ''}`}
                    onClick={() => setDefenseStageType(1)}
                >
                    {t('criteria.preDefense', 'Предзащиты')}
                </button>
                <button 
                    className={`stage-tab ${defenseStageType === 2 ? 'active' : ''}`}
                    onClick={() => setDefenseStageType(2)}
                >
                    {t('criteria.gakDefense', 'Защита ГАК')}
                </button>
            </div>

            {isAdding && (
                <div className="criteria-card adding">
                    <CriteriaForm 
                        onSubmit={handleCreate} 
                        onCancel={() => setIsFormOpen(false)} 
                    />
                </div>
            )}

            <div className="criteria-list">
                {criteria.length === 0 && !isAdding && (
                    <div className="criteria-empty">
                        {t('criteria.noCriteria', 'Критерии для этого типа работ еще не созданы.')}
                    </div>
                )}

                {criteria.map((item) => (
                    <div key={item.id} className="criteria-card">
                        {editingId === item.id ? (
                            <CriteriaForm 
                                initialData={item}
                                onSubmit={(data) => handleUpdate(item.id, data)}
                                onCancel={() => setEditingId(null)}
                            />
                        ) : (
                            <>
                                <div className="criteria-info">
                                    <h3 className="criteria-name">{item.criteriaName}</h3>
                                    <div className="criteria-stats">
                                        <span className="stat">
                                            {t('criteria.maxScoreShort', 'Макс. балл')}: <strong>{item.maxScore}</strong>
                                        </span>
                                        <span className="stat">
                                            {t('criteria.weightShort', 'Вес')}: <strong>{item.weight}</strong>
                                        </span>
                                        {item.specialityId && (
                                            <span className="speciality-badge">
                                                {t('criteria.customForSpeciality', 'Для специальности')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="criteria-actions">
                                    <button onClick={() => setEditingId(item.id)}>{t('common.edit')}</button>
                                    <button className="danger" onClick={() => setDeleteTarget(item)}>{t('common.delete')}</button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            <ConfirmModal
                isOpen={!!deleteTarget}
                title={t('criteria.deleteTitle', 'Удалить критерий?')}
                message={deleteTarget?.criteriaName}
                onConfirm={() => {
                    deleteMutation.mutate(deleteTarget.id);
                    setDeleteTarget(null);
                }}
                onCancel={() => setDeleteTarget(null)}
                variant="danger"
            />
        </div>
    );
}

export default EvaluationCriteriaPage;
