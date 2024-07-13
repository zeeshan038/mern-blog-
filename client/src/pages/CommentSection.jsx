import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';

const CommentSection = ({ postId }) => {
    const { currentUser } = useSelector((state) => state.user);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newComment.length > 200) {
            return;
        }
        const res = await fetch(`/api/v1/comment/createComment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: newComment, postId, userId: currentUser._id }),
        });
        const data = await res.json();
        if (res.ok) {
            setNewComment('');
            setComments([data, ...comments]); // Correctly spread the comments array
        } else {
            console.error(data.message);
        }
    };

    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await fetch(`/api/v1/comment/getcomments/${postId}`);
                const data = await res.json();
                if (res.ok) {
                    setComments(data);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        getComments();
    }, [postId]);

    const handleLike = async (commentId) => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        const res = await fetch(`/api/v1/comment/like/${commentId}`, {
            method: 'PUT',
        });
        if (res.ok) {
            const data = await res.json();
            setComments(
                comments.map((comment) =>
                    comment._id === commentId
                        ? { ...comment, likes: data.likes, noOfLikes: data.likes.length }
                        : comment
                )
            );
        }
    };

    const handleEdit = (comment, editedContent) => {
        setComments(comments.map((c) => 
            c._id === comment._id ? { ...c, content: editedContent } : c
        ));
    };

    const handleDeletede = async(commentId)=>{

        if(!currentUser){
         navigate('/login');
         return
        }
        try {
         const res = await fetch(`/api/v1/comment/delete/${commentId}`, {
           method : 'DELETE'
         })
       if(res.ok){
         const data= await res.json();


            setComments(comments.filter((comment)=>comment._id  !== commentId));     
        
       }
        } catch (error) {
         
        }
      }

    return (
        <div className='mx-auto w-full max-w-2xl mt-5'>
            {currentUser ? (
                <div className='flex items-center '>
                    <p className='text-gray-500'>Signed in as:</p>
                    <img src={currentUser.profilePicture} className='w-5 h-6 object-cover rounded-full' alt='profile' />
                    <p className='text-xs text-teal-500 underline cursor-pointer'>@{currentUser.username}</p>
                </div>
            ) : (
                <div>
                    Sign in first!
                    <Link to={'/login'} className='text-teal-500 underline cursor-pointer'>
                        Sign In
                    </Link>
                </div>
            )}

            {currentUser && (
                <form onSubmit={handleSubmit} className='border-2 border-teal-500 rounded-tl-xl flex flex-col p-5'>
                    <textarea
                        cols='30'
                        rows='4'
                        maxLength='200'
                        className='w-full sm:w-auto px-4 py-2 sm:px-0 resize-none'
                        onChange={(e) => setNewComment(e.target.value)} // Use newComment state
                        value={newComment}
                    ></textarea>

                    <div className='flex sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4'>
                        <h1 className='text-sm'>{200 - newComment.length} characters remaining</h1>
                        <button className='bg-gray-600 text-white p-2 rounded-md cursor-pointer' type='submit'>
                            Submit
                        </button>
                    </div>
                </form>
            )}

            {comments.length === 0 ? (
                <h1 className='text-sm my-5'>No comments yet!</h1>
            ) : (
                <>
                    <div className='mt-3 flex justify-start items-center'>
                        <p>
                            comments <span className='border-2 p-[1px] px-1 border-gray-500 rounded-md'>{comments.length}</span>
                        </p>
                    </div>

                    {comments.map((comment) => (
                        <Comment key={comment._id} comment={comment} onLike={handleLike} onEdit={handleEdit} onDelete={handleDeletede}/>
                    ))}
                </>
            )}
        </div>
    );
};

export default CommentSection;
