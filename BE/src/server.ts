import express from 'express';
require("dotenv").config();
import cors from 'cors';

import { userRouter } from './Routes/userRoute';
import { ConnectDB } from './config/db';
import { requiredInfo } from './config/utils';

const app=express();
const corsOptions={
    origin:"http://localhost:5173"
}

app.use(cors(corsOptions));
app.use(express.json());

//Routes
app.use('/api/v1/user',userRouter);


const port:number =parseInt(requiredInfo.PORT);
if(isNaN(port)){
    throw new Error('No port specified');    
}
async function main(){
    ConnectDB();
    app.listen(port,()=>{
        console.log(`Server is running on PORT ${port}`);
    })
}

main();