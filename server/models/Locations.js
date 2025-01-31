const { Decimal128 } = require("mongodb");
const mongoose = require("mongoose");
const locationSchema = new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"owner"
    },
    city:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true

    },
    latitude:{
        type:Decimal128,
        required:true
    },
    longitude:{
        type:Decimal128,
        required:true
    },
    parking_type:{
        type:String,
        required:true
    },
    location_type:{
        type:String,
        required:true
    },
    isPaid:{
        type:Boolean,
        required:true
    },
    car_slots:{
        type:Number,
        
        default:0
    },
    floors:{
        type:Number,
        required:true,
        default:0
    },
    bike_slots:{
        type:Number,
        
        default:0
    }
})
const loaction = mongoose.model("location",locationSchema);
module.exports = loaction;