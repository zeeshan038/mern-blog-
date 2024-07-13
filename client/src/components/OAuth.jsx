import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import app from '../firebase';
import { useDispatch } from 'react-redux';
import { signInFailure, signInSuccess } from '../redux/reducers/userSlice';
import { useNavigate } from 'react-router-dom';
const OAuth = () => {
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogle = async(e)=>{
        const provider = new GoogleAuthProvider();

        provider.setCustomParameters({prompt : 'select_account'});
        try {
            const resultFromGoogle = await signInWithPopup(auth , provider);
    
            const res = await fetch("/api/v1/user/google" ,{
                method : "POST" , 
                headers :{
                    "Content-Type" : "application/json",
                },
                body : JSON.stringify({
                    name : resultFromGoogle.user.displayName , 
                    email : resultFromGoogle.user.email , 
                    googlePhotoUrl : resultFromGoogle.user.photoURL,
                }),
            })
            const data = await res.json();
            if(!res.ok){
                dispatch(signInFailure());
            }
            dispatch(signInSuccess(data));
            navigate('/');
        } catch (error) {
            dispatch(signInFailure());
        }

    }
  return (
    <div>
        <button onClick={handleGoogle} className='bg-gray-500 hover:bg-gray-800 text-white mt-5 w-64 md:w-96 h-10 rounded-md'>Continue with google</button>
    </div>
  )
}

export default OAuth