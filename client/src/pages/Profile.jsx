import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { SignoutSuccess, deleteFailure, deleteSuccess, signInFailure, signoutFailure, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/reducers/userSlice';
import app from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [update, setUpdateSuccess] = useState(false);
  const { currentUser, loading } = useSelector((state) => state.user);
  const filePickerRef = useRef();
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageUploadingProgress, setImageUploadProgress] = useState(null);
  const [imageUploadingProgressError, setImageUploadProgressError] = useState(null);
  const dispatch = useDispatch();
const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      return;
    }
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/v1/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(updateUserFailure());
        setError(data.message || 'User update failed');
      } else {
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
        setError(false);
        setImageFileUrl(data.profilePicture); 
      }
    } catch (error) {
      dispatch(updateUserFailure(error));
      setError('An error occurred');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageUploadProgressError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageUploadProgressError('Could not upload file (file must be less than 2MB)');
        setImageUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL }); // Update formData with new image URL
        });
      }
    );
  };

  const handleDelete = async()=>{

    try {
      const res = await fetch(`/api/v1/user/delete/${currentUser._id}`,{
        method : "DELETE"
      });
      const data = await res.json();
      if(!res.ok){
        dispatch(deleteFailure(data.message));
      }else{
        dispatch(deleteSuccess(data));
        navigate('/register')
      }
    } catch (error) {
       dispatch(deleteFailure(error.message))
    }

  }

  const handleSignout = async()=>{

    try {
      const res = await fetch(`/api/v1/user/signout`,{
        method :"POST",
      });
      const data = await res.json();
      if(!res.ok){
        dispatch(signoutFailure(data.message));
      }else{
        dispatch(SignoutSuccess(data));
        navigate('/login')
      }
    } catch (error) {
       dispatch(signoutFailure(error.message))
    }

  }

  

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <div className='flex flex-col items-center justify-center h-80'>
        <h1 className='text-3xl font-serif font-bold mt-64'>Update</h1>

        <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center mt-1'>
          <input type='file' hidden accept='image/*' onChange={handleImageChange} ref={filePickerRef} />
          <div className='relative' onClick={() => filePickerRef.current.click()}>
            {imageUploadingProgress && (
              <CircularProgressbar
                value={imageUploadingProgress || 0}
                text={`${imageUploadingProgress}%`}
                strokeWidth={5}
                styles={{
                  root: {
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  },
                  path: {
                    stroke: `rgba(62, 152, 199, ${imageUploadingProgress / 100})`,
                  },
                }}
              />
            )}
            <img
              src={imageFileUrl || currentUser.profilePicture}
              alt=''
              className={`h-32 w-32 rounded-full mt-2 border-8 border-[darkgray] ${imageUploadingProgress && imageUploadingProgress < 100 && 'opacity-60'}`}
            />
          </div>
          <input
            type='text'
            placeholder='Enter Username'
            id='username'
            className='border border-black rounded-lg w-72 h-8 mt-5'
            defaultValue={currentUser.username}
            onChange={handleChange}
          />
          <input
            type='email'
            placeholder='Enter Email here'
            id='email'
            className='border border-black rounded-lg w-72 h-8 mt-8'
            defaultValue={currentUser.email}
            onChange={handleChange}
          />
          <input
            type='password'
            placeholder='Enter password'
            id='password'
            className='border border-black rounded-lg w-72 h-8 mt-8'
            onChange={handleChange}
          />
          <button
            type='submit'
            className='text-white py-2 border-2 rounded-lg mt-8 w-72 bg-gray-700 hover:bg-gray-500 transition ease-in-out delay-100'
            disabled={loading || imageUploadingProgress}>
             {loading ? 'loading...' : "Update"}
          </button>
          {currentUser.isAdmin && (
            <div>
         <Link to={'/post'}>
                 <button
            type='button'
            className='text-white py-2 border-2 rounded-lg mt-8 w-72 bg-gray-800 hover:bg-gray-500 transition ease-in-out delay-100'
           >
           
              create post 
            
          </button>
          </Link>
            </div>
          )}
          <div className='flex items-start justify-between mt-2'>
            <h1 className='text-red-700 mr-24 cursor-pointer' onClick={handleDelete}>Delete account</h1>
            <h1 className='text-red-700 cursor-pointer' onClick={handleSignout}>Sign out</h1>
          </div>
        </form>
        {error && <h1 className='text-red-500'>{error}</h1>}
        {update && <h1 className='text-green-500'>User updated successfully!</h1>}
        {imageUploadingProgressError && <h1 className='text-red-500'>{imageUploadingProgressError}</h1>}
      </div>
    </div>
  );
};

export default Profile;
