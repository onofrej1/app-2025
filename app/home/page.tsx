"use client"
//import { useSession } from 'next-auth/react';
import { auth } from '@/auth';
import FileUploader from '@/components/form/filesUpload';
import React from 'react'

export default function Home() {
  //const { data: session } = useSession();
  /*const session = await auth();
  console.log(session);*/
  
  return (
    <div>Home

      <FileUploader />
    </div>
  )
}
