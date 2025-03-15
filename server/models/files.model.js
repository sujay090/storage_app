import { model, Schema } from "mongoose";


const fileSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    extension:{
        type:String,
        required:true
    },
    parentDirId:{
        type:Schema.Types.ObjectId,
        ref:"Directory"
    }, 
    userId:{
        type:Schema.Types.ObjectId,
        required:true
    }
    
},{strict:'throw'})


const FileSchema = model("Files",fileSchema)
export default FileSchema