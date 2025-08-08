import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { getServerSession } from "next-auth";


export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  await dbConnect();

  const messageId = params.messageId;

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

  try {
    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updateResult.modifiedCount == 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        { status: 404 }
      );
    } else {
      return Response.json(
        {
          success: true,
          message: "Message deleted",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error in deleting message", error)
    return Response.json(
      {
        success: false,
        message: "Error while deleting message",
      },
      { status: 500 }
    );
  }
}
