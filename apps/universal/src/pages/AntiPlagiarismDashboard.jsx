import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Upload,
    ChevronDown,
    ChevronUp,
    FileText,
    CheckCircle2
} from 'lucide-react';
import { getLocalizedValue } from '@awm/shared';
import './anti.css';

const AntiPlagiarismDashboard = () => {
    const { t } = useTranslation();
    const [expandedTopics, setExpandedTopics] = useState([1]);

    const [data, setData] = useState([
        {
            id: 1,
            topicName: {
                ru: "Разработка высоконагруженных систем на Go",
                kk: "Go тіліндегі жоғары жүктемелі жүйелерді әзірлеу",
                en: "Development of high-load systems in Go",
            },
            isClosed: false,
            students: [
                { id: 101, name: "Александр Пушкин", status: "credit", file: "diploma_final.pdf" },
                { id: 102, name: "Сергей Есенин", status: "waiting", file: null },
                { id: 103, name: "Анна Ахматова", status: "noCredit", file: "draft_v1.docx" },
            ]
        },
        {
            id: 2,
            topicName: {
                ru: "Методы защиты информации в сетях",
                kk: "Желілердегі ақпаратты қорғау әдістері",
                en: "Information Protection Methods in Networks",
            },
            isClosed: false,
            students: [
                { id: 201, name: "Владимир Маяковский", status: "waiting", file: "report.pdf" }
            ]
        }
    ]);

    const toggleTopic = (id) => {
        setExpandedTopics(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const updateStatus = (topicId, studentId, newStatus) => {
        setData(data.map(topic => topic.id === topicId ? {
            ...topic,
            students: topic.students.map(s => s.id === studentId ? { ...s, status: newStatus } : s)
        } : topic));
    };

    const closeTopic = (id) => {
        if(window.confirm(t('messages.confirmClose'))) {
            setData(data.map(t => t.id === id ? {...t, isClosed: true} : t));
        }
    };

    const handleFileUpload = (topicId, studentId, event) => {
        const file = event.target.files[0];
        if (file) {
            setData(data.map(topic => topic.id === topicId ? {
                ...topic,
                students: topic.students.map(s => s.id === studentId ? { ...s, file: file.name, status: 'waiting' } : s)
            } : topic));
            alert(t('messages.fileSelected', { filename: file.name }));
        }
    };

    return (
        <div className="edu-container">
            <h1 className="edu-main-title">{t('antiplagiarism.workReview')}</h1>

            <div className="edu-list">
                {data.map((topic) => (
                    <div key={topic.id} className={`edu-topic-card ${topic.isClosed ? 'closed-topic' : ''}`}>
                        <div className="edu-topic-header">
                            <div className="edu-topic-info" onClick={() => toggleTopic(topic.id)}>
                                {expandedTopics.includes(topic.id) ? <ChevronUp size={20} color="#94a3b8"/> : <ChevronDown size={20} color="#94a3b8"/>}
                                <h3>{getLocalizedValue(topic.topicName)}</h3>
                                {topic.isClosed && <CheckCircle2 size={18} color="#22c55e" />}
                            </div>

                            {!topic.isClosed && (
                                <button className="edu-btn-close" onClick={() => closeTopic(topic.id)}>
                                    {t('common.send')}
                                </button>
                            )}
                        </div>

                        {expandedTopics.includes(topic.id) && (
                            <div className="edu-table-area">
                                <table className="edu-student-table">
                                    <thead>
                                    <tr>
                                        <th>{t('antiplagiarism.studentCol')}</th>
                                        <th>{t('antiplagiarism.documentCol')}</th>
                                        <th>{t('antiplagiarism.resultCol')}</th>
                                        <th style={{ textAlign: 'center' }}>{t('antiplagiarism.actionsCol')}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {topic.students.map((student) => (
                                        <tr key={student.id}>
                                            <td style={{ fontWeight: '500' }}>{student.name}</td>
                                            <td>
                                                {student.file ? (
                                                    <span className="edu-file-link">
                                                            <FileText size={14} /> {student.file}
                                                        </span>
                                                ) : (
                                                    <span style={{ color: '#cbd5e0', fontStyle: 'italic' }}>{t('antiplagiarism.noFile')}</span>
                                                )}
                                            </td>
                                            <td>
                                                <select
                                                    disabled={topic.isClosed}
                                                    value={student.status}
                                                    onChange={(e) => updateStatus(topic.id, student.id, e.target.value)}
                                                    className={`edu-status-select status-${student.status}`}
                                                >
                                                    <option value="waiting">{t('status.waiting')}</option>
                                                    <option value="credit">{t('status.credit')}</option>
                                                    <option value="noCredit">{t('status.noCredit')}</option>
                                                </select>
                                            </td>
                                            <td align="center">
                                                {!topic.isClosed && (
                                                    <>
                                                        <input
                                                            type="file"
                                                            style={{ display: 'none' }}
                                                            id={`file-${student.id}`}
                                                            onChange={(e) => handleFileUpload(topic.id, student.id, e)}
                                                        />
                                                        <label htmlFor={`file-${student.id}`} className="edu-upload-btn">
                                                            <Upload size={16} />
                                                        </label>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AntiPlagiarismDashboard;
