"use client";
import { getComments, replyToComment } from "@/actions/social";
import Form from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/resources/resources.types";
import { FeedComment } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

interface CommentBoxProps {
  comment: FeedComment & { _count: { comments: number } };
}

export function CommentBox(props: CommentBoxProps) {
  const { comment } = props;
  //const queryClient = useQueryClient();

  const [data, setData] = useState<FeedComment[]>();
  const [replyId, setReplyId] = useState<number>();

  const loadComments = async (parentId: number) => {
    const comments = await getComments(parentId);
    setData(comments as any);
  };

  const commentFields: FormField[] = [{ type: "text", name: "comment" }];

  const commentReply = async (commentId: number, data: { comment: string }) => {
    console.log(data);
    await replyToComment(commentId, data.comment);
    loadComments(commentId);
    //queryClient.invalidateQueries({ queryKey: ["posts", .userId] });
  };

  return (
    <div className="pl-8" key={comment.id}>
      {comment.comment}
      {comment._count.comments > 0 && (
        <>
          {data && data.length > 0 ? (
            <div>
              {data.map((c) => (
                <CommentBox key={c.id} comment={c as any} />
              ))}
              <Form
                key={comment.id + "-form"}
                fields={commentFields}
                validation={"CommentFeedPost"}
                action={commentReply.bind(null, comment.id)}
              >
                {({ fields }) => (
                  <div className="pl-8 flex flex-col gap-3 pb-4">
                    {fields.comment}
                    <Button type="submit">Comment</Button>
                  </div>
                )}
              </Form>
            </div>
          ) : (
            <Button onClick={() => loadComments(comment.id)}>
              Load comments
            </Button>
          )}
        </>
      )}
    </div>
  );
}
