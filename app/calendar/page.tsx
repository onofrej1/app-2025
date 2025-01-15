"use client";
import {
  createEvent,
  getEvent,
  getEvents,
  getOrganizers,
  getVenues,
  updateEvent,
} from "@/actions/events";
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
import { FormField } from "@/resources/resources.types";
import { useDialog } from "@/state";
import { cn, getSelectOptions } from "@/utils";
import { Event } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import React from "react";
import { format, isToday } from "date-fns";

export default function CalendarPage() {
  const { open, setTitle, setContent, onClose } = useDialog();
  const { value: organizers = [] } = useAsync(getOrganizers);
  const { value: venues = [] } = useAsync(getVenues);

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

  if (isFetching) return null;

  const sendForm = (data: Event) => {
    data.id ? updateEvent(data) : createEvent(data);
    onClose();
  };

  const openEditEventModal = async (event: CalendarEvent) => {
    const data = await getEvent(Number(event.id));
    setTitle("Edit event");
    setContent(eventForm(data));
    open();
  };

  const openAddEventModal = (date: Date) => {
    const data = {
      startDate: date,
      endDate: date,
      status: "New event",
    };
    setContent(eventForm(data));
    open();
  };

  const renderCell = (_date: Date, currentEvents: CalendarEvent[]) => {
    return (
      <div className="relative">
        <span
          className="bg-slate-200 hover:cursor-pointer absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center p-0"
          onClick={() => openAddEventModal(_date)}
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
              onClick={() => openEditEventModal(event)}
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

  const eventForm = (data?: Partial<Event>) => {
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
    <Calendar events={events} renderCell={renderCell}>
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
