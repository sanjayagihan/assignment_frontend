import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../redux/actions';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap'; 

const Users = () => {
  const users = useSelector((state) => state.users);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();

  const [newUser, setNewUser] = useState({
    username: '',
    firstname: '',
    lastname: '',
    password: '',
    role: 'user',
  });

  const [updateUser, setUpdateUser] = useState({
    username: '',
    firstname: '',
    lastname: '',
    password: '',
    role: '',
  });

  const [isAdding, setIsAdding] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for controlling modal visibility
  const [userToDelete, setUserToDelete] = useState(null); // Store the user to be deleted
  const [usernameError, setUsernameError] = useState(''); // State for username error message
  const [deleteError, setDeleteError] = useState(''); // State for delete error message
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const storedToken = token || localStorage.getItem('token');
    if (storedToken) {
      dispatch(fetchUsers(storedToken));
    }
  }, [dispatch, token]);

  const handleDelete = async () => {
    if (userToDelete) {
      try {
        await axios.delete(`http://localhost:5000/users/${userToDelete}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(fetchUsers(token));
        setShowDeleteModal(false); // Close modal after deletion
      } catch (error) {
        if (error.response && error.response.status === 403) {
          setDeleteError("You don't have access"); // Set error message for 403 status
        } else {
          setDeleteError('An error occurred while deleting the user');
        }
      }
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (
      !newUser.username ||
      !newUser.firstname ||
      !newUser.lastname ||
      !newUser.password ||
      !newUser.role
    ) {
      alert('All fields are required');
      return;
    }

    // Check for duplicate username
    if (users.some((user) => user.username === newUser.username)) {
      setUsernameError('Username already exists');
      return;
    }

    setUsernameError(''); // Clear error if username is valid

    try{
      await axios.post('http://localhost:5000/users', newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(fetchUsers(token));
      setIsAdding(false); // Close add user form after submission
  
      // Clear the input fields after adding the user
      setNewUser({
        username: '',
        firstname: '',
        lastname: '',
        password: '',
        role: 'user',
      });
      setShowAddModal(false);
    }catch(error){
      if (error.response && error.response.status === 403) {
        setShowAddModal(true);
        setNewUser({
          username: '',
          firstname: '',
          lastname: '',
          password: '',
          role: 'user',
        });
      }
    }
    
  };

  const handleUpdate = async (id) => {
    // Check for duplicate username
    if (users.some((user) => user.username === updateUser.username && user.id !== id)) {
      setUsernameError('Username already exists');
      return;
    }

    setUsernameError(''); // Clear error if username is valid

    try{
      await axios.put(`http://localhost:5000/users/${id}`, updateUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(fetchUsers(token));
      setUpdateUser({
        username: '',
        firstname: '',
        lastname: '',
        password: '',
        role: '',
      }); // Reset update form after submission
    }catch{
      setShowAddModal(true);
        setNewUser({
          username: '',
          firstname: '',
          lastname: '',
          password: '',
          role: 'user',
        });
    }
  };

  const handleUsernameChange = (e) => {
    const { value } = e.target;
    setNewUser((prev) => {
      const updatedUser = { ...prev, username: value };
      if (value && users.some((user) => user.username === value)) {
        setUsernameError('Username already exists');
      } else {
        setUsernameError('');
      }
      return updatedUser;
    });
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Users</h1>
      <button className="btn btn-success mb-3" onClick={() => setIsAdding(true)}>Add User</button>

      {isAdding && (
        <form onSubmit={handleAddUser} className="card p-4 shadow-sm mb-4">
          <h2 className="mb-4">Add User</h2>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Enter username"
              value={newUser.username}
              onChange={handleUsernameChange} // Use the new function for handling username changes
              required
            />
            {usernameError && <small className="text-danger">{usernameError}</small>}
          </div>
          <div className="mb-3">
            <label htmlFor="firstname" className="form-label">First Name</label>
            <input
              type="text"
              id="firstname"
              className="form-control"
              placeholder="Enter first name"
              value={newUser.firstname}
              onChange={(e) => setNewUser({ ...newUser, firstname: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="lastname" className="form-label">Last Name</label>
            <input
              type="text"
              id="lastname"
              className="form-control"
              placeholder="Enter last name"
              value={newUser.lastname}
              onChange={(e) => setNewUser({ ...newUser, lastname: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="role" className="form-label">Role</label>
            <select
              id="role"
              className="form-select"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-primary me-2"
            disabled={usernameError !== ''} // Disable submit if there's an error
          >
            Add
          </button>
          <br></br>
          <button type="button" className="btn btn-secondary" onClick={() => setIsAdding(false)}>Cancel</button>
        </form>
      )}

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Username</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>{user.role}</td>
              <td>
                <button className="btn btn-warning me-2" onClick={() => setUpdateUser({ ...user })}>Update</button>
                <button className="btn btn-danger" onClick={() => {
                  setUserToDelete(user.id); // Set the user to delete
                  setShowDeleteModal(true); // Show the delete confirmation modal
                }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {updateUser.username && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate(updateUser.id);
          }}
          className="card p-4 shadow-sm mt-4"
        >
          <h2 className="mb-4">Update User</h2>
          <div className="mb-3">
            <label htmlFor="update-username" className="form-label">Username</label>
            <input
              type="text"
              id="update-username"
              className="form-control"
              value={updateUser.username}
              onChange={(e) => setUpdateUser({ ...updateUser, username: e.target.value })}
            />
            {usernameError && <small className="text-danger">{usernameError}</small>}
          </div>
          <div className="mb-3">
            <label htmlFor="update-firstname" className="form-label">First Name</label>
            <input
              type="text"
              id="update-firstname"
              className="form-control"
              value={updateUser.firstname}
              onChange={(e) => setUpdateUser({ ...updateUser, firstname: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="update-lastname" className="form-label">Last Name</label>
            <input
              type="text"
              id="update-lastname"
              className="form-control"
              value={updateUser.lastname}
              onChange={(e) => setUpdateUser({ ...updateUser, lastname: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="update-password" className="form-label">Password</label>
            <input
              type="password"
              id="update-password"
              className="form-control"
              value={updateUser.password}
              onChange={(e) => setUpdateUser({ ...updateUser, password: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="update-role" className="form-label">Role</label>
            <select
              id="update-role"
              className="form-select"
              value={updateUser.role}
              onChange={(e) => setUpdateUser({ ...updateUser, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-primary me-2"
            disabled={usernameError !== ''} // Disable submit if there's an error
          >
            Update
          </button>
          <br></br>
          <button type="button" className="btn btn-secondary" onClick={() => setUpdateUser({
            username: '',
            firstname: '',
            lastname: '',
            password: '',
            role: '',
          })}>Cancel</button>
        </form>
      )}

      {/* Modal for delete confirmation */}
      <Modal show={showDeleteModal} onHide={() => {
        setShowDeleteModal(false)
        setDeleteError('')
      }}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this user?
          {deleteError && <div className="text-danger mt-2">{deleteError}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>You don't have access</Modal.Title>
        </Modal.Header>
      </Modal>
    </div>
  );
};

export default Users;
