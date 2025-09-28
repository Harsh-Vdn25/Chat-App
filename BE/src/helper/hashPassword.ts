import bcrypt from 'bcrypt';
import { requiredInfo } from '../config/utils';

export async function  hashPassword(password:string){
    const salt=parseInt(requiredInfo.SALT_ROUNDS);
    const hashedPassword:string=await bcrypt.hash(password,salt);
    console.log(hashedPassword)
    return hashedPassword;   
}

