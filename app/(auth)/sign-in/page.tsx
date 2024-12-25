/*import React from 'react'
import SignIn from '@/components/sign-in'

export default function SignInPage() {
  return (
    <div>
        SignIn
        <SignIn />
    </div>
  )
}*/
"use client";
import Form, { FormState } from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { SignInUser } from "@/actions";

export default function Login() {
  //const { data: session, status } = useSession();
  
  const fields = [
    { name: 'email', type: 'text', label: 'Email' },
    { name: 'password', type: 'text', label: 'Password' },
    //{ name: 'confirm', type: 'checkbox', label: 'Confirm submit' }
  ];

  const buttons = [
    ({ isValid, pending }: FormState) => {
      console.log(isValid);
      console.log(pending);
      return <Button key="submit" type="submit" className="mt-3">Login</Button>
    }
  ];

  /*const render: FormRenderFunc = ({ fields }) => 
    <>
      {fields.name}
      {fields.password}
    </>*/

  return (
    <>
      <Form
        fields={fields}
        validation={'LoginUser'}
        buttons={buttons}
        action={SignInUser}
      />
    </>

  );
}

