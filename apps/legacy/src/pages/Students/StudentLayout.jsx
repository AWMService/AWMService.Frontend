import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { StudentHeader } from '../../components/Students/StudentHeader';
import { ProgressStepper } from '../../components/Students/ProgressStepper';

const getStepFromPath = (path) => {
  if (path.includes('pre-defense-1')) return 2;
  if (path.includes('pre-defense-2')) return 3;
  if (path.includes('normocontrol')) return 4;
  if (path.includes('software-check')) return 5;
  if (path.includes('antiplagiarism')) return 6;
  if (path.includes('critique')) return 7;
  if (path.includes('defense')) return 8;
  if (path.includes('choose-theme') || path.includes('my-applications')) return 1;
  // Add other steps here
  return 1;
};

export const StudentLayout = () => {
  const location = useLocation();
  const currentStep = getStepFromPath(location.pathname);
  const highestCompletedStep = 8; // Mock: student has access up to step 8

  return (
    <div className="student-layout">
      <StudentHeader />
      <main className="student-main-content">
        <ProgressStepper currentStep={currentStep} highestCompletedStep={highestCompletedStep} />
        <div className="student-page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
