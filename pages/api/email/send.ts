import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { sendEmail } from "../../../util/sendEmail";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      // Process a POST request

      const session = await unstable_getServerSession(req, res, authOptions);

      if (!req.body.body || !req.body.subject || !req.body.eventId) {
        res.status(500).send("Insufficient fields sent");
        res.end();
        return;
      }
      if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
      }

      const { body, subject, eventId } = req.body;

      const user = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });

      if (!user) {
        res.status(500).send("User with given email not found");
        res.end();
        return;
      }

      const event = await prisma.event.findUnique({
        where: {
          id: eventId,
        },
        include: {
          participants: true,
        },
      });

      if (event?.userId !== user.id) {
        res.status(403).send("Forbidden");
        res.end();
        return;
      }

      event.participants.forEach((participant) => {
        sendEmail(participant.email, subject, body);
      });

      //   const event = await prisma.event.create({
      //     data: {
      //       name: name,
      //       date: date,
      //       userId: user.id,
      //     },
      //   });

      res.send({ event: event });
    } else {
      // Handle any other HTTP method
      res.status(400).send("Method not allowed");
    }
  } catch (err) {
    res.status(500).send(err);
  }
}
