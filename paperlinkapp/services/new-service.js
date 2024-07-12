import axios from 'axios'

export const BASE_URL = process.env.VUE_APP_NEW_API_URL
// export const BASE_URL = "http://52c6-102-91-4-196.ngrok-free.app"
// export const BASE_URL = process.env.REACT_APP_TEST_BASE_API_URL

export const server = axios.create({
  baseURL: BASE_URL,
  responseType: 'json',
})

server.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('main_user_paperdaz_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      return config
    } else {
      return config
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

server.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
    }

    return Promise.reject(error)
  }
)
