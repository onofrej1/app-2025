import { getSession } from "@/actions/auth";
import { redirect } from "next/navigation"
 
export default async function UserAvatar() {
  const session = await getSession()
  console.log(session);
  /*if (!session?.user) return redirect('/sign-in');*/
 
  return (
    <div>
      Logged in as: {/*session.user.email*/}
      {/*<img src={session.user.image} alt="User Avatar" />*/}
    </div>
  )
}