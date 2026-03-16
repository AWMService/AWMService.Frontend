import React, { useState } from 'react';
import { StudentApplicationCard } from '../../components/Students/StudentApplicationCard/StudentApplicationCard';
import './StudentPage.css';

const mockApplications = [
    {
        id: 1,
        title: "Разработка сайта, продукта, базы данных",
        supervisor: "Иванов И.И",
        status: "pending"
    }
];

export default function MyApplicationsPage() {

  return (
    <div className="student-content-container">
      <div className="applications-list-container">
        {mockApplications.map(app => (
          <StudentApplicationCard key={app.id} application={app} />
        ))}
      </div>
    </div>
  );
}
