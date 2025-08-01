import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifycode: string
): Promise<ApiResponse> {
  try {
    return { success: true, message: "Email sent successfully" };

    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Togetha Verification code",
      react: VerificationEmail({username, otp: verifycode}),
    });
  } catch (emailError) {
    console.log("Error while sending verificaiton email", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
