export function getToken() {
  return localStorage.getItem('token')
}

export function setToken(token) {
  localStorage.setItem('token', token)
}

export function clearToken() {
  localStorage.removeItem('token')
}

export function getTheme() {
  return localStorage.getItem('theme') || 'system'
}

export function setTheme(next) {
  localStorage.setItem('theme', next)
  const isDark =
    next === 'dark' ||
    (next === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', isDark)
}

