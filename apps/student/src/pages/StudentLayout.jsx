import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useMyWorkProgress, useCurrentWorkId, useActiveCheckConfigurations } from '@awm/shared';
import { StudentHeader } from '../components/StudentHeader';
import { ProgressStepper } from '../components/ProgressStepper';

const STANDALONE_PAGES = ['profile', 'my-work', 'notifications'];

const isStandalonePage = (path) =>
    STANDALONE_PAGES.some((page) => path.includes(page));

const getStepFromPath = (path) => {
  if (path.includes('pre-defense-3')) return 3;
  if (path.includes('pre-defense-1')) return 2;
  if (path.includes('pre-defense-2')) return 3;
  if (path.includes('normocontrol')) return 4;
  if (path.includes('software-check')) return 5;
  if (path.includes('antiplagiarism')) return 6;
  if (path.includes('critique')) return 7;
  if (path.includes('defense')) return 8;
  if (path.includes('choose-theme') || path.includes('my-applications')) return 1;
  return 1;
};

const stateToHighestStep = (stateName) => {
  if (!stateName) return 1;
  if (stateName.startsWith('PreDefense1.')) return 2;
  if (stateName.startsWith('PreDefense2.') || stateName.startsWith('PreDefense3.')) return 3;
  if (stateName === 'Checks.WaitingForInitial') return 4;
  if (stateName === 'Checks.WaitingForAntiPlagiarism') return 6;
  if (stateName.startsWith('Checks.')) return 5;
  if (stateName.startsWith('Reviews.')) return 7;
  if (
    stateName === 'ReadyForDefense' ||
    stateName.startsWith('Defense.') ||
    stateName === 'Defended' ||
    stateName === 'DefenseFailed'
  ) return 8;
  return 1;
};

export const StudentLayout = () => {
  const location = useLocation();
  const { data: workProgress } = useMyWorkProgress();
  const { data: activeConfigs } = useActiveCheckConfigurations(
    workProgress?.orgUnitId,
    workProgress?.specialityId ?? null
  );

  // null → no rules configured or still loading → show all steps (safe fallback)
  // array → filter stepper to only configured check types
  const activeCheckTypeCodes = (activeConfigs && activeConfigs.length > 0)
    ? activeConfigs.map(c => c.checkTypeCode).filter(Boolean)
    : null;

  const currentStep = getStepFromPath(location.pathname);
  const highestCompletedStep = stateToHighestStep(workProgress?.currentStateName);

  const standalone = isStandalonePage(location.pathname);

  return (
    <div className="student-layout">
      <StudentHeader />
      <main className="student-main-content">
        {!standalone && (
          <ProgressStepper
            currentStep={currentStep}
            highestCompletedStep={highestCompletedStep}
            activeCheckTypeCodes={activeCheckTypeCodes}
          />
        )}
        <div className="student-page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
