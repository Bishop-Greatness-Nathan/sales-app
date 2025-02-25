import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL

const customFetch = axios.create({
  baseURL: API_BASE_URL ? `${API_BASE_URL}/api/v1` : "/api/v1",
})

export default customFetch
