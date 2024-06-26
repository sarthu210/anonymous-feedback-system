import dbConnector from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { userNameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const UsernameQurySchema = z.object({
  username: userNameValidation,
});

export async function GET(request) {
  await dbConnector();

  try {
    const { searchParams } = new URL(request.url);

    const getUsernameFromParams = {
      username: searchParams.get("username"),
    };

    //Validation With Zod
    const result = UsernameQurySchema.safeParse(getUsernameFromParams);

    console.log(result);

    if (!result.success) {
      return Response.json(
        {
          success: false,
          messgae: "Invalid Query Parameter",
        },
        {
          status: 400,
        }
      );
    }

    const { username } = result.data;

    const existingUsernameWithisValid = await UserModel.findOne({
      username,
      isVerifyed: true,
    });

    if (existingUsernameWithisValid) {
      return Response.json(
        {
          success: false,
          messgae: "Username Is Already Taken",
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      {
        success: true,
        messgae: "Username Is Available",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error Checking Username", error);
    return Response.json(
      {
        success: false,
        messgae: "Error Checking Username",
      },
      {
        status: 500,
      }
    );
  }
}
