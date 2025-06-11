export default {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
    'postcss-preset-env': {
      features: {
        'nesting-rules': true,
        'custom-properties': true,
        'gap-properties': true,
        'color-function': true,
        'text-wrap': true,
        'logical-properties-and-values': true,
      },
      browsers: 'last 2 versions, > 1%, not dead',
    },
  },
}