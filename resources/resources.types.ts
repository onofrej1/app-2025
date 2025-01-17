import { FormRender } from "@/components/form/form";
import { TableHeader } from "@/components/table/table";
import { FormSchema } from "@/validation";
import { JSX } from "react";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface MultiSelectOption {
  label: string;
  //value: number;
  value: string;
  icon?: any;
}

interface BaseFormType {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  onChange?: any;
}

export interface InputType {
  type: "text" | "textarea" | "number" | "email";
}

export interface TextAreaType {
  type: "textarea";
  rows?: number;
}

export interface SelectType {
  type: "select";
  options?: SelectOption[] | MultiSelectOption[];
}

export interface ForeignKeyType {
  type: "fk";
  resource: PrismaModel;
  relation: string;
  textField?: string;
  renderLabel?: any;
}

export interface MultiSelectType {
  type: "m2m";
  options?: SelectOption[] | MultiSelectOption[];
  resource: PrismaModel;
  textField: string;
}

export interface DatePickerType {
  type: "datepicker";
}

export interface CheckboxType {
  type: "checkbox";
}

type FormField = BaseFormType &
  (
    | InputType
    | TextAreaType
    | SelectType
    | ForeignKeyType
    | CheckboxType
    | DatePickerType
    | MultiSelectType
  );

/*interface FormFieldNotUsed {
    name: string;
    label?: string;
    type?: string;
    rows?: number;
    
    resource?: PrismaModel;
    fk?: string;
    onChange?: any;
    relation?: string;
    textField?: string;
    className?: string;
    options?: SelectOption[] | MultiSelectOption[];
    render?: any;
    renderLabel?: any;

    value?: string;
    helperText?: string;
     
    
    color?: string;
    inputType?: string;
    fullWidth?: boolean;
    onChange?: any;

    resource?: string;
    textField?: string;
    valueField?: string;

    DatePicker
    showTimeSelect?: boolean;
    showTimeSelectOnly?: boolean;
    dateFormat?: string;
}*/

interface TableField {
  name: string;
  header?: string | JSX.Element;
  //cell?: (info: CellContext<TableData, unknown>) => JSX.Element,
}

interface DataFilter {
  name: string;
  type: 'select';
  label: string;
  options?: SelectOption[];
  onChange?: any;
  className?: any;
}

type Resource = {
  group?: string;
  name: string;
  name_plural: string;
  model: PrismaModel;
  resource: string;
  relations?: string[];
  rules: FormSchema;
  menuIcon: string;
  form: FormField[];
  renderForm?: FormRender;
  //renderForm: keyof typeof renderForm;
  list: TableHeader[];
  filter: DataFilter[];
  canAddItem?: boolean;
  canEditItem?: boolean;
};

type PrismaModel =
  | "user"
  | "post"
  | "category"
  | "task"
  | "event"
  | "attendee"
  | "eventSchedule"
  | "tag"
  | "run"
  | "runCategory"
  | "venue"
  | "organizer"
  | "activity"
  | "runResult"
  | "registration"
  | "project";

export type { Resource, FormField, PrismaModel };
