import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "josefina.weber@ethereal.email",
    pass: "tFCZNDVbat3DsdnaD9",
  },
});
