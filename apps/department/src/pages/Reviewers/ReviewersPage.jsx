import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
    useReviewers, 
    useCreateReviewer, 
    useUpdateReviewer, 
    useDeleteReviewer 
} from "@awm/shared";
import "./ReviewersPage.css";
import plusIcon from "../../assets/icons/plus-icon.svg";

export default function ReviewersPage() {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReviewer, setEditingReviewer] = useState(null);

    // Form states
    const [fullName, setFullName] = useState("");
    const [position, setPosition] = useState("");
    const [academicDegree, setAcademicDegree] = useState("");
    const [organization, setOrganization] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const { data: reviewers = [], isLoading } = useReviewers(searchTerm);
    const createMutation = useCreateReviewer();
    const updateMutation = useUpdateReviewer();
    const deleteMutation = useDeleteReviewer();

    const handleOpenAddModal = () => {
        setEditingReviewer(null);
        setFullName("");
        setPosition("");
        setAcademicDegree("");
        setOrganization("");
        setEmail("");
        setPhone("");
        setErrorMsg("");
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (reviewer) => {
        setEditingReviewer(reviewer);
        setFullName(reviewer.fullName || "");
        setPosition(reviewer.position || "");
        setAcademicDegree(reviewer.academicDegree || "");
        setOrganization(reviewer.organization || "");
        setEmail(reviewer.email || "");
        setPhone(reviewer.phone || "");
        setErrorMsg("");
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        if (!fullName.trim()) {
            setErrorMsg("Full name is required");
            return;
        }

        const payload = {
            fullName: fullName.trim(),
            position: position.trim() || null,
            academicDegree: academicDegree.trim() || null,
            organization: organization.trim() || null,
            email: email.trim() || null,
            phone: phone.trim() || null
        };

        try {
            if (editingReviewer) {
                await updateMutation.mutateAsync({ id: editingReviewer.id, data: payload });
            } else {
                await createMutation.mutateAsync(payload);
            }
            setIsModalOpen(false);
        } catch (error) {
            setErrorMsg(error.response?.data?.detail || error.message || "Failed to save reviewer");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this reviewer?")) {
            try {
                await deleteMutation.mutateAsync(id);
            } catch (error) {
                console.error("Failed to delete reviewer", error);
            }
        }
    };

    return (
        <div className="reviewers-page">
            <div className="page-header">
                <div className="page-header-info">
                    <div>
                        <h1 className="page-title">{t("reviewer.reviewers", "Reviewers")}</h1>
                        <p className="page-subtitle">
                            {t("reviewer.reviewersSubtitle", "Manage external reviewers database and their contact information")}
                        </p>
                    </div>
                </div>
                <button 
                    className="button primary-button" 
                    onClick={handleOpenAddModal}
                >
                    <img src={plusIcon} alt="" className="button-icon" />
                    {t("reviewer.addReviewer", "Add Reviewer")}
                </button>
            </div>

            <div className="search-bar">
                <input 
                    type="text" 
                    placeholder={t("common.search", "Search by name or organization...")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {isLoading ? (
                <p className="loading-text">{t("common.loading", "Loading...")}</p>
            ) : (
                <div className="table-wrapper">
                    <table className="reviewers-table">
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>{t("common.fullName", "Full Name")}</th>
                                <th>{t("department.position", "Position / Degree")}</th>
                                <th>{t("reviewer.organization", "Organization")}</th>
                                <th>{t("common.contacts", "Contacts")}</th>
                                <th>{t("common.actions", "Actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviewers.map((reviewer, idx) => (
                                <tr key={reviewer.id}>
                                    <td>{idx + 1}</td>
                                    <td className="reviewer-name">{reviewer.fullName}</td>
                                    <td>
                                        <div>{reviewer.position || "—"}</div>
                                        {reviewer.academicDegree && (
                                            <small className="academic-degree-label">{reviewer.academicDegree}</small>
                                        )}
                                    </td>
                                    <td>{reviewer.organization || "—"}</td>
                                    <td>
                                        {reviewer.email && <div>{reviewer.email}</div>}
                                        {reviewer.phone && <div className="reviewer-phone">{reviewer.phone}</div>}
                                        {!reviewer.email && !reviewer.phone && "—"}
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button 
                                                className="action-btn edit-btn"
                                                onClick={() => handleOpenEditModal(reviewer)}
                                            >
                                                {t("common.edit", "Edit")}
                                            </button>
                                            <button 
                                                className="action-btn delete-btn"
                                                onClick={() => handleDelete(reviewer.id)}
                                            >
                                                {t("common.delete", "Delete")}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {reviewers.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: "center", color: "#9ca3af" }}>
                                        {t("reviewer.noReviewersFound", "No reviewers found.")}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="modal-title">
                            {editingReviewer ? t("reviewer.editReviewer", "Edit Reviewer") : t("reviewer.addReviewer", "Add Reviewer")}
                        </h3>
                        {errorMsg && <p className="error-message">{errorMsg}</p>}
                        
                        <form onSubmit={handleSave}>
                            <div className="form-field">
                                <label>{t("common.fullName", "Full Name")} *</label>
                                <input 
                                    type="text" 
                                    value={fullName} 
                                    onChange={(e) => setFullName(e.target.value)} 
                                    required 
                                />
                            </div>

                            <div className="form-grid">
                                <div className="form-field">
                                    <label>{t("department.position", "Position")}</label>
                                    <input 
                                        type="text" 
                                        value={position} 
                                        onChange={(e) => setPosition(e.target.value)} 
                                    />
                                </div>
                                <div className="form-field">
                                    <label>{t("reviewer.academicDegree", "Academic Degree")}</label>
                                    <input 
                                        type="text" 
                                        value={academicDegree} 
                                        onChange={(e) => setAcademicDegree(e.target.value)} 
                                    />
                                </div>
                            </div>

                            <div className="form-field">
                                <label>{t("reviewer.organization", "Organization")}</label>
                                <input 
                                    type="text" 
                                    value={organization} 
                                    onChange={(e) => setOrganization(e.target.value)} 
                                />
                            </div>

                            <div className="form-grid">
                                <div className="form-field">
                                    <label>Email</label>
                                    <input 
                                        type="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                    />
                                </div>
                                <div className="form-field">
                                    <label>{t("common.phone", "Phone")}</label>
                                    <input 
                                        type="text" 
                                        value={phone} 
                                        onChange={(e) => setPhone(e.target.value)} 
                                    />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button 
                                    type="button" 
                                    className="button secondary-button" 
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    {t("common.cancel", "Cancel")}
                                </button>
                                <button 
                                    type="submit" 
                                    className="button primary-button"
                                >
                                    {t("common.save", "Save")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
