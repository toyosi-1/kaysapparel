/**
 * Comprehensive Form Validation System
 * Provides security-focused validation for KaysApparel e-commerce platform
 */

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  sanitizedData?: any;
}

// Rate limiting for security
const rateLimiter = new Map<string, { count: number; lastAttempt: number }>();

/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .slice(0, 1000); // Limit length
};

/**
 * Validate Nigerian phone number format
 * Accepts: +2348012345678, 08012345678, 09012345678, 07012345678
 */
export const validateNigerianPhone = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') return false;
  
  const cleanPhone = phone.replace(/\s/g, '');
  const nigerianPhoneRegex = /^(?:\+234|0)[789][01]\d{8}$/;
  return nigerianPhoneRegex.test(cleanPhone);
};

/**
 * Validate name (letters, spaces, hyphens, apostrophes only)
 */
export const validateName = (name: string): boolean => {
  if (!name || typeof name !== 'string') return false;
  
  const nameRegex = /^[a-zA-Z\s'-]{2,50}$/;
  return nameRegex.test(name.trim());
};

/**
 * Validate email format with stricter rules
 */
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim().toLowerCase());
};

/**
 * Validate address (basic validation)
 */
export const validateAddress = (address: string): boolean => {
  if (!address || typeof address !== 'string') return false;
  
  const trimmed = address.trim();
  return trimmed.length >= 10 && trimmed.length <= 200;
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }
  
  if (!/[a-zA-Z]/.test(password)) {
    errors.push('Password must contain at least one letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Rate limiting to prevent brute force attacks
 */
export const checkRateLimit = (
  identifier: string, 
  maxAttempts: number = 5, 
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean => {
  const now = Date.now();
  const record = rateLimiter.get(identifier);
  
  if (!record || now - record.lastAttempt > windowMs) {
    rateLimiter.set(identifier, { count: 1, lastAttempt: now });
    return true;
  }
  
  if (record.count >= maxAttempts) {
    return false; // Block the attempt
  }
  
  record.count++;
  return true;
};

/**
 * Validate customer registration data
 */
export const validateCustomerRegistration = (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};
  
  // Sanitize all inputs
  const sanitized = {
    firstName: sanitizeInput(data.firstName),
    lastName: sanitizeInput(data.lastName),
    email: sanitizeInput(data.email).toLowerCase(),
    phone: sanitizeInput(data.phone),
    password: data.password, // Don't sanitize password
    confirmPassword: data.confirmPassword
  };
  
  // Validate first name
  if (!sanitized.firstName) {
    errors.firstName = 'First name is required';
  } else if (!validateName(sanitized.firstName)) {
    errors.firstName = 'First name must contain only letters, spaces, hyphens, or apostrophes (2-50 characters)';
  }
  
  // Validate last name
  if (!sanitized.lastName) {
    errors.lastName = 'Last name is required';
  } else if (!validateName(sanitized.lastName)) {
    errors.lastName = 'Last name must contain only letters, spaces, hyphens, or apostrophes (2-50 characters)';
  }
  
  // Validate email
  if (!sanitized.email) {
    errors.email = 'Email address is required';
  } else if (!validateEmail(sanitized.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Validate phone
  if (!sanitized.phone) {
    errors.phone = 'Phone number is required';
  } else if (!validateNigerianPhone(sanitized.phone)) {
    errors.phone = 'Please enter a valid Nigerian phone number (e.g., 08012345678 or +2348012345678)';
  }
  
  // Validate password
  const passwordValidation = validatePassword(sanitized.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors[0];
  }
  
  // Validate password confirmation
  if (sanitized.password !== sanitized.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData: sanitized
  };
};

/**
 * Validate login data
 */
export const validateLogin = (data: {
  email: string;
  password: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};
  
  // Sanitize inputs
  const sanitized = {
    email: sanitizeInput(data.email).toLowerCase(),
    password: data.password // Don't sanitize password
  };
  
  // Validate email
  if (!sanitized.email) {
    errors.email = 'Email address is required';
  } else if (!validateEmail(sanitized.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Validate password
  if (!sanitized.password) {
    errors.password = 'Password is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData: sanitized
  };
};

/**
 * Validate checkout/order data
 */
export const validateOrderData = (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};
  
  // Sanitize all inputs
  const sanitized = {
    firstName: sanitizeInput(data.firstName),
    lastName: sanitizeInput(data.lastName),
    email: sanitizeInput(data.email).toLowerCase(),
    phone: sanitizeInput(data.phone),
    address: sanitizeInput(data.address)
  };
  
  // Validate first name
  if (!sanitized.firstName) {
    errors.firstName = 'First name is required';
  } else if (!validateName(sanitized.firstName)) {
    errors.firstName = 'First name must contain only letters, spaces, hyphens, or apostrophes (2-50 characters)';
  }
  
  // Validate last name
  if (!sanitized.lastName) {
    errors.lastName = 'Last name is required';
  } else if (!validateName(sanitized.lastName)) {
    errors.lastName = 'Last name must contain only letters, spaces, hyphens, or apostrophes (2-50 characters)';
  }
  
  // Validate email
  if (!sanitized.email) {
    errors.email = 'Email address is required';
  } else if (!validateEmail(sanitized.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Validate phone
  if (!sanitized.phone) {
    errors.phone = 'Phone number is required';
  } else if (!validateNigerianPhone(sanitized.phone)) {
    errors.phone = 'Please enter a valid Nigerian phone number (e.g., 08012345678 or +2348012345678)';
  }
  
  // Validate address
  if (!sanitized.address) {
    errors.address = 'Delivery address is required';
  } else if (!validateAddress(sanitized.address)) {
    errors.address = 'Address must be between 10 and 200 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData: sanitized
  };
};

/**
 * Validate profile update data
 */
export const validateProfileUpdate = (data: {
  firstName: string;
  lastName: string;
  phone: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};
  
  // Sanitize inputs
  const sanitized = {
    firstName: sanitizeInput(data.firstName),
    lastName: sanitizeInput(data.lastName),
    phone: sanitizeInput(data.phone)
  };
  
  // Validate first name
  if (!sanitized.firstName) {
    errors.firstName = 'First name is required';
  } else if (!validateName(sanitized.firstName)) {
    errors.firstName = 'First name must contain only letters, spaces, hyphens, or apostrophes (2-50 characters)';
  }
  
  // Validate last name
  if (!sanitized.lastName) {
    errors.lastName = 'Last name is required';
  } else if (!validateName(sanitized.lastName)) {
    errors.lastName = 'Last name must contain only letters, spaces, hyphens, or apostrophes (2-50 characters)';
  }
  
  // Validate phone
  if (!sanitized.phone) {
    errors.phone = 'Phone number is required';
  } else if (!validateNigerianPhone(sanitized.phone)) {
    errors.phone = 'Please enter a valid Nigerian phone number (e.g., 08012345678 or +2348012345678)';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData: sanitized
  };
};

/**
 * Get rate limit status for a user
 */
export const getRateLimitStatus = (identifier: string): {
  blocked: boolean;
  remainingAttempts: number;
  resetTime: Date | null;
} => {
  const record = rateLimiter.get(identifier);
  const maxAttempts = 5;
  const windowMs = 15 * 60 * 1000; // 15 minutes
  
  if (!record || Date.now() - record.lastAttempt > windowMs) {
    return {
      blocked: false,
      remainingAttempts: maxAttempts,
      resetTime: null
    };
  }
  
  const blocked = record.count >= maxAttempts;
  const remainingAttempts = Math.max(0, maxAttempts - record.count);
  const resetTime = blocked ? new Date(record.lastAttempt + windowMs) : null;
  
  return {
    blocked,
    remainingAttempts,
    resetTime
  };
};
