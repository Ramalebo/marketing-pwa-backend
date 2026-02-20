import { createStore } from 'vuex';
import axios from 'axios';

// Use env API URL: local backend when running locally, production URL when deployed
const API_URL = process.env.VUE_APP_API_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api' : 'https://marketing-pwa-backend.onrender.com/api');

if (process.env.NODE_ENV === 'development') {
  console.log('API URL:', API_URL);
}

axios.defaults.baseURL = API_URL;

// Interceptor to handle requests with leading slashes correctly
// When baseURL includes /api and request starts with /, remove leading slash so it appends
axios.interceptors.request.use(config => {
  // Only modify relative URLs (not absolute URLs starting with http)
  if (config.url && 
      !config.url.startsWith('http') && 
      config.url.startsWith('/') && 
      axios.defaults.baseURL.endsWith('/api')) {
    // Remove leading slash so axios appends to baseURL instead of replacing the path
    config.url = config.url.substring(1);
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Response interceptor to handle 401 errors (unauthorized)
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      const store = require('./index').default;
      const isAuthRequest = error.config?.url?.includes('auth/me') || error.config?.url?.includes('auth/login');
      store.dispatch('logout');
      // Only redirect for non-auth requests (e.g. expired token). No redirect when just checking /auth/me with no token.
      if (!isAuthRequest && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const store = createStore({
  state: {
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    snackbar: {
      show: false,
      text: '',
      color: 'success',
      timeout: 4000
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    user: state => state.user,
    isMainUser: state => state.user?.isMainUser || false,
    token: state => state.token
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },
    SET_USER(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    CLEAR_AUTH(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    },
    SHOW_SNACKBAR(state, payload) {
      state.snackbar = {
        show: true,
        text: payload.text || '',
        color: payload.color || 'success',
        timeout: payload.timeout || 4000
      };
    },
    HIDE_SNACKBAR(state) {
      state.snackbar.show = false;
    }
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await axios.post('/auth/login', credentials);
        commit('SET_TOKEN', response.data.token);
        commit('SET_USER', response.data.user);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    async register({ commit }, userData) {
      try {
        const response = await axios.post('/auth/register', userData);
        commit('SET_TOKEN', response.data.token);
        commit('SET_USER', response.data.user);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    async fetchUser({ commit }) {
      try {
        const response = await axios.get('/auth/me');
        commit('SET_USER', response.data.user);
        return response.data.user;
      } catch (error) {
        commit('CLEAR_AUTH');
        throw error;
      }
    },
    logout({ commit }) {
      commit('CLEAR_AUTH');
    },
    showSnackbar({ commit }, payload) {
      commit('SHOW_SNACKBAR', payload);
    },
    hideSnackbar({ commit }) {
      commit('HIDE_SNACKBAR');
    }
  }
});

// Set auth header if token exists
if (store.state.token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${store.state.token}`;
}

export default store;

