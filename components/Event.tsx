import type { Event as EventType } from "@prisma/client";
import Link from "next/link";
import { formatDate } from "../lib/formatDate";
const Event = ({ event }: { event: EventType }) => {
  return (
    <Link href={`/event/${event.id}/manage`}>
      <a>
        <div className="h-full border-4 border-black py-2 px-4 duration-150 hover:bg-black hover:text-white">
          <h2 className="text-lg font-semibold">{event.name}</h2>
          <span>{formatDate(event.date)}</span>
        </div>
      </a>
    </Link>
  );
};

export default Event;
