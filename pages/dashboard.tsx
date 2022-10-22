import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import prisma from "../lib/prisma";

const Dashboard = () => {
  return (
    <main>
      <section>
        <h1>Dashboard</h1>
      </section>
    </main>
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
