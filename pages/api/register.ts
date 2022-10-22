import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

    const { firstName, lastName, email, age } = req.body;
  } else {
    // Handle any other HTTP method
  }
}
