import mongoose from "mongoose";
import bcrypt from "bcryptjs"

interface token{
    owner:string;
    tokenKey:string;
}

interface tokenMethods{
    [value:string]:any
}

const tokenSchema = new mongoose.Schema<token,tokenMethods>({
    owner:{
        type:String,
        ref:'user'
    },
    tokenKey:{
        type:String
    }
})

tokenSchema.methods.compareToken =async function (token:string) {
    const isMatch =await bcrypt.compare(token,this.tokenKey)
    return isMatch
}


const otpToken = mongoose.model<token,tokenMethods>("token",tokenSchema)
export default otpToken