import axios, { InternalAxiosRequestConfig } from 'axios';

import { VITE_SERVER_URL } from '../utils/envValiable';
import { customAlert } from '../components/alert/sweetAlert';

export const axiosInstance = axios.create({
  baseURL: VITE_SERVER_URL,
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!config.headers) return config;

  const token: string | null = localStorage.getItem('Authorization');
  config.headers.Authorization = `${token}`;

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401 && error.response.data.message === '인증이 만료되었습니다.') {
      localStorage.removeItem('Authorization');
      customAlert({
        title: '로그인을 해주세요.',
        text: '로그인 유지시간이 만료되었습니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#777676',
        confirmButtonText: 'Login',
        handleRoutePage: () => window.location.assign('/login'),
      });
    }

    return Promise.reject(error);
  }
);
