import { Event, Participant, WaiverStatus } from "@prisma/client";
import { GetServerSideProps } from "next";
import { useState } from "react";
import PageLayout from "../../components/PageLayout";
import prisma from "../../lib/prisma";
import { useRouter } from "next/router";

const WaiverPage = ({
  participant: { event, ...participant },
}: {
  participant: Participant & { event: Event };
}) => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const router = useRouter();
  if (participant.waiverStatus === WaiverStatus.APPROVED) {
    return (
      <div className="space-y-6 py-12 px-6 text-center">
        <div className="space-y-1 text-center">
          <h1 className="text-center text-4xl font-black">
            Waiver for {event.name} already signed.
          </h1>
          <p className="text-xl">
            {participant.waiverStatus === WaiverStatus.APPROVED
              ? "The organizers have reviewed your waiver submission and have approved it!"
              : "Waiver is pending approval from the organizers."}
          </p>
        </div>

        <div className="flex justify-center">
          <div>
            <p className="text-left font-semibold">Uploaded file(s):</p>
            <div className="flex max-w-2xl space-x-3 overflow-x-scroll">
              {participant.waiverImages.map((waiver) => {
                return <img key={waiver} src={waiver} className="max-w-md" />;
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageLayout noNavbar>
      <h1 className="text-center text-5xl font-bold">
        Sign {event.name} Waiver
      </h1>
      <p className="mx-auto mt-2 max-w-4xl text-center text-xl">
        {participant.waiverStatus === WaiverStatus.PENDING ? (
          <>
            Your waiver is pending approval from the organizers. If you want to
            resubmit, you can do so below. You can find the waiver at{" "}
            <a className="underline" href={event.waiverLink}>
              {event.waiverLink}
            </a>
          </>
        ) : participant.waiverImages.length !== 0 ? (
          <>
            Your waiver was rejected by the organizers. Please fill out the
            waiver and resubmit it. You can find the waiver at{" "}
            <a className="underline" href={event.waiverLink}>
              {event.waiverLink}
            </a>
          </>
        ) : (
          <>
            Print out the waiver at{" "}
            <a className="underline" href={event.waiverLink}>
              {event.waiverLink}
            </a>
            . Fill it out and upload the images below.
          </>
        )}
      </p>
      <div className="mt-4 flex flex-col items-center">
        <div>
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
                router.replace(router.asPath);

                // console.log(e.target.files);
              }
            }}
          />
          {uploadingImage ? (
            <p className="dark:text-gray-400">Uploading image(s)...</p>
          ) : null}
        </div>
      </div>
      {participant.waiverImages.length !== 0 ? (
        <div className="space-y-2 py-12 text-center">
          <h2 className="text-center text-4xl font-black">
            Current waiver [
            {participant.waiverStatus === WaiverStatus.PENDING
              ? "⌛ PENDING"
              : "❌ REJECTED"}
            ]
          </h2>

          <div className="flex justify-center">
            <div>
              <p className="text-left font-semibold">Uploaded file(s):</p>
              <div className="flex max-w-2xl space-x-3 overflow-x-scroll">
                {participant.waiverImages.map((waiver) => {
                  return <img key={waiver} src={waiver} className="max-w-md" />;
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
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
