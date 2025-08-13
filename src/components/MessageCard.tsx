"use client";

import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";


type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
    toast(response.data.message);

    onMessageDelete(message._id as string)
  };




  return (
    <div>
      <Card className="flex flex-row justify-between items-center">
        <CardHeader>
          <CardTitle className="text-nowrap">{message.content}</CardTitle>
          
        </CardHeader>
        <CardContent>
          <p>{message.createdAt instanceof Date ? message.createdAt.toLocaleString() : new Date(message.createdAt).toLocaleString()}</p>
        </CardContent>
        <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-white text-red-500 border-2 border-red-500 w-fit hover:bg-red-100 mr-2">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Are you sure to completely delete this message
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
      </Card>
    </div>
  );
}

export default MessageCard;
