"use client";
import { getEvents } from "@/actions";
import {
  CalendarCurrentDate,
  CalendarDayView,  
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
  CalendarYearView,
} from "@/components/calendar";
import { Calendar } from "@/components/calendar";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

export default function CalendarPage() {
  const { data: events = [], isFetching } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,    
    select: (data) => {
      const items = data.map(e => ({
        id: e.id.toString(),
        start: e.startDate,
        end: e.endDate,
        title: e.name,
        color: 'pink' as const
      }))
      return items;
    }
  });
  if (isFetching) return null;

  return (
    <Calendar
      onClick={(e) => console.log(e)}
      onEventClick={(e) => console.log(e)}
      events={events}
    >
      <div className="h-dvh py-6 flex flex-col">
        <div className="flex px-6 items-center gap-2 mb-6">
          {/*<CalendarViewTrigger
            className="aria-[current=true]:bg-accent"
            view="day"
          >
            Day
          </CalendarViewTrigger>*/}
          <CalendarViewTrigger
            view="week"
            className="aria-[current=true]:bg-accent"
          >
            Week
          </CalendarViewTrigger>
          <CalendarViewTrigger
            view="month"
            className="aria-[current=true]:bg-accent"
          >
            Month
          </CalendarViewTrigger>
          {/*<CalendarViewTrigger
            view="year"
            className="aria-[current=true]:bg-accent"
          >
            Year
          </CalendarViewTrigger>*/}

          <span className="flex-1" />

          <CalendarCurrentDate />

          <CalendarPrevTrigger>
            <ChevronLeft size={20} />
            <span className="sr-only">Previous</span>
          </CalendarPrevTrigger>

          <CalendarTodayTrigger>Today</CalendarTodayTrigger>

          <CalendarNextTrigger>
            <ChevronRight size={20} />
            <span className="sr-only">Next</span>
          </CalendarNextTrigger>

          {/*<ModeToggle />*/}
        </div>

        <div className="flex-1 overflow-auto px-6 relative">
          <CalendarDayView />
          <CalendarWeekView />
          <CalendarMonthView />
          <CalendarYearView />
        </div>
      </div>
    </Calendar>
  );
}
