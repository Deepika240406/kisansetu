/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bharat: {
          saffron: "#FF7722",
          saffronLight: "#FFF4ED",
          saffronHover: "#E56210",
          emerald: "#0E8345",
          emeraldLight: "#E8F8EE",
          navy: "#132742",
          gold: "#D97706",
          sand: "#FAF7F2",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
