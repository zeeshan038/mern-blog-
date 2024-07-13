import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { PiSignOutBold } from "react-icons/pi";
import { CiMenuBurger } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { SignoutSuccess, signoutFailure } from "../redux/reducers/userSlice";
import { MdPostAdd } from "react-icons/md";
const DashSidBar = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const sidebarRef = useRef(null);
  const dispatch = useDispatch();
  const handleToggle = () => {
    setToggleSidebar(!toggleSidebar);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setToggleSidebar(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleCloseSidebar = () => {
    setToggleSidebar(false);
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
        navigate("/login");
      }
    } catch (error) {
      dispatch(signoutFailure(error.message));
    }
  };

  return (
    <div>
      <div className="flex flex-col items-start justify-start">
        <div className="block ">
          <CiMenuBurger
            className="text-4xl cursor-pointer"
            onClick={handleToggle}
          />
        </div>

        {/* <div
          className={`flex flex-col hidden items-start justify-start mt-20 fixed top-0 left-0 h-full bg-[#f2f2f2] text-black  transform  w-64 z-50 transition-all sm:hidden  md:block rounded-lg`}
        >   
    
          
        </div> */}

        {toggleSidebar && (
          <div
            ref={sidebarRef}
            className={`flex flex-col items-start justify-start mt-20 fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform transform ${
              toggleSidebar ? "translate-x-0" : "-translate-x-full"
            } w-48 z-50 transition-all duration-300 `}
          >
            <IoCloseSharp
              className="text-4xl cursor-pointer text-red-600 absolute right-0"
              onClick={handleCloseSidebar}
            />
             <Link
              to={"/dashboard?tab=dash"}
              className="text-2xl mt-12 flex items-center justify-center font-bold"
              onClick={handleToggle}
            >
               Dashboard
             
            </Link>
            <Link
            to={"/post"}
            className="text-2xl mt-8 h-12 flex items-center justify-center font-bold  transition-all"
          >
              Create Post
            
          </Link>
            <Link
              to={"/dashboard?tab=post"}
              className="text-2xl mt-12 flex items-center justify-center font-bold transition-all"
              onClick={handleToggle}
            >
              Posts{" "}
              
            </Link>
            <Link
            to={"/dashboard?tab=comments"}
            className="text-2xl mt-8 h-12 flex items-center justify-center font-bold transition-all"
          >
            Comments
            
          </Link>
          <Link
            to={"/dashboard?tab=user"}
            className="text-2xl mt-8 h-12 flex items-center justify-center font-bold  transition-all"
          >
            Users{" "}
          
          </Link>
            <Link
              to={"/signout"}
              className="text-2xl mt-8 flex items-center justify-center font-bold transition-all"
              onClick={handleSignout}
            >
              Logout{" "}
              
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashSidBar;
