"use client";
import { contactEmail } from "@/actions/emails";
import UploadDialog, {
  useUploadDialogState,
} from "@/components/common/uploadDialog";
import Form from "@/components/form/form";
//import { RepeaterRender } from "@/components/form/repeater";
import { Button } from "@/components/ui/button";
import { FormField } from "@/resources/resources.types";
import { ContactForm } from "@/validation";
import React, { ReactElement, useState } from "react";

export default function Contact() {
  const [files, setFiles] = useState<File[]>();
  const { isOpen, toggleModal } = useUploadDialogState();

  /*const render: (props: RepeaterRender) => ReactElement = ({
    label,
    fields,
    addField,
    removeField,
    renderField
  }) => {
    return (
      <>
        <label>{label}</label>
        <div className="flex flex-col ga-3">
          {fields.map((fieldArr, index) => {
            return (
              <div key={name + "-" + index}>
                {fieldArr.map((field) => {
                  return <div key={field.name}>{renderField(field)}</div>;
                })}
                <Button type="button" onClick={() => removeField(index)}>
                  Remove fieldxx
                </Button>
              </div>
            );
          })}
          <Button type="button" onClick={addField}>
            Add fieldxx
          </Button>
        </div>
      </>
    );
  };*/

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
    {
      type: "repeater",
      name: "tags",
      fields: [
        { type: "text", name: "name", label: "Name" },
        { type: "text", name: "description", label: "Description" },
      ],
      //render,
    },
  ];

  const sendForm = async (data: ContactForm) => {
    console.log("d", data);
    //await contactEmail(data.email, data.name, data.message);
  };

  return (
    <div className="p-4">
      <Form fields={fields} action={sendForm}>
        {({ fields }) => (
          <div>
            <div className="flex flex-col gap-3 pb-4">
              {fields.name}
              {fields.email}
              {fields.message}
              {fields.tags}
              {/*fields.myfiles*/}
              <Button type="submit">Contact</Button>
            </div>
          </div>
        )}
      </Form>
      {files?.map((f) => (
        <div key={f.name}>{f.name}</div>
      ))}
      <Button onClick={() => toggleModal()}>Choose files</Button>
      <UploadDialog
        isOpen={isOpen}
        toggleModal={toggleModal}
        onChange={setFiles}
      />
    </div>
  );
}
