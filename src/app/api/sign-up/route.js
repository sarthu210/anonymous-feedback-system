import bcrypt from "bcryptjs";
import dbConnector from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import mongoose from "mongoose";

export async function POST(req) {
  await dbConnector();

  try {
    const { username, email, password } = await req.json();
    const ExistingVerifyeidUserByUsername = await UserModel.findOne({
      username,
      isVerifyed: true,
    });

    if (ExistingVerifyeidUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already Taken",
        },
        {
          status: 400,
        }
      );
    }

    const ExistingUseramByEmail = await UserModel.findOne({ email });

    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (ExistingUseramByEmail) {
      if (ExistingUseramByEmail.isVerifyed) {
        return Response.json(
          {
            success: false,
            message: "Username is already exist with this email",
          },
          {
            status: 400,
          }
        );
      } else {
        const hashPassowrd = await bcrypt.hash(password, 10);
        ExistingUseramByEmail.password = hashPassowrd;
        ExistingUseramByEmail.verifyCode = verifyCode;
        ExistingUseramByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await ExistingUseramByEmail.save();
      }
    } else {
      const hashPassowrd = await bcrypt.hash(password, 10);
      const expiaryDate = new Date();
      expiaryDate.setHours(expiaryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashPassowrd,
        verifyCode,
        verifyCodeExpiry: expiaryDate,
        isVerifyed: false,
        isAcceptingMessage: true,
        messaage: [],
      });

      await newUser.save();
    }

    //send verification email

    const verificationEmailResposne = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    console.log(verificationEmailResposne);

    if (!verificationEmailResposne.success) {
      return Response.json(
        {
          success: false,
          message: verificationEmailResposne.message,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message:
          "User Successfuly Resgister successfuly. Please verify your account",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("Faild to sign-up", error);
    return Response.json(
      {
        success: true,
        message: "Failed to sign-up",
      },
      {
        status: 500,
      }
    );
  }
}
