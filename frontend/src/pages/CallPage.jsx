import React from 'react'
import { useNavigate, useParams } from 'react-router'
import useAuthUser from '../hooks/useAuthUser'
import { useQuery } from '@tanstack/react-query'
import { getStreamToken } from '../lib/api.js'
import {
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  StreamTheme,
  SpeakerLayout,
  CallControls
} from '@stream-io/video-react-sdk';
import PageLoader from '../components/PageLoader.jsx'
import { useState,useEffect } from 'react'
import "@stream-io/video-react-sdk/dist/css/styles.css";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY

const CallPage = () => {

  const {id:callId} = useParams()

  const [client,setClient] = useState(null)
  const [call,setCall] = useState(null)
  const [isConnecting,setIsConnecting] = useState(true)

  const {authUser,isLoading} =useAuthUser()

  const {data:tokenData} = useQuery({
    queryKey:["streamToken"],
    queryFn:getStreamToken,
    enabled:Boolean(authUser)
  })

  useEffect(()=>{

    const initCall = async ()=>{
      if(!authUser || !tokenData?.token || !callId) return

      try {
        console.log("Initialising video call")

        const user = {
          id:authUser._id,
          name:authUser.fullName,
          image:authUser.profilePic
        }

        const videoClient = new StreamVideoClient({
          apiKey:STREAM_API_KEY,
          user,
          token:tokenData?.token
        })

        const callInstance = videoClient.call("default",callId)

        await callInstance.join({create:true})

        setClient(videoClient)
        setCall(callInstance)
      } catch (error) {
        console.log("Error in initialising call", e)
      }
      finally{
        setIsConnecting(false)
      }
    }

    initCall()
  },[tokenData,authUser,callId])

  if(isLoading || isConnecting) return <PageLoader/>
  return (
    <div className="h-screen flex flex-col items-center justify-center">

      <div className="relative">

        {
          call && client ? (
            <StreamVideo client={client}>
              <StreamCall call={call}>
                <CallContent />
              </StreamCall>
            </StreamVideo>
          ) : 
          (<div className="flex items-center justify-center h-full">
            <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )
        }
      </div>
    </div>
  )
}

export default CallPage

const CallContent = ( )=>{

  const {useCallCallingState} = useCallStateHooks()

  const callingState = useCallCallingState()

  const navigate = useNavigate()

  if(callingState === CallingState.LEFT) navigate("/")

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  )
}