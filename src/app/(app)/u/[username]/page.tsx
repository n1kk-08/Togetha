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
import { useEffect, useState } from "react";


export default function Page() {
  const params = useParams();
  const username = params.username;

  const [suggestedMessages, setSuggestedMessages] = useState<string[]>(["What's a hobby you've recently started?", "If you could have dinner with any historical figure, who would it be?", " What's a simple thing that makes you happy?", "What's an underrated place, food, or activity that you think more people should try?"]);

  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.post("/api/suggested-messages");
        const messages = String(data?.message || "")
          .split("||")
          .map((m) => m.trim())
          .filter(Boolean);
        console.log(messages)
        setSuggestedMessages(messages);
      } catch (err) {
        console.error("Failed to fetch suggested messages", err);
      }
    };
    fetchMessages()
  }, [])

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
      <div className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-neutral-100/60 via-white to-white dark:from-neutral-950/40 dark:via-neutral-900 dark:to-neutral-900" />
        <div className="mx-auto max-w-3xl px-4 pt-10 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
            Send an anonymous message to @{username}
          </h1>
          <p className="mt-2 text-sm md:text-base text-muted-foreground">
            Be kind, be curious. Your identity is not shared with the recipient.
          </p>
        </div>

        <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8 mt-6">
          <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white/70 p-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:border-neutral-800 dark:bg-neutral-900/60">
            <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br from-neutral-400/20 to-neutral-600/20 blur-2xl" />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(sendMessage)} className="flex flex-col sm:flex-row gap-3">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          className="h-14 w-full rounded-xl bg-white/80 px-5 text-base md:text-lg shadow-sm backdrop-blur placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-neutral-500 dark:bg-neutral-800"
                          placeholder="Type your message..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="h-14 rounded-xl bg-neutral-900 px-6 font-semibold text-white shadow-md transition hover:bg-black hover:shadow-lg active:scale-[0.99] dark:bg-neutral-800 dark:hover:bg-neutral-700"
                  type="submit"
                >
                  Send
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8 mt-6">
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">Try a prompt</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestedMessages.map((message, index) => (
            <button
              type="button"
              key={index}
              onClick={() => form.setValue("content", message)}
              className="group relative overflow-hidden rounded-full border border-transparent bg-white px-4 py-3 text-left text-sm md:text-base font-medium text-neutral-900 shadow-sm transition hover:scale-[1.01] hover:shadow-md hover:border-neutral-300 dark:bg-neutral-900 dark:text-neutral-100"
            >
              <span className="absolute inset-0 -z-10 bg-gradient-to-r from-neutral-200/40 via-neutral-300/40 to-neutral-200/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-neutral-700/10 dark:via-neutral-600/10 dark:to-neutral-700/10" />
              {message}
            </button>
          ))}
        </div>
      </div>
    </>
  )

}
