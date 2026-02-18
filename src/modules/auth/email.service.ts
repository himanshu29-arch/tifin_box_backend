import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// export async function sendOtpEmail(email: string, otp: string) {
//   await resend.emails.send({
//     from: process.env.FROM_EMAIL!,
//     to: email,
//     subject: "TifunBox Email Verification OTP",
//     html: `
//       <p>Your OTP is <b>${otp}</b></p>
//       <p>This OTP is valid for 5 minutes.</p>
//     `,
//   });
// }

export async function sendOtpEmail(email: string, otp: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: email,
      subject: "TifunBox Email Verification OTP",
      html: `
        <p>Your OTP is <b>${otp}</b></p>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      throw new Error("Email sending failed");
    }

    console.log("Email sent:", data);
  } catch (err) {
    console.error("Email service failed:", err);
    throw err;
  }
}
