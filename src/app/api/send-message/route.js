import { MessageModel } from "@/model/User";
import dbConnector from "@/lib/dbConnect";
import { UserModel } from "@/model/User";

export async function POST(request) {
    await dbConnector();

    const { username, content } = new request.json();

    try {
        const user = UserModel.findOne(username);

        if (!user) {
            return Response.json(
                {
                    Success: false,
                    message: "User Not Found",
                },
                {
                    status: 401,
                }
            );
        }

        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    Success: false,
                    message: "User No Longer Accepting Messages",
                },
                {
                    status: 401,
                }
            );
        }

        const newMessages = { content, createdAt: new Date() };

        user.messages.push(newMessages);
        await user.save();

        return Response.json(
            {
                Success: true,
                message: "Message Send Successfuly",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("An unexpected error occurred in send-message:", error);

        return Response.json(
            {
                message: "Internal server error",
                success: false,
            },
            {
                status: 500,
            }
        );
    }
}
