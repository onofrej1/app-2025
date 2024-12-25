import { TableHeader } from "@/components/table/table";
import { FormSchema } from "@/validation";
import { JSX } from "react";

interface SelectOption {
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
    label: string;
    type: string;

    // optional props
    resource?: PrismaModel;
    fk?: string;
    onChange?: any;
    relation?: string;
    textField?: string;
    className?: string;
    options?: SelectOption[] | MultiSelectOption[];

    /*value?: string;
    helperText?: string;
    rows?: number;    
    
    render?: any;
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
    name: string;
    name_plural: string;
    model: PrismaModel;
    resource: string;
    relations?: string[];
    rules: FormSchema,
    menuIcon: string;
    form: FormField[];
    list: TableHeader[];
    filter: DataFilter[];
    canAddItem?: boolean;
    canEditItem?: boolean;
}

type PrismaModel = 
| "user"
| "post"
| "category";

export type { Resource, FormField, PrismaModel };