import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import useAuthUser from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api.js';
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Window,
  Thread
} from 'stream-chat-react'
import toast from 'react-hot-toast';
import { StreamChat } from 'stream-chat';
import ChatLoader from '../components/ChatLoader.jsx';
import "stream-chat-react/dist/css/v2/index.css"
import CallButton from '../components/CallButton.jsx';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY

const ChatPage = () => {

  const { id:targetUserId } = useParams()

  const [loading,setLoading] =  useState(true);
  const [chatClient,setChatClient] = useState(null)
  const [channel,setChannel] = useState(null)


  const {authUser} = useAuthUser()

  const {data:tokenData} = useQuery({
    queryKey:["streamToken"],
    queryFn:getStreamToken,
    enabled:Boolean(authUser) // this query will run only when the authUser is fetched
  })

  useEffect(()=>{

    const initChat = async ()=>{

      if(!authUser || !tokenData?.token){
        return;
      }

      try {
        
        console.log("Initialising the channel")

        const client = StreamChat.getInstance(STREAM_API_KEY)

        await client.connectUser({
          id:authUser._id,
          name:authUser.fullName,
          image:authUser.profilePic
        },
        tokenData.token
      )

        const channelId = [authUser._id,targetUserId].sort().join("-")
        
        const currChannel = client.channel("messaging",channelId,{
          members:[authUser._id,targetUserId]
        })

        await currChannel.watch()

        setChannel(currChannel)
        setChatClient(client)

      } catch (e) {
        console.log("Error in initialising meassage chat ",e)
      }
      finally{
        setLoading(false)
      }
    }

    initChat()
  },[tokenData,authUser,targetUserId])

   const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if(loading || !chatClient || !channel) return <ChatLoader></ChatLoader>

  
  return (
    <div className='h-[93vh] ' >

      <Chat client={chatClient}
      
      >
        <Channel channel={channel}
        >

          
          <div className=' w-full relative'> 
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader/>
              <MessageList/>
              <MessageInput />
            </Window>
          </div>

          <Thread></Thread>
        </Channel>
      </Chat>
    </div>
  )
}

export default ChatPage