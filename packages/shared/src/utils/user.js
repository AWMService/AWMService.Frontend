/**
 * Extracts initials from a user's full name.
 * e.g., "Сергеев Николай Сергеевич" -> "СН"
 * @param {string} fullName 
 * @returns {string}
 */
export function getInitials(fullName) {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0] ? parts[0][0].toUpperCase() : '';
}
