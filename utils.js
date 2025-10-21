// Utility Functions Module

// DOM Utilities
const DOM = {
    // Element selection
    select: (selector, context = document) => context.querySelector(selector),
    selectAll: (selector, context = document) => context.querySelectorAll(selector),
    
    // Element creation
    create: (tag, attributes = {}, content = '') => {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else if (key.startsWith('on') && typeof value === 'function') {
                element.addEventListener(key.slice(2).toLowerCase(), value);
            } else {
                element.setAttribute(key, value);
            }
        });
        
        if (content) {
            element.innerHTML = content;
        }
        
        return element;
    },
    
    // Element manipulation
    addClass: (element, className) => {
        if (element) element.classList.add(className);
    },
    
    removeClass: (element, className) => {
        if (element) element.classList.remove(className);
    },
    
    toggleClass: (element, className) => {
        if (element) element.classList.toggle(className);
    },
    
    hasClass: (element, className) => {
        return element ? element.classList.contains(className) : false;
    },
    
    // Element visibility
    show: (element) => {
        if (element) element.style.display = '';
    },
    
    hide: (element) => {
        if (element) element.style.display = 'none';
    },
    
    toggle: (element) => {
        if (element) {
            element.style.display = element.style.display === 'none' ? '' : 'none';
        }
    },
    
    // Element positioning
    getOffset: (element) => {
        if (!element) return { top: 0, left: 0 };
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.pageYOffset,
            left: rect.left + window.pageXOffset
        };
    },
    
    // Element dimensions
    getSize: (element) => {
        if (!element) return { width: 0, height: 0 };
        return {
            width: element.offsetWidth,
            height: element.offsetHeight
        };
    },
    
    // Scroll utilities
    scrollTo: (element, options = {}) => {
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                ...options
            });
        }
    },
    
    // Event delegation
    delegate: (parent, selector, event, handler) => {
        parent.addEventListener(event, (e) => {
            if (e.target.matches(selector)) {
                handler(e);
            }
        });
    }
};

// String Utilities
const StringUtils = {
    // Capitalize first letter
    capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
    
    // Convert to title case
    titleCase: (str) => {
        return str.replace(/\w\S*/g, (txt) => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    },
    
    // Convert to camelCase
    camelCase: (str) => {
        return str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
    },
    
    // Convert to kebab-case
    kebabCase: (str) => {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    },
    
    // Truncate string
    truncate: (str, length, suffix = '...') => {
        if (str.length <= length) return str;
        return str.substring(0, length) + suffix;
    },
    
    // Remove HTML tags
    stripHtml: (str) => {
        const div = document.createElement('div');
        div.innerHTML = str;
        return div.textContent || div.innerText || '';
    },
    
    // Escape HTML
    escapeHtml: (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },
    
    // Generate random string
    random: (length = 8) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },
    
    // Slugify string
    slugify: (str) => {
        return str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
};

// Number Utilities
const NumberUtils = {
    // Format number with commas
    format: (num, locale = 'en-US') => {
        return new Intl.NumberFormat(locale).format(num);
    },
    
    // Format currency
    currency: (amount, currency = 'RWF', locale = 'en-RW') => {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
        }).format(amount);
    },
    
    // Format percentage
    percentage: (num, decimals = 1) => {
        return (num * 100).toFixed(decimals) + '%';
    },
    
    // Clamp number between min and max
    clamp: (num, min, max) => Math.min(Math.max(num, min), max),
    
    // Generate random number
    random: (min = 0, max = 1) => Math.random() * (max - min) + min,
    
    // Generate random integer
    randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    
    // Round to decimal places
    round: (num, decimals = 2) => Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals),
    
    // Check if number is in range
    inRange: (num, min, max) => num >= min && num <= max,
    
    // Convert bytes to human readable format
    formatBytes: (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
    }
};

// Date Utilities
const DateUtils = {
    // Format date
    format: (date, options = {}) => {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(date);
    },
    
    // Get relative time
    relative: (date) => {
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);
        
        if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
        if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
        if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    },
    
    // Add days to date
    addDays: (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },
    
    // Check if date is today
    isToday: (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    },
    
    // Check if date is this week
    isThisWeek: (date) => {
        const now = new Date();
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));
        return date >= weekStart && date <= weekEnd;
    },
    
    // Get start of day
    startOfDay: (date) => {
        const result = new Date(date);
        result.setHours(0, 0, 0, 0);
        return result;
    },
    
    // Get end of day
    endOfDay: (date) => {
        const result = new Date(date);
        result.setHours(23, 59, 59, 999);
        return result;
    }
};

// Array Utilities
const ArrayUtils = {
    // Remove duplicates
    unique: (arr) => [...new Set(arr)],
    
    // Shuffle array
    shuffle: (arr) => {
        const result = [...arr];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    },
    
    // Group array by key
    groupBy: (arr, key) => {
        return arr.reduce((groups, item) => {
            const group = item[key];
            groups[group] = groups[group] || [];
            groups[group].push(item);
            return groups;
        }, {});
    },
    
    // Sort array by key
    sortBy: (arr, key, direction = 'asc') => {
        return [...arr].sort((a, b) => {
            const aVal = a[key];
            const bVal = b[key];
            if (direction === 'desc') {
                return bVal > aVal ? 1 : -1;
            }
            return aVal > bVal ? 1 : -1;
        });
    },
    
    // Chunk array into smaller arrays
    chunk: (arr, size) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    },
    
    // Get random item from array
    random: (arr) => arr[Math.floor(Math.random() * arr.length)],
    
    // Get multiple random items
    sample: (arr, count) => {
        const shuffled = ArrayUtils.shuffle(arr);
        return shuffled.slice(0, count);
    },
    
    // Find item by property
    findBy: (arr, key, value) => arr.find(item => item[key] === value),
    
    // Filter by property
    filterBy: (arr, key, value) => arr.filter(item => item[key] === value),
    
    // Pluck property values
    pluck: (arr, key) => arr.map(item => item[key])
};

// Object Utilities
const ObjectUtils = {
    // Deep clone object
    clone: (obj) => {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => ObjectUtils.clone(item));
        if (typeof obj === 'object') {
            const cloned = {};
            Object.keys(obj).forEach(key => {
                cloned[key] = ObjectUtils.clone(obj[key]);
            });
            return cloned;
        }
    },
    
    // Merge objects deeply
    merge: (target, ...sources) => {
        if (!sources.length) return target;
        const source = sources.shift();
        
        if (ObjectUtils.isObject(target) && ObjectUtils.isObject(source)) {
            for (const key in source) {
                if (ObjectUtils.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    ObjectUtils.merge(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
        
        return ObjectUtils.merge(target, ...sources);
    },
    
    // Check if value is object
    isObject: (item) => item && typeof item === 'object' && !Array.isArray(item),
    
    // Get nested property
    get: (obj, path, defaultValue = undefined) => {
        const keys = path.split('.');
        let result = obj;
        
        for (const key of keys) {
            if (result === null || result === undefined) {
                return defaultValue;
            }
            result = result[key];
        }
        
        return result !== undefined ? result : defaultValue;
    },
    
    // Set nested property
    set: (obj, path, value) => {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let current = obj;
        
        for (const key of keys) {
            if (!(key in current) || !ObjectUtils.isObject(current[key])) {
                current[key] = {};
            }
            current = current[key];
        }
        
        current[lastKey] = value;
        return obj;
    },
    
    // Pick properties
    pick: (obj, keys) => {
        const result = {};
        keys.forEach(key => {
            if (key in obj) {
                result[key] = obj[key];
            }
        });
        return result;
    },
    
    // Omit properties
    omit: (obj, keys) => {
        const result = { ...obj };
        keys.forEach(key => {
            delete result[key];
        });
        return result;
    },
    
    // Check if object is empty
    isEmpty: (obj) => Object.keys(obj).length === 0,
    
    // Get object keys safely
    keys: (obj) => obj ? Object.keys(obj) : [],
    
    // Get object values safely
    values: (obj) => obj ? Object.values(obj) : []
};

// URL Utilities
const URLUtils = {
    // Get query parameters
    getParams: (url = window.location.href) => {
        const params = new URLSearchParams(new URL(url).search);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    },
    
    // Set query parameter
    setParam: (key, value, url = window.location.href) => {
        const urlObj = new URL(url);
        urlObj.searchParams.set(key, value);
        return urlObj.toString();
    },
    
    // Remove query parameter
    removeParam: (key, url = window.location.href) => {
        const urlObj = new URL(url);
        urlObj.searchParams.delete(key);
        return urlObj.toString();
    },
    
    // Build URL with parameters
    build: (base, params = {}) => {
        const url = new URL(base);
        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                url.searchParams.set(key, value);
            }
        });
        return url.toString();
    },
    
    // Check if URL is valid
    isValid: (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },
    
    // Get domain from URL
    getDomain: (url) => {
        try {
            return new URL(url).hostname;
        } catch {
            return '';
        }
    }
};

// Validation Utilities
const ValidationUtils = {
    // Email validation
    email: (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },
    
    // Phone validation (basic)
    phone: (phone) => {
        const regex = /^[\+]?[1-9][\d]{0,15}$/;
        return regex.test(phone.replace(/\s/g, ''));
    },
    
    // Password strength
    passwordStrength: (password) => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        const levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        return {
            score,
            level: levels[score] || 'Very Weak',
            isValid: score >= 3
        };
    },
    
    // Required field
    required: (value) => {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    },
    
    // Minimum length
    minLength: (value, min) => {
        return value && value.toString().length >= min;
    },
    
    // Maximum length
    maxLength: (value, max) => {
        return !value || value.toString().length <= max;
    },
    
    // Number range
    range: (value, min, max) => {
        const num = parseFloat(value);
        return !isNaN(num) && num >= min && num <= max;
    },
    
    // URL validation
    url: (url) => URLUtils.isValid(url)
};

// Performance Utilities
const PerformanceUtils = {
    // Debounce function
    debounce: (func, wait, immediate = false) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },
    
    // Throttle function
    throttle: (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Measure execution time
    measure: (func, label = 'Function') => {
        return function(...args) {
            const start = performance.now();
            const result = func.apply(this, args);
            const end = performance.now();
            console.log(`${label} took ${end - start} milliseconds`);
            return result;
        };
    },
    
    // Lazy load function
    lazy: (func) => {
        let cached = false;
        let result;
        return function(...args) {
            if (!cached) {
                result = func.apply(this, args);
                cached = true;
            }
            return result;
        };
    },
    
    // Request animation frame wrapper
    raf: (callback) => {
        return requestAnimationFrame(callback);
    },
    
    // Cancel animation frame
    cancelRaf: (id) => {
        cancelAnimationFrame(id);
    }
};

// Export utilities
window.Utils = {
    DOM,
    String: StringUtils,
    Number: NumberUtils,
    Date: DateUtils,
    Array: ArrayUtils,
    Object: ObjectUtils,
    URL: URLUtils,
    Validation: ValidationUtils,
    Performance: PerformanceUtils
};
