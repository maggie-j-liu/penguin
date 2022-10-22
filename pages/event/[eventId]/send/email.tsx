import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useState } from "react";
import PageLayout from "../../../../components/PageLayout";
import { formatDate } from "../../../../lib/formatDate";
import { authOptions } from "../../../api/auth/[...nextauth]";
import prisma from "../../../../lib/prisma";

//TODO: fix type
const SendEmail = ({ event }: { event: any }) => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  return (
    <PageLayout>
      <h1 className="text-center text-5xl font-bold">{event.name}</h1>
      <p className="text-center text-2xl font-semibold text-gray-400">
        {formatDate(event.date)}
      </p>
      <div className="mx-auto max-w-5xl space-y-4">
        <div>
          <p className="font-black">Subject:</p>
          <input
            type={"text"}
            name="subject"
            onChange={(event) => {
              setSubject(event.target.value);
            }}
            placeholder="Ex: Welcome!"
            className="w-full rounded-md border-4 border-black px-4 py-2 font-black"
          />
        </div>

        <div>
          <p className="font-black">Body:</p>
          <textarea
            onChange={(event) => {
              setBody(event.target.value);
            }}
            placeholder="Ex: Attention! We still have not received your waiver."
            className="h-full w-full rounded-md border-4 border-black px-4 py-2"
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={async () => {
              await fetch("/api/email/send", {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  subject: subject,
                  body: body,
                  eventId: event.id,
                }),
              });
            }}
            className="w-full max-w-5xl rounded-md border-4 border-black bg-black px-4 py-2 font-black text-white transition ease-in-out hover:bg-white hover:text-black"
          >
            Send email
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

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
      event,
    },
  };
};

export default SendEmail;
