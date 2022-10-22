import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      // Process a POST request

      if (!req.body.name || !req.body.date || !req.body.email) {
        res.status(500).send("Insufficient fields sent");
        res.end();
        return;
      }

      const { name, date, email } = req.body;

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        res.status(500).send("User with given email not found");
        res.end();
        return;
      }

      const event = await prisma.event.create({
        data: {
          name: name,
          date: date,
          userId: user.id,
        },
      });

      res.send({ event: event });
    } else {
      // Handle any other HTTP method
    }
  } catch (err) {
    res.status(500).send(err);
  }
}
