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
import { authOptions } from "../../api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
import { eventNames } from "process";
import Router, { useRouter } from "next/router";
import { useState } from "react";

const CreateParticipantForm = ({ event }: { event: any }) => {
  const { data: session, status } = useSession();
  const [done, setDone] = useState(false);
  const router = useRouter();
  return done ? (
    <div className="space-y-2 text-center">
      <h1 className="text-center text-4xl font-black">
        Registration complete for {event.name}!
      </h1>
      <p>You may now close this page!</p>
    </div>
  ) : (
    <>
      <h1 className="text-center text-4xl font-black">
        Register for {event.name}
      </h1>
      <Formik
        initialValues={{ firstName: "", lastName: "", email: "", age: "" }}
        validate={(values) => {
          const errors: any = {};
          if (!values.firstName) {
            errors.firstName = "Required";
          }
          if (!values.lastName) {
            errors.lastName = "Required";
          }
          if (!values.email) {
            errors.email = "Required";
          }
          if (!values.age) {
            errors.age = "Required";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(async () => {
            try {
              await fetch("/api/event/register", {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  firstName: values.firstName,
                  lastName: values.lastName,
                  email: values.email,
                  age: parseInt(values.age),
                  eventId: event.id,
                }),
              });
              setSubmitting(false);
              setDone(true);
            } catch (err) {}
          }, 400);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="mx-auto flex max-w-xl flex-col space-y-4">
            <div className="w-full space-y-2">
              <div className="flex space-x-3">
                <div className="w-1/2">
                  <Field
                    type="text"
                    name="firstName"
                    className="w-full rounded-md border-4 border-black px-4 py-2 font-black"
                    placeholder="First Name"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="p"
                    className="text-red-500"
                  />
                </div>
                <div className="w-1/2">
                  <Field
                    type="text"
                    name="lastName"
                    className="w-full rounded-md border-4 border-black px-4 py-2 font-black"
                    placeholder="Last Name"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="p"
                    className="text-red-500"
                  />
                </div>
              </div>
              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full rounded-md border-4 border-black px-4 py-2 font-black"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500"
                />
              </div>
              <div>
                <Field
                  type="number"
                  name="age"
                  placeholder="Enter your age"
                  className="w-full rounded-md border-4 border-black px-4 py-2 font-black"
                />
                <ErrorMessage
                  name="age"
                  component="p"
                  className="text-red-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md border-4 border-black bg-black px-4 py-2 font-black text-white transition ease-in-out hover:bg-white hover:text-black"
            >
              Register
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

const CreateParticipant = ({ event }: { event: any }) => {
  return (
    <div className="space-y-4 p-8">
      <CreateParticipantForm event={event} />
    </div>
  );
};

export default CreateParticipant;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { eventId } = context.params as any;

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  return {
    props: {
      event,
    },
  };
};
