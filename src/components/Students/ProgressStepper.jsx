import React from 'react';
import { Link } from 'react-router-dom';
import './ProgressStepper.css';
import doneIcon from '../../assets/icons/done-icon.svg'; // Assuming you have a done icon

const steps = [
  { id: 1, name: 'Выбор темы', path: '/student/choose-theme' },
  { id: 2, name: 'Предзащита 1', path: '/student/pre-defense-1' },
  { id: 3, name: 'Предзащита 2', path: '/student/pre-defense-2' },
  { id: 4, name: 'Нормоконтроль', path: '/student/normocontrol' },
  { id: 5, name: 'Проверка ПО', path: '/student/software-check' },
  { id: 6, name: 'Антиплагиат', path: '/student/antiplagiarism' },
  { id: 7, name: 'Рецензия', path: '/student/critique' },
  { id: 8, name: 'Защита', path: '/student/defense' }, // Example path
];

export function ProgressStepper({ currentStep = 1, highestCompletedStep = 1 }) {
  return (
    <div className="progress-stepper">
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;
        const isAvailable = step.id <= highestCompletedStep;
        
        let stepClassName = 'step';
        if (isActive) {
          stepClassName += ' active';
        } else if (isCompleted) {
          stepClassName += ' completed';
        }
        if (isAvailable) {
          stepClassName += ' available';
        }

        const stepContent = (
            <div className={stepClassName}>
                <div className="step-circle">
                    {isCompleted ? <img src={doneIcon} alt="Done" className="done-icon"/> : step.id}
                </div>
                <div className="step-name">{step.name}</div>
            </div>
        );

        return (
          <React.Fragment key={step.id}>
            {isAvailable ? (
              <Link to={step.path} className={stepClassName}>
                {stepContent}
              </Link>
            ) : (
              stepContent
            )}
            {index < steps.length - 1 && (
              <div className="step-connector" style={{ 
                flex: 1, 
                height: '2px', 
                backgroundColor: '#D9D9D9', 
                margin: '0 10px' 
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
