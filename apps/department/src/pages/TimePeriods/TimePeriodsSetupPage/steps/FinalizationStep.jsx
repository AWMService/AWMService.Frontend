import React from "react";
import { useTranslation } from "react-i18next";
import { getIntlLocale } from "@awm/shared";

export default function FinalizationStep({
                                             commissions,
                                             freeStudents,
                                             totalStudents,
                                             onFinish
                                         }) {
    const { t, i18n } = useTranslation();
    const locale = getIntlLocale(i18n.language);
    const distributedStudents = commissions.reduce((sum, c) => {
        return (
            sum +
            c.sessions.reduce((sSum, s) => sSum + s.students.length, 0)
        );
    }, 0);

    return (
        <>
            <h3>{t('department.finalization')}</h3>

            <div className="final-summary">
                <div className="summary-card">
                    <span>{t('department.totalStudents')}</span>
                    <strong>{totalStudents}</strong>
                </div>

                <div className="summary-card success">
                    <span>{t('department.distributed')}</span>
                    <strong>{distributedStudents}</strong>
                </div>

                <div className="summary-card danger">
                    <span>{t('department.notDistributed')}</span>
                    <strong>{freeStudents.length}</strong>
                </div>
            </div>

            <div className="final-commissions">
                {commissions.map(c => (
                    <div key={c.id} className="final-commission">
                        <h4>{c.name}</h4>

                        {c.sessions.map(s => (
                            <div key={s.sessionId} className="final-session">
                                <div className="session-datetime">
                                    <span>
                                        {new Date(s.date).toLocaleDateString(locale, {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </span>
                                    <span> {s.time}</span>
                                </div>

                                <div className="session-students">
                                    {t('commission.studentsCount', { count: s.students.length })}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <button
                className="btn-primary"
                disabled={freeStudents.length > 0}
                onClick={onFinish}
            >
                {t('department.approvePeriod')}
            </button>

            {freeStudents.length > 0 && (
                <p className="final-warning">
                    {t('department.notAllDistributed')}
                </p>
            )}
        </>
    );
}
