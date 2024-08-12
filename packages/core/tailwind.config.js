/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      'bg-primary': 'var(--blink-bg-primary)',
      'bg-secondary': 'var(--blink-bg-secondary)',
      button: 'var(--blink-button)',
      'button-success': 'var(--blink-button-success)',
      'button-disabled': 'var(--blink-button-disabled)',
      'button-hover': 'var(--blink-button-hover)',
      'input-bg': 'var(--blink-input-bg)',
      'input-bg-selected': 'var(--blink-input-bg-selected)',
      'input-bg-disabled': 'var(--blink-input-bg-disabled)',
      'input-stroke': 'var(--blink-input-stroke)',
      'input-stroke-selected': 'var(--blink-input-stroke-selected)',
      'input-stroke-hover': 'var(--blink-input-stroke-hover)',
      'input-stroke-error': 'var(--blink-input-stroke-error)',
      'input-stroke-disabled': 'var(--blink-input-stroke-disabled)',
      'icon-error': 'var(--blink-icon-error)',
      'icon-error-hover': 'var(--blink-icon-error-hover)',
      'icon-primary': 'var(--blink-icon-primary)',
      'icon-primary-hover': 'var(--blink-icon-primary-hover)',
      'icon-warning': 'var(--blink-icon-warning)',
      'icon-warning-hover': 'var(--blink-icon-warning-hover)',
      'stroke-error': 'var(--blink-stroke-error)',
      'stroke-primary': 'var(--blink-stroke-primary)',
      'stroke-secondary': 'var(--blink-stroke-secondary)',
      'stroke-warning': 'var(--blink-stroke-warning)',
      'text-brand': 'var(--blink-text-brand)',
      'text-button': 'var(--blink-text-button)',
      'text-button-success': 'var(--blink-text-button-success)',
      'text-button-disabled': 'var(--blink-text-button-disabled)',
      'text-input': 'var(--blink-text-input)',
      'text-input-disabled': 'var(--blink-text-input-disabled)',
      'text-input-placeholder': 'var(--blink-text-input-placeholder)',
      'text-link': 'var(--blink-text-link)',
      'text-link-hover': 'var(--blink-text-link-hover)',
      'text-primary': 'var(--blink-text-primary)',
      'text-secondary': 'var(--blink-text-secondary)',
      'text-success': 'var(--blink-text-success)',
      'text-warning': 'var(--blink-text-warning)',
      'text-warning-hover': 'var(--blink-text-warning-hover)',
      'text-error': 'var(--blink-text-error)',
      'text-error-hover': 'var(--blink-text-error-hover)',
      'transparent-error': 'var(--blink-transparent-error)',
      'transparent-grey': 'var(--blink-transparent-grey)',
      'transparent-warning': 'var(--blink-transparent-warning)',
      transparent: 'transparent',
      currentColor: 'currentColor',
    },
    borderRadius: {
      lg: 'var(--blink-border-radius-rounded-lg)',
      xl: 'var(--blink-border-radius-rounded-xl)',
      '2xl': 'var(--blink-border-radius-rounded-2xl)',
      button: 'var(--blink-border-radius-rounded-button)',
      input: 'var(--blink-border-radius-rounded-input)',
      'input-standalone': 'var(--blink-border-radius-rounded-input-standalone)',
      full: '9999px',
      none: '0px',
    },
    extend: {
      fontSize: {
        // assuming twitter font size base - 15px
        text: ['1rem', '1.2rem'],
        subtext: ['0.867rem', '1.067rem'],
        caption: ['0.73333rem', '0.93333rem'],
      },
      boxShadow: {
        action: 'var(--blink-shadow-container)',
      },
    },
  },
  plugins: [],
};