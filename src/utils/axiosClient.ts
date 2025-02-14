import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.BASE_URL || 'http://localhost:3000/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});


export default axiosClient;
