"use server";
import { sendTextEmail } from "@/utils/email";

export async function contactEmail(
  email: string,
  name: string,
  message: string
) {
  await sendTextEmail(process.env.CONTACT_EMAIL!, name, message);
}
