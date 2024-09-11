module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        edu: ['"Edu VIC WA NT Beginner"', 'sans-serif'],
      },
      backgroundImage: theme => ({
        'logo-gradient': `linear-gradient(to right, ${theme('colors.logo-blue')}, ${theme('colors.logo-purple')}, ${theme('colors.logo-pink')})`,
      }),
      colors: {
        'logo-black': '#000000',
        'logo-blue': '#17153B',   
        'logo-purple': '#000000', 
        'logo-pink': '#17153B',   
      }, 
    },
  },
  plugins: [],
}
