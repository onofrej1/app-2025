'use client'
import { getEmailMessages } from '@/actions/google';
import { useQuery } from '@tanstack/react-query';
import React from 'react'

export default function Email() {
    const { data: mails, isFetching } = useQuery({
        queryKey: ["getEmailMessages"],
        queryFn: getEmailMessages,
        refetchOnWindowFocus: false,
        refetchInterval: 0,
      });
      if (isFetching) return null;
      console.log(mails);
    

  return (
    <div>Emails</div>
  )
}
