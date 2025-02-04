"use client";
import { contactEmail } from "@/actions/emails";
import FilesUploader from "@/components/form/filesUploader";
import Form from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { FormField } from "@/resources/resources.types";
import { ContactForm } from "@/validation";
import React, { useState } from "react";

export default function Contact() {
  const [files, setFiles] = useState<File[]>();
  const [open, setOpen] = useState(false);
  const [fileUploaderOpen, setFileUploaderOpen] = useState(false);

  const fields: FormField[] = [
    { type: "text", name: "name", label: "Name" },
    { type: "email", name: "email", label: "Email" },
    { type: "textarea", name: "message", rows: 5, label: "Message" },
    {
      type: "mediaUploader",
      name: "myfiles",
      label: "Files",
      onChange: setFiles,
    },
  ];

  const sendForm = async (data: ContactForm) => {
    console.log("d", data);
    //await contactEmail(data.email, data.name, data.message);
  };

  console.log("f", files);

  return (
    <div className="p-4">
      <Form fields={fields} validation={"ContactForm"} action={sendForm}>
        {({ fields }) => (
          <div>
            <div className="flex flex-col gap-3 pb-4">
              {fields.name}
              {fields.email}
              {fields.message}
              {/*fields.myfiles*/}
              <Button type="submit">Contact</Button>
            </div>
          </div>
        )}
      </Form>
      {files?.map(f => <div key={f.name}>{f.name}</div>)}
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <FilesUploader open={open} onClose={() => { console.log('ccc'); setOpen(false) }} onChange={setFiles} />
    </div>
  );
}
