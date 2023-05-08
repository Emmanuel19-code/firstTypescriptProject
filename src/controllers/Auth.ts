import { Request,Response } from "express";
import user from "../models/userSchema"
import otpToken from "../models/tokenSchema";
import StatusCodes from "http-status-codes"
import { sendOneTimePassword } from "../utils/MailNotification";



 const createAccount = async (req:Request,res:Response)=>{
    const {name,age,email,password,gender} = req.body
    if(!name || !age || !email || !password || !gender){
        return res.status(StatusCodes.BAD_REQUEST).json({
            msg:"Please provide the empty field",
            input:req.body
        })
    }
    const isEmail = await user.findOne({email})
    if(isEmail){
         return res.status(StatusCodes.CONFLICT).json({
            msg:"A user already exist "
         })
    }
    const createUser = await user.create(req.body)
    if(!createUser){
        return res.json({
            msg:"Please try again creating your account again",
            input:req.body
        })
    }
    const OTP = await createUser.GenerateOTP();
    if(!OTP){
         return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
             msg:"otp could not be created please request a new one"
         })
    }
    const storeOTP = await otpToken.create({
        owner:createUser.Idnumber,
        tokenKey:OTP
    })
    const token = await createUser.createJWT();
    req.cookies('token',token)
    sendOneTimePassword({
        name:createUser.name,
        email:createUser.email,
        verificationToken:OTP,
        title:"Verification Token"
    })
    res.status(StatusCodes.CREATED).json({
        msg:"User has been created",
        msg2:"Please check your email for your otp for verification",
        otp:OTP
    })
}


 const verifyAccount = async (req:Request,res:Response) =>{
    const {otpvalue} = req.body;
    const Idnumber = req.user.Idnumber
    if(!otpvalue){
        return res.status(StatusCodes.BAD_REQUEST).json({
            msg:"Field cannot be empty"
        })
    }
   const findOtp = await otpToken.findOne({Idnumber})
   if(!findOtp){
    res.status(StatusCodes.NOT_FOUND).json({
        msg:"Please request an OTP to verify your account"
    })
   }
   const sameOTP = await findOtp.compareToken(otpvalue)
   if(!sameOTP){
     res.status(StatusCodes.UNAUTHORIZED).json({
        msg:"otp value incorrect"
     })
   }
   req.cookies('token','')
   res.status(StatusCodes.OK).json({
    msg:"You have been verified"
   })
}

const loginUser = async (req:Request,res:Response) =>{
   const {username,password} = req.body
   const profile = await user.findOne({username})
   if(!profile){
     return res.status(StatusCodes.NOT_FOUND).json({
        msg:"Please this user does not exit"
     })
   }
   const  isMatch = await profile.comparePassword(password)
   if(!isMatch){
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg:"Password incorrect"
      })
   }
   const token = await profile.createJWT()
   req.cookies('login',token)
   res.status(StatusCodes.OK)
}


const forgotPassword = async (req:Request,res:Response) =>{
    const {username} = req.body;
    if(!username){
        return res.status(StatusCodes.BAD_REQUEST).json({
            msg:"field cannot be empty"
        })
    }
    const profile = await user.findOne({username})
    if(!profile){
        return res.status(StatusCodes.NOT_FOUND).json({
            msg:"User cannot be found"
        })
    }
   const token = await profile.createJWT();
   req.cookies('token',token)
   res.status(StatusCodes.OK).json() 
}


const changePassword = async (req:Request,res:Response) =>{
    const {newpassword} = req.body;
    const Idnumber = req.user.Idnumber
    if(!newpassword){
        return res.status(StatusCodes.BAD_REQUEST).json({
            msg:"field cannot be empty"
        })
    }
    const profile = await user.findOne({Idnumber});
    profile.password = newpassword
    profile.save();
}

const logOut = async (req:Request,res:Response) =>{
     req.cookies('login',"")
     res.status(StatusCodes.OK).json({
        msg:"You have been logged out"
     })
}

export {
    createAccount,
    verifyAccount,
    loginUser,
    forgotPassword,
    changePassword,
    logOut
}