import mongoose,{Schema} from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
    },
    userName:{
        type:String,
        unique:true,
        required:true,
        trim:true,
    },
    role:{
        type:String,
        enum:["Admin","Driver","Owner"],
        default:"Driver",
    },
    otp:{
        type:String,

    },
    otpExpiry:{
        type:Date,
    },
},{
    timestamps:true,
});

const User = mongoose.model("User",userSchema);

export default User;