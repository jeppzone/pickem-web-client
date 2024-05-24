import { fontFamily } from 'tailwindcss/defaultTheme';
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['dark'],
	plugins: [require('daisyui')],
	daisyui: {
		themes: [
			{
				dark: {
					...require('daisyui/src/theming/themes')['dark'],
					success: '#065f46', // bg-emerald-800,
					error: '#881337', // bg-rose-900,
					info: '#0284c7', // bg-sky-900
					'base-content': '#fff'
				}
			}
		]
	},
	theme: {
		screens: {
			xs: '300px',
			...defaultTheme.screens
		},
		container: {
			center: true,
			padding: '2rem'
		},
		extend: {
			fontFamily: {
				sans: ['Inter', ...fontFamily.sans]
			}
		}
	}
};

export default config;
