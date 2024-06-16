import mongoose, {Schema} from "mongoose";

const MessageSchema = new Schema({
    content: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        require: true,
        default: Date.now
    }
})

const UserSchema = new Schema({
    username: {
        type: String,
        require: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        require: [true, "Email Id is required"],
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, "Please Vaild Email Address!"],
        unique: true
    },
    password: {
        type: String,
        require: [true, "Password is required"]
    },
    verifyCode: {
        type: String,
        require: [true, "Verify Code Is Required"]
    },
    verifyCodeExpiry: {
        type: Date,
        require: [true, "Expiry Code Is Required"]
    },
    isVerifyed: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: [String]
})

export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema)
export const MessageModel = mongoose.models.Message || mongoose.model("Message" , MessageSchema)