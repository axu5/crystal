const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.example.com",
      port: 587,
      secure: true,
      auth: {
        user: "username",
        pass: "password",
      },
    });

    await transporter.sendMail({
      from: "username",
      to: email,
      subject: subject,
      text: text,
    });
    console.log("email sent successfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

sendEmail("");
