import * as dotenv from 'dotenv';
dotenv.config();
import express,{Request,Response} from "express";
import {connection} from "./db/connection";
import cookieParser from 'cookie-parser';
import './config'



const app = express()
const port = 5000 || process.env.PORT



app.use(express.json())
app.use(cookieParser())
app.get("/",(req:Request,res:Response)=>{
   res.send("hello world")
})












app.listen(port,()=>{
    console.log("server running");  
})
console.log(process.env.MONGO_URI)
console.log(process.env.JWT_SECRET)
//connection(process.env.MONGO_URI)