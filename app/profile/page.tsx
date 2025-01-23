"use client";
//import { getFeed } from "@/actions/feed";
//import { getFeedData } from "@/utils/feed";
import {
  commentPost,
  createFeedPost,
  getComments,
  getFeedPosts,
  replyToComment,
} from "@/actions/social";
import Form from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { formatDate } from "@/lib/utils";
import { FormField } from "@/resources/resources.types";
import { FeedComment } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { CommentBox } from "./components/comment";

export default function Home() {
  const queryClient = useQueryClient();

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

  //if (isFetching) return null;

  const commentFields: FormField[] = [{ type: "text", name: "comment" }];
  const fields: FormField[] = [{ type: "text", name: "content", label: "" }];

  const sendForm = async (data: { content: string }) => {
    console.log(data);
    await createFeedPost(data.content);
    refreshData();
  };

  const comment = async (postId: number, data: { comment: string }) => {
    console.log(data);
    await commentPost(postId, data.comment);
    refreshData();
  };

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ["posts", user.userId] });
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
          <div
            key={post.id}
            className="flex flex-col gap-3 border border-b-1 p-2 border-gray-900"
          >
            <div>
              <span className="font-bold">
                {post.user.lastName} {post.user.firstName}
              </span>{" "}
              {formatDate(post.createdAt, "LLL. d, yyyy")}
            </div>
            <div className="bg-slate-200">{post.content}</div>
            {post.comments.map((comment) => {
              return <CommentBox key={comment.id} comment={comment as any} />;
            })}
            <Form
              fields={commentFields}
              validation={"CommentFeedPost"}
              action={comment.bind(null, post.id)}
            >
              {({ fields: { comment } }) => (
                <div className="pl-8 flex flex-col gap-3 pb-4">
                  {comment}
                  <Button type="submit">Comment</Button>
                </div>
              )}
            </Form>
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
