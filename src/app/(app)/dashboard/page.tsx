'use client'
import React, { useCallback, useEffect, useState} from 'react'
import { Message} from '@/model/User'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { toast } from 'sonner'
import { User } from 'next-auth'

function page() {

  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => 
      message._id !== messageId
    ))
  } 

  // const {data : session} = useSession()
  const {data:session} = useSession()

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema)
  })

  const {register, watch, setValue} = form;

  const acceptMessages = watch("acceptMessages")

  const fetchAcceptMesssage = useCallback(async () => {
    setIsSwitchLoading(true);

    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages")
      setValue('acceptMessages', response.data.isAcceptingMessage as boolean)

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      toast("Error,",
        {description: axiosError.response?.data.message || "Failed to fetch message settings"}
      )
    } finally{
      setIsSwitchLoading(false)
    }

  }, [setValue])

  const fetchMessages = useCallback( async (refresh: boolean = false) => {
    setIsLoading(true)
    setIsSwitchLoading(false)

    try {
      const response = await axios.get<ApiResponse>("/api/get-messages")
      setMessages(response.data.messages || [])

      if(refresh){
        toast("Refreshed Messages",{description : "Showing latest messages"})
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      toast("Error, mil gya",
        {description: axiosError.response?.data.message || "Failed to fetch message settings"}
      )
    }finally{
      setIsLoading(false)
      setIsSwitchLoading(false)
    }

  },[setIsLoading, setMessages])

  useEffect(() => {
    if(!session || !session.user){
      return;
    }
    fetchMessages()
    fetchAcceptMesssage()

  }, [session, setValue, fetchAcceptMesssage, fetchMessages])

  const handleSwitchChange = async () =>{
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages",
        {acceptMessages : !acceptMessages}
      )

      setValue("acceptMessages", !acceptMessages)

      toast(response.data.message)

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      toast("Error,",
        {description: axiosError.response?.data.message || "Failed to fetch message settings"}
      )
    }
  }
  console.log("Session",session?.user)

  // Safely extract username with proper null checking
  const username = session?.user?.username  || ''

  const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : ''

  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(profileUrl)
      toast("Copied URL")
    }
  }

  // Show loading state while session is loading
  if (session === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if(!session || !session.user){
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600">You need to be logged in to access the dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-gray-200 min-h-screen p-6'>
      <div className="max-w-4xl mx-auto">
        <h2 className='text-3xl font-bold text-black mb-6'>Messages</h2>
        

        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Your Profile URL</h3>
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value={profileUrl} 
              readOnly 
              className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-50"
            />
            <button 
              onClick={copyToClipboard}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Copy
            </button>
          </div>
        </div>


        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Accept Messages</h3>
              <p className="text-gray-600 text-sm">Allow others to send you messages</p>
            </div>
            <button 
              onClick={handleSwitchChange}
              disabled={isSwitchLoading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                acceptMessages ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                acceptMessages ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>


        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Your Messages</h3>
            <button 
              onClick={() => fetchMessages(true)}
              disabled={isLoading}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No messages yet. Share your profile URL to receive messages!</p>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message._id?.toString()} className="border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-800">{message.content}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </p>
                  <button 
                    onClick={() => handleDeleteMessage(message._id?.toString() || '')}
                    className="mt-2 text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default page