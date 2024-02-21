/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				ibm: ['ibm', 'serif'],
				'ibm-bold': ['ibm-bold', 'serif']
			}
		}
	},
	plugins: []
};
