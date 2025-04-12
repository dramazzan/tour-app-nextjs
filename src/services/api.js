import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8080/',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

api.interceptors.request.use(
    (config) => {
        if(typeof window !== 'undefined') {
            const token = localStorage.getItem('token')
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`
            }
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)



export const getAllTours = async () => {
    try{
        const response = await api.get('/tours')
        return response.data
    }catch(error){
        console.error('Error fetching tours:', error)
        throw error
    }
}


export const loginUser = async (user) => {
    try{
        const response = await api.post('/auth/login', user)
        return response.data
    }catch(error){
        console.error('Error logging in:', error)
        throw error
    }
}

export const registerUser = async (user) => {
    try{
        const response = await api.post('/auth/register', user)
        return response.data
    }catch(error){
        console.error('Error registering:', error)
        throw error
    }
}


export default api