import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

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

      res.send("Success");
    } else {
      // Handle any other HTTP method
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}
