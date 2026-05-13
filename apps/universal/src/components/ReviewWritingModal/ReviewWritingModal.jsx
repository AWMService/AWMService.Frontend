import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getLocalizedValue } from '@awm/shared';
import './ReviewWritingModal.css';

export default function ReviewWritingModal({ isOpen, work, onClose, onSubmit }) {
    const { t } = useTranslation();
    const [reviewText, setReviewText] = useState('');
    const [file, setFile] = useState(null);
    const [comment, setComment] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        setShowConfirm(true);
    };

    const confirmSubmit = () => {
        onSubmit({
            workId: work?.id,
            reviewText,
            fileName: file?.name || null,
            comment,
            date: new Date().toISOString().split('T')[0]
        });
        setReviewText('');
        setFile(null);
        setComment('');
        setShowConfirm(false);
    };

    const isValid = reviewText.trim().length > 0 || file;
    const workTitle = getLocalizedValue(work?.themeTitle || work?.title);
    const studentName = getLocalizedValue(work?.studentName || work?.student);

    return (
        <div className="review-modal-backdrop" onClick={onClose}>
            <div className="review-modal" onClick={(e) => e.stopPropagation()}>
                {showConfirm ? (
                    <>
                        <h2 className="review-modal__title">{t('reviewer.confirmSubmitReview')}</h2>
                        <p className="review-modal__message">{t('reviewer.confirmSubmitMessage')}</p>
                        {work && <p className="review-modal__work-info">{workTitle} — {studentName}</p>}
                        <div className="review-modal__actions">
                            <button className="button secondary-button" onClick={() => setShowConfirm(false)}>{t('common.cancel')}</button>
                            <button className="button primary-button" onClick={confirmSubmit}>{t('common.confirm')}</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="review-modal__title">{t('reviewer.writeReview')}</h2>
                        {work && <p className="review-modal__work-info">{workTitle} — {studentName}</p>}

                        <div className="review-modal__field">
                            <label>{t('reviewer.reviewText')}</label>
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder={t('reviewer.reviewTextPlaceholder')}
                                rows={6}
                            />
                        </div>

                        <div className="review-modal__field">
                            <label>{t('reviewer.uploadReviewFile')}</label>
                            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                            {file && <span className="review-modal__filename">{file.name}</span>}
                        </div>

                        <div className="review-modal__field">
                            <label>{t('reviewer.additionalComment')}</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder={t('reviewer.commentPlaceholder')}
                                rows={3}
                            />
                        </div>

                        <div className="review-modal__actions">
                            <button className="button secondary-button" onClick={onClose}>{t('common.cancel')}</button>
                            <button className="button primary-button" disabled={!isValid} onClick={handleSubmit}>{t('reviewer.submitReview')}</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
