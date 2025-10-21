export const designSystem = {
    colors: {
        primary: {
            50: '#f0f9f8',
            100: '#daf2f0',
            200: '#b8e6e2',
            300: '#88d4ce',
            400: '#50b9b4',
            500: '#317873', // Cor principal
            600: '#2a6662',
            700: '#255350',
            800: '#214443',
            900: '#1f3a39',
        },
        secondary: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#a0d6b4', // Verde secundário
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
        },
        accent: {
            50: '#fdf4ff',
            100: '#fae8ff',
            200: '#f5d0fe',
            300: '#f0abfc',
            400: '#e879f9',
            500: '#49796b', // Acento terciário
            600: '#c026d3',
            700: '#a21caf',
            800: '#86198f',
            900: '#701a75',
        },
        neutral: {
            50: '#fafafa',
            100: '#f4f4f5',
            200: '#e4e4e7',
            300: '#d4d4d8',
            400: '#a1a1aa',
            500: '#71717a',
            600: '#52525b',
            700: '#3f3f46',
            800: '#27272a',
            900: '#18181b',
        }
    },

    gradients: {
        primary: 'linear-gradient(135deg, #317873 0%, #49796b 50%, #a0d6b4 100%)',
        secondary: 'linear-gradient(135deg, #317873 0%, #a0d6b4 100%)',
        accent: 'linear-gradient(135deg, #49796b 0%, #a0d6b4 100%)',
        card: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%)',
        overlay: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
    },

    animations: {
        // 🌀 Easing Functions compatíveis com Framer Motion
        gentle: [0.4, 0, 0.2, 1],       // ease-in-out padrão
        bounce: [0.34, 1.56, 0.64, 1],  // bounce mais elástico
        smooth: [0.16, 1, 0.3, 1],      // suavização moderna
        expressive: [0.65, 0, 0.35, 1], // animação expressiva
    },

    shadows: {
        sm: '0 2px 8px rgba(49, 120, 115, 0.08)',
        md: '0 4px 20px rgba(49, 120, 115, 0.12)',
        lg: '0 8px 40px rgba(49, 120, 115, 0.16)',
        xl: '0 16px 60px rgba(49, 120, 115, 0.20)',
        inner: 'inset 0 2px 4px rgba(49, 120, 115, 0.06)',
    },

    typography: {
        fonts: {
            inter: 'var(--font-inter)',
            poppins: 'var(--font-poppins)',
        },
        weights: {
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
        }
    },

    spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem',
    },

    borderRadius: {
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        full: '9999px',
    },
} as const;

// Utilitários de classe CSS para Tailwind
export const designSystemClasses = {
    text: {
        h1: 'font-poppins font-bold text-4xl md:text-5xl lg:text-6xl',
        h2: 'font-poppins font-semibold text-3xl md:text-4xl lg:text-5xl',
        h3: 'font-poppins font-semibold text-2xl md:text-3xl',
        body: 'font-inter text-base md:text-lg',
        caption: 'font-inter text-sm text-neutral-600',
    },
    buttons: {
        primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-md hover:shadow-lg transition-all duration-300',
        secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white shadow-md hover:shadow-lg transition-all duration-300',
        outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white transition-all duration-300',
        gradient: 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white shadow-lg hover:shadow-xl transition-all duration-300',
    },
    cards: {
        elevated: 'bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-neutral-100',
        gradient: 'bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl border border-primary-100',
    }
};