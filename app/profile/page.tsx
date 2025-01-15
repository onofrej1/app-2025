import { getFeed } from "@/actions/feed";
import { getFeedData } from "@/utils/feed";
import Link from "next/link";

export default async function Home() {
  const feed = await getFeed();
  console.log(feed);
  const data = getFeedData(feed);

  return (
    <div className="">
      <Link href="/home">Home page</Link>
      {data.map((message, index) => {
        return <div dangerouslySetInnerHTML={{ __html: message }} key={index}></div>;
      })}
    </div>
  );
}
