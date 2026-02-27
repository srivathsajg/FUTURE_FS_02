import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      'Request failed'
    if (error?.response?.status === 401) {
      localStorage.removeItem('token')
      toast.error('Session expired. Please log in again.')
      setTimeout(() => {
        window.location.href = '/login'
      }, 500)
    } else {
      toast.error(msg)
    }
    return Promise.reject(error)
  },
)

export default api

