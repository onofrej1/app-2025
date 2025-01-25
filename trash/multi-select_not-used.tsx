"use client"

import { ErrorMessage } from '@hookform/error-message';
import { Label } from '../ui/label';
import { DefaultFormData } from './form';
import { FieldErrors } from 'react-hook-form';
import { renderError } from './utils';
//import ReactSelect from 'react-select';

interface SelectOption {
  label: string,
  value: number,
}

interface InputProps {
  label: string,
  name: string,
  errors: FieldErrors<DefaultFormData>,
  options: SelectOption[],
  value: string[] | number[],
  textField: string,
  onChange: any,
  //ref: any,
}

export default function FormMultiSelect({
  label,
  name,
  errors,
  options,
  value,
  onChange,
  textField,
  //ref
}: InputProps) {

  const selectValue = value && value.length > 0 ? value.map((v: any) => ({ value: Number(v.value || v.id), label: v.label || v[textField!] })) : null;

  return (
    <>
      <Label>{label}</Label>
      <div>
        {/*<ReactSelect
          defaultValue={selectValue}
          value={selectValue}
          isMulti={true}
          onChange={onChange}
          //ref={ref}
          instanceId={name}
          name={name}
          options={options}
          className="basic-multi-select"
          classNamePrefix="select"
        />*/}
      </div>
      <ErrorMessage
        errors={errors}
        name={name}
        render={renderError}
      />
    </>
  )
}