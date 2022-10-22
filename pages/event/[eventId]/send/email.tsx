import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { GetServerSideProps } from "next";
import { useState } from "react";
import PageLayout from "../../../../components/PageLayout";

const SendEmail = ({ eventId }: { eventId: string }) => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const editor = useEditor({
    extensions: [StarterKit],
    content: "Enter your email body here in (Markdown)[https://youtube.com]",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
      },
    },
  });

  return (
    <PageLayout>
      <div className="space-y-4">
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
                eventId: eventId,
              }),
            });
          }}
          className="bg-black text-white"
        >
          Send email
        </button>
      </div>
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { eventId } = context.params as any;

  return {
    props: {
      eventId,
    },
  };
};

export default SendEmail;
