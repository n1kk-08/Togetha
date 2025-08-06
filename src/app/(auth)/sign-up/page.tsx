"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function page() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 500);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    //optional
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsername = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;

          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsername();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);

    try {

      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast("Success", {
        description: response.data.message,
      });

      router.replace(`verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      const axiosError = error as AxiosError<ApiResponse>;

      let errorMessage = axiosError.response?.data.message;

      toast("Signup Failed", { description: errorMessage });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col m-30 ">
      <div className="justify-center items-center rounded-2xl shadow-lg w-vw p-10">
        <link
          href="https://fonts.googleapis.com/css2?family=Delius+Unicase&display=swap"
          rel="stylesheet"
        />
        <h1
          className="text-6xl text-center m-2 font-extrabold"
          style={{ fontFamily: "'Delius Unicase'" }}
        >
          Togetha
        </h1>

        <h2 className="text-center text-gray-500">Create new account</h2>
        <div className="flex justify-center items-center w-full m-5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col items-center justify-center"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="w-100 m-4">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          debounced(e.target.value);
                        }}
                      />
                    </FormControl>
                    {isCheckingUsername ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      ""
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-100 m-4">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-100 m-4">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter password"
                        type="password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="m-4 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Signup"
                )}
              </Button>
            </form>
          </Form>

        </div>
          {/* If already a user sign-in */}
        <div className="flex justify-center items-center gap-2">
            <p>Already a user?</p>
            <Link href="/sign-in" className="text-blue-900">Sign In</Link>
          </div>
      </div>
    </div>
  );
}
