import React, { useState } from "react";
import "./ThemesPage.css";
import ThemeCard from "../../../components/Department/Themes/ThemeCard/ThemeCard.jsx";
import ThemeModal from "../../../components/Department/Themes/ThemeModal/ThemeModal.jsx";

const initialThemes = [
    {
        id: 1,
        title: {
            ru: "Разработка веб-приложения для управления проектами",
            kz: "Жобаларды басқару үшін веб-қосымшаны әзірлеу",
            en: "Development of a Web Application for Project Management",
        },
        description: {
            ru: "Создание и внедрение веб-приложения с использованием React и Node.js...",
            kz: "React және Node.js пайдалана отырып веб-қосымшаны жасау және енгізу...",
            en: "Creating and implementing a web application using React and Node.js...",
        },
        status: "Утверждено",
        supervisor: "Иванов Иван Иванович",
        submittedAt: "01.09.2025",
    },
    {
        id: 2,
        title: {
            ru: "Анализ данных IoT-устройств с помощью машинного обучения",
            kz: "IoT құрылғыларының деректерін машиналық оқыту арқылы талдау",
            en: "IoT Devices Data Analysis Using Machine Learning",
        },
        description: {
            ru: "Разработка модели машинного обучения для анализа больших данных с IoT-устройств...",
            kz: "IoT құрылғыларынан үлкен деректерді талдау үшін машиналық оқыту моделін әзірлеу...",
            en: "Developing a machine learning model to analyze big data from IoT devices...",
        },
        status: "На рассмотрении",
        supervisor: "Петров Петр Петрович",
        submittedAt: "10.09.2025",
    },
];

const ThemesPage = () => {
    const [themes, setThemes] = useState(initialThemes);
    const [selectedTheme, setSelectedTheme] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("Все");

    const updateStatus = (id, newStatus, rejectionReason = "") => {
        setThemes((prev) =>
            prev.map((theme) =>
                theme.id === id ? { ...theme, status: newStatus, rejectionReason } : theme
            )
        );
        setSelectedTheme(null);
    };

    const getCount = (status) => {
        if (status === "Все") return themes.length;
        return themes.filter((theme) => theme.status === status).length;
    };

    const filteredThemes = themes.filter((theme) => {
        const matchesSearch = theme.title.ru.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "Все" || theme.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="themes-page">
            <div className="themes-header">
                <h1 className="themes-title">Темы</h1>
                <p className="themes-subtitle">
                    Рассмотрение и утверждение тем дипломных проектов и исследований
                </p>
            </div>

            <div className="themes-controls">
                <input
                    type="text"
                    placeholder="Поиск по темам..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />

                <div className="filter-buttons">
                    {["Все", "На рассмотрении", "Утверждено", "Отклонено"].map((status) => (
                        <button
                            key={status}
                            className={`filter-btn ${filterStatus === status ? "active" : ""}`}
                            onClick={() => setFilterStatus(status)}
                        >
                            {status} ({getCount(status)})
                        </button>
                    ))}
                </div>
            </div>

            <div className="themes-list">
                {filteredThemes.length > 0 ? (
                    filteredThemes.map((theme) => (
                        <ThemeCard
                            key={theme.id}
                            theme={theme}
                            onView={setSelectedTheme}
                        />
                    ))
                ) : (
                    <p className="no-results">Ничего не найдено.</p>
                )}
            </div>

            {selectedTheme && (
                <ThemeModal
                    theme={selectedTheme}
                    onClose={() => setSelectedTheme(null)}
                    onUpdateStatus={updateStatus}
                />
            )}
        </div>
    );
};

export default ThemesPage;
