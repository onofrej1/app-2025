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

interface FormField {
    // mandatory props
    name: string;
    label?: string;
    type?: string;
    rows?: number;
    
    // optional props
    resource?: PrismaModel;
    fk?: string;
    onChange?: any;
    relation?: string;
    textField?: string;
    className?: string;
    options?: SelectOption[] | MultiSelectOption[];
    render?: any;
    renderLabel?: any;

    /*value?: string;
    helperText?: string;
     
    
    color?: string;
    inputType?: string;
    fullWidth?: boolean;
    onChange?: any;*/

    // optional resource options (foreign key, many to many)
    //resource?: string;
    //textField?: string;
    //valueField?: string;

    // DatePicker
    //showTimeSelect?: boolean;
    //showTimeSelectOnly?: boolean;
    //dateFormat?: string;
}

interface TableField {
    name: string;
    header?: string | JSX.Element;
    //cell?: (info: CellContext<TableData, unknown>) => JSX.Element,    
}

interface DataFilter {
  name: string;
  type: string;
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
    rules: FormSchema,
    menuIcon: string;
    form: FormField[];
    renderForm?: FormRender;
    //renderForm: keyof typeof renderForm;
    list: TableHeader[];
    filter: DataFilter[];
    canAddItem?: boolean;
    canEditItem?: boolean;
}

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
| 'venue'
| 'organizer'
| 'activity'
| "runResult"
| "registration"
| "project";

export type { Resource, FormField, PrismaModel };