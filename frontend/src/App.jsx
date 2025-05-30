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
import PageLoader from './components/PageLoader.jsx'
import useAuthUser from './hooks/useAuthUser.js'

const App = () => {

  const { isLoading,authUser } = useAuthUser()
  
  if(isLoading) return <PageLoader></PageLoader>

  const isAuthenticated = Boolean(authUser);
  const isOnBoarded = authUser?.isOnBoarded;

  return (
    <div data-theme="forest" >

      <Routes>

      
        <Route path='/' element={isAuthenticated && isOnBoarded 
          ? <HomePage/> : 
          <Navigate to={ !isAuthenticated ? "/login" : "/onboarding"  }/>
          }>   
          </Route>
        <Route path='/login' element={!isAuthenticated ? <LoginPage/> :  <Navigate to={"/"}></Navigate> }></Route>
        <Route path='/signup' element={!isAuthenticated ? <SignUpPage/> :  <Navigate to={"/"}></Navigate>}></Route>
        <Route path='/notifications' element={isAuthenticated ? <NotificationsPage/> : <Navigate to={"/login"}></Navigate>}></Route>
        <Route path='/call' element={isAuthenticated ?<CallPage/> : <Navigate to={"/login"}></Navigate>}></Route>
        <Route path='/chat' element={isAuthenticated ? <ChatPage/> : <Navigate to={"/login"}></Navigate>}></Route>
        <Route path='/onboarding' element={isAuthenticated ? <OnboardingPage/> : <Navigate to={"/login"}></Navigate>}></Route>

      </Routes>

      <Toaster/>
    </div>

    
  )
}

export default App