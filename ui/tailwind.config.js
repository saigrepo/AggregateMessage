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
			'custom-linearPrimarySecondary-1': 'linear-gradient(45deg, #4bbfc4, #91dee2)',
			'custom-linearPrimaryAccent-1': 'linear-gradient(45deg, #4bbfc4, #67dadf)',
			'custom-linearSecondaryAccent-1': 'linear-gradient(45deg, #91dee2, #67dadf)',
			'custom-linearPrimarySecondary-2': 'linear-gradient(45deg, #3bb1b5, #1d696d)',
			'custom-linearPrimaryAccent-2': 'linear-gradient(45deg, #3bb1b5, #209297)',
			'custom-linearSecondaryAccent-2': 'linear-gradient(45deg, #1d696d, #209297)',
		},
  		colors: {
			'background-light' : '#f9fcfd',
			'background-dark' : '#030608',

		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

