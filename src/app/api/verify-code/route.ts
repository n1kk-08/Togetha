import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { messageSchema } from "@/schemas/messageSchema";
import { success } from "zod";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const {username, code} = await request.json()
        const decodedUsername = decodeURIComponent(username)

        const user = await UserModel.findOne({username: decodedUsername})

        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            }, {status: 500})
        }

        const isUserValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
        if(isUserValid && isCodeNotExpired){
            user.isVerified = true
            await user.save()

            return Response.json({
                success: true,
                message: "Account Verified Successfully"
            }, {status: 200})
        }else if(!isCodeNotExpired){
            return Response.json({
                success: false,
                message: "Code Expired"
            }, {status: 400})
        }else{
            return Response.json({
                success: false,
                message: "Incorrect Verification Code"
            }, {status: 400})
        }

    } catch (error) {
        console.log("Error verifying user", error)
        return Response.json({
            success:false,
            message: "Error verifying user"
        }, {status: 500})
    }
}