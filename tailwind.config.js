// eslint-disable-next-line no-undef
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}'
  ],
  theme: {
    extend: {
      animation: {
        'pulsate': 'pulsate 4s ease-in-out infinite'
      },
      keyframes: {
        pulsate: {
          '75%, 100%': { transform: 'scale(1.2)', opacity: 0 }
        }
      }
    }
  },
  plugins: []
};
