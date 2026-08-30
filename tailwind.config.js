/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1E3A8A',
          blue: '#2563EB',
          'blue-hover': '#1D4ED8',
          'blue-subtle': '#EFF6FF',
        },
        slate: {
          850: '#152033',
          900: '#0F172A',
          950: '#0B1120',
        },
        financial: {
          green: '#059669',
          'green-subtle': '#ECFDF5',
        },
        loan: {
          amber: '#D97706',
          'amber-subtle': '#FFFBEB',
        },
        mileage: {
          purple: '#4F46E5',
          'purple-subtle': '#EEF2FF',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Consolas', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}
