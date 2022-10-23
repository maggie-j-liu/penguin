// model Event {
//     id           String        @id @default(uuid())
//     creator      User          @relation(fields: [userId], references: [id])
//     participants Participant[]
//     date         DateTime
//     name         String
//     userId       String
//   }
import { Formik, Form, Field, ErrorMessage } from "formik";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import PageLayout from "../../components/PageLayout";
import { authOptions } from "../api/auth/[...nextauth]";
import { useRouter } from "next/router";

const CreateEventForm = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  return (
    <Formik
      initialValues={{ name: "", date: "", waiverLink: "" }}
      validate={(values) => {
        const errors: any = {};

        if (!values.name) {
          errors.name = "Required";
        } else if (!values.date) {
          errors.date = "Invalid date";
        } else if (!values.waiverLink) {
          errors.waiverLink = "Required";
        }

        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(async () => {
          const res = await fetch("/api/event/create", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: values.name,
              date: new Date(values.date),
              waiverLink: values.waiverLink,
            }),
          }).then((res) => res.json());
          router.push(`/event/${res.event.id}/manage`);
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="mx-auto flex max-w-xl flex-col space-y-4">
          <div className="w-full space-y-2">
            <div>
              <label>
                <span>Event Name</span>
                <span className="text-red-400">*</span>
                <Field
                  type="text"
                  name="name"
                  className="w-full rounded-md border-2 border-black px-4 py-2 font-black"
                  placeholder="Unite Hacks"
                />
              </label>
              <ErrorMessage
                name="name"
                component="p"
                className="text-red-500"
              />
            </div>

            <div>
              <label>
                <span>Date</span>
                <span className="text-red-400">*</span>
                <Field
                  type="date"
                  name="date"
                  className="w-full rounded-md border-2 border-black px-4 py-2 font-black"
                />
              </label>
              <ErrorMessage
                name="date"
                component="div"
                className="text-red-500"
              />
            </div>
            <div>
              <label>
                <span>Waiver Link</span>
                <span className="text-red-400">*</span>
                <Field
                  type="url"
                  name="waiverLink"
                  className="w-full rounded-md border-2 border-black px-4 py-2 font-black"
                />
              </label>
              <ErrorMessage
                name="waiverLink"
                component="div"
                className="text-red-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md border-4 border-black bg-black px-4 py-2 font-black text-white transition ease-in-out hover:bg-white hover:text-black"
          >
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};

const CreateEvent = () => {
  return (
    <PageLayout>
      <h1 className="text-center text-4xl font-black">Create an event.</h1>
      <CreateEventForm />
    </PageLayout>
  );
};

export default CreateEvent;

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

  return {
    props: {
      session,
    },
  };
};
