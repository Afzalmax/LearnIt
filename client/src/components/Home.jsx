import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import './Home.css'
import quote from '../assets/quotes.png'
import Footer from './Footer'
const Home = () => {  
  return (
    <>
    <Navbar/>
    <div className='bg-peach'>
    <h1 className="flex items-center justify-center font-bold text-green-900 text-4xl animate-slide-in">L E A R N I T</h1>
    <h3 className="mt-3 flex items-center justify-center font-bold text-green-900 text-2xl animate-fade-in">YOUR ONESTOP LEARNING PLATFORM</h3>
    <div className="p-10 grid grid-cols-3 gap-20">
<div className="rounded bg-white overflow-hidden shadow-lg">
  <div className="px-6 py-4">
    <div className="font-bold text-green-900 text-xl mb-2">WHO ARE WE AND WHAT WE PROVIDE?</div>
    <p className="text-gray-700 text-base">
      WE ARE BASICALLY AN EDUCATIONAL SERVICE PROVIDER. INSTEAD OF SHARING IT TO YOUR FRIEND SHARE YOUR LEARNING MATERIALS HERE AND ALSO USE MATERIALS POSTED BY OTHERS.
    </p>
  </div>
</div>
<div className="rounded bg-white overflow-hidden shadow-lg">
  <div className="px-6 py-4">
    <div className="font-bold text-green-900 text-xl mb-2">WHAT'S LEARNIT?</div>
    <p className="text-gray-700 text-base">
      LEARNIT IS A PLACE WHERE YOU CAN LEARN WHAT YOU WANT TO LEARN. YOU CAN SEARCH AND DOWNLOAD THE MATERIALS YOU WANT. YOU CAN ALSO POST THE MATERIALS YOU HAVE TO HELP OTHERS.
    </p>
  </div>
  </div>
  <div className="rounded bg-white overflow-hidden shadow-lg">
  <div className="px-6 py-4">
    <div className="font-bold text-green-900 text-xl mb-2">WHY LEARNING IS IMPORTANT?</div>
    <p className="text-gray-700 text-base">
    MOST OF US WANT TO WORK FOR A BIG MNC AND TO EARN MORE MONEY, BUT ARE OUR EFFORTS SUFFICIENT? ASK YOURSELF.LEARNING IS A NEVER-ENDING PROCESS. DO IT WITH HAPPINESS!
    </p>
</div>
</div>
    </div>
    <div className="mt-5 flex justify-center">
    {localStorage.getItem('token') ? (
    <Link to="/feed">
      <button className="bg-green-900 text-white font-bold py-2 px-4 rounded hover:bg-green-700">CHECK OUT OUR MATERIALS</button>
    </Link>
  ) : (
    <Link to="/login">
      <button className="bg-green-900 text-white font-bold py-2 px-4 rounded hover:bg-green-700">CHECKOUT OUR MATERIALS</button>
    </Link>
  )} 
  </div>
  <div className='flex space-x-2'>
  <div className='mx-20 mt-20 w-[500px] h-[500px]' >
      <img src={quote}/>
    </div>
    <h4 className='text-green-900 text-2xl mt-40 text1'>STUDYING DOESN'T HAVE ANY AGE LIMIT. PUSH YOURSELF <br></br>ACROSS LIMITS. </h4>
    </div>
     </div>
     <Footer/>
    </>
    
  )
}

export default Home
