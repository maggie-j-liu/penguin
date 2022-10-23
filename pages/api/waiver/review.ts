import { WaiverStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import prisma from "../../../lib/prisma";
import { sendEmail } from "../../../util/sendEmail";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      // Process a POST request

      if (!req.body.participantId || !req.body.waiverStatus) {
        res.status(500).send("Insufficient fields sent");
        res.end();
      }

      const session = await unstable_getServerSession(req, res, authOptions);
      if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
      }

      const { participantId, waiverStatus } = req.body;

      const participant = await prisma.participant.findUnique({
        where: {
          id: participantId,
        },
        include: {
          event: true,
        },
      });

      if (!participant) {
        res.status(404).send("Participant not found");
        return;
      }

      const event = participant.event;
      if (event.userId !== session.user.id) {
        res.status(401).send("You are not authorized to do this");
        return;
      }

      if (waiverStatus === WaiverStatus.APPROVED) {
        sendEmail(
          participant.email,
          `${event?.name} Waiver Approved`,
          `Your waiver for ${event?.name} has been approved!`
        );
        await prisma.participant.update({
          where: {
            id: participantId,
          },
          data: {
            waiverStatus: WaiverStatus.APPROVED,
          },
        });
      } else if (waiverStatus === WaiverStatus.NOT_SIGNED) {
        sendEmail(
          participant.email,
          `${event?.name} Waiver Rejected`,
          `Your waiver for ${event?.name} has been rejected. Please sign the waiver again at https://penguinapp.vercel.app/waiver/${participant.waiverId}, making sure to fill out all the fields.`
        );
        await prisma.participant.update({
          where: {
            id: participantId,
          },
          data: {
            waiverStatus: WaiverStatus.NOT_SIGNED,
          },
        });
      } else {
        res.status(400).send("Invalid waiver status");
        return;
      }
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
