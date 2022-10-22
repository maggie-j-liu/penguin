import type { Event as EventType } from "@prisma/client";
const Event = ({ event }: { event: EventType }) => {
  return (
    <div className="py- bg-gray-200 px-4">
      <h2>{event.name}</h2>
    </div>
  );
};

export default Event;
