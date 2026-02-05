import React, { useEffect, useState } from "react";
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

export default function MembersModal({ isOpen, selected, onClose, onConfirm }) {
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

    const filtered = teachers.filter((t) =>
        t.toLowerCase().includes(query.toLowerCase())
    );

    const toggle = (name) => {
        if (checked.includes(name)) {
            setChecked((prev) => prev.filter((n) => n !== name));
        } else if (checked.length < 4) {
            setChecked((prev) => [...prev, name]);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal-title">Члены комиссии</h3>

                <div className="search-wrapper">
                    {/*<svg viewBox="0 0 24 24" className="search-icon">*/}
                    {/*    <circle cx="11" cy="11" r="8" />*/}
                    {/*    <line x1="21" y1="21" x2="16.65" y2="16.65" />*/}
                    {/*</svg>*/}

                    <input
                        className="search-input"
                        placeholder="Поиск преподавателя"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                {/* LIST */}
                <div className="modal-list">
                    {filtered.map((t) => {
                        const active = checked.includes(t);
                        return (
                            <div
                                key={t}
                                className={`modal-item ${active ? "active" : ""}`}
                                onClick={() => toggle(t)}
                            >
                                <span>{t}</span>
                                {active && <span className="check">✓</span>}
                            </div>
                        );
                    })}
                </div>


                <div className="modal-actions">
                    <button className="btn-secondary" onClick={onClose}>
                        Отмена
                    </button>
                    <button
                        className="btn-primary"
                        disabled={checked.length !== 4}
                        onClick={() => onConfirm(checked)}
                    >
                        Утвердить
                    </button>
                </div>
            </div>
        </div>
    );
}
