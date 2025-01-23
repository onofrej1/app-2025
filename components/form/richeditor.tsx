"use client";

import { ErrorMessage } from "@hookform/error-message";
import { Label } from "@/components/ui/label";
import { DefaultFormData } from "@/components/form/form";
import { FieldErrors, UseFormSetValue } from "react-hook-form";
import { renderError } from "./utils";
//import MDEditor from "@uiw/react-md-editor";
import Editor from "../rich-text/editor";

interface RichEditorProps {
  label?: string;
  name: string;
  errors?: FieldErrors<DefaultFormData>;
  className?: string;
  value: string;
  inline?: boolean;
  onChange: (value: string | undefined) => void;
}

export default function RichEditor({
  label,
  name,
  errors,
  value,
  //className,
  onChange,
}: RichEditorProps) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <Editor content={value} onChange={onChange} />
      {errors && (
        <ErrorMessage errors={errors} name={name} render={renderError} />
      )}
    </div>
  );
}
