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

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const assertEmailConfigured = () => {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  if (!from || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("Email service is not configured");
  }

  return from;
};

export const sendRegistrationOtpEmail = async ({ to, otp, role }) => {
  const from = assertEmailConfigured();

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

export const sendContactMessageEmail = async ({ name, email, phone, topic, message }) => {
  const from = assertEmailConfigured();
  const to = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

  if (!to) {
    throw new Error("Admin email is not configured");
  }

  const normalizedPhone = phone?.trim() || "Not provided";
  const escapedMessage = escapeHtml(message).replace(/\n/g, "<br />");
  const transport = getMailTransport();

  return transport.sendMail({
    from,
    to,
    replyTo: email,
    subject: `New contact message: ${topic}`,
    text: [
      "New contact message from Local Food Charity System",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${normalizedPhone}`,
      `Topic: ${topic}`,
      "",
      "Message:",
      message,
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2>New contact message</h2>
        <p>A visitor submitted the Contact Us form on Local Food Charity System.</p>
        <table style="border-collapse: collapse; width: 100%; max-width: 640px;">
          <tr>
            <td style="padding: 8px 0; font-weight: 700;">Name</td>
            <td style="padding: 8px 0;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 700;">Email</td>
            <td style="padding: 8px 0;">${escapeHtml(email)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 700;">Phone</td>
            <td style="padding: 8px 0;">${escapeHtml(normalizedPhone)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 700;">Topic</td>
            <td style="padding: 8px 0;">${escapeHtml(topic)}</td>
          </tr>
        </table>
        <div style="margin-top: 20px; padding: 16px; background: #f3faf4; border-left: 4px solid #27ae60;">
          ${escapedMessage}
        </div>
      </div>
    `,
  });
};

export const sendNgoRegistrationSubmittedEmail = async ({ to, ngoName }) => {
  const from = assertEmailConfigured();
  const displayName = ngoName || "Your NGO";
  const transport = getMailTransport();

  return transport.sendMail({
    from,
    to,
    subject: "Your NGO registration is under review",
    text:
      "Your NGO registration has been submitted successfully. Your account is under admin review. " +
      "You will be notified once admin approves your account.",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2>NGO registration submitted</h2>
        <p>Hello ${escapeHtml(displayName)},</p>
        <p>Your NGO registration has been submitted successfully. Your account is under admin review.</p>
        <p>You will be notified once admin approves your account.</p>
      </div>
    `,
  });
};

export const sendNgoAccountApprovedEmail = async ({ to, ngoName }) => {
  const from = assertEmailConfigured();
  const displayName = ngoName || "Your NGO";
  const transport = getMailTransport();

  return transport.sendMail({
    from,
    to,
    subject: "Your NGO account has been approved",
    text: "Your NGO account has been approved. You can now login and request donations.",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2>NGO account approved</h2>
        <p>Hello ${escapeHtml(displayName)},</p>
        <p>Your NGO account has been approved. You can now login and request donations.</p>
      </div>
    `,
  });
};
