import axios from 'axios'

const api = axios.create({
    baseURL: 'https://proffy-api-cris.herokuapp.com'
})

export default api;