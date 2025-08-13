"use client";
import { useParams } from "next/navigation";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema } from "@/schemas/messageSchema";
import { useCompletion } from '@ai-sdk/react'

export default function page() {
  const params = useParams();
  const username = params.username;

  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const sendMessage = async (data: z.infer<typeof messageSchema>) => {
    try {
      const response = await axios.post(`/api/send-message`, {
        username,
        content: data.content,
      });

      form.reset();
      return Response.json(
        {
          success: true,
          message: response.data.message,
        },
        { status: 200 }
      );
    } catch (error) {
      toast("Error", { description: "Failed to send message to the user" });
      return Response.json(
        {
          success: false,
          message: "Failed to send message to the user",
        },
        { status: 501 }
      );
    }
  };

  return (
    <>
      <div className="text-center">
        <h1>Sending message to @{username}</h1>
        <div className="m-2 md:m-5 lg:mx-30 p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(sendMessage)}>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="p-10"
                        placeholder="Type your message"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="m-4" type="submit">
                Send
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <div>
      </div>
    </>
  );
}
