import nodemailer from "nodemailer";

export const sendEmail = (
  recipientEmail: string,
  subject: string,
  body: string
) => {
  const sender = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: recipientEmail,
    subject: subject,
    text: body,
  };

  sender.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
