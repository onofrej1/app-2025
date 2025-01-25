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
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useDialog } from "@/state";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";
import { ErrorMessage } from "@hookform/error-message";
import { renderError } from "@/components/form/utils";
import FileUploader from "@/components/form/fileUpload";

export default function Home() {
  const queryClient = useQueryClient();
  //const { open, setTitle, setContent, onClose } = useDialog();
  const [data, setData] = useState<{ content: string }>();
  const [replyToPost, setReplyToPost] = useState<number>();

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

  const commentFields: FormField[] = [
    { type: "text", name: "comment", className: "flex-1" },
  ];
  const fields: FormField[] = [{ type: "text", name: "content", label: "", className: "flex-1" }];

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

  const fileUpload = (formData: FormData) => {
    const formObject = Object.fromEntries(formData.entries());
    const reader = new FileReader();

    reader.onload = function (e: any) {
      const content = e.target.result;
      console.log('content', content);
      /*const csvData = parseCsv(content, requiredHeaders);
      setUploadData(csvData);   */
    };
    reader.readAsText(formObject['myFile'] as Blob);
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
            {replyToPost === post.id ? (
              <Form
                fields={commentFields}
                validation={"CommentFeedPost"}
                action={comment.bind(null, post.id)}
              >
                {({ fields: { comment }, getValues, setValue }) => (
                  <div className="pl-8 flex flex-col gap-3 pb-4">
                    <div className="flex gap-2 items-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Smile />
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <EmojiPicker
                            onEmojiClick={(data: EmojiClickData) => {
                              const content = getValues("comment");
                              setValue("comment", content + data.emoji);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      {comment}
                    </div>
                    <Button type="submit">Comment</Button>
                  </div>
                )}
              </Form>
            ) : (
              <Button variant={"link"} onClick={() => setReplyToPost(post.id)}>
                Reply
              </Button>
            )}
          </div>
        );
      })}

      <Form
        fields={fields}
        data={data}
        validation={"CreatePost"}
        action={sendForm}
      >
        {({ fields, setValue, getValues, formState: { errors } }) => (
          <div>
            <div className="flex gap-2 pb-4 items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Smile />
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <EmojiPicker
                    onEmojiClick={(data: EmojiClickData) => {
                      const content = getValues("content");
                      setValue("content", content + data.emoji);
                    }}
                  />
                </PopoverContent>
              </Popover>
              <div className="flex-1">
                {fields.content}
                <ErrorMessage errors={errors} name={'content'} render={renderError} />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Smile />
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <FileUploader onUploadFile={fileUpload} />
                </PopoverContent>
              </Popover>
              <Button type="submit">Send</Button>
            </div>
          </div>
        )}
      </Form>
    </div>
  );
}
