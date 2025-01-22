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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

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
    createFeedPost(data.content);
    refreshData();
  };

  const comment = (postId: number, data: { comment: string }) => {
    console.log(data);
    commentPost(postId, data.comment);
    refreshData();
  };

  const commentReply = (commentId: number, data: { comment: string }) => {
    console.log(data);
    replyToComment(commentId, data.comment);
    refreshData();
  };

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ["posts", user.userId] });
  };

  const loadComments = async (parentId: number) => {
    const comments = await getComments(parentId);
    console.log(comments);
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
            {post.user.lastName} {post.user.firstName} /{" "}
            {formatDate(post.createdAt)}
            <div className="bg-slate-200">{post.content}</div>
            {post.comments.map((comment) => {
              return (
                <div className="pl-8" key={comment.id}>
                  {comment.comment}
                  {comment._count.comments > 0 && (
                    <div>
                      <Button onClick={() => loadComments(comment.id)}>
                        Load comments
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
            <Form
              fields={commentFields}
              validation={"CommentFeedPost"}
              action={comment.bind(null, post.id)}
            >
              {({ fields }) => (
                <div>
                  <div className="flex flex-col gap-3 pb-4">
                    {fields.comment}
                    <Button type="submit">Comment</Button>
                  </div>
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
