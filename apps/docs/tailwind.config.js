const sharedConfig = require('tailwind-config/tailwind.config.js')

module.exports = {
  presets: [sharedConfig],
  content: [
    './pages/**/*.{js,jsx,ts,tsx,md,mdx}',
    './components/**/*.{js,jsx,ts,tsx,md,mdx}',
  ],
}
