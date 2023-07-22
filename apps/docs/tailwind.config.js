const sharedConfig = require('tailwind-config/tailwind.config.js')

module.exports = {
  presets: [sharedConfig],
  content: [
    './theme.config.tsx',
    './pages/**/*.{js,jsx,ts,tsx,md,mdx}',
    './components/**/*.{js,jsx,ts,tsx,md,mdx}',
  ],
}
