import mongoose from "mongoose"
import { requiredInfo } from "./utils";

const mongo_url:string=requiredInfo.MONGO_URL;

export async function ConnectDB(){
    if(!mongo_url){
        process.exit(1);
    }
    try{
        await mongoose.connect(mongo_url);
        console.log("Connected to DB");
    }catch(err){
        console.log(err);
    }
}