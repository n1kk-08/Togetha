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

export default function Home() {
  return (
    <>
    <main className="flex flex-col items-center gap-10 h-screen">
      <section className="text-center">
        <h1 className="text-2xl md:text-5xl lg:text-6xl font-extrabold font-sans">Let's get togetha</h1>
        <p className="text-gray-500 text-xl mt-1.5">Connecting... with our loved ones</p>
      </section>

      <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-lg"
    >
      <CarouselContent>
        {messages.map((message, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 text-center">
          <div className="p-1">
            <Card className="bg-gray-200 border-0">
              <CardHeader> {message.title}</CardHeader>
              <CardContent className="flex aspect-square items-center justify-center p-6 ">
                <span className="text-lg font-semibold">{message.content}</span>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>

    </main>
    <footer className="text-center bottom-0 bg-gray-200 p-4 md:p-5 lg:p-6">
        Togetha - ©2025 All rights reserved
    </footer>
    </>
  );
}