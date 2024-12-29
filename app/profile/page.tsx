import { Button } from "@/components/ui/flowbite/button";
import SignInGoogle from "@/components/auth/sign-in-google";
import { SignOut } from "@/components/auth/sign-out";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
//import SignIn from "@/components/sign-in";

export default async function Home() {
  const session = await auth();
  console.log(session);
  console.log(session?.user.email);
  if (!session) {
    redirect('/sign-in');
  }

  return (
    <div className="">
      {/*<SignInGoogle />
      <SignOut />*/}                
      Profile page. Logged user: {session?.user.email}
      <Link href="/home">Home page</Link>
    </div>
  );
}
