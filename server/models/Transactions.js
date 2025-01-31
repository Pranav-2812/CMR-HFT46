const mongoose = require("mongoose");
const transSchema = new mongoose.Schema({
    name:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    Mob_No:{
        type:Number,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    slot_no:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    charges:{
        type:Number,
        required:true
    },
    vehicle_type:{
        type:String,
        required:true
    },
    vehicle_number:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    date:{
        type :Date,
        required:true,
        timestamps:{createdAt:"created_at"}
    }

})
const transactions = mongoose.model("Transactions",transSchema);
module.exports = transactions