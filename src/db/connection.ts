import mongoose from "mongoose";


export const connection = (uri:string)=>{
    try {
         mongoose.connect(uri)
        console.log("You have been connected to the database");
    } catch (error) {
        console.log("an error occured not connected");
        
    }
}

