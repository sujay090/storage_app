import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
        minLength:[3,'Name at a least 3 character']
    },
    email:{
        type:String,
        required:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[a-zA-Z]{2,}$/,"Invalid Email"]
    },
    password:{
        type:String,
        required:true,
        minLength:[3,'minimum length 3']
    },
    rootDirId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"Directory"
    }
    
},{strict:"throw"})

const UserSchema = model("User",userSchema)
export default UserSchema