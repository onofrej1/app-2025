"use client";
import { resetPasswordRequest } from "@/actions/auth";
import Form from "@/components/form/form";
import { Button } from "@/components/ui/button";
import React from "react";

export default function ResetPassword() {
  const fields = [{ name: "email", type: "email" }];

  const sendForm = async (data: { email: string }) => {
    await resetPasswordRequest(data.email);
  };

  return (
    <>
      <Form
        fields={fields}
        validation={"ResetPasswordRequest"}
        action={sendForm}
      >
        {({ fields }) => (
          <div>
            <div className="flex flex-col gap-3 pb-4">
              {fields.email}
              <Button type="submit">Send</Button>
            </div>
          </div>
        )}
      </Form>
    </>
  );
}
