import React, { useState } from 'react'
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import { getOutgoingFriends, getRecommendedUsers, getUserFriends, sendFriendRequest } from '../lib/api.js'
import { useEffect } from 'react'
import { Link } from 'react-router'
import { UsersIcon,MapPinIcon,CheckCircleIcon,UserPlusIcon } from 'lucide-react'
import FriendCard from '../components/FriendCard.jsx'
import NoFriendsFound from '../components/NoFriendsFound.jsx'
import { getLanguageFlag } from '../components/FriendCard.jsx'
import { capitialize } from '../lib/utils.js'

const HomePage = () => {

  const queryClient = useQueryClient()
  const [outGoingRequestsIds,setOutGoingRequestsIds] = useState(new Set())

  // useQuery for get methods
   // useMutatae for post put and delete methods

  const {data:friends=[],isLoading:loadingFriends} = useQuery({
    queryKey:"friends",
    queryFn:getUserFriends
  })

  const {data:recommendedUsers=[],isLoading:loadingUsers} = useQuery({
    queryKey:"users",
    queryFn:getRecommendedUsers
  })
  
  const {data:outgoingFriendReqs=[]} = useQuery({
    queryKey:"outgoingFriendReqs",
    queryFn:getOutgoingFriends
  })
  
   const {mutate:sendRequestMutation,isPending}= useMutation({
    mutationFn:sendFriendRequest,
    onSuccess : ()=> queryClient.invalidateQueries({ queryKey:["outgoingFriendReqs"] })
   })

   useEffect(()=>{

    const outGoingReqs = new Set()

    if(outgoingFriendReqs && outgoingFriendReqs.length>0){
      outgoingFriendReqs.forEach(req => {
        outGoingReqs.add(req.recipient._id)
      });
    }

    setOutGoingRequestsIds(outGoingReqs)

   },[outgoingFriendReqs])

  return (
      <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
          </div>

          {
            loadingFriends ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
            ) : 
            friends.length === 0 ? 
            ( <NoFriendsFound/>) 
            : 
            ( 
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {friends.map((friend) => (
                  <FriendCard key={friend._id} friend={friend} />
                ))}
              </div>
            )
          }

          <section>
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
                  <p className="opacity-70">
                    Discover perfect language exchange partners based on your profile
                  </p>
                </div>
              </div>
            </div>

            
          </section>
        </div>
      </div>
  )
}

export default HomePage