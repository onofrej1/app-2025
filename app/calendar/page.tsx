"use client";
import { getActivities } from "@/actions/activities";
import {
  createEvent,
  getEvents,
  getOrganizers,
  getVenues,
} from "@/actions/events";
//import { getActivities } from "@/actions/strava";
import {
  CalendarCurrentDate,
  CalendarDayView,
  CalendarEvent,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
  CalendarYearView,
} from "@/components/calendar";
import { Calendar } from "@/components/calendar";
import Form from "@/components/form/form";
import { Button } from "@/components/ui/button";
import useAsync from "@/hooks/useAsync";
import useFetch from "@/hooks/useFetch";
import { FormField } from "@/resources/resources.types";
import { useDialog } from "@/state";
import { cn, getSelectOptions } from "@/utils";
import { Event } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import React, { use, useState } from "react";
//import renderCell from "./components/renderCell";
import { format, isToday } from "date-fns";

export default function CalendarPage() {
  const { open, setTitle, setContent, onClose } = useDialog();
  //const [selectedDate, setSelectedDate] = useState<Date>();
  //const organizers = use(getOrganizers());
  const { loading: isLoadingOrganizers, value: organizers = [] } =
    useAsync(getOrganizers);
  const { loading: isLoadingVenues, value: venues = [] } = useAsync(getVenues);

  const { data: events = [], isFetching } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
    select: (data) => {
      const items = data.map((e) => ({
        id: e.id.toString(),
        start: e.startDate,
        end: e.endDate,
        title: e.name,
        color: "pink" as const,
      }));
      return items;
    },
  });

  /*const { data: activities = [], isFetching: isFetchingActivities } = useQuery({
    queryKey: ["activities"],
    queryFn: getActivities,
  });*/
  if (isFetching) return null;

  const sendForm = (data: Event) => {
    console.log(data);
    createEvent(data);
    onClose();
  };

  const editEventForm = (event: CalendarEvent) => {
    const ev = events.find(e => e.id === event.id);
    setTitle("Edit event");
    setContent(addEventForm(ev));
    open();
  };

  const showAddEventForm = (e: any) => {
    console.log(e);
    const date = new Date(e);
    //setSelectedDate(date);
    const data = {
      startDate: date,
      endDate: date,
      status: "new event",
    };
    //setContent(addEventForm(data));
    open();
  };

  const renderCell = (_date: Date, currentEvents: CalendarEvent[]) => {
    console.log(currentEvents);
    return (
      <div className="relative">
        <span
          className="bg-slate-200 absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center p-0"
          onClick={() => showAddEventForm(_date)}
        >
          <Plus size={12} />
        </span>
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
              onClick={() => editEventForm(event)}
              key={event.id}
              className="px-1 rounded text-sm flex items-center gap-1 hover:cursor-pointer"
            >
              <div
                className={cn(
                  "shrink-0"
                  //monthEventVariants({ variant: event.color })
                )}
              ></div>
              <span className="flex-1 truncate">{event.title}</span>
              <time className="tabular-nums text-muted-foreground/50 text-xs">
                {format(event.start, "HH:mm")}
              </time>
            </div>
          );
        })}
      </div>
    );
  };

  const addEventForm = (data?: Event) => {
    console.log('d', data);
    /*if (!data && selectedDate) {
      console.log('create data');
      data = {};
      data.startDate = selectedDate;
      data.endDate = selectedDate;
    }*/

    let fields: FormField[] = [
      { name: "name", label: "Name" },
      { name: "description", label: "Description" },
      { name: "location", label: "Location" },
      { name: "color", label: "Color" },
      { name: "status", label: "Status" },
      { name: "maxAttendees", label: "Max attendees", type: "number" },
      { name: "contact", label: "Contact" },
      { name: "description", label: "Description" },
      { name: "startDate", type: "datepicker", label: "Start date" },
      { name: "endDate", type: "datepicker", label: "End date" },
      {
        name: "organizerId",
        type: "fk",
        relation: "organizer",
        label: "Organizer",
        resource: "organizer",
        textField: "name",
        options: getSelectOptions(organizers, "name"),
      },
      {
        name: "venueId",
        type: "fk",
        relation: "venue",
        label: "Venue",
        resource: "venue",
        textField: "location",
        options: getSelectOptions(venues, "location"),
      },
    ];
    if (data?.id) {
      fields = fields.concat([{ name: "id", type: "hidden" }]);
    }

    return (
      <Form
        fields={fields}
        validation={"CreateEvent"}
        action={sendForm}
        data={data}
      >
        {({ fields }) => (
          <div>
            <div className="flex flex-col gap-3 pb-4">
              {fields.name}
              {fields.description}
              <div className="flex gap-2">
                <div className="flex-1">{fields.color}</div>
                <div className="flex-1">{fields.status}</div>
              </div>
              {fields.location}
              <div className="flex gap-2">
                <div className="flex-1">{fields.startDate}</div>
                <div className="flex-1">{fields.endDate}</div>
              </div>
              {fields.organizerId}
              {fields.venueId}
              {fields.maxAttendees}
              <Button type="submit">Save</Button>
            </div>
          </div>
        )}
      </Form>
    );
  };

  return (
    <Calendar
      //onClick={(e) => showAddEventModal(e)}
      //onEventClick={(e) => console.log(e)}
      events={events}
      renderCell={renderCell}
    >
      <div className="h-dvh py-6 flex flex-col">
        <div className="flex px-6 items-center gap-2 mb-6">
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
