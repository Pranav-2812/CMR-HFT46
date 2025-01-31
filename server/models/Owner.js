const mongoose = require("mongoose");
// const { use } = require("../routes/notes");
const ownerSchema = new mongoose.Schema({
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
    city:{
        type:String,
        reqiured:true
    },
    locations:{
        type:Number,
        default:0
        
    },
    ucc:{
        type:String
        
    },
    isAdmin:{
        type:Boolean,
        required:true,
        default:false
    }

})
const Owner = mongoose.model("owner",ownerSchema);
module.exports = Owner;