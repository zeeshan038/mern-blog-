import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Dashcomments = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState('');
  const [modal, showModal] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch("/api/v1/comment/getComments", {
          method: "GET",
        });
        
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length > 9) {
            setShowMore(true);
          }
        } else {
          console.error("Failed to fetch comments");
        }
      } catch (error) {
        console.error("Fetch Error:", error.message);
      }
    };
    fetchComments();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(`/api/v1/comment/getComments?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();

      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      } else {
        console.error("Failed to fetch more comments");
      }
    } catch (error) {
      console.error("Show More Error:", error.message);
    }
  };

  const handleModal = (commentId) => {
    setCommentToDelete(commentId);
    showModal(true);
  };

  const handleDeleteComment = async () => {
    try {
      const res = await fetch(`/api/v1/comment/delete/${commentToDelete}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setComments((prev) => prev.filter((comment) => comment._id !== commentToDelete));
        showModal(false);
        if (comments.length - 1 < 9) {
          setShowMore(false);
        }
      } else {
        console.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Delete Error:", error.message);
    }
  };

  return (
    <div className='w-full p-3 overflow-x-auto'>
      {currentUser && currentUser.isAdmin && comments.length > 0 ? (
        <div>
          <table className='shadow-md w-full min-w-max'>
            <thead>
              <tr>
                <th className='p-4'>Date Updated</th>
                <th className='p-4'>Comment Content</th>
                <th className='p-4'>Number of Likes</th>
                <th className='p-4'>PostId</th>
                <th className='p-4'>UserId</th>
                <th className='p-4'>Delete</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => (
                <tr key={comment._id} className='border-2 hover:bg-gray-200'>
                  <td className='p-4 text-gray-600'>{new Date(comment.updatedAt).toDateString()}</td>
                  <td className='p-5 line-clamp-1'>{comment.content}</td>
                  <td className='p-4'>{comment.numberOfLikes}</td>
                  <td className='p-4'>{comment.postId}</td>
                  <td className='p-4'>{comment.userId}</td>
                  <td className='p-4'>
                    <button
                      className='text-red-600 hover:underline cursor-pointer'
                      onClick={() => handleModal(comment._id)}
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
        <p>No comments found!</p>
      )}

      {modal && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50'>
          <div className='bg-white p-6 rounded shadow-lg z-50'>
            <h1 className='mb-4'>Are you sure you want to delete this comment?</h1>
            <div className='flex justify-center'>
              <button
                className='bg-red-500 text-white px-4 py-2 mr-2 rounded'
                onClick={handleDeleteComment}
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

export default Dashcomments;
