import React from 'react'

const CalltoAction = () => {
  return (
    <div className='flex flex-col justify-center items-center p-8 md:flex-row border-2 border-teal-500 rounded-tl-3xl
    rounded-br-3xl text-center md:space-x-28'> 
         <div className=' flex justify-center items-center flex-col '>
            <h1 className='text-2xl'>Want to learn more about Javascript?</h1>  
            <p className='text-gray-500 my-2' >Checkout resources with 100 projects</p>

            <button className='w-80 bg-gray-700 text-white rounded-tl-xl rounded-br-md cursor-pointer h-8'>
                100 Javascript Projects
            </button>
            </div>
            <div className='mt-8 '>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1DmLCy9PSJfFqO55mNTYOQLx3x8THsbokkw&s" className='md:h-80' />
            </div>

     
    </div>
  )
}

export default CalltoAction