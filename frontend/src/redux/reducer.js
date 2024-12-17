const initialState = {
  users: [],
  token: localStorage.getItem('token') || null, // Load token from local storage
};
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_USERS':
        return { ...state, users: action.payload };
      case 'SET_TOKEN':
        return { ...state, token: action.payload };
      default:
        return state;
    }
  };
  
  export default reducer;
  