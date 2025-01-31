const mongoose = require("mongoose");
// const { use } = require("../routes/notes");
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        reqiured:true
    },
    email:{
        type:String,
        reqiured:true,
        unique:true
    },
    password:{
        type: String,
        reqiured:true,
        unique:true
    },
    Mob_no:{
        type:Number,
        required:true,
        unique:true
    },
    vehicle_number:{
        type:String,
        reqiured:true,
        unique:true
    },
    vehicle_type:{
        type:String,
        reqiured:true
    },
    city:{
        type:String,
        required:true
    },
    vehicles:{
        type:Number,
        required:true,
        default:1
    }


})
const Users = mongoose.model("user",userSchema);
module.exports = Users;