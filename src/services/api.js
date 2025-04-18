import axios from 'axios'
import jwt from "jsonwebtoken";


const api = axios.create({
    baseURL: 'http://localhost:8080/',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
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




export const getTourById = async (tourId) => {
    try{
        const token = localStorage.getItem('authToken')
        const response = await api.get('/tours/' + tourId , {headers: {'Authorization': `Bearer ${token}`}})
        return response.data
    }catch(error){
        console.error('Error fetching tour by ID:', error)
        throw error
    }
}


export const getAllTours = async () => {
    try {
        const response = await api.get('/tours')
        return response.data
    } catch (error) {
        console.error('Error fetching tours:', error)
        throw error
    }
}


export const addTour = async (tour) => {
    try {
        const token = localStorage.getItem('authToken')
        if (token) {
            const repsonse = await api.post('/admin/tour', tour, {headers: {'Authorization': `Bearer ${token}`}})
            return repsonse.data
        } else {
            console.error('Error creating tour token not found')
        }
    } catch (err) {
        console.error('Error adding tour:', tour)
        throw err
    }
}

export const updateTour = async (tourId, tour) => {
    try {
        const token = localStorage.getItem('authToken')
        if (token) {
            const response = await api.put(`/admin/tour/${tourId}`, tour, {headers: {'Authorization': `Bearer ${token}`}})
            return response.data
        } else {
            console.error('Error updating tour token not found')
        }
    } catch (error) {
        console.error('Error updating tour:', error)
        throw error
    }
}

export const deleteTour = async (tourId) => {
    try {
        const token = localStorage.getItem('authToken')
        if (token) {
            const response = await api.delete(`/admin/tour/${tourId}`, {headers: {'Authorization': `Bearer ${token}`}})
            return response.data
        } else {
            console.error('Error deleting tour token not found')
        }
    } catch (error) {
        console.error('Error deleting tour:', error)
        throw error
    }
}




export const loginUser = async (user) => {
    try {
        const response = await api.post('/auth/login', user)
        return response.data
    } catch (error) {
        console.error('Error logging in:', error)
        throw error
    }
}

export const registerUser = async (user) => {
    try {
        const response = await api.post('/auth/register', user)
        return response.data
    } catch (error) {
        console.error('Error registering:', error)
        throw error
    }
}

export const GetCurrentUser = async () =>{
    try{
        const token = localStorage.getItem('authToken')
        const response = await api.get('/user/dashboard' , {headers: {'Authorization': `Bearer ${token}`}})
        return response.data
    }catch (error) {
        console.error('Error getting current user:', error)
        throw error
    }
}

export const UpdateCurrentUser = async (user) =>{
    try{
        const token = localStorage.getItem('authToken')
        const response = await api.put('/user/update' , user , {headers: {'Authorization': `Bearer ${token}`}})
        return response.data
    }catch(error){
        console.error('Error updating current user:', error)
        throw error
    }
}



export const addTourOnBasket = async (tourId) => {
    try {
        const token = localStorage.getItem('authToken')
            const response = await api.post('/basket/tours/' + tourId, {}, {headers: {'Authorization': `Bearer ${token}`}})
            return response.data
        
       
    } catch (error) {
        console.error('Error adding tour to basket:', error)
        throw error
    }
}


export const getBasket = async () => {
    try{
        const token = localStorage.getItem('authToken')
        const response = await api.get('/basket/tours', {headers: {'Authorization': `Bearer ${token}`}})
        return response.data
    }catch(error){
        console.error('Error fetching basket:', error)
        throw error
    }
}


export const removeTourFromBasket = async (tourId) => {
    try{
        const token = localStorage.getItem('authToken')
        const response = await api.delete('/basket/tours/' + tourId, {headers: {'Authorization': `Bearer ${token}`}})
        return response.data
    }catch(error){
        console.error('Error removing tour from basket:', error)
        throw error
    }
}


export const isAdmin = ()=> {
    try {
        const token = localStorage.getItem('authToken');

        if (!token) {
            return false;
        }

        const decoded = jwt.decode(token);
        if (decoded && decoded.role === 'admin') {
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error fetching isAdmin:', error);
        throw error;
    }
};


export default api