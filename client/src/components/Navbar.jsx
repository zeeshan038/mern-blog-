import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CiMenuBurger, CiDark } from 'react-icons/ci';

import { CiSearch } from "react-icons/ci"
import { SignoutSuccess, signoutFailure } from '../redux/reducers/userSlice';

const Navbar = () => {
  const path = useLocation().pathname;
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [userData, setUserData] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleChange = () => {
    setUserData(!userData);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSignout = async () => {
    try {
      const res = await fetch(`/api/v1/user/signout`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(signoutFailure(data.message));
      } else {
        dispatch(SignoutSuccess(data));
        navigate('/login')
      }
    } catch (error) {
      dispatch(signoutFailure(error.message))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }
  const handleToggle = ()=>{
    setUserData(!userData)
  }

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setUserData(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <header className='bg-gray-800 text-white'>
      <div className='flex items-center justify-between px-4 py-4'>
        <div className='flex items-center'>
          <h1 className='text-2xl font-sans uppercase font-bold'>magdesign</h1>
        </div>
        <div className='hidden md:block relative'>
          <form onSubmit={handleSubmit}>
            <input
              type="search"
              placeholder="search here"
              className="border-1 border-black-900 rounded-md h-10 w-64 bg-gray-700 text-white placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className='absolute top-2 right-4'>
              <CiSearch className='text-[22px] font-bold cursor-pointer' />
            </button>
          </form>
        </div>

        <div className='flex items-center space-x-4'>
          <div className='block md:hidden'>
            <CiMenuBurger className='text-2xl cursor-pointer' onClick={toggleMenu} />
          </div>
          <div className='hidden md:flex items-center space-x-4'>
            <Link to='/' className='hover:underline'>Home</Link>
            <Link to='/about' className='hover:underline'>About</Link>
            <Link to='/search' className='hover:underline'>Blogs</Link>
          </div>
          <div>
            {currentUser ? (
              <div className='relative'>
                <img
                  src={currentUser.ProfileImage}
                  alt="profileImg"
                  className='h-12 cursor-pointer rounded-full'
                  onClick={handleChange}
                />
                {userData && (
                  <div className='absolute right-0 mt-2 w-48 bg-white text-black border rounded-md shadow-lg'>
                    <div className='p-4'>
                      <p className='font-bold'>{currentUser.username}</p>
                      <p>{currentUser.email}</p>
                      {currentUser.isAdmin && (
                        <Link to={'/dashboard?tab=dash'} onClick={handleToggle}>Dashboard</Link>
                      )}
                      <br />
                      <button onClick={handleSignout}>Sign out</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to='/login' className='hover:underline'>Login</Link>
            )}
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className='md:hidden bg-gray-700'>
          <ul className='flex flex-col items-center space-y-4 py-4'>
            <Link to='/' className='hover:underline' onClick={toggleMenu}>Home</Link>
            <Link to='/about' className='hover:underline' onClick={toggleMenu}>About</Link>
            <Link to='/blogs' className='hover:underline' onClick={toggleMenu}>Blogs</Link>
            <Link to='/profile' className='hover:underline' onClick={toggleMenu}>Profile</Link>
            <form onSubmit={handleSubmit}>
              <input
                type="search"
                placeholder='search here'
                className=''
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
