import { UserModel } from "@/model/User";
import dbConnector from "@/lib/dbConnect";

export async function POST(request) {
  await dbConnector();

  try {
    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({
      username: decodedUsername,
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          messgae: "User Not Found",
        },
        {
          status: 500,
        }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpiar = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpiar) {
      user.isVerifyed = true;
      await user.save();

      return Response.json(
        {
          success: true,
          messgae: "Account Successfuly Verifyied",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpiar) {
      return Response.json(
        {
          success: false,
          messgae: "Code is expiared please signup again to get new code",
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          messgae: "Incorrect Verificatin Code",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error("Error Verifying Code", error);
    return Response.json(
      {
        success: false,
        messgae: "Error Verifying Code",
      },
      {
        status: 500,
      }
    );
  }
}
