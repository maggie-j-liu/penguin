import { Event, Participant } from "@prisma/client";
import { GetServerSideProps } from "next";
import { useState } from "react";
import PageLayout from "../../components/PageLayout";
import prisma from "../../lib/prisma";

const WaiverPage = ({
  participant: { event, ...participant },
}: {
  participant: Participant & { event: Event };
}) => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [done, setDone] = useState(false);
  if (!done) {
    return (
      <PageLayout noNavbar>
        <h1 className="text-center text-5xl font-bold">
          Sign {event.name} Waiver
        </h1>
        <p className="mt-2 text-center text-xl">
          Print, sign, and scan the waiver at{" "}
          <a className="underline" href={event.waiverLink}>
            {event.waiverLink}
          </a>
        </p>
        <input
          name="image"
          type="file"
          className="mx-auto block w-full"
          // accept="image/*, video*/"
          accept="image/png, image/jpeg, image/jpg"
          multiple
          onChange={async (e) => {
            if (e.target.files) {
              setUploadingImage(true);
              const fd = new FormData();
              Array.from(e.target.files).forEach((file, i) => {
                fd.append(file.name, file);
              });
              fd.append("waiverId", participant.waiverId);
              const media = await fetch("/api/waiver/upload", {
                method: "POST",
                body: fd,
              });
              const newFiles = await media.json();
              // setFiles((f) => [...f, ...newFiles]);
              e.target.value = "";
              setUploadingImage(false);
              setDone(true);
              // console.log(e.target.files);
            }
          }}
        />
        {uploadingImage ? (
          <p className="dark:text-gray-300">Uploading image(s)...</p>
        ) : null}
      </PageLayout>
    );
  }
  return (
    <div className="space-y-2 text-center">
      <h1 className="text-center text-4xl font-black">
        Registration complete for {event.name}!
      </h1>
      <p>You may now close this page!</p>
    </div>
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
