import { Event, Participant as ParticipantType } from "@prisma/client";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import PageLayout from "../../../components/PageLayout";
import { authOptions } from "../../api/auth/[...nextauth]";
import prisma from "../../../lib/prisma";
import { formatDate } from "../../../lib/formatDate";
import { useState } from "react";
import { HiExternalLink } from "react-icons/hi";

type EventWithParticipants = Event & { participants: ParticipantType[] };
const EventDashboard = ({ event }: { event: EventWithParticipants }) => {
  const numRegistrations = event.participants.length;
  const [participants, setParticipants] = useState(event.participants);
  const [search, setSearch] = useState("");
  const checkedIn = participants.filter((p) => p.checkedIn).length;
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
  const filteredParticipants = participants.filter((p) => {
    if (search.trim().length === 0) return true;
    const lowerSearch = search.toLowerCase();
    const fullName = p.firstName + " " + p.lastName;
    return (
      fullName.toLowerCase().includes(lowerSearch) ||
      p.email.toLowerCase().includes(lowerSearch)
    );
  });
  return (
    <PageLayout
      crumbs={[{ text: event.name, link: `/event/${event.id}/manage` }]}
    >
      <div className="mx-auto max-w-5xl text-xl">
        <h1 className="text-center text-5xl font-bold">{event.name}</h1>
        <p className="text-center text-2xl font-semibold text-gray-400">
          {formatDate(event.date)}
        </p>

        <section className="my-4 space-y-1">
          <div className="flex items-center space-x-1">
            <h2 className="text-2xl font-medium">Quicklinks</h2>
            <HiExternalLink size={25} />
          </div>
          <div className="space-y-2">
            <div>
              <a href={`/event/${event.id}/register`}>
                <p className="rounded-md border-2 border-black bg-black px-4 py-2 font-black text-white transition ease-in-out hover:bg-white hover:text-black">
                  Registration Form -- have attendees register here
                </p>
              </a>
            </div>

            <div>
              <a href={`/event/${event.id}/email`}>
                <p className="rounded-md border-2 border-black bg-black px-4 py-2 font-black text-white transition ease-in-out hover:bg-white hover:text-black">
                  Send emails to your attendees
                </p>
              </a>
            </div>
          </div>
        </section>

        <hr className="my-8 mx-auto w-1/2 border-2 border-dashed border-gray-300" />

        <section className="">
          <h2 className="text-2xl font-medium">
            {numRegistrations} Registration{numRegistrations === 1 ? "" : "s"} /{" "}
            {checkedIn} Checked In
          </h2>
          <input
            type="text"
            placeholder="Search for a name or email"
            className="mt-4 w-full rounded border-2 border-gray-700 px-2 py-1"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <table className="mt-2 w-full border-collapse border">
            <thead>
              <tr className="[&>*]:border [&>*]:border-gray-400 [&>*]:bg-gray-100 [&>*]:px-2 [&>*]:py-1 [&>*]:text-start">
                <th>Name</th>
                <th>Age</th>
                <th>Email</th>
                <th>Waiver Signed</th>
                <th>Checked In</th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipants.map((participant) => (
                <tr
                  className="[&>*]:border [&>*]:border-gray-400 [&>*]:px-2 [&>*]:py-1"
                  key={participant.id}
                >
                  <td>
                    {participant.firstName} {participant.lastName}
                  </td>
                  <td>{participant.age}</td>
                  <td>{participant.email}</td>
                  <td>{participant.waiverSigned ? "✅ Yes" : "❌ No"}</td>
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
                      className="rounded border-2 border-black bg-black px-2 text-white hover:bg-white hover:text-black"
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
