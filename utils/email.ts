import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

export async function sendTextEmail(
  to: string,
  subject: string,
  message: string
) {
  const mailOptions: Mail.Options = {
    from: process.env.FROM_EMAIL!,
    to,
    subject,
    text: message,
  };

  const sendMailPromise = () =>
    new Promise<string>((resolve, reject) => {
        getTransport().sendMail(mailOptions, function (err) {
        if (!err) {
          resolve("Email sent");
        } else {
          reject(err.message);
        }
      });
    });

  try {
    await sendMailPromise();
    return "success";
  } catch (err) {
    return "error";
  }
}

export async function sendEmail(
  to: string,
  subject: string,
  template: string,
  data: Record<string, any>
) {
  const source = fs.readFileSync(
    path.join(process.cwd(), "utils/email/templates/" + template),
    "utf8"
  );
  const compiledTemplate = handlebars.compile(source);

  const mailOptions: Mail.Options = {
    from: process.env.FROM_EMAIL!,
    to,
    // cc: email,
    subject,
    html: compiledTemplate(data),
  };

  const sendMailPromise = () =>
    new Promise<string>((resolve, reject) => {
      getTransport().sendMail(mailOptions, function (err) {
        if (!err) {
          resolve("Email sent");
        } else {
          reject(err.message);
        }
      });
    });

  try {
    await sendMailPromise();
    return "success";
  } catch (err) {
    return "error";
  }
}

export function getTransport() {
  const transport = nodemailer.createTransport({
    service: "gmail",
    /* 
          setting service as 'gmail' is same as providing these setings:
          host: "smtp.gmail.com",
          port: 465,
          secure: true
          If you want to use a different email provider other than gmail, you need to provide these manually.
          Or you can go use these well known services and their settings at
          https://github.com/nodemailer/nodemailer/blob/master/lib/well-known/services.json
      */
    auth: {
      user: process.env.SMTP_SERVER_USERNAME,
      pass: process.env.SMTP_SERVER_PASSWORD,
    },
  });
  return transport;
}
