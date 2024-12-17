import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="container text-center mt-5">
      <div className="card p-4 shadow-sm">
        <h1 className="display-4 mb-4">Welcome to the User Management System</h1>
        <p className="lead mb-4">Manage users efficiently and easily with this system.</p>
        <button
          onClick={() => navigate('/login')}
          className="btn btn-primary btn-lg"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default Home;
