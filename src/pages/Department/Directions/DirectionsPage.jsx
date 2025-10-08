import React, { useState } from "react";
import "./DirectionsPage.css";
import DirectionCard from "../../../components/Department/Directions/DirectionCard/DirectionCard.jsx";
import DirectionModal from "../../../components/Department/Directions/DirectionModal/DirectionModal.jsx";

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
        status: "Утверждено",
        type: "Дипломное исследование",
        supervisor: "Волков Дмитрий Сергеевич",
        submittedAt: "10.12.2024",
    },
    {
        id: 2,
        title: {
            ru: "Алгоритмы машинного обучения для анализа медицинских изображений",
            kz: "Медициналық кескіндерді талдау үшін машиналық оқыту алгоритмдері",
            en: "Machine Learning Algorithms for Medical Image Analysis",
        },
        description: {
            ru: "Исследование и разработка алгоритмов машинного обучения для автоматического анализа медицинских изображений...",
            kz: "Медициналық кескіндерді автоматты талдау үшін машиналық оқыту алгоритмдерін зерттеу және әзірлеу...",
            en: "Research and development of machine learning algorithms for automatic medical image analysis...",
        },
        status: "На рассмотрении",
        type: "Дипломный проект",
        supervisor: "Петров Александр Владимирович",
        submittedAt: "15.12.2024",
    },
];

const DirectionsPage = () => {
    const [directions, setDirections] = useState(initialDirections);
    const [selectedDirection, setSelectedDirection] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("Все");

    const updateStatus = (id, newStatus, rejectionReason = "") => {
        setDirections((prev) =>
            prev.map((dir) =>
                dir.id === id ? { ...dir, status: newStatus, rejectionReason } : dir
            )
        );
        setSelectedDirection(null);
    };

    const getCount = (status) => {
        if (status === "Все") return directions.length;
        return directions.filter((dir) => dir.status === status).length;
    };

    const filteredDirections = directions.filter((dir) => {
        const matchesSearch = dir.title.ru.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "Все" || dir.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="directions-page">
            <div className="directions-header">
                <h1 className="directions-title">Направления</h1>
                <p className="directions-subtitle">
                    Рассмотрение и утверждение направлений дипломных проектов и дипломных исследований
                </p>
            </div>

            <div className="directions-controls">
                <input
                    type="text"
                    placeholder="Поиск по направлениям..."
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

            <div className="directions-list">
                {filteredDirections.length > 0 ? (
                    filteredDirections.map((dir) => (
                        <DirectionCard key={dir.id} direction={dir} onView={setSelectedDirection} />
                    ))
                ) : (
                    <p className="no-results">Ничего не найдено.</p>
                )}
            </div>

            {selectedDirection && (
                <DirectionModal
                    direction={selectedDirection}
                    onClose={() => setSelectedDirection(null)}
                    onUpdateStatus={updateStatus}
                />
            )}
        </div>
    );
};

export default DirectionsPage;
