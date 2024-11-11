/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		backgroundImage: {
			'custom-linear' : 'linear-gradient(45deg, rgba(97, 90, 226, 0.6) 0%, rgba(53, 49, 124, 0.48) 100%)',
			'custom-conic-gradient': 'conic-gradient(from 180deg at 50% 50%, rgb(122, 119, 224) 180deg, rgb(144, 142, 210) 360deg)',
		},
  		colors: {
			'background-light' : '#f9fcfd',
			'background-dark' : '#030608',
			'bg-tones-1': '#e9f2f4',
			'bg-tones-2': '#f8fbfb',
			'bg-tones-3': '#f2f7f8',
			'bg-tones-4': '#ebe9f4'

		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

