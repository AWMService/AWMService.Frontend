import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./DirectionsAndThemes.css";
import DirectionCard from "../../../components/Department/Directions/DirectionCard/DirectionCard.jsx";
import DirectionModal from "../../../components/Department/Directions/DirectionModal/DirectionModal.jsx";
import ThemeModal from "../../../components/Department/Themes/ThemeModal/ThemeModal.jsx";



const initialDirections = [
    {
        id: 1,
        title: {
            ru: "Исследование методов криптографической защиты в блокчейн-системах",
            kz: "Блокчейн жүйелерінде криптографиялық қорғау әдістерін зерттеу",
            en: "Study of Cryptographic Protection Methods in Blockchain Systems",
        },
        description: {
            ru: "Теоретическое исследование современных методов криптографической защиты данных...",
            kz: "Деректерді қорғаудың заманауи криптографиялық әдістерін теориялық зерттеу...",
            en: "Theoretical study of modern methods of data cryptographic protection...",
        },
        status: "На рассмотрении",
        type: "Дипломное исследование",
        supervisor: "Волков Дмитрий Сергеевич",
        submittedAt: "10.12.2024",
    },
];

const initialThemes = [
    {
        id: 101,
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
        status: "На рассмотрении",
        type: "Дипломная работа",
        supervisor: "Иванов Иван Иванович",
        submittedAt: "01.09.2025",

        students: [
            {
                id: 1,
                fullName: "Серикова Айгерим Нурлановна",
                group: "SE-401",
            },
            {
              id: 2,
              fullName: "Ахметов Данияр Русланович",
              group: "SE-402",
            }
        ],
    },
];



const TABS = {
    DIRECTIONS: "directions",
    THEMES: "themes",
};



const DirectionsAndThemes = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const query = new URLSearchParams(location.search);
    const activeTab = query.get("tab") || TABS.DIRECTIONS;

    /* ===================== STATE ===================== */

    const [directions, setDirections] = useState(initialDirections);
    const [themes, setThemes] = useState(initialThemes);

    const [selectedDirection, setSelectedDirection] = useState(null);
    const [selectedTheme, setSelectedTheme] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("Все");


    const changeTab = (tab) => {
        navigate(`?tab=${tab}`);
        setSearchQuery("");
        setFilterStatus("Все");
        setSelectedDirection(null);
        setSelectedTheme(null);
    };

    const getCount = (items, status) => {
        if (status === "Все") return items.length;
        return items.filter((i) => i.status === status).length;
    };

    const filterItems = (items) =>
        items.filter(
            (i) =>
                i.title.ru.toLowerCase().includes(searchQuery.toLowerCase()) &&
                (filterStatus === "Все" || i.status === filterStatus)
        );



    const updateDirectionStatus = (id, newStatus, rejectionReason = "") => {
        setDirections((prev) =>
            prev.map((dir) =>
                dir.id === id
                    ? { ...dir, status: newStatus, rejectionReason }
                    : dir
            )
        );
        setSelectedDirection(null);
    };

    const updateThemeStatus = (id, newStatus, rejectionReason = "") => {
        setThemes((prev) =>
            prev.map((theme) =>
                theme.id === id
                    ? { ...theme, status: newStatus, rejectionReason }
                    : theme
            )
        );
        setSelectedTheme(null);
    };



    const isDirections = activeTab === TABS.DIRECTIONS;
    const items = isDirections ? directions : themes;
    const filteredItems = filterItems(items);

    return (
        <div className="projects-page">

            <div className="page-header-info">
                <div>
                    <h1 className="page-title">
                        {isDirections ? "Направления ДП/ДР" : "Темы ДП/ДР"}
                    </h1>

                    <p className="page-subtitle">
                        {isDirections
                            ? "Рассмотрение и утверждение направлений дипломных проектов и исследований"
                            : "Рассмотрение и утверждение тем дипломных проектов и исследований"}
                    </p>
                </div>

            </div>

            <div className="projects-tabs">
                <button
                    className={`tab-btn ${isDirections ? "active" : ""}`}
                    onClick={() => changeTab(TABS.DIRECTIONS)}
                >
                    Направления <span>{directions.length}</span>
                </button>

                <button
                    className={`tab-btn ${!isDirections ? "active" : ""}`}
                    onClick={() => changeTab(TABS.THEMES)}
                >
                    Темы <span>{themes.length}</span>
                </button>
            </div>


            <div className="projects-controls">
                <input
                    type="text"
                    className="search-input"
                    placeholder={
                        isDirections
                            ? "Поиск по направлениям..."
                            : "Поиск по темам..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <div className="filter-buttons">
                    {["Все", "На рассмотрении", "Утверждено", "Отклонено"].map(
                        (status) => (
                            <button
                                key={status}
                                className={`filter-btn ${
                                    filterStatus === status ? "active" : ""
                                }`}
                                onClick={() => setFilterStatus(status)}
                            >
                                {status} ({getCount(items, status)})
                            </button>
                        )
                    )}
                </div>
            </div>


            <div className="projects-list">
                {filteredItems.length === 0 && (
                    <p className="no-results">Ничего не найдено</p>
                )}

                {isDirections &&
                    filteredItems.map((dir) => (
                        <DirectionCard
                            key={dir.id}
                            direction={dir}
                            onView={setSelectedDirection}
                        />
                    ))}

                {!isDirections &&
                    filteredItems.map((theme) => (
                        <DirectionCard
                            key={theme.id}
                            direction={{
                                ...theme,
                                type: "Тема дипломной работы",
                            }}
                            onView={setSelectedTheme}
                        />
                    ))}
            </div>


            {selectedDirection && (
                <DirectionModal
                    direction={selectedDirection}
                    onClose={() => setSelectedDirection(null)}
                    onUpdateStatus={updateDirectionStatus}
                />
            )}

            {selectedTheme && (
                <ThemeModal
                    theme={selectedTheme}
                    onClose={() => setSelectedTheme(null)}
                    onUpdateStatus={updateThemeStatus}
                />
            )}
        </div>
    );
};

export default DirectionsAndThemes;
