import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";


export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    console.log("Signup request body:", body);
    
    const { username, email, password } = body;
    
    // Validate required fields
    if (!username || !email || !password) {
      console.log("Missing required fields:", { username: !!username, email: !!email, password: !!password });
      return Response.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Checking for existing verified user with username:", username);
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      console.log("Username already taken by verified user:", username);
      return Response.json(
        { success: false, message: "Username already taken" },
        { status: 400 }
      );
    }
    console.log("Checking for existing user with email:", email);
    const existingUserByEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated verification code:", verifyCode);
    // const verifyCode : string = "000000";

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "User already exists" },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      { success: false, message: "Error registering user" },
      { status: 500 }
    );
  }
}
