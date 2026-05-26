import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./MembersModal.css";

const teachers = [
    "Доцент Сидоров П.П.",
    "Профессор Козлова М.М.",
    "Доцент Морозов В.В.",
    "Профа Н.Н.",
    "Иванова Е.Е.",
    "УЛВЬВУЛ П.П.",
    "Козлова М.М.",
    "Морозов В.В.",
    "Лебедева Н.Н.",
    " Иванова Е.Е.",
];

export default function MembersModal({ isOpen, selected = [], onClose, onConfirm, teachersList = [] }) {
    const { t } = useTranslation();
    const [checked, setChecked] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        setChecked(selected || []);
    }, [selected]);

    useEffect(() => {
        const onEsc = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onEsc);
        return () => document.removeEventListener("keydown", onEsc);
    }, [onClose]);

    if (!isOpen) return null;

    const filtered = teachersList.filter((t) =>
        t.name.toLowerCase().includes(query.toLowerCase())
    );

    const toggle = (id) => {
        if (checked.includes(id)) {
            setChecked((prev) => prev.filter((n) => n !== id));
        } else if (checked.length < 4) {
            setChecked((prev) => [...prev, id]);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal-title">{t('commission.members')}</h3>

                <div className="search-wrapper">
                    <input
                        className="search-input"
                        placeholder={t('department.searchTeacher')}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                {/* LIST */}
                <div className="modal-list">
                    {filtered.map((t) => {
                        const active = checked.includes(t.id);
                        return (
                            <div
                                key={t.id}
                                className={`modal-item ${active ? "active" : ""}`}
                                onClick={() => toggle(t.id)}
                            >
                                <span>{t.name}</span>
                                {active && <span className="check">✓</span>}
                            </div>
                        );
                    })}
                </div>


                <div className="modal-actions">
                    <button className="btn-secondary" onClick={onClose}>
                        {t('common.cancel')}
                    </button>
                    <button
                        className="btn-primary"
                        disabled={checked.length !== 4}
                        onClick={() => onConfirm(checked)}
                    >
                        {t('common.confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
}
