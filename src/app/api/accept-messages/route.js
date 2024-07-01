import { UserModel } from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/options";
import dbConnector from "@/lib/dbConnect";
import {User} from "next-auth"

export async function POST(request){
    await dbConnector();

    const session = await getServerSession(authOptions);

    const user = session?.user;

    if(!session || !session.user)
        {
            return Response.json(
                {
                    Success: false,
                    message: "User is not authenticated"
                },
                {
                    status: 401
                }
            )
        }

    const UserId = user._id;
    const {acceptMessages} = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            UserId,
            {
                isAcceptingMessage: acceptMessages
            },
            {
                new: true
            }
        )

        if(!updatedUser){
            return Response.json(
                {
                    Success: true,
                    message: "User Succesfuly Updated!",
                    updatedUser
                },
                {
                    status: 200
                }
            )
        }

        return Response.json(
            {
                Success: false,
                message: "Faild to update user status to accept message"
            },
            {
                status: 401
            }
        )
        
    } catch (error) {
        console.log("Faild update user status to accept messages");

        return Response.json(
            {
                Success: false,
                message: "Faild to update user status"
            },
            {
                status: 500
            }
        )
    }

}

export async function GET(request){
    await dbConnector();

    const session = await getServerSession(authOptions);

    const user = session?.user;

    if(!session || !session.user)
        {
            return Response.json(
                {
                    Success: false,
                    message: "User is not authenticated"
                },
                {
                    status: 401
                }
            )
        }

    const UserId = user._id;
    const foundUser = await UserModel.findOne(UserId);

    try {
        if(!foundUser){
            return Response.json(
                {
                    Success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
        }
    
        return Response.json(
            {
                Success: true,
                isAcceptingMessage: foundUser.isAcceptingMessage
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Error in getting user message accepting status");

        return Response.json(
            {
                Success: false,
                message: "Faild to update user status"
            },
            {
                status: 500
            }
        )
    }
}