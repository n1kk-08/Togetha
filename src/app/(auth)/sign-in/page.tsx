"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
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
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function page() {

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signInSchema),

    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {


    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error == "CredentialsSignIn") {
        toast("Login Failed", { description: "Incorrect Email or Password" });
      } else {
        toast("Error", { description: result.error });
      }
    }
    if (result?.url) {
      toast("Login Successful");
      router.replace("/dashboard");
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

        <h2 className="text-center text-gray-500">Sign In To Continue</h2>
        <div className="flex justify-center items-center w-full m-5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col items-center justify-center"
            >
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem className="w-100 m-4">
                    <FormLabel>Email/Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email or username" {...field} />
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
                className="m-4 flex items-center justify-center"
              >
                SignIn
              </Button>
            </form>
          </Form>
        </div>
          <div className="flex justify-center items-center gap-2">
            <p>Don't have an account?</p>
            <Link href="/sign-up" className="text-blue-900">Sign Up</Link>
          </div>
      </div>
    </div>
  );
}
