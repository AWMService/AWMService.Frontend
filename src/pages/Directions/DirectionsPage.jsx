import React, { useState } from "react";
import "./DirectionsPage.css";
import DirectionCard from "../../components/Directions/DirectionCard/DirectionCard";
import DirectionModal from "../../components/Directions/DirectionModal/DirectionModal";

const initialDirections = [
    {
        id: 1,
        title: "Исследование методов криптографической защиты в блокчейн-системах",
        description: "Теоретическое исследование современных методов криптографической защиты данных в распределённых блокчейн-системах...",
        status: "Утверждено",
        type: "Дипломное исследование",
        supervisor: "Волков Дмитрий Сергеевич",
        specialization: "Кибербезопасность",
        submittedAt: "10.12.2024",
    },
    {
        id: 2,
        title: "Алгоритмы машинного обучения для анализа медицинских изображений",
        description: "Исследование и разработка алгоритмов машинного обучения для автоматического анализа медицинских изображений...",
        status: "На рассмотрении",
        type: "Дипломный проект",
        supervisor: "Петров Александр Владимирович",
        specialization: "Информационные системы",
        submittedAt: "15.12.2024",
    },
];

const DirectionsPage = () => {
    const [directions, setDirections] = useState(initialDirections);
    const [selectedDirection, setSelectedDirection] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("Все");


    const updateStatus = (id, newStatus) => {
        setDirections((prev) =>
            prev.map((dir) =>
                dir.id === id ? { ...dir, status: newStatus } : dir
            )
        );
        setSelectedDirection(null);
    };


    const getCount = (status) => {
        if (status === "Все") return directions.length;
        return directions.filter((dir) => dir.status === status).length;
    };


    const filteredDirections = directions.filter((dir) => {
        const matchesSearch = dir.title.toLowerCase().includes(searchQuery.toLowerCase());
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
                    <p className="no-results">Ничего не найдено.  </p>
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
