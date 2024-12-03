/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Path to your files
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(0, 0, 255)',       // Blue
        secondary: 'rgb(0, 255, 255)',    // Teal
        accent: 'rgb(255, 0, 255)',        // Pink
        warning: 'rgb(255, 255, 0)',      // Yellow
        error: 'rgb(255, 0, 0)',         // Red
        white: 'rgb(255, 255, 255)',  // White
        background: 'rgb(0, 0, 0)',       // Black
        success: 'rgb(0, 255, 0)',       // Green (Success)
      },
    },
  },
  plugins: [],
}

