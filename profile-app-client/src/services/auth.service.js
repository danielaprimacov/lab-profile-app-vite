import axios from 'axios';

const API_URL = 'http://localhost:5005';

// ─── Public endpoints ──────────────────────────────────────────────────────────
export const signUp = ({ username, password, campus, course }) => {
  return axios.post(`${API_URL}/auth/signup`, {
    username,
    password,
    campus,
    course,
  });
};

export const logIn = ({ username, password }) => {
  return axios.post(`${API_URL}/auth/login`, {
    username,
    password,
  });
};

export const verifyToken = () => {
  const token = localStorage.getItem('authToken');
  return axios.get(`${API_URL}/auth/verify`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ─── Protected endpoints ───────────────────────────────────────────────────────
export const uploadPhoto = (file) => {
  const token = localStorage.getItem('authToken');
  const formData = new FormData();
  formData.append('image', file);

  return axios.post(`${API_URL}/api/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('authToken');
  return axios.get(`${API_URL}/api/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const editUser = ({ username, campus, course, image }) => {
  const token = localStorage.getItem('authToken');
  return axios.put(
    `${API_URL}/api/users`,
    { username, campus, course, image },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
