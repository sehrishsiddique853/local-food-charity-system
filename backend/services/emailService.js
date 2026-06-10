import nodemailer from "nodemailer";

const getMailTransport = () => {
  if (process.env.SMTP_SERVICE) {
    return nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendRegistrationOtpEmail = async ({ to, otp, role }) => {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  if (!from || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("Email service is not configured");
  }

  const transport = getMailTransport();
  const accountLabel = role === "ngo" ? "NGO" : "donor";

  return transport.sendMail({
    from,
    to,
    subject: "Your Local Food verification code",
    text: `Your ${accountLabel} registration verification code is ${otp}. It expires in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2>Email verification</h2>
        <p>Your ${accountLabel} registration verification code is:</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 6px;">${otp}</p>
        <p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p>
      </div>
    `,
  });
};
