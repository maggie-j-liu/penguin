import { Event, Participant as ParticipantType } from "@prisma/client";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import PageLayout from "../../../components/PageLayout";
import { authOptions } from "../../api/auth/[...nextauth]";
import prisma from "../../../lib/prisma";
import { formatDate } from "../../../lib/formatDate";
import { useState } from "react";

type EventWithParticipants = Event & { participants: ParticipantType[] };
const EventDashboard = ({ event }: { event: EventWithParticipants }) => {
  const numRegistrations = event.participants.length;
  const [participants, setParticipants] = useState(event.participants);
  const changeCheckIn = async (id: string, checkedIn: boolean) => {
    console.log("changeCheckIn", participants);
    const newParticipants = participants.map((participant) => {
      if (participant.id === id) {
        return {
          ...participant,
          checkedIn,
        };
      }
      return participant;
    });

    setParticipants(newParticipants);
    await fetch("/api/event/participant/change-check-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        participantId: id,
        checkedIn,
      }),
    });
  };
  return (
    <PageLayout>
      <div className="mx-auto max-w-5xl text-xl">
        <h1 className="text-center text-5xl font-bold">{event.name}</h1>
        <p className="text-center text-2xl font-semibold text-gray-400">
          {formatDate(event.date)}
        </p>
        <section>
          <h2 className="text-2xl font-medium">
            {numRegistrations} Registration{numRegistrations === 1 ? "" : "s"}
          </h2>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="[&>*]:border [&>*]:px-2 [&>*]:py-1 [&>*]:text-start">
                <th>Name</th>
                <th>Age</th>
                <th>Email</th>
                <th>Waiver Signed</th>
                <th>Checked In</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant) => (
                <tr
                  className="[&>*]:border [&>*]:px-2 [&>*]:py-1"
                  key={participant.id}
                >
                  <td>
                    {participant.firstName} {participant.lastName}
                  </td>
                  <td>{participant.age}</td>
                  <td>{participant.email}</td>
                  <td>{participant.waiverSigned ? "Yes" : "No"}</td>
                  <td>
                    {participant.checkedIn ? "✅ " : "❌ "}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        if (participant.checkedIn) {
                          changeCheckIn(participant.id, false);
                        } else {
                          changeCheckIn(participant.id, true);
                        }
                      }}
                      className="border-2 border-black bg-black px-2 text-white hover:bg-white hover:text-black"
                    >
                      {participant.checkedIn ? "remove" : "check in"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </PageLayout>
  );
};

export default EventDashboard;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const event = await prisma.event.findUnique({
    where: {
      id: context.params!.eventId as string,
    },
    include: {
      participants: true,
    },
  });

  if (event?.userId !== session.user.id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
      event,
    },
  };
};