module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'media',
  theme: {
    container: {
      center: true,
    },
    fontFamily: {
      'sans': ['acumin-pro-semi-condensed', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
      'body': ['acumin-pro', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
    },
    extend: {
      backgroundColor: ['active'],
      boxShadow: ['active'],
      colors: {
        blue: {
          DEFAULT: '#3591f3',
          900: '#26419f',
          800: '#2c60bf',
          700: '#3071d1',
          600: '#3383e5',
          500: '#3591f3',
          400: '#4ba1f6',
          300: '#68b1f7',
          200: '#92c7fa',
          100: '#bcdcfc ',
          50: '#e3f1fd',
        },
        gray: {
          900: '#212121',
          800: '#333333',
          700: '#3c3c3c',
          600: '#666666',
          500: '#A6A6A6',
          400: '#c8c8c8',
          300: '#d0d0d0',
          200: '#dadada',
          100: '#eaeaea',
          50: '#f4f4f4',
        },
        twitter: {
          DEFAULT: '#1da1f2',
        },
        linkedin: {
          DEFAULT: '#0073b1',
        },
        dribbble: {
          DEFAULT: '#ea4c89',
        },
        behance: {
          DEFAULT: '#1769ff',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            a: {
              color: '#3591f3',
              '&:hover': {
                color: '#3071d1'
              },
            }
          }
        }
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
