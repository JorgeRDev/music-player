const storagedTheme = localStorage.getItem('theme')
const htmlClassList = document.documentElement.classList
const DARK = 'dark'
const LIGHT = 'light'
const isDark =
  storagedTheme === DARK ||
  (!storagedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
