import axios from 'axios';
// const { VUE_APP_SERVER_URL } = process.env;
// import Cookies from 'js-cookie';

export const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:3000',
});

// axiosInstance.interceptors.request.use(
//   config => {
//     config.headers!.Authorization = 'Bearer ' + Cookies.get('Token');
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   }
// );
