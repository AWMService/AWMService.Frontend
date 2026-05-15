import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    getIntlLocale,
    getLocalizedValue,
    normalizeLanguage,
    useApproveDirection,
    useAuth,
    useDirectionsByDepartment,
    useRejectDirection,
    useRequestDirectionRevision,
    useStaffByDepartment,
    useWorkTypes,
} from "@awm/shared";
import "./DirectionsAndThemes.css";
import DirectionCard from "../../components/Directions/DirectionCard/DirectionCard.jsx";
import DirectionModal from "../../components/Directions/DirectionModal/DirectionModal.jsx";
import ThemeModal from "../../components/Themes/ThemeModal/ThemeModal.jsx";

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
        status: "pending",
        type: "Дипломная работа",
        supervisor: "Иванов Иван Иванович",
        submittedAt: "01.09.2025",
        students: [
            { id: 1, fullName: "Серикова Айгерим Нурлановна", group: "SE-401" },
            { id: 2, fullName: "Ахметов Данияр Русланович", group: "SE-402" },
        ],
    },
];

const TABS = {
    DIRECTIONS: "directions",
    THEMES: "themes",
};

const formatDate = (value, locale) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString(locale);
};

const DirectionsAndThemes = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const currentLanguage = normalizeLanguage(i18n.language);
    const locale = getIntlLocale(i18n.language);

    const departmentId = user?.departmentId;
    const academicYearId = user?.currentAcademicYearId;

    const query = new URLSearchParams(location.search);
    const activeTab = query.get("tab") || TABS.DIRECTIONS;
    const isDirections = activeTab === TABS.DIRECTIONS;

    const { data: rawDirections = [], isLoading, error } = useDirectionsByDepartment(departmentId, academicYearId);
    const { data: staff = [] } = useStaffByDepartment(departmentId);
    const { data: workTypes = [] } = useWorkTypes();

    const approveMutation = useApproveDirection();
    const rejectMutation = useRejectDirection();
    const revisionMutation = useRequestDirectionRevision();

    const staffById = useMemo(() => new Map(staff.map((item) => [item.id, item])), [staff]);
    const workTypesById = useMemo(() => new Map(workTypes.map((item) => [item.id, item])), [workTypes]);

    const directions = useMemo(() => rawDirections.map((direction) => {
        const supervisor = staffById.get(direction.supervisorId);
        const workType = workTypesById.get(direction.workTypeId);

        return {
            ...direction,
            supervisor: supervisor?.fullName || supervisor?.email || `#${direction.supervisorId}`,
            type: workType?.name || `#${direction.workTypeId}`,
            submittedAt: formatDate(direction.submittedAt || direction.createdAt, locale),
            rejectionReason: direction.reviewComment,
        };
    }), [rawDirections, staffById, workTypesById, locale]);

    const [themes, setThemes] = useState(initialThemes);
    const [selectedDirection, setSelectedDirection] = useState(null);
    const [selectedTheme, setSelectedTheme] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const filterOptions = [
        { value: "all", label: t('common.all') },
        { value: "draft", label: t('status.draft') },
        { value: "pending", label: t('status.underReview') },
        { value: "approved", label: t('status.approved') },
        { value: "rejected", label: t('status.rejected') },
        { value: "revision", label: t('status.revision') },
    ];

    const changeTab = (tab) => {
        navigate(`?tab=${tab}`);
        setSearchQuery("");
        setFilterStatus("all");
        setSelectedDirection(null);
        setSelectedTheme(null);
    };

    const items = isDirections ? directions : themes;

    const getCount = (status) => {
        if (status === "all") return items.length;
        return items.filter((item) => item.status === status).length;
    };

    const filteredItems = items.filter((item) => {
        const title = getLocalizedValue(item.title, currentLanguage).toLowerCase();
        return title.includes(searchQuery.toLowerCase()) && (filterStatus === "all" || item.status === filterStatus);
    });

    const updateDirectionStatus = async (id, action, comment = "") => {
        if (action === "approved") {
            await approveMutation.mutateAsync(id);
        }
        if (action === "rejected") {
            await rejectMutation.mutateAsync({ id, comment });
        }
        if (action === "revision") {
            await revisionMutation.mutateAsync({ id, comment });
        }
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
                    {filterOptions.map(({ value, label }) => (
                        <button
                            key={value}
                            className={`filter-btn ${filterStatus === value ? "active" : ""}`}
                            onClick={() => setFilterStatus(value)}
                        >
                            {label} ({getCount(value)})
                        </button>
                    ))}
                </div>
            </div>

            {isDirections && (!departmentId || !academicYearId) && (
                <p className="no-results">{t('department.noDepartmentSelected', 'Department or Academic Year missing.')}</p>
            )}
            {isDirections && error && (
                <p className="no-results">{t('common.error')}: {error.message}</p>
            )}
            {isDirections && isLoading && (
                <p className="no-results">{t('common.loading')}...</p>
            )}

            <div className="projects-list">
                {!isLoading && filteredItems.length === 0 && (
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
                    isSaving={approveMutation.isPending || rejectMutation.isPending || revisionMutation.isPending}
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
