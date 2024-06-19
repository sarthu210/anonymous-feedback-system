import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(email,username,verifycode){
    try{
        const res = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification Code',
            react: VerificationEmail({username, otp: verifycode}),
          });
          console.log(res)
          return {success:true, message:"Email successfuly send"}

        
    }
    catch(error){
        console.log("Falied to send verification email!");
        return {success: false, message: "Faild to send email"}
    }
}