import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {v4 as uuid} from 'uuid'

interface User {
    Idnumber:string
    name:string;
    age:number;
    gender:string;
    email:string;
    password:string;
    avatar?:string;
}


interface UserMethods{
  [value: string]: any
}

const userId=uuid().split('-')[0]
const userSchema = new mongoose.Schema<User,UserMethods>({
    Idnumber:{
    type:String,
    default:userId
    },
   name:{
    type:String,
    required:[true,"Please Provide this field"]
   },
   gender:{
    type:String,
    required:[true,"Please Provide this field"]
   },
   age:{
    type:Number,
    required:[true,"Please provide this field"]
   },
   email:{
    type:String,
    required:[true,"Please provide this field"]
   },
   password:{
    type:String,
    required:[true,"Please provide this field"]
   },
   avatar:{
    type:String,
   }
})

 userSchema.pre("save",async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
 })


userSchema.methods.createJWT = function () {
  return jwt.sign(
    { Idnumber: this.Idnumber, name: this.name},
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRY,
    }
  )
}


userSchema.methods.GenerateOTP = function (){
    let otp:string=""
    let i:number;
      for(i=0;i<=3;i++){
       let rand= Math.floor(Math.random()*9)
       otp+=rand
      }
      return otp
}


userSchema.methods.comparePassword = async function (password:string):Promise<Boolean>{
    const isMatch = await bcrypt.compare(password,this.password)
    return isMatch
}

 const user = mongoose.model<User,UserMethods>("userProfile",userSchema)
 export default user
