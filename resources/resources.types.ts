import { FormRender } from "@/components/form/form";
import { TableHeader } from "@/components/table/table";
import { FormSchema } from "@/validation";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface MultiSelectOption {
  label: string;
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

export interface InputType extends BaseFormType {
  type: "text" | "textarea" | "number" | "email" | "color";
  color?: string;
  min?: number;
  max?: number;
}

export interface TextAreaType extends BaseFormType {
  type: "textarea";
  rows?: number;
}

export interface SelectType extends BaseFormType {
  type: "select";
  options?: SelectOption[] | MultiSelectOption[];
}

export interface ForeignKeyType extends BaseFormType {
  type: "fk";
  resource: PrismaModel;
  relation: string;
  textField?: string;
  renderLabel?: any;
}

export interface MultiSelectType extends BaseFormType {
  type: "m2m";
  options?: SelectOption[] | MultiSelectOption[];
  resource: PrismaModel;
  textField: string;
}

export interface DatePickerType extends BaseFormType {
  type: "datepicker";
}

export interface CheckboxType extends BaseFormType {
  type: "checkbox";
}

type FormField =
  | InputType
  | TextAreaType
  | SelectType
  | ForeignKeyType
  | CheckboxType
  | DatePickerType
  | MultiSelectType;

interface DataFilter {
  name: string;
  type: "select";
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
  list: TableHeader[];
  filter: DataFilter[];
  canAddItem?: boolean;
  canEditItem?: boolean;
  //renderForm: keyof typeof renderForm;
};

/*interface FormFieldNotUsed {
    value?: string;
    helperText?: string;
    color?: string;
    inputType?: string;
    fullWidth?: boolean;
    DatePicker
    showTimeSelect?: boolean;
    showTimeSelectOnly?: boolean;
    dateFormat?: string;
}*/

/*interface TableField {
  name: string;
  header?: string | JSX.Element;
  cell?: (info: CellContext<TableData, unknown>) => JSX.Element,
}*/

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
