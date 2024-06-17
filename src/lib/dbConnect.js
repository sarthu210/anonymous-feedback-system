import mongoose from "mongoose"

let isConnected;

async function dbConnector(){
    if (isConnected) {
        console.log("Using Existing database Connection!");
        return;
    }

    try{
        await mongoose.connect(process.env.MONGODB_URI || '' , {});
        isConnected = true;
        console.log("Database is connected!")
    }
    catch(error){
        console.log("Faild to connect database!", error);
        process.exit(1);
    }
}

export default dbConnector;