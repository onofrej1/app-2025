"use client";
import { register } from "@/actions/auth";
import Form, { FormState } from "@/components/form/form";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const fields = [
    { name: 'firstName', type: 'text', label: 'First name' },
    { name: 'lastName', type: 'text', label: 'Last name' },
    { name: 'email', type: 'text', label: 'Email' },
    { name: 'password', type: 'text', label: 'Password' },
    //{ name: 'confirm', type: 'checkbox', label: 'Confirm submit' }
  ];

  const buttons = [
    ({ isValid, pending }: FormState) => {
      console.log(isValid);
      console.log(pending);
      return <Button key="submit" type="submit" className="mt-3">Register user</Button>
    }
  ];

  /*const render: FormRender = ({ fields }) => 
    <>
      {fields.name}
      {fields.password}
    </>*/

  return (
    <>
      <Form
        fields={fields}
        validation={'RegisterUser'}
        buttons={buttons}
        action={register}
      />
    </>

  );
}
