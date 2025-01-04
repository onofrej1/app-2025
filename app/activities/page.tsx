'use client'

import { getActivities } from '@/actions/activities';
import { parse } from '@/actions/gpsparser';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import React, { useRef } from 'react'

export default function Activities() {
  const { data: activities = [], isFetching } = useQuery({
    queryKey: ['activities'],
    queryFn: getActivities,    
  });

  if (isFetching) return null;    

  return (
    <div>
      {activities.map(activity => {
        return (
          <div key={activity.id} className='flex justify-between space-y-1'>
            <div>{activity.name}{' '}
            ({new Date(activity.date).toLocaleDateString()})
            </div>
            <div>
              <Button onClick={() => {}} >Show activity</Button>
            </div>
          </div>
          );
      })}
      {/*<Map address='Ovručská 697/11, 040 22 Košice' coords={activities[0].activityData} />*/}
    </div>  
  );
}