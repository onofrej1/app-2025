import { CalendarEvent, useCalendar } from "@/components/calendar";
import { useDialog } from "@/state";
import { cn } from "@/utils";
import { cva } from "class-variance-authority";
import { format, isSameMonth, isToday } from "date-fns";
import React from "react";

export default function renderCell(
  _date: Date,
  currentEvents: CalendarEvent[]
) {
  const { open, setTitle, setContent, onClose } = useDialog();
  const { date } = useCalendar();
  const monthEventVariants = cva("size-2 rounded-full", {
    variants: {
      variant: {
        default: "bg-primary",
        blue: "bg-blue-500",
        green: "bg-green-500",
        pink: "bg-pink-500",
        purple: "bg-purple-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  });

  const showAddEventModal = (e: any) => {
    console.log(e);
    const date = new Date(e);
    //setSelectedDate(date);
    const data = {
      startDate: date,
      endDate: date,
      status: 'new event',
    };
    
    setTitle("Add event");
    //setContent(addEventForm(data));
    open();
  };

  const handleDateClick = (e: any) => {};

  const handleEventClick = (e: any) => {};

  return (
    <>
      <span
        className={cn(
          "size-6 grid place-items-center rounded-full mb-1 sticky top-0",
          isToday(_date) && "bg-primary text-primary-foreground"
        )}
      >
        {format(_date, "d")}
      </span>

      {currentEvents.map((event) => {
        return (
          <div
            onClick={() => handleEventClick(event)}
            key={event.id}
            className="px-1 rounded text-sm flex items-center gap-1 hover:cursor-pointer"
          >
            <div
              className={cn(
                "shrink-0",
                monthEventVariants({ variant: event.color })
              )}
            ></div>
            <span className="flex-1 truncate">{event.title}</span>
            <time className="tabular-nums text-muted-foreground/50 text-xs">
              {format(event.start, "HH:mm")}
            </time>
          </div>
        );
      })}
    </>
  );
}
