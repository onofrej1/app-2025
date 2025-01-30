"use client";
import { contactEmail } from "@/actions/emails";
import Form from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/resources/resources.types";
import { ContactForm } from "@/validation";
import React from "react";
import Test from "./../../public/assets/test3.svg";
import Image from "next/image";
import { getUserData } from "@/actions/users";
import { useQuery } from "@tanstack/react-query";
import { type User } from "@prisma/client";

export default function User() {
  const { data: userData, isFetching } = useQuery({
    queryKey: ["getUserData"],
    queryFn: getUserData,
  });
  if (isFetching || !userData) return;

  console.log(userData);

  const data: Record<string, any> = {};

  const customFields: FormField[] = userData.customFields.map((p) => {
    const type = p.customField.constrained ? "select" : "text";
    const name = "meta-" + p.customField.id.toString();
    if (p.value !== undefined || p.value !== null) {
      data[name] = p.value;
    }
    const options = p.customField.options.map((o) => ({
      value: o.id,
      label: o.caption,
    }));
    let formField: FormField = {
      type: "text",
      label: p.customField.title,
      name,
    };
    if (type === "select") {
      formField = {
        type: "select",
        label: p.customField.title,
        name,
        options,
      };
    }
    return formField;
  });

  const fields: FormField[] = [
    { type: "email", name: "email", label: "Email" },
    { type: "text", name: "firstName", label: "First name" },
    { type: "email", name: "lastName", label: "Last name" },
    { type: "datepicker", name: "dateOfBirth", label: "Date of birth" },
    //{ type: "textarea", name: "bio", rows: 5, label: "Bio" },
  ];
  fields.forEach((field) => {
    data[field.name] = userData.user[field.name as keyof User];
  });

  const allFields = fields.concat(customFields);

  const sendForm = async (data: ContactForm) => {
    console.log(data);
    //await contactEmail(data.email, data.name, data.message);
  };

  return (
    <div className="flex h-full gap-5 items-center justify-center">
      <div className="flex-1 p-3">
        <Form
          fields={allFields}
          data={data}
          action={sendForm}
          /*validation={"ContactForm"}*/ 
        >
          {({
            fields: {
              firstName,
              lastName,
              /*bio,*/ email,
              dateOfBirth,
              ...rest
            },
          }) => (
            <div>
              <div className="flex flex-col gap-3 pb-4">
                <div className="flex gap-2 items-center p-5 border-b-2">
                  <div className="flex-1">
                    <h2>Account</h2>
                  </div>
                  <div className="flex-1">{email}</div>
                </div>

                <div className="flex gap-2 items-center p-5 border-b-2">
                  <div className="flex-1">
                    <h2>Personal info</h2>
                  </div>
                  <div className="flex-1 flex flex-col gap-3">
                    {firstName}
                    {lastName}
                  </div>
                </div>

                {/*<div className="flex gap-2 items-center p-5 border-b-2">
                  <div className="flex-1">
                    <h2>About</h2>
                  </div>
                  <div className="flex-1">{bio}</div>
                </div>*/}

                <div className="flex gap-2 items-center p-5 border-b-2">
                  <div className="flex-1">
                    <h2>Preferences</h2>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    {Object.keys(rest).map((fieldId) => {
                      return <div key={fieldId}>{rest[fieldId]}</div>;
                    })}
                  </div>
                </div>

                <Button type="submit">Save</Button>
              </div>
            </div>
          )}
        </Form>
      </div>
      <div className="flex-1 p-8">
        <Image
          alt="test"
          src={Test}
          width={100}
          height={100}
          className="w-full"
        />
      </div>
    </div>
  );
}
