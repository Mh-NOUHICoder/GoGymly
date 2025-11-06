import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/custom-layout/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@clerk/themes/dist/**/*.{js,ts,jsx,tsx}"
],
  theme: { extend: {} },
  plugins: [],
}
export default config
