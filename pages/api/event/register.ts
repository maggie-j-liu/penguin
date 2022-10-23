import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { sendEmail } from "../../../util/sendEmail";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      // Process a POST request

      if (
        !req.body.firstName ||
        !req.body.lastName ||
        !req.body.email ||
        !req.body.age
      ) {
        res.status(500).send("Insufficient fields sent");
        res.end();
      }

      const { firstName, lastName, email, age, eventId } = req.body;

      const participant = await prisma.participant.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          age: age,
          eventId: eventId,
        },
      });

      const event = await prisma.event.findUnique({
        where: {
          id: eventId,
        },
      });

      sendEmail(
        participant.email,
        `Sign your waivers for ${event?.name}`,
        `Thank you for registering for ${event?.name}!

Before you're ready for ${event?.name}, we need you to sign a couple of waivers and documents.

Please print out, fill, and scan the documents provided below:

- ${event?.waiverLink}

After you are done, go to https://penguinapp.vercel.app/waiver/${participant.waiverId}`
      );

      res.send("Success");
    } else {
      // Handle any other HTTP method
      res.status(400).send("Method not allowed");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}
