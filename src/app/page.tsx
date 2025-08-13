'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import messages from "./messages.json";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"


export default function Home() {

  const router = useRouter();

  let [username, setUsername] = useState("");
  const goToUser = () => {
    router.replace(`/u/${username}`)
  }

  const gotoChats = () => {
    router.replace("/chats")
  }
  return (
    <div className="w-full">

      <main className="flex flex-col items-center h-screen w-full">
        <div className="w-full gif px-20 lg:px-70 py-1 flex flex-col lg:gap-20">
          <section className="text-center text-white">
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-extrabold font-sans mt-3">Let's get togetha</h1>
            <p className="text-gray-500 text-sm mt-1.5 md:text-xl lg:text-xl">Connecting... with our loved ones</p>
          </section>

          <Carousel
            opts={{
              align: "start",
            }}
            className="m-5 md:m-1">
            <CarouselContent className="">
              {messages.map((message, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 text-center h-fit">
                  <div className="p-1">
                    <Card className="border-0 bg-white/15 backdrop-blur-sm text-white">
                      <CardHeader className="font-semibold"> {message.title}</CardHeader>
                      <CardContent className="flex items-center justify-center">
                        <span className="text-sm">{message.content}</span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

        </div>



          <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto mt-10 items-stretch justify-center gap-4">
            <div className="flex-1 flex flex-col gap-5 shadow-lg p-6 bg-white/15 backdrop-blur-sm justify-center items-center min-w-[250px]">
              <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
              <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/leerob.png" alt="@leerob" />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src="https://github.com/evilrabbit.png"
            alt="@evilrabbit"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
              </div>
              <Button onClick={gotoChats} className="w-full">Your Messages</Button>
            </div>

            <div className="flex-1 flex flex-col gap-5 shadow-lg p-6 bg-white/15 backdrop-blur-sm justify-center items-center min-w-[250px]">
              <h2 className="font-semibold">Chat💬 with your loved ones</h2>
              <Input
                type="text"
                value={username}
                placeholder="Enter the username"
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
              />
              <Button onClick={goToUser} className="w-full">Chat</Button>
            </div>
          </div>


      </main>
      <footer className="text-center bottom-0 bg-gray-200 p-4 md:p-5 lg:p-6">
        © Togetha - 2025 All rights reserved
      </footer>
    </div>
  );
}