import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { normalizeLanguage, getLocalizedValue } from "@awm/shared";
import "./DirectionsAndThemes.css";
import DirectionCard from "../../components/Directions/DirectionCard/DirectionCard.jsx";
import DirectionModal from "../../components/Directions/DirectionModal/DirectionModal.jsx";
import ThemeModal from "../../components/Themes/ThemeModal/ThemeModal.jsx";



const initialDirections = [
    {
        id: 1,
        title: {
            ru: "Исследование методов криптографической защиты в блокчейн-системах",
            kk: "Блокчейн жүйелерінде криптографиялық қорғау әдістерін зерттеу",
            en: "Study of Cryptographic Protection Methods in Blockchain Systems",
        },
        description: {
            ru: "Теоретическое исследование современных методов криптографической защиты данных...",
            kk: "Деректерді қорғаудың заманауи криптографиялық әдістерін теориялық зерттеу...",
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
            kk: "Жобаларды басқару үшін веб-қосымшаны әзірлеу",
            en: "Development of a Web Application for Project Management",
        },
        description: {
            ru: "Создание и внедрение веб-приложения с использованием React и Node.js...",
            kk: "React және Node.js пайдалана отырып веб-қосымшаны жасау және енгізу...",
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
    const { t, i18n } = useTranslation();
    const currentLanguage = normalizeLanguage(i18n.language);

    const query = new URLSearchParams(location.search);
    const activeTab = query.get("tab") || TABS.DIRECTIONS;

    /* ===================== STATE ===================== */

    const [directions, setDirections] = useState(initialDirections);
    const [themes, setThemes] = useState(initialThemes);

    const [selectedDirection, setSelectedDirection] = useState(null);
    const [selectedTheme, setSelectedTheme] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("Все");

    const filterOptions = [
        { value: "Все", label: t('common.all') },
        { value: "На рассмотрении", label: t('status.underReview') },
        { value: "Утверждено", label: t('status.approved') },
        { value: "Отклонено", label: t('status.rejected') },
    ];


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
                getLocalizedValue(i.title, currentLanguage).toLowerCase().includes(searchQuery.toLowerCase()) &&
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
                        {isDirections ? t('supervisor.directionsDP') : t('supervisor.themesDP')}
                    </h1>

                    <p className="page-subtitle">
                        {isDirections
                            ? t('department.directionsSubtitle')
                            : t('department.themesSubtitle')}
                    </p>
                </div>

            </div>

            <div className="projects-tabs">
                <button
                    className={`tab-btn ${isDirections ? "active" : ""}`}
                    onClick={() => changeTab(TABS.DIRECTIONS)}
                >
                    {t('department.directions')} <span>{directions.length}</span>
                </button>

                <button
                    className={`tab-btn ${!isDirections ? "active" : ""}`}
                    onClick={() => changeTab(TABS.THEMES)}
                >
                    {t('supervisor.topics')} <span>{themes.length}</span>
                </button>
            </div>


            <div className="projects-controls">
                <input
                    type="text"
                    className="search-input"
                    placeholder={
                        isDirections
                            ? t('department.searchDirections')
                            : t('department.searchThemes')
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <div className="filter-buttons">
                    {filterOptions.map(
                        ({ value, label }) => (
                            <button
                                key={value}
                                className={`filter-btn ${
                                    filterStatus === value ? "active" : ""
                                }`}
                                onClick={() => setFilterStatus(value)}
                            >
                                {label} ({getCount(items, value)})
                            </button>
                        )
                    )}
                </div>
            </div>


            <div className="projects-list">
                {filteredItems.length === 0 && (
                    <p className="no-results">{t('common.noResults')}</p>
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
                                type: t('department.themeOfDiplomaWork'),
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
