"use client";
import { contactEmail } from "@/actions/emails";
import Form from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/validation";
import React from "react";

export default function Contact() {
  const fields = [
    { name: "name", label: "Name" },
    { name: "email", type: "email" },
    { name: "message", type: "textarea", rows: 5, label: "Message" },
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
              {/*<div className="flex gap-3">
                <div className="flex-1">{fields.gender}</div>
                <div className="flex-1">{fields.dateOfBirth}</div>
              </div>*/}
              <Button type="submit">Contact</Button>
            </div>
          </div>
        )}
      </Form>
    </>
  );
}
