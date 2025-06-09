import React from 'react'
import { useSelector } from 'react-redux'

function HomePage() {
  const user =useSelector((state)=>state.user);
  console.log(user)
  
  
  
  return (
    <div>
    <h1 class="text-3xl font-bold underline">Hello {user?.fullName}!
  </h1>
  </div>
  )
}

export default HomePage