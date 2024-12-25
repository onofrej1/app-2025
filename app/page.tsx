import { Button } from "@/components/ui/flowbite/button";
import SignInGoogle from "@/components/auth/sign-in-google";
import { SignOut } from "@/components/auth/sign-out";
import Link from "next/link";
//import SignIn from "@/components/sign-in";

export default function Home() {
  return (
    <div className="">
      <SignInGoogle />
      <SignOut />      
      Test
      <Button>
          Press me
          <svg
            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"            
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        
      </Button>
      <button
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Default
      </button>

      <Link href="/home">Home page</Link>
    </div>
  );
}
