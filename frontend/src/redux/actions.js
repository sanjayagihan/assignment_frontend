import axios from 'axios';

export const fetchUsers = (token) => async (dispatch) => {
  const response = await axios.get('http://localhost:5000/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
  dispatch({ type: 'SET_USERS', payload: response.data });
};

export const loginUser = (username, password) => async (dispatch) => {
  const response = await axios.post('http://localhost:5000/login', { username, password });
  const token = response.data.token;
  localStorage.setItem('token', token);
  dispatch({ type: 'SET_TOKEN', payload: token });
};