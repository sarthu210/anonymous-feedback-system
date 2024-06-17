import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(email,username,verifycode){
    try{
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Verification Code',
            react: VerificationEmail(username,verifycode),
          });
          return {success:true, message:"Email successfuly send"}
    }
    catch(error){
        console.log("Falied to send verification email!");
        return {success: false, message: "Faild to send email"}
    }
}