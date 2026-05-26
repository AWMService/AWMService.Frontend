import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    getIntlLocale,
    getLocalizedValue,
    normalizeLanguage,
    useApproveDirection,
    useApproveTopic,
    useAuth,
    useDeactivateTopic,
    useDirectionsByDepartment,
    useRejectDirection,
    useRequestDirectionRevision,
    useStaffByDepartment,
    useTopicCoordinationSummary,
    useWorkTypes,
} from "@awm/shared";
import "./DirectionsAndThemes.css";
import { DirectionCard, DirectionModal, ThemeModal } from "@awm/shared";

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

    const orgUnitId = user?.orgUnitId;
    const semesterId = user?.currentSemesterId;

    const query = new URLSearchParams(location.search);
    const activeTab = query.get("tab") || TABS.DIRECTIONS;
    const isDirections = activeTab === TABS.DIRECTIONS;

    const { data: rawDirections = [], isLoading: directionsLoading, error: directionsError } = useDirectionsByDepartment(orgUnitId, semesterId);
    const { data: coordinationSummary, isLoading: topicsLoading, error: topicsError } = useTopicCoordinationSummary(orgUnitId, semesterId);
    const { data: staff = [] } = useStaffByDepartment(orgUnitId);
    const { data: workTypes = [] } = useWorkTypes();

    const approveMutation = useApproveDirection();
    const rejectMutation = useRejectDirection();
    const revisionMutation = useRequestDirectionRevision();
    const approveTopicMutation = useApproveTopic();
    const deactivateTopicMutation = useDeactivateTopic();

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

    const themes = useMemo(() => (coordinationSummary?.topics || []).map((topic) => ({
        id: topic.topicId,
        title: topic.title,
        description: {
            ru: topic.lastRejectionReason || "",
            kk: topic.lastRejectionReason || "",
            en: topic.lastRejectionReason || "",
        },
        status: topic.isClosed ? "closed" : topic.isApproved ? "approved" : "pending",
        type: t('department.themeOfDiplomaWork'),
        supervisor: topic.supervisorName || `#${topic.supervisorId}`,
        submittedAt: "—",
        rejectionReason: topic.lastRejectionReason,
        acceptedCount: topic.acceptedCount,
        pendingCount: topic.pendingCount,
        maxParticipants: topic.maxParticipants,
    })), [coordinationSummary, t]);

    const [selectedDirection, setSelectedDirection] = useState(null);
    const [selectedTheme, setSelectedTheme] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const filterOptions = useMemo(() => {
        if (isDirections) {
            return [
                { value: "all", label: t('common.all') },
                { value: "pending", label: t('status.underReview') },
                { value: "approved", label: t('status.approved') },
                { value: "rejected", label: t('status.rejected') },
                { value: "revision", label: t('status.revision') },
            ];
        } else {
            return [
                { value: "all", label: t('common.all') },
                { value: "pending", label: t('status.underReview') },
                { value: "approved", label: t('status.approved') },
                { value: "closed", label: t('status.closed', t('student.occupied')) },
            ];
        }
    }, [isDirections, t]);

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

    const updateThemeStatus = async (id, newStatus) => {
        if (newStatus === "approved") {
            await approveTopicMutation.mutateAsync(id);
        }
        if (newStatus === "rejected") {
            await deactivateTopicMutation.mutateAsync(id);
        }
        setSelectedTheme(null);
    };

    const isLoading = isDirections ? directionsLoading : topicsLoading;
    const error = isDirections ? directionsError : topicsError;

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

            {isDirections && (!orgUnitId || !semesterId) && (
                <p className="no-results">{t('department.noDepartmentSelected', 'Department or Academic Year missing.')}</p>
            )}
            {error && (
                <p className="no-results">{t('common.error')}: {error.message}</p>
            )}
            {isLoading && (
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
                    isSaving={approveTopicMutation.isPending || deactivateTopicMutation.isPending}
                />
            )}
        </div>
    );
};

export default DirectionsAndThemes;



