import React, { useState } from 'react';
import {
    Upload,
    ChevronDown,
    ChevronUp,
    FileText,
    CheckCircle2
} from 'lucide-react';
import './anti.css';

const AntiPlagiarismDashboard = () => {
    const [expandedTopics, setExpandedTopics] = useState([1]);

    const [data, setData] = useState([
        {
            id: 1,
            topicName: "Разработка высоконагруженных систем на Go",
            isClosed: false,
            students: [
                { id: 101, name: "Александр Пушкин", status: "зачет", file: "diploma_final.pdf" },
                { id: 102, name: "Сергей Есенин", status: "ожидание", file: null },
                { id: 103, name: "Анна Ахматова", status: "незачет", file: "draft_v1.docx" },
            ]
        },
        {
            id: 2,
            topicName: "Методы защиты информации в сетях",
            isClosed: false,
            students: [
                { id: 201, name: "Владимир Маяковский", status: "ожидание", file: "report.pdf" }
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
        if(window.confirm("Вы уверены, что хотите окончательно закрыть тему?")) {
            setData(data.map(t => t.id === id ? {...t, isClosed: true} : t));
        }
    };

    const handleFileUpload = (topicId, studentId, event) => {
        const file = event.target.files[0];
        if (file) {
            setData(data.map(topic => topic.id === topicId ? {
                ...topic,
                students: topic.students.map(s => s.id === studentId ? { ...s, file: file.name, status: 'ожидание' } : s)
            } : topic));
            alert(`Файл ${file.name} выбран для студента`);
        }
    };

    return (
        <div className="edu-container">
            <h1 className="edu-main-title">Проверка работ</h1>

            <div className="edu-list">
                {data.map((topic) => (
                    <div key={topic.id} className={`edu-topic-card ${topic.isClosed ? 'closed-topic' : ''}`}>
                        <div className="edu-topic-header">
                            <div className="edu-topic-info" onClick={() => toggleTopic(topic.id)}>
                                {expandedTopics.includes(topic.id) ? <ChevronUp size={20} color="#94a3b8"/> : <ChevronDown size={20} color="#94a3b8"/>}
                                <h3>{topic.topicName}</h3>
                                {topic.isClosed && <CheckCircle2 size={18} color="#22c55e" />}
                            </div>

                            {!topic.isClosed && (
                                <button className="edu-btn-close" onClick={() => closeTopic(topic.id)}>
                                    Отправить
                                </button>
                            )}
                        </div>

                        {expandedTopics.includes(topic.id) && (
                            <div className="edu-table-area">
                                <table className="edu-student-table">
                                    <thead>
                                    <tr>
                                        <th>Студент</th>
                                        <th>Документ</th>
                                        <th>Результат</th>
                                        <th style={{ textAlign: 'center' }}>Действия</th>
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
                                                    <span style={{ color: '#cbd5e0', fontStyle: 'italic' }}>Нет файла</span>
                                                )}
                                            </td>
                                            <td>
                                                <select
                                                    disabled={topic.isClosed}
                                                    value={student.status}
                                                    onChange={(e) => updateStatus(topic.id, student.id, e.target.value)}
                                                    className={`edu-status-select ${student.status}`}
                                                >
                                                    <option value="ожидание">Ожидание</option>
                                                    <option value="зачет">Зачет</option>
                                                    <option value="незачет">Незачет</option>
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