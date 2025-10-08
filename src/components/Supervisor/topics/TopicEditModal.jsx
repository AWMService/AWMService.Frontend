import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "./TopicEditModal.css";

export default function TopicEditModal({ open, onClose, topic, onSave, directions }) {
    const [form, setForm] = useState({
        titleRu: "",
        titleKk: "",
        titleEn: "",
        descRu: "",
        descKk: "",
        descEn: "",
        direction: "",
        workType: "diploma_project",
        participantCount: 1,
    });

    useEffect(() => {
        if (topic) {
            setForm({
                titleRu: topic.title?.ru ?? "",
                titleKk: topic.title?.kk ?? "",
                titleEn: topic.title?.en ?? "",
                descRu: topic.description?.ru ?? "",
                descKk: topic.description?.kk ?? "",
                descEn: topic.description?.en ?? "",
                direction: topic.directionTitle ?? "",
                workType: topic.workType ?? "diploma_project",
                participantCount: topic.participantCount ?? 1,
            });
        }
    }, [topic]);

    if (!open || !topic) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const updatedTopic = {
            ...topic,
            title: {
                ru: form.titleRu,
                kk: form.titleKk,
                en: form.titleEn,
            },
            description: {
                ru: form.descRu,
                kk: form.descKk,
                en: form.descEn,
            },
            directionTitle: form.direction,
            workType: form.workType,
            participantCount: Number(form.participantCount),
        };
        onSave(updatedTopic);
    };

    return (
        <div className="edit-overlay">
            <div className="edit-modal">
                <button className="edit-close" onClick={onClose}>
                    <X />
                </button>

                <h2>Редактирование темы</h2>

                <div className="edit-form">
                    <label>Название (Рус)</label>
                    <input name="titleRu" value={form.titleRu} onChange={handleChange} />
                    <label>Название (Қаз)</label>
                    <input name="titleKk" value={form.titleKk} onChange={handleChange} />
                    <label>Название (Eng)</label>
                    <input name="titleEn" value={form.titleEn} onChange={handleChange} />

                    <label>Описание (Рус)</label>
                    <textarea name="descRu" value={form.descRu} onChange={handleChange} />
                    <label>Описание (Қаз)</label>
                    <textarea name="descKk" value={form.descKk} onChange={handleChange} />
                    <label>Описание (Eng)</label>
                    <textarea name="descEn" value={form.descEn} onChange={handleChange} />

                    <label>Направление</label>
                    <select
                        name="direction"
                        value={form.direction}
                        onChange={handleChange}
                    >
                        <option value="">Выберите...</option>
                        {directions.map((d) => (
                            <option key={d}>{d}</option>
                        ))}
                    </select>

                    <label>Тип работы</label>
                    <select
                        name="workType"
                        value={form.workType}
                        onChange={handleChange}
                    >
                        <option value="diploma_project">Дипломный проект</option>
                        <option value="diploma_work">Дипломная работа</option>
                        <option value="course_work">Курсовая работа</option>
                    </select>

                    <label>Количество студентов</label>
                    <input
                        type="number"
                        min="1"
                        name="participantCount"
                        value={form.participantCount}
                        onChange={handleChange}
                    />
                </div>

                <div className="edit-actions">
                    <button className="btn btn-outline" onClick={onClose}>
                        Отмена
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
}
