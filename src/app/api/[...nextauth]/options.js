import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bycrpt from "bcryptjs";
import dbConnector from "@/lib/dbConnect";
import { UserModel } from "@/model/User";


export async function authOptions() {
    return {
        providers: [
            CredentialsProvider({
                id: "credential",
                name: "Credential",
                credentials: {
                    username: { label: "Email", type: "text" },
                    password: { label: "Password", type: "password" },
                },
                async authorize(credentials) {
                    await dbConnector();
                    try {
                        const user = await UserModel.findOne({
                            $or: [
                                { email: credentials.identifier },
                                { username: credentials.identifier },
                            ],
                        });

                        if (!user) {
                            throw new Error("User not found");
                        }

                        if (!user.isVerifyed) {
                            throw new Error("Plsease Verify Your Self Before Login");
                        }

                        const isPasswordMatch = await bycrpt.compare(
                            credentials.password,
                            user.password
                        );

                        if (isPasswordMatch) {
                            return user;
                        } else {
                            throw new Error("Incorrect Passowrd!");
                        }
                    } catch (error) {
                        throw new Error(error);
                    }
                }
            }),
        ],
        callbacks: {
            async jwt({ token, user }) {
                if(user){
                    token._id = user.id.toString(),
                    token.username = user.username,
                    token.isVerifyed = user.isVerifyed,
                    token.isAcceptingMessage = user.isAcceptingMessage
                }
                return token
            },
            async session({ session, token }) {
                if(token){
                    session._id = token.id,
                    session.username = token.username,
                    session.isVerifyed = token.isVerifyed,
                    session.isAcceptingMessage = token.isAcceptingMessage
                }
                return session
            },

        },
        pages: {
            signIn: '/sign-in'
        },
        session: {
            strategy: "jwt"
        }
    }

}
