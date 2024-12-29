import { auth } from "@/auth"
import { redirect } from "next/navigation"
 
export default async function UserAvatar() {
  const session = await auth()
 
  if (!session?.user) return redirect('/sign-in');
 
  return (
    <div>
      Logged in as: {session.user.email}
      {/*<img src={session.user.image} alt="User Avatar" />*/}
    </div>
  )
}