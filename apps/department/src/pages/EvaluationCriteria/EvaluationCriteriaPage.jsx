import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
    ConfirmModal, 
    useAuth, 
    useEvaluationCriteria,
    useCreateEvaluationCriteria,
    evaluationApi
} from "@awm/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import plusIcon from "../../assets/icons/plus-icon.svg";
import "./EvaluationCriteriaPage.css";

// Form for adding/editing criteria (simplified inline or could be a modal)
function CriteriaForm({ initialData, onSubmit, onCancel }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState(initialData || { criteriaName: '', maxScore: 10, weight: 1.0 });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form className="criteria-form" onSubmit={handleSubmit}>
            <div className="criteria-form__fields">
                <input 
                    type="text" 
                    placeholder={t('criteria.name')} 
                    value={formData.criteriaName}
                    onChange={e => setFormData({...formData, criteriaName: e.target.value})}
                    required
                />
                <input 
                    type="number" 
                    placeholder={t('criteria.maxScore')} 
                    value={formData.maxScore}
                    onChange={e => setFormData({...formData, maxScore: parseInt(e.target.value)})}
                    required
                    min="1"
                />
                <input 
                    type="number" 
                    step="0.1"
                    placeholder={t('criteria.weight')} 
                    value={formData.weight}
                    onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})}
                    required
                    min="0"
                />
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
    
    const [workTypeId, setWorkTypeId] = useState(1); // 1 = DP, 2 = DR (WorkTypes)
    const [isAdding, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const { data: criteria = [], isLoading } = useEvaluationCriteria(workTypeId, orgUnitId);
    
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
            orgUnitId
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
            <div className="page-header">
                <div>
                    <h1 className="page-title">{t('criteria.title', 'Критерии оценивания')}</h1>
                    <div className="work-type-selector">
                        <button 
                            className={`type-btn ${workTypeId === 1 ? 'active' : ''}`}
                            onClick={() => setWorkTypeId(1)}
                        >
                            {t('criteria.diplomaProject', 'Дипломный проект')}
                        </button>
                        <button 
                            className={`type-btn ${workTypeId === 2 ? 'active' : ''}`}
                            onClick={() => setWorkTypeId(2)}
                        >
                            {t('criteria.diplomaWork', 'Дипломная работа')}
                        </button>
                    </div>
                </div>
                {!isAdding && (
                    <button className="button primary-button" onClick={() => setIsFormOpen(true)}>
                        <img src={plusIcon} alt="" className="button-icon" />
                        {t('criteria.add', 'Добавить критерий')}
                    </button>
                )}
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
