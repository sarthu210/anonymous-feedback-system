import dbConnector from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import bcrypt from "bcryptjs";

export async function POST(req){
    await dbConnector();

    try {
        const {username, email, password} = await req.json()

    } catch (error) {
        console.log("Faild to sign-up" , error);
        return Response.json({
            success: true,
            message: "Failed to sign-up"
        },
        {
            status: 500
        }
    )
    }
}