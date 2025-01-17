"use client";
import { contactEmail } from "@/actions/emails";
import Form from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/resources/resources.types";
import { ContactForm } from "@/validation";
import React from "react";

export default function Contact() {
  const fields: FormField[] = [
    { type: "text", name: "name", label: "Name" },
    { type: "email", name: "email" },
    { type: "textarea", name: "message", rows: 5, label: "Message" },
  ];

  const sendForm = async (data: ContactForm) => {
    //await contactEmail(data.email, data.name, data.message);
  };

  return (
    <>
      <Form fields={fields} validation={"ContactForm"} action={sendForm}>
        {({ fields }) => (
          <div>
            <div className="flex flex-col gap-3 pb-4">
              {fields.name}
              {fields.email}
              {fields.message}
              <Button type="submit">Contact</Button>
            </div>
          </div>
        )}
      </Form>
    </>
  );
}
