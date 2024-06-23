import React, { useState } from 'react';
import { useUserContext } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {changeStatus, ChangeUserInfo, updateUsers} = useUserContext()
  const navigate = useNavigate()

  const userForSideBar = () => {
    fetch('http://localhost:8000/api/users', {
      method:'GET',
      credentials:'include'  
    }).then((response)=>response.json()).then((result)=> {
      updateUsers(result);
    })
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {username, password};
    fetch("http://localhost:8000/api/auth/login", {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(dataToSend),
      credentials:'include'
    }).then((response)=> {
      if(response.ok){
        const data = response.json()
        data.then((result)=> {
          changeStatus(true);
          ChangeUserInfo(result);
          userForSideBar();
          navigate('/room')
        })
      }
      else{
        alert('Username or password is incorrect')
      }
    }).catch((error)=> {
      alert('Something went wrong, Try again after sometime')
    })
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <form onSubmit={onSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
              Create an account? <a href="/" className="text-blue-500 hover:text-blue-700">Sign Up</a>
            </p>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
              Forgot Password ? <a href="/forgotpassword" className="text-blue-500 hover:text-blue-700">Forgot Password</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
