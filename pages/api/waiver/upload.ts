import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import cloudinary from "cloudinary";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";
import { WaiverStatus } from "@prisma/client";

//set bodyparser
export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,

  api_key: process.env.CLOUDINARY_API_KEY,

  api_secret: process.env.CLOUDINARY_API_SECRET,

  secure: true,
});

// export type Media = Omit<File, "projectId">;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  let data = await new Promise((resolve, reject) => {
    const form = formidable();

    form.parse(req, (err: any, fields: any, files: any) => {
      if (err) reject({ err });
      resolve({ err, fields, files });
    });
  });

  let { files, fields } = data as any;

  const waiverId = fields.waiverId;

  console.log(waiverId);

  let media: string[] = [];

  const cloudinaryPromises = [];
  for (const [fileName, file] of Object.entries(files)) {
    const promise = cloudinary.v2.uploader.upload(
      (file as { filepath: string }).filepath,

      function (error: any, result: any) {
        // console.log(result, error);
        console.log(result);

        if (!error) {
          media.push(result.url);
        }
      }
    );
    cloudinaryPromises.push(promise);
  }

  await Promise.all(cloudinaryPromises);

  const participant = await prisma.participant.update({
    where: {
      waiverId: waiverId,
    },

    data: {
      waiverImages: media,
      waiverStatus: WaiverStatus.PENDING,
    },
  });
  res.json(participant);

  // res.json("hi");

  // //res.end();
}
