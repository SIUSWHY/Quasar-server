import axios from 'axios'
// const { VUE_APP_SERVER_URL } = process.env;
// import Cookies from 'js-cookie';

export const axiosInstance = axios.create({
  baseURL: 'https://pet-quasar-app.herokuapp.com/'
})

// axiosInstance.interceptors.request.use(
//   config => {
//     config.headers!.Authorization = 'Bearer ' + Cookies.get('Token');
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   }
// );
