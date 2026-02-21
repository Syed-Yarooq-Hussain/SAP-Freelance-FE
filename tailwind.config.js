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
        "brand-blue": "#3BA8D0",
        "brand-blue-dark": "#0891B2",
        "brand-green": "#009966",
        "button-blue": "#2491BD",
        "gradient-blue-start": "#0891B2",
        "gradient-blue-end": "#1EAAC8",
        "gradient-green-start": "#00C950",
        "gradient-green-end": "#00A63E",
      },
      backgroundImage: {
        "gradient-light-blue": "linear-gradient(180deg, #B8E6EF 0%, #6BC4D8 50%, #A5DBE8 100%)",
        "gradient-blue": "linear-gradient(180deg, #0891B2 0%, #1EAAC8 100%)",
        "gradient-green": "linear-gradient(135deg, #00C950 0%, #00A63E 100%)",
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        input: "10px",
      },
    },
  },
  plugins: [],
};
