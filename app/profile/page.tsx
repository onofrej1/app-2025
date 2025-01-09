import SignInGoogle from "@/components/auth/sign-in-google";
import Link from "next/link";
import { redirect } from "next/navigation";
//import SignIn from "@/components/sign-in";

export default async function Home() {
  /*const session = await auth();
  console.log(session);
  if (!session) {
    redirect('/sign-in');
  }*/

  return (
    <div className="">
      {/*<SignInGoogle />
      <SignOut />*/}                
      Profile page. Logged user: {/*session?.user.email*/}
      <Link href="/home">Home page</Link>
    </div>
  );
}
