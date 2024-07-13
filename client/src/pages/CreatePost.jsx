import React, { useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import app from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const [imageError, setImageError] = useState(null);
  const [imageUploadingProgress, setImageUploadProgress] = useState(null);
  const [formData, setFormData] = useState({ title: '', category: '', image: '', content: '' });
  const [file, setFile] = useState(null);
  const [formError, setFormError] = useState(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);  

    const navigate = useNavigate();
  console.log(formData);

  const handleImage = async () => {
    if (!file) {
      setImageError("Please provide an image");
      return;
    }
    const storage = getStorage(app);
    const filename = new Date().getTime() + file.name;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress);
      },
      (error) => {
        setImageError("Image upload failed");
        setImageUploadProgress(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUploadProgress(null);
          setImageError(null);
          setFormData({ ...formData, image: downloadURL });
          setIsImageUploaded(true);
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!isImageUploaded) {
      setFormError("Please upload an image first");
      return;
    }
  
    try {
      const res = await fetch("/api/v1/post/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      console.log("Server response data:", data);
  
      if (!res.ok) {
        setFormError(data.message);
      } else {
        setFormError(null);
        if (data.slug) {
          navigate(`/post/${data.slug}`);
        } else {
          setFormError("No slug returned from server");
        }
      }
    } catch (error) {
      setFormError("An error occurred");
    }
  };
  


  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <input
            type="text"
            placeholder='Title'
            id='title'
            name='title'
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className='w-[100%] border-2 h-10 rounded-md'
          />
          <select
            name="category"
            id='category'
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className='w-[30%] h-10 rounded-md border-4 border-teal-600'
          >
            <option value="">Select a Category</option>
            <option value="React">React</option>
            <option value="JavaScript">JavaScript</option>
          </select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} accept='image/*' />
          <button type='button' className='border-2 border-black rounded-md font-semibold cursor-pointer' onClick={handleImage}>Upload Image</button>
        </div>
        {imageUploadingProgress !== null && (
          <div className='w-16 h-16'>
            <CircularProgressbar value={imageUploadingProgress} text={`${Math.round(imageUploadingProgress)}%`} />
          </div>
        )}
        {formData.image && (
          <img src={formData.image} alt="cover" className='w-full h-72 object-cover' />
        )}
        <ReactQuill theme="snow" value={formData.content} onChange={(value) => setFormData({ ...formData, content: value })} placeholder='Write something here...' className='h-72 mb-12' required />
        <button type='submit' className='text-white py-2 border-2 rounded-lg mt-1 w-[100%] bg-gray-800 hover:bg-gray-500 transition ease-in-out delay-100'>
          Publish
        </button>
      </form>
      {imageError && <div className='text-red-500'>{imageError}</div>}
      {formError && <div className='text-red-500'>{formError}</div>}
    </div>
  );
};

export default CreatePost;
