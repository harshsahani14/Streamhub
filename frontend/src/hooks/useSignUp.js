import React from 'react'
import { useMutation,useQueryClient } from '@tanstack/react-query'
import { signup } from '../lib/api.js'

const useSignUp = () => {
    
    const queryClient = useQueryClient()
  
    const { mutate:signUpMutation,isPending,error } = useMutation({
        mutationFn: signup,
        onSuccess:()=> queryClient.invalidateQueries({queryKey : ["authUser"]})
    })

    return {signUpMutation,isPending,error}

}

export default useSignUp