import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Comment = ({ comment, onLike, onEdit , onDelete }) => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { currentUser } = useSelector((state) => state.user);
  const [editet , setEdited] = useState(false);
  const [modal, showModal] = useState(false);
  const navigate = useNavigate()
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/v1/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);

  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/v1/comment/edit/${comment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editedContent }),
      });
      if (res.ok) {
        setIsEditing(false);
        setEdited(true);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleModal = () => {
  
    showModal(true);
  };

  return (
    <div className="flex items-center justify-start p-4">
      <div className="flex-shrink-0 mr-3">
        <img
          src={user.profilePicture}
          className="w-10 h-10 rounded-full"
          alt="user"
        />
      </div>
      <div className="flex-1">
        <div className="font-bold text-sm truncate mr-1">
          <span>{user ? `@${user.username}` : "anonymous user"}</span>
          <span className="text-sm text-gray-400 font-light ml-2">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <textarea
              cols="70"
              rows="4"
              maxLength="200"
              className="w-full sm:w-auto px-4 py-2 sm:px-0 resize-none"
              onChange={(e) => setEditedContent(e.target.value)}
              value={editedContent}
            ></textarea>
            <div className="flex justify-end items-center gap-2">
              <button
                className="border-2 py-[2px] cursor-pointer px-3 rounded-md bg-gray-600 text-white hover:bg-white hover:text-black"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="border-2 py-[2px] cursor-pointer px-3 rounded-md"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{comment.content}</p>
            <div className="border-b-2 text-gray-400 flex items-center gap-2 text-sm p-2">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`text-sm cursor-pointer hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp />
              </button>
              <p className="text-sm">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                 <>
                  <button
                    onClick={handleEdit}
                    className="text-sm hover:text-blue-600 cursor-pointer"
                  >
                    {
                      editet ? <span className="text-gray-800">Edited</span>  : "   Edit"
                    }
                 
                  </button>
                    <button
                    onClick={handleModal}
                    className="text-sm hover:text-red-600 cursor-pointer" 
                  >
                     Delete
                 
                  </button></>
                )}
            </div>
          </>
        )}
           {modal && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
          <div className='bg-white p-6 rounded shadow-lg'>
            <h1 className='mb-4'>Are you sure you want to delete?</h1>
            <div className='flex justify-center'>
              <button
                className='bg-red-500 text-white px-4 py-2 mr-2 rounded'
                onClick={()=> onDelete(comment._id)}
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
    </div>
  );
};

export default Comment;
