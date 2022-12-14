import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import prisma from "../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      // Process a POST request

      if (!req.body.name || !req.body.date || !req.body.waiverLink) {
        res.status(400).send("Insufficient fields sent");
        res.end();
        return;
      }

      const session = await unstable_getServerSession(req, res, authOptions);
      if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
      }

      const { name, date, waiverLink } = req.body;

      const event = await prisma.event.create({
        data: {
          name: name,
          date: date,
          userId: session.user.id,
          waiverLink,
        },
      });

      res.send({ event });
    } else {
      // Handle any other HTTP method
      res.status(400).send("Method not allowed");
    }
  } catch (err) {
    res.status(500).send(err);
  }
}
