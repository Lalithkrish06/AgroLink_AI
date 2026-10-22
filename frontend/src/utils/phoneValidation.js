// Utility to validate Indian mobile numbers
// Accepts 10-digit mobile numbers or +91 followed by 10 digits

export const validateIndianPhone = (phoneInput) => {
  if (!phoneInput) return { valid: false, message: 'Please enter a valid 10-digit mobile number.' };

  // Remove spaces, hyphens, and parenthesis
  const cleaned = phoneInput.toString().replace(/[\s\-\(\)]/g, '');

  // Reject alphabets or special characters other than leading +
  if (/[^\d+]/.test(cleaned)) {
    return { valid: false, message: 'Please enter a valid 10-digit mobile number.' };
  }

  // Check pattern: either 10 digits starting with 6-9, or +91 followed by 10 digits starting with 6-9
  const pattern = /^(?:\+91)?[6-9]\d{9}$/;

  if (!pattern.test(cleaned)) {
    return { valid: false, message: 'Please enter a valid 10-digit mobile number.' };
  }

  // Format nicely for display e.g. +91 9876543210 or 9876543210
  let formatted = cleaned;
  if (!formatted.startsWith('+91') && formatted.length === 10) {
    formatted = '+91 ' + formatted;
  } else if (formatted.startsWith('+91') && formatted.length === 13) {
    formatted = '+91 ' + formatted.substring(3);
  }

  return { valid: true, formatted };
};
