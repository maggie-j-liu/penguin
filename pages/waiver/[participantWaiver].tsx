import { Event, Participant } from "@prisma/client";
import { GetServerSideProps } from "next";
import PageLayout from "../../components/PageLayout";
import prisma from "../../lib/prisma";

const WaiverPage = ({
  participant: { event, ...participant },
}: {
  participant: Participant & { event: Event };
}) => {
  return (
    <PageLayout noNavbar>
      <h1 className="text-center text-5xl font-bold">
        Sign {event.name} Waiver
      </h1>
      <p>
        Print, sign, and scan the waiver at{" "}
        <a href={event.waiverLink}>{event.waiverLink}</a>
      </p>
    </PageLayout>
  );
};

export default WaiverPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const waiverId = context.params!.participantWaiver as string;
  const participant = await prisma.participant.findUnique({
    where: {
      waiverId,
    },
    include: {
      event: true,
    },
  });
  if (!participant) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      participant,
    },
  };
};
