/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        popover: "var(--popover)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        destructive: "var(--destructive)",
        border: "var(--border)",
        // Brand colors from design
        // "brand-blue": "#3088B7",
        // "brand-blue": "#3088B7",
        "brand-blue": "#4A7AB5",
        "brand-blue-dark": "#0891B2",
        "brand-green": "#009966",
        "brand-yellow": "#F0EDE8",
        "brand-pink": "#F2F5FE",
        "inactive": "#F5F3EF",
        "light-grey": "#9e9e9e",
        "disabled": "#EBEBEB",
        "success": "#2D5A27",
        "button-blue": "#2491BD",
        "background-main": "#FAF9F7",
        "gradient-blue-start": "#0891B2",
        "gradient-blue-end": "#1EAAC8",
        "gradient-green-start": "#00C950",
        "gradient-green-end": "#00A63E",
      },
      backgroundImage: {
        "gradient-light-blue": "linear-gradient(180deg, #B8E6EF 0%, #6BC4D8 50%, #A5DBE8 100%)",
        "gradient-blue": "linear-gradient(180deg, #0891B2 0%, #1EAAC8 100%)",
        "gradient-green": "linear-gradient(135deg, #00C950 0%, #00A63E 100%)",
        "gradient-success": "linear-gradient(135deg, #F0F7EE 14.64%, #E6F0E4 85.36%)"
      },
      borderRadius: {
        md: "7px",
        lg: "9px",
        xl: "12",
        box: "19px",
        input: "10px",
      },
      fontFamily: {
        neue: ['var(--font-neue-hass)', 'sans-serif'],
        manrope: ['var(--font-manrope)', 'sans-serif'],
        syne: ['var(--font-syne)', 'sans-serif']
      },
      fontSize: {
        nano: "8px",
        xxs: '10px'
      },
      boxShadow: {
        custom: '0 1px 2px rgba(0,0,0,0.2),0 4px 12px rgba(0,0,0,0.06)'
      }
    },
  },
  plugins: [],
};
