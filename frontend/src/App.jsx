import React from 'react'
import { Navigate, Route,  Routes } from 'react-router'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import NotificationsPage from './pages/NotificationsPage.jsx'
import CallPage from './pages/CallPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx'
import { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { axiosInsance } from './lib/axios.js'


const App = () => {

  const { data:authData,error,isLoading } = useQuery({
    queryKey:["authUser"],
    queryFn: async ()=>{
      const res = await axiosInsance.get("/auth/me")
      return res.data
    },
    retry:false
  })

  const authUser = authData?.user

  return (
    <div data-theme="forest" >

      <Routes>

      
        <Route path='/' element={authUser ? <HomePage/> : <Navigate to={"/login"}></Navigate>}></Route>
        <Route path='/login' element={!authUser ? <LoginPage/> :  <Navigate to={"/"}></Navigate> }></Route>
        <Route path='/signup' element={!authUser ? <SignUpPage/> :  <Navigate to={"/"}></Navigate>}></Route>
        <Route path='/notifications' element={authUser ? <NotificationsPage/> : <Navigate to={"/login"}></Navigate>}></Route>
        <Route path='/call' element={authUser ?<CallPage/> : <Navigate to={"/login"}></Navigate>}></Route>
        <Route path='/chat' element={authUser ? <ChatPage/> : <Navigate to={"/login"}></Navigate>}></Route>
        <Route path='/onboarding' element={authUser ? <OnboardingPage/> : <Navigate to={"/login"}></Navigate>}></Route>

      </Routes>

      <Toaster/>
    </div>

    
  )
}

export default App