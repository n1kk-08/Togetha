import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

export async function DELETE(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "User not Authenticated",
      },
      { status: 401 }
    );
  }

  
}
