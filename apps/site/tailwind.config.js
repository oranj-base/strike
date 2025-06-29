/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
  safelist: process.env.NODE_ENV === 'development' ? [{ pattern: /./ }] : [],
  theme: {
  	screens: {
  		xss: '375px',
  		xs: '425px',
  		sm: '768px',
  		md: '1024px',
  		lg: '1440px'
  	},
  	extend: {
  		fontFamily: {
  			inter: [
  				'var(--font-inter)'
  			],
  			syne: [
  				'var(--font-syne)'
  			],
  			sora: [
  				'var(--font-sora)'
  			],
  			grotesk: [
  				'var(--font-space_grotesk)'
  			],
  			sans: [
  				'var(--font-instrument_sans)'
  			],
  			archivo: [
  				'var(--font-archivo)'
  			]
  		},
  		colors: {
  			accent: {
  				brand: '#09CBBF',
  				success: '#09CBBF',
  				error: '#F62D2D',
  				warning: '#FF9900',
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			twitter: {
  				neutral: {
  					'20': '#eff3f4',
  					'30': '#d9d9d9',
  					'40': '#C4C4C4',
  					'50': '#6E767D',
  					'70': '#2f3336',
  					'80': '#202327',
  					'100': '#0f1419'
  				},
  				accent: '#1d9bf0',
  				success: '#00c466',
  				error: '#ff6f6f'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		textColor: {
  			primary: '#232324',
  			secondary: '#434445',
  			tertiary: '#737373',
  			quaternary: '#888989',
  			inverse: '#FFFFFF',
  			icon: {
  				primary: '#2A2A2B',
  				secondary: '#888989',
  				tertiary: '#B3B3B3',
  				inverse: '#FFFFFF'
  			}
  		},
  		borderColor: {
  			primary: '#DEE1E7',
  			secondary: '#EBEBEB'
  		},
  		fontSize: {
  			highlight: [
  				'1.5rem',
  				'2rem'
  			],
  			text: [
  				'0.938rem',
  				'1.125rem'
  			],
  			subtext: [
  				'0.813rem',
  				'1rem'
  			],
  			caption: [
  				'0.688rem',
  				'0.875rem'
  			]
  		},
  		boxShadow: {
  			action: '0px 2px 8px 0px rgba(59, 176, 255, 0.22), 0px 1px 48px 0px rgba(29, 155, 240, 0.32)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
