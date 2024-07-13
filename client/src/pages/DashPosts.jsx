import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const DashPosts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPost, setUserPost] = useState([]);
  const [showMore, setShowMore] = useState(false); 
  const [postIdDelete, setPostIdToDelete] = useState('');
  const [modal, showModal] = useState(false);

  console.log("Current User:", currentUser);
  console.log("User Posts:", userPost);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/v1/post/getpost?userId=${currentUser._id}`);
        const data = await res.json();


        if (res.ok) {
          setUserPost(data.posts);
          setShowMore(data.posts && data.posts.length >= 9);
        } else {
          console.error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Fetch Error:", error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchPost();
    }
  }, [currentUser._id, currentUser.isAdmin]);

  const handleShowMore = async () => {
    const startIndex = userPost.length;
    try {
      const res = await fetch(`/api/v1/post/getpost?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();


      if (res.ok) {
        setUserPost((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      } else {
        console.error("Failed to fetch more posts");
      }
    } catch (error) {
      console.error("Show More Error:", error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/v1/post/delete/${postIdDelete}/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
   

      if (res.ok) {
        setUserPost((prev) => prev.filter((post) => post._id !== postIdDelete));
        showModal(false);
        if (userPost.length - 1 < 9) {
          setShowMore(false);
        }
      } 
    } catch (error) {
      console.error("Delete Error:", error.message);
    }
  };

  const handleModal = (postId) => {
    setPostIdToDelete(postId);
    showModal(true);
  };

  return (
    <div className='w-full overflow-x-scroll table-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300'>
      {currentUser.isAdmin && userPost.length > 0 ? (
        <div>
          <table className='shadow-md w-full'>
            <thead>
              <tr>
                <th className='p-4'>Date Updated</th>
                <th className='p-4'>Post Image</th>
                <th className='p-4'>Post Title</th>
                <th className='p-4'>Category</th>
                <th className='p-4'>Delete</th>
                <th className='p-4'>Edit</th>
              </tr>
            </thead>
            <tbody>
              {userPost.map((post) => (
                <tr key={post._id} className='border-2 hover:bg-gray-200 divide-y'>
                  <td className='p-4 text-gray-600'>{new Date(post.updatedAt).toDateString()}</td>
                  <td className='p-5'>
                    <Link to={`/post/${post.slug}`}>
                      <img src={post.image} alt={post.title} className='w-20 h-10 object-cover' />
                    </Link>
                  </td>
                  <td className='p-4'>{post.title}</td>
                  <td className='p-4'>{post.category}</td>
                  <td className='p-4'>
                    <button
                      className='text-red-600 hover:underline cursor-pointer'
                      onClick={() => handleModal(post._id)}
                    >
                      Delete
                    </button>
                  </td>
                  <td className='p-4'>
                    <Link to={`/update-post/${post._id}`} className='text-blue-600'>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showMore && (
            <div className='flex justify-center items-center '>
              <button className='text-teal-500 text-sm py-5' onClick={handleShowMore}>
                Show More
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>You have no posts yet!</p>
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

export default DashPosts;
