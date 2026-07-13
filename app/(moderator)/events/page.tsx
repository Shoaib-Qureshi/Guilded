import { Users } from "lucide-react";

import {
  card,
  dangerButton,
  goldButton,
  input,
  label,
  panel,
} from "@/components/moderator/ui";
import { cancelEvent, createEvent } from "@/lib/moderator/actions";
import { getAllEvents } from "@/lib/moderator/queries";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<string, string> = {
  upcoming: "bg-portal-green/15 text-portal-green",
  cancelled: "bg-portal-red/15 text-portal-red",
  completed: "bg-portal-cream/10 text-portal-muted",
};

export default async function EventsPage() {
  const events = await getAllEvents();

  return (
    <div className="flex flex-col gap-6">
      <section className={panel}>
        <div className="border-b border-portal-cream/8 px-6 py-5">
          <h1 className="text-[15px] font-semibold text-portal-cream">
            Create new event
          </h1>
        </div>
        <form action={createEvent} className="grid grid-cols-2 gap-4 p-6">
          <div className="col-span-2">
            <label htmlFor="title" className={label}>
              Title
            </label>
            <input
              id="title"
              name="title"
              required
              className={input}
              placeholder="Guild 08 Monthly Meeting"
            />
          </div>
          <div className="col-span-2">
            <label htmlFor="description" className={label}>
              Description
            </label>
            <input
              id="description"
              name="description"
              required
              className={input}
              placeholder="What the session covers"
            />
          </div>
          <div>
            <label htmlFor="hostName" className={label}>
              Host
            </label>
            <input
              id="hostName"
              name="hostName"
              required
              className={input}
              placeholder="Marcus V."
            />
          </div>
          <div>
            <label htmlFor="category" className={label}>
              Category
            </label>
            <input
              id="category"
              name="category"
              className={input}
              placeholder="Guild Meeting"
            />
          </div>
          <div>
            <label htmlFor="scheduledAt" className={label}>
              Date &amp; time
            </label>
            <input
              id="scheduledAt"
              name="scheduledAt"
              type="datetime-local"
              required
              className={cn(input, "[color-scheme:dark]")}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="durationMinutes" className={label}>
                Duration (min)
              </label>
              <input
                id="durationMinutes"
                name="durationMinutes"
                type="number"
                min={1}
                defaultValue={60}
                required
                className={input}
              />
            </div>
            <div>
              <label htmlFor="seatLimit" className={label}>
                Seats (optional)
              </label>
              <input
                id="seatLimit"
                name="seatLimit"
                type="number"
                min={1}
                className={input}
                placeholder="Unlimited"
              />
            </div>
          </div>
          <div className="col-span-2 flex justify-end">
            <button className={goldButton}>Create event</button>
          </div>
        </form>
      </section>

      <section className={panel}>
        <div className="flex items-center justify-between border-b border-portal-cream/8 px-6 py-5">
          <h2 className="text-[15px] font-semibold text-portal-cream">
            All events <span className="text-portal-muted">({events.length})</span>
          </h2>
        </div>
        <div className="flex flex-col gap-4 p-6">
          {events.map((event) => (
            <div
              key={event.id}
              className={cn(card, "flex items-center justify-between gap-6")}
            >
              <div className="w-28 shrink-0">
                <p className="text-sm font-bold text-portal-cream">
                  {event.scheduledAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="text-[11px] text-portal-muted">
                  {event.scheduledAt.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}{" "}
                  · {event.durationMinutes}m
                </p>
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-portal-cream">
                  {event.title}
                </p>
                <p className="text-xs text-portal-muted">{event.description}</p>
                <p className="mt-1 text-xs text-portal-faint">
                  Hosted by {event.hostName}
                  {event.category && ` · ${event.category}`}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[13px] text-portal-cream">
                <Users className="size-4 text-portal-muted" />
                {event._count.rsvps}
                {event.seatLimit ? ` / ${event.seatLimit}` : ""} RSVP
              </div>

              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px]",
                  STATUS_TONE[event.status]
                )}
              >
                {event.status}
              </span>

              {event.status === "upcoming" ? (
                <form action={cancelEvent.bind(null, event.id)}>
                  <button className={dangerButton}>Cancel</button>
                </form>
              ) : (
                <span className="w-[86px]" />
              )}
            </div>
          ))}

          {events.length === 0 && (
            <p className="py-6 text-center text-sm text-portal-muted">
              No events yet — create one above.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
