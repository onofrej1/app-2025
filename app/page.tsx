import { getSession } from "@/actions/auth";
import { redirect } from "next/navigation";

export default async function UserAvatar() {
  const session = await getSession();
  if (!session?.user) return redirect('/login');
 
  return (
    <div>
      Logged in as: { session.user }
      {/*<img src={session.user.image} alt="User Avatar" />*/}
    </div>
  )
}