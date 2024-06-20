import NextAuth from "next-auth/next";
import { authOptions } from "./options";

const handeler = NextAuth(authOptions);

export {handeler as GET, handeler as POST}