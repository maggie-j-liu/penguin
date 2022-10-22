import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import prisma from "../lib/prisma";
import PageLayout from "../components/PageLayout";
import type { Event as EventType } from "@prisma/client";
import Event from "../components/Event";

const Dashboard = ({ events }: { events: EventType[] }) => {
  return (
    <PageLayout>
      <div className="mx-auto max-w-5xl">
        <h1 className="mx-auto w-fit text-center text-4xl font-bold">
          Dashboard
        </h1>
        <div className="mt-6 grid grid-cols-4 gap-x-6 gap-y-4">
          {events.map((event) => (
            <Event key={event.id} event={event} />
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;

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

  const userEvents = await prisma.event.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return {
    props: {
      session,
      events: userEvents,
    },
  };
};
