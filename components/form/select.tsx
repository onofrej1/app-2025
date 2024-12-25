"use client"

import { ErrorMessage } from '@hookform/error-message';
import { Label } from '@/components/ui/label';
import { DefaultFormData } from '@/components/form/form';
import { FieldErrors } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { renderError } from './utils';

interface SelectOption {
  label: string,
  value: string | number,
}

interface InputProps {
  label?: string,
  name: string,
  errors?: FieldErrors<DefaultFormData>,
  options: SelectOption[],
  className?: string,
  value: string | number,
  inline?: boolean,
  onChange: (value: string) => void,
}

export default function FormSelect({
  label,
  name,
  errors,
  options,
  value,
  className,
  onChange
}: InputProps) {

  return (
    <div>
      {label && <Label>{label}</Label>}
      <div className='pt-1'>
        <Select
          name={name}
          onValueChange={onChange}
          defaultValue={value?.toString()}
        >
          <SelectTrigger className={className}>
            <SelectValue placeholder={label} />
          </SelectTrigger>
          <SelectContent>
            {options && options?.map(option =>
              <SelectItem
                key={option.value}
                value={option.value.toString()}>{option.label}</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      {errors && <ErrorMessage
        errors={errors}
        name={name}
        render={renderError}
      />}
    </div>
  )
}