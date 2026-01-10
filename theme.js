// Minimal Theme Manager - Enforces Dark Mode
// Legacy 'theme.js' kept for compatibility if scripts reference it, but simplified.

class UniversalThemeManager {
    constructor() {
        this.init();
    }

    init() {
        // Always enforce dark mode
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');

        // Remove any legacy toggle buttons if they exist
        const toggles = document.querySelectorAll('.theme-toggle, .universal-theme-toggle');
        toggles.forEach(t => t.remove());
    }
}

// Auto-initialize
if (typeof module === 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        window.themeManager = new UniversalThemeManager();
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = UniversalThemeManager;
}