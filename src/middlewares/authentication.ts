import { Response,Request,NextFunction } from "express";
import StatusCodes from 'http-status-codes'
import jwt from 'jsonwebtoken'



const verfiyUser = (req:Request,res:Response,next:NextFunction) =>{
    const {token} = req.cookies
    if(!token){
        return res.status(StatusCodes.BAD_REQUEST).json({
            msg:"Please log into your account"
        })
    }
    const payload = jwt.verify(token,process.env.JWT_SECRET) as {Idnumber:string,name:string}
     req.user = {Idnumber:payload.Idnumber,name:payload.name}
    next()
}

export {
    verfiyUser
}