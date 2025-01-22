"use client";
import { getFeed } from "@/actions/feed";
import { createFeedPost, getFeedPosts } from "@/actions/social";
import Form from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { formatDate } from "@/lib/utils";
import { FormField } from "@/resources/resources.types";
import { getFeedData } from "@/utils/feed";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function Home() {
  const { user } = useSession();
  /*const feed = await getFeed();
  console.log(feed);
  const data = getFeedData(feed);*/
  const { data: posts = [], isFetching } = useQuery({
    queryKey: ["posts", user.userId],
    queryFn: () => getFeedPosts(user.userId),
    select: (data) => {
      return data;
    },
  });

  if (isFetching) return null;

  const fields: FormField[] = [{ type: "text", name: "content", label: "" }];

  const sendForm = async (data: { content: string }) => {
    console.log(data);
    createFeedPost(data.content);
  };

  return (
    <div className="">
      <Link href="/home">Home page</Link>
      {/*data.map((message, index) => {
        return (
          <div dangerouslySetInnerHTML={{ __html: message }} key={index}></div>
        );
      })*/}

      {posts.map((post) => {
        return (
            <div key={post.id} className="flex flex-col gap-3 border border-b-1 p-2 border-gray-900">
              {post.user.lastName} {post.user.firstName} / {formatDate(post.createdAt)}
              <div className="bg-slate-200">{post.content}</div>
            </div>
        );
      })}

      <Form fields={fields} validation={"CreatePost"} action={sendForm}>
        {({ fields }) => (
          <div>
            <div className="flex flex-col gap-3 pb-4">
              {fields.content}
              <Button type="submit">Contact</Button>
            </div>
          </div>
        )}
      </Form>
    </div>
  );
}
