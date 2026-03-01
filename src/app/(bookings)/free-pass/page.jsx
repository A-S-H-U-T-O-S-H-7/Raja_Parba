"use client";
import FreePassForm from '@/components/freePassRegistration/FreePassForm'
import React from 'react'
import ProtectedRoute from '@/components/ProtectedRoute';



function page() {
    
  
  return (
    <div>
      <ProtectedRoute>
      
     
      <FreePassForm />
      </ProtectedRoute>
    </div>
  )
}

export default page
