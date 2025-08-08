import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User not Authenticated",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(session.user._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      // { $unwind: "$messages" },
      { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true }  },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    
    console.log("Aggregate result:", user);

    if (!user) {
      // console.log("Yay this is the error")
      return Response.json(
        {
          success: false,
          message: "User not found here",
        },
        { status: 404 }
      );
    } else {
      return Response.json(
        {
          success: true,
          message: user[0].messages,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("An unexpected error occured", error);
    return Response.json(
      {
        success: false,
        message: "An unexpected error occured",
      },
      { status: 500 }
    );
  }
}
