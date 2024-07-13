import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Link, useNavigate } from 'react-router-dom';
import { signInFailure, signInStart, signInSuccess } from '../redux/reducers/userSlice';


const Login = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();
   const dispatch = useDispatch()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }
    try {
      dispatch(signInStart())
      const res = await fetch("/api/v1/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
          dispatch(signInFailure());
        setError(data.message || "User didn't log in");
      } else {
        dispatch(signInSuccess(data))
        setError('');
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error))
      setError("An error occurred");
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-full mt-16 mx-auto'>
    <div className='border-2 bg-gray-300 w-64 flex items-center justify-center flex-col shadow-md rounded-md '>
    <h1 className='font-bold'>Login with admin account </h1>
     <p>email : admin@gmail.com</p>
     <p>password : 1</p>
     </div>
      <h1 className='text-3xl md:text-4xl font-serif mt-16'>Login</h1>
      <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center mt-10'>
        <input
          type="email"
          placeholder='admin@gmail.com'
          id="email"
          className='border-2 border-black rounded-lg  w-64 md:w-96 h-8 '
          onChange={handleChange}
       
        />
        <input
          type="password"
          placeholder='1'
          id='password'
          className='border-2 border-black rounded-lg  w-64 md:w-96 h-8 mt-6'
          onChange={handleChange}
        />
        <button type="submit" className=' text-white py-2 border-2 rounded-lg mt-6
         w-64 md:w-96 bg-gray-700 hover:bg-gray-500 transition ease-in-out delay-100'>
          Login
        </button>
      </form>
      <div className='flex items-center justify-between ml-16 md:ml-44 mt-1'>
        <h1 className='font-semi-bold text-[13px] '>Not registered yet?</h1>
        <Link to={'/register'} className='font-bold ml-1'>Register</Link>
      </div>
      {error && <h1 className='text-red-500'>{error}</h1>}
    </div>
  );
}

export default Login;
