"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function Verify() {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "", 
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    console.log("verify Check1")
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast("Success", { description: response.data.message });
      router.replace(`/sign-in`);
    } catch (error) {
      console.error("Error verifying user", error);

      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;

      toast("Error verifying code", {
        description: errorMessage,
      });
    }
  };

  return (
    <div className="flex justify-center items-center flex-col m-30 ">
      <div className="justify-center items-center rounded-2xl shadow-lg w-vw p-10">
        <div>
          <h1 className="text-4xl text-center m-2 font-extrabold">
            Verify Your Account
          </h1>
          <p className="text-gray-500 text-center">
            Enter 6-digit verification code
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 m-5 flex flex-col items-center justify-center"
            >
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="6-digit verification code"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
