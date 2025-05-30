import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { logout } from '../lib/api.js'
import toast from 'react-hot-toast'

const useLogout = () => {

    const queryClient = useQueryClient()

    const {mutate:logoutMutation} = useMutation({
        mutationFn:logout,
        onSuccess: ()=>{
            toast.success('Logged Out Sucessfully')
            queryClient.invalidateQueries({ queryKey:["authUser"] })
        }
    })

    return {logoutMutation}
}

export default useLogout