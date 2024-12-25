//"use client"
//import { useSession } from 'next-auth/react';
import { auth } from '@/auth';
import React from 'react'

export default async function Home() {
  //const { data: session } = useSession();
  const session = await auth();
  console.log(session);
  
  return (
    <div>Home</div>
  )
}
