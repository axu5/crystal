// import nodemailer from "nodemailer";
const nodemailer = require("nodemailer");

const { EMAIL_FROM, EMAIL_PASSWORD } = process.env;
// const EMAIL_FROM = "321axu123@gmail.com";
// const EMAIL_PASSWORD = "pnhtjyfqmeivgeav";

/**
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 */
export default async function sendEmail(to, subject, html) {
  console.log(`EMAIL_FROM`, EMAIL_FROM);
  console.log(`EMAIL_PASSWORD`, EMAIL_PASSWORD);
  const transporter = nodemailer.createTransport({
    // host: "smtp.gmail.com",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    // service: "gmail",
    // port: 465,
    // secure: true,
    auth: {
      user: EMAIL_FROM,
      pass: EMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"No Reply Crystal Cabins" <${EMAIL_FROM}>`,
    to,
    subject,
    text: "helo",
    html,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
// sendEmail("axuissocool@gmail.com", "test", "<h1>hello</h1>");
