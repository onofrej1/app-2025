"use client";

import Link from "next/link";
import { LayoutGrid, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDialog } from "@/state";
import { FormField } from "@/resources/resources.types";
import Form from "../form/form";
import { approveFriendRequest, getFriendRequests, sendFriendRequest } from "@/actions/social";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

export function UserNav() {
  const { open, setTitle, setContent, onClose } = useDialog();

  const { data: friendRequests = [], isFetching } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });
  if (isFetching) return null;

  const handleSendRequestForm = (data: { email: string }) => {
    sendFriendRequest(data.email);
    onClose();
    toast("Form request send");
  };
  
  const handleApproveFriendRequest = async (id: number) => {
    await approveFriendRequest(id);
  };

  const sendRequestForm = () => {
    const fields: FormField[] = [
      { label: "Email", type: "text", name: "email" },
    ];
    return (
      <div>
        <Form
          fields={fields}
          action={handleSendRequestForm}
          validation={"SendFriendRequest"}
        />
      </div>
    );
  };

  const friendRequestsList = () => {
    return (
      <div>
        {friendRequests.map((request) => {
          return (
              <div key={request.id} className="flex justify-between pb-4">
                <div>{request.user1.lastName} {request.user1.firstName}</div>
                <Button onClick={() => handleApproveFriendRequest(request.id)}>Approve</Button>
              </div>
          );
        })}
      </div>
    );
  };

  const openSendRequestModal = () => {
    setTitle("Send friend request");
    setContent(sendRequestForm());
    open();
  };

  const openFriendRequestsModal = () => {
    setTitle("Send friend request");
    setContent(friendRequestsList());
    open();
  };

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="#" alt="Avatar" />
                  <AvatarFallback className="bg-transparent">JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">John Doe</p>
            <p className="text-xs leading-none text-muted-foreground">
              johndoe@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link href="/dashboard" className="flex items-center">
              <LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link href="/account" className="flex items-center">
              <User className="w-4 h-4 mr-3 text-muted-foreground" />
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Button
              onClick={openFriendRequestsModal}
              variant="ghost"
              className="flex items-center"
            >
              <User className="w-4 h-4 mr-3 text-muted-foreground" />
              Friend requests
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Button
              onClick={openSendRequestModal}
              variant="ghost"
              className="flex items-center"
            >
              <User className="w-4 h-4 mr-3 text-muted-foreground" />
              Send friend request
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="hover:cursor-pointer" onClick={() => {}}>
          <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
