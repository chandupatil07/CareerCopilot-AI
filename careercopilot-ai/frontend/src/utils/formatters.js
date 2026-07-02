/**
 * File Explanation: formatters.js
 * 
 * Helper formatting utilities for dates, scores, and percentages, keeping code clean.
 */

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  } catch (e) {
    return dateString;
  }
};

export const formatPercentage = (value) => {
  if (value === undefined || value === null) return '0%';
  return `${value}%`;
};

export const formatScore = (score) => {
  if (score === undefined || score === null) return '0/100';
  return `${score}/100`;
};
