import { getEvent } from '@/actions/events';
import React from 'react'

interface EventProps {
  params: Promise<{
    id: string;
  }>,
  //searchParams: Promise<{ [key: string]: string }>
}

export default async function Event({ params }: EventProps) {
  const { id } = await params;
  const event = await getEvent(Number(id));
  return (
    <div>Event {event.name} {event.location}</div>
  )
}
