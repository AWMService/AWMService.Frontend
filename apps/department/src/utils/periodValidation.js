export function validateDateRange(startDate, endDate) {
    if (!startDate || !endDate) return { valid: false, error: 'emptyDates' };
    if (new Date(startDate) > new Date(endDate)) return { valid: false, error: 'startAfterEnd' };
    return { valid: true };
}

export function validatePeriodsOrder(directions, topics, selection) {
    if (new Date(directions.endDate) > new Date(topics.startDate)) {
        return { valid: false, error: 'directionsOverlapTopics' };
    }
    if (new Date(topics.endDate) > new Date(selection.startDate)) {
        return { valid: false, error: 'topicsOverlapSelection' };
    }
    return { valid: true };
}

export function validateAllPeriods(periods) {
    for (const period of periods) {
        const result = validateDateRange(period.startDate, period.endDate);
        if (!result.valid) return { valid: false, error: result.error, period: period.key };
    }
    const [directions, topics, selection] = periods;
    return validatePeriodsOrder(directions, topics, selection);
}
