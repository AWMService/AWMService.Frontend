import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import MembersModal from "./MembersModal";
import "./CommissionCard.css";
const teachers = [
    "Доцент Сидоров П.П.",
    "Профессор Козлова М.М.",
    "Доцент Морозов В.В.",
    "Профессор Лебедева Н.Н.",
    "Доцент Иванова Е.Е.",
];
function SelectBox({ label, value, onChange, placeholder }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const ref = useRef(null);
    const filtered = teachers.filter((t) =>
        t.toLowerCase().includes(query.toLowerCase())
    );
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
                setQuery("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return (
        <div className="field" ref={ref}>
            <label>{label}</label>
            <div className={`select-box ${open ? "open" : ""}`}>
                <input
                    value={open ? query : value || ""}
                    placeholder={placeholder}
                    onFocus={() => setOpen(true)}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        onChange("");
                        setOpen(true);
                    }}
                />
                {value && (
                    <button
                        className="clear-btn"
                        type="button"
                        onClick={() => {
                            onChange("");
                            setQuery("");
                            setOpen(false);
                        }}
                    >
                        ✕
                    </button>
                )}
                {open && (
                    <div className="select-dropdown">
                        {filtered.map((t) => (
                            <div
                                key={t}
                                className="select-option"
                                onClick={() => {
                                    onChange(t);
                                    setQuery("");
                                    setOpen(false);
                                }}
                            >
                                {t}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
export default function CommissionCard({ commission, onChange, onRemove }) {
    const { t } = useTranslation();
    const [membersOpen, setMembersOpen] = useState(false);
    return (
        <div className="commission-card">
            <div className="commission-header">
                <input
                    className="commission-name"
                    value={commission.name}
                    onChange={(e) =>
                        onChange({ ...commission, name: e.target.value })
                    }
                />
                {onRemove && (
                    <button
                        className="icon-button danger"
                        title={t('department.deleteCommission')}
                        onClick={() => onRemove(commission.id)}
                    >
                        <svg viewBox="0 0 24 24">
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                        </svg>
                    </button>
                )}
            </div>
            <SelectBox
                label={t('commission.chairman')}
                value={commission.chairman}
                placeholder={t('department.selectTeacher')}
                onChange={(value) =>
                    onChange({ ...commission, chairman: value })
                }
            />
            <SelectBox
                label={t('department.technicalSecretary')}
                value={commission.secretary}
                placeholder={t('department.selectTeacher')}
                onChange={(value) =>
                    onChange({ ...commission, secretary: value })
                }
            />
            <div className="members-row">
                <span>{t('commission.members')}</span>
                <button
                    className="btn-link"
                    onClick={() => setMembersOpen(true)}
                >
                    {t('common.select')}
                </button>
            </div>
            {commission.members.length > 0 && (
                <div className="members-chips">
                    {commission.members.map((m) => (
                        <span key={m} className="chip">
                            {m}
                        </span>
                    ))}
                </div>
            )}
            <MembersModal
                isOpen={membersOpen}
                selected={commission.members}
                onClose={() => setMembersOpen(false)}
                onConfirm={(members) => {
                    onChange({ ...commission, members });
                    setMembersOpen(false);
                }}
            />
        </div>
    );
}