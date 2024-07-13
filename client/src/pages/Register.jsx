import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signInFailure, signInStart, signInSuccess } from '../redux/reducers/userSlice';
import OAuth from '../components/OAuth';

const Register = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setError("Please fill all fields");
      return;
    }
    try {
      dispatch(signInStart());
      const res = await fetch("http://localhost:3000/api/v1/user/register", {
        method: "POST",
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      console.log(data); // Log the server response
      if (!res.ok) {
        dispatch(signInFailure("Registered"));
        setError(data.message );
      } else {
        dispatch(signInSuccess(data));
        setError('');
        navigate('/login');
      }
    } catch (error) {
      console.error("Error:", error); // Log the error for debugging
      setError("An error occurred");
      dispatch(signInFailure("An error occurred"));
    }
  }

  return (
    <div className='flex flex-col items-center justify-center  min-h-full mt-16 mx-auto'>
    <h1 className='text-3xl font-serif mt-16'>Register</h1>
    <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center mt-6'>
    <input
        type="text"
        placeholder='Enter Username'
        id='username'
        className='border-2 border-black rounded-lg w-64 md:w-96  h-8 mt-6'
        onChange={handleChange}
      />
      <input
        type="email"
        placeholder='Enter Email here'
        id="email"
        className='border-2 border-black rounded-lg w-64 md:w-96  h-8 mt-6'
        onChange={handleChange}
     
      />
      <input
        type="password"
        placeholder='Enter password'
        id='password'
        className='border-2 border-black rounded-lg w-64 md:w-96  h-8 mt-6'
        onChange={handleChange}
      />
      <button type="submit" className=' text-white py-2 border-2 rounded-lg mt-6
      w-64 md:w-96  bg-gray-700 hover:bg-gray-500 transition ease-in-out delay-100'>
       Register 
      </button>
      <OAuth/>
    </form>
    <div className='flex items-center justify-between ml-16 md:ml-52 mt-1'>
      <h1 className='font-semi-bold  '>Already user?</h1>
      <Link to={'/login'} className='font-bold ml-1'>Login</Link>
    </div>
    {error && <h1 className='text-red-500'>{error}</h1>}
  </div>
  );
}

export default Register;
