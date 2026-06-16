import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useStudentDefenseStep, useMyWorkProgress } from '@awm/shared';
import { ScheduleCard } from '../../components/ScheduleCard/ScheduleCard.jsx';
import { CommissionCard } from '../../components/CommissionCard/CommissionCard.jsx';
import { InfoBox } from '../../components/InfoBox/InfoBox.jsx';
import infoIcon from '../../assets/icons/pre-defense/info-icon.svg';

const STEP_ROUTE_MAP = {
    'PreDefense1.Scheduled': '/pre-defense-1',
    'PreDefense2.Scheduled': '/pre-defense-2',
    'PreDefense3.Scheduled': '/pre-defense-3',
    'Defense.Scheduled':     '/defense',
};

const MySchedulePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { data: defenseStep, isLoading } = useStudentDefenseStep();
    const { data: workProgress } = useMyWorkProgress();

    const schedule = defenseStep?.schedule ?? null;
    const commission = defenseStep?.commission ?? [];
    const stepType = defenseStep?.stepType;

    const targetRoute = workProgress?.currentStateName
        ? (STEP_ROUTE_MAP[workProgress.currentStateName] ?? null)
        : null;

    if (isLoading) {
        return <div style={{ padding: '24px' }}>{t('common.loading')}</div>;
    }

    return (
        <div style={{ padding: '24px', maxWidth: '800px' }}>
            <h2 style={{ marginBottom: '20px' }}>
                {stepType === 'defense' ? t('student.defense') : t('student.preDefense')}
            </h2>

            {!schedule ? (
                <InfoBox icon={infoIcon} type="neutral">
                    <p className="info-title">{t('student.scheduleNotAssigned', 'Расписание ещё не назначено')}</p>
                    <p className="info-desc">{t('student.scheduleNotAssignedDesc', 'Кафедра распределит вас по комиссии после завершения текущего этапа')}</p>
                </InfoBox>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <ScheduleCard schedule={schedule} />
                    {commission.length > 0 && <CommissionCard commission={commission} />}
                    {targetRoute && (
                        <button
                            className="btn-primary"
                            onClick={() => navigate(targetRoute)}
                            style={{ alignSelf: 'flex-start', marginTop: '8px' }}
                        >
                            {t('student.goToDefenseStep', 'Перейти к защите')}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default MySchedulePage;
