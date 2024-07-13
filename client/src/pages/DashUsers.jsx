import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaCheck } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";

const DashUsers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [userIdDelete, setUserIdToDelete] = useState('');
  const [modal, showModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/v1/user/getuser`);
        const data = await res.json();
        console.log("Fetched data:", data); // Log fetched data
        if (res.ok) {
          setUsers(data.getUser || []);
          setShowMore(data.getUser && data.getUser.length >= 9);
        } else {
          console.error("Failed to fetch users:", data);
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
      }
    };

    if (currentUser && currentUser.isAdmin) {
      fetchUser();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/v1/user/getuser?startIndex=${startIndex}`);
      const data = await res.json();
      console.log("Fetched more data:", data); // Log more fetched data
      if (res.ok) {
        setUsers((prev) => [...prev, ...(data.getUser || [])]);
        setShowMore(data.getUser && data.getUser.length >= 9);
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
    }
  };

  const handleModal = (userId) => {
    setUserIdToDelete(userId);
    showModal(true);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/v1/user/delete/${userIdDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdDelete));
        showModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Delete error:", error.message);
    }
  };

  return (
    <div className='w-full overflow-x-scroll table-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300'>
      {currentUser && currentUser.isAdmin && users.length > 0 ? (
        <div>
          <table className='shadow-md w-full'>
            <thead>
              <tr>
                <th className='p-4'>Date Created</th>
                <th className='p-4'>User Image</th>
                <th className='p-4'>Username</th>
                <th className='p-4'>Email</th>
                <th className='p-4'>Admin</th>
                <th className='p-4'>Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className='border-2 hover:bg-gray-200 divide-y'>
                  <td className='p-4 text-gray-600'>{new Date(user.createdAt).toDateString()}</td>
                  <td className='p-5'>
                    <img src={user.ProfileImage} alt={user.username} className='w-14 object-cover rounded-full h-14 ' />
                  </td>
                  <td className='p-4'>{user.username}</td>
                  <td className='p-4'>{user.email}</td>
                  <td className='p-4'>{user.isAdmin ? <FaCheck className='text-green-500 font-bold' /> : <RxCross1 className='text-red-700' />}</td>
                  <td className='p-4'>
                    <button
                      className='text-red-600 hover:underline cursor-pointer'
                      onClick={() => handleModal(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showMore && (
            <div className='flex justify-center items-center'>
              <button className='text-teal-500 text-sm py-5' onClick={handleShowMore}>
                Show More
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>No users found!</p>
      )}

      {modal && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
          <div className='bg-white p-6 rounded shadow-lg'>
            <h1 className='mb-4'>Are you sure you want to delete?</h1>
            <div className='flex justify-center'>
              <button
                className='bg-red-500 text-white px-4 py-2 mr-2 rounded'
                onClick={handleDelete}
              >
                Yes
              </button>
              <button
                className='bg-gray-500 text-white px-4 py-2 ml-2 rounded'
                onClick={() => showModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashUsers;
