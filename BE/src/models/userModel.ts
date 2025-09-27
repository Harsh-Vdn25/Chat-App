import mongoose,{Schema,model} from "mongoose";

export interface userType{
    _id:Schema.Types.ObjectId;
    username:string;
    password:string;
}



const UserSchema=new Schema<userType>({
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true}
})

export const userModel=mongoose.model('user',UserSchema);

export const getUserByName=async(username:string)=>{
    try{
        const reponse=await userModel.findOne<userType>({username});
        if(reponse){
            return true;
        }
        return false;
    }catch(err){
        console.error(err);
    }
}