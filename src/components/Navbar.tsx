'use client'

import React from 'react'
import { useSession , signOut} from 'next-auth/react'
import Link from 'next/link'
import { User } from 'next-auth'
import { Button } from "@/components/ui/button"



export default function Navbar() {

    const {data:session} = useSession()
    const user : User  = session?.user as User

  return (
    <nav>
        <div className='flex flex-wrap items-center justify-between p-4 gap-2'>
            <link
          href="https://fonts.googleapis.com/css2?family=Delius+Unicase&display=swap"
          rel="stylesheet"
        />
            
            {
                session ? (
                    <>
                    <span className=''>Welcome, <span className='capitalize'>{user?.username || user?.email}</span>
                    </span>
                    </>
                ) : (<></>)
            }
            <a href="#" style={{fontFamily: "Delius Unicase"}} className='font-extrabold'>Togetha</a>

            {
                session ? (<><Button onClick={() => signOut()} className=''>Sign Out</Button>
                    </>) : (<>
                <Link href={"/sign-in"}>
                 <Button>Sign In</Button>
                 </Link>
                </>)
            }
        </div>
    </nav>
  )
}
