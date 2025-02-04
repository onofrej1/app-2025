"use client";
import {
  commentPost,
  createFeedPost,
  createMediaFeedPost,
  getFeedPosts,
} from "@/actions/social";
import Form from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { formatDate } from "@/lib/utils";
import { FormField } from "@/resources/resources.types";
import { FeedPost } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { CommentBox } from "./components/comment";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";
import { ErrorMessage } from "@hookform/error-message";
import { renderError } from "@/components/form/utils";
import FileUploader from "@/components/form/fileUploader";
import { useUploadForm } from "@/hooks/useUploadForm";
import { Progress } from "@/components/ui/progress";
import Videojs, { videoJsOptions } from "@/components/video/videojs";
import { urlToFile } from "@/utils";
import "react-image-crop/dist/ReactCrop.css";

const uploadDir = process.env.NEXT_PUBLIC_UPLOAD_DIR || '';

export default function Home() {
  const queryClient = useQueryClient();
  const [replyToPost, setReplyToPost] = useState<number>();
  const [fileUploaderOpen, setFileUploaderOpen] = useState(false);

  const { user } = useSession();

  const { uploadForm, progress } = useUploadForm();

  const { data: posts = [], isFetching } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getFeedPosts(),
  });

  const commentFields: FormField[] = [
    { type: "text", name: "comment", className: "flex-1" },
  ];
  const fields: FormField[] = [
    { type: "text", name: "content", className: "flex-1" },
  ];

  const sendForm = async (data: FeedPost) => {
    await createFeedPost(data);
    refreshData();
  };

  const comment = async (postId: number, data: { comment: string }) => {
    await commentPost(postId, data.comment);
    refreshData();
  };

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ["posts", user.userId] });
  };

  const getVideoOptions = (mediaUrl: string) => {
    const dotLastIndex = mediaUrl.lastIndexOf(".");
    const finalName = mediaUrl.substring(0, dotLastIndex);
    const sources = [
      {
        src: `${uploadDir}${mediaUrl}`,
        type: "video/mp4",
      },
    ];
    const options = {
      ...videoJsOptions,
      sources,
      poster: `$${uploadDir}${finalName}_thumb.png`,
    };
    return options;
  };

  const onFileSelect = async (data: { file: File; thumbNail?: string }) => {
    const { file } = data;
    const formData = new FormData();
    formData.append("mediaUrl", file, file.name);
    const type = file.type.startsWith("image") ? "image" : "video";
    if (type === "video" && data.thumbNail) {
      const fileName = file.name.split(".")[0];
      const thumbNail = await urlToFile(
        data.thumbNail,
        fileName + "_thumb.png",
        "image/png"
      );
      formData.append("mediaUrlThumb", thumbNail);
    }
    const mediaUploadResponse = await uploadForm(formData);
    if (mediaUploadResponse.status === 200) {
      await createMediaFeedPost({
        mediaUrl: file.name,
        contentType: type,
      });
      setFileUploaderOpen(false);
      refreshData();
    }
  };

  return (
    <div className="">
      <Link href="/home">Home page</Link>

      {posts.map((post) => {
        return (
          <div
            key={post.id}
            className="flex flex-col gap-3 border border-b-1 p-2 border-gray-900"
          >
            {post.contentType === "text" && (
              <div className="bg-slate-200 ml-auto">{post.content}</div>
            )}
            {post.contentType === "image" && (
              <a className="ml-auto" href={`${uploadDir}${post.mediaUrl}`}>
                <img
                  src={`${uploadDir}${post.mediaUrl}`}
                  width={120}
                  height={120}
                  className="border border-gray-400 cover"
                />
              </a>
            )}

            {post.contentType === "video" && (
              <div className="w-[200px] ml-auto">
                <Videojs options={getVideoOptions(post.mediaUrl!)} />
              </div>
            )}
            <div className="ml-auto">
              <span className="font-bold">
                {post.user.lastName} {post.user.firstName}
              </span>{" "}
              {formatDate(post.createdAt, "LLL. d, yyyy")}
            </div>
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
              <Button
                variant={"link"}
                className="ml-auto"
                onClick={() => setReplyToPost(post.id)}
              >
                Reply
              </Button>
            )}
          </div>
        );
      })}

      <Form fields={fields} validation={"CreatePost"} action={sendForm}>
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
                <ErrorMessage
                  errors={errors}
                  name={"content"}
                  render={renderError}
                />
              </div>
              <Popover
                open={fileUploaderOpen}
                onOpenChange={setFileUploaderOpen}
              >
                <PopoverTrigger asChild>
                  <Smile />
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <Progress value={progress} />
                  <FileUploader
                    uploadText="Send"
                    allowedTypes={["image/png", "image/jpeg", "video/mp4"]}
                    //onFileSelect={onFileSelect}
                  />
                </PopoverContent>
              </Popover>

              {/*<Popover>
                <PopoverTrigger asChild><Smile /></PopoverTrigger>
                <PopoverContent className="w-80">
                  <ReactCrop
                    crop={crop}
                    onChange={setCrop}
                  >
                    <img src={src} />
                  </ReactCrop>
                  <br />
                  <button onClick={cropImageNow}>Crop</button>
                </PopoverContent>
              </Popover>*/}

              <Button type="submit">Send</Button>
            </div>
          </div>
        )}
      </Form>
    </div>
  );
}
