// model Event {
//     id           String        @id @default(uuid())
//     creator      User          @relation(fields: [userId], references: [id])
//     participants Participant[]
//     date         DateTime
//     name         String
//     userId       String
//   }
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useSession } from "next-auth/react";

const CreateEventForm = () => {
  const { data: session, status } = useSession();
  return (
    <Formik
      initialValues={{ name: "", date: "" }}
      validate={(values) => {
        const errors: any = {};

        if (!values.name) {
          errors.name = "Required";
        } else if (!values.date) {
          errors.date = "Invalid date";
        }

        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(async () => {
          alert(JSON.stringify(values, null, 2));
          await fetch("/api/event/create", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: values.name,
              date: new Date(values.date),
              email: session?.user.email,
            }),
          });
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="mx-auto flex max-w-xl flex-col space-y-4">
          <div className="w-full space-y-2">
            <div>
              <Field
                type="text"
                name="name"
                className="w-full rounded-md border-4 border-black px-4 py-2 font-black"
                placeholder="Event Name"
              />
              <ErrorMessage
                name="name"
                component="p"
                className="text-red-500"
              />
            </div>

            <div>
              <Field
                type="date"
                name="date"
                className="w-full rounded-md border-4 border-black px-4 py-2 font-black"
              />
              <ErrorMessage
                name="date"
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
    <div className="space-y-4 p-8">
      <h1 className="text-center text-4xl font-black">Create an event.</h1>
      <CreateEventForm />
    </div>
  );
};

export default CreateEvent;
