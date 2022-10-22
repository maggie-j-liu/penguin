import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import prisma from "../../../../lib/prisma";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      // Process a POST request
      if (
        !req.body.participantId ||
        (req.body.checkedIn !== true && req.body.checkedIn !== false)
      ) {
        res.status(500).send("Insufficient fields sent");
        res.end();
        return;
      }

      const session = await unstable_getServerSession(req, res, authOptions);
      if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
      }

      const participant = await prisma.participant.findUnique({
        where: {
          id: req.body.participantId,
        },
        include: {
          event: true,
        },
      });

      if (!participant) {
        res.status(404).send("Participant not found");
      }

      if (participant?.event.userId !== session.user.id) {
        res.status(401).send("You are not authorized to do this");
      }

      await prisma.participant.update({
        where: {
          id: req.body.participantId,
        },
        data: {
          checkedIn: req.body.checkedIn,
        },
      });
      res.end();
    } else {
      // Handle any other HTTP method
      res.status(400).send("Method not allowed");
    }
  } catch (err) {
    res.status(500).send(err);
  }
}
