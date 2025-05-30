import React, { useState } from 'react'
import useAuthUser from '../hooks/useAuthUser'

const OnboardingPage = () => {

  const {authUser} = useAuthUser();
  
  const [formState,setFormState] = useState({
    fullName:authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage : authUser?.nativeLanguage || "",
    learningLanguage : authUser?.learningLanguage || "",
    profilePic : authUser?.profilePic || "",
    location : authUser?.location || ""
  })
  return (
    <div>OnboardingPage</div>
  )
}

export default OnboardingPage