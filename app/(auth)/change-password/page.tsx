"use client";
import { ChangePassword } from "@/actions/auth";
import Form from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/resources/resources.types";
import React from "react";

export default function ChangePasswordPage() {
  const fields: FormField[] = [
    { name: "password", type: "password" },
    { name: "confirmPassword", type: "password" },
  ];

  const sendForm = async (data: { password: string }) => {
    await ChangePassword(data.password);
  };

  return (
    <>
      <Form fields={fields} validation={"ChangePassword"} action={sendForm}>
        {({ fields }) => (
          <div>
            <div className="flex flex-col gap-3 pb-4">
              {fields.password}
              {fields.confirmPassword}
              <Button type="submit">Change password</Button>
            </div>
          </div>
        )}
      </Form>
    </>
  );
}
