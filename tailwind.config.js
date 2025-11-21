/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base Palette (Clinical Terminal)
        background: '#0B0C0D',
        surface: {
          DEFAULT: '#111213',
          dark: '#181A1C'
        },
        text: {
          primary: '#E5E7EB',
          secondary: '#9CA3AF'
        },
        // Risk Signal Colors (Clinical Precision)
        risk: {
          green: '#00D686',  // Mint to emerald, not neon
          amber: '#FFC14D',  // Warning state
          red: '#FF5F56'     // Alert state
        },
        // Brand Accent (Tech-Forward but Not Sci-Fi)
        brand: '#3B82F6',
        // Border Colors
        border: {
          DEFAULT: '#2D3748',  // Cool gray for subtle depth
          active: '#3B82F6'    // Brand color for selection
        }
      },
      fontFamily: {
        // Modern Sans with Terminal Density
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        // Technical Monospace for Metrics
        mono: ['JetBrains Mono', 'monospace']
      },
      fontSize: {
        // Tighter Type Scale for Dense Information
        'xs': ['0.75rem', '1rem'],     // Status labels
        'sm': ['0.875rem', '1.25rem'], // Secondary info
        'base': ['0.9375rem', '1.5rem'], // Primary content
        'lg': ['1.125rem', '1.75rem']  // Section headers
      },
      spacing: {
        // Precise Spacing for Command Console Feel
        '0.5': '0.125rem',  // Micro adjustments
        '1': '0.25rem',     // Tight spacing
        '2': '0.5rem',      // Standard spacing
        '3': '0.75rem',     // Comfortable spacing
        '4': '1rem',        // Section spacing
        '6': '1.5rem',      // Panel spacing
        '8': '2rem',        // Major divisions
      },
      animation: {
        'risk-pulse': 'risk-pulse 2s ease-in-out',
        'slide-in': 'slide-in 0.2s ease-out'
      },
      keyframes: {
        'risk-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' }
        },
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        }
      },
      boxShadow: {
        // Glass Console Effects
        'inner-subtle': 'inset 0 0.5px 0 0 rgba(255, 255, 255, 0.05)',
        'glow-risk-red': '0 0 15px rgba(255, 95, 86, 0.15)',
        'glow-risk-amber': '0 0 15px rgba(255, 193, 77, 0.15)',
        'glow-risk-green': '0 0 15px rgba(0, 214, 134, 0.15)'
      },
      backgroundImage: {
        // Subtle Gradients for Depth
        'surface-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0) 100%)',
        'glow-top': 'linear-gradient(180deg, rgba(255, 255, 255, 0.01) 0%, transparent 100%)'
      }
    }
  },
  plugins: []
}
